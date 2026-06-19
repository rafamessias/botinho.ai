import { z } from "zod"
import { AI_MODELS, Schema, getGenerativeModelFor, isAiConfigured } from "@/lib/firebase/ai/server-ai"
import {
  buildSystemPrompt,
  formatConversationHistory,
  loadCompanyAiContext,
} from "@/lib/firebase/ai/prompt-context"
import { assertAiUsageAllowed, incrementAiUsage } from "@/lib/firebase/services/ai-usage-service"

const suggestionSchema = z.array(
  z.object({
    id: z.string(),
    text: z.string(),
    category: z.enum(["general", "hours", "pricing", "delivery", "support", "closing"]),
  }),
)

const responseSchema = Schema.object({
  properties: {
    suggestions: Schema.array({
      items: Schema.object({
        properties: {
          id: Schema.string(),
          text: Schema.string(),
          category: Schema.enumString({
            enum: ["general", "hours", "pricing", "delivery", "support", "closing"],
          }),
        },
      }),
    }),
  },
})

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

export const generateSuggestedResponses = async (params: {
  companyId: string
  conversationId?: string
  customerMessage?: string
}) => {
  const context = await loadCompanyAiContext({
    companyId: params.companyId,
    conversationId: params.conversationId,
    customerMessage: params.customerMessage,
  })

  if (!isAiConfigured()) {
    return fallbackSuggestions(context.language)
  }

  try {
    await assertAiUsageAllowed(params.companyId)

    const lastCustomerMessage =
      params.customerMessage ??
      context.recentMessages.filter((m) => m.role === "customer").at(-1)?.content ??
      ""

    const model = getGenerativeModelFor(AI_MODELS.suggestions, {
      temperature: 0.5,
      maxOutputTokens: 512,
      responseMimeType: "application/json",
      responseSchema,
    })

    const prompt = [
      buildSystemPrompt(context),
      "",
      "## Conversation",
      formatConversationHistory(context.recentMessages),
      "",
      `Latest customer message: ${lastCustomerMessage || "(none)"}`,
      "",
      "Generate exactly 3 short reply suggestions an agent could send next.",
      'Return JSON: { "suggestions": [{ "id", "text", "category" }] }',
    ].join("\n")

    const result = await model.generateContent(prompt)
    const raw = result.response.text()
    const json = JSON.parse(raw) as { suggestions?: unknown }
    const parsed = suggestionSchema.parse(json.suggestions ?? json)
    await incrementAiUsage(params.companyId)
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
}) => {
  const context = await loadCompanyAiContext({
    companyId: params.companyId,
    conversationId: params.conversationId,
    customerMessage: params.customerMessage,
  })

  if (!isAiConfigured()) {
    return context.language === "pt-BR"
      ? "Obrigado pela mensagem! Nossa equipe retornará em breve."
      : "Thanks for your message! Our team will get back to you shortly."
  }

  await assertAiUsageAllowed(params.companyId)

  const model = getGenerativeModelFor(AI_MODELS.autoReply, {
    temperature: 0.3,
    maxOutputTokens: 256,
  })

  const prompt = [
    buildSystemPrompt(context),
    "",
    "## Conversation",
    formatConversationHistory(context.recentMessages),
    "",
    `Customer message: ${params.customerMessage}`,
    "",
    "Write ONE concise WhatsApp reply as the business. No markdown. Max 2 short sentences.",
  ].join("\n")

  const result = await model.generateContent(prompt)
  const text = result.response.text().trim()
  await incrementAiUsage(params.companyId)
  return text
}

export const summarizeUrlContent = async (params: { url: string; title: string }) => {
  if (!isAiConfigured()) {
    return `Summary unavailable for ${params.title} (${params.url})`
  }

  const model = getGenerativeModelFor(AI_MODELS.urlSummary, {
    temperature: 0.2,
    maxOutputTokens: 512,
  })

  const prompt = [
    `Summarize the following URL for use in a customer support knowledge base.`,
    `Title: ${params.title}`,
    `URL: ${params.url}`,
    "Return a factual summary in 3-5 sentences. If you cannot access the URL, summarize based on the title only.",
  ].join("\n")

  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}
