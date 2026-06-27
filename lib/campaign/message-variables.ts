import { formatStoredPhoneForDisplay } from "@/lib/phone-utils"

export type CampaignVariableContext = {
  customer?: {
    name?: string
    phone?: string
    email?: string
    company?: string
  }
  company?: {
    name?: string
  }
}

const TOKEN_PATTERN = /\{\{\s*([a-z0-9._]+)\s*\}\}/gi

const resolveToken = (token: string, context: CampaignVariableContext): string => {
  const normalized = token.toLowerCase()

  switch (normalized) {
    case "customer.name":
      return context.customer?.name?.trim() ?? ""
    case "customer.firstname": {
      const name = context.customer?.name?.trim() ?? ""
      return name.split(/\s+/)[0] ?? ""
    }
    case "customer.phone": {
      const phone = context.customer?.phone?.trim() ?? ""
      return phone ? formatStoredPhoneForDisplay(phone) : ""
    }
    case "customer.email":
      return context.customer?.email?.trim() ?? ""
    case "customer.company":
      return context.customer?.company?.trim() ?? ""
    case "company.name":
      return context.company?.name?.trim() ?? ""
    default:
      return `{{${token}}}`
  }
}

export const renderCampaignMessage = (
  template: string,
  context: CampaignVariableContext,
): string =>
  template.replace(TOKEN_PATTERN, (_match, token: string) => resolveToken(token, context))

export const extractUnknownCampaignTokens = (template: string): string[] => {
  const allowed = new Set([
    "customer.name",
    "customer.firstname",
    "customer.phone",
    "customer.email",
    "customer.company",
    "company.name",
  ])
  const unknown = new Set<string>()

  for (const match of template.matchAll(TOKEN_PATTERN)) {
    const token = match[1]?.toLowerCase()
    if (token && !allowed.has(token)) {
      unknown.add(match[1]!)
    }
  }

  return Array.from(unknown)
}

export const MAX_CAMPAIGN_MESSAGE_LENGTH = 4096
