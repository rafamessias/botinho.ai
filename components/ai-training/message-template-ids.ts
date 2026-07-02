export const MESSAGE_TEMPLATE_IDS = [
  "welcomeGreeting",
  "orderConfirmation",
  "orderShipped",
  "productRecommendation",
  "supportAcknowledgment",
  "closingThankYou",
] as const

export type MessageTemplateId = (typeof MESSAGE_TEMPLATE_IDS)[number]
