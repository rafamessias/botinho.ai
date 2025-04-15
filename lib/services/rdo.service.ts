import { PrismaClient } from '@prisma/client';
import { prisma } from '../prisma';

export class RdoService {
    /**
     * Creates a new RDO with an auto-incremented number for the project
     * @param projectId The ID of the project
     * @param data The RDO data
     * @returns The created RDO
     */
    async createRDO(projectId: string, data: any) {
        // Use a transaction to ensure atomicity
        return prisma.$transaction(async (tx: PrismaClient) => {
            // Verify the project exists
            const project = await tx.project.findUnique({
                where: { id: projectId },
            });

            if (!project) {
                throw new Error(`Project with ID ${projectId} not found`);
            }

            // Find the highest RDO number for this project
            const highestRDO = await tx.rDO.findFirst({
                where: { projectId },
                orderBy: { rdoNumber: 'desc' },
            });

            // Increment the number by 1 (or start at 1 if no RDOs exist)
            const nextRdoNumber = (highestRDO?.rdoNumber || 0) + 1;

            // Create the new RDO with the incremented number
            const newRDO = await tx.rDO.create({
                data: {
                    ...data,
                    projectId,
                    rdoNumber: nextRdoNumber,
                },
            });

            // Update the project's RDO count
            await tx.project.update({
                where: { id: projectId },
                data: {
                    rdoCount: {
                        increment: 1,
                    },
                },
            });

            return newRDO;
        });
    }

    /**
     * Gets all RDOs for a project
     * @param projectId The ID of the project
     * @returns Array of RDOs
     */
    async getRDOsByProject(projectId: string) {
        return prisma.rDO.findMany({
            where: { projectId },
            orderBy: { rdoNumber: 'asc' },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
                media: true,
            },
        });
    }

    /**
     * Gets a specific RDO by ID
     * @param id The ID of the RDO
     * @returns The RDO or null if not found
     */
    async getRDOById(id: string) {
        return prisma.rDO.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
                media: true,
                comments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                avatar: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
    }
} 