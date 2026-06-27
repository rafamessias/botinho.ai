import type { CSSProperties } from "react"
import { getTranslations } from "next-intl/server"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import CustomerPage from "@/components/customer/customer-page"
import { listCustomersAction } from "@/components/server-actions/customers"
import { getBotinhoSession } from "@/lib/botinho-auth"
import type { Customer } from "@/lib/types/customer"

export const dynamic = "force-dynamic"

export default async function CustomerRoute() {
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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title={t("title")} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main mx-auto flex w-full max-w-7xl flex-1 flex-col gap-2">
            <div className="space-y-6 px-4 py-6 md:space-y-8 md:px-6 lg:px-8">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground sm:text-base">{t("description")}</p>
              </div>
              <CustomerPage
                initialCustomers={initialCustomers}
                initialLoadError={initialLoadError}
                hasCompanyAccess={hasCompanyAccess}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
