import { getTranslations } from "next-intl/server"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"
import { WhatsAppStep } from "@/components/onboarding/steps/whatsapp-step"
import { getOnboardingStateAction } from "@/components/server-actions/onboarding"
import { redirectIfOnboardingCompleted } from "@/lib/onboarding/page-guards"
import { redirect } from "next/navigation"
import { localizePathname } from "@/i18n/pathname"

export default async function OnboardingWhatsAppPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  await redirectIfOnboardingCompleted(locale)
  const t = await getTranslations("Onboarding.whatsapp")

  const state = await getOnboardingStateAction()
  if (state.success && state.data && !state.data.companyId) {
    redirect(localizePathname("/onboarding/company", locale))
  }

  return (
    <OnboardingShell step={2} title={t("title")} description={t("description")}>
      <WhatsAppStep whatsAppConfigured={state.data?.whatsAppConfigured ?? false} />
    </OnboardingShell>
  )
}
