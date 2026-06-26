import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { sendAutoReplyForInboundMessage } from "@/lib/firebase/ai/auto-reply"
import { recordInboundMessage } from "@/lib/firebase/services/inbox-service"
import { getWhatsAppConfig } from "@/lib/whatsapp/config"

const inboundPayloadSchema = z.object({
  sessionId: z.string().min(1),
  messageId: z.string().min(1),
  from: z.string().min(1),
  to: z.string().optional(),
  body: z.string(),
  type: z.string().optional(),
  timestamp: z.string().optional(),
})

export const POST = async (request: NextRequest) => {
  const config = getWhatsAppConfig()
  if (!config) {
    return NextResponse.json({ error: "WhatsApp not configured" }, { status: 503 })
  }

  const token = request.nextUrl.searchParams.get("token")
  const companyId = request.nextUrl.searchParams.get("companyId")

  if (!token || token !== config.webhookSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!companyId) {
    return NextResponse.json({ error: "companyId is required" }, { status: 400 })
  }

  let payload: z.infer<typeof inboundPayloadSchema>
  try {
    payload = inboundPayloadSchema.parse(await request.json())
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  if (!payload.body.trim()) {
    return NextResponse.json({ ok: true, skipped: "empty body" })
  }

  try {
    const { conversationId, message } = await recordInboundMessage({
      companyId,
      from: payload.from,
      text: payload.body,
      sessionId: payload.sessionId,
    })

    const autoReply = await sendAutoReplyForInboundMessage({
      companyId,
      conversationId,
      customerPhone: payload.from,
      customerMessage: payload.body,
    })

    return NextResponse.json({
      ok: true,
      conversationId,
      messageId: message.id,
      autoReply,
    })
  } catch (error) {
    console.error("[whatsapp] inbound webhook failed:", error)
    return NextResponse.json({ error: "Failed to process inbound message" }, { status: 500 })
  }
}
