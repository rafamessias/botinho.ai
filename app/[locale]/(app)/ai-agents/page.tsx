import { getTranslations } from "next-intl/server"
import { AppShell } from "@/components/app-shell"
import AiAgentsListPage from "@/components/ai-agents/ai-agents-list-page"
import { getAgentPhoneOptionsAction, listAiAgentsAction } from "@/components/server-actions/ai-agents"
import type { WhatsAppSessionOption } from "@/components/server-actions/ai-agents"
import { mapAiAgentsToView } from "@/components/ai-agents/map-agent-views"
import { getBotinhoSession } from "@/lib/botinho-auth"
import { enforceAppAccess } from "@/lib/onboarding/enforce-app-access"

export const dynamic = "force-dynamic"

export default async function AiAgentsPage() {
  await enforceAppAccess()
  const t = await getTranslations("AiAgents")
  const session = await getBotinhoSession()
  const hasCompanyAccess = session.ok && Boolean(session.companyId)

  let initialAgents = mapAiAgentsToView([])
  let initialSessions: WhatsAppSessionOption[] = []
  let initialLoadError: string | null = null

  if (hasCompanyAccess) {
    const [agentsResult, sessionsResult] = await Promise.all([
      listAiAgentsAction(),
      getAgentPhoneOptionsAction(),
    ])

    if (!agentsResult.success || !agentsResult.data) {
      initialLoadError = agentsResult.error || t("errors.loadFailed")
    } else {
      initialAgents = mapAiAgentsToView(agentsResult.data.agents)
    }

    if (sessionsResult.success && sessionsResult.data) {
      initialSessions = sessionsResult.data.sessions
    }
  }

  return (
    <AppShell title={t("title")} description={t("description")}>
      <AiAgentsListPage
        initialAgents={initialAgents}
        initialSessions={initialSessions}
        initialLoadError={initialLoadError}
        hasCompanyAccess={hasCompanyAccess}
      />
    </AppShell>
  )
}
