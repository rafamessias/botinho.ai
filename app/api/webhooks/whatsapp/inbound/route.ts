import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { processInboundFromWebhook } from "@/lib/messaging/messaging-service"
import { getWhatsAppConfig } from "@/lib/whatsapp/config"

const inboundPayloadSchema = z.object({
  sessionId: z.string().min(1),
  messageId: z.string().min(1),
  from: z.string().min(1),
  to: z.string().optional(),
  body: z.string(),
  type: z.string().optional(),
  timestamp: z.string().optional(),
  eventId: z.string().min(1).optional(),
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

  try {
    const result = await processInboundFromWebhook({
      companyId,
      sessionId: payload.sessionId,
      messageId: payload.messageId,
      from: payload.from,
      body: payload.body,
      eventId: payload.eventId,
      to: payload.to,
      type: payload.type,
    })

    return NextResponse.json({
      ok: true,
      skipped: result.skipped,
      eventId: result.eventId,
      conversationId: result.conversationId,
      messageId: result.inboxMessageId,
    })
  } catch (error) {
    console.error("[whatsapp] inbound webhook failed:", error)
    return NextResponse.json({ error: "Failed to process inbound message" }, { status: 500 })
  }
}
