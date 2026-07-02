import type { QuickAnswerView, TemplateView } from "@/components/ai-training/types"
import type { ConversationFilter } from "@/components/inbox/conversation-list-panel"
import { InboxMessageCache } from "@/components/inbox/inbox-message-cache"
import type { InboxConversationSummary, InboxMessage } from "@/components/inbox/inbox-mappers"
import type { InboxConnectionView } from "@/components/server-actions/inbox"
import type { InboxInitialData } from "@/lib/inbox/load-inbox-initial-data"

export type InboxSessionSnapshot = {
  companyId: string
  conversations: InboxConversationSummary[]
  unreadTotal: number
  selectedConversationId: string | null
  messages: InboxMessage[]
  connections: InboxConnectionView[]
  whatsappConfigured: boolean
  whatsappAvailable: boolean
  whatsappNeedsRepair: boolean
  quickAnswers: QuickAnswerView[]
  templates: TemplateView[]
  selectedConnectionIds: string[]
  searchQuery: string
  conversationFilter: ConversationFilter
  updatedAt: number
}

export const INBOX_SESSION_STALE_MS = 5 * 60_000

const cloneSnapshot = (snapshot: InboxSessionSnapshot): InboxSessionSnapshot => ({
  ...snapshot,
  conversations: snapshot.conversations.map((conversation) => ({ ...conversation })),
  messages: snapshot.messages.map((message) => ({ ...message })),
  connections: snapshot.connections.map((connection) => ({ ...connection })),
  quickAnswers: snapshot.quickAnswers.map((item) => ({ ...item })),
  templates: snapshot.templates.map((item) => ({ ...item })),
  selectedConnectionIds: [...snapshot.selectedConnectionIds],
})

class InboxSessionCacheStore {
  private snapshot: InboxSessionSnapshot | null = null
  readonly messageCache = new InboxMessageCache()

  getSnapshot(companyId: string): InboxSessionSnapshot | null {
    if (this.snapshot?.companyId !== companyId) {
      return null
    }

    return cloneSnapshot(this.snapshot)
  }

  isFresh(companyId: string, maxAgeMs = INBOX_SESSION_STALE_MS): boolean {
    if (this.snapshot?.companyId !== companyId) {
      return false
    }

    return Date.now() - this.snapshot.updatedAt < maxAgeMs
  }

  save(snapshot: Omit<InboxSessionSnapshot, "updatedAt">) {
    this.snapshot = {
      ...snapshot,
      conversations: snapshot.conversations.map((conversation) => ({ ...conversation })),
      messages: snapshot.messages.map((message) => ({ ...message })),
      connections: snapshot.connections.map((connection) => ({ ...connection })),
      quickAnswers: snapshot.quickAnswers.map((item) => ({ ...item })),
      templates: snapshot.templates.map((item) => ({ ...item })),
      selectedConnectionIds: [...snapshot.selectedConnectionIds],
      updatedAt: Date.now(),
    }
  }

  seedFromInitialData(companyId: string, initialData: InboxInitialData) {
    const conversationId = initialData.selectedConversationId
    if (conversationId && initialData.messages.length > 0) {
      const conversation = initialData.conversations.find((item) => item.id === conversationId)
      if (!this.messageCache.get(conversationId)) {
        this.messageCache.set(
          conversationId,
          this.messageCache.createEntry(
            initialData.messages,
            [],
            conversation?.lastMessageAt,
          ),
        )
      }
    }

    this.save({
      companyId,
      conversations: initialData.conversations,
      unreadTotal: initialData.unreadTotal,
      selectedConversationId: initialData.selectedConversationId,
      messages: initialData.messages,
      connections: initialData.connections,
      whatsappConfigured: initialData.whatsappConfigured,
      whatsappAvailable: initialData.whatsappAvailable,
      whatsappNeedsRepair: initialData.whatsappNeedsRepair,
      quickAnswers: initialData.quickAnswers,
      templates: initialData.templates,
      selectedConnectionIds: [],
      searchQuery: "",
      conversationFilter: "all",
    })
  }

  clear(companyId?: string) {
    if (companyId && this.snapshot?.companyId !== companyId) {
      return
    }

    this.snapshot = null
    this.messageCache.clear()
  }
}

export const inboxSessionCache = new InboxSessionCacheStore()

export const resolveInboxBootstrap = (
  companyId: string | null,
): {
  source: "session" | "empty"
  snapshot: InboxSessionSnapshot | null
} => {
  if (!companyId) {
    return { source: "empty", snapshot: null }
  }

  const normalizedCompanyId = String(companyId)
  const sessionSnapshot = inboxSessionCache.getSnapshot(normalizedCompanyId)
  if (sessionSnapshot) {
    return { source: "session", snapshot: sessionSnapshot }
  }

  return { source: "empty", snapshot: null }
}
