import type { CSSProperties } from "react"
import { getTranslations } from "next-intl/server"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import AiAgentsListPage from "@/components/ai-agents/ai-agents-list-page"
import { listAiAgentsAction } from "@/components/server-actions/ai-agents"
import { mapAiAgentsToView } from "@/components/ai-agents/map-agent-views"
import { getBotinhoSession } from "@/lib/botinho-auth"

export const dynamic = "force-dynamic"

export default async function AiAgentsPage() {
  const t = await getTranslations("AiAgents")
  const session = await getBotinhoSession()
  const hasCompanyAccess = session.ok && Boolean(session.companyId)

  let initialAgents = mapAiAgentsToView([])
  let initialLoadError: string | null = null

  if (hasCompanyAccess) {
    const result = await listAiAgentsAction()
    if (!result.success || !result.data) {
      initialLoadError = result.error || t("errors.loadFailed")
    } else {
      initialAgents = mapAiAgentsToView(result.data.agents)
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
              <AiAgentsListPage
                initialAgents={initialAgents}
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
