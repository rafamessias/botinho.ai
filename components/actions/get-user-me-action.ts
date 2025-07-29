"use server"

import { auth } from "@/app/auth"
import { prisma } from "@/prisma/lib/prisma"

export async function getUserMe() {
    try {
        // Get the current session from NextAuth
        const session = await auth()

        if (!session?.user?.email) {
            return {
                success: false,
                data: null,
                meta: null,
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
                meta: null,
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
            meta: null
        }

    } catch (error) {
        console.error("Error fetching user:", error)
        return {
            success: false,
            data: null,
            meta: null,
            error: "Failed to fetch user"
        }
    }
}