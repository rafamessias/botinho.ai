"use client"

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"

interface SessionProviderProps {
    children: ReactNode
}

export default function AuthSessionProvider({ children }: SessionProviderProps) {
    return (
        <SessionProvider
            refetchInterval={0}
            refetchOnWindowFocus={false}
        >
            {children}
        </SessionProvider>
    )
} 