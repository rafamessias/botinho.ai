import { isWhatsAppConfigured, getWhatsAppOrchestrator } from "@/lib/whatsapp"
import { WhatsAppSessionRepository } from "@/lib/whatsapp/session-repository"
import {
  updateInboxMessageStatus,
  markMessageMetricsSent,
} from "@/lib/firebase/services/inbox-service"
import { normalizeStoredPhone } from "@/lib/phone-utils"
import { incrementMessageUsage } from "@/lib/messaging/message-usage-service"

export type DeliverWhatsAppMessageParams = {
  companyId: string
  conversationId: string
  messageId: string
  content: string
  sessionId: string | null
  customerPhone: string
  senderType: "agent" | "bot"
  countAsBotAutoReply?: boolean
}

export const deliverMessageViaWhatsApp = async (
  params: DeliverWhatsAppMessageParams,
): Promise<{ delivered: boolean; channelPhoneNumber?: string }> => {
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
    const repository = new WhatsAppSessionRepository()
    const session = params.sessionId
      ? await repository.getSession(params.sessionId)
      : await repository.getConnectedSessionForCompany(params.companyId)

    if (!session || session.status !== "connected") {
      await updateInboxMessageStatus({
        companyId: params.companyId,
        conversationId: params.conversationId,
        messageId: params.messageId,
        status: "failed",
        failureReason: "No connected WhatsApp session",
      })
      return { delivered: false }
    }

    const channelPhoneNumber = session.phoneNumber
      ? normalizeStoredPhone(session.phoneNumber) || session.phoneNumber
      : undefined

    const orchestrator = await getWhatsAppOrchestrator()
    await orchestrator.sendMessage({
      companyId: params.companyId,
      sessionId: session.sessionId,
      to: normalizedPhone,
      text: params.content,
    })

    await updateInboxMessageStatus({
      companyId: params.companyId,
      conversationId: params.conversationId,
      messageId: params.messageId,
      status: "delivered",
      channelPhoneNumber,
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

    return { delivered: true, channelPhoneNumber }
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
