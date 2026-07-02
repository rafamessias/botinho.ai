import { randomUUID } from "node:crypto"
import { normalizeStoredPhone } from "@/lib/phone-utils"
import type { WhatsAppConfig } from "@/lib/whatsapp/config"
import type { WhatsAppRegistry } from "@/lib/whatsapp/registry"
import { WhatsAppScaler } from "@/lib/whatsapp/scaler"
import { WhatsAppSessionRepository } from "@/lib/whatsapp/session-repository"
import type { SendMessageRequest, WhatsAppMessage, WhatsAppSession } from "@/lib/whatsapp/types"
import { WhatsAppWorkerClient } from "@/lib/whatsapp/worker-client"
import { buildSessionLabel } from "@/lib/whatsapp/session-label"
import {
  pickConnectedSessionTarget,
  rebindConversationsFromSession,
  repairStaleConversationSessions,
} from "@/lib/whatsapp/conversation-session-rebind"

export class WhatsAppOrchestrator {
  private readonly verifiedWorkerUrls = new Set<string>()

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
    const existing = await this.repository.listSessionsByCompany(params.companyId)
    const pairingInProgress = existing.find((session) =>
      ["pending", "qr_pending", "needs_qr"].includes(session.status),
    )
    if (pairingInProgress) {
      throw new Error("A WhatsApp pairing is already in progress. Finish or cancel it before adding another session.")
    }

    const worker = await this.ensureWorker()
    await this.requireHealthyWorker(worker.url)
    const sessionId = `sess_${randomUUID()}`
    const now = new Date().toISOString()

    const session: WhatsAppSession = {
      sessionId,
      companyId: params.companyId,
      workerId: worker.workerId,
      status: "pending",
      acceptGroupMessages: false,
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
    await this.requireHealthyWorker(workerUrl)

    await this.workerClient.connectSession(workerUrl, sessionId)

    return this.enrichAndPersist(await this.requireCompanySession(sessionId, companyId))
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

  async updateSessionAcceptGroupMessages(
    sessionId: string,
    companyId: string,
    acceptGroupMessages: boolean,
  ): Promise<WhatsAppSession> {
    await this.requireCompanySession(sessionId, companyId)
    await this.repository.patchSessionAcceptGroupMessages(sessionId, acceptGroupMessages)

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
      try {
        await this.workerClient.stopSession(workerUrl, sessionId)
      } catch (error) {
        console.error("[whatsapp] failed to stop worker session:", {
          sessionId,
          error: error instanceof Error ? error.message : error,
        })
      }
    } else {
      console.warn("[whatsapp] worker URL unavailable while deleting session:", { sessionId })
    }

    if (session.phoneNumber) {
      await this.repository.deletePhoneIndex(session.phoneNumber).catch(() => undefined)
    }

    await this.registry.removeSession(sessionId)
    await this.repository.deleteSession(sessionId)

    const remainingSessions = await this.repository.listSessionsByCompany(companyId)
    const replacementSessionId = pickConnectedSessionTarget(remainingSessions)
    const rebindResult = await rebindConversationsFromSession({
      companyId,
      fromSessionId: sessionId,
      targetSessionId: replacementSessionId,
    }).catch((error) => {
      console.error("[whatsapp] failed to rebind conversations after session delete:", {
        companyId,
        sessionId,
        error: error instanceof Error ? error.message : error,
      })
      return null
    })

    if (rebindResult && (rebindResult.updated > 0 || rebindResult.cleared > 0)) {
      console.info("[whatsapp] rebound conversations after session delete:", {
        companyId,
        sessionId,
        replacementSessionId,
        ...rebindResult,
      })
    }
  }

  async getSession(sessionId: string, companyId: string): Promise<WhatsAppSession> {
    const session = await this.requireCompanySession(sessionId, companyId)
    return this.enrichAndPersist(session)
  }

  async listSessions(companyId: string, options?: { syncLive?: boolean }): Promise<WhatsAppSession[]> {
    const sessions = await this.repository.listSessionsByCompany(companyId)
    const syncLive = options?.syncLive ?? true

    const enriched = await Promise.all(
      sessions.map((session) => {
        if (!syncLive && this.isStableConnectedSession(session)) {
          return session
        }
        return this.enrichAndPersist(session)
      }),
    )
    return enriched
  }

  async getQrCode(sessionId: string, companyId: string): Promise<WhatsAppSession> {
    const base = await this.requireCompanySession(sessionId, companyId)
    const workerUrl = await this.resolveWorkerUrlForSession(sessionId, base)
    await this.requireHealthyWorker(workerUrl)

    await this.ensureSessionOnWorker(sessionId, workerUrl)

    const fresh = await this.requireCompanySession(sessionId, companyId)
    const enriched = await this.enrichAndPersist(fresh)

    if (this.isFullyConnected(enriched)) {
      return enriched
    }

    if (enriched.qrImage) {
      return enriched
    }

    const live = await this.workerClient.sessionStatus(workerUrl, sessionId).catch(() => null)
    if (live && this.isFullyConnected(live)) {
      return this.enrichAndPersist({ ...fresh, ...live })
    }

    if (live?.qrImage) {
      return this.enrichAndPersist({
        ...fresh,
        status: live.status ?? fresh.status,
        qrCode: live.qrCode,
        qrImage: live.qrImage,
        expiresAt: live.expiresAt,
        phoneNumber: undefined,
        loggedIn: live.loggedIn,
        hasCredentials: live.hasCredentials,
        hasSnapshot: live.hasSnapshot,
      })
    }

    throw new Error("qr not available yet")
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
      quote: params.quote,
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
    if (!live) {
      if (session.status === "needs_qr" || session.status === "qr_pending" || session.status === "pending") {
        return session
      }

      if (session.status === "connected" && session.phoneNumber) {
        const repaired: WhatsAppSession = {
          ...session,
          status: "needs_qr",
          phoneNumber: undefined,
          qrCode: undefined,
          qrImage: undefined,
          expiresAt: undefined,
          updatedAt: new Date().toISOString(),
        }
        await this.repository.updateSession(repaired)
        await this.repository.deletePhoneIndex(session.phoneNumber).catch(() => undefined)
        return repaired
      }

      return session
    }

    const status = live.status ?? session.status
    const phoneNumber =
      status === "connected"
        ? live.phoneNumber
        : status === "qr_pending" || status === "needs_qr" || status === "pending"
          ? undefined
          : live.phoneNumber ?? session.phoneNumber
    let resolvedStatus = status === "connected" && !phoneNumber ? "qr_pending" : status
    if (
      resolvedStatus === "connected" &&
      (live.loggedIn !== true || live.hasSnapshot !== true)
    ) {
      resolvedStatus = "qr_pending"
    }
    const resolvedPhone = resolvedStatus === "connected" ? phoneNumber : undefined
    const shouldAutoLabel = !session.label && resolvedStatus === "connected" && Boolean(resolvedPhone)
    const label = session.label ?? (shouldAutoLabel ? buildSessionLabel(resolvedPhone!, session.createdAt) : undefined)

    const pairingActive = ["pending", "qr_pending", "needs_qr"].includes(resolvedStatus)
    const qrCode = live.qrCode ?? (pairingActive ? undefined : session.qrCode)
    const qrImage = live.qrImage ?? (pairingActive ? undefined : session.qrImage)
    const expiresAt = live.expiresAt ?? (pairingActive && !live.qrImage ? undefined : session.expiresAt)

    const expectedWebhookUrl = this.buildInboundWebhookUrl(session.companyId)
    const changed =
      session.status !== resolvedStatus ||
      session.phoneNumber !== resolvedPhone ||
      session.qrCode !== qrCode ||
      session.qrImage !== qrImage ||
      session.expiresAt !== expiresAt ||
      session.label !== label ||
      session.webhookUrl !== expectedWebhookUrl

    const enriched: WhatsAppSession = {
      ...session,
      status: resolvedStatus,
      qrCode,
      qrImage,
      expiresAt,
      phoneNumber: resolvedPhone,
      loggedIn: live.loggedIn,
      hasCredentials: live.hasCredentials,
      hasSnapshot: live.hasSnapshot,
      webhookUrl: expectedWebhookUrl,
      ...(label ? { label } : {}),
      updatedAt: new Date().toISOString(),
    }

    if (changed) {
      await this.repository.updateSession(enriched)
      if (enriched.phoneNumber) {
        await this.repository.setPhoneIndex(enriched.phoneNumber, enriched.sessionId)
        await this.registry.setPhoneIndex(enriched.phoneNumber, enriched.sessionId)
      } else if (session.phoneNumber) {
        await this.repository.deletePhoneIndex(session.phoneNumber).catch(() => undefined)
      }
    }

    const becameConnected =
      session.status !== "connected" &&
      enriched.status === "connected" &&
      this.isFullyConnected(enriched)
    const lostConnection =
      session.status === "connected" &&
      enriched.status !== "connected"

    if (becameConnected) {
      void repairStaleConversationSessions({
        companyId: session.companyId,
        preferredSessionId: enriched.sessionId,
      }).catch((error) => {
        console.error("[whatsapp] failed to repair conversation sessions after connect:", {
          companyId: session.companyId,
          sessionId: enriched.sessionId,
          error: error instanceof Error ? error.message : error,
        })
      })
    } else if (lostConnection) {
      void this.rebindConversationsAfterSessionLost(session.companyId, session.sessionId).catch(
        (error) => {
          console.error("[whatsapp] failed to rebind conversations after session disconnect:", {
            companyId: session.companyId,
            sessionId: session.sessionId,
            error: error instanceof Error ? error.message : error,
          })
        },
      )
    }

    return enriched
  }

  private async rebindConversationsAfterSessionLost(
    companyId: string,
    sessionId: string,
  ): Promise<void> {
    const remainingSessions = await this.repository.listSessionsByCompany(companyId)
    const replacementSessionId = pickConnectedSessionTarget(remainingSessions)
    await rebindConversationsFromSession({
      companyId,
      fromSessionId: sessionId,
      targetSessionId: replacementSessionId,
    })
  }

  private async requireHealthyWorker(workerUrl: string): Promise<void> {
    if (this.verifiedWorkerUrls.has(workerUrl)) {
      return
    }
    await this.workerClient.assertHealthyWorker(workerUrl)
    this.verifiedWorkerUrls.add(workerUrl)
  }

  private isFullyConnected(session: WhatsAppSession): boolean {
    return (
      session.status === "connected" &&
      Boolean(session.phoneNumber) &&
      session.loggedIn === true &&
      session.hasSnapshot === true
    )
  }

  private isStableConnectedSession(session: WhatsAppSession): boolean {
    return session.status === "connected" && Boolean(session.phoneNumber)
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

  private workerUrlFallback(workerId: string): string | null {
    const base = this.config.workerBaseUrl.replace(/\/$/, "")
    if (this.config.scalerMode === "local") {
      if (workerId === "worker-1") {
        return `${base}:${this.config.workerPort}`
      }
    }
    return null
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
      const worker = await this.registry.getWorker(session.workerId).catch(() => null)
      if (worker) {
        await this.registry.assignSession(sessionId, worker.workerId).catch(() => undefined)
        return worker.url
      }
      const fallbackUrl = this.workerUrlFallback(session.workerId)
      if (fallbackUrl) {
        return fallbackUrl
      }
    }

    const available = await this.registry.getAvailableWorker().catch(() => null)
    if (!available) {
      const fallbackUrl = session?.workerId ? this.workerUrlFallback(session.workerId) : null
      if (fallbackUrl) {
        return fallbackUrl
      }
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
    const workerId = await this.registry.getWorkerForSession(sessionId).catch(() => null)
    if (!workerId) {
      throw new Error("worker not assigned to session")
    }
    const worker = await this.registry.getWorker(workerId).catch(() => null)
    if (worker) {
      return worker.url
    }
    const fallbackUrl = this.workerUrlFallback(workerId)
    if (fallbackUrl) {
      return fallbackUrl
    }
    throw new Error("worker not found")
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

    if (this.isFullyConnected(live)) {
      return
    }

    if (live.status === "qr_pending" && live.qrImage) {
      return
    }

    if (live.status === "qr_pending" || live.status === "needs_qr" || live.status === "pending") {
      if (live.loggedIn !== true) {
        await this.workerClient.connectSession(workerUrl, sessionId)
      }
      return
    }

    if (live.loggedIn !== true || live.hasSnapshot !== true) {
      await this.workerClient.connectSession(workerUrl, sessionId)
    }
  }
}
