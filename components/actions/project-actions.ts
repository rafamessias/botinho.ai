'use server';

import { prisma } from '@/prisma/lib/prisma';
import { RDO, Incident, Project, ApiResponse } from '../types/prisma';

export async function getPaginatedProjectRdos(projectSlug: string, page: number, pageSize: number): Promise<ApiResponse<RDO[]>> {
    try {
        const projectId = parseInt(projectSlug);
        if (isNaN(projectId)) {
            return { success: false, data: null, error: 'Invalid project ID' };
        }

        const rdosData = await prisma.rDO.findMany({
            where: { projectId: projectId },
            include: {
                user: {
                    include: {
                        avatar: true
                    }
                },
                media: true
            },
            orderBy: [
                { date: 'desc' },
                { id: 'desc' }
            ],
            take: pageSize,
            skip: (page - 1) * pageSize
        });

        return { success: true, data: rdosData as RDO[] };
    } catch (error) {
        console.error('Error fetching paginated project RDOs:', error);
        return { success: false, data: null, error: 'Failed to fetch RDOs' };
    }
}

export async function getPaginatedProjectIncidents(projectSlug: string, page: number, pageSize: number): Promise<ApiResponse<Incident[]>> {
    try {
        const projectId = parseInt(projectSlug);
        if (isNaN(projectId)) {
            return { success: false, data: null, error: 'Invalid project ID' };
        }

        const incidentsData = await prisma.incident.findMany({
            where: { projectId: projectId },
            include: {
                user: {
                    include: {
                        avatar: true
                    }
                },
                media: true
            },
            orderBy: [
                { date: 'desc' },
                { id: 'desc' }
            ],
            take: pageSize,
            skip: (page - 1) * pageSize
        });

        return { success: true, data: incidentsData as Incident[] };
    } catch (error) {
        console.error('Error fetching paginated project incidents:', error);
        return { success: false, data: null, error: 'Failed to fetch incidents' };
    }
}

export async function getFilteredProjects(status: string = 'active'): Promise<ApiResponse<Project[]>> {
    try {
        const whereClause: any = {};

        if (status !== 'all') {
            whereClause.active = status === 'active';
        }

        const projectsData = await prisma.project.findMany({
            where: whereClause,
            include: {
                image: true,
                company: {
                    include: {
                        owner: true
                    }
                }
            },
            orderBy: {
                id: 'desc'
            }
        });

        return { success: true, data: projectsData as Project[] };
    } catch (error) {
        console.error('Error fetching filtered projects:', error);
        return { success: false, data: null, error: 'Failed to fetch projects' };
    }
}

export async function searchProjects(searchTerm: string, status: string = 'all'): Promise<ApiResponse<Project[]>> {
    try {
        const whereClause: any = {};

        // Add status filter if not 'all'
        if (status !== 'all') {
            whereClause.active = status === 'active';
        }

        // Add search filters
        if (searchTerm.trim()) {
            const searchValue = searchTerm.trim();
            const searchId = parseInt(searchValue);

            whereClause.OR = [
                { name: { contains: searchValue, mode: 'insensitive' } },
                { description: { contains: searchValue, mode: 'insensitive' } }
            ];

            // If search term is a valid number, also search by ID
            if (!isNaN(searchId)) {
                whereClause.OR.push({ id: searchId });
            }
        }

        const projectsData = await prisma.project.findMany({
            where: whereClause,
            include: {
                image: true,
                company: {
                    include: {
                        owner: true
                    }
                }
            },
            orderBy: {
                id: 'desc'
            }
        });

        return { success: true, data: projectsData as Project[] };
    } catch (error) {
        console.error('Error searching projects:', error);
        return { success: false, data: null, error: 'Failed to search projects' };
    }
} 