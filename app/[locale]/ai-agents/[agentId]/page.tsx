import { AiAgentDetailRoute } from "@/components/ai-agents/ai-agent-detail-route"

type AiAgentDetailPageProps = {
    params: Promise<{ agentId: string; locale: string }>
}

export default async function AiAgentDetailPageRoute({ params }: AiAgentDetailPageProps) {
    const { agentId } = await params
    return <AiAgentDetailRoute agentId={agentId} />
}
