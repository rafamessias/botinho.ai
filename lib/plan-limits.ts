import { PlanType } from "@/lib/types/enums"

export const PLAN_AI_LIMITS: Record<PlanType, number> = {
  [PlanType.FREE]: 50,
  [PlanType.STARTER]: 500,
  [PlanType.PRO]: 2_000,
  [PlanType.BUSINESS]: 10_000,
  [PlanType.ENTERPRISE]: 100_000,
}

export const getAiLimitForPlan = (planType: PlanType): number =>
  PLAN_AI_LIMITS[planType] ?? PLAN_AI_LIMITS[PlanType.FREE]
