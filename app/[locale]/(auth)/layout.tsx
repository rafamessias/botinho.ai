import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import AuthSessionProvider from "@/components/session-provider"
import { Toaster } from "@/components/ui/sonner"
import { Toaster as ShadcnToaster } from "@/components/ui/toaster"
import { AUTH_MESSAGE_NAMESPACES, pickMessages } from "@/lib/i18n/pick-messages"

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={pickMessages(messages, [...AUTH_MESSAGE_NAMESPACES])}>
      <AuthSessionProvider>
        {children}
        <Toaster />
        <ShadcnToaster />
      </AuthSessionProvider>
    </NextIntlClientProvider>
  )
}
