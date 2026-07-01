import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"
import { PlanStep } from "@/components/onboarding/steps/plan-step"
import { getOnboardingStateAction } from "@/components/server-actions/onboarding"
import { redirectIfOnboardingCompleted } from "@/lib/onboarding/page-guards"
import { localizePathname } from "@/i18n/pathname"

export default async function OnboardingPlanPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ checkout?: string }>
}) {
  const { locale } = await params
  const { checkout } = await searchParams

  if (checkout !== "success") {
    await redirectIfOnboardingCompleted(locale)
  }

  const t = await getTranslations("Onboarding.plan")
  const state = await getOnboardingStateAction()

  if (state.success && state.data && !state.data.companyId) {
    redirect(localizePathname("/onboarding/company", locale))
  }

  const checkoutStatus =
    checkout === "success" ? "success" : checkout === "canceled" ? "canceled" : null

  return (
    <OnboardingShell step={4} title={t("title")} description={t("description")}>
      <PlanStep checkoutStatus={checkoutStatus} />
    </OnboardingShell>
  )
}
