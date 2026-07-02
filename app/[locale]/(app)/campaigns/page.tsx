import { getTranslations } from "next-intl/server"
import { AppShell } from "@/components/app-shell"
import CampaignsPage from "@/components/customer-interaction/campaigns-page"
import {
  listAgentsForCampaignAction,
  listCampaignsAction,
  listCompanyTagsAction,
  type CampaignSummaryView,
} from "@/components/server-actions/campaigns"
import { getBotinhoSession } from "@/lib/botinho-auth"
import { enforceAppAccess } from "@/lib/onboarding/enforce-app-access"

export const dynamic = "force-dynamic"

export default async function CampaignsRoutePage() {
  await enforceAppAccess()
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
    <AppShell title={t("title")} description={t("description")}>
      <CampaignsPage
        hasCompanyAccess={hasCompanyAccess}
        initialCampaigns={initialCampaigns}
        initialAvailableTags={initialAvailableTags}
        initialAgents={initialAgents}
        initialLoadError={initialLoadError}
      />
    </AppShell>
  )
}
