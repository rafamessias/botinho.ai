import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import {
  MARKETING_MESSAGE_NAMESPACES,
  pickMessages,
} from "@/lib/i18n/pick-messages"

export default async function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={pickMessages(messages, [...MARKETING_MESSAGE_NAMESPACES])}
    >
      {children}
    </NextIntlClientProvider>
  )
}
