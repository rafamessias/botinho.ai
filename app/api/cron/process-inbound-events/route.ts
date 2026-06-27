import { NextRequest, NextResponse } from "next/server"
import { verifyCronRequest } from "@/lib/cron/auth"
import {
  retryFailedAutoReplies,
  retryPendingInboundEvents,
} from "@/lib/messaging/messaging-service"

export const GET = async (request: NextRequest) => {
  if (!verifyCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const inboundResults = await retryPendingInboundEvents({ limit: 50 })
    const autoReplyResults = await retryFailedAutoReplies({ limit: 25 })

    return NextResponse.json({
      ok: true,
      inbound: {
        processed: inboundResults.length,
        succeeded: inboundResults.filter((item) => item.success).length,
        failed: inboundResults.filter((item) => !item.success).length,
        results: inboundResults,
      },
      autoReply: {
        processed: autoReplyResults.length,
        succeeded: autoReplyResults.filter((item) => item.success).length,
        failed: autoReplyResults.filter((item) => !item.success).length,
        results: autoReplyResults,
      },
    })
  } catch (error) {
    console.error("[cron] process-inbound-events failed:", error)
    return NextResponse.json({ error: "Failed to process inbound events" }, { status: 500 })
  }
}
