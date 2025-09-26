import { auth } from "@/app/auth"
import { prisma } from "@/prisma/lib/prisma"

/**
 * Prisma wrapper that automatically injects team ID for CRUD operations
 * based on the current user's default team
 */
export class PrismaTeamWrapper {
    private teamId: number | null = null
    private initialized: boolean = false

    /**
     * Initialize the wrapper by getting the current user's default team ID
     */
    private async initialize(): Promise<void> {
        if (this.initialized) return

        try {
            const session = await auth()

            if (!session?.user?.email) {
                throw new Error("User not authenticated")
            }

            // Get user with default team ID
            const user = await prisma.user.findUnique({
                where: { email: session.user.email },
                select: { defaultTeamId: true }
            })

            if (!user) {
                throw new Error("User not found")
            }


            this.teamId = user.defaultTeamId || 0
            this.initialized = true
        } catch (error) {
            console.error("Failed to initialize Prisma wrapper:", error)
            throw new Error("Failed to get user team information")
        }
    }

    /**
     * Ensure wrapper is initialized before operations
     */
    private async ensureInitialized(): Promise<void> {
        if (!this.initialized) {
            await this.initialize()
        }
    }

    /**
     * Get the current user's team ID
     */
    async getTeamId(): Promise<number | null> {
        await this.ensureInitialized()
        return this.teamId
    }

    /**
     * Refresh the team ID from the database
     * Useful when the user's default team has been changed
     */
    async refreshTeamId(): Promise<void> {
        try {
            const session = await auth()

            if (!session?.user?.email) {
                throw new Error("User not authenticated")
            }

            // Get user with default team ID
            const user = await prisma.user.findUnique({
                where: { email: session.user.email },
                select: { defaultTeamId: true }
            })

            if (!user) {
                throw new Error("User not found")
            }

            this.teamId = user.defaultTeamId || 0
        } catch (error) {
            console.error("Failed to refresh team ID:", error)
            throw new Error("Failed to refresh team information")
        }
    }

    /**
     * Reset the wrapper to force re-initialization
     * Useful when user's team context has changed
     */
    reset(): void {
        this.teamId = null
        this.initialized = false
    }

    /**
     * Create a new record with automatic team ID injection
     */
    async create(model: any, args: any): Promise<any> {
        await this.ensureInitialized()

        if (this.teamId === null) {
            throw new Error("User has no default team assigned")
        }

        const dataWithTeamId = {
            ...args.data,
            teamId: this.teamId
        }

        return await model.create({
            ...args,
            data: dataWithTeamId
        })
    }

    /**
     * Find many records filtered by team ID
     */
    async findMany(model: any, args: any = {}): Promise<any[]> {
        await this.ensureInitialized()

        if (this.teamId === null) {
            throw new Error("User has no default team assigned")
        }

        const whereClause = {
            ...args.where,
            teamId: this.teamId
        }

        const result = await model.findMany({
            ...args,
            where: whereClause
        })

        return result
    }

    /**
     * Find unique record filtered by team ID
     */
    async findUnique(model: any, args: any): Promise<any> {
        await this.ensureInitialized()

        if (this.teamId === null) {
            throw new Error("User has no default team assigned")
        }

        const whereClause = {
            ...args.where,
            teamId: this.teamId
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
        await this.ensureInitialized()

        if (this.teamId === null) {
            throw new Error("User has no default team assigned")
        }

        const whereClause = {
            ...args.where,
            teamId: this.teamId
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
        await this.ensureInitialized()

        if (this.teamId === null) {
            throw new Error("User has no default team assigned")
        }

        const whereClause = {
            ...args.where,
            teamId: this.teamId
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
        await this.ensureInitialized()

        if (this.teamId === null) {
            throw new Error("User has no default team assigned")
        }

        const whereClause = {
            ...args.where,
            teamId: this.teamId
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
        await this.ensureInitialized()

        if (this.teamId === null) {
            throw new Error("User has no default team assigned")
        }

        const whereClause = {
            ...args.where,
            teamId: this.teamId
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
        await this.ensureInitialized()

        if (this.teamId === null) {
            throw new Error("User has no default team assigned")
        }

        const whereClause = {
            ...args.where,
            teamId: this.teamId
        }

        return await model.deleteMany({
            ...args,
            where: whereClause
        })
    }

    /**
     * Count records filtered by team ID
     */
    async count(model: any, args: any = {}): Promise<number> {
        await this.ensureInitialized()

        if (this.teamId === null) {
            throw new Error("User has no default team assigned")
        }

        const whereClause = {
            ...args.where,
            teamId: this.teamId
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
        await this.ensureInitialized()

        if (this.teamId === null) {
            throw new Error("User has no default team assigned")
        }

        const createData = {
            ...args.create,
            teamId: this.teamId
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

/**
 * Reset the singleton wrapper instance
 * Useful when user's team context has changed and you want to force re-initialization
 */
export const resetPrismaWrapper = (): void => {
    if (wrapperInstance) {
        wrapperInstance.reset()
    }
}

/**
 * Refresh the team ID in the singleton wrapper instance
 * Useful when user's default team has been updated
 */
export const refreshPrismaWrapperTeamId = async (): Promise<void> => {
    if (wrapperInstance) {
        await wrapperInstance.refreshTeamId()
    }
}