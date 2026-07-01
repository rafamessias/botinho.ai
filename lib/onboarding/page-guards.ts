import { redirect } from "next/navigation"
import { auth } from "@/app/auth"
import { localizePathname } from "@/i18n/pathname"
import { getAppAccessRedirect, getOnboardingRedirectForCompletedUser } from "@/lib/onboarding/app-access"

export const redirectIfNoAppAccess = async (locale: string) => {
  const session = await auth()
  if (!session?.user?.id) {
    redirect(localizePathname("/sign-in", locale))
  }

  const target = await getAppAccessRedirect(session.user.id, locale)
  if (target) {
    redirect(target)
  }
}

export const redirectIfOnboardingCompleted = async (locale: string) => {
  const session = await auth()
  if (!session?.user?.id) {
    redirect(localizePathname("/sign-in", locale))
  }

  const target = await getOnboardingRedirectForCompletedUser(session.user.id, locale)
  if (target) {
    redirect(target)
  }
}
