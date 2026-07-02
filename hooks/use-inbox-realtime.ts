"use client"

import { useEffect, useRef } from "react"
import type { DocumentData, QuerySnapshot } from "firebase/firestore"

export const INBOX_REALTIME_MESSAGES_LIMIT = 100

export const useInboxRealtime = (params: {
  companyId: string | number | null | undefined
  conversationId?: string | null
  onConversationsChange?: (snapshot: QuerySnapshot<DocumentData>) => void
  onMessagesChange?: (snapshot: QuerySnapshot<DocumentData>) => void
  onListenerError?: () => void
  onListenerConnected?: () => void
}) => {
  const companyId = params.companyId ? String(params.companyId) : null
  const conversationId = params.conversationId ?? null

  const onConversationsChangeRef = useRef(params.onConversationsChange)
  const onMessagesChangeRef = useRef(params.onMessagesChange)
  const onListenerErrorRef = useRef(params.onListenerError)
  const onListenerConnectedRef = useRef(params.onListenerConnected)
  onConversationsChangeRef.current = params.onConversationsChange
  onMessagesChangeRef.current = params.onMessagesChange
  onListenerErrorRef.current = params.onListenerError
  onListenerConnectedRef.current = params.onListenerConnected

  useEffect(() => {
    if (!companyId) return

    let unsubscribe = () => {}
    let cancelled = false

    void (async () => {
      const { collection, onSnapshot, orderBy, query, limit } = await import("firebase/firestore")
      const { firebaseDb } = await import("@/lib/firebase/client")

      if (cancelled) return

      const conversationsQuery = query(
        collection(firebaseDb, "companies", companyId, "conversations"),
        orderBy("lastMessageSentAt", "desc"),
        limit(50),
      )

      let isInitialSnapshot = true

      unsubscribe = onSnapshot(
        conversationsQuery,
        (snapshot) => {
          if (isInitialSnapshot) {
            isInitialSnapshot = false
            onListenerConnectedRef.current?.()
            return
          }

          onConversationsChangeRef.current?.(snapshot)
        },
        (error) => {
          console.error("Inbox conversations listener error:", error)
          onListenerErrorRef.current?.()
        },
      )
    })()

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [companyId])

  useEffect(() => {
    if (!companyId || !conversationId) return

    let unsubscribe = () => {}
    let cancelled = false

    void (async () => {
      const { collection, onSnapshot, orderBy, query, limit } = await import("firebase/firestore")
      const { firebaseDb } = await import("@/lib/firebase/client")

      if (cancelled) return

      const messagesQuery = query(
        collection(
          firebaseDb,
          "companies",
          companyId,
          "conversations",
          conversationId,
          "messages",
        ),
        orderBy("sentAt", "asc"),
        limit(INBOX_REALTIME_MESSAGES_LIMIT),
      )

      let isInitialSnapshot = true

      unsubscribe = onSnapshot(
        messagesQuery,
        (snapshot) => {
          if (isInitialSnapshot) {
            isInitialSnapshot = false
            onListenerConnectedRef.current?.()
            return
          }

          onMessagesChangeRef.current?.(snapshot)
        },
        (error) => {
          console.error("Inbox messages listener error:", error)
          onListenerErrorRef.current?.()
        },
      )
    })()

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [companyId, conversationId])
}
