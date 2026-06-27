import type { AiAgentRecord } from "@/lib/firebase/services/ai-agent-service"

export type AgentListItem = Pick<
  AiAgentRecord,
  "id" | "name" | "systemPrompt" | "sessionIds" | "autoReply"
>

export const mapAiAgentsToView = (agents: AiAgentRecord[]): AgentListItem[] =>
  agents.map(({ id, name, systemPrompt, sessionIds, autoReply }) => ({
    id,
    name,
    systemPrompt,
    sessionIds,
    autoReply,
  }))
