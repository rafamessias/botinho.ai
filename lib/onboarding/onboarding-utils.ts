import type { FirestoreUser, OnboardingStep } from "@/lib/firebase/types"

export const ONBOARDING_REQUIRED_ERROR = "ONBOARDING_REQUIRED"

export const resolveOnboardingStatus = (user: Pick<FirestoreUser, "onboardingStatus" | "defaultCompanyId">) => {
  if (user.onboardingStatus === "completed") {
    return "completed" as const
  }
  if (user.onboardingStatus === "pending") {
    return "pending" as const
  }
  if (user.defaultCompanyId) {
    return "completed" as const
  }
  return "pending" as const
}

export const resolveOnboardingStep = (user: Pick<FirestoreUser, "onboardingStep" | "defaultCompanyId">): OnboardingStep => {
  if (user.onboardingStep && user.onboardingStep >= 1 && user.onboardingStep <= 4) {
    return user.onboardingStep
  }
  return user.defaultCompanyId ? 4 : 1
}

export const onboardingStepToPath = (step: OnboardingStep): string => {
  switch (step) {
    case 1:
      return "/onboarding/company"
    case 2:
      return "/onboarding/whatsapp"
    case 3:
      return "/onboarding/bot"
    case 4:
      return "/onboarding/plan"
  }
}

export const isOnboardingPath = (pathname: string) => pathname.startsWith("/onboarding")
