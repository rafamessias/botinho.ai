import { getTranslations } from "next-intl/server"
import { AppShell } from "@/components/app-shell"
import Dashboard from "@/components/dashboard/dashboard-page"
import { getDashboardMetricsAction } from "@/components/server-actions/dashboard"
import { getBotinhoSession } from "@/lib/botinho-auth"
import type { DashboardMetrics } from "@/lib/firebase/services/dashboard-service"
import { enforceAppAccess } from "@/lib/onboarding/enforce-app-access"

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
  await enforceAppAccess()
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
    <AppShell title={t("title")} description={t("description")}>
      <Dashboard
        metrics={metrics}
        hasCompanyAccess={hasCompanyAccess}
        loadError={loadError}
      />
    </AppShell>
  )
}
