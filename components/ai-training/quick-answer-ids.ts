export const QUICK_ANSWER_EXAMPLE_IDS = [
  "businessHours",
  "shippingPolicy",
  "returnPolicy",
  "paymentMethods",
  "orderTracking",
  "speakToHuman",
] as const

export type QuickAnswerExampleId = (typeof QUICK_ANSWER_EXAMPLE_IDS)[number]
