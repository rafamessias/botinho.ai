import type { CSSProperties } from "react"
import { getTranslations } from "next-intl/server"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import CampaignsPage from "@/components/customer-interaction/campaigns-page"
import {
  listAgentsForCampaignAction,
  listCampaignsAction,
  listCompanyTagsAction,
  type CampaignSummaryView,
} from "@/components/server-actions/campaigns"
import { getBotinhoSession } from "@/lib/botinho-auth"

export const dynamic = "force-dynamic"

export default async function CampaignsRoutePage() {
  const t = await getTranslations("Campaigns")
  const session = await getBotinhoSession()
  const hasCompanyAccess = session.ok && Boolean(session.companyId)

  let initialCampaigns: CampaignSummaryView[] = []
  let initialAvailableTags: string[] = []
  let initialAgents: Array<{ id: string; name: string; sessionIds: string[]; autoReply: boolean }> =
    []
  let initialLoadError: string | null = null

  if (hasCompanyAccess) {
    const [campaignsResult, tagsResult, agentsResult] = await Promise.all([
      listCampaignsAction(),
      listCompanyTagsAction(),
      listAgentsForCampaignAction(),
    ])

    if (!campaignsResult.success || !campaignsResult.data) {
      initialLoadError = campaignsResult.error || t("errors.loadFailed")
    } else {
      initialCampaigns = campaignsResult.data.campaigns.filter(
        (campaign) => campaign.status !== "cancelled",
      )
      if (tagsResult.success && tagsResult.data) {
        initialAvailableTags = tagsResult.data.tags
      }
      if (agentsResult.success && agentsResult.data) {
        initialAgents = agentsResult.data.agents
      }
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
              <CampaignsPage
                hasCompanyAccess={hasCompanyAccess}
                initialCampaigns={initialCampaigns}
                initialAvailableTags={initialAvailableTags}
                initialAgents={initialAgents}
                initialLoadError={initialLoadError}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
