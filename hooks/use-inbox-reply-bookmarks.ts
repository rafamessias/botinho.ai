"use client"

import { useCallback, useEffect, useState } from "react"
import {
    emptyInboxReplyBookmarkStore,
    getInboxReplyBookmarkStorageKey,
    INBOX_SIDEBAR_MAX_ITEMS,
    mergeItemOrder,
    readInboxReplyBookmarkStore,
    reorderItemIds,
    syncPinnedOrder,
    writeInboxReplyBookmarkStore,
    type InboxReplyBookmarkStore,
} from "@/lib/inbox-reply-bookmarks"

type BookmarkKind = "quickAnswers" | "templates"

const orderKeyForKind = (kind: BookmarkKind): "quickAnswerOrder" | "templateOrder" =>
    kind === "quickAnswers" ? "quickAnswerOrder" : "templateOrder"

export const useInboxReplyBookmarks = (
    companyId: string | null,
    userId: string | number | null | undefined,
) => {
    const storageKey =
        companyId && userId != null ? getInboxReplyBookmarkStorageKey(companyId, String(userId)) : null

    const [store, setStore] = useState<InboxReplyBookmarkStore>(emptyInboxReplyBookmarkStore)

    useEffect(() => {
        if (!storageKey) {
            setStore(emptyInboxReplyBookmarkStore())
            return
        }

        setStore(readInboxReplyBookmarkStore(storageKey))
    }, [storageKey])

    const toggleBookmark = useCallback(
        (kind: BookmarkKind, id: string): boolean => {
            if (!storageKey) {
                return false
            }

            let wasSuccessful = true

            setStore((previous) => {
                const currentIds = previous[kind]
                const isPinned = currentIds.includes(id)

                if (isPinned) {
                    const nextStore = {
                        ...previous,
                        [kind]: currentIds.filter((itemId) => itemId !== id),
                    }
                    writeInboxReplyBookmarkStore(storageKey, nextStore)
                    return nextStore
                }

                if (currentIds.length >= INBOX_SIDEBAR_MAX_ITEMS) {
                    wasSuccessful = false
                    return previous
                }

                const nextStore = {
                    ...previous,
                    [kind]: [...currentIds, id],
                }
                writeInboxReplyBookmarkStore(storageKey, nextStore)
                return nextStore
            })

            return wasSuccessful
        },
        [storageKey],
    )

    const reorderItems = useCallback(
        (kind: BookmarkKind, itemIds: string[], activeId: string, overId: string) => {
            if (!storageKey) {
                return
            }

            setStore((previous) => {
                const orderKey = orderKeyForKind(kind)
                const currentOrder = mergeItemOrder(itemIds, previous[orderKey])
                const nextOrder = reorderItemIds(currentOrder, activeId, overId)

                if (!nextOrder) {
                    return previous
                }

                const nextStore = {
                    ...previous,
                    [orderKey]: nextOrder,
                    [kind]: syncPinnedOrder(previous[kind], nextOrder),
                }
                writeInboxReplyBookmarkStore(storageKey, nextStore)
                return nextStore
            })
        },
        [storageKey],
    )

    const toggleQuickAnswerBookmark = useCallback(
        (id: string) => toggleBookmark("quickAnswers", id),
        [toggleBookmark],
    )

    const toggleTemplateBookmark = useCallback(
        (id: string) => toggleBookmark("templates", id),
        [toggleBookmark],
    )

    const reorderQuickAnswers = useCallback(
        (itemIds: string[], activeId: string, overId: string) =>
            reorderItems("quickAnswers", itemIds, activeId, overId),
        [reorderItems],
    )

    const reorderTemplates = useCallback(
        (itemIds: string[], activeId: string, overId: string) =>
            reorderItems("templates", itemIds, activeId, overId),
        [reorderItems],
    )

    return {
        pinnedQuickAnswerIds: store.quickAnswers,
        pinnedTemplateIds: store.templates,
        quickAnswerOrderIds: store.quickAnswerOrder ?? [],
        templateOrderIds: store.templateOrder ?? [],
        toggleQuickAnswerBookmark,
        toggleTemplateBookmark,
        reorderQuickAnswers,
        reorderTemplates,
        maxPinned: INBOX_SIDEBAR_MAX_ITEMS,
    }
}
