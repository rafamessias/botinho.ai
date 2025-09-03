"use server"

import { auth } from "@/app/auth"
import { prisma } from "@/prisma/lib/prisma"
import { z } from "zod"
import { getTranslations } from "next-intl/server"
import { TeamMemberStatus } from "@/lib/generated/prisma"
import { generateConfirmationToken, getCurrentLocale } from "./auth"
import bcrypt from "bcryptjs"
import resend from "@/lib/resend"
import TeamInvitationEmail from "@/emails/TeamInvitationEmail"

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

        if (!invitedUser) {


            const invitedUserPassword = await generateConfirmationToken(12, 10)

            // Hash password
            const hashedPassword = await bcrypt.hash(invitedUserPassword, 12)

            // Generate confirmation token
            const confirmationToken = await generateConfirmationToken()

            // Get current locale
            const currentLocale = await getCurrentLocale()

            // Split name into first and last name
            const firstName = validatedData.email.trim().split('@')[0]


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
                }
            })

            // Send invitation email
            const baseUrl = process.env.HOST || process.env.NEXTAUTH_URL || 'http://localhost:3000'
            const fromEmail = process.env.FROM_EMAIL || "SaaS Framework <noreply@example.com>"
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
                    password: invitedUserPassword,
                }),
            })

        }

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

        // Create team member invitation
        const newMember = await prisma.teamMember.create({
            data: {
                userId: invitedUser.id,
                teamId: validatedData.teamId,
                isAdmin: validatedData.isAdmin,
                canPost: validatedData.canPost,
                canApprove: validatedData.canApprove,
                isOwner: false,
                teamMemberStatus: "invited",
            }
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
                canPost: validatedData.canPost,
                canApprove: validatedData.canApprove,
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
export const getUserTeamsAction = async () => {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        const teams = await prisma.team.findMany({
            where: {
                members: {
                    some: {
                        user: { email: session.user.email }
                    }
                }
            },
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

        return {
            success: true,
            teams
        }

    } catch (error) {
        console.error("Get user teams error:", error)
        return { success: false, error: "Failed to get teams" }
    }
}
