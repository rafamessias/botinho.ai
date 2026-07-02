import { adminAuth } from "@/lib/firebase/admin"
import { getUserProfile } from "@/lib/firebase/services/user-service"
import { validateUserCompanyAndSubscription } from "@/components/server-actions/auth"
import { localizePathname } from "@/i18n/pathname"
import {
  onboardingStepToPath,
  resolveOnboardingStatus,
  resolveOnboardingStep,
} from "@/lib/onboarding/onboarding-utils"

export type PostLoginRedirectInput = {
  userEmail: string
  locale: string
  deepLink?: string | null
}

const isSafeRedirectPath = (path: string | null | undefined): path is string =>
  Boolean(path && path.startsWith("/") && !path.startsWith("//"))

export const resolvePostLoginRedirectPath = async ({
  userEmail,
  locale,
  deepLink,
}: PostLoginRedirectInput): Promise<string> => {
  const authUser = await adminAuth.getUserByEmail(userEmail.toLowerCase())
  const profile = await getUserProfile(authUser.uid)

  if (profile && resolveOnboardingStatus(profile) === "pending") {
    const step = resolveOnboardingStep(profile)
    return localizePathname(onboardingStepToPath(step), locale)
  }

  const subscriptionCheck = await validateUserCompanyAndSubscription(userEmail)

  if (subscriptionCheck?.needsCheckout && subscriptionCheck.checkoutUrl) {
    return subscriptionCheck.checkoutUrl
  }

  if (isSafeRedirectPath(deepLink)) {
    return localizePathname(deepLink, locale)
  }

  return localizePathname("/dashboard", locale)
}
