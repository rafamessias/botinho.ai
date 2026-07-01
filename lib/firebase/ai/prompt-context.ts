import { adminDb } from "@/lib/firebase/admin"
import { collections, companySubcollections } from "@/lib/firebase/collections"
import {
  getAiAgent,
  getAiAgentBySessionId,
  listAgentTrainingData,
} from "@/lib/firebase/services/ai-agent-service"
import { listAiTrainingData } from "@/lib/firebase/services/ai-training-service"
import { listActiveSurveys } from "@/lib/firebase/services/survey-service"
import { getRecentConversationMessages } from "@/lib/firebase/services/inbox-service"
import { KnowledgeItemType } from "@/lib/types/enums"
import {
  normalizeAgentLanguagePreference,
  resolveResponseLanguage,
  type AgentLanguagePreference,
  type ResponseLanguage,
} from "@/lib/firebase/ai/language"

export type CompanyAiContext = {
  companyId: string
  companyName: string
  companyDescription: string
  customerId?: string
  customerName?: string
  customerDescription?: string
  language: ResponseLanguage
  agentLanguage?: AgentLanguagePreference
  agentName?: string
  agentId?: string
  ticketsEnabled?: boolean
  schedulingEnabled?: boolean
  customSystemPrompt?: string
  knowledgeText: string
  quickAnswersText: string
  templatesText: string
  surveysText: string
  recentMessages: Array<{ role: "customer" | "agent" | "bot"; content: string }>
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

const formatSurveysText = (
  surveys: Awaited<ReturnType<typeof listActiveSurveys>>,
  surveyIds: string[],
  triggers: import("@/lib/types/survey").SurveyTriggers,
) => {
  const enabled = surveys.filter((s) => surveyIds.includes(s.id))
  if (enabled.length === 0) return "(none)"

  const triggerLines: string[] = []
  if (triggers.proactiveOffer) triggerLines.push("- You may suggest a survey when appropriate (ask consent first)")
  if (triggers.onConversationClose)
    triggerLines.push(`- After resolution (keywords: ${triggers.closeKeywords.join(", ")}), you may offer a survey`)
  if (triggers.onEscalation) triggerLines.push("- When escalating to a human, you may offer a survey")

  const surveyLines = enabled.map((s) => `- ${s.name}: ${s.description ?? s.introMessage ?? "customer feedback survey"}`)

  return [...surveyLines, ...triggerLines].join("\n") || "(none)"
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
  let agentLanguage: AgentLanguagePreference | undefined
  let ticketsEnabled = true
  let schedulingEnabled = true
  let resolvedAgentId: string | undefined
  let knowledgeText: string
  let quickAnswersText: string
  let templatesText: string
  let surveysText = "(none)"

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
    resolvedAgentId = agent.id
    agentName = agent.name
    customSystemPrompt = agent.systemPrompt || undefined
    agentLanguage = agent.language
    ticketsEnabled = agent.ticketsEnabled
    schedulingEnabled = agent.schedulingEnabled
    const agentTraining = await listAgentTrainingData(params.companyId, agent.id)
    knowledgeText = formatKnowledgeText(agentTraining.knowledgeBase)

    if (agent.surveyIds.length > 0) {
      const activeSurveys = await listActiveSurveys(params.companyId)
      surveysText = formatSurveysText(activeSurveys, agent.surveyIds, agent.surveyTriggers)
    }
  } else {
    knowledgeText = formatKnowledgeText(companyTraining.knowledgeBase)
  }

  let recentMessages: CompanyAiContext["recentMessages"] = []
  let customerDescription: string | undefined
  let customerId: string | undefined
  let customerName: string | undefined

  if (params.conversationId) {
    const conversationSnap = await adminDb
      .collection(collections.companies)
      .doc(params.companyId)
      .collection(companySubcollections.conversations)
      .doc(params.conversationId)
      .get()

    const conversationData = conversationSnap.data()
    customerId = conversationData?.customerId as string | undefined
    customerName =
      (conversationData?.customerName as string | undefined)?.trim() ||
      undefined

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

  const recentCustomerMessages = recentMessages
    .filter((message) => message.role === "customer")
    .map((message) => message.content)

  return {
    companyId: params.companyId,
    companyName: (companyData?.name as string) ?? "Company",
    companyDescription: truncate((companyData?.description as string) ?? "", 500),
    customerId,
    customerName,
    customerDescription,
    language: resolveResponseLanguage({
      agentLanguage,
      customerMessage: params.customerMessage,
      recentCustomerMessages,
      agentSystemPrompt: customSystemPrompt,
      trainingText: [quickAnswersText, templatesText, knowledgeText].join("\n"),
    }),
    agentLanguage,
    agentName,
    agentId: resolvedAgentId,
    ticketsEnabled,
    schedulingEnabled,
    customSystemPrompt,
    knowledgeText,
    quickAnswersText,
    templatesText,
    surveysText,
    recentMessages,
  }
}

export const buildSystemPrompt = (context: CompanyAiContext): string => {
  if (context.language === "pt-BR") {
    const agentLabel = context.agentName ? ` (${context.agentName})` : ""

    return [
      `Você é um assistente de atendimento da empresa "${context.companyName}"${agentLabel}.`,
      context.companyDescription ? `Sobre a empresa: ${context.companyDescription}` : "",
      context.customerDescription ? `Sobre este cliente: ${context.customerDescription}` : "",
      context.customSystemPrompt ? `Instruções adicionais:\n${context.customSystemPrompt}` : "",
      "Responda sempre em português do Brasil. Seja conciso e amigável, no estilo WhatsApp.",
      "Use SOMENTE fatos da base de conhecimento abaixo. Não invente preços, políticas ou horários.",
      "Se faltar informação, diga que vai verificar com a equipe.",
      "",
      "## Base de conhecimento",
      context.knowledgeText,
      "",
      "## Respostas rápidas",
      context.quickAnswersText,
      "",
      "## Modelos de mensagem",
      context.templatesText,
      "",
      "## Pesquisas de satisfação",
      context.surveysText,
      "Não envie pesquisas sem consentimento do cliente, exceto quando as regras automáticas se aplicarem.",
      ...(context.ticketsEnabled !== false
        ? [
            "",
            "Ao tratar chamados de suporte, você pode usar as ferramentas de tickets (search_tickets, create_ticket) quando disponíveis no fluxo da conversa.",
          ]
        : []),
    ]
      .filter(Boolean)
      .join("\n")
  }

  const agentLabel = context.agentName ? ` (${context.agentName})` : ""

  return [
    `You are a customer support assistant for "${context.companyName}"${agentLabel}.`,
    context.companyDescription ? `About the business: ${context.companyDescription}` : "",
    context.customerDescription ? `About this customer: ${context.customerDescription}` : "",
    context.customSystemPrompt ? `Additional instructions:\n${context.customSystemPrompt}` : "",
    "Always respond in English. Be concise and friendly, WhatsApp-style.",
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
    "",
    "## Customer surveys",
    context.surveysText,
      "Do not send surveys without customer consent unless auto-trigger rules apply.",
      ...(context.ticketsEnabled !== false
        ? [
            "",
            "When handling support cases, you may use ticket tools (search_tickets, create_ticket) if available in the conversation flow.",
          ]
        : []),
    ]
    .filter(Boolean)
    .join("\n")
}

export const buildAutoReplyInstruction = (language: ResponseLanguage): string =>
  language === "pt-BR"
    ? "Escreva UMA resposta concisa para WhatsApp como a empresa. Sem markdown. Máximo de 2 frases curtas."
    : "Write ONE concise WhatsApp reply as the business. No markdown. Max 2 short sentences."

export const formatConversationHistory = (messages: CompanyAiContext["recentMessages"]): string => {
  if (!messages.length) {
    return "(no prior messages)"
  }
  return messages
    .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
    .join("\n")
}
