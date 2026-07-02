import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { auth } from "@/app/auth"
import { localizePathname } from "@/i18n/pathname"
import { getUserProfile } from "@/lib/firebase/services/user-service"
import { redirectIfOnboardingCompleted } from "@/lib/onboarding/page-guards"
import { onboardingStepToPath, resolveOnboardingStep } from "@/lib/onboarding/onboarding-utils"

export default async function OnboardingIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  await redirectIfOnboardingCompleted(locale)

  const session = await auth()
  if (!session?.user?.id) {
    redirect(localizePathname("/sign-in", locale))
  }

  const profile = await getUserProfile(session.user.id)
  const step = profile ? resolveOnboardingStep(profile) : 1
  redirect(localizePathname(onboardingStepToPath(step), locale))
}
