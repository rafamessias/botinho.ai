"use client"

import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { firebaseAuth } from "@/lib/firebase/client"
import { establishServerSession, clearServerSession, shouldSyncPassiveSession } from "@/lib/firebase/auth-client"

type FirebaseAuthContextValue = {
  user: User | null
  loading: boolean
  refreshSession: () => Promise<void>
  signOut: () => Promise<void>
}

const FirebaseAuthContext = createContext<FirebaseAuthContextValue | undefined>(undefined)

export const FirebaseAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (nextUser) => {
      setUser(nextUser)
      setLoading(false)

        if (nextUser && shouldSyncPassiveSession()) {
          try {
            await establishServerSession()
          } catch (error) {
            console.error("Failed to sync Firebase session cookie:", error)
          }
        }
    })

    return () => unsubscribe()
  }, [])

  const value = useMemo<FirebaseAuthContextValue>(
    () => ({
      user,
      loading,
      refreshSession: async () => {
        if (!firebaseAuth.currentUser) return
        await establishServerSession()
      },
      signOut: async () => {
        await clearServerSession()
        setUser(null)
      },
    }),
    [user],
  )

  return <FirebaseAuthContext.Provider value={value}>{children}</FirebaseAuthContext.Provider>
}

export const useFirebaseAuth = () => {
  const context = useContext(FirebaseAuthContext)
  if (!context) {
    throw new Error("useFirebaseAuth must be used within FirebaseAuthProvider")
  }
  return context
}
