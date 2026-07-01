import { AiAgentDetailRoute } from "@/components/ai-agents/ai-agent-detail-route"
import { enforceAppAccess } from "@/lib/onboarding/enforce-app-access"

type AiAgentDetailPageProps = {
    params: Promise<{ agentId: string; locale: string }>
}

export default async function AiAgentDetailPageRoute({ params }: AiAgentDetailPageProps) {
    await enforceAppAccess()
    const { agentId } = await params
    return <AiAgentDetailRoute agentId={agentId} />
}
