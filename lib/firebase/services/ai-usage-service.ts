import { FieldValue } from "firebase-admin/firestore"
import { adminDb } from "@/lib/firebase/admin"
import { collections, companySubcollections } from "@/lib/firebase/collections"
import { getAiLimitForPlan } from "@/lib/plan-limits"
import { getCompanySubscription } from "@/lib/firebase/services/subscription-service"
import { PlanType } from "@/lib/types/enums"

const USAGE_METRIC = "AI_RESPONSES"

const currentPeriodId = () => {
  const now = new Date()
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`
}

const usageRef = (companyId: string) =>
  adminDb
    .collection(collections.companies)
    .doc(companyId)
    .collection(companySubcollections.usage)
    .doc(currentPeriodId())

export const getAiUsageLimit = async (companyId: string): Promise<number> => {
  const subscription = await getCompanySubscription(companyId)
  const planType = (subscription?.plan?.planType as PlanType) ?? PlanType.FREE
  return subscription?.plan?.maxAiResponses ?? getAiLimitForPlan(planType)
}

export const getAiUsageSnapshot = async (companyId: string) => {
  const limit = await getAiUsageLimit(companyId)
  const snap = await usageRef(companyId).get()
  const current = (snap.data()?.[USAGE_METRIC] as number | undefined) ?? 0
  const remaining = Math.max(0, limit - current)
  const percentageUsed = limit > 0 ? Math.min(100, (current / limit) * 100) : 0

  return {
    metricType: USAGE_METRIC,
    limit,
    currentUsage: current,
    remaining,
    percentageUsed,
    isOverLimit: current >= limit,
    periodId: currentPeriodId(),
  }
}

export const checkAiUsageAllowed = async (companyId: string): Promise<{ allowed: boolean; remaining: number }> => {
  const snapshot = await getAiUsageSnapshot(companyId)
  return { allowed: !snapshot.isOverLimit, remaining: snapshot.remaining }
}

export const incrementAiUsage = async (companyId: string, count = 1): Promise<void> => {
  await usageRef(companyId).set(
    {
      periodId: currentPeriodId(),
      [USAGE_METRIC]: FieldValue.increment(count),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  )
}

export const assertAiUsageAllowed = async (companyId: string) => {
  const { allowed, remaining } = await checkAiUsageAllowed(companyId)
  if (!allowed) {
    throw new Error("AI response limit reached for this billing period")
  }
  return remaining
}
