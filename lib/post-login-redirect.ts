import { validateUserCompanyAndSubscription } from "@/components/server-actions/auth"
import { localizePathname } from "@/i18n/pathname"

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
  const subscriptionCheck = await validateUserCompanyAndSubscription(userEmail)

  if (subscriptionCheck?.needsCheckout && subscriptionCheck.checkoutUrl) {
    return subscriptionCheck.checkoutUrl
  }

  if (isSafeRedirectPath(deepLink)) {
    return localizePathname(deepLink, locale)
  }

  return localizePathname("/dashboard", locale)
}
