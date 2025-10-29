"use server"

import { auth } from "@/app/auth"
import { prisma } from "@/prisma/lib/prisma"
import { z } from "zod"
import { getTranslations } from "next-intl/server"
import { generateConfirmationToken, getCurrentLocale } from "./auth"
// Using Web Crypto API instead of Node.js crypto module
import bcrypt from "bcryptjs"
import resend from "@/lib/resend"
import CompanyInvitationEmail from "@/emails/CompanyInvitationEmail"
import { validateApiAccess } from "@/lib/services/subscription-validation"

// Validation schemas
const createCompanySchema = z.object({
    name: z.string().min(2, "Company name must be at least 2 characters"),
    description: z.string().optional(),
})

const updateCompanySchema = z.object({
    id: z.number(),
    name: z.string().min(2, "Company name must be at least 2 characters"),
    description: z.string().optional(),
})

const inviteMemberSchema = z.object({
    companyId: z.number(),
    email: z.string().email("Invalid email address"),
    isAdmin: z.boolean().default(false),
    canPost: z.boolean().default(true),
    canApprove: z.boolean().default(false),
})

const updateMemberSchema = z.object({
    companyId: z.number(),
    userId: z.number(),
    isAdmin: z.boolean(),
    canPost: z.boolean(),
    canApprove: z.boolean(),
})

const removeMemberSchema = z.object({
    companyId: z.number(),
    userId: z.number(),
})

const deleteCompanySchema = z.object({
    companyId: z.number(),
})

const generateCompanyTokenSchema = z.object({
    companyId: z.number(),
    tokenType: z.enum(["survey", "api"]).default("survey"),
})

const regenerateCompanyTokenSchema = z.object({
    companyId: z.number(),
    tokenType: z.enum(["survey", "api"]).default("survey"),
})

const updateCompanyBrandingSchema = z.object({
    companyId: z.number(),
    branding: z.boolean(),
})

const bulkInviteMembersSchema = z.object({
    companyId: z.number(),
    members: z.array(z.object({
        email: z.string().email("Invalid email address"),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        isAdmin: z.union([z.boolean(), z.string()]).optional(),
        canPost: z.union([z.boolean(), z.string()]).optional(),
        canApprove: z.union([z.boolean(), z.string()]).optional(),
    })),
})

/**
 * Create a new company and make the current user the owner
 */
export const createCompanyAction = async (formData: z.infer<typeof createCompanySchema>) => {
    const t = await getTranslations("Company")

    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        const validatedData = createCompanySchema.parse(formData)

        // Get current user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return { success: false, error: "User not found" }
        }

        // Create company and company member in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create the company
            const company = await tx.company.create({
                data: {
                    name: validatedData.name,
                    description: validatedData.description,
                }
            })

            // Create company member (owner)
            const companyMember = await tx.companyMember.create({
                data: {
                    userId: user.id,
                    companyId: company.id,
                    isAdmin: true,
                    canPost: true,
                    canApprove: true,
                    isOwner: true,
                    companyMemberStatus: "accepted",
                }
            })

            // Update user's default company
            await tx.user.update({
                where: { id: user.id },
                data: { defaultCompanyId: company.id }
            })

            return { company, companyMember }
        })

        return {
            success: true,
            message: t("messages.createSuccess"),
            company: result.company
        }

    } catch (error) {
        console.error("Create company error:", error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: t("messages.createFailed") }
    }
}

/**
 * Update an existing company
 */
export const updateCompanyAction = async (formData: z.infer<typeof updateCompanySchema>) => {
    const t = await getTranslations("Company")

    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        const validatedData = updateCompanySchema.parse(formData)

        // Check if user is admin of the company
        const companyMember = await prisma.companyMember.findFirst({
            where: {
                companyId: validatedData.id,
                user: { email: session.user.email },
                isAdmin: true,
            }
        })

        if (!companyMember) {
            return { success: false, error: "Not authorized to update this company" }
        }

        // Update the company
        const updatedCompany = await prisma.company.update({
            where: { id: validatedData.id },
            data: {
                name: validatedData.name,
                description: validatedData.description,
            }
        })

        return {
            success: true,
            message: t("messages.updateSuccess"),
            company: updatedCompany
        }

    } catch (error) {
        console.error("Update company error:", error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: t("messages.updateFailed") }
    }
}

/**
 * Invite a new member to a company
 */
export const inviteMemberAction = async (formData: z.infer<typeof inviteMemberSchema>) => {
    const t = await getTranslations("Company")

    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        const validatedData = inviteMemberSchema.parse(formData)

        // Check if user is admin of the company
        const companyMember = await prisma.companyMember.findFirst({
            where: {
                companyId: validatedData.companyId,
                user: { email: session.user.email },
                isAdmin: true,
            },
            include: {
                company: {
                    select: {
                        name: true,
                    }
                }
            }
        })

        if (!companyMember) {
            return { success: false, error: "Not authorized to invite members to this company" }
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
                    defaultCompanyId: validatedData.companyId,
                }
            })

        } else {
            // Check if user is already a member
            const existingMember = await prisma.companyMember.findFirst({
                where: {
                    companyId: validatedData.companyId,
                    userId: invitedUser.id,
                }
            })

            if (existingMember) {
                return { success: false, error: "User is already a member of this company" }
            }
        }

        // Create company member invitation
        const newMember = await prisma.companyMember.create({
            data: {
                userId: invitedUser.id,
                companyId: validatedData.companyId,
                isAdmin: validatedData.isAdmin,
                canPost: validatedData.isAdmin ? true : validatedData.canPost,
                canApprove: true, //always can read
                isOwner: false,
                companyMemberStatus: "invited",
            },
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
        const invitationUrl = `${baseUrl}/${currentLocale}/sign-up/confirm?token=${confirmationToken}&companyId=${validatedData.companyId}`

        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: [validatedData.email],
            subject: currentLocale === 'pt-BR' ? 'Convite para se juntar à equipe' : 'Invitation to join company',
            react: await CompanyInvitationEmail({
                userName: firstName,
                invitationUrl: invitationUrl,
                lang: currentLocale,
                baseUrl,
                companyName: companyMember.company.name,
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
 * Update company member permissions
 */
export const updateMemberAction = async (formData: z.infer<typeof updateMemberSchema>) => {
    const t = await getTranslations("Company")

    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        const validatedData = updateMemberSchema.parse(formData)

        // Check if user is admin of the company
        const companyMember = await prisma.companyMember.findFirst({
            where: {
                companyId: validatedData.companyId,
                user: { email: session.user.email },
                isAdmin: true,
            }
        })

        if (!companyMember) {
            return { success: false, error: "Not authorized to update members of this company" }
        }

        // Update the company member
        const updatedMember = await prisma.companyMember.update({
            where: {
                userId_companyId: {
                    userId: validatedData.userId,
                    companyId: validatedData.companyId,
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
 * Bulk invite multiple members to a company from Excel import
 */
export const bulkInviteMembersAction = async (formData: z.infer<typeof bulkInviteMembersSchema>) => {
    const t = await getTranslations("Company")

    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        const validatedData = bulkInviteMembersSchema.parse(formData)

        // Check if user is admin of the company
        const companyMember = await prisma.companyMember.findFirst({
            where: {
                companyId: validatedData.companyId,
                user: { email: session.user.email },
                isAdmin: true,
            },
            include: {
                company: {
                    select: {
                        name: true,
                    }
                }
            }
        })

        if (!companyMember) {
            return { success: false, error: "Not authorized to invite members to this company" }
        }

        const currentLocale = await getCurrentLocale();
        const results = {
            success: true,
            successCount: 0,
            errorCount: 0,
            errors: [] as string[],
        }

        // Process each member
        for (const memberData of validatedData.members) {
            try {
                // Normalize boolean values
                const normalizeBool = (val: any): boolean => {
                    if (typeof val === "boolean") return val
                    if (typeof val === "string") {
                        const lower = val.toLowerCase().trim()
                        return lower === "true" || lower === "yes" || lower === "1" || lower === "y"
                    }
                    return false
                }

                const isAdmin = normalizeBool(memberData.isAdmin || false)
                const canPost = normalizeBool(memberData.canPost !== undefined ? memberData.canPost : true)
                const canApprove = normalizeBool(memberData.canApprove || false)

                // Check if user already exists
                let invitedUser = await prisma.user.findUnique({
                    where: { email: memberData.email }
                })

                let invitedUserPassword: string | undefined
                const firstName = memberData.firstName || memberData.email.trim().split('@')[0]

                if (!invitedUser) {
                    const confirmationToken = await generateConfirmationToken()
                    invitedUserPassword = await generateConfirmationToken(12, 10)

                    // Hash password
                    const hashedPassword = await bcrypt.hash(invitedUserPassword, 12)

                    // Create a placeholder user for the invitation
                    invitedUser = await prisma.user.create({
                        data: {
                            email: memberData.email,
                            firstName: firstName,
                            lastName: memberData.lastName || "",
                            provider: "local",
                            language: currentLocale === 'pt-BR' ? 'pt_BR' : 'en',
                            password: hashedPassword,
                            confirmationToken: confirmationToken,
                            confirmed: false,
                            blocked: false,
                            defaultCompanyId: validatedData.companyId,
                        }
                    })
                } else {
                    // Check if user is already a member
                    const existingMember = await prisma.companyMember.findFirst({
                        where: {
                            companyId: validatedData.companyId,
                            userId: invitedUser.id,
                        }
                    })

                    if (existingMember) {
                        results.errorCount++
                        results.errors.push(`${memberData.email}: Already a member of this company`)
                        continue
                    }

                    // Update user with confirmation token if needed
                    const confirmationToken = await generateConfirmationToken()
                    await prisma.user.update({
                        where: { id: invitedUser.id },
                        data: { confirmationToken }
                    })
                }

                // Create company member invitation
                await prisma.companyMember.create({
                    data: {
                        userId: invitedUser.id,
                        companyId: validatedData.companyId,
                        isAdmin: isAdmin,
                        canPost: isAdmin ? true : canPost,
                        canApprove: true, // always can read
                        isOwner: false,
                        companyMemberStatus: "invited",
                    }
                })

                // Send invitation email
                const baseUrl = process.env.HOST || process.env.NEXTAUTH_URL || 'http://localhost:3000'
                const fromEmail = process.env.FROM_EMAIL || "Opineeo <contact@opineeo.com>"
                const confirmationToken = invitedUser.confirmationToken!
                const invitationUrl = `${baseUrl}/${currentLocale}/sign-up/confirm?token=${confirmationToken}&companyId=${validatedData.companyId}`

                await resend.emails.send({
                    from: fromEmail,
                    to: [memberData.email],
                    subject: currentLocale === 'pt-BR' ? 'Convite para se juntar à equipe' : 'Invitation to join company',
                    react: await CompanyInvitationEmail({
                        userName: firstName,
                        invitationUrl: invitationUrl,
                        lang: currentLocale,
                        baseUrl,
                        companyName: companyMember.company.name,
                        inviterName: session.user.email,
                        ...(invitedUserPassword && { password: invitedUserPassword }),
                    }),
                })

                results.successCount++
            } catch (error: any) {
                results.errorCount++
                const errorMessage = error?.message || "Unknown error"
                results.errors.push(`${memberData.email}: ${errorMessage}`)
                console.error(`Error inviting ${memberData.email}:`, error)
            }
        }

        if (results.errorCount > 0 && results.successCount === 0) {
            return {
                success: false,
                error: t("messages.bulkInviteFailed"),
                ...results
            }
        }

        return {
            success: true,
            message: t("messages.bulkInviteSuccess", { count: results.successCount }),
            ...results
        }

    } catch (error) {
        console.error("Bulk invite members error:", error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: t("messages.bulkInviteFailed") }
    }
}

/**
 * Remove a member from a company
 */
export const removeMemberAction = async (formData: z.infer<typeof removeMemberSchema>) => {
    const t = await getTranslations("Company")

    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        const validatedData = removeMemberSchema.parse(formData)

        // Check if user is admin of the company
        const companyMember = await prisma.companyMember.findFirst({
            where: {
                companyId: validatedData.companyId,
                user: { email: session.user.email },
                isAdmin: true,
            }
        })

        if (!companyMember) {
            return { success: false, error: "Not authorized to remove members from this company" }
        }

        // Check if trying to remove the owner
        const memberToRemove = await prisma.companyMember.findFirst({
            where: {
                userId: validatedData.userId,
                companyId: validatedData.companyId,
                isOwner: true,
            }
        })

        if (memberToRemove) {
            return { success: false, error: "Cannot remove the company owner" }
        }

        // Remove the company member
        await prisma.companyMember.delete({
            where: {
                userId_companyId: {
                    userId: validatedData.userId,
                    companyId: validatedData.companyId,
                }
            }
        })

        //update user to remove default company
        await prisma.user.update({
            where: { id: validatedData.userId },
            data: { defaultCompanyId: null }
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
 * Delete a company and all its members (only company owner can do this)
 */
export const deleteCompanyAction = async (formData: z.infer<typeof deleteCompanySchema>) => {
    const t = await getTranslations("Company")

    //avoid deleting
    return { success: false, error: "Deleting companies is not allowed" };
    /*
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        const validatedData = deleteCompanySchema.parse(formData)

        // Get current user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return { success: false, error: "User not found" }
        }

        // Check if user is the owner of the company
        const companyMember = await prisma.companyMember.findFirst({
            where: {
                companyId: validatedData.companyId,
                userId: user.id,
                isOwner: true,
            }
        })

        if (!companyMember) {
            return { success: false, error: t("messages.onlyCompanyOwnerCanDeleteCompany") }
        }

        // Check if this is the user's only company
        const userCompaniesCount = await prisma.companyMember.count({
            where: {
                userId: companyMember.userId,
            }
        })

        if (userCompaniesCount <= 1) {
            return { success: false, error: t("messages.cannotDeleteOnlyCompany") }
        }

        // Check if the deleted company is the current user's default company
        const isDefaultCompany = user.defaultCompanyId === validatedData.companyId

        // Delete company and all its members in a transaction
        await prisma.$transaction(async (tx) => {
            // Delete all company members first (due to foreign key constraints)
            await tx.companyMember.deleteMany({
                where: { companyId: validatedData.companyId }
            })

            // Delete the company
            await tx.company.delete({
                where: { id: validatedData.companyId }
            })

            // If the deleted company was the default company, set the oldest remaining company as the new default
            if (isDefaultCompany) {
                // Find the oldest remaining company for the user
                const oldestCompany = await tx.companyMember.findFirst({
                    where: { userId: user.id },
                    include: { company: true },
                    orderBy: { createdAt: 'asc' }
                })

                // Update user's default company to the oldest remaining company
                if (oldestCompany) {
                    await tx.user.update({
                        where: { id: user.id },
                        data: { defaultCompanyId: oldestCompany.companyId }
                    })
                } else {
                    // Fallback: set default company to null if no companies remain (shouldn't happen due to validation above)
                    await tx.user.update({
                        where: { id: user.id },
                        data: { defaultCompanyId: null }
                    })
                }
            }
        })

        return {
            success: true,
            message: t("messages.deleteSuccess"),
        }

    } catch (error) {
        console.error("Delete company error:", error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: t("messages.deleteFailed") }
    }
    */
}

/**
 * Get company information with members
 */
export const getCompanyAction = async (companyId: number) => {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        // Check if user is a member of the company
        const companyMember = await prisma.companyMember.findFirst({
            where: {
                companyId,
                user: { email: session.user.email },
            }
        })

        if (!companyMember) {
            return { success: false, error: "Not authorized to view this company" }
        }

        // Get company with members
        const company = await prisma.company.findUnique({
            where: { id: companyId },
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

        if (!company) {
            return { success: false, error: "Company not found" }
        }

        return {
            success: true,
            company
        }

    } catch (error) {
        console.error("Get company error:", error)
        return { success: false, error: "Failed to get company information" }
    }
}

/**
 * Get all companies for the current user
 */
export const getUserCompaniesAction = async (onlyMyCompaniesMembers: boolean = false) => {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        const companies = await prisma.company.findMany({
            where: {
                ...(onlyMyCompaniesMembers && {
                    members: {
                        some: {
                            user: { email: session.user.email },
                            companyMemberStatus: "accepted"
                        }
                    }
                }),
                ...(!onlyMyCompaniesMembers && {
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
                tokenApi: true,
                members: {
                    ...(onlyMyCompaniesMembers && {
                        where: {
                            companyMemberStatus: "accepted"
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
            companies
        }

    } catch (error) {
        console.error("Get user companies error:", error)
        return { success: false, error: "Failed to get companies" }
    }
}

/**
 * Generate a company token for survey submissions
 */
export const generateCompanyTokenAction = async (formData: z.infer<typeof generateCompanyTokenSchema>) => {
    const t = await getTranslations("Company")

    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        const validatedData = generateCompanyTokenSchema.parse(formData)

        // Check if user is admin of the company
        const companyMember = await prisma.companyMember.findFirst({
            where: {
                companyId: validatedData.companyId,
                user: { email: session.user.email },
                isAdmin: true,
            }
        })

        if (!companyMember) {
            return { success: false, error: "Not authorized to generate tokens for this company" }
        }

        // Validate API access for API tokens
        if (validatedData.tokenType === "api") {
            const hasApiAccess = await validateApiAccess(validatedData.companyId)

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

        // Update company with the new token based on type
        const updateData = validatedData.tokenType === "api"
            ? { tokenApi: token }
            : {}
        const updatedCompany = await prisma.company.update({
            where: { id: validatedData.companyId },
            data: updateData
        })

        return {
            success: true,
            message: t("messages.tokenGenerated"),
            token: updatedCompany.tokenApi
        }

    } catch (error) {
        console.error("Generate company token error:", error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: t("messages.tokenGenerationFailed") }
    }
}

/**
 * Regenerate a company token (invalidate old one and create new one)
 */
export const regenerateCompanyTokenAction = async (formData: z.infer<typeof regenerateCompanyTokenSchema>) => {
    const t = await getTranslations("Company")

    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        const validatedData = regenerateCompanyTokenSchema.parse(formData)

        // Check if user is admin of the company
        const companyMember = await prisma.companyMember.findFirst({
            where: {
                companyId: validatedData.companyId,
                user: { email: session.user.email },
                isAdmin: true,
            }
        })

        if (!companyMember) {
            return { success: false, error: "Not authorized to regenerate tokens for this company" }
        }

        // Validate API access for API tokens
        if (validatedData.tokenType === "api") {
            const hasApiAccess = await validateApiAccess(validatedData.companyId)

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

        // Update company with the new token based on type (this will invalidate the old one)
        const updateData = validatedData.tokenType === "api"
            ? { tokenApi: newToken }
            : {}

        const updatedCompany = await prisma.company.update({
            where: { id: validatedData.companyId },
            data: updateData
        })

        return {
            success: true,
            message: t("messages.tokenRegenerated"),
            token: updatedCompany.tokenApi
        }

    } catch (error) {
        console.error("Regenerate company token error:", error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: t("messages.tokenRegenerationFailed") }
    }
}

/**
 * Get company token (only if user is admin)
 */
export const getCompanyTokenAction = async (companyId: number) => {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        // Check if user is admin of the company
        const companyMember = await prisma.companyMember.findFirst({
            where: {
                companyId,
                user: { email: session.user.email },
                isAdmin: true,
            }
        })

        if (!companyMember) {
            return { success: false, error: "Not authorized to view tokens for this company" }
        }

        // Get company with tokens
        const company = await prisma.company.findUnique({
            where: { id: companyId },
            select: { id: true, name: true, tokenApi: true }
        })

        if (!company) {
            return { success: false, error: "Company not found" }
        }

        return {
            success: true,
            company: {
                id: company.id,
                name: company.name,
                tokenApi: company.tokenApi
            }
        }

    } catch (error) {
        console.error("Get company token error:", error)
        return { success: false, error: "Failed to get company token" }
    }
}

export const getUserCompaniesLightAction = async (userId: number, defaultCompanyId: number) => {
    try {
        // Fetch only essential company data for navigation
        const companies = await prisma.company.findMany({
            where: {
                members: {
                    some: {
                        userId: userId,
                        companyMemberStatus: "accepted"
                    }
                }
            },
            select: {
                id: true,
                name: true,
                members: {
                    where: {
                        userId: userId,
                        companyMemberStatus: "accepted"
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

        let customerSubscription = null
        if (defaultCompanyId) {
            customerSubscription = await prisma.customerSubscription.findFirst({
                where: { companyId: defaultCompanyId },
                select: {
                    id: true,
                    status: true,
                    billingInterval: true,
                    plan: { select: { planType: true } }
                }
            })
        }

        return { success: true, companies, customerSubscription }
    } catch (error) {
        console.error("Get user companies light error:", error)
        return { success: false, error: "Failed to get companies" }
    }
}

export const getCompanyById = async (companyId: number) => {
    try {

        if (!companyId) {
            return { success: false, error: "Company id is required" }
        }

        const company = await prisma.company.findUnique({
            where: { id: companyId },
            select: {
                id: true,
                name: true,
                tokenApi: true
            }
        })

        if (!company) {
            return { success: false, error: "Company not found" }
        }

        return { success: true, company }

    } catch (error) {
        console.error("Get company by id error:", error)
        return { success: false, error: "Failed to get company" }
    }
}

