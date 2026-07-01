export const INBOX_CONVERSATIONS_DEFAULT_PAGE_SIZE = 20
export const INBOX_CONVERSATIONS_MAX_PAGE_SIZE = 50
export const INBOX_CONVERSATIONS_SEARCH_SCAN_BATCH = 100
export const INBOX_CONVERSATIONS_MAX_SEARCH_SCAN = 1000

export type InboxConversationListFilter = "all" | "unread" | "favorites" | "human" | "bot"

export type InboxConversationCursor = {
  lastMessageSentAt: string
  id: string
}

export const encodeInboxConversationCursor = (cursor: InboxConversationCursor): string =>
  Buffer.from(JSON.stringify(cursor)).toString("base64url")

export const decodeInboxConversationCursor = (value: string): InboxConversationCursor | null => {
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as InboxConversationCursor
    if (typeof parsed?.lastMessageSentAt !== "string" || typeof parsed?.id !== "string") {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export const estimateInboxConversationsPageSize = (): number => {
  if (typeof window === "undefined") {
    return INBOX_CONVERSATIONS_DEFAULT_PAGE_SIZE
  }

  const availableHeight = window.innerHeight - 220
  const estimatedRows = Math.ceil(availableHeight / 72) + 3
  return Math.max(15, Math.min(INBOX_CONVERSATIONS_MAX_PAGE_SIZE, estimatedRows))
}
