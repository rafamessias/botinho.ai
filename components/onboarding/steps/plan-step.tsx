"use client"

import { useEffect, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { PlanPricingCards } from "@/components/pricing/plan-pricing-cards"
import { completeOnboardingAction, selectOnboardingPlanAction } from "@/components/server-actions/onboarding"
import { handleCanceledCheckout } from "@/components/server-actions/subscription"
import { getLandingPlans, localeToCurrency } from "@/lib/plan-catalog"
import { PlanType } from "@/lib/types/enums"

type PlanStepProps = {
  checkoutStatus?: "success" | "canceled" | null
}

export const PlanStep = ({ checkoutStatus }: PlanStepProps) => {
  const t = useTranslations("Onboarding.plan")
  const locale = useLocale()
  const router = useRouter()
  const currency = localeToCurrency(locale)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null)

  useEffect(() => {
    if (checkoutStatus === "success") {
      void completeOnboardingAction().then((result) => {
        if (result.success) {
          toast.success(t("checkoutSuccess"))
          router.push("/dashboard")
        }
      })
    }

    if (checkoutStatus === "canceled") {
      void handleCanceledCheckout().then(() => {
        toast.message(t("checkoutCanceled"))
      })
    }
  }, [checkoutStatus, router, t])

  const handleSelectPlan = async (planType: PlanType) => {
    setLoadingPlan(planType)
    try {
      const result = await selectOnboardingPlanAction({
        planType,
        billingCycle,
        currency,
        locale,
      })

      if (!result.success) {
        toast.error(result.error ?? t("error"))
        return
      }

      if (result.data?.checkoutUrl) {
        window.location.href = result.data.checkoutUrl
        return
      }

      if (result.data?.completed) {
        toast.success(t("completed"))
        router.push("/dashboard")
      }
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{t("description")}</p>
      <PlanPricingCards
        plans={getLandingPlans()}
        currency={currency}
        locale={locale}
        billingCycle={billingCycle}
        onBillingCycleChange={setBillingCycle}
        variant="modal"
        onSelectPlan={handleSelectPlan}
        loadingPlan={loadingPlan}
      />
      {loadingPlan && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("redirecting")}
        </div>
      )}
    </div>
  )
}
