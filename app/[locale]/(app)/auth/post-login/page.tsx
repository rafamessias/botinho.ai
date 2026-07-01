import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { auth } from "@/app/auth"
import { resolvePostLoginRedirectPath } from "@/lib/post-login-redirect"
import { localizePathname } from "@/i18n/pathname"
import { routing } from "@/i18n/routing"

type AppLocale = (typeof routing.locales)[number]

const normalizeLocale = (value: string): AppLocale =>
  routing.locales.includes(value as AppLocale) ? (value as AppLocale) : routing.defaultLocale

export default async function PostLoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ redirect?: string }>
}) {
  const { locale: rawLocale } = await params
  const locale = normalizeLocale(rawLocale)
  const { redirect: redirectParam } = await searchParams
  const session = await auth()

  if (!session?.user?.email) {
    redirect(localizePathname("/sign-in", locale))
  }

  const cookieStore = await cookies()
  const oauthRedirect = cookieStore.get("oauth_redirect")?.value ?? null
  const deepLink = redirectParam ?? oauthRedirect

  if (oauthRedirect) {
    cookieStore.delete("oauth_redirect")
  }

  const target = await resolvePostLoginRedirectPath({
    userEmail: session.user.email,
    locale,
    deepLink,
  })

  redirect(target)
}
