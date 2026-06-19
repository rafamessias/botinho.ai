"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useSession } from "next-auth/react"
import { getCurrentUserAction } from "@/components/server-actions/auth"
import { useTheme } from "next-themes"
import { BillingInterval, PlanType, SubscriptionStatus, UserTheme } from "@/lib/types/enums"
import { getUserCompaniesLightAction } from "./server-actions/company"
import LoadingComp from "./loading-comp"
import { useRouter } from "next/navigation"
import { createCheckoutSessionAction } from '@/components/server-actions/auth'

export interface UserCompany {
    id: string | number
    slug?: string
    name: string
    members?: Array<{
        id: string | number
        isAdmin: boolean
        canPost: boolean
        canApprove: boolean
        isOwner: boolean
    }>
}

export interface User {
    id: string | number
    uid?: string
    email: string
    firstName: string
    lastName: string | null
    name: string
    phone: string | null
    avatarUrl: string | null
    language: string
    theme: UserTheme
    companies: UserCompany[] | null
    defaultCompanyId: string | number | null
    usagePercentage: number
    position?: string | null
    companyName?: string | null
    country?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    websiteUrl?: string | null
    githubUrl?: string | null
}

interface UserContextType {
    user: User | null
    setUser: (user: User | null) => void
    loading: boolean
    error: string | null
    refreshUser: (companiesUpdate: boolean) => Promise<void>
    isAuthenticated: boolean
    hasPermission: () => { isAdmin: boolean, canPost: boolean, canApprove: boolean }
    usagePercentage: number
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
    children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { theme, setTheme } = useTheme()

    const fetchUser = async (companiesUpdate: boolean = true) => {
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
                if (companiesUpdate) {
                    const resultCompanies = await getUserCompaniesLightAction(result.user.id, result.user.defaultCompanyId || "")
                    if (resultCompanies && resultCompanies?.success && resultCompanies?.companies) {
                        setUser({ ...result.user, companies: resultCompanies.companies as UserCompany[] })
                    } else {
                        setUser({ ...result.user, companies: null })
                    }

                    if (resultCompanies?.customerSubscription && resultCompanies.customerSubscription.status === SubscriptionStatus.pending) {
                        const subscription = resultCompanies.customerSubscription
                        const checkoutResult = await createCheckoutSessionAction(
                            subscription.plan?.planType || PlanType.FREE,
                            subscription.billingInterval || BillingInterval.monthly,
                            session.user.email,
                            result.user.defaultCompanyId || "",
                            subscription.id
                        )

                        if (checkoutResult?.success && checkoutResult.checkoutUrl) {
                            router.push(checkoutResult.checkoutUrl as string)
                        }
                    }
                } else {
                    setUser({ ...result.user, companies: user?.companies || null })
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

    const refreshUser = async (companiesUpdate: boolean = true) => {
        await fetchUser(companiesUpdate)
    }

    useEffect(() => {
        if (status === "loading") {
            return
        }

        if (status !== "authenticated" || !session?.user?.email) {
            setUser(null)
            setLoading(false)
            setError(null)
            return
        }

        fetchUser()
    }, [status, session?.user?.email, session?.user?.id])

    const isAuthenticated = status === "authenticated" && !!user

    const hasPermission = (): { isAdmin: boolean, canPost: boolean, canApprove: boolean } => {
        if (!user) return { isAdmin: false, canPost: false, canApprove: false }

        const company = user.companies?.find((c) => c.id === user.defaultCompanyId)
        if (!company || !company.members || !Array.isArray(company.members)) {
            return { isAdmin: false, canPost: false, canApprove: false }
        }

        const userCompanyMember = company.members[0]
        return {
            isAdmin: userCompanyMember?.isAdmin || false,
            canPost: userCompanyMember?.canPost || false,
            canApprove: userCompanyMember?.canApprove || false,
        }
    }

    const contextValue: UserContextType = {
        user,
        setUser,
        loading,
        error,
        refreshUser,
        isAuthenticated,
        hasPermission,
        usagePercentage: user?.usagePercentage || 0,
    }

    return (
        <UserContext.Provider value={contextValue}>
            {children}
            <LoadingComp isLoadingProp={loading} />
        </UserContext.Provider>
    )
}

export const useUser = (): UserContextType => {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider")
    }
    return context
}
