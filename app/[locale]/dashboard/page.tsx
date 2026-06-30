import type { CSSProperties } from "react"
import { getTranslations } from "next-intl/server"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import Dashboard from "@/components/dashboard/dashboard-page"
import { getDashboardMetricsAction } from "@/components/server-actions/dashboard"
import { getBotinhoSession } from "@/lib/botinho-auth"
import type { DashboardMetrics } from "@/lib/firebase/services/dashboard-service"

export const dynamic = "force-dynamic"

const emptyMetrics: DashboardMetrics = {
  messagesHandled: 0,
  messagesHandledChange: null,
  avgResponseTimeMs: null,
  avgResponseTimeChange: null,
  satisfactionRate: null,
  satisfactionChange: null,
  activeCustomers: 0,
  activeCustomersChange: null,
  messageVolume: [],
}

export default async function DashboardPage() {
  const t = await getTranslations("Dashboard")
  const session = await getBotinhoSession()
  const hasCompanyAccess = session.ok && Boolean(session.companyId)

  let metrics: DashboardMetrics | null = hasCompanyAccess ? emptyMetrics : null
  let loadError: string | null = null

  if (hasCompanyAccess) {
    const result = await getDashboardMetricsAction()

    if (!result.success || !result.data) {
      loadError = result.error || t("errors.loadFailed")
      metrics = emptyMetrics
    } else {
      metrics = result.data
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
          <div className="@container/main flex flex-1 flex-col gap-2 max-w-7xl w-full mx-auto">
            <div className="px-4 md:px-6 py-6 lg:px-8 space-y-6 md:space-y-8">
              <div className="space-y-2">
                <p className="text-muted-foreground">{t("description")}</p>
              </div>
              <Dashboard
                metrics={metrics}
                hasCompanyAccess={hasCompanyAccess}
                loadError={loadError}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
