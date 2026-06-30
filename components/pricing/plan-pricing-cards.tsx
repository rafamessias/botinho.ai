"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { CheckCircle, Loader2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  formatPlanPrice,
  type PlanCatalogEntry,
  type PlanCurrency,
} from "@/lib/plan-catalog"
import { PlanType } from "@/lib/types/enums"
import { cn } from "@/lib/utils"

export type PlanPricingCardsProps = {
  plans: PlanCatalogEntry[]
  currency: PlanCurrency
  locale: string
  billingCycle: "monthly" | "yearly"
  onBillingCycleChange?: (cycle: "monthly" | "yearly") => void
  variant: "landing" | "modal"
  onSelectPlan?: (planType: PlanType) => void
  loadingPlan?: PlanType | null
  showBillingToggle?: boolean
  className?: string
}

const planTypeFromKey = (key: PlanCatalogEntry["key"]): PlanType => {
  switch (key) {
    case "free":
      return PlanType.FREE
    case "starter":
      return PlanType.STARTER
    case "pro":
      return PlanType.PRO
    case "business":
      return PlanType.BUSINESS
  }
}

export const PlanPricingCards = ({
  plans,
  currency,
  locale,
  billingCycle,
  onBillingCycleChange,
  variant,
  onSelectPlan,
  loadingPlan = null,
  showBillingToggle = true,
  className,
}: PlanPricingCardsProps) => {
  const t = useTranslations("Pricing")

  const getPlanFeatures = (plan: PlanCatalogEntry): string[] => {
    const features = [
      t("features.syncedNumbers", { count: plan.maxSyncedNumbers }),
      t("features.aiCredits", { count: plan.maxAiCredits.toLocaleString(locale) }),
    ]

    if (plan.flags.allowExport) {
      features.push(t("features.dataExport"))
    }

    if (plan.flags.allowApiAccess) {
      features.push(t("features.apiAccess"))
    }

    if (plan.flags.removeBranding) {
      features.push(t("features.removeBranding"))
    }

    if (plan.key === "free") {
      features.push(t("features.communitySupport"))
    } else if (plan.key === "starter") {
      features.push(t("features.emailSupport"))
    } else {
      features.push(t("features.prioritySupport"))
    }

    if (plan.key === "pro" || plan.key === "business") {
      features.push(t("features.analytics"))
    }

    return features
  }

  const renderPrice = (plan: PlanCatalogEntry) => {
    if (plan.contactSales) {
      return <span className="text-2xl font-semibold leading-tight">{t("contactSales")}</span>
    }

    const priceSet = plan.prices[currency]
    const amount = billingCycle === "monthly" ? priceSet.monthly : priceSet.yearly

    if (amount === 0) {
      return <span className="text-4xl font-semibold">{formatPlanPrice(0, currency, locale)}</span>
    }

    if (billingCycle === "yearly") {
      const monthlyEquivalent = amount / 12
      return (
        <span className="text-4xl font-semibold">{formatPlanPrice(monthlyEquivalent, currency, locale)}</span>
      )
    }

    return <span className="text-4xl font-semibold">{formatPlanPrice(amount, currency, locale)}</span>
  }

  const gridClass =
    variant === "landing"
      ? "grid gap-6 md:grid-cols-2 xl:grid-cols-4"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-2"

  return (
    <TooltipProvider>
      <div className={cn("flex flex-col gap-6", className)}>
        {showBillingToggle && onBillingCycleChange ? (
          <div className="flex flex-col items-center gap-2">
            <div className="inline-flex items-center gap-1 sm:gap-2 rounded-lg bg-muted p-1">
              <Button
                type="button"
                variant={billingCycle === "monthly" ? "default" : "ghost"}
                size="sm"
                onClick={() => onBillingCycleChange("monthly")}
                className="text-xs sm:text-sm"
              >
                {t("billing.monthly")}
              </Button>
              <Button
                type="button"
                variant={billingCycle === "yearly" ? "default" : "ghost"}
                size="sm"
                onClick={() => onBillingCycleChange("yearly")}
                className="text-xs sm:text-sm"
              >
                {t("billing.yearly")}
              </Button>
            </div>
            <Badge
              className={cn(
                "px-2 py-0.5 text-[10px] sm:text-xs",
                billingCycle === "yearly"
                  ? "bg-success text-success-foreground"
                  : "invisible",
              )}
            >
              {t("billing.save")}
            </Badge>
          </div>
        ) : null}

        <div className={gridClass}>
          {plans.map((plan) => {
            const planType = planTypeFromKey(plan.key)
            const isPopular = plan.highlight === true

            return (
              <Card
                key={plan.key}
                className={cn(
                  "relative flex flex-col overflow-visible rounded-2xl border border-primary/10 bg-background/90 shadow-sm transition duration-200",
                  isPopular && "border-primary/60 shadow-xl",
                )}
              >
                {isPopular ? (
                  <Badge className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary px-4 py-1 text-primary-foreground">
                    {t("mostLoved")}
                  </Badge>
                ) : null}

                <CardHeader className="gap-3">
                  <CardTitle className="text-xl capitalize">{t(`plans.${plan.key}.name`)}</CardTitle>
                  <div className="flex items-baseline gap-2">
                    {renderPrice(plan)}
                    {!plan.contactSales ? (
                      <span className="text-sm text-muted-foreground">{t("perMonth")}</span>
                    ) : null}
                  </div>
                  <p
                    className={cn(
                      "text-xs text-muted-foreground",
                      !(
                        billingCycle === "yearly" &&
                        plan.prices[currency].yearly > 0 &&
                        !plan.contactSales
                      ) && "invisible",
                    )}
                  >
                    {t("billedAnnually")}
                  </p>
                  <CardDescription>{t(`plans.${plan.key}.description`)}</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col gap-6 pb-8">
                  <ul className="space-y-3 text-sm leading-relaxed text-foreground/70">
                    {getPlanFeatures(plan).map((feature, index) => (
                      <li key={`${plan.key}-${index}`} className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        {index === 1 ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help underline decoration-dotted underline-offset-2">
                                {feature}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-xs">{t("creditsTooltip")}</TooltipContent>
                          </Tooltip>
                        ) : (
                          <span>{feature}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-0">
                  {variant === "landing" ? (
                    <Button
                      asChild
                      className={cn(
                        "w-full rounded-full px-6 py-5 text-sm font-semibold",
                        plan.key === "free" || plan.key === "business" ? "bg-transparent" : "",
                      )}
                      variant={plan.key === "free" || plan.key === "business" ? "outline" : "default"}
                    >
                      <Link href={plan.landingCtaHref} tabIndex={0}>
                        {t(`plans.${plan.key}.cta`)}
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => onSelectPlan?.(planType)}
                      disabled={loadingPlan !== null}
                      className="w-full text-sm"
                      variant={isPopular ? "default" : "outline"}
                    >
                      {loadingPlan === planType ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("loading")}
                        </>
                      ) : (
                        t("cta")
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
    </TooltipProvider>
  )
}
