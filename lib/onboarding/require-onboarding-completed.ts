import { getUserProfile } from "@/lib/firebase/services/user-service"
import { ONBOARDING_REQUIRED_ERROR, resolveOnboardingStatus } from "@/lib/onboarding/onboarding-utils"

export const requireOnboardingCompleted = async (uid: string) => {
  const profile = await getUserProfile(uid)
  if (!profile) {
    return { ok: false as const, error: "User not found" }
  }

  if (resolveOnboardingStatus(profile) === "pending") {
    return { ok: false as const, error: ONBOARDING_REQUIRED_ERROR }
  }

  return { ok: true as const, profile }
}
