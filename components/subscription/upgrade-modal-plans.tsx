"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Zap } from "lucide-react"
import { useRouter } from "next/navigation"

import { PlanPricingCards } from "@/components/pricing/plan-pricing-cards"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createCheckoutSession } from "@/components/server-actions/subscription"
import { getUpgradePlans, localeToCurrency } from "@/lib/plan-catalog"
import { PlanType } from "@/lib/types/enums"
import { useToast } from "@/hooks/use-toast"

interface UpgradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  showUpgradeButton?: boolean
}

export const UpgradeModalPlans = ({
  open,
  onOpenChange,
  showUpgradeButton = true,
}: UpgradeModalProps) => {
  const t = useTranslations("Subscription.upgradeModal")
  const locale = useLocale()
  const currency = localeToCurrency(locale)
  const [isLoading, setIsLoading] = useState<PlanType | null>(null)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly")
  const { toast } = useToast()
  const router = useRouter()

  const handleUpgrade = async (planType: PlanType) => {
    if (!showUpgradeButton) {
      return
    }

    setIsLoading(planType)
    try {
      const result = await createCheckoutSession(planType, billingCycle, currency)
      if (result.success && result.checkoutUrl) {
        router.push(result.checkoutUrl)
      } else {
        toast({
          title: t("error.title"),
          description: result.error || t("error.description"),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating checkout session:", error)
      toast({
        title: t("error.title"),
        description: t("error.description"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] max-w-[95vw] overflow-hidden p-0 sm:max-h-[90vh] sm:max-w-[90vw] lg:max-w-5xl">
        <div className="flex max-h-[95vh] flex-col sm:max-h-[90vh]">
          <DialogHeader className="px-4 pb-2 pt-4 sm:px-6 sm:pb-4 sm:pt-6">
            <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl">
              <Zap className="h-5 w-5 text-rating sm:h-6 sm:w-6" />
              {t("title")}
            </DialogTitle>
            <DialogDescription className="text-sm">{t("description")}</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-4 pb-4 pt-2 sm:px-6">
            <PlanPricingCards
              plans={getUpgradePlans()}
              currency={currency}
              locale={locale}
              billingCycle={billingCycle}
              onBillingCycleChange={setBillingCycle}
              variant="modal"
              onSelectPlan={handleUpgrade}
              loadingPlan={isLoading}
            />

            <p className="pb-2 pt-3 text-center text-[10px] text-muted-foreground sm:mt-4 sm:text-xs">
              {t("footer")}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
