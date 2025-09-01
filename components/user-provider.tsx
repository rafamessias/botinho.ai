"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useSession } from "next-auth/react"
import { getCurrentUserAction } from "@/components/server-actions/auth"

// User type definition
export interface User {
    id: number
    email: string
    firstName: string
    lastName: string | null
    name: string
    phone: string | null
    avatarUrl: string | null
    language: string
    provider: string
    confirmed: boolean | null
    blocked: boolean | null
    createdAt: Date
    updatedAt: Date
    // Access control flags
    isActive: boolean
    canAccess: boolean
}

// Context type definition
interface UserContextType {
    user: User | null
    loading: boolean
    error: string | null
    refreshUser: () => Promise<void>
    // Access control helpers
    isAuthenticated: boolean
    isActive: boolean
    canAccess: boolean
    hasPermission: (permission: string) => boolean
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined)

// Provider component
interface UserProviderProps {
    children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const { data: session, status } = useSession()

    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Function to fetch user data
    const fetchUser = async () => {
        if (!session?.user?.email) {
            setUser(null)
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            setError(null)
            const result = await getCurrentUserAction()

            if (result.success && result.user) {
                setUser(result.user)
            } else {
                setError(result.error || "Failed to load user data")
                setUser(null)
            }
        } catch (err) {
            console.error("Error fetching user:", err)
            setError("Failed to load user data")
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    // Refresh user function (can be called manually)
    const refreshUser = async () => {
        await fetchUser()
    }

    // Fetch user data when session changes - simplified approach
    useEffect(() => {
        if (status === "loading") {
            return // Still loading session
        }

        if (status === "unauthenticated") {
            setUser(null)
            setLoading(false)
            setError(null)
            return
        }

        // Session is authenticated, fetch user data
        if (status === "authenticated" && session?.user?.email && !user) {
            fetchUser()
        }
    }, [status]) // Only depend on status changes

    // Access control helpers
    const isAuthenticated = !!session && !!user
    const isActive = Boolean(user?.isActive)
    const canAccess = Boolean(user?.canAccess)

    // Permission system (can be extended)
    const hasPermission = (permission: string): boolean => {
        if (!user || !isActive) return false

        // Basic permission checks - can be extended based on your needs
        switch (permission) {
            case "read":
                return canAccess
            case "write":
                return canAccess && Boolean(user.confirmed)
            case "admin":
                return canAccess && Boolean(user.confirmed)
            default:
                return false
        }
    }

    // Context value
    const contextValue: UserContextType = {
        user,
        loading,
        error,
        refreshUser,
        isAuthenticated,
        isActive,
        canAccess,
        hasPermission,
    }

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    )
}

// Custom hook to use the user context
export const useUser = (): UserContextType => {
    const context = useContext(UserContext)

    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider")
    }

    return context
}

// Access control component
interface ProtectedProps {
    children: ReactNode
    fallback?: ReactNode
    requireAuth?: boolean
    requireActive?: boolean
    requirePermission?: string
}

export const Protected: React.FC<ProtectedProps> = ({
    children,
    fallback = <div>Access denied</div>,
    requireAuth = true,
    requireActive = false,
    requirePermission
}) => {
    const { isAuthenticated, isActive, hasPermission, loading } = useUser()

    if (loading) {
        return <div>Loading...</div>
    }

    // Check authentication
    if (requireAuth && !isAuthenticated) {
        return <>{fallback}</>
    }

    // Check active status
    if (requireActive && !isActive) {
        return <>{fallback}</>
    }

    // Check specific permission
    if (requirePermission && !hasPermission(requirePermission)) {
        return <>{fallback}</>
    }

    return <>{children}</>
}
