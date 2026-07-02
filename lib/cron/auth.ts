import { NextRequest } from "next/server"

/** Validates scheduled HTTP jobs (Google Cloud Scheduler → App Hosting). */
export const verifyCronRequest = (request: NextRequest): boolean => {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret) {
    return process.env.NODE_ENV === "development"
  }

  const authHeader = request.headers.get("authorization")
  if (authHeader === `Bearer ${secret}`) {
    return true
  }

  return request.headers.get("x-cron-secret") === secret
}
