"use server"

import { z } from "zod"
import { AiTemplateCategory, KnowledgeItemType } from "@/lib/types/enums"
import { BaseActionResponse, handleAction, resolveCompanyContext } from "./utils"
import {
  createAgentKnowledgeItem,
  createAgentQuickAnswer,
  createAgentTemplate,
  createAiAgent,
  deleteAgentKnowledgeItem,
  deleteAgentQuickAnswer,
  deleteAgentTemplate,
  deleteAiAgent,
  filterAgentWithValidSessionIds,
  filterAgentsWithValidSessionIds,
  getAiAgent,
  listAgentSessionAssignmentConflicts,
  listAgentTrainingData,
  listAiAgents,
  pruneStaleSessionIdsFromAgents,
  updateAgentKnowledgeItem,
  updateAgentQuickAnswer,
  updateAgentTemplate,
  updateAiAgent,
} from "@/lib/firebase/services/ai-agent-service"
import { summarizeUrlContent } from "@/lib/firebase/ai/generate"
import { DEFAULT_SURVEY_TRIGGERS } from "@/lib/types/survey"
import {
  knowledgeItemInputSchema,
  resolveKnowledgeItemInput,
} from "@/lib/knowledge/resolve-knowledge-input"
import { getWhatsAppOrchestrator, isWhatsAppConfigured } from "@/lib/whatsapp"
import type { WhatsAppSession } from "@/lib/whatsapp/types"

const agentIdSchema = z.object({ agentId: z.string().min(1) })

const listCompanySessionIds = async (companyId: string): Promise<string[]> => {
  if (!isWhatsAppConfigured()) {
    return []
  }

  const orchestrator = await getWhatsAppOrchestrator()
  const sessions = await orchestrator.listSessions(companyId)
  return sessions.map((session) => session.sessionId)
}

const syncAgentSessionIds = async (companyId: string) => {
  const validSessionIds = await listCompanySessionIds(companyId)
  await pruneStaleSessionIdsFromAgents(companyId, validSessionIds)
  return validSessionIds
}

export const listAiAgentsAction = async (): Promise<
  BaseActionResponse<{ agents: Awaited<ReturnType<typeof listAiAgents>> }>
> =>
  handleAction(async () => {
    const { companyId, userId } = await resolveCompanyContext()
    const agents = await listAiAgents(companyId, userId)
    const validSessionIds = await syncAgentSessionIds(companyId)
    return {
      success: true,
      data: { agents: filterAgentsWithValidSessionIds(agents, validSessionIds) },
    }
  })

export const getAiAgentAction = async (
  input: z.infer<typeof agentIdSchema>,
): Promise<BaseActionResponse<{ agent: NonNullable<Awaited<ReturnType<typeof getAiAgent>>> }>> =>
  handleAction(async () => {
    const { agentId } = agentIdSchema.parse(input)
    const { companyId } = await resolveCompanyContext()
    const agent = await getAiAgent(companyId, agentId)
    if (!agent) {
      throw new Error("Botinho not found")
    }
    const validSessionIds = await syncAgentSessionIds(companyId)
    return { success: true, data: { agent: filterAgentWithValidSessionIds(agent, validSessionIds) } }
  })

const createAgentSchema = z.object({
  name: z.string().trim().min(1).max(120),
  systemPrompt: z.string().trim().max(4000).optional(),
  sessionIds: z.array(z.string().min(1)).optional(),
  autoReply: z.boolean().optional(),
  ticketsEnabled: z.boolean().optional(),
  schedulingEnabled: z.boolean().optional(),
  language: z.enum(["en", "pt-BR", "auto"]).optional(),
})

export const createAiAgentAction = async (
  input: z.infer<typeof createAgentSchema>,
): Promise<BaseActionResponse<{ agent: Awaited<ReturnType<typeof createAiAgent>> }>> =>
  handleAction(async () => {
    const payload = createAgentSchema.parse(input)
    const { companyId, userId } = await resolveCompanyContext({ requireCanPost: true })
    const agent = await createAiAgent(companyId, userId, payload)
    return { success: true, data: { agent }, message: "Botinho created" }
  })

const updateAgentSchema = agentIdSchema.merge(
  z.object({
    name: z.string().trim().min(1).max(120).optional(),
    systemPrompt: z.string().trim().max(4000).optional(),
    sessionIds: z.array(z.string().min(1)).optional(),
    autoReply: z.boolean().optional(),
    ticketsEnabled: z.boolean().optional(),
    schedulingEnabled: z.boolean().optional(),
    language: z.enum(["en", "pt-BR", "auto"]).optional(),
    surveyIds: z.array(z.string()).optional(),
    surveyTriggers: z
      .object({
        onConversationClose: z.boolean().optional(),
        onEscalation: z.boolean().optional(),
        proactiveOffer: z.boolean().optional(),
        closeKeywords: z.array(z.string()).optional(),
      })
      .optional(),
  }),
)

export const updateAiAgentAction = async (
  input: z.infer<typeof updateAgentSchema>,
): Promise<BaseActionResponse<{ agent: Awaited<ReturnType<typeof updateAiAgent>> }>> =>
  handleAction(async () => {
    const payload = updateAgentSchema.parse(input)
    const { companyId } = await resolveCompanyContext({ requireCanPost: true })
    const { agentId, ...updates } = payload
    const agent = await updateAiAgent(companyId, agentId, {
      ...updates,
      surveyTriggers: updates.surveyTriggers
        ? { ...DEFAULT_SURVEY_TRIGGERS, ...updates.surveyTriggers }
        : undefined,
    })
    return { success: true, data: { agent }, message: "Botinho updated" }
  })

const checkSessionAssignmentSchema = agentIdSchema.merge(
  z.object({
    sessionIds: z.array(z.string().min(1)).min(1),
  }),
)

export const checkAgentSessionAssignmentConflictsAction = async (
  input: z.infer<typeof checkSessionAssignmentSchema>,
): Promise<
  BaseActionResponse<{
    conflicts: Awaited<ReturnType<typeof listAgentSessionAssignmentConflicts>>
  }>
> =>
  handleAction(async () => {
    const payload = checkSessionAssignmentSchema.parse(input)
    const { companyId } = await resolveCompanyContext()
    const conflicts = await listAgentSessionAssignmentConflicts(
      companyId,
      payload.sessionIds,
      payload.agentId,
    )
    return { success: true, data: { conflicts } }
  })

export const deleteAiAgentAction = async (
  input: z.infer<typeof agentIdSchema>,
): Promise<BaseActionResponse> =>
  handleAction(async () => {
    const { agentId } = agentIdSchema.parse(input)
    const { companyId } = await resolveCompanyContext({ requireCanPost: true })
    await deleteAiAgent(companyId, agentId)
    return { success: true, message: "Botinho deleted" }
  })

export const getAgentTrainingDataAction = async (
  input: z.infer<typeof agentIdSchema>,
): Promise<BaseActionResponse<Awaited<ReturnType<typeof listAgentTrainingData>>>> =>
  handleAction(async () => {
    const { agentId } = agentIdSchema.parse(input)
    const { companyId } = await resolveCompanyContext()
    const data = await listAgentTrainingData(companyId, agentId)
    return { success: true, data }
  })

const updateKnowledgeItemSchema = knowledgeItemInputSchema
  .and(agentIdSchema)
  .and(z.object({ id: z.string().min(1) }))

export const createAgentKnowledgeItemAction = async (
  input: z.infer<typeof knowledgeItemInputSchema> & z.infer<typeof agentIdSchema>,
): Promise<
  BaseActionResponse<{ knowledgeItem: Awaited<ReturnType<typeof createAgentKnowledgeItem>> }>
> =>
  handleAction(async () => {
    const payload = knowledgeItemInputSchema.and(agentIdSchema).parse(input)
    const { companyId, userId } = await resolveCompanyContext({ requireCanPost: true })

    const { agentId, ...itemInput } = payload
    const resolved = await resolveKnowledgeItemInput(itemInput)

    let urlSummary: string | undefined
    if (resolved.type === KnowledgeItemType.URL) {
      urlSummary = await summarizeUrlContent({ url: resolved.content, title: resolved.title })
    }

    const knowledgeItem = await createAgentKnowledgeItem(companyId, agentId, userId, {
      ...resolved,
      urlSummary,
    })
    return { success: true, data: { knowledgeItem }, message: "Knowledge item created" }
  })

export const updateAgentKnowledgeItemAction = async (
  input: z.infer<typeof updateKnowledgeItemSchema>,
): Promise<
  BaseActionResponse<{ knowledgeItem: Awaited<ReturnType<typeof updateAgentKnowledgeItem>> }>
> =>
  handleAction(async () => {
    const payload = updateKnowledgeItemSchema.parse(input)
    const { companyId } = await resolveCompanyContext({ requireCanPost: true })

    const { agentId, id, ...itemInput } = payload
    const resolved = await resolveKnowledgeItemInput(itemInput)

    let urlSummary: string | undefined
    if (resolved.type === KnowledgeItemType.URL) {
      urlSummary = await summarizeUrlContent({ url: resolved.content, title: resolved.title })
    }

    const knowledgeItem = await updateAgentKnowledgeItem(companyId, agentId, id, {
      ...resolved,
      urlSummary,
    })
    return { success: true, data: { knowledgeItem }, message: "Knowledge item updated" }
  })

export const deleteAgentKnowledgeItemAction = async (
  input: z.infer<typeof agentIdSchema> & { id: string },
): Promise<BaseActionResponse> =>
  handleAction(async () => {
    const payload = agentIdSchema.extend({ id: z.string().min(1) }).parse(input)
    const { companyId } = await resolveCompanyContext({ requireCanPost: true })
    await deleteAgentKnowledgeItem(companyId, payload.agentId, payload.id)
    return { success: true, message: "Knowledge item deleted" }
  })

const quickAnswerBaseSchema = agentIdSchema.merge(
  z.object({ content: z.string().trim().min(1) }),
)

export const createAgentQuickAnswerAction = async (
  input: z.infer<typeof quickAnswerBaseSchema>,
): Promise<BaseActionResponse<{ quickAnswer: Awaited<ReturnType<typeof createAgentQuickAnswer>> }>> =>
  handleAction(async () => {
    const payload = quickAnswerBaseSchema.parse(input)
    const { companyId, userId } = await resolveCompanyContext({ requireCanPost: true })
    const quickAnswer = await createAgentQuickAnswer(
      companyId,
      payload.agentId,
      userId,
      payload.content,
    )
    return { success: true, data: { quickAnswer }, message: "Quick answer created" }
  })

export const updateAgentQuickAnswerAction = async (
  input: z.infer<typeof quickAnswerBaseSchema> & { id: string },
): Promise<BaseActionResponse<{ quickAnswer: Awaited<ReturnType<typeof updateAgentQuickAnswer>> }>> =>
  handleAction(async () => {
    const payload = quickAnswerBaseSchema.extend({ id: z.string().min(1) }).parse(input)
    const { companyId } = await resolveCompanyContext({ requireCanPost: true })
    const quickAnswer = await updateAgentQuickAnswer(
      companyId,
      payload.agentId,
      payload.id,
      payload.content,
    )
    return { success: true, data: { quickAnswer }, message: "Quick answer updated" }
  })

export const deleteAgentQuickAnswerAction = async (
  input: z.infer<typeof agentIdSchema> & { id: string },
): Promise<BaseActionResponse> =>
  handleAction(async () => {
    const payload = agentIdSchema.extend({ id: z.string().min(1) }).parse(input)
    const { companyId } = await resolveCompanyContext({ requireCanPost: true })
    await deleteAgentQuickAnswer(companyId, payload.agentId, payload.id)
    return { success: true, message: "Quick answer deleted" }
  })

const templateOptionSchema = z.object({
  label: z.string().trim().min(1),
  value: z.string().trim().min(1),
})

const templateBaseSchema = agentIdSchema.merge(
  z.object({
    name: z.string().trim().min(1),
    content: z.string().trim().min(1),
    category: z.nativeEnum(AiTemplateCategory),
    options: z.array(templateOptionSchema).max(10).optional(),
  }),
)

export const createAgentTemplateAction = async (
  input: z.infer<typeof templateBaseSchema>,
): Promise<BaseActionResponse<{ template: Awaited<ReturnType<typeof createAgentTemplate>> }>> =>
  handleAction(async () => {
    const payload = templateBaseSchema.parse(input)
    const { companyId, userId } = await resolveCompanyContext({ requireCanPost: true })
    const { agentId, ...templateInput } = payload
    const template = await createAgentTemplate(companyId, agentId, userId, templateInput)
    return { success: true, data: { template }, message: "Template created" }
  })

export const updateAgentTemplateAction = async (
  input: z.infer<typeof templateBaseSchema> & { id: string },
): Promise<BaseActionResponse<{ template: Awaited<ReturnType<typeof updateAgentTemplate>> }>> =>
  handleAction(async () => {
    const payload = templateBaseSchema.extend({ id: z.string().min(1) }).parse(input)
    const { companyId } = await resolveCompanyContext({ requireCanPost: true })
    const { agentId, id, ...templateInput } = payload
    const template = await updateAgentTemplate(companyId, agentId, id, templateInput)
    return { success: true, data: { template }, message: "Template updated" }
  })

export const deleteAgentTemplateAction = async (
  input: z.infer<typeof agentIdSchema> & { id: string },
): Promise<BaseActionResponse> =>
  handleAction(async () => {
    const payload = agentIdSchema.extend({ id: z.string().min(1) }).parse(input)
    const { companyId } = await resolveCompanyContext({ requireCanPost: true })
    await deleteAgentTemplate(companyId, payload.agentId, payload.id)
    return { success: true, message: "Template deleted" }
  })

export type WhatsAppSessionOption = {
  sessionId: string
  label: string | null
  phoneNumber: string | null
  status: WhatsAppSession["status"]
  connected: boolean
}

export type AgentPhoneOptionsOverview = {
  configured: boolean
  sessions: WhatsAppSessionOption[]
}

export const getAgentPhoneOptionsAction = async (): Promise<
  BaseActionResponse<AgentPhoneOptionsOverview>
> =>
  handleAction<AgentPhoneOptionsOverview>(async () => {
    if (!isWhatsAppConfigured()) {
      return { success: true, data: { configured: false, sessions: [] } }
    }

    const { companyId } = await resolveCompanyContext()
    const orchestrator = await getWhatsAppOrchestrator()
    const sessions = await orchestrator.listSessions(companyId)

    return {
      success: true,
      data: {
        configured: true,
        sessions: sessions.map((session) => ({
          sessionId: session.sessionId,
          label: session.label ?? null,
          phoneNumber: session.phoneNumber ?? null,
          status: session.status,
          connected: session.status === "connected",
        })),
      },
    }
  })
