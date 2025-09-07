import { auth } from "@/app/auth"
import { prisma } from "@/prisma/lib/prisma"
import { Prisma } from "@/lib/generated/prisma"

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

            this.teamId = user.defaultTeamId
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
     * Create a new record with automatic team ID injection
     */
    async create<T extends { teamId?: number }>(
        model: any,
        data: Omit<T, 'teamId'> & { teamId?: number }
    ): Promise<T> {
        await this.ensureInitialized()

        if (this.teamId === null) {
            throw new Error("User has no default team assigned")
        }

        const dataWithTeamId = {
            ...data,
            teamId: this.teamId
        }

        return await model.create({
            data: dataWithTeamId
        })
    }

    /**
     * Find many records filtered by team ID
     */
    async findMany<T>(
        model: any,
        args?: Omit<Prisma.Args<T, 'findMany'>, 'where'> & {
            where?: Omit<Prisma.Args<T, 'findMany'>['where'], 'teamId'>
        }
    ): Promise<T[]> {
        await this.ensureInitialized()

        if (this.teamId === null) {
            throw new Error("User has no default team assigned")
        }

        const whereClause = {
            ...args?.where,
            teamId: this.teamId
        }

        return await model.findMany({
            ...args,
            where: whereClause
        })
    }

    /**
     * Find unique record filtered by team ID
     */
    async findUnique<T>(
        model: any,
        args: Omit<Prisma.Args<T, 'findUnique'>, 'where'> & {
            where: Omit<Prisma.Args<T, 'findUnique'>['where'], 'teamId'> & { id: number }
        }
    ): Promise<T | null> {
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
    async findFirst<T>(
        model: any,
        args?: Omit<Prisma.Args<T, 'findFirst'>, 'where'> & {
            where?: Omit<Prisma.Args<T, 'findFirst'>['where'], 'teamId'>
        }
    ): Promise<T | null> {
        await this.ensureInitialized()

        if (this.teamId === null) {
            throw new Error("User has no default team assigned")
        }

        const whereClause = {
            ...args?.where,
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
    async update<T extends { teamId?: number }>(
        model: any,
        args: {
            where: { id: number }
            data: Omit<T, 'teamId' | 'id'>
        }
    ): Promise<T> {
        await this.ensureInitialized()

        if (this.teamId === null) {
            throw new Error("User has no default team assigned")
        }

        // First verify the record belongs to the user's team
        const existingRecord = await model.findUnique({
            where: { id: args.where.id }
        })

        if (!existingRecord) {
            throw new Error("Record not found")
        }

        if (existingRecord.teamId !== this.teamId) {
            throw new Error("Access denied: Record does not belong to your team")
        }

        return await model.update({
            where: args.where,
            data: args.data
        })
    }

    /**
     * Delete a record with team ID validation
     */
    async delete<T>(
        model: any,
        args: { where: { id: number } }
    ): Promise<T> {
        await this.ensureInitialized()

        if (this.teamId === null) {
            throw new Error("User has no default team assigned")
        }

        // First verify the record belongs to the user's team
        const existingRecord = await model.findUnique({
            where: { id: args.where.id }
        })

        if (!existingRecord) {
            throw new Error("Record not found")
        }

        if (existingRecord.teamId !== this.teamId) {
            throw new Error("Access denied: Record does not belong to your team")
        }

        return await model.delete({
            where: args.where
        })
    }

    /**
     * Count records filtered by team ID
     */
    async count<T>(
        model: any,
        args?: Omit<Prisma.Args<T, 'count'>, 'where'> & {
            where?: Omit<Prisma.Args<T, 'count'>['where'], 'teamId'>
        }
    ): Promise<number> {
        await this.ensureInitialized()

        if (this.teamId === null) {
            throw new Error("User has no default team assigned")
        }

        const whereClause = {
            ...args?.where,
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
    async upsert<T extends { teamId?: number }>(
        model: any,
        args: {
            where: { id: number }
            create: Omit<T, 'teamId'>
            update: Omit<T, 'teamId' | 'id'>
        }
    ): Promise<T> {
        await this.ensureInitialized()

        if (this.teamId === null) {
            throw new Error("User has no default team assigned")
        }

        const createData = {
            ...args.create,
            teamId: this.teamId
        }

        return await model.upsert({
            where: args.where,
            create: createData,
            update: args.update
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
