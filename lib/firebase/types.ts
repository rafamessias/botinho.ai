import type { Timestamp } from "firebase-admin/firestore"

export type UserLanguage = "en" | "pt_BR"
export type UserTheme = "light" | "dark" | "system"
export type MemberStatus = "invited" | "accepted" | "rejected"
export type OnboardingStatus = "pending" | "completed"
export type OnboardingStep = 1 | 2 | 3 | 4

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
  onboardingStatus?: OnboardingStatus
  onboardingStep?: OnboardingStep
  onboardingCompletedAt?: Timestamp
  preferredPlanType?: string | null
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
  canManageAgenda?: boolean
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
  customerName?: string
  customerPhone?: string | null
  customerEmail?: string | null
  customerCompany?: string | null
  sessionId?: string | null
  subject?: string
  lastMessagePreview?: string
  lastMessageSentAt?: Timestamp
  unreadCount: number
  priority: InboxConversationPriority
  satisfactionScore?: number
  tags: string[]
  assignedToId?: string | null
  assignedToName?: string | null
  activeSurveyResponseId?: string | null
  activeCampaignId?: string | null
  activeCampaignDeliveryId?: string | null
  isArchived: boolean
  isBookmarked?: boolean
  archivedAt?: Timestamp | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type InboxMessageQuote = {
  content: string
  senderType?: InboxMessageSenderType
  externalMessageId?: string
  inboxMessageId?: string
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
  externalParticipantJid?: string
  replyToMessageId?: string
  replyToExternalMessageId?: string
  quotedMessage?: InboxMessageQuote
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
  quotedMessageId?: string
  quotedBody?: string
  quotedParticipant?: string
  senderJid?: string
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
  ticketsEnabled?: boolean
  schedulingEnabled?: boolean
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

export type TicketType = "customer_request" | "order" | "support" | "complaint" | "other"
export type TicketStatus = "open" | "in_progress" | "waiting" | "resolved" | "closed"
export type TicketPriority = "low" | "medium" | "high"

export type TicketActivityAction =
  | "created"
  | "status_changed"
  | "priority_changed"
  | "type_changed"
  | "title_changed"
  | "description_changed"
  | "customer_changed"
  | "order_reference_changed"
  | "assigned"
  | "unassigned"
  | "comment_added"

export type FirestoreTicketComment = {
  content: string
  authorId: string
  authorName?: string | null
  createdAt: Timestamp
}

export type FirestoreTicketActivity = {
  action: TicketActivityAction
  actorId: string
  actorName?: string | null
  field?: string | null
  previousValue?: string | null
  newValue?: string | null
  createdAt: Timestamp
}

export type FirestoreTicketCounter = {
  nextSequence: number
  updatedAt: Timestamp
}

export type FirestoreTicket = {
  ticketNumber: string
  ticketSequence: number
  ticketScopeCode: string
  title: string
  description: string
  type: TicketType
  status: TicketStatus
  priority: TicketPriority
  customerId?: string | null
  customerName?: string | null
  orderReference?: string | null
  conversationId?: string | null
  assignedToId?: string | null
  assignedToName?: string | null
  createdById: string
  createdByName?: string | null
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

export type ScheduleBlockType = "blocked" | "break" | "unavailable"
export type ScheduleReservationStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show"
export type ScheduleReservationSource = "bot" | "manual"

export type FirestoreScheduleDayHours = {
  day: number
  enabled: boolean
  start: string
  end: string
}

export type FirestoreScheduleSettings = {
  timezone: string
  defaultBufferMinutes: number
  minAdvanceBookingMinutes: number
  maxAdvanceBookingDays: number
  slotIntervalMinutes: number
  businessHours: FirestoreScheduleDayHours[]
  updatedAt: Timestamp
}

export type FirestoreScheduleService = {
  name: string
  description?: string | null
  durationMinutes: number
  bufferBeforeMinutes?: number | null
  bufferAfterMinutes?: number | null
  assigneeIds: string[]
  color?: string | null
  active: boolean
  sortOrder: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type FirestoreAgendaProfile = {
  memberUid: string
  displayName?: string | null
  enabled: boolean
  timezone?: string | null
  workingHours?: FirestoreScheduleDayHours[] | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type FirestoreScheduleBlock = {
  assigneeId: string
  type: ScheduleBlockType
  startAt: Timestamp
  endAt: Timestamp
  reason?: string | null
  createdById: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type FirestoreScheduleReservation = {
  reservationNumber: string
  serviceId: string
  serviceName: string
  assigneeId: string
  assigneeName: string
  customerId?: string | null
  customerName?: string | null
  customerPhone?: string | null
  conversationId?: string | null
  startAt: Timestamp
  endAt: Timestamp
  status: ScheduleReservationStatus
  notes?: string | null
  source: ScheduleReservationSource
  createdById: string
  cancelledAt?: Timestamp | null
  cancellationReason?: string | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type FirestoreScheduleCounter = {
  nextSequence: number
  updatedAt: Timestamp
}
