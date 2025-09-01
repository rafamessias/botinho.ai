"use server"

import { prisma } from "@/prisma/lib/prisma"
import { auth } from "@/app/auth"
import { z } from "zod"
import { CompanyMemberStatus, DocumentType } from "@/lib/generated/prisma"
import resend from "@/lib/resend"
import CompanyInvitationEmail from "@/emails/CompanyInvitationEmail"
import { cookies } from "next/headers"

// Types for form data
export interface CompanyFormData {
    name: string
    documentType?: DocumentType
    document?: string
    zipCode?: string
    state?: string
    city?: string
    address?: string
}

export interface CompanyMemberFormData {
    email: string
    isAdmin: boolean
    canPost: boolean
    canApprove: boolean
}

// Validation schemas
const companySchema = z.object({
    name: z.string().min(2, "Company name must be at least 2 characters"),
    documentType: z.nativeEnum(DocumentType).optional(),
    document: z.string().optional(),
    zipCode: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    address: z.string().optional(),
})

const companyMemberSchema = z.object({
    email: z.string().email("Invalid email address"),
    isAdmin: z.boolean().default(false),
    canPost: z.boolean().default(false),
    canApprove: z.boolean().default(false),
})

// Helper function to get current locale
const getCurrentLocale = async (): Promise<string> => {
    const cookieStore = await cookies()
    return cookieStore.get('NEXT_LOCALE')?.value || 'en'
}

/**
 * Server action to create a new company
 */
export const createCompanyAction = async (formData: CompanyFormData) => {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        // Get current user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return { success: false, error: "User not found" }
        }

        // Validate form data
        const validatedData = companySchema.parse(formData)

        // Create company
        const company = await prisma.company.create({
            data: {
                name: validatedData.name,
                documentType: validatedData.documentType,
                document: validatedData.document,
                zipCode: validatedData.zipCode,
                state: validatedData.state,
                city: validatedData.city,
                address: validatedData.address,
                members: {
                    create: {
                        userId: user.id,
                        isAdmin: true,
                        canPost: true,
                        canApprove: true,
                        isOwner: true,
                        companyMemberStatus: CompanyMemberStatus.accepted,
                    }
                }
            },
            include: {
                members: {
                    include: {
                        user: true
                    }
                }
            }
        })

        return { success: true, company, message: "Company created successfully" }

    } catch (error) {
        console.error("Create company error:", error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: "Failed to create company" }
    }
}

/**
 * Server action to update an existing company
 */
export const updateCompanyAction = async (companyId: number, formData: CompanyFormData) => {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        // Get current user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return { success: false, error: "User not found" }
        }

        // Check if user is a member of the company with admin privileges
        const membership = await prisma.companyMember.findFirst({
            where: {
                userId: user.id,
                companyId: companyId,
                companyMemberStatus: CompanyMemberStatus.accepted,
                OR: [
                    { isAdmin: true },
                    { isOwner: true }
                ]
            }
        })

        if (!membership) {
            return { success: false, error: "You don't have permission to update this company" }
        }

        // Validate form data
        const validatedData = companySchema.parse(formData)

        // Update company
        const company = await prisma.company.update({
            where: { id: companyId },
            data: {
                name: validatedData.name,
                documentType: validatedData.documentType,
                document: validatedData.document,
                zipCode: validatedData.zipCode,
                state: validatedData.state,
                city: validatedData.city,
                address: validatedData.address,
            },
            include: {
                members: {
                    include: {
                        user: true
                    }
                }
            }
        })

        return { success: true, company, message: "Company updated successfully" }

    } catch (error) {
        console.error("Update company error:", error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: "Failed to update company" }
    }
}

/**
 * Server action to get company details
 */
export const getCompanyAction = async (companyId: number) => {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        // Get current user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return { success: false, error: "User not found" }
        }

        // Check if user is a member of the company
        const membership = await prisma.companyMember.findFirst({
            where: {
                userId: user.id,
                companyId: companyId,
                companyMemberStatus: CompanyMemberStatus.accepted,
            }
        })

        if (!membership) {
            return { success: false, error: "You don't have permission to view this company" }
        }

        // Get company details
        const company = await prisma.company.findUnique({
            where: { id: companyId },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true,
                                avatarUrl: true,
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }
        })

        if (!company) {
            return { success: false, error: "Company not found" }
        }

        return { success: true, company, userMembership: membership }

    } catch (error) {
        console.error("Get company error:", error)
        return { success: false, error: "Failed to get company details" }
    }
}

/**
 * Server action to get user's companies
 */
export const getUserCompaniesAction = async () => {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        // Get current user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return { success: false, error: "User not found" }
        }

        // Get user's companies
        const companies = await prisma.company.findMany({
            where: {
                members: {
                    some: {
                        userId: user.id,
                        companyMemberStatus: CompanyMemberStatus.accepted,
                    }
                }
            },
            include: {
                members: {
                    where: {
                        userId: user.id
                    },
                    select: {
                        isAdmin: true,
                        canPost: true,
                        canApprove: true,
                        isOwner: true,
                        companyMemberStatus: true,
                    }
                },
                _count: {
                    select: {
                        members: {
                            where: {
                                companyMemberStatus: CompanyMemberStatus.accepted
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return { success: true, companies }

    } catch (error) {
        console.error("Get user companies error:", error)
        return { success: false, error: "Failed to get companies" }
    }
}

/**
 * Server action to invite a user to a company
 */
export const inviteCompanyMemberAction = async (companyId: number, formData: CompanyMemberFormData) => {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        // Get current user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return { success: false, error: "User not found" }
        }

        // Check if user is a member of the company with admin privileges
        const membership = await prisma.companyMember.findFirst({
            where: {
                userId: user.id,
                companyId: companyId,
                companyMemberStatus: CompanyMemberStatus.accepted,
                OR: [
                    { isAdmin: true },
                    { isOwner: true }
                ]
            }
        })

        if (!membership) {
            return { success: false, error: "You don't have permission to invite members to this company" }
        }

        // Validate form data
        const validatedData = companyMemberSchema.parse(formData)

        // Check if user exists
        const invitedUser = await prisma.user.findUnique({
            where: { email: validatedData.email }
        })

        if (!invitedUser) {
            return { success: false, error: "User with this email does not exist" }
        }

        // Check if user is already a member
        const existingMembership = await prisma.companyMember.findFirst({
            where: {
                userId: invitedUser.id,
                companyId: companyId,
            }
        })

        if (existingMembership) {
            if (existingMembership.companyMemberStatus === CompanyMemberStatus.accepted) {
                return { success: false, error: "User is already a member of this company" }
            } else if (existingMembership.companyMemberStatus === CompanyMemberStatus.invited) {
                return { success: false, error: "User has already been invited to this company" }
            }
        }

        // Get company details
        const company = await prisma.company.findUnique({
            where: { id: companyId }
        })

        if (!company) {
            return { success: false, error: "Company not found" }
        }

        // Create membership invitation
        const membershipInvitation = await prisma.companyMember.create({
            data: {
                userId: invitedUser.id,
                companyId: companyId,
                isAdmin: validatedData.isAdmin,
                canPost: validatedData.canPost,
                canApprove: validatedData.canApprove,
                isOwner: false,
                companyMemberStatus: CompanyMemberStatus.invited,
            }
        })

        // Send invitation email
        const currentLocale = await getCurrentLocale()
        const baseUrl = process.env.HOST || process.env.NEXTAUTH_URL || 'http://localhost:3000'
        const fromEmail = process.env.FROM_EMAIL || "SaaS Framework <noreply@example.com>"
        const invitationUrl = `${baseUrl}/${currentLocale}/company/${companyId}/invitation?token=${membershipInvitation.id}`

        try {
            const emailComponent = await CompanyInvitationEmail({
                userName: invitedUser.firstName,
                companyName: company.name,
                invitedBy: `${user.firstName} ${user.lastName || ''}`.trim(),
                invitationLink: invitationUrl,
                lang: currentLocale,
                baseUrl
            })

            await resend.emails.send({
                from: fromEmail,
                to: [validatedData.email],
                subject: currentLocale === 'pt-BR' ?
                    `Convite para se juntar à ${company.name}` :
                    `Invitation to join ${company.name}`,
                react: emailComponent,
            })
        } catch (emailError) {
            console.error("Failed to send invitation email:", emailError)
            // Don't fail the invitation if email fails
        }

        return { success: true, message: "Invitation sent successfully" }

    } catch (error) {
        console.error("Invite company member error:", error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: "Failed to invite member" }
    }
}

/**
 * Server action to accept company invitation
 */
export const acceptCompanyInvitationAction = async (membershipId: number) => {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        // Get current user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return { success: false, error: "User not found" }
        }

        // Find the membership invitation
        const membership = await prisma.companyMember.findFirst({
            where: {
                id: membershipId,
                userId: user.id,
                companyMemberStatus: CompanyMemberStatus.invited,
            },
            include: {
                company: true
            }
        })

        if (!membership) {
            return { success: false, error: "Invitation not found or already processed" }
        }

        // Accept the invitation
        await prisma.companyMember.update({
            where: { id: membershipId },
            data: {
                companyMemberStatus: CompanyMemberStatus.accepted,
            }
        })

        return { success: true, company: membership.company, message: "Invitation accepted successfully" }

    } catch (error) {
        console.error("Accept company invitation error:", error)
        return { success: false, error: "Failed to accept invitation" }
    }
}

/**
 * Server action to reject company invitation
 */
export const rejectCompanyInvitationAction = async (membershipId: number) => {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        // Get current user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return { success: false, error: "User not found" }
        }

        // Find the membership invitation
        const membership = await prisma.companyMember.findFirst({
            where: {
                id: membershipId,
                userId: user.id,
                companyMemberStatus: CompanyMemberStatus.invited,
            }
        })

        if (!membership) {
            return { success: false, error: "Invitation not found or already processed" }
        }

        // Reject the invitation
        await prisma.companyMember.update({
            where: { id: membershipId },
            data: {
                companyMemberStatus: CompanyMemberStatus.rejected,
            }
        })

        return { success: true, message: "Invitation rejected" }

    } catch (error) {
        console.error("Reject company invitation error:", error)
        return { success: false, error: "Failed to reject invitation" }
    }
}

/**
 * Server action to remove a company member
 */
export const removeCompanyMemberAction = async (companyId: number, memberId: number) => {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        // Get current user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return { success: false, error: "User not found" }
        }

        // Check if user is a member of the company with admin privileges
        const membership = await prisma.companyMember.findFirst({
            where: {
                userId: user.id,
                companyId: companyId,
                companyMemberStatus: CompanyMemberStatus.accepted,
                OR: [
                    { isAdmin: true },
                    { isOwner: true }
                ]
            }
        })

        if (!membership) {
            return { success: false, error: "You don't have permission to remove members from this company" }
        }

        // Check if the member being removed is the owner
        const memberToRemove = await prisma.companyMember.findUnique({
            where: { id: memberId },
            include: { user: true }
        })

        if (!memberToRemove || memberToRemove.companyId !== companyId) {
            return { success: false, error: "Member not found" }
        }

        if (memberToRemove.isOwner) {
            return { success: false, error: "Cannot remove the company owner" }
        }

        // Remove the member
        await prisma.companyMember.delete({
            where: { id: memberId }
        })

        return { success: true, message: "Member removed successfully" }

    } catch (error) {
        console.error("Remove company member error:", error)
        return { success: false, error: "Failed to remove member" }
    }
}

/**
 * Server action to update company member permissions
 */
export const updateCompanyMemberAction = async (companyId: number, memberId: number, permissions: { isAdmin: boolean, canPost: boolean, canApprove: boolean }) => {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" }
        }

        // Get current user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return { success: false, error: "User not found" }
        }

        // Check if user is a member of the company with admin privileges
        const membership = await prisma.companyMember.findFirst({
            where: {
                userId: user.id,
                companyId: companyId,
                companyMemberStatus: CompanyMemberStatus.accepted,
                OR: [
                    { isAdmin: true },
                    { isOwner: true }
                ]
            }
        })

        if (!membership) {
            return { success: false, error: "You don't have permission to update member permissions" }
        }

        // Check if the member being updated exists
        const memberToUpdate = await prisma.companyMember.findUnique({
            where: { id: memberId }
        })

        if (!memberToUpdate || memberToUpdate.companyId !== companyId) {
            return { success: false, error: "Member not found" }
        }

        if (memberToUpdate.isOwner) {
            return { success: false, error: "Cannot modify owner permissions" }
        }

        // Update member permissions
        const updatedMember = await prisma.companyMember.update({
            where: { id: memberId },
            data: {
                isAdmin: permissions.isAdmin,
                canPost: permissions.canPost,
                canApprove: permissions.canApprove,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    }
                }
            }
        })

        return { success: true, member: updatedMember, message: "Member permissions updated successfully" }

    } catch (error) {
        console.error("Update company member error:", error)
        return { success: false, error: "Failed to update member permissions" }
    }
}
