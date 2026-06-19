import { getCompanySubscription, getPlanByType } from "@/lib/firebase/services/subscription-service"
import { PlanType } from "@/lib/types/enums"

export const validateApiAccess = async (companyId: string): Promise<boolean> => {
  const subscription = await getCompanySubscription(companyId)
  if (!subscription?.plan) {
    const freePlan = await getPlanByType(PlanType.FREE)
    return freePlan?.allowApiAccess === true
  }
  return subscription.plan.allowApiAccess === true
}
