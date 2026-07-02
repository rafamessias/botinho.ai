import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import AuthSessionProvider from "@/components/session-provider"
import { UserProvider } from "@/components/user-provider"
import { OnboardingRedirectGuard } from "@/components/onboarding/onboarding-redirect-guard"
import { FirebaseSessionBridge } from "@/components/firebase-session-bridge"
import { Toaster } from "@/components/ui/sonner"
import { Toaster as ShadcnToaster } from "@/components/ui/toaster"

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AuthSessionProvider>
        <UserProvider>
          <FirebaseSessionBridge />
          <OnboardingRedirectGuard />
          {children}
        </UserProvider>
        <Toaster />
        <ShadcnToaster />
      </AuthSessionProvider>
    </NextIntlClientProvider>
  )
}
