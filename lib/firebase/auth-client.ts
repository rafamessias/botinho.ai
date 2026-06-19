"use client"

import { firebaseAuth } from "@/lib/firebase/client"

const MAX_SESSION_SYNC_ATTEMPTS = 3

let sessionSyncPromise: Promise<void> | null = null
let passiveSessionSyncEnabled = true

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const setPassiveSessionSyncEnabled = (enabled: boolean) => {
  passiveSessionSyncEnabled = enabled
}

export const establishServerSession = async () => {
  const user = firebaseAuth.currentUser
  if (!user) {
    throw new Error("No authenticated Firebase user")
  }

  if (sessionSyncPromise) {
    return sessionSyncPromise
  }

  sessionSyncPromise = (async () => {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= MAX_SESSION_SYNC_ATTEMPTS; attempt += 1) {
      try {
        const idToken = await user.getIdToken(attempt > 1)
        const response = await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ idToken }),
        })

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}))
          throw new Error(payload.error ?? "Failed to create session")
        }

        return
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("Failed to create session")
        if (attempt < MAX_SESSION_SYNC_ATTEMPTS) {
          await wait(250 * attempt)
        }
      }
    }

    throw lastError ?? new Error("Failed to create session")
  })()

  try {
    await sessionSyncPromise
  } finally {
    sessionSyncPromise = null
  }
}

export const shouldSyncPassiveSession = () => passiveSessionSyncEnabled

export const clearServerSession = async () => {
  await fetch("/api/auth/session", { method: "DELETE", credentials: "include" })
  await firebaseAuth.signOut()
}
