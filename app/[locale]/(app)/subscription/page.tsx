import { getTranslations } from "next-intl/server"
import { AppShell } from "@/components/app-shell"
import { SubscriptionPage } from "@/components/subscription/subscription-page"
import { getSubscriptionData, handleCanceledCheckout } from "@/components/server-actions/subscription"
import { enforceAppAccess } from "@/lib/onboarding/enforce-app-access"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface SubscriptionProps {
  searchParams: Promise<{
    canceled?: string
  }>
}

export default async function Subscription({ searchParams }: SubscriptionProps) {
  await enforceAppAccess()
  const t = await getTranslations("Subscription")

  const params = await searchParams
  let checkoutCanceled = false
  if (params.canceled === "true") {
    const cancelResult = await handleCanceledCheckout()
    checkoutCanceled = cancelResult.converted || false
  }

  const subscriptionData = await getSubscriptionData()

  return (
    <AppShell title={t("title")} description={t("description")}>
      <SubscriptionPage
        subscriptionData={subscriptionData}
        checkoutCanceled={checkoutCanceled}
      />
    </AppShell>
  )
}
