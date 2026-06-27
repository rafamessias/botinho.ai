import type {
  AutoReplyStatus,
  InboundEventStatus,
  InboxMessageSenderType,
  InboxMessageStatus,
  MessageChannel,
} from "@/lib/firebase/types"

export type MessageUsageMetric = "MESSAGES_RECEIVED" | "MESSAGES_SENT" | "BOT_AUTO_REPLIES"

export type InboundEventRecord = {
  id: string
  companyId: string
  channel: MessageChannel
  sessionId: string
  messageId: string
  from: string
  to?: string
  body: string
  type?: string
  timestamp: Date
  phoneNumber?: string
  status: InboundEventStatus
  attempts: number
  lastError?: string | null
  nextAttemptAt?: Date | null
  inboxMessageId?: string | null
  conversationId?: string | null
  autoReplyStatus?: AutoReplyStatus
  autoReplyReason?: string | null
  metricsReceivedCounted?: boolean
  createdAt: Date
  updatedAt: Date
  processedAt?: Date | null
}

export type ProcessInboundResult = {
  skipped: boolean
  conversationId?: string
  inboxMessageId?: string
  eventId: string
}

export type SendOutboundParams = {
  companyId: string
  conversationId: string
  content: string
  senderType: InboxMessageSenderType
  senderUserId?: string
  status?: InboxMessageStatus
  incrementUnread?: boolean
  sessionId?: string | null
  customerPhone?: string
  channelPhoneNumber?: string
  countAsBotAutoReply?: boolean
}

export type SendOutboundResult = {
  message: Awaited<ReturnType<typeof import("@/lib/firebase/services/inbox-service").createInboxMessage>>
  delivered: boolean
}

export type MessageUsageSnapshot = {
  periodId: string
  phoneNumber?: string
  messagesReceived: number
  messagesSent: number
  botAutoReplies: number
}
