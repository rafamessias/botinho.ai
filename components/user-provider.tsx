"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useSession } from "next-auth/react"
import { getCurrentUserAction } from "@/components/server-actions/auth"
import { useTheme } from "next-themes"
import { Theme } from "@/lib/generated/prisma"
import { getUserTeamsAction } from "./server-actions/team"

export interface UserTeam {
    id: number
    name: string
    description?: string | null
    totalSurveys: number
    totalActiveSurveys: number
    totalResponses: number
    members?: Array<{
        id: number
        isAdmin: boolean
        canPost: boolean
        canApprove: boolean
        isOwner: boolean
        teamMemberStatus: string
        user: {
            id: number
            firstName: string
            lastName: string
            email: string
            avatarUrl?: string | null
        }
    }>
}

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
    theme: Theme
    teams: UserTeam[] | null
    defaultTeamId: number | null
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
    refreshUser: (teamsUpdate: boolean) => Promise<void>
    // Access control helpers
    isAuthenticated: boolean
    isActive: boolean
    canAccess: boolean
    hasPermission: () => { isAdmin: boolean, canPost: boolean, canApprove: boolean }
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
    const { theme, setTheme } = useTheme()


    // Function to fetch user data
    const fetchUser = async (teamsUpdate: boolean = true) => {
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
                if (teamsUpdate) {
                    const resultTeams = await getUserTeamsAction(true)
                    if (resultTeams && resultTeams?.success && resultTeams?.teams) {
                        setUser({ ...result.user, teams: resultTeams.teams as UserTeam[] })
                    } else {
                        setUser({ ...result.user, teams: null })
                    }
                } else {
                    setUser({ ...result.user, teams: user?.teams || null })
                }

                if (theme !== result.user?.theme) setTheme(result.user?.theme)

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
    const refreshUser = async (teamsUpdate: boolean = true) => {
        await fetchUser(teamsUpdate)
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
    const hasPermission = (): { isAdmin: boolean, canPost: boolean, canApprove: boolean } => {
        if (!user || !isActive) return { isAdmin: false, canPost: false, canApprove: false }

        // Assuming user.teams is an array of team objects with members
        const team = user.teams?.find((t: any) => t.id === user.defaultTeamId)
        if (!team || !team.members || !Array.isArray(team.members)) return { isAdmin: false, canPost: false, canApprove: false }

        // Return true if the user has any member records in their default team
        const userTeamMember = team.members.find((member: any) => member.userId === user.id)

        return { isAdmin: userTeamMember?.isAdmin || false, canPost: userTeamMember?.canPost || false, canApprove: userTeamMember?.canApprove || false }

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

