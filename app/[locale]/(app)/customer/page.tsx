import { getTranslations } from "next-intl/server"
import { AppShell } from "@/components/app-shell"
import CustomerPage from "@/components/customer/customer-page"
import { listCustomersAction } from "@/components/server-actions/customers"
import { getBotinhoSession } from "@/lib/botinho-auth"
import type { Customer } from "@/lib/types/customer"
import { enforceAppAccess } from "@/lib/onboarding/enforce-app-access"

export const dynamic = "force-dynamic"

export default async function CustomerRoute() {
  await enforceAppAccess()
  const t = await getTranslations("Customer")
  const session = await getBotinhoSession()
  const hasCompanyAccess = session.ok && Boolean(session.companyId)

  let initialCustomers: Customer[] = []
  let initialLoadError: string | null = null

  if (hasCompanyAccess) {
    const result = await listCustomersAction({ pageSize: 200 })
    if (!result.success || !result.data) {
      initialLoadError = result.error || t("messages.loadFailed")
    } else {
      initialCustomers = result.data.customers
    }
  }

  return (
    <AppShell title={t("title")} description={t("description")}>
      <CustomerPage
        initialCustomers={initialCustomers}
        initialLoadError={initialLoadError}
        hasCompanyAccess={hasCompanyAccess}
      />
    </AppShell>
  )
}
