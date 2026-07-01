import { getLocale } from "next-intl/server"
import { redirectIfNoAppAccess } from "@/lib/onboarding/page-guards"

export const enforceAppAccess = async () => {
  await redirectIfNoAppAccess(await getLocale())
}
