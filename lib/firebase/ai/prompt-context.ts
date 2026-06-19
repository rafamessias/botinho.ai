import { adminDb } from "@/lib/firebase/admin"
import { collections } from "@/lib/firebase/collections"
import { listAiTrainingData } from "@/lib/firebase/services/ai-training-service"
import { getRecentConversationMessages } from "@/lib/firebase/services/inbox-service"
import { KnowledgeItemType } from "@/lib/types/enums"

export type CompanyAiContext = {
  companyId: string
  companyName: string
  companyDescription: string
  language: "en" | "pt-BR"
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

export const loadCompanyAiContext = async (params: {
  companyId: string
  conversationId?: string
  customerMessage?: string
}): Promise<CompanyAiContext> => {
  const companySnap = await adminDb.collection(collections.companies).doc(params.companyId).get()
  const companyData = companySnap.data()

  const training = await listAiTrainingData(params.companyId)

  const knowledgeLines = training.knowledgeBase.map((item) => {
    if (item.type === KnowledgeItemType.URL) {
      const summary = (item as { urlSummary?: string }).urlSummary
      return `- ${item.title}: ${summary ?? item.content}`
    }
    return `- ${item.title}: ${truncate(item.content, 400)}`
  })

  const quickAnswerLines = training.quickAnswers.map((item) => `- Q/A: ${truncate(item.content, 200)}`)
  const templateLines = training.templates.map(
    (item) => `- [${item.category}] ${item.name}: ${truncate(item.content, 200)}`,
  )

  let recentMessages: CompanyAiContext["recentMessages"] = []
  if (params.conversationId) {
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
    language: detectLanguage(languageSeed),
    knowledgeText: knowledgeLines.join("\n") || "(none)",
    quickAnswersText: quickAnswerLines.join("\n") || "(none)",
    templatesText: templateLines.join("\n") || "(none)",
    recentMessages,
  }
}

export const buildSystemPrompt = (context: CompanyAiContext): string => {
  const langInstruction =
    context.language === "pt-BR"
      ? "Responda sempre em português do Brasil. Seja conciso e amigável, no estilo WhatsApp."
      : "Always respond in English. Be concise and friendly, WhatsApp-style."

  return [
    `You are a customer support assistant for "${context.companyName}".`,
    context.companyDescription ? `About the business: ${context.companyDescription}` : "",
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
