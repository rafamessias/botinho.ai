export const PROMPT_TEMPLATE_IDS = [
  "generalSupport",
  "sales",
  "ecommerce",
  "appointments",
  "restaurant",
  "realEstate",
] as const

export type PromptTemplateId = (typeof PROMPT_TEMPLATE_IDS)[number]
