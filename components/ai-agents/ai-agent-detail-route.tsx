"use client"

import { useTranslations } from "next-intl"
import { AppShell } from "@/components/app-shell"
import AiAgentDetailPage from "@/components/ai-agents/ai-agent-detail-page"

type AiAgentDetailRouteProps = {
  agentId: string
}

export const AiAgentDetailRoute = ({ agentId }: AiAgentDetailRouteProps) => {
  const t = useTranslations("AiAgents")

  return (
    <AppShell title={t("title")}>
      <AiAgentDetailPage agentId={agentId} />
    </AppShell>
  )
}
