import { getUserProfile } from "@/lib/firebase/services/user-service"
import { localizePathname } from "@/i18n/pathname"
import {
  onboardingStepToPath,
  resolveOnboardingStatus,
  resolveOnboardingStep,
} from "@/lib/onboarding/onboarding-utils"

export const getAppAccessRedirect = async (uid: string, locale: string): Promise<string | null> => {
  const profile = await getUserProfile(uid)
  if (!profile) {
    return localizePathname("/sign-in", locale)
  }

  if (resolveOnboardingStatus(profile) === "pending") {
    const step = resolveOnboardingStep(profile)
    return localizePathname(onboardingStepToPath(step), locale)
  }

  return null
}

export const getOnboardingRedirectForCompletedUser = async (
  uid: string,
  locale: string,
): Promise<string | null> => {
  const profile = await getUserProfile(uid)
  if (!profile) {
    return localizePathname("/sign-in", locale)
  }

  if (resolveOnboardingStatus(profile) === "completed") {
    return localizePathname("/dashboard", locale)
  }

  return null
}
