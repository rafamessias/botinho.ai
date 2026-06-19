"use client"

import { useEffect, useRef } from "react"
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  limit,
} from "firebase/firestore"
import { firebaseDb } from "@/lib/firebase/client"

export const useInboxRealtime = (params: {
  companyId: string | number | null | undefined
  conversationId?: string | null
  onConversationsChange?: () => void
  onMessagesChange?: () => void
}) => {
  const companyId = params.companyId ? String(params.companyId) : null
  const conversationId = params.conversationId ?? null

  const onConversationsChangeRef = useRef(params.onConversationsChange)
  const onMessagesChangeRef = useRef(params.onMessagesChange)
  onConversationsChangeRef.current = params.onConversationsChange
  onMessagesChangeRef.current = params.onMessagesChange

  useEffect(() => {
    if (!companyId) return

    const conversationsQuery = query(
      collection(firebaseDb, "companies", companyId, "conversations"),
      orderBy("lastMessageSentAt", "desc"),
      limit(50),
    )

    let isInitialSnapshot = true

    const unsubscribe = onSnapshot(
      conversationsQuery,
      () => {
        if (isInitialSnapshot) {
          isInitialSnapshot = false
          return
        }

        onConversationsChangeRef.current?.()
      },
      (error) => {
        console.error("Inbox conversations listener error:", error)
      },
    )

    return () => unsubscribe()
  }, [companyId])

  useEffect(() => {
    if (!companyId || !conversationId) return

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
    )

    let isInitialSnapshot = true

    const unsubscribe = onSnapshot(
      messagesQuery,
      () => {
        if (isInitialSnapshot) {
          isInitialSnapshot = false
          return
        }

        onMessagesChangeRef.current?.()
      },
      (error) => {
        console.error("Inbox messages listener error:", error)
      },
    )

    return () => unsubscribe()
  }, [companyId, conversationId])
}
