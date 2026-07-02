export const CAMPAIGN_STARTER_TEMPLATE_IDS = [
  "welcome",
  "promotion",
  "appointmentReminder",
  "feedback",
  "winBack",
] as const

export type CampaignStarterTemplateId = (typeof CAMPAIGN_STARTER_TEMPLATE_IDS)[number]

export type CampaignStarterTemplate = {
  id: CampaignStarterTemplateId
  name: string
  description: string
  message: string
}
