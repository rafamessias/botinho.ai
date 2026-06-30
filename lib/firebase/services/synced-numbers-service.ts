import { getSyncedNumbersLimitForPlan } from "@/lib/plan-limits"
import { getCompanySubscription } from "@/lib/firebase/services/subscription-service"
import { listCompanyWhatsAppSessions } from "@/lib/whatsapp"
import { PlanType } from "@/lib/types/enums"
import type { WhatsAppSession } from "@/lib/whatsapp/types"

const isSyncedSession = (session: WhatsAppSession): boolean =>
  session.status !== "disconnected"

const isConnectedSession = (session: WhatsAppSession): boolean =>
  session.status === "connected" &&
  Boolean(session.phoneNumber) &&
  session.loggedIn === true &&
  session.hasSnapshot === true

export const getSyncedNumbersLimit = async (companyId: string): Promise<number> => {
  const subscription = await getCompanySubscription(companyId)
  const planType = (subscription?.plan?.planType as PlanType) ?? PlanType.FREE
  return subscription?.plan?.maxSyncedNumbers ?? getSyncedNumbersLimitForPlan(planType)
}

export const countActiveWhatsAppSessions = async (companyId: string): Promise<number> => {
  const sessions = await listCompanyWhatsAppSessions(companyId, { syncLive: false })
  return sessions.filter(isSyncedSession).length
}

export const countConnectedWhatsAppSessions = async (companyId: string): Promise<number> => {
  const sessions = await listCompanyWhatsAppSessions(companyId, { syncLive: false })
  return sessions.filter(isConnectedSession).length
}

export const getSyncedNumbersSnapshot = async (companyId: string) => {
  const limit = await getSyncedNumbersLimit(companyId)
  const sessions = await listCompanyWhatsAppSessions(companyId, { syncLive: false })
  const active = sessions.filter(isSyncedSession).length
  const connected = sessions.filter(isConnectedSession).length
  const remaining = Math.max(0, limit - active)
  const percentageUsed = limit > 0 ? Math.min(100, (active / limit) * 100) : 0

  return {
    metricType: "SYNCED_NUMBERS" as const,
    limit,
    currentUsage: active,
    connectedCount: connected,
    remaining,
    percentageUsed,
    isOverLimit: active >= limit,
  }
}

export const assertSyncedNumberAllowed = async (companyId: string) => {
  const snapshot = await getSyncedNumbersSnapshot(companyId)
  if (snapshot.isOverLimit) {
    throw new Error("Synced WhatsApp number limit reached for your plan")
  }
  return snapshot.remaining
}
