import type { CustomerStatus } from "@/lib/types/customer"

export type CampaignStatus =
  | "draft"
  | "scheduled"
  | "running"
  | "paused"
  | "completed"
  | "cancelled"

export type CampaignDeliveryStatus =
  | "pending"
  | "queued"
  | "sent"
  | "delivered"
  | "failed"
  | "skipped"
  | "responded"

export type CampaignDeliveryFailureReason =
  | "outside_window"
  | "no_session"
  | "delivery_failed"
  | "customer_not_found"
  | "max_attempts"

export type CampaignSchedule = {
  startAt?: Date
  messagesPerInterval: number
  intervalMinutes: number
}

export type CampaignRuntime = {
  lastBatchAt?: Date
  sentInCurrentInterval: number
}

export type CampaignMetrics = {
  targeted: number
  queued: number
  sent: number
  delivered: number
  failed: number
  skipped: number
  responses: number
  responseRate: number
  botReplies: number
}

export const DEFAULT_CAMPAIGN_METRICS = (): CampaignMetrics => ({
  targeted: 0,
  queued: 0,
  sent: 0,
  delivered: 0,
  failed: 0,
  skipped: 0,
  responses: 0,
  responseRate: 0,
  botReplies: 0,
})

export const DEFAULT_CAMPAIGN_SCHEDULE = (): CampaignSchedule => ({
  messagesPerInterval: 10,
  intervalMinutes: 5,
})

export const DEFAULT_CAMPAIGN_RUNTIME = (): CampaignRuntime => ({
  sentInCurrentInterval: 0,
})

export type CampaignVariableToken =
  | "customer.name"
  | "customer.firstName"
  | "customer.phone"
  | "customer.email"
  | "customer.company"
  | "company.name"

export const CAMPAIGN_VARIABLE_TOKENS: CampaignVariableToken[] = [
  "customer.name",
  "customer.firstName",
  "customer.phone",
  "customer.email",
  "customer.company",
  "company.name",
]

export type CampaignTargetCustomerStatus = CustomerStatus
