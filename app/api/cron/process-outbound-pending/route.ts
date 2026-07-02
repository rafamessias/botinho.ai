import { NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase/admin"
import { collections } from "@/lib/firebase/collections"
import { verifyCronRequest } from "@/lib/cron/auth"
import { retryPendingOutboundMessages } from "@/lib/messaging/messaging-service"
import { repairStaleConversationSessions } from "@/lib/whatsapp/conversation-session-rebind"

export const GET = async (request: NextRequest) => {
  if (!verifyCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const companiesSnap = await adminDb.collection(collections.companies).limit(100).get()
    const allResults = []
    let conversationsRebound = 0

    for (const companyDoc of companiesSnap.docs) {
      const rebindResult = await repairStaleConversationSessions({
        companyId: companyDoc.id,
        limit: 100,
      }).catch((error) => {
        console.error("[cron] repair stale conversation sessions failed:", {
          companyId: companyDoc.id,
          error: error instanceof Error ? error.message : error,
        })
        return null
      })
      if (rebindResult) {
        conversationsRebound += rebindResult.updated + rebindResult.cleared
      }

      const results = await retryPendingOutboundMessages({
        companyId: companyDoc.id,
        limit: 25,
      })
      allResults.push(...results.map((item) => ({ companyId: companyDoc.id, ...item })))
    }

    return NextResponse.json({
      ok: true,
      conversationsRebound,
      processed: allResults.length,
      succeeded: allResults.filter((item) => item.success).length,
      failed: allResults.filter((item) => !item.success).length,
      results: allResults,
    })
  } catch (error) {
    console.error("[cron] process-outbound-pending failed:", error)
    return NextResponse.json({ error: "Failed to process outbound messages" }, { status: 500 })
  }
}
