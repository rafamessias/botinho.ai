import { randomUUID } from "node:crypto"
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

    return session
  }

  async connectSession(sessionId: string, companyId: string): Promise<WhatsAppSession> {
    const session = await this.requireCompanySession(sessionId, companyId)
    const workerUrl = await this.workerUrlForSession(sessionId)

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
    const workerUrl = await this.workerUrlForSession(sessionId).catch(() => null)

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
    const sessionId = await this.resolveSessionId(params.sessionId, params.phoneNumber, params.companyId)
    const workerUrl = await this.workerUrlForSession(sessionId)
    const message = await this.workerClient.sendMessage(workerUrl, sessionId, {
      to: params.to,
      text: params.text,
    })

    await this.repository.saveMessage({
      ...message,
      companyId: params.companyId,
    })

    return message
  }

  buildInboundWebhookUrl(companyId: string): string {
    const url = new URL("/api/webhooks/whatsapp/inbound", this.config.appUrl)
    url.searchParams.set("companyId", companyId)
    url.searchParams.set("token", this.config.webhookSecret)
    return url.toString()
  }

  private async enrichAndPersist(session: WhatsAppSession): Promise<WhatsAppSession> {
    const workerUrl = await this.workerUrlForSession(session.sessionId).catch(() => null)
    if (!workerUrl) return session

    const live = await this.workerClient.sessionStatus(workerUrl, session.sessionId).catch(() => null)
    if (!live) return session

    const phoneNumber = live.phoneNumber ?? session.phoneNumber
    const status = live.status ?? session.status
    const shouldAutoLabel = !session.label && status === "connected" && Boolean(phoneNumber)
    const label = session.label ?? (shouldAutoLabel ? buildSessionLabel(phoneNumber!, session.createdAt) : undefined)

    const changed =
      session.status !== status ||
      session.phoneNumber !== phoneNumber ||
      session.qrCode !== live.qrCode ||
      session.qrImage !== live.qrImage ||
      session.label !== label

    const enriched: WhatsAppSession = {
      ...session,
      status,
      qrCode: live.qrCode ?? session.qrCode,
      qrImage: live.qrImage ?? session.qrImage,
      expiresAt: live.expiresAt ?? session.expiresAt,
      phoneNumber,
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
}
