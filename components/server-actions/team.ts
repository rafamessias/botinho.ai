"use server"

import { auth } from "@/app/auth"
import { prisma } from "@/prisma/lib/prisma"
import { z } from "zod"
import { getTranslations } from "next-intl/server"
import { generateConfirmationToken, getCurrentLocale } from "./auth"
// Using Web Crypto API instead of Node.js crypto module
import bcrypt from "bcryptjs"
import resend from "@/lib/resend"
import TeamInvitationEmail from "@/emails/TeamInvitationEmail"
import { validateApiAccess, validateRemoveBranding } from "@/lib/services/subscription-validation"

// Validation schemas
const createTeamSchema = z.object({
    name: z.string().min(2, "Team name must be at least 2 characters"),
    description: z.string().optional(),
})

const updateTeamSchema = z.object({
    id: z.number(),
    name: z.string().min(2, "Team name must be at least 2 characters"),
    description: z.string().optional(),
})

const inviteMemberSchema = z.object({
    teamId: z.number(),
    email: z.string().email("Invalid email address"),
    isAdmin: z.boolean().default(false),
    canPost: z.boolean().default(true),
    canApprove: z.boolean().default(false),
})

const updateMemberSchema = z.object({
    teamId: z.number(),
    userId: z.number(),
    isAdmin: z.boolean(),
    canPost: z.boolean(),
    canApprove: z.boolean(),
})

const removeMemberSchema = z.object({
    teamId: z.number(),
    userId: z.number(),
})

const deleteTeamSchema = z.object({
    teamId: z.number(),
})

const generateTeamTokenSchema = z.object({
    teamId: z.number(),
    tokenType: z.enum(["survey", "api"]).default("survey"),
})

const regenerateTeamTokenSchema = z.object({
    teamId: z.number(),
    tokenType: z.enum(["survey", "api"]).default("survey"),
})

const updateTeamBrandingSchema = z.object({
    teamId: z.number(),
    branding: z.boolean(),
})

/**
 * Create a new team and make the current user the owner
 */
export const createTeamAction = async (formData: z.infer<typeof createTeamSchema>) => {
    const t = await getTranslations("Team")

    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        const validatedData = createTeamSchema.parse(formData)

        // Get current user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return { success: false, error: "User not found" }
        }

        // Create team and team member in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create the team
            const team = await tx.team.create({
                data: {
                    name: validatedData.name,
                    description: validatedData.description,
                }
            })

            // Create team member (owner)
            const teamMember = await tx.teamMember.create({
                data: {
                    userId: user.id,
                    teamId: team.id,
                    isAdmin: true,
                    canPost: true,
                    canApprove: true,
                    isOwner: true,
                    teamMemberStatus: "accepted",
                }
            })

            // Add default survey types to the team using createMany for efficiency
            let defaultSurveyTypes = [{ name: "Product Feedback", isDefault: true, teamId: team.id }]
            defaultSurveyTypes.push(...["Customer Satisfaction", "Employee Engagement", "Market Research", "Event Feedback", "User Experience"].map(name => ({ name, isDefault: false, teamId: team.id })))

            await tx.surveyType.createMany({
                data: defaultSurveyTypes
            })

            // Update user's default team
            await tx.user.update({
                where: { id: user.id },
                data: { defaultTeamId: team.id }
            })

            return { team, teamMember }
        })

        return {
            success: true,
            message: t("messages.createSuccess"),
            team: result.team
        }

    } catch (error) {
        console.error("Create team error:", error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: t("messages.createFailed") }
    }
}

/**
 * Update an existing team
 */
export const updateTeamAction = async (formData: z.infer<typeof updateTeamSchema>) => {
    const t = await getTranslations("Team")

    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        const validatedData = updateTeamSchema.parse(formData)

        // Check if user is admin of the team
        const teamMember = await prisma.teamMember.findFirst({
            where: {
                teamId: validatedData.id,
                user: { email: session.user.email },
                isAdmin: true,
            }
        })

        if (!teamMember) {
            return { success: false, error: "Not authorized to update this team" }
        }

        // Update the team
        const updatedTeam = await prisma.team.update({
            where: { id: validatedData.id },
            data: {
                name: validatedData.name,
                description: validatedData.description,
            }
        })

        return {
            success: true,
            message: t("messages.updateSuccess"),
            team: updatedTeam
        }

    } catch (error) {
        console.error("Update team error:", error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: t("messages.updateFailed") }
    }
}

/**
 * Invite a new member to a team
 */
export const inviteMemberAction = async (formData: z.infer<typeof inviteMemberSchema>) => {
    const t = await getTranslations("Team")

    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        const validatedData = inviteMemberSchema.parse(formData)

        // Check if user is admin of the team
        const teamMember = await prisma.teamMember.findFirst({
            where: {
                teamId: validatedData.teamId,
                user: { email: session.user.email },
                isAdmin: true,
            },
            include: {
                team: {
                    select: {
                        name: true,
                    }
                }
            }
        })

        if (!teamMember) {
            return { success: false, error: "Not authorized to invite members to this team" }
        }

        // Check if user already exists
        let invitedUser = await prisma.user.findUnique({
            where: { email: validatedData.email }
        })

        const currentLocale = await getCurrentLocale();
        const confirmationToken = await generateConfirmationToken();
        let invitedUserPassword;
        const firstName = validatedData.email.trim().split('@')[0];

        if (!invitedUser) {

            invitedUserPassword = await generateConfirmationToken(12, 10)

            // Hash password
            const hashedPassword = await bcrypt.hash(invitedUserPassword, 12)

            // Create a placeholder user for the invitation
            invitedUser = await prisma.user.create({
                data: {
                    email: validatedData.email,
                    firstName: firstName,
                    lastName: "",
                    provider: "local",
                    language: currentLocale === 'pt-BR' ? 'pt_BR' : 'en',
                    password: hashedPassword,
                    confirmationToken: confirmationToken,
                    confirmed: false,
                    blocked: false,
                    defaultTeamId: validatedData.teamId,
                }
            })

        } else {
            // Check if user is already a member
            const existingMember = await prisma.teamMember.findFirst({
                where: {
                    teamId: validatedData.teamId,
                    userId: invitedUser.id,
                }
            })

            if (existingMember) {
                return { success: false, error: "User is already a member of this team" }
            }
        }

        // Create team member invitation
        const newMember = await prisma.teamMember.create({
            data: {
                userId: invitedUser.id,
                teamId: validatedData.teamId,
                isAdmin: validatedData.isAdmin,
                canPost: validatedData.isAdmin ? true : validatedData.canPost,
                canApprove: true, //always can read
                isOwner: false,
                teamMemberStatus: "invited",
            }
        })


        if (!invitedUserPassword) {
            //update user with confirmation token
            await prisma.user.update({
                where: { id: invitedUser.id },
                data: { confirmationToken }
            })
        }

        // Send invitation email
        const baseUrl = process.env.HOST || process.env.NEXTAUTH_URL || 'http://localhost:3000'
        const fromEmail = process.env.FROM_EMAIL || "Opineeo <contact@opineeo.com>"
        const invitationUrl = `${baseUrl}/${currentLocale}/sign-up/confirm?token=${confirmationToken}&teamId=${validatedData.teamId}`

        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: [validatedData.email],
            subject: currentLocale === 'pt-BR' ? 'Convite para se juntar à equipe' : 'Invitation to join team',
            react: await TeamInvitationEmail({
                userName: firstName,
                invitationUrl: invitationUrl,
                lang: currentLocale,
                baseUrl,
                teamName: teamMember.team.name,
                inviterName: session.user.email,
                ...(invitedUserPassword && { password: invitedUserPassword }),
            }),
        })

        return {
            success: true,
            message: t("messages.inviteSuccess"),
            member: newMember
        }

    } catch (error) {
        console.error("Invite member error:", error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: t("messages.inviteFailed") }
    }
}

/**
 * Update team member permissions
 */
export const updateMemberAction = async (formData: z.infer<typeof updateMemberSchema>) => {
    const t = await getTranslations("Team")

    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        const validatedData = updateMemberSchema.parse(formData)

        // Check if user is admin of the team
        const teamMember = await prisma.teamMember.findFirst({
            where: {
                teamId: validatedData.teamId,
                user: { email: session.user.email },
                isAdmin: true,
            }
        })

        if (!teamMember) {
            return { success: false, error: "Not authorized to update members of this team" }
        }

        // Update the team member
        const updatedMember = await prisma.teamMember.update({
            where: {
                userId_teamId: {
                    userId: validatedData.userId,
                    teamId: validatedData.teamId,
                }
            },
            data: {
                isAdmin: validatedData.isAdmin,
                canPost: validatedData.isAdmin ? true : validatedData.canPost,
                canApprove: true, //always can read
            }
        })

        return {
            success: true,
            message: t("messages.memberUpdateSuccess"),
            member: updatedMember
        }

    } catch (error) {
        console.error("Update member error:", error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: t("messages.memberUpdateFailed") }
    }
}

/**
 * Remove a member from a team
 */
export const removeMemberAction = async (formData: z.infer<typeof removeMemberSchema>) => {
    const t = await getTranslations("Team")

    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        const validatedData = removeMemberSchema.parse(formData)

        // Check if user is admin of the team
        const teamMember = await prisma.teamMember.findFirst({
            where: {
                teamId: validatedData.teamId,
                user: { email: session.user.email },
                isAdmin: true,
            }
        })

        if (!teamMember) {
            return { success: false, error: "Not authorized to remove members from this team" }
        }

        // Check if trying to remove the owner
        const memberToRemove = await prisma.teamMember.findFirst({
            where: {
                userId: validatedData.userId,
                teamId: validatedData.teamId,
                isOwner: true,
            }
        })

        if (memberToRemove) {
            return { success: false, error: "Cannot remove the team owner" }
        }

        // Remove the team member
        await prisma.teamMember.delete({
            where: {
                userId_teamId: {
                    userId: validatedData.userId,
                    teamId: validatedData.teamId,
                }
            }
        })

        //update user to remove default team
        await prisma.user.update({
            where: { id: validatedData.userId },
            data: { defaultTeamId: null }
        })

        return {
            success: true,
            message: t("messages.memberRemoveSuccess"),
        }

    } catch (error) {
        console.error("Remove member error:", error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: t("messages.memberRemoveFailed") }
    }
}

/**
 * Delete a team and all its members (only team owner can do this)
 */
export const deleteTeamAction = async (formData: z.infer<typeof deleteTeamSchema>) => {
    const t = await getTranslations("Team")

    //avoid deleting
    return { success: false, error: "Deleting teams is not allowed" };
    /*
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        const validatedData = deleteTeamSchema.parse(formData)

        // Get current user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return { success: false, error: "User not found" }
        }

        // Check if user is the owner of the team
        const teamMember = await prisma.teamMember.findFirst({
            where: {
                teamId: validatedData.teamId,
                userId: user.id,
                isOwner: true,
            }
        })

        if (!teamMember) {
            return { success: false, error: t("messages.onlyTeamOwnerCanDeleteTeam") }
        }

        // Check if this is the user's only team
        const userTeamsCount = await prisma.teamMember.count({
            where: {
                userId: teamMember.userId,
            }
        })

        if (userTeamsCount <= 1) {
            return { success: false, error: t("messages.cannotDeleteOnlyTeam") }
        }

        // Check if the deleted team is the current user's default team
        const isDefaultTeam = user.defaultTeamId === validatedData.teamId

        // Delete team and all its members in a transaction
        await prisma.$transaction(async (tx) => {
            // Delete all team members first (due to foreign key constraints)
            await tx.teamMember.deleteMany({
                where: { teamId: validatedData.teamId }
            })

            // Delete the team
            await tx.team.delete({
                where: { id: validatedData.teamId }
            })

            // If the deleted team was the default team, set the oldest remaining team as the new default
            if (isDefaultTeam) {
                // Find the oldest remaining team for the user
                const oldestTeam = await tx.teamMember.findFirst({
                    where: { userId: user.id },
                    include: { team: true },
                    orderBy: { createdAt: 'asc' }
                })

                // Update user's default team to the oldest remaining team
                if (oldestTeam) {
                    await tx.user.update({
                        where: { id: user.id },
                        data: { defaultTeamId: oldestTeam.teamId }
                    })
                } else {
                    // Fallback: set default team to null if no teams remain (shouldn't happen due to validation above)
                    await tx.user.update({
                        where: { id: user.id },
                        data: { defaultTeamId: null }
                    })
                }
            }
        })

        return {
            success: true,
            message: t("messages.deleteSuccess"),
        }

    } catch (error) {
        console.error("Delete team error:", error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: t("messages.deleteFailed") }
    }
    */
}

/**
 * Get team information with members
 */
export const getTeamAction = async (teamId: number) => {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        // Check if user is a member of the team
        const teamMember = await prisma.teamMember.findFirst({
            where: {
                teamId,
                user: { email: session.user.email },
            }
        })

        if (!teamMember) {
            return { success: false, error: "Not authorized to view this team" }
        }

        // Get team with members
        const team = await prisma.team.findUnique({
            where: { id: teamId },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                avatarUrl: true,
                            }
                        }
                    }
                }
            }
        })

        if (!team) {
            return { success: false, error: "Team not found" }
        }

        return {
            success: true,
            team
        }

    } catch (error) {
        console.error("Get team error:", error)
        return { success: false, error: "Failed to get team information" }
    }
}

/**
 * Get all teams for the current user
 */
export const getUserTeamsAction = async (onlyMyTeamsMembers: boolean = false) => {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        const teams = await prisma.team.findMany({
            where: {
                ...(onlyMyTeamsMembers && {
                    members: {
                        some: {
                            user: { email: session.user.email },
                            teamMemberStatus: "accepted"
                        }
                    }
                }),
                ...(!onlyMyTeamsMembers && {
                    members: {
                        some: {
                            user: { email: session.user.email },
                        }
                    }
                })
            },
            select: {
                id: true,
                name: true,
                description: true,
                tokenSurvery: true,
                totalSurveys: true,
                totalActiveSurveys: true,
                totalResponses: true,
                ResponseRate: true,
                members: {
                    ...(onlyMyTeamsMembers && {
                        where: {
                            teamMemberStatus: "accepted"
                        }
                    }),
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                avatarUrl: true,
                            }
                        }
                    }
                }
            }
        })

        return {
            success: true,
            teams
        }

    } catch (error) {
        console.error("Get user teams error:", error)
        return { success: false, error: "Failed to get teams" }
    }
}

/**
 * Add default survey types to existing teams that don't have any survey types
 * This can be called manually to migrate existing teams
 */
export const addDefaultSurveyTypes = async (teamId: number) => {
    try {
        // Default survey type templates
        const defaultSurveyTypes = [
            { name: "Product Feedback", isDefault: true },
            { name: "Customer Satisfaction", isDefault: false },
            { name: "Employee Engagement", isDefault: false },
            { name: "Market Research", isDefault: false },
            { name: "Event Feedback", isDefault: false },
            { name: "User Experience", isDefault: false }
        ]

        // Add default survey types to each team
        for (const surveyType of defaultSurveyTypes) {
            await prisma.surveyType.create({
                data: {
                    name: surveyType.name,
                    isDefault: surveyType.isDefault,
                    teamId: teamId
                }
            })
        }

        return {
            success: true,
            message: `Added default survey types to team ${teamId}`
        }
    } catch (error) {
        console.error("Error adding default survey types to team:", error)
        return {
            success: false,
            error: `Failed to add default survey types to team ${teamId}`
        }
    }
}

/**
 * Generate a team token for survey submissions
 */
export const generateTeamTokenAction = async (formData: z.infer<typeof generateTeamTokenSchema>) => {
    const t = await getTranslations("Team")

    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        const validatedData = generateTeamTokenSchema.parse(formData)

        // Check if user is admin of the team
        const teamMember = await prisma.teamMember.findFirst({
            where: {
                teamId: validatedData.teamId,
                user: { email: session.user.email },
                isAdmin: true,
            }
        })

        if (!teamMember) {
            return { success: false, error: "Not authorized to generate tokens for this team" }
        }

        // Validate API access for API tokens
        if (validatedData.tokenType === "api") {
            const hasApiAccess = await validateApiAccess(validatedData.teamId)

            if (!hasApiAccess) {
                return {
                    success: false,
                    error: "API access is not available in your current plan",
                    requiresUpgrade: true,
                    limitType: "apis"
                }
            }
        }

        // Generate a secure random token using bcrypt salt
        const randomString = Math.random().toString(36) + Date.now().toString(36)
        const token = await bcrypt.hash(randomString, 10)

        // Update team with the new token based on type
        const updateData = validatedData.tokenType === "api"
            ? { tokenApi: token }
            : { tokenSurvery: token }

        const updatedTeam = await prisma.team.update({
            where: { id: validatedData.teamId },
            data: updateData
        })

        return {
            success: true,
            message: t("messages.tokenGenerated"),
            token: validatedData.tokenType === "api" ? updatedTeam.tokenApi : updatedTeam.tokenSurvery
        }

    } catch (error) {
        console.error("Generate team token error:", error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: t("messages.tokenGenerationFailed") }
    }
}

/**
 * Regenerate a team token (invalidate old one and create new one)
 */
export const regenerateTeamTokenAction = async (formData: z.infer<typeof regenerateTeamTokenSchema>) => {
    const t = await getTranslations("Team")

    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        const validatedData = regenerateTeamTokenSchema.parse(formData)

        // Check if user is admin of the team
        const teamMember = await prisma.teamMember.findFirst({
            where: {
                teamId: validatedData.teamId,
                user: { email: session.user.email },
                isAdmin: true,
            }
        })

        if (!teamMember) {
            return { success: false, error: "Not authorized to regenerate tokens for this team" }
        }

        // Validate API access for API tokens
        if (validatedData.tokenType === "api") {
            const hasApiAccess = await validateApiAccess(validatedData.teamId)

            if (!hasApiAccess) {
                return {
                    success: false,
                    error: "API access is not available in your current plan",
                    requiresUpgrade: true,
                    limitType: "apis"
                }
            }
        }

        // Generate a new secure random token using bcrypt salt
        const randomString = Math.random().toString(36) + Date.now().toString(36)
        const newToken = await bcrypt.hash(randomString, 10)

        // Update team with the new token based on type (this will invalidate the old one)
        const updateData = validatedData.tokenType === "api"
            ? { tokenApi: newToken }
            : { tokenSurvery: newToken }

        const updatedTeam = await prisma.team.update({
            where: { id: validatedData.teamId },
            data: updateData
        })

        return {
            success: true,
            message: t("messages.tokenRegenerated"),
            token: validatedData.tokenType === "api" ? updatedTeam.tokenApi : updatedTeam.tokenSurvery
        }

    } catch (error) {
        console.error("Regenerate team token error:", error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: t("messages.tokenRegenerationFailed") }
    }
}

/**
 * Get team token (only if user is admin)
 */
export const getTeamTokenAction = async (teamId: number) => {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        // Check if user is admin of the team
        const teamMember = await prisma.teamMember.findFirst({
            where: {
                teamId,
                user: { email: session.user.email },
                isAdmin: true,
            }
        })

        if (!teamMember) {
            return { success: false, error: "Not authorized to view tokens for this team" }
        }

        // Get team with tokens
        const team = await prisma.team.findUnique({
            where: { id: teamId },
            select: { id: true, name: true, tokenSurvery: true, tokenApi: true }
        })

        if (!team) {
            return { success: false, error: "Team not found" }
        }

        return {
            success: true,
            team: {
                id: team.id,
                name: team.name,
                tokenSurvery: team.tokenSurvery,
                tokenApi: team.tokenApi
            }
        }

    } catch (error) {
        console.error("Get team token error:", error)
        return { success: false, error: "Failed to get team token" }
    }
}

export const getUserTeamsLightAction = async (userId: number) => {
    try {
        // Fetch only essential team data for navigation
        const teams = await prisma.team.findMany({
            where: {
                members: {
                    some: {
                        userId: userId,
                        teamMemberStatus: "accepted"
                    }
                }
            },
            select: {
                id: true,
                name: true,
                members: {
                    where: {
                        userId: userId,
                        teamMemberStatus: "accepted"
                    },
                    select: {
                        id: true,
                        isAdmin: true,
                        canPost: true,
                        canApprove: true,
                        isOwner: true,
                    }
                }
            }
        })

        return { success: true, teams }
    } catch (error) {
        console.error("Get user teams light error:", error)
        return { success: false, error: "Failed to get teams" }
    }
}

export const getTeamById = async (teamId: number) => {
    try {

        if (!teamId) {
            return { success: false, error: "Team id is required" }
        }

        const team = await prisma.team.findUnique({
            where: { id: teamId },
            select: {
                id: true,
                name: true,
                totalSurveys: true,
                totalActiveSurveys: true,
                totalResponses: true,
                ResponseRate: true,
            }
        })

        if (!team) {
            return { success: false, error: "Team not found" }
        }

        return { success: true, team }

    } catch (error) {
        console.error("Get team by id error:", error)
        return { success: false, error: "Failed to get team" }
    }
}

/**
 * Update team branding setting
 */
export const updateTeamBrandingAction = async (formData: z.infer<typeof updateTeamBrandingSchema>) => {
    const t = await getTranslations("Settings.branding")

    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        const validatedData = updateTeamBrandingSchema.parse(formData)

        // Check if user is admin of the team
        const teamMember = await prisma.teamMember.findFirst({
            where: {
                teamId: validatedData.teamId,
                user: { email: session.user.email },
                isAdmin: true,
            }
        })

        if (!teamMember) {
            return { success: false, error: "Not authorized to update branding for this team" }
        }

        // If trying to disable branding (branding = false), validate subscription
        if (!validatedData.branding) {
            const canRemoveBranding = await validateRemoveBranding(validatedData.teamId)

            if (!canRemoveBranding) {
                return {
                    success: false,
                    error: t("upgradeRequired"),
                    requiresUpgrade: true,
                    limitType: "remove_branding"
                }
            }
        }

        // Update team branding setting
        const updatedTeam = await prisma.team.update({
            where: { id: validatedData.teamId },
            data: { branding: validatedData.branding }
        })

        return {
            success: true,
            message: validatedData.branding ? t("brandingEnabled") : t("brandingDisabled"),
            branding: updatedTeam.branding
        }

    } catch (error) {
        console.error("Update team branding error:", error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: t("updateFailed") }
    }
}

/**
 * Get team branding setting
 */
export const getTeamBrandingAction = async (teamId: number) => {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        // Check if user is a member of the team
        const teamMember = await prisma.teamMember.findFirst({
            where: {
                teamId,
                user: { email: session.user.email },
            }
        })

        if (!teamMember) {
            return { success: false, error: "Not authorized to view this team" }
        }

        // Get team branding setting
        const team = await prisma.team.findUnique({
            where: { id: teamId },
            select: { branding: true }
        })

        if (!team) {
            return { success: false, error: "Team not found" }
        }

        return {
            success: true,
            branding: team.branding
        }

    } catch (error) {
        console.error("Get team branding error:", error)
        return { success: false, error: "Failed to get team branding" }
    }
}