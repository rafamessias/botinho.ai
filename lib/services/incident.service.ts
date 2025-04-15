import { PrismaClient } from '@prisma/client';
import { prisma } from '../prisma';

export class IncidentService {
    /**
     * Creates a new Incident with an auto-incremented number for the project
     * @param projectId The ID of the project
     * @param data The Incident data
     * @returns The created Incident
     */
    async createIncident(projectId: string, data: any) {
        // Use a transaction to ensure atomicity
        return prisma.$transaction(async (tx: PrismaClient) => {
            // Verify the project exists
            const project = await tx.project.findUnique({
                where: { id: projectId },
            });

            if (!project) {
                throw new Error(`Project with ID ${projectId} not found`);
            }

            // Find the highest Incident number for this project
            const highestIncident = await tx.incident.findFirst({
                where: { projectId },
                orderBy: { incidentNumber: 'desc' },
            });

            // Increment the number by 1 (or start at 1 if no Incidents exist)
            const nextIncidentNumber = (highestIncident?.incidentNumber || 0) + 1;

            // Create the new Incident with the incremented number
            const newIncident = await tx.incident.create({
                data: {
                    ...data,
                    projectId,
                    incidentNumber: nextIncidentNumber,
                },
            });

            // Update the project's Incident count
            await tx.project.update({
                where: { id: projectId },
                data: {
                    incidentCount: {
                        increment: 1,
                    },
                },
            });

            return newIncident;
        });
    }

    /**
     * Gets all Incidents for a project
     * @param projectId The ID of the project
     * @returns Array of Incidents
     */
    async getIncidentsByProject(projectId: string) {
        return prisma.incident.findMany({
            where: { projectId },
            orderBy: { incidentNumber: 'asc' },
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
     * Gets a specific Incident by ID
     * @param id The ID of the Incident
     * @returns The Incident or null if not found
     */
    async getIncidentById(id: string) {
        return prisma.incident.findUnique({
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