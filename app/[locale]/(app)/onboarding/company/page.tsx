import { getTranslations } from "next-intl/server"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"
import { CompanyStep } from "@/components/onboarding/steps/company-step"
import { redirectIfOnboardingCompleted } from "@/lib/onboarding/page-guards"

export default async function OnboardingCompanyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  await redirectIfOnboardingCompleted(locale)
  const t = await getTranslations("Onboarding.company")

  return (
    <OnboardingShell step={1} title={t("title")} description={t("description")}>
      <CompanyStep />
    </OnboardingShell>
  )
}
