import { isWhatsAppConfigured, getWhatsAppOrchestrator } from "@/lib/whatsapp"
import type { WhatsAppOrchestrator } from "@/lib/whatsapp/orchestrator"
import type { WhatsAppSession } from "@/lib/whatsapp/types"
import {
  updateInboxMessageStatus,
  markMessageMetricsSent,
  rebindConversationSession,
} from "@/lib/firebase/services/inbox-service"
import { normalizeStoredPhone } from "@/lib/phone-utils"
import { incrementMessageUsage } from "@/lib/messaging/message-usage-service"

const isDeliverableSession = (
  session: WhatsAppSession | null | undefined,
): session is WhatsAppSession & { phoneNumber: string } =>
  Boolean(session && session.status === "connected" && session.phoneNumber)

const resolveConnectedSession = async (
  orchestrator: WhatsAppOrchestrator,
  companyId: string,
  preferredSessionId: string | null,
): Promise<WhatsAppSession | null> => {
  if (preferredSessionId) {
    const preferred = await orchestrator.getSession(preferredSessionId, companyId).catch(() => null)
    if (isDeliverableSession(preferred)) {
      return preferred
    }
  }

  return (
    (await orchestrator.listSessions(companyId)).find(
      (item) => item.status === "connected" && Boolean(item.phoneNumber),
    ) ?? null
  )
}

export type DeliverWhatsAppMessageParams = {
  companyId: string
  conversationId: string
  messageId: string
  content: string
  sessionId: string | null
  customerPhone: string
  senderType: "agent" | "bot"
  countAsBotAutoReply?: boolean
  quote?: {
    externalMessageId: string
    content: string
    participant?: string
  }
}

export const deliverMessageViaWhatsApp = async (
  params: DeliverWhatsAppMessageParams,
): Promise<{ delivered: boolean; channelPhoneNumber?: string; externalMessageId?: string }> => {
  if (!isWhatsAppConfigured()) {
    await updateInboxMessageStatus({
      companyId: params.companyId,
      conversationId: params.conversationId,
      messageId: params.messageId,
      status: "failed",
      failureReason: "WhatsApp not configured",
    })
    return { delivered: false }
  }

  const normalizedPhone = normalizeStoredPhone(params.customerPhone)
  if (!normalizedPhone) {
    await updateInboxMessageStatus({
      companyId: params.companyId,
      conversationId: params.conversationId,
      messageId: params.messageId,
      status: "failed",
      failureReason: "Invalid customer phone",
    })
    return { delivered: false }
  }

  try {
    const orchestrator = await getWhatsAppOrchestrator()
    const session = await resolveConnectedSession(
      orchestrator,
      params.companyId,
      params.sessionId,
    )

    if (!isDeliverableSession(session)) {
      await updateInboxMessageStatus({
        companyId: params.companyId,
        conversationId: params.conversationId,
        messageId: params.messageId,
        status: "failed",
        failureReason: "No connected WhatsApp session",
      })
      return { delivered: false }
    }

    const channelPhoneNumber =
      normalizeStoredPhone(session.phoneNumber) || session.phoneNumber
    const externalParticipantJid = `${channelPhoneNumber}@s.whatsapp.net`

    const sentMessage = await orchestrator.sendMessage({
      companyId: params.companyId,
      sessionId: session.sessionId,
      to: normalizedPhone,
      text: params.content,
      quote: params.quote
        ? {
            messageId: params.quote.externalMessageId,
            body: params.quote.content,
            participant: params.quote.participant,
          }
        : undefined,
    })

    if (params.sessionId && params.sessionId !== session.sessionId) {
      await rebindConversationSession({
        companyId: params.companyId,
        conversationId: params.conversationId,
        sessionId: session.sessionId,
      }).catch((rebindError) => {
        console.warn("[messaging] Failed to rebind conversation session after WhatsApp delivery:", {
          conversationId: params.conversationId,
          previousSessionId: params.sessionId,
          sessionId: session.sessionId,
          error: rebindError instanceof Error ? rebindError.message : rebindError,
        })
      })
    }

    await updateInboxMessageStatus({
      companyId: params.companyId,
      conversationId: params.conversationId,
      messageId: params.messageId,
      status: "delivered",
      channelPhoneNumber,
      externalMessageId: sentMessage.messageId,
      externalParticipantJid,
    })

    const metricsApplied = await markMessageMetricsSent({
      companyId: params.companyId,
      conversationId: params.conversationId,
      messageId: params.messageId,
      channelPhoneNumber,
    })

    if (metricsApplied && channelPhoneNumber) {
      await incrementMessageUsage(params.companyId, channelPhoneNumber, "MESSAGES_SENT", 1, session.sessionId)
      if (params.countAsBotAutoReply) {
        await incrementMessageUsage(params.companyId, channelPhoneNumber, "BOT_AUTO_REPLIES", 1, session.sessionId)
      }
    }

    return { delivered: true, channelPhoneNumber, externalMessageId: sentMessage.messageId }
  } catch (error) {
    const failureReason = error instanceof Error ? error.message : "WhatsApp delivery failed"
    console.error("[messaging] WhatsApp delivery failed:", {
      conversationId: params.conversationId,
      messageId: params.messageId,
      error: failureReason,
    })
    await updateInboxMessageStatus({
      companyId: params.companyId,
      conversationId: params.conversationId,
      messageId: params.messageId,
      status: "failed",
      failureReason,
    }).catch((updateError) => {
      console.error("[messaging] Failed to update message status after WhatsApp error:", updateError)
    })
    return { delivered: false }
  }
}
