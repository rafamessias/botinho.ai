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

export type CompanyDocumentType = "cpf" | "cnpj"

export type FirestoreCompany = {
  slug: string
  name: string
  description?: string
  country?: string
  documentType?: CompanyDocumentType
  document?: string
  address?: string
  addressNumber?: string
  zipCode?: string
  complement?: string
  city?: string
  state?: string
  tokenApi?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type FirestoreCompanyMember = {
  uid: string
  email?: string
  inviteToken?: string
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
export type InboxMessageSentBy = "customer" | "user" | "robot" | "system"
export type InboxMessageStatus = "pending" | "sent" | "delivered" | "read" | "failed"
export type InboxConversationPriority = "low" | "medium" | "high"
export type MessageChannel = "whatsapp" | "manual"
export type MessageDirection = "inbound" | "outbound"
export type InboundEventStatus = "pending" | "processing" | "processed" | "failed"
export type AutoReplyStatus = "skipped" | "pending" | "sent" | "failed"

export type FirestoreInboxCustomer = {
  name: string
  nameLower?: string
  phone?: string
  email?: string
  emailLower?: string | null
  searchKeywords?: string[]
  address?: string
  notes?: string
  company?: string
  tags?: string[]
  status?: "active" | "inactive" | "prospect"
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type FirestoreInboxConversation = {
  customerId: string
  sessionId?: string | null
  subject?: string
  lastMessagePreview?: string
  lastMessageSentAt?: Timestamp
  unreadCount: number
  priority: InboxConversationPriority
  satisfactionScore?: number
  tags: string[]
  assignedToId?: string | null
  activeSurveyResponseId?: string | null
  activeCampaignId?: string | null
  activeCampaignDeliveryId?: string | null
  isArchived: boolean
  isBookmarked?: boolean
  archivedAt?: Timestamp | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type FirestoreInboxMessage = {
  senderType: InboxMessageSenderType
  sentBy: InboxMessageSentBy
  senderUserId?: string
  content: string
  attachments?: unknown
  status: InboxMessageStatus
  channel?: MessageChannel
  direction?: MessageDirection
  externalMessageId?: string
  channelPhoneNumber?: string
  failureReason?: string
  metricsSentCounted?: boolean
  sentAt: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type FirestoreInboundEvent = {
  channel: MessageChannel
  sessionId: string
  messageId: string
  from: string
  to?: string
  body: string
  type?: string
  timestamp: Timestamp | Date | string
  phoneNumber?: string
  status: InboundEventStatus
  attempts: number
  lastError?: string | null
  nextAttemptAt?: Timestamp | Date | null
  inboxMessageId?: string | null
  conversationId?: string | null
  autoReplyStatus?: AutoReplyStatus
  autoReplyReason?: string | null
  metricsReceivedCounted?: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
  processedAt?: Timestamp | null
}

export type FirestoreAiAgent = {
  name: string
  systemPrompt: string
  sessionId?: string | null
  autoReply: boolean
  createdById?: string
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
