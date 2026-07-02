export type UserTheme = "light" | "dark" | "system"

export enum PlanType {
  FREE = "FREE",
  STARTER = "STARTER",
  PRO = "PRO",
  BUSINESS = "BUSINESS",
  ENTERPRISE = "ENTERPRISE",
}

export enum BillingInterval {
  monthly = "monthly",
  yearly = "yearly",
}

export enum SubscriptionStatus {
  pending = "pending",
  active = "active",
  canceled = "canceled",
  past_due = "past_due",
  trialing = "trialing",
  incomplete = "incomplete",
  incomplete_expired = "incomplete_expired",
  unpaid = "unpaid",
}

export enum KnowledgeItemType {
  TEXT = "TEXT",
  URL = "URL",
  PDF = "PDF",
}

export enum AiTemplateCategory {
  greeting = "greeting",
  orders = "orders",
  products = "products",
  support = "support",
  closing = "closing",
}

export enum MemberStatus {
  invited = "invited",
  accepted = "accepted",
  rejected = "rejected",
}
