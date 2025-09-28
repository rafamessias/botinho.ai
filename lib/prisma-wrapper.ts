import { auth } from "@/app/auth"
import { prisma } from "@/prisma/lib/prisma"



export async function getCurrentTeamId(): Promise<number | null> {
    try {
        const session = await auth()
        if (!session?.user?.email) return null

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { defaultTeamId: true }
        })

        return user?.defaultTeamId || null
    } catch (error) {
        console.error("Failed to get team ID:", error)
        return null
    }
}

/**
 * Prisma wrapper that automatically injects team ID for CRUD operations
 * based on the current user's default team
 */
export class PrismaTeamWrapper {
    /**
     * Always get fresh team ID from database
     */
    /**
     * Find many records with fresh team ID
     */
    async findMany(model: any, args: any = {}): Promise<any[]> {
        const teamId = await getCurrentTeamId()

        if (teamId === null) {
            throw new Error("User has no default team assigned")
        }

        const whereClause = {
            ...args.where,
            teamId: teamId
        }

        return await model.findMany({
            ...args,
            where: whereClause
        })
    }

    /**
     * Find unique record filtered by team ID
     */
    async findUnique(model: any, args: any): Promise<any> {
        const teamId = await getCurrentTeamId()

        if (teamId === null) {
            throw new Error("User has no default team assigned")
        }

        const whereClause = {
            ...args.where,
            teamId: teamId
        }

        return await model.findUnique({
            ...args,
            where: whereClause
        })
    }

    /**
     * Find first record filtered by team ID
     */
    async findFirst(model: any, args: any = {}): Promise<any> {
        const teamId = await getCurrentTeamId()

        if (teamId === null) {
            throw new Error("User has no default team assigned")
        }

        const whereClause = {
            ...args.where,
            teamId: teamId
        }

        return await model.findFirst({
            ...args,
            where: whereClause
        })
    }

    /**
     * Update a record with team ID validation
     */
    async update(model: any, args: any): Promise<any> {
        const teamId = await getCurrentTeamId()

        if (teamId === null) {
            throw new Error("User has no default team assigned")
        }

        const whereClause = {
            ...args.where,
            teamId: teamId
        }

        return await model.update({
            ...args,
            where: whereClause
        })
    }

    /**
     * Update many records with team ID validation
     */
    async updateMany(model: any, args: any): Promise<any> {
        const teamId = await getCurrentTeamId()

        if (teamId === null) {
            throw new Error("User has no default team assigned")
        }

        const whereClause = {
            ...args.where,
            teamId: teamId
        }

        return await model.updateMany({
            ...args,
            where: whereClause
        })
    }

    /**
     * Delete a record with team ID validation
     */
    async delete(model: any, args: any): Promise<any> {
        const teamId = await getCurrentTeamId()

        if (teamId === null) {
            throw new Error("User has no default team assigned")
        }

        const whereClause = {
            ...args.where,
            teamId: teamId
        }

        return await model.delete({
            ...args,
            where: whereClause
        })
    }

    /**
     * Delete many records with team ID validation
     */
    async deleteMany(model: any, args: any = {}): Promise<any> {
        const teamId = await getCurrentTeamId()

        if (teamId === null) {
            throw new Error("User has no default team assigned")
        }

        const whereClause = {
            ...args.where,
            teamId: teamId
        }

        return await model.deleteMany({
            ...args,
            where: whereClause
        })
    }

    /**
     * Count records with fresh team ID
     */
    async count(model: any, args: any = {}): Promise<number> {
        const teamId = await getCurrentTeamId()

        if (teamId === null) {
            throw new Error("User has no default team assigned")
        }

        const whereClause = {
            ...args.where,
            teamId: teamId
        }

        return await model.count({
            ...args,
            where: whereClause
        })
    }

    /**
     * Upsert a record with automatic team ID injection
     */
    async upsert(model: any, args: any): Promise<any> {
        const teamId = await getCurrentTeamId()

        if (teamId === null) {
            throw new Error("User has no default team assigned")
        }

        const createData = {
            ...args.create,
            teamId: teamId
        }

        return await model.upsert({
            ...args,
            create: createData
        })
    }
}

/**
 * Create a new instance of the Prisma wrapper
 */
export const createPrismaWrapper = (): PrismaTeamWrapper => {
    return new PrismaTeamWrapper()
}

/**
 * Convenience function to get a singleton instance
 */
let wrapperInstance: PrismaTeamWrapper | null = null

export const getPrismaWrapper = (): PrismaTeamWrapper => {
    if (!wrapperInstance) {
        wrapperInstance = new PrismaTeamWrapper()
    }
    return wrapperInstance
}
