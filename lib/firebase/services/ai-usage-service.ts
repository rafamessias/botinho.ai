import { FieldValue } from "firebase-admin/firestore"
import { adminDb } from "@/lib/firebase/admin"
import { collections, companySubcollections } from "@/lib/firebase/collections"
import {
  AI_CREDIT_TENTHS,
  creditsToTenthsLimit,
  SUGGESTION_CREDIT_TENTHS,
  tenthsToCredits,
} from "@/lib/plan-catalog"
import { getAiLimitForPlan } from "@/lib/plan-limits"
import { getCompanySubscription } from "@/lib/firebase/services/subscription-service"
import { PlanType } from "@/lib/types/enums"

const USAGE_METRIC = "AI_CREDITS_TENTHS"
const LEGACY_METRIC = "AI_RESPONSES"

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

const readUsageTenths = (data: FirebaseFirestore.DocumentData | undefined): number => {
  const tenths = data?.[USAGE_METRIC] as number | undefined
  if (typeof tenths === "number") {
    return tenths
  }
  const legacy = data?.[LEGACY_METRIC] as number | undefined
  if (typeof legacy === "number") {
    return legacy * AI_CREDIT_TENTHS
  }
  return 0
}

export const getAiUsageLimit = async (companyId: string): Promise<number> => {
  const subscription = await getCompanySubscription(companyId)
  const planType = (subscription?.plan?.planType as PlanType) ?? PlanType.FREE
  return subscription?.plan?.maxAiCredits ?? subscription?.plan?.maxAiResponses ?? getAiLimitForPlan(planType)
}

export const getAiUsageSnapshot = async (companyId: string) => {
  const limitCredits = await getAiUsageLimit(companyId)
  const limitTenths = creditsToTenthsLimit(limitCredits)
  const snap = await usageRef(companyId).get()
  const currentTenths = readUsageTenths(snap.data())
  const currentCredits = tenthsToCredits(currentTenths)
  const remainingTenths = Math.max(0, limitTenths - currentTenths)
  const remainingCredits = tenthsToCredits(remainingTenths)
  const percentageUsed = limitTenths > 0 ? Math.min(100, (currentTenths / limitTenths) * 100) : 0

  return {
    metricType: "AI_CREDITS" as const,
    limit: limitCredits,
    limitTenths,
    currentUsage: currentCredits,
    currentUsageTenths: currentTenths,
    remaining: remainingCredits,
    remainingTenths,
    percentageUsed,
    isOverLimit: currentTenths >= limitTenths,
    periodId: currentPeriodId(),
  }
}

export const checkAiUsageAllowed = async (
  companyId: string,
  requiredTenths = AI_CREDIT_TENTHS,
): Promise<{ allowed: boolean; remaining: number }> => {
  const snapshot = await getAiUsageSnapshot(companyId)
  const remainingTenths = snapshot.remainingTenths
  return { allowed: remainingTenths >= requiredTenths, remaining: tenthsToCredits(remainingTenths) }
}

export const incrementAiUsage = async (companyId: string, tenths = AI_CREDIT_TENTHS): Promise<void> => {
  await usageRef(companyId).set(
    {
      periodId: currentPeriodId(),
      [USAGE_METRIC]: FieldValue.increment(tenths),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  )
}

export const assertAiUsageAllowed = async (companyId: string, requiredTenths = AI_CREDIT_TENTHS) => {
  const { allowed, remaining } = await checkAiUsageAllowed(companyId, requiredTenths)
  if (!allowed) {
    throw new Error("AI credit limit reached for this billing period")
  }
  return remaining
}

export { AI_CREDIT_TENTHS, SUGGESTION_CREDIT_TENTHS }
