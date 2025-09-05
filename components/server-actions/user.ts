"use server"

import { auth } from "@/app/auth"
import { prisma } from "@/prisma/lib/prisma"
import { z } from "zod"
import { Theme } from "@/lib/generated/prisma"
import { getTranslations } from "next-intl/server"

// Validation schemas
const updateThemeSchema = z.object({
    theme: z.enum(["light", "dark", "system"] as const)
})

const updateProfileSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(50, "First name is too long"),
    lastName: z.string().max(50, "Last name is too long").optional(),
    phone: z.string().min(10, "Phone number must be at least 10 characters").regex(/^[+]?[\d\s\-\(\)]{10,}$/, "Invalid phone number format").optional(),
})

const updateLanguageSchema = z.object({
    language: z.enum(["en", "pt-BR"] as const)
})

/**
 * Server action to update user theme preference
 */
export const updateUserThemeAction = async (theme: "light" | "dark" | "system") => {
    const t = await getTranslations("AuthErrors")

    try {
        // Validate input
        const validatedData = updateThemeSchema.parse({ theme })

        // Get current session
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return { success: false, error: "User not found" }
        }

        // Update user theme
        await prisma.user.update({
            where: { id: user.id },
            data: { theme: validatedData.theme as Theme }
        })

        return { success: true, message: "Theme updated successfully" }

    } catch (error) {
        console.error("Update theme error:", error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: t("unexpectedError") }
    }
}

/**
 * Server action to update user profile information
 */
export const updateUserProfileAction = async (profileData: {
    firstName?: string
    lastName?: string
    phone?: string
}) => {
    const t = await getTranslations("AuthErrors")

    try {
        // Validate input
        const validatedData = updateProfileSchema.parse(profileData)

        // Get current session
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return { success: false, error: "User not found" }
        }

        // Check if phone is being updated and if it's already taken
        if (validatedData.phone && validatedData.phone !== user.phone) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    phone: validatedData.phone,
                    id: { not: user.id }
                }
            })

            if (existingUser) {
                return { success: false, error: t("phoneAlreadyInUse") }
            }
        }

        // Update user profile
        await prisma.user.update({
            where: { id: user.id },
            data: {
                ...(validatedData.firstName && { firstName: validatedData.firstName }),
                ...(validatedData.lastName !== undefined && { lastName: validatedData.lastName }),
                ...(validatedData.phone && { phone: validatedData.phone }),
            }
        })

        return { success: true, message: "Profile updated successfully" }

    } catch (error) {
        console.error("Update profile error:", error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: t("unexpectedError") }
    }
}

/**
 * Server action to update user language preference
 */
export const updateUserLanguageAction = async (language: "en" | "pt-BR") => {
    const t = await getTranslations("AuthErrors")

    try {
        // Validate input
        const validatedData = updateLanguageSchema.parse({ language })

        // Get current session
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return { success: false, error: t("userNotFound") }
        }

        // Convert language format for database
        const dbLanguage = validatedData.language === "pt-BR" ? "pt_BR" : "en"

        // Update user language
        await prisma.user.update({
            where: { id: user.id },
            data: { language: dbLanguage }
        })

        return { success: true, message: "Language updated successfully" }

    } catch (error) {
        console.error("Update language error:", error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: t("unexpectedError") }
    }
}

/**
 * Server action to update user avatar
 */
export const updateUserAvatarAction = async (avatarUrl: string) => {
    const t = await getTranslations("AuthErrors")

    try {
        // Validate input
        const avatarSchema = z.string().url("Invalid avatar URL")
        const validatedAvatarUrl = avatarSchema.parse(avatarUrl)

        // Get current session
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return { success: false, error: "User not found" }
        }

        // Update user avatar
        await prisma.user.update({
            where: { id: user.id },
            data: { avatarUrl: validatedAvatarUrl }
        })

        return { success: true, message: "Avatar updated successfully" }

    } catch (error) {
        console.error("Update avatar error:", error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: t("unexpectedError") }
    }
}

/**
 * Server action to get current user preferences
 */
export const getUserPreferencesAction = async () => {
    try {
        // Get current session
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated", preferences: null }
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                theme: true,
                language: true,
                firstName: true,
                lastName: true,
                phone: true,
                avatarUrl: true,
            }
        })

        if (!user) {
            return { success: false, error: "User not found", preferences: null }
        }

        // Transform data for frontend use
        const preferences = {
            theme: user.theme as Theme,
            language: user.language === "pt_BR" ? "pt-BR" : "en",
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            avatarUrl: user.avatarUrl,
        }

        return { success: true, preferences }

    } catch (error) {
        console.error("Get user preferences error:", error)
        return { success: false, error: "Failed to get user preferences", preferences: null }
    }
}

/**
 * Update user's default team
 */
export const updateDefaultTeamAction = async (teamId: number) => {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        // Verify user is a member of the team
        const teamMember = await prisma.teamMember.findFirst({
            where: {
                teamId,
                user: { email: session.user.email }
            }
        })

        if (!teamMember) {
            return { success: false, error: "Not authorized to set this team as default" }
        }

        // Update user's default team
        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: { defaultTeamId: teamId }
        })

        return {
            success: true,
            user: updatedUser
        }

    } catch (error) {
        console.error("Update default team error:", error)
        return { success: false, error: "Failed to update default team" }
    }
}