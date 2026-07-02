export type ResponseLanguage = "en" | "pt-BR"
export type AgentLanguagePreference = "en" | "pt-BR" | "auto"

const PT_HINTS = [
  "olá",
  "ola",
  "oi",
  "obrigad",
  "preço",
  "preco",
  "horário",
  "horario",
  "entrega",
  "você",
  "voce",
  "não",
  "nao",
  "eae",
  "tudo bem",
  "bom dia",
  "boa tarde",
  "boa noite",
  "ajudar",
  "por favor",
  "português",
  "portugues",
  " blz",
  " vc ",
  " pq ",
  " pra ",
  " tbm",
  "como posso",
  "em que posso",
]

const hasPortugueseCharacters = (text: string) => /[àáâãéêíóôõúçÀÁÂÃÉÊÍÓÔÕÚÇ]/.test(text)

export const detectLanguage = (text: string): ResponseLanguage => {
  const trimmed = text.trim()
  if (!trimmed) {
    return "en"
  }

  const lower = trimmed.toLowerCase()
  if (PT_HINTS.some((hint) => lower.includes(hint))) {
    return "pt-BR"
  }

  if (hasPortugueseCharacters(trimmed)) {
    return "pt-BR"
  }

  return "en"
}

export const resolveResponseLanguage = (params: {
  agentLanguage?: AgentLanguagePreference | null
  customerMessage?: string
  recentCustomerMessages?: string[]
  agentSystemPrompt?: string
  trainingText?: string
}): ResponseLanguage => {
  if (params.agentLanguage === "en" || params.agentLanguage === "pt-BR") {
    return params.agentLanguage
  }

  const seed = [
    params.customerMessage,
    ...(params.recentCustomerMessages ?? []),
    params.agentSystemPrompt,
    params.trainingText,
  ]
    .filter((value): value is string => Boolean(value?.trim()))
    .join("\n")

  return detectLanguage(seed)
}

export const normalizeAgentLanguagePreference = (
  value: unknown,
): AgentLanguagePreference => {
  if (value === "en" || value === "pt-BR" || value === "auto") {
    return value
  }
  return "auto"
}
