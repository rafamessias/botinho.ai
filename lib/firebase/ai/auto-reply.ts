import { generateAutoReplyText } from "@/lib/firebase/ai/generate"
import { createInboxMessage } from "@/lib/firebase/services/inbox-service"
import { getWhatsAppOrchestrator, isWhatsAppConfigured } from "@/lib/whatsapp"
import { WhatsAppSessionRepository } from "@/lib/whatsapp/session-repository"

export const sendAutoReplyForInboundMessage = async (params: {
  companyId: string
  conversationId: string
  customerPhone: string
  customerMessage: string
}) => {
  try {
    const replyText = await generateAutoReplyText({
      companyId: params.companyId,
      conversationId: params.conversationId,
      customerMessage: params.customerMessage,
    })

    if (!replyText) {
      return { sent: false, reason: "empty reply" }
    }

    if (!isWhatsAppConfigured()) {
      return { sent: false, reason: "messaging provider not configured" }
    }

    const repository = new WhatsAppSessionRepository()
    const session = await repository.getConnectedSessionForCompany(params.companyId)
    if (!session) {
      return { sent: false, reason: "no connected WhatsApp session" }
    }

    const orchestrator = await getWhatsAppOrchestrator()
    await orchestrator.sendMessage({
      companyId: params.companyId,
      sessionId: session.sessionId,
      to: params.customerPhone,
      text: replyText,
    })

    await createInboxMessage({
      companyId: params.companyId,
      conversationId: params.conversationId,
      content: replyText,
      senderType: "bot",
      status: "sent",
      incrementUnread: false,
    })

    return { sent: true, reason: null }
  } catch (error) {
    console.error("[gemini] auto-reply failed:", error)
    return { sent: false, reason: error instanceof Error ? error.message : "unknown error" }
  }
}
