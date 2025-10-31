import { PrismaClient } from "../lib/generated/prisma"

type GlobalWithPrisma = typeof globalThis & {
    __wsPrisma?: PrismaClient
}

const globalForPrisma = globalThis as GlobalWithPrisma

export const prisma = globalForPrisma.__wsPrisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.__wsPrisma = prisma
}

