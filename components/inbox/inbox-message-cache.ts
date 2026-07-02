type SuggestedResponse = {
    id: string
    text: string
    category: string
}

export type InboxCachedMessage = {
    id: string
    content: string
    senderType: "customer" | "agent" | "bot" | "system"
    sentBy: "customer" | "user" | "robot" | "system"
    sentAt: string | Date
    sentAtLabel: string
    status?: "pending" | "sent" | "delivered" | "read" | "failed"
}

export type InboxMessageCacheEntry = {
    messages: InboxCachedMessage[]
    suggestedResponses: SuggestedResponse[]
    lastMessageAtKey: number
}

const toLastMessageAtKey = (value?: string | Date | null) => {
    if (!value) {
        return 0
    }

    const date = typeof value === "string" ? new Date(value) : value
    const time = date.getTime()
    return Number.isNaN(time) ? 0 : time
}

export class InboxMessageCache {
    private entries = new Map<string, InboxMessageCacheEntry>()

    get(conversationId: string) {
        return this.entries.get(conversationId)
    }

    set(conversationId: string, entry: InboxMessageCacheEntry) {
        this.entries.set(conversationId, entry)
    }

    delete(conversationId: string) {
        this.entries.delete(conversationId)
    }

    clear() {
        this.entries.clear()
    }

    isFresh(conversationId: string, lastMessageAt?: string | Date | null) {
        const cached = this.entries.get(conversationId)
        if (!cached) {
            return false
        }

        return cached.lastMessageAtKey === toLastMessageAtKey(lastMessageAt)
    }

    updateMessages(conversationId: string, messages: InboxCachedMessage[], lastMessageAt?: string | Date | null) {
        const existing = this.entries.get(conversationId)
        if (!existing) {
            return
        }

        this.entries.set(conversationId, {
            ...existing,
            messages,
            lastMessageAtKey: toLastMessageAtKey(lastMessageAt) || existing.lastMessageAtKey,
        })
    }

    createEntry(
        messages: InboxCachedMessage[],
        suggestedResponses: SuggestedResponse[],
        lastMessageAt?: string | Date | null,
    ): InboxMessageCacheEntry {
        return {
            messages,
            suggestedResponses,
            lastMessageAtKey: toLastMessageAtKey(lastMessageAt),
        }
    }
}
