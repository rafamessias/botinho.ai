export const INBOX_SIDEBAR_MAX_ITEMS = 3

export type InboxReplyBookmarkStore = {
    quickAnswers: string[]
    templates: string[]
    quickAnswerOrder?: string[]
    templateOrder?: string[]
}

export const emptyInboxReplyBookmarkStore = (): InboxReplyBookmarkStore => ({
    quickAnswers: [],
    templates: [],
})

export const getInboxReplyBookmarkStorageKey = (companyId: string, userId: string) =>
    `inbox-reply-bookmarks:${companyId}:${userId}`

export const readInboxReplyBookmarkStore = (storageKey: string): InboxReplyBookmarkStore => {
    if (typeof window === "undefined") {
        return emptyInboxReplyBookmarkStore()
    }

    try {
        const raw = localStorage.getItem(storageKey)
        if (!raw) {
            return emptyInboxReplyBookmarkStore()
        }

        const parsed = JSON.parse(raw) as Partial<InboxReplyBookmarkStore>
        return {
            quickAnswers: sanitizeBookmarkIds(parsed.quickAnswers),
            templates: sanitizeBookmarkIds(parsed.templates),
            quickAnswerOrder: sanitizeOrderIds(parsed.quickAnswerOrder),
            templateOrder: sanitizeOrderIds(parsed.templateOrder),
        }
    } catch {
        return emptyInboxReplyBookmarkStore()
    }
}

export const writeInboxReplyBookmarkStore = (storageKey: string, store: InboxReplyBookmarkStore) => {
    if (typeof window === "undefined") {
        return
    }

    localStorage.setItem(storageKey, JSON.stringify(store))
}

const sanitizeBookmarkIds = (value: unknown): string[] => {
    if (!Array.isArray(value)) {
        return []
    }

    return value.filter((item): item is string => typeof item === "string").slice(0, INBOX_SIDEBAR_MAX_ITEMS)
}

const sanitizeOrderIds = (value: unknown): string[] | undefined => {
    if (!Array.isArray(value)) {
        return undefined
    }

    const ids = value.filter((item): item is string => typeof item === "string")
    return ids.length > 0 ? ids : undefined
}

export const mergeItemOrder = (itemIds: string[], storedOrder: string[] | undefined): string[] => {
    if (!storedOrder || storedOrder.length === 0) {
        return itemIds
    }

    const storedIdSet = new Set(storedOrder)
    const merged = storedOrder.filter((id) => itemIds.includes(id))

    for (const id of itemIds) {
        if (!storedIdSet.has(id)) {
            merged.push(id)
        }
    }

    return merged
}

export const applyItemOrder = <T extends { id: string }>(items: T[], orderIds: string[] | undefined): T[] => {
    if (!orderIds || orderIds.length === 0) {
        return items
    }

    const itemsById = new Map(items.map((item) => [item.id, item]))
    const ordered: T[] = []
    const seen = new Set<string>()

    for (const id of orderIds) {
        const item = itemsById.get(id)
        if (item) {
            ordered.push(item)
            seen.add(id)
        }
    }

    for (const item of items) {
        if (!seen.has(item.id)) {
            ordered.push(item)
        }
    }

    return ordered
}

export const reorderItemIds = (ids: string[], activeId: string, overId: string): string[] | null => {
    const oldIndex = ids.indexOf(activeId)
    const newIndex = ids.indexOf(overId)

    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        return null
    }

    const nextIds = [...ids]
    const [movedId] = nextIds.splice(oldIndex, 1)
    nextIds.splice(newIndex, 0, movedId)
    return nextIds
}

export const syncPinnedOrder = (pinnedIds: string[], fullOrder: string[]): string[] =>
    fullOrder.filter((id) => pinnedIds.includes(id))

export const resolveSidebarItems = <T extends { id: string }>(
    items: T[],
    bookmarkedIds: string[],
    maxItems = INBOX_SIDEBAR_MAX_ITEMS,
    orderIds?: string[],
): T[] => {
    const orderedItems = applyItemOrder(
        items,
        orderIds?.length ? mergeItemOrder(items.map((item) => item.id), orderIds) : undefined,
    )
    const itemsById = new Map(orderedItems.map((item) => [item.id, item]))

    const pinnedItems = bookmarkedIds
        .slice(0, maxItems)
        .map((id) => itemsById.get(id))
        .filter((item): item is T => item != null)

    if (pinnedItems.length >= maxItems) {
        return pinnedItems
    }

    const pinnedIdSet = new Set(pinnedItems.map((item) => item.id))
    const remainingItems = orderedItems.filter((item) => !pinnedIdSet.has(item.id))

    return [...pinnedItems, ...remainingItems].slice(0, maxItems)
}
