"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useSession } from "next-auth/react"
import { getCurrentUserAction } from "@/components/server-actions/auth"
import { useTheme } from "next-themes"
import { BillingInterval, PlanType, SubscriptionStatus, Theme } from "@/lib/generated/prisma"
import { getUserTeamsLightAction } from "./server-actions/team"
import LoadingComp from "./loading-comp"
import { useRouter } from "next/navigation"
import { createCheckoutSessionAction } from '@/components/server-actions/auth'

export interface UserTeam {
    id: number
    name: string
    members?: Array<{
        id: number
        isAdmin: boolean
        canPost: boolean
        canApprove: boolean
        isOwner: boolean,
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
    theme: Theme
    teams: UserTeam[] | null
    defaultTeamId: number | null
    usagePercentage: number
}

// Context type definition
interface UserContextType {
    user: User | null
    setUser: (user: User | null) => void
    loading: boolean
    error: string | null
    refreshUser: (teamsUpdate: boolean) => Promise<void>
    isAuthenticated: boolean
    hasPermission: () => { isAdmin: boolean, canPost: boolean, canApprove: boolean }
    usagePercentage: number
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined)

// Provider component
interface UserProviderProps {
    children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const { data: session, status } = useSession()
    const router = useRouter()
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
                    const resultTeams = await getUserTeamsLightAction(result.user.id, result.user.defaultTeamId || 0)
                    if (resultTeams && resultTeams?.success && resultTeams?.teams) {
                        setUser({ ...result.user, teams: resultTeams.teams as UserTeam[] })
                    } else {
                        setUser({ ...result.user, teams: null })
                    }


                    // Check if user exists and has a pending subscription
                    if (resultTeams?.customerSubscription && resultTeams.customerSubscription.status === SubscriptionStatus.pending) {
                        const subscription = resultTeams.customerSubscription
                        const checkoutResult = await createCheckoutSessionAction(
                            subscription.plan?.planType || PlanType.FREE,
                            subscription.billingInterval || BillingInterval.monthly,
                            session?.user?.email,
                            result.user.defaultTeamId || 0,
                            subscription.id
                        )

                        if (checkoutResult?.success && checkoutResult.checkoutUrl) {
                            // Redirect browser to the Stripe checkout
                            router.push(checkoutResult.checkoutUrl as string)
                        }

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
        // Check if session email changed to handle user switching
        if (status === "authenticated") {
            fetchUser()
        }
    }, [status, session?.user?.email]) // Depend on status AND email changes

    // Access control helpers
    const isAuthenticated = !!session && !!user

    // Permission system (can be extended)
    const hasPermission = (): { isAdmin: boolean, canPost: boolean, canApprove: boolean } => {
        if (!user) return { isAdmin: false, canPost: false, canApprove: false }

        // Assuming user.teams is an array of team objects with members
        const team = user.teams?.find((t: any) => t.id === user.defaultTeamId)
        if (!team || !team.members || !Array.isArray(team.members)) return { isAdmin: false, canPost: false, canApprove: false }

        // Return true if the user has any member records in their default team
        const userTeamMember = team.members[0]

        return { isAdmin: userTeamMember?.isAdmin || false, canPost: userTeamMember?.canPost || false, canApprove: userTeamMember?.canApprove || false }

    }
    // Context value
    const contextValue: UserContextType = {
        user,
        setUser,
        loading,
        error,
        refreshUser,
        isAuthenticated,
        hasPermission,
        usagePercentage: user?.usagePercentage || 0
    }

    return (
        <UserContext.Provider value={contextValue}>
            {loading ? <LoadingComp isLoadingProp={loading} /> : children}
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

