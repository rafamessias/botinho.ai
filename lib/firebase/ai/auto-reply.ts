import { generateAutoReplyText } from "@/lib/firebase/ai/generate"

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

    return { sent: false, reason: "messaging provider not configured" }
  } catch (error) {
    console.error("[gemini] auto-reply failed:", error)
    return { sent: false, reason: error instanceof Error ? error.message : "unknown error" }
  }
}
