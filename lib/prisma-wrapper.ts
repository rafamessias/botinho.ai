import { auth } from "@/app/auth"
import { prisma } from "@/prisma/lib/prisma"



export async function getCurrentCompanyId(): Promise<number | null> {
    try {
        const session = await auth()
        if (!session?.user?.email) return null

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { defaultCompanyId: true }
        })

        return user?.defaultCompanyId || null
    } catch (error) {
        console.error("Failed to get company ID:", error)
        return null
    }
}

/**
 * Prisma wrapper that automatically injects team ID for CRUD operations
 * based on the current user's default team
 */
export class PrismaCompanyWrapper {
    /**
     * Always get fresh team ID from database
     */
    /**
     * Find many records with fresh team ID
     */
    async findMany(model: any, args: any = {}): Promise<any[]> {
        const companyId = await getCurrentCompanyId()

        if (companyId === null) {
            throw new Error("User has no default team assigned")
        }

        const whereClause = {
            ...args.where,
            companyId: companyId
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
        const companyId = await getCurrentCompanyId()

        if (companyId === null) {
            throw new Error("User has no default team assigned")
        }

        const whereClause = {
            ...args.where,
            companyId: companyId
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
        const companyId = await getCurrentCompanyId()

        if (companyId === null) {
            throw new Error("User has no default team assigned")
        }

        const whereClause = {
            ...args.where,
            companyId: companyId
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
        const companyId = await getCurrentCompanyId()

        if (companyId === null) {
            throw new Error("User has no default team assigned")
        }

        const whereClause = {
            ...args.where,
            companyId: companyId
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
        const companyId = await getCurrentCompanyId()

        if (companyId === null) {
            throw new Error("User has no default team assigned")
        }

        const whereClause = {
            ...args.where,
            companyId: companyId
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
        const companyId = await getCurrentCompanyId()

        if (companyId === null) {
            throw new Error("User has no default team assigned")
        }

        const whereClause = {
            ...args.where,
            companyId: companyId
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
        const companyId = await getCurrentCompanyId()

        if (companyId === null) {
            throw new Error("User has no default team assigned")
        }

        const whereClause = {
            ...args.where,
            companyId: companyId
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
        const companyId = await getCurrentCompanyId()

        if (companyId === null) {
            throw new Error("User has no default team assigned")
        }

        const whereClause = {
            ...args.where,
            companyId: companyId
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
        const companyId = await getCurrentCompanyId()

        if (companyId === null) {
            throw new Error("User has no default team assigned")
        }

        const createData = {
            ...args.create,
            companyId: companyId
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
export const createPrismaWrapper = (): PrismaCompanyWrapper => {
    return new PrismaCompanyWrapper()
}

/**
 * Convenience function to get a singleton instance
 */
let wrapperInstance: PrismaCompanyWrapper | null = null

export const getPrismaWrapper = (): PrismaCompanyWrapper => {
    if (!wrapperInstance) {
        wrapperInstance = new PrismaCompanyWrapper()
    }
    return wrapperInstance
}
