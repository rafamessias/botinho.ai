"use client"

import { useState } from "react"
import { useLocale } from "next-intl"

import { PlanPricingCards } from "@/components/pricing/plan-pricing-cards"
import { getLandingPlans, localeToCurrency, type PlanCatalogEntry } from "@/lib/plan-catalog"

type LandingPricingSectionProps = {
  plans?: PlanCatalogEntry[]
}

export const LandingPricingSection = ({ plans = getLandingPlans() }: LandingPricingSectionProps) => {
  const locale = useLocale()
  const currency = localeToCurrency(locale)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  return (
    <PlanPricingCards
      plans={plans}
      currency={currency}
      locale={locale}
      billingCycle={billingCycle}
      onBillingCycleChange={setBillingCycle}
      variant="landing"
    />
  )
}
