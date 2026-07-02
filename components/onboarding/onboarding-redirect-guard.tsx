"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { getOnboardingStateAction } from "@/components/server-actions/onboarding"
import { stripLocalePrefix } from "@/i18n/pathname"

export const OnboardingRedirectGuard = () => {
  const { status } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (status !== "authenticated") {
      return
    }

    const { pathname: basePath } = stripLocalePrefix(pathname)
    if (basePath.startsWith("/onboarding") || basePath.startsWith("/auth/")) {
      return
    }

    void getOnboardingStateAction().then((result) => {
      if (result.success && result.data?.status === "pending") {
        router.replace("/onboarding")
      }
    })
  }, [pathname, router, status])

  return null
}
