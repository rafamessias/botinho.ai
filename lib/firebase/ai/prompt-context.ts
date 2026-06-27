import { adminDb } from "@/lib/firebase/admin"
import { collections, companySubcollections } from "@/lib/firebase/collections"
import {
  getAiAgent,
  getAiAgentBySessionId,
  listAgentTrainingData,
} from "@/lib/firebase/services/ai-agent-service"
import { listAiTrainingData } from "@/lib/firebase/services/ai-training-service"
import { getRecentConversationMessages } from "@/lib/firebase/services/inbox-service"
import { KnowledgeItemType } from "@/lib/types/enums"

export type CompanyAiContext = {
  companyId: string
  companyName: string
  companyDescription: string
  customerDescription?: string
  language: "en" | "pt-BR"
  agentName?: string
  customSystemPrompt?: string
  knowledgeText: string
  quickAnswersText: string
  templatesText: string
  recentMessages: Array<{ role: "customer" | "agent" | "bot"; content: string }>
}

const detectLanguage = (text: string): "en" | "pt-BR" => {
  const lower = text.toLowerCase()
  const ptHints = ["olá", "ola", "obrigad", "preço", "preco", "horário", "horario", "entrega", "você", "voce", "não", "nao"]
  if (ptHints.some((hint) => lower.includes(hint))) {
    return "pt-BR"
  }
  return "en"
}

const truncate = (value: string, max: number) =>
  value.length <= max ? value : `${value.slice(0, max)}…`

const formatKnowledgeText = (items: Awaited<ReturnType<typeof listAgentTrainingData>>["knowledgeBase"]) => {
  const knowledgeLines = items.map((item) => {
    if (item.type === KnowledgeItemType.URL) {
      const summary = item.urlSummary
      return `- ${item.title}: ${summary ?? item.content}`
    }
    return `- ${item.title}: ${truncate(item.content, 400)}`
  })
  return knowledgeLines.join("\n") || "(none)"
}

const formatQuickAnswersText = (
  items: Awaited<ReturnType<typeof listAiTrainingData>>["quickAnswers"],
) => {
  const lines = items.map((item) => `- Q/A: ${truncate(item.content, 200)}`)
  return lines.join("\n") || "(none)"
}

const formatTemplatesText = (items: Awaited<ReturnType<typeof listAiTrainingData>>["templates"]) => {
  const lines = items.map(
    (item) => `- [${item.category}] ${item.name}: ${truncate(item.content, 200)}`,
  )
  return lines.join("\n") || "(none)"
}

export const loadCompanyAiContext = async (params: {
  companyId: string
  conversationId?: string
  customerMessage?: string
  sessionId?: string | null
  agentId?: string | null
}): Promise<CompanyAiContext> => {
  const companySnap = await adminDb.collection(collections.companies).doc(params.companyId).get()
  const companyData = companySnap.data()

  let agentName: string | undefined
  let customSystemPrompt: string | undefined
  let knowledgeText: string
  let quickAnswersText: string
  let templatesText: string

  const companyTraining = await listAiTrainingData(params.companyId)
  quickAnswersText = formatQuickAnswersText(companyTraining.quickAnswers)
  templatesText = formatTemplatesText(companyTraining.templates)

  let agent =
    params.agentId != null
      ? await getAiAgent(params.companyId, params.agentId)
      : params.sessionId
        ? await getAiAgentBySessionId(params.companyId, params.sessionId)
        : null

  if (agent) {
    agentName = agent.name
    customSystemPrompt = agent.systemPrompt || undefined
    const agentTraining = await listAgentTrainingData(params.companyId, agent.id)
    knowledgeText = formatKnowledgeText(agentTraining.knowledgeBase)
  } else {
    knowledgeText = formatKnowledgeText(companyTraining.knowledgeBase)
  }

  let recentMessages: CompanyAiContext["recentMessages"] = []
  let customerDescription: string | undefined

  if (params.conversationId) {
    const conversationSnap = await adminDb
      .collection(collections.companies)
      .doc(params.companyId)
      .collection(companySubcollections.conversations)
      .doc(params.conversationId)
      .get()

    const customerId = conversationSnap.data()?.customerId as string | undefined

    if (customerId) {
      const customerSnap = await adminDb
        .collection(collections.companies)
        .doc(params.companyId)
        .collection(companySubcollections.customers)
        .doc(customerId)
        .get()

      const notes = (customerSnap.data()?.notes as string | undefined)?.trim()
      if (notes) {
        customerDescription = truncate(notes, 500)
      }
    }

    const messages = await getRecentConversationMessages({
      companyId: params.companyId,
      conversationId: params.conversationId,
      limit: 12,
    })
    recentMessages = messages.map((message) => ({
      role: message.senderType === "customer" ? "customer" : message.senderType === "bot" ? "bot" : "agent",
      content: message.content,
    }))
  }

  const languageSeed =
    params.customerMessage ??
    recentMessages.filter((m) => m.role === "customer").at(-1)?.content ??
    ""

  return {
    companyId: params.companyId,
    companyName: (companyData?.name as string) ?? "Company",
    companyDescription: truncate((companyData?.description as string) ?? "", 500),
    customerDescription,
    language: detectLanguage(languageSeed),
    agentName,
    customSystemPrompt,
    knowledgeText,
    quickAnswersText,
    templatesText,
    recentMessages,
  }
}

export const buildSystemPrompt = (context: CompanyAiContext): string => {
  const langInstruction =
    context.language === "pt-BR"
      ? "Responda sempre em português do Brasil. Seja conciso e amigável, no estilo WhatsApp."
      : "Always respond in English. Be concise and friendly, WhatsApp-style."

  const agentLabel = context.agentName ? ` (${context.agentName})` : ""

  return [
    `You are a customer support assistant for "${context.companyName}"${agentLabel}.`,
    context.companyDescription ? `About the business: ${context.companyDescription}` : "",
    context.customerDescription ? `About this customer: ${context.customerDescription}` : "",
    context.customSystemPrompt ? `Additional instructions:\n${context.customSystemPrompt}` : "",
    langInstruction,
    "Use ONLY facts from the knowledge base below. Do not invent prices, policies, or hours.",
    "If information is missing, say you will check with the team.",
    "",
    "## Knowledge base",
    context.knowledgeText,
    "",
    "## Quick answers",
    context.quickAnswersText,
    "",
    "## Response templates",
    context.templatesText,
  ]
    .filter(Boolean)
    .join("\n")
}

export const formatConversationHistory = (messages: CompanyAiContext["recentMessages"]): string => {
  if (!messages.length) {
    return "(no prior messages)"
  }
  return messages
    .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
    .join("\n")
}
