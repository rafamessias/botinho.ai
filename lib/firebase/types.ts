import type { Timestamp } from "firebase-admin/firestore"

export type UserLanguage = "en" | "pt_BR"
export type UserTheme = "light" | "dark" | "system"
export type MemberStatus = "invited" | "accepted" | "rejected"

export type FirestoreUser = {
  uid: string
  email: string
  firstName: string
  lastName?: string
  phone?: string
  language: UserLanguage
  theme: UserTheme
  defaultCompanyId?: string
  avatarUrl?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type FirestoreCompany = {
  slug: string
  name: string
  description?: string
  tokenApi?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type FirestoreCompanyMember = {
  uid: string
  isOwner: boolean
  isAdmin: boolean
  canPost: boolean
  canApprove: boolean
  status: MemberStatus
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type FirestoreCompanySettings = {
  emailNotifications: boolean
  newMessageAlerts: boolean
  dailyReports: boolean
  autoReply: boolean
  smsFallbackEnabled: boolean
  updatedAt: Timestamp
}

export type InboxMessageSenderType = "customer" | "agent" | "bot" | "system"
export type InboxMessageStatus = "pending" | "sent" | "delivered" | "read" | "failed"
export type InboxConversationPriority = "low" | "medium" | "high"

export type FirestoreInboxCustomer = {
  name: string
  phone?: string
  email?: string
  address?: string
  notes?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type FirestoreInboxConversation = {
  customerId: string
  subject?: string
  lastMessagePreview?: string
  lastMessageSentAt?: Timestamp
  unreadCount: number
  priority: InboxConversationPriority
  satisfactionScore?: number
  tags: string[]
  assignedToId?: string | null
  isArchived: boolean
  archivedAt?: Timestamp | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type FirestoreInboxMessage = {
  senderType: InboxMessageSenderType
  senderUserId?: string
  content: string
  attachments?: unknown
  status: InboxMessageStatus
  sentAt: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type FirestoreKnowledgeItem = {
  type: "TEXT" | "URL"
  title: string
  content: string
  urlSummary?: string
  createdById?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type FirestorePendingSignup = {
  email: string
  firstName: string
  lastName?: string
  phone?: string
  passwordHash: string
  otpHash: string
  otpExpiresAt: Timestamp
  planType?: string
  createdAt: Timestamp
}
