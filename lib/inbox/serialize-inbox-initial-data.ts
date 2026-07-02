import type { InboxInitialData } from "@/lib/inbox/load-inbox-initial-data"
import { toIsoString } from "@/lib/inbox/serialize-inbox-data"

/** Ensures inbox bootstrap props are JSON-serializable for RSC → client transfer. */
export const serializeInboxInitialData = (data: InboxInitialData): InboxInitialData => ({
  ...data,
  conversations: data.conversations.map((conversation) => ({
    ...conversation,
    lastMessageAt: conversation.lastMessageAt
      ? (toIsoString(conversation.lastMessageAt) ?? undefined)
      : undefined,
  })),
  messages: data.messages.map((message) => ({
    ...message,
    sentAt: toIsoString(message.sentAt) ?? new Date(0).toISOString(),
  })),
})
