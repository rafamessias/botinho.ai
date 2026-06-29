import { FinishReason, GoogleGenAI, Type, type Schema } from "@google/genai"

export const AI_MODELS = {
  suggestions: "gemini-2.5-flash",
  autoReply: "gemini-2.5-flash",
  urlSummary: "gemini-2.5-flash",
} as const

export const suggestionResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    suggestions: {
      type: Type.ARRAY,
      minItems: "3",
      maxItems: "3",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          text: { type: Type.STRING, maxLength: "160" },
          category: {
            type: Type.STRING,
            enum: ["general", "hours", "pricing", "delivery", "support", "closing"],
          },
        },
        required: ["id", "text", "category"],
      },
    },
  },
  required: ["suggestions"],
}

const getClient = (): GoogleGenAI | null => {
  const apiKey = process.env.GEMINI_API_KEY?.trim()
  if (!apiKey) {
    return null
  }
  return new GoogleGenAI({ apiKey })
}

export const isAiConfigured = (): boolean => Boolean(process.env.GEMINI_API_KEY?.trim())

export const parseGeminiJsonResponse = <T>(raw: string): T => {
  let cleaned = raw.trim()
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "")
  }
  return JSON.parse(cleaned) as T
}

export const generateGeminiContent = async (params: {
  model: string
  prompt: string
  temperature?: number
  maxOutputTokens?: number
  responseMimeType?: string
  responseSchema?: Schema
  disableThinking?: boolean
}): Promise<string> => {
  const client = getClient()
  if (!client) {
    throw new Error("GEMINI_API_KEY is not configured")
  }

  const response = await client.models.generateContent({
    model: params.model,
    contents: params.prompt,
    config: {
      temperature: params.temperature ?? 0.4,
      maxOutputTokens: params.maxOutputTokens ?? 1024,
      ...(params.responseMimeType ? { responseMimeType: params.responseMimeType } : {}),
      ...(params.responseSchema ? { responseSchema: params.responseSchema } : {}),
      ...(params.disableThinking ? { thinkingConfig: { thinkingBudget: 0 } } : {}),
    },
  })

  const text = response.text?.trim()
  if (!text) {
    throw new Error("Gemini returned an empty response")
  }

  const finishReason = response.candidates?.[0]?.finishReason
  if (finishReason === FinishReason.MAX_TOKENS) {
    throw new Error(`Gemini response truncated (MAX_TOKENS). Length: ${text.length}`)
  }

  return text
}
