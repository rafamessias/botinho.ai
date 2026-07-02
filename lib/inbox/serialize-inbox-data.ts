import type { getInboxConversationDetail } from "@/lib/firebase/services/inbox-service"

export type InboxConversationDetail = Omit<
  NonNullable<Awaited<ReturnType<typeof getInboxConversationDetail>>>,
  "hasMoreOlderMessages"
>

export type SerializedInboxConversation = Omit<
  InboxConversationDetail,
  "lastMessageSentAt" | "archivedAt" | "createdAt" | "updatedAt" | "messages"
> & {
  lastMessageSentAt: string | null
  archivedAt: string | null
  createdAt: string
  updatedAt: string
}

export type SerializedInboxConversationDetail = SerializedInboxConversation & {
  messages: Array<
    Omit<InboxConversationDetail["messages"][number], "sentAt" | "createdAt" | "updatedAt"> & {
      sentAt: string
      createdAt: string
      updatedAt: string
    }
  >
}

export const toIsoString = (value: Date | string | null | undefined): string | null => {
  if (!value) {
    return null
  }

  if (typeof value === "string") {
    return value
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString()
  }

  if (typeof (value as { toISOString?: () => string }).toISOString === "function") {
    return (value as { toISOString: () => string }).toISOString()
  }

  return null
}

export const serializeInboxMessage = (message: InboxConversationDetail["messages"][number]) => ({
  ...message,
  sentAt: toIsoString(message.sentAt) ?? new Date(0).toISOString(),
  createdAt: toIsoString(message.createdAt) ?? new Date(0).toISOString(),
  updatedAt: toIsoString(message.updatedAt) ?? new Date(0).toISOString(),
})

export const serializeInboxConversation = (
  conversation: Omit<InboxConversationDetail, "messages">,
): SerializedInboxConversation => ({
  ...conversation,
  lastMessageSentAt: toIsoString(conversation.lastMessageSentAt),
  archivedAt: toIsoString(conversation.archivedAt),
  createdAt: toIsoString(conversation.createdAt) ?? new Date(0).toISOString(),
  updatedAt: toIsoString(conversation.updatedAt) ?? new Date(0).toISOString(),
})

export const serializeInboxConversationDetail = (
  conversation: InboxConversationDetail,
): SerializedInboxConversationDetail => ({
  ...serializeInboxConversation(conversation),
  messages: conversation.messages.map(serializeInboxMessage),
})
