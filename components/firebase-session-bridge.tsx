"use client"

import { useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { firebaseAuth } from "@/lib/firebase/client"
import { signInWithCustomTokenClient } from "@/lib/firebase/auth/client-auth"
import { getFirebaseCustomTokenAction } from "@/components/server-actions/auth"

/**
 * Keeps Firebase client auth in sync with the NextAuth session so Firestore
 * realtime listeners (e.g. inbox) can read company-scoped data.
 */
export const FirebaseSessionBridge = () => {
  const { data: session, status } = useSession()
  const bridgePromiseRef = useRef<Promise<void> | null>(null)

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) {
      return
    }

    const uid = String(session.user.id)

    if (firebaseAuth.currentUser?.uid === uid) {
      return
    }

    if (bridgePromiseRef.current) {
      return
    }

    bridgePromiseRef.current = (async () => {
      try {
        const result = await getFirebaseCustomTokenAction()
        if (!result.success || !result.token) {
          console.error("Failed to obtain Firebase custom token:", result.error)
          return
        }

        await signInWithCustomTokenClient(result.token)
      } catch (error) {
        console.error("Failed to bridge Firebase client auth:", error)
      } finally {
        bridgePromiseRef.current = null
      }
    })()
  }, [session?.user?.id, status])

  return null
}
