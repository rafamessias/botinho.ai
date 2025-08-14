"use server"

import { auth } from "@/app/auth"
import { prisma } from "@/prisma/lib/prisma"
import { revalidateTag } from "next/cache"

export async function getUserMe() {
    try {
        // Get the current session from NextAuth
        const session = await auth()

        if (!session?.user?.email) {
            return {
                success: false,
                data: null,
                error: "No authenticated user found"
            }
        }

        // Fetch user from Prisma with all relations
        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email
            },
            include: {
                company: true,
                avatar: true,
                companyMembers: {
                    include: {
                        company: true
                    }
                },
                projectUsers: {
                    include: {
                        project: true,
                        company: true
                    }
                }
            }
        })

        if (!user) {
            return {
                success: false,
                data: null,
                error: "User not found"
            }
        }

        // Transform the data to match the expected format
        const userData: any = {
            id: user.id,
            email: user.email,
            provider: user.provider,
            confirmed: user.confirmed,
            blocked: user.blocked,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            type: user.type,
            language: user.language === "pt_BR" ? "pt-BR" : "en",
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            avatar: user.avatar,
            company: user.company,
            companyMember: user.companyMembers?.[0] || null,
            projectUser: user.projectUsers || []
        }

        return {
            success: true,
            data: userData,
        }

    } catch (error) {
        console.error("Error fetching user:", error)
        return {
            success: false,
            data: null,
            error: "Failed to fetch user"
        }
    }
}

// Server-side function to get user data with caching
export async function getServerUserData() {
    try {
        const session = await auth()

        if (!session?.user?.email) {
            return null
        }

        // Use Next.js cache for better performance
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                company: true,
                avatar: true,
                companyMembers: {
                    include: { company: true }
                },
                projectUsers: {
                    include: {
                        project: true,
                        company: true
                    }
                }
            }
        })

        if (!user) return null

        // Process user data with permissions
        const userData: any = {
            id: user.id,
            email: user.email,
            provider: user.provider,
            confirmed: user.confirmed,
            blocked: user.blocked,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            type: user.type,
            language: user.language === "pt_BR" ? "pt-BR" : "en",
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            avatar: user.avatar,
            company: user.company,
            companyMember: user.companyMembers?.[0] || null,
            projectUser: user.projectUsers || []
        }

        // Calculate permissions
        userData.isCompanyUser = userData?.companyMember ? true : false;
        userData.companyMemberCanApprove = userData?.companyMember ? (
            userData?.companyMember.canApprove ||
            userData?.companyMember.isAdmin ||
            userData?.companyMember.isOwner
        ) : false;
        userData.companyMemberCanPost = userData?.companyMember ? (
            userData?.companyMember.canPost ||
            userData?.companyMember.isAdmin ||
            userData?.companyMember.isOwner
        ) : false;
        userData.companyMemberIsAdmin = userData?.companyMember ? (
            userData?.companyMember.isAdmin ||
            userData?.companyMember.isOwner
        ) : false;
        userData.projectUserCanApprove = (projectId: number) => {
            return userData?.projectUser ?
                userData?.projectUser.some((pu: any) =>
                    pu.canApprove === true && pu.project.id === projectId
                ) : false;
        };

        return userData
    } catch (error) {
        console.error("Error fetching server user data:", error)
        return null
    }
}

// Function to revalidate user data cache
export async function revalidateUserData() {
    revalidateTag('user-data')
}