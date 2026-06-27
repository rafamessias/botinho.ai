import { format, formatDistanceToNow } from "date-fns"
import { isPhoneLikeString, maskPhoneForDisplay } from "@/lib/phone-utils"

export type InboxConversationPriority = "low" | "medium" | "high"
export type InboxMessageSenderType = "customer" | "agent" | "bot" | "system"
export type InboxMessageSentBy = "customer" | "user" | "robot" | "system"
export type InboxMessageStatus = "pending" | "sent" | "delivered" | "read" | "failed"

export type ConversationEntity = {
  id: string
  lastMessagePreview?: string | null
  lastMessageSentAt?: string | Date | null
  unreadCount: number
  priority?: InboxConversationPriority | null
  satisfactionScore?: number | null
  isBookmarked?: boolean | null
  tags?: string[] | null
  createdAt: string | Date
  updatedAt: string | Date
  customer?: {
    id: string
    name?: string | null
    phone?: string | null
    email?: string | null
    address?: string | null
    company?: string | null
  } | null
}

export type MessageEntity = {
  id: string
  content: string
  senderType: InboxMessageSenderType
  sentBy?: InboxMessageSentBy
  status?: InboxMessageStatus | null
  sentAt?: string | Date | null
  createdAt?: string | Date | null
}

export type InboxConversationSummary = {
  id: string
  customerName: string
  hasCustomerName: boolean
  customerPhone?: string
  customerEmail?: string
  customerAddress?: string
  customerCompany?: string
  lastMessage: string
  lastMessageAt?: string | Date
  timestampLabel: string
  unreadCount: number
  priority: InboxConversationPriority
  satisfactionScore?: number
  isBookmarked: boolean
  tags: string[]
}

export type InboxMessage = {
  id: string
  content: string
  senderType: InboxMessageSenderType
  sentBy: InboxMessageSentBy
  sentAt: string | Date
  sentAtLabel: string
  status?: InboxMessageStatus
}

export const resolveSentByFromMessage = (
  senderType: InboxMessageSenderType,
  sentBy?: InboxMessageSentBy,
): InboxMessageSentBy => {
  if (sentBy) return sentBy
  if (senderType === "bot") return "robot"
  if (senderType === "agent") return "user"
  if (senderType === "system") return "system"
  return "customer"
}

export const formatRelativeTimestamp = (value?: string | Date | null) => {
  if (!value) return ""

  const date = typeof value === "string" ? new Date(value) : value
  if (Number.isNaN(date.getTime())) {
    return ""
  }

  return formatDistanceToNow(date, { addSuffix: true })
}

export const formatMessageTimestamp = (value?: string | Date | null) => {
  if (!value) return ""

  const date = typeof value === "string" ? new Date(value) : value
  if (Number.isNaN(date.getTime())) {
    return ""
  }

  return format(date, "HH:mm")
}

export const mapConversationSummary = (
  conversation: ConversationEntity,
  fallbackName: string,
): InboxConversationSummary => {
  const lastMessageAt = conversation.lastMessageSentAt || conversation.updatedAt || conversation.createdAt

  const rawName = conversation.customer?.name?.trim()
  const phone = conversation.customer?.phone || undefined

  const hasCustomerName = !!(rawName && !isPhoneLikeString(rawName))

  const customerName = hasCustomerName
    ? rawName
    : rawName
      ? maskPhoneForDisplay(rawName)
      : phone
        ? maskPhoneForDisplay(phone)
        : fallbackName

  return {
    id: conversation.id,
    customerName,
    hasCustomerName,
    customerPhone: conversation.customer?.phone || undefined,
    customerEmail: conversation.customer?.email || undefined,
    customerAddress: conversation.customer?.address || undefined,
    customerCompany: conversation.customer?.company?.trim() || undefined,
    lastMessage: conversation.lastMessagePreview?.trim() || "",
    lastMessageAt,
    timestampLabel: formatRelativeTimestamp(lastMessageAt),
    unreadCount: conversation.unreadCount ?? 0,
    priority: conversation.priority ?? "medium",
    satisfactionScore: conversation.satisfactionScore ?? undefined,
    isBookmarked: conversation.isBookmarked ?? false,
    tags: conversation.tags?.filter((tag) => !!tag?.trim()) || [],
  }
}

export const mapMessage = (message: MessageEntity): InboxMessage => {
  const sentAt = message.sentAt || message.createdAt || new Date().toISOString()

  return {
    id: message.id,
    content: message.content,
    senderType: message.senderType,
    sentBy: resolveSentByFromMessage(message.senderType, message.sentBy),
    sentAt,
    sentAtLabel: formatMessageTimestamp(sentAt),
    status: message.status ?? undefined,
  }
}

export const sortConversations = (items: InboxConversationSummary[]) => {
  const getTimeValue = (value?: string | Date) => {
    if (!value) return 0
    const date = typeof value === "string" ? new Date(value) : value
    const time = date.getTime()
    return Number.isNaN(time) ? 0 : time
  }

  return [...items].sort((a, b) => {
    if (a.isBookmarked !== b.isBookmarked) {
      return a.isBookmarked ? -1 : 1
    }

    return getTimeValue(b.lastMessageAt) - getTimeValue(a.lastMessageAt)
  })
}
