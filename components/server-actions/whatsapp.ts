"use server"

import { z } from "zod"
import { BaseActionResponse, handleAction, resolveCompanyContext } from "./utils"
import { removeSessionIdFromAllAgents } from "@/lib/firebase/services/ai-agent-service"
import { getWhatsAppOrchestrator, isWhatsAppConfigured, checkWhatsAppAvailability, listCompanyWhatsAppSessions } from "@/lib/whatsapp"
import type { WhatsAppSession } from "@/lib/whatsapp/types"

export type WhatsAppSessionView = {
  sessionId: string
  label: string | null
  phoneNumber: string | null
  status: WhatsAppSession["status"]
  connected: boolean
  loggedIn: boolean
  hasCredentials: boolean
  hasSnapshot: boolean
  createdAt: string
  updatedAt: string
  lastSeenAt: string | null
}

const toSessionView = (session: WhatsAppSession): WhatsAppSessionView => ({
  sessionId: session.sessionId,
  label: session.label ?? null,
  phoneNumber: session.phoneNumber ?? null,
  status: session.status,
  connected: session.status === "connected" && Boolean(session.phoneNumber) && session.loggedIn === true && session.hasSnapshot === true,
  loggedIn: session.loggedIn === true,
  hasCredentials: session.hasCredentials === true,
  hasSnapshot: session.hasSnapshot === true,
  createdAt: session.createdAt,
  updatedAt: session.updatedAt,
  lastSeenAt: session.lastSeenAt ?? null,
})

const companyScopeSchema = z.object({
  companyId: z.string().optional(),
  syncLive: z.boolean().optional(),
})

const sessionIdSchema = companyScopeSchema.extend({
  sessionId: z.string().min(1),
})

const createSessionSchema = companyScopeSchema.extend({
  label: z.string().trim().max(120).optional(),
})

const updateSessionLabelSchema = sessionIdSchema.extend({
  label: z.string().trim().min(1).max(120),
})

type WhatsAppSessionsOverview = {
  configured: boolean
  available: boolean
  sessions: WhatsAppSessionView[]
}

export const getWhatsAppSessionsAction = async (
  input?: z.input<typeof companyScopeSchema>,
): Promise<BaseActionResponse<WhatsAppSessionsOverview>> =>
  handleAction<WhatsAppSessionsOverview>(async () => {
    const parsed = companyScopeSchema.parse(input ?? {})
    const { companyId } = await resolveCompanyContext({ companyId: parsed.companyId, requireAdmin: true })

    const configured = isWhatsAppConfigured()
    const { available } = configured
      ? await checkWhatsAppAvailability()
      : { available: false }
    const sessions = configured
      ? await listCompanyWhatsAppSessions(companyId, {
          available,
          syncLive: parsed.syncLive ?? true,
        })
      : []

    return {
      success: true,
      data: {
        configured,
        available,
        sessions: sessions.map(toSessionView),
      },
    }
  })

export const createWhatsAppSessionAction = async (
  input: z.input<typeof createSessionSchema>,
): Promise<BaseActionResponse<{ session: WhatsAppSessionView }>> =>
  handleAction(async () => {
    const parsed = createSessionSchema.parse(input)
    const { companyId } = await resolveCompanyContext({ companyId: parsed.companyId, requireAdmin: true })

    const orchestrator = await getWhatsAppOrchestrator()
    const webhookUrl = orchestrator.buildInboundWebhookUrl(companyId)
    const session = await orchestrator.createSession({
      companyId,
      webhookUrl,
      ...(parsed.label ? { label: parsed.label } : {}),
    })
    const connected = await orchestrator.connectSession(session.sessionId, companyId)

    return {
      success: true,
      data: { session: toSessionView(connected) },
    }
  })

export const getWhatsAppSessionQrAction = async (
  input: z.input<typeof sessionIdSchema>,
): Promise<BaseActionResponse<{ session: WhatsAppSessionView; qrImage: string | null }>> =>
  handleAction(async () => {
    const parsed = sessionIdSchema.parse(input)
    const { companyId } = await resolveCompanyContext({ companyId: parsed.companyId, requireAdmin: true })

    const orchestrator = await getWhatsAppOrchestrator()

    try {
      const session = await orchestrator.getQrCode(parsed.sessionId, companyId)
      const pairingScanned = session.loggedIn === true || session.hasCredentials === true
      return {
        success: true,
        data: {
          session: toSessionView(session),
          qrImage: pairingScanned ? null : session.qrImage ?? null,
        },
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "qr not available yet"
      if (message.includes("qr not available")) {
        const session = await orchestrator.getSession(parsed.sessionId, companyId)
        const pairingScanned = session.loggedIn === true || session.hasCredentials === true
        return {
          success: true,
          data: {
            session: toSessionView(session),
            qrImage: pairingScanned ? null : session.qrImage ?? null,
          },
        }
      }
      throw error
    }
  })

export const updateWhatsAppSessionLabelAction = async (
  input: z.input<typeof updateSessionLabelSchema>,
): Promise<BaseActionResponse<{ session: WhatsAppSessionView }>> =>
  handleAction(async () => {
    const parsed = updateSessionLabelSchema.parse(input)
    const { companyId } = await resolveCompanyContext({ companyId: parsed.companyId, requireAdmin: true })

    const orchestrator = await getWhatsAppOrchestrator()
    const session = await orchestrator.updateSessionLabel(parsed.sessionId, companyId, parsed.label)

    return {
      success: true,
      data: { session: toSessionView(session) },
    }
  })

export const deleteWhatsAppSessionAction = async (
  input: z.input<typeof sessionIdSchema>,
): Promise<BaseActionResponse<{ sessionId: string }>> =>
  handleAction(async () => {
    const parsed = sessionIdSchema.parse(input)
    const { companyId } = await resolveCompanyContext({ companyId: parsed.companyId, requireAdmin: true })

    const orchestrator = await getWhatsAppOrchestrator()
    await orchestrator.deleteSession(parsed.sessionId, companyId)
    await removeSessionIdFromAllAgents(companyId, parsed.sessionId)

    return { success: true, data: { sessionId: parsed.sessionId } }
  })

export const sendWhatsAppTextAction = async (input: {
  companyId?: string
  sessionId?: string
  to: string
  text: string
}): Promise<BaseActionResponse<{ messageId: string }>> =>
  handleAction(async () => {
    const { companyId } = await resolveCompanyContext({ companyId: input.companyId, requireCanPost: true })
    const orchestrator = await getWhatsAppOrchestrator()
    const message = await orchestrator.sendMessage({
      companyId,
      sessionId: input.sessionId,
      to: input.to,
      text: input.text,
    })

    return {
      success: true,
      data: { messageId: message.messageId },
    }
  })
