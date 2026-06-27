import { randomUUID } from "node:crypto"
import { normalizeStoredPhone } from "@/lib/phone-utils"
import type { WhatsAppConfig } from "@/lib/whatsapp/config"
import type { WhatsAppRegistry } from "@/lib/whatsapp/registry"
import { WhatsAppScaler } from "@/lib/whatsapp/scaler"
import { WhatsAppSessionRepository } from "@/lib/whatsapp/session-repository"
import type { SendMessageRequest, WhatsAppMessage, WhatsAppSession } from "@/lib/whatsapp/types"
import { WhatsAppWorkerClient } from "@/lib/whatsapp/worker-client"
import { buildSessionLabel } from "@/lib/whatsapp/session-label"

export class WhatsAppOrchestrator {
  constructor(
    private readonly registry: WhatsAppRegistry,
    private readonly repository: WhatsAppSessionRepository,
    private readonly scaler: WhatsAppScaler,
    private readonly workerClient: WhatsAppWorkerClient,
    private readonly config: WhatsAppConfig,
  ) {}

  async createSession(params: {
    companyId: string
    label?: string
    webhookUrl?: string
  }): Promise<WhatsAppSession> {
    const worker = await this.ensureWorker()
    const sessionId = `sess_${randomUUID()}`
    const now = new Date().toISOString()

    const session: WhatsAppSession = {
      sessionId,
      companyId: params.companyId,
      workerId: worker.workerId,
      status: "pending",
      createdAt: now,
      updatedAt: now,
      ...(params.label ? { label: params.label } : {}),
      ...(params.webhookUrl ? { webhookUrl: params.webhookUrl } : {}),
    }

    await this.repository.createSession(session)
    await this.registry.assignSession(sessionId, worker.workerId)
    await this.workerClient.startSession(worker.url, sessionId)

    return this.syncSessionWebhookUrl(session)
  }

  async connectSession(sessionId: string, companyId: string): Promise<WhatsAppSession> {
    const session = await this.requireCompanySession(sessionId, companyId)
    const workerUrl = await this.resolveWorkerUrlForSession(sessionId, session)

    await this.workerClient.connectSession(workerUrl, sessionId)

    const updated: WhatsAppSession = {
      ...session,
      status: "qr_pending",
      updatedAt: new Date().toISOString(),
    }
    await this.repository.updateSession(updated)
    return updated
  }

  async updateSessionLabel(
    sessionId: string,
    companyId: string,
    label: string,
  ): Promise<WhatsAppSession> {
    await this.requireCompanySession(sessionId, companyId)
    await this.repository.patchSessionLabel(sessionId, label.trim())

    const session = await this.repository.getSession(sessionId)
    if (!session) {
      throw new Error("session not found")
    }

    return session
  }

  async deleteSession(sessionId: string, companyId: string): Promise<void> {
    const session = await this.requireCompanySession(sessionId, companyId)
    const workerUrl = await this.resolveWorkerUrlForSession(sessionId, session).catch(() => null)

    if (workerUrl) {
      await this.workerClient.stopSession(workerUrl, sessionId).catch(() => undefined)
    }

    if (session.phoneNumber) {
      await this.repository.deletePhoneIndex(session.phoneNumber).catch(() => undefined)
    }

    await this.registry.removeSession(sessionId)
    await this.repository.deleteSession(sessionId)
  }

  async getSession(sessionId: string, companyId: string): Promise<WhatsAppSession> {
    const session = await this.requireCompanySession(sessionId, companyId)
    return this.enrichAndPersist(session)
  }

  async listSessions(companyId: string): Promise<WhatsAppSession[]> {
    const sessions = await this.repository.listSessionsByCompany(companyId)
    const enriched = await Promise.all(sessions.map((session) => this.enrichAndPersist(session)))
    return enriched
  }

  async getQrCode(sessionId: string, companyId: string): Promise<WhatsAppSession> {
    const session = await this.getSession(sessionId, companyId)
    if (session.status === "connected") {
      return session
    }
    if (!session.qrImage) {
      throw new Error("qr not available yet")
    }
    return session
  }

  async sendMessage(params: SendMessageRequest & { companyId: string }): Promise<WhatsAppMessage> {
    const normalizedTo = normalizeStoredPhone(params.to)
    if (!normalizedTo) {
      throw new Error("Invalid recipient phone number")
    }

    const sessionId = await this.resolveSessionId(params.sessionId, params.phoneNumber, params.companyId)
    const session = await this.repository.getSession(sessionId)
    const workerUrl = await this.resolveWorkerUrlForSession(sessionId, session)
    await this.ensureSessionOnWorker(sessionId, workerUrl)
    const message = await this.workerClient.sendMessage(workerUrl, sessionId, {
      to: normalizedTo,
      text: params.text,
    })

    return message
  }

  buildInboundWebhookUrl(companyId: string): string {
    const url = new URL("/api/webhooks/whatsapp/inbound", this.config.webhookAppUrl)
    url.searchParams.set("companyId", companyId)
    url.searchParams.set("token", this.config.webhookSecret)
    return url.toString()
  }

  private async syncSessionWebhookUrl(session: WhatsAppSession): Promise<WhatsAppSession> {
    const expectedWebhookUrl = this.buildInboundWebhookUrl(session.companyId)
    if (session.webhookUrl === expectedWebhookUrl) {
      return session
    }

    const updated: WhatsAppSession = {
      ...session,
      webhookUrl: expectedWebhookUrl,
      updatedAt: new Date().toISOString(),
    }
    await this.repository.updateSession(updated)
    return updated
  }

  private async enrichAndPersist(session: WhatsAppSession): Promise<WhatsAppSession> {
    const workerUrl = await this.resolveWorkerUrlForSession(session.sessionId, session).catch(() => null)
    if (!workerUrl) return session

    let live = await this.workerClient.sessionStatus(workerUrl, session.sessionId).catch(() => null)
    if (!live && (session.status === "connected" || session.phoneNumber)) {
      await this.ensureSessionOnWorker(session.sessionId, workerUrl).catch((error) => {
        console.error("[whatsapp] failed to rehydrate session on worker:", {
          sessionId: session.sessionId,
          error: error instanceof Error ? error.message : error,
        })
      })
      live = await this.workerClient.sessionStatus(workerUrl, session.sessionId).catch(() => null)
    }
    if (!live) return session

    const phoneNumber = live.phoneNumber ?? session.phoneNumber
    const status = live.status ?? session.status
    const shouldAutoLabel = !session.label && status === "connected" && Boolean(phoneNumber)
    const label = session.label ?? (shouldAutoLabel ? buildSessionLabel(phoneNumber!, session.createdAt) : undefined)

    const expectedWebhookUrl = this.buildInboundWebhookUrl(session.companyId)
    const changed =
      session.status !== status ||
      session.phoneNumber !== phoneNumber ||
      session.qrCode !== live.qrCode ||
      session.qrImage !== live.qrImage ||
      session.label !== label ||
      session.webhookUrl !== expectedWebhookUrl

    const enriched: WhatsAppSession = {
      ...session,
      status,
      qrCode: live.qrCode ?? session.qrCode,
      qrImage: live.qrImage ?? session.qrImage,
      expiresAt: live.expiresAt ?? session.expiresAt,
      phoneNumber,
      webhookUrl: expectedWebhookUrl,
      ...(label ? { label } : {}),
      updatedAt: new Date().toISOString(),
    }

    if (changed) {
      await this.repository.updateSession(enriched)
      if (enriched.phoneNumber) {
        await this.repository.setPhoneIndex(enriched.phoneNumber, enriched.sessionId)
        await this.registry.setPhoneIndex(enriched.phoneNumber, enriched.sessionId)
      }
    }

    return enriched
  }

  private async resolveSessionId(
    sessionId: string | undefined,
    phoneNumber: string | undefined,
    companyId: string,
  ): Promise<string> {
    if (sessionId) {
      await this.requireCompanySession(sessionId, companyId)
      return sessionId
    }

    if (!phoneNumber) {
      throw new Error("sessionId or phoneNumber is required")
    }

    const fromRepo = await this.repository.getSessionByPhone(phoneNumber)
    const resolved = fromRepo ?? (await this.registry.getSessionByPhone(phoneNumber))
    if (!resolved) {
      throw new Error("session not found for phone number")
    }

    await this.requireCompanySession(resolved, companyId)
    return resolved
  }

  private async requireCompanySession(sessionId: string, companyId: string): Promise<WhatsAppSession> {
    const session = await this.repository.getSession(sessionId)
    if (!session || session.companyId !== companyId) {
      throw new Error("session not found")
    }
    return session
  }

  private async resolveWorkerUrlForSession(
    sessionId: string,
    sessionHint?: WhatsAppSession | null,
  ): Promise<string> {
    const existingUrl = await this.workerUrlForSession(sessionId).catch(() => null)
    if (existingUrl) {
      return existingUrl
    }

    const session = sessionHint ?? (await this.repository.getSession(sessionId))

    if (session?.workerId) {
      const worker = await this.registry.getWorker(session.workerId)
      if (worker) {
        await this.registry.assignSession(sessionId, worker.workerId)
        return worker.url
      }
    }

    const available = await this.registry.getAvailableWorker()
    if (!available) {
      throw new Error("No WhatsApp worker is available")
    }

    await this.registry.assignSession(sessionId, available.workerId)
    if (session) {
      await this.repository.updateSession({
        ...session,
        workerId: available.workerId,
        updatedAt: new Date().toISOString(),
      })
    }

    return available.url
  }

  private async workerUrlForSession(sessionId: string): Promise<string> {
    const workerId = await this.registry.getWorkerForSession(sessionId)
    if (!workerId) {
      throw new Error("worker not assigned to session")
    }
    const worker = await this.registry.getWorker(workerId)
    if (!worker) {
      throw new Error("worker not found")
    }
    return worker.url
  }

  private async ensureWorker() {
    const available = await this.registry.getAvailableWorker()
    if (available) {
      return available
    }

    const scaled = await this.scaler.scaleUp()
    return {
      workerId: scaled.workerId,
      url: scaled.url,
      capacity: this.config.maxSessionsPerWorker,
      currentSessions: 0,
      lastHeartbeat: Date.now(),
      status: "idle",
    }
  }

  private async ensureSessionOnWorker(sessionId: string, workerUrl: string): Promise<void> {
    const live = await this.workerClient.sessionStatus(workerUrl, sessionId).catch(() => null)
    if (!live) {
      await this.workerClient.startSession(workerUrl, sessionId)
      await this.workerClient.connectSession(workerUrl, sessionId)
      return
    }

    if (live.status !== "connected") {
      await this.workerClient.connectSession(workerUrl, sessionId)
    }
  }
}
