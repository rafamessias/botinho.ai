import { NextRequest, NextResponse } from "next/server"
import { verifyCronRequest } from "@/lib/cron/auth"
import { processAllCampaigns } from "@/lib/campaign/campaign-delivery"

export const GET = async (request: NextRequest) => {
  if (!verifyCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const results = await processAllCampaigns()
    return NextResponse.json({
      ok: true,
      processed: results.length,
      succeeded: results.reduce((sum, item) => sum + item.succeeded, 0),
      results,
    })
  } catch (error) {
    console.error("[cron] process-campaigns failed:", error)
    return NextResponse.json({ error: "Failed to process campaigns" }, { status: 500 })
  }
}
