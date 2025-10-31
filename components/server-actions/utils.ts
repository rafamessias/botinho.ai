"use server"

import { auth } from "@/app/auth"
import { prisma } from "@/prisma/lib/prisma"
import { z } from "zod"

export type BaseActionResponse<T = undefined> = {
    success: boolean
    data?: T
    message?: string
    error?: string
}

export type CompanyMembershipGuardOptions = {
    companyId?: number
    requireAdmin?: boolean
    requireCanPost?: boolean
}

export const resolveCompanyContext = async (options: CompanyMembershipGuardOptions = {}) => {
    const session = await auth()

    if (!session?.user?.id) {
        throw new Error("Not authenticated")
    }

    const userId = Number(session.user.id)
    if (Number.isNaN(userId)) {
        throw new Error("Invalid user identifier")
    }

    let companyId = options.companyId ?? session.user.defaultCompanyId ?? null

    if (!companyId) {
        const fallbackMembership = await prisma.companyMember.findFirst({
            where: {
                userId,
                companyMemberStatus: "accepted",
            },
            orderBy: { createdAt: "asc" },
            select: { companyId: true },
        })

        companyId = fallbackMembership?.companyId ?? null
    }

    if (companyId == null) {
        throw new Error("Company not selected")
    }

    const numericCompanyId = Number(companyId)
    if (Number.isNaN(numericCompanyId)) {
        throw new Error("Invalid company identifier")
    }

    const membership = await prisma.companyMember.findUnique({
        where: {
            userId_companyId: {
                userId,
                companyId: numericCompanyId,
            },
        },
        select: {
            companyMemberStatus: true,
            isAdmin: true,
            canPost: true,
        },
    })

    if (!membership || membership.companyMemberStatus !== "accepted") {
        throw new Error("Not authorized for this company")
    }

    if (options.requireAdmin && !membership.isAdmin) {
        throw new Error("Requires admin permissions")
    }

    if (options.requireCanPost && !(membership.isAdmin || membership.canPost)) {
        throw new Error("Insufficient permissions")
    }

    return { companyId: numericCompanyId, userId, membership }
}

export const handleAction = async <T>(fn: () => Promise<BaseActionResponse<T>>): Promise<BaseActionResponse<T>> => {
    try {
        return await fn()
    } catch (error) {
        if (error instanceof z.ZodError) {
            const fallback = error.errors[0]?.message ?? "Invalid data"
            return { success: false, error: fallback }
        }

        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: "Unexpected error" }
    }
}


