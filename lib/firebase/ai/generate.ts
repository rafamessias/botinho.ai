import { z } from "zod"
import {
  AI_MODELS,
  generateGeminiContent,
  isAiConfigured,
  parseGeminiJsonResponse,
  suggestionResponseSchema,
} from "@/lib/gemini/client"
import {
  buildAutoReplyInstruction,
  buildSystemPrompt,
  formatConversationHistory,
  loadCompanyAiContext,
} from "@/lib/firebase/ai/prompt-context"
import { assertAiUsageAllowed, incrementAiUsage, SUGGESTION_CREDIT_TENTHS } from "@/lib/firebase/services/ai-usage-service"

const suggestionSchema = z.array(
  z.object({
    id: z.string(),
    text: z.string(),
    category: z.enum(["general", "hours", "pricing", "delivery", "support", "closing"]),
  }),
)

const fallbackSuggestions = (language: "en" | "pt-BR") => {
  if (language === "pt-BR") {
    return [
      { id: "general-1", text: "Como posso ajudar você hoje?", category: "general" as const },
      { id: "general-2", text: "Obrigado por entrar em contato! Estou aqui para ajudar.", category: "general" as const },
      { id: "support-1", text: "Pode me contar um pouco mais sobre o que você precisa?", category: "support" as const },
    ]
  }
  return [
    { id: "general-1", text: "How can I help you today?", category: "general" as const },
    { id: "general-2", text: "Thanks for reaching out! I'm here to help.", category: "general" as const },
    { id: "support-1", text: "Could you tell me a bit more about what you need?", category: "support" as const },
  ]
}

const fetchSuggestionPayload = async (prompt: string) => {
  const raw = await generateGeminiContent({
    model: AI_MODELS.suggestions,
    prompt,
    temperature: 0.3,
    maxOutputTokens: 1024,
    responseMimeType: "application/json",
    responseSchema: suggestionResponseSchema,
    disableThinking: true,
  })

  return parseGeminiJsonResponse<{ suggestions?: unknown }>(raw)
}

export const generateSuggestedResponses = async (params: {
  companyId: string
  conversationId?: string
  customerMessage?: string
}) => {
  let context: Awaited<ReturnType<typeof loadCompanyAiContext>>
  try {
    context = await loadCompanyAiContext({
      companyId: params.companyId,
      conversationId: params.conversationId,
      customerMessage: params.customerMessage,
    })
  } catch (error) {
    console.error("[gemini] failed to load AI context for suggestions:", error)
    return fallbackSuggestions("en")
  }

  if (!isAiConfigured()) {
    return fallbackSuggestions(context.language)
  }

  try {
    await assertAiUsageAllowed(params.companyId)

    const lastCustomerMessage =
      params.customerMessage ??
      context.recentMessages.filter((m) => m.role === "customer").at(-1)?.content ??
      ""

    const prompt = [
      buildSystemPrompt(context),
      "",
      "## Conversation",
      formatConversationHistory(context.recentMessages),
      "",
      `Latest customer message: ${lastCustomerMessage || "(none)"}`,
      "",
      "Generate exactly 3 short reply suggestions an agent could send next.",
      "Each suggestion must be at most 160 characters and suitable for WhatsApp.",
      'Return JSON: { "suggestions": [{ "id", "text", "category" }] }',
    ].join("\n")

    let json: { suggestions?: unknown }
    try {
      json = await fetchSuggestionPayload(prompt)
    } catch (firstError) {
      console.warn("[gemini] suggested responses retry after:", firstError)
      json = await fetchSuggestionPayload(prompt)
    }

    const parsed = suggestionSchema.parse(json.suggestions ?? json)
    await incrementAiUsage(params.companyId, SUGGESTION_CREDIT_TENTHS)
    return parsed.slice(0, 3)
  } catch (error) {
    console.error("[gemini] suggested responses failed:", error)
    return fallbackSuggestions(context.language)
  }
}

export const generateAutoReplyText = async (params: {
  companyId: string
  conversationId: string
  customerMessage: string
  sessionId?: string | null
  agentId?: string | null
}) => {
  const context = await loadCompanyAiContext({
    companyId: params.companyId,
    conversationId: params.conversationId,
    customerMessage: params.customerMessage,
    sessionId: params.sessionId,
    agentId: params.agentId,
  })

  if (!isAiConfigured()) {
    return context.language === "pt-BR"
      ? "Obrigado pela mensagem! Nossa equipe retornará em breve."
      : "Thanks for your message! Our team will get back to you shortly."
  }

  await assertAiUsageAllowed(params.companyId)

  const prompt = [
    buildSystemPrompt(context),
    "",
    "## Conversation",
    formatConversationHistory(context.recentMessages),
    "",
    `Customer message: ${params.customerMessage}`,
    "",
    buildAutoReplyInstruction(context.language),
  ].join("\n")

  try {
    const text = await generateGeminiContent({
      model: AI_MODELS.autoReply,
      prompt,
      temperature: 0.3,
      maxOutputTokens: 256,
      disableThinking: true,
    })

    await incrementAiUsage(params.companyId)
    return text
  } catch (error) {
    console.error("[gemini] auto-reply generation failed:", error)
    return context.language === "pt-BR"
      ? "Obrigado pela mensagem! Nossa equipe retornará em breve."
      : "Thanks for your message! Our team will get back to you shortly."
  }
}

export const summarizeUrlContent = async (params: { url: string; title: string }) => {
  const fallbackSummary = `Summary unavailable for ${params.title} (${params.url})`

  if (!isAiConfigured()) {
    return fallbackSummary
  }

  try {
    const prompt = [
      `Summarize the following URL for use in a customer support knowledge base.`,
      `Title: ${params.title}`,
      `URL: ${params.url}`,
      "Return a factual summary in 3-5 sentences. If you cannot access the URL, summarize based on the title only.",
    ].join("\n")

    return await generateGeminiContent({
      model: AI_MODELS.urlSummary,
      prompt,
      temperature: 0.2,
      maxOutputTokens: 512,
    })
  } catch (error) {
    console.error("[gemini] URL summary failed:", error)
    return fallbackSummary
  }
}
