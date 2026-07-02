import { getLimitsForPlanType } from "@/lib/plan-catalog"
import { PlanType } from "@/lib/types/enums"

export const PLAN_AI_LIMITS: Record<PlanType, number> = {
  [PlanType.FREE]: getLimitsForPlanType(PlanType.FREE).maxAiCredits,
  [PlanType.STARTER]: getLimitsForPlanType(PlanType.STARTER).maxAiCredits,
  [PlanType.PRO]: getLimitsForPlanType(PlanType.PRO).maxAiCredits,
  [PlanType.BUSINESS]: getLimitsForPlanType(PlanType.BUSINESS).maxAiCredits,
  [PlanType.ENTERPRISE]: getLimitsForPlanType(PlanType.ENTERPRISE).maxAiCredits,
}

export const PLAN_SYNCED_NUMBER_LIMITS: Record<PlanType, number> = {
  [PlanType.FREE]: getLimitsForPlanType(PlanType.FREE).maxSyncedNumbers,
  [PlanType.STARTER]: getLimitsForPlanType(PlanType.STARTER).maxSyncedNumbers,
  [PlanType.PRO]: getLimitsForPlanType(PlanType.PRO).maxSyncedNumbers,
  [PlanType.BUSINESS]: getLimitsForPlanType(PlanType.BUSINESS).maxSyncedNumbers,
  [PlanType.ENTERPRISE]: getLimitsForPlanType(PlanType.ENTERPRISE).maxSyncedNumbers,
}

export const getAiLimitForPlan = (planType: PlanType): number =>
  PLAN_AI_LIMITS[planType] ?? PLAN_AI_LIMITS[PlanType.FREE]

export const getSyncedNumbersLimitForPlan = (planType: PlanType): number =>
  PLAN_SYNCED_NUMBER_LIMITS[planType] ?? PLAN_SYNCED_NUMBER_LIMITS[PlanType.FREE]
