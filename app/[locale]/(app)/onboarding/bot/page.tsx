import { getTranslations } from "next-intl/server"
import { redirect } from "next/navigation"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"
import { BotStep } from "@/components/onboarding/steps/bot-step"
import { getOnboardingStateAction } from "@/components/server-actions/onboarding"
import { localizePathname } from "@/i18n/pathname"
import { redirectIfOnboardingCompleted } from "@/lib/onboarding/page-guards"

export default async function OnboardingBotPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  await redirectIfOnboardingCompleted(locale)
  const t = await getTranslations("Onboarding.bot")

  const state = await getOnboardingStateAction()
  if (state.success && state.data && !state.data.companyId) {
    redirect(localizePathname("/onboarding/company", locale))
  }

  return (
    <OnboardingShell step={3} title={t("title")} description={t("description")}>
      <BotStep />
    </OnboardingShell>
  )
}
