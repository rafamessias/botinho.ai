"use server"

import { prisma } from "@/prisma/lib/prisma"
import { revalidateTag } from "next/cache"
import { requireSession } from "./check-session"

export async function getProjectBySlug(slug: string) {
    try {
        await requireSession()

        const project = await prisma.project.findFirst({
            where: {
                id: parseInt(slug),
                active: true
            },
            include: {
                company: {
                    include: {
                        owner: true
                    }
                },
                image: true,
                users: {
                    include: {
                        user: true,
                        company: true
                    }
                }
            }
        })

        if (!project) {
            return {
                success: false,
                data: null,
                error: "Project not found"
            }
        }

        // Transform to match expected format
        const transformedProject = {
            id: project.id,
            name: project.name,
            description: project.description || "",
            address: project.address || "",
            projectStatus: project.projectStatus,
            rdoCount: project.rdoCount,
            rdoCountDraft: project.rdoCountDraft,
            incidentCount: project.incidentCount,
            incidentCountDraft: project.incidentCountDraft,
            photoCount: project.photoCount,
            active: project.active,
            image: project.image,
            company: project.company,
            users: project.users,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt
        }

        return {
            success: true,
            data: transformedProject
        }
    } catch (error) {
        console.error("Error fetching project:", error)
        return {
            success: false,
            data: null,
            error: "Failed to fetch project"
        }
    }
}

export async function getProjectRDOs(projectId: number, page: number = 1, pageSize: number = 10) {
    try {
        await requireSession()

        const skip = (page - 1) * pageSize

        const rdos = await prisma.rDO.findMany({
            where: {
                projectId: projectId
            },
            include: {
                user: true,
                project: true,
                company: true,
                media: true,
                comments: {
                    include: {
                        user: true
                    }
                },
                approvalAudits: {
                    include: {
                        user: true
                    }
                }
            },
            orderBy: [
                { date: 'desc' },
                { id: 'desc' }
            ],
            skip,
            take: pageSize
        })

        // Transform to match expected format
        const transformedRdos = rdos.map(rdo => ({
            id: rdo.id,
            date: rdo.date,
            rdoStatus: rdo.rdoStatus,
            description: rdo.description,
            equipmentUsed: rdo.equipmentUsed,
            workforce: rdo.workforce,
            createdBy: rdo.createdBy,
            commentCount: rdo.commentCount,
            weatherMorningCondition: rdo.weatherMorningCondition,
            weatherMorningWorkable: rdo.weatherMorningWorkable,
            weatherAfternoonCondition: rdo.weatherAfternoonCondition,
            weatherAfternoonWorkable: rdo.weatherAfternoonWorkable,
            weatherNightCondition: rdo.weatherNightCondition,
            weatherNightWorkable: rdo.weatherNightWorkable,
            user: rdo.user,
            project: rdo.project,
            company: rdo.company,
            media: rdo.media,
            comments: rdo.comments,
            approvalAudits: rdo.approvalAudits,
            createdAt: rdo.createdAt,
            updatedAt: rdo.updatedAt
        }))

        // Get total count for pagination
        const totalCount = await prisma.rDO.count({
            where: {
                projectId: projectId
            }
        })

        return {
            success: true,
            data: transformedRdos,
            pagination: {
                page,
                pageSize,
                total: totalCount,
                totalPages: Math.ceil(totalCount / pageSize)
            }
        }
    } catch (error) {
        console.error("Error fetching RDOs:", error)
        return {
            success: false,
            data: null,
            error: "Failed to fetch RDOs"
        }
    }
}

export async function getProjectIncidents(projectId: number, page: number = 1, pageSize: number = 10) {
    try {
        await requireSession()

        const skip = (page - 1) * pageSize

        const incidents = await prisma.incident.findMany({
            where: {
                projectId: projectId
            },
            include: {
                user: true,
                project: true,
                company: true,
                media: true,
                comments: {
                    include: {
                        user: true
                    }
                },
                approvalAudits: {
                    include: {
                        user: true
                    }
                }
            },
            orderBy: [
                { date: 'desc' },
                { id: 'desc' }
            ],
            skip,
            take: pageSize
        })

        // Transform to match expected format
        const transformedIncidents = incidents.map(incident => ({
            id: incident.id,
            date: incident.date,
            incidentStatus: incident.incidentStatus,
            priority: incident.priority,
            description: incident.description,
            commentCount: incident.commentCount,
            createdBy: incident.createdBy,
            user: incident.user,
            project: incident.project,
            company: incident.company,
            media: incident.media,
            comments: incident.comments,
            approvalAudits: incident.approvalAudits,
            createdAt: incident.createdAt,
            updatedAt: incident.updatedAt
        }))

        // Get total count for pagination
        const totalCount = await prisma.incident.count({
            where: {
                projectId: projectId
            }
        })

        return {
            success: true,
            data: transformedIncidents,
            pagination: {
                page,
                pageSize,
                total: totalCount,
                totalPages: Math.ceil(totalCount / pageSize)
            }
        }
    } catch (error) {
        console.error("Error fetching incidents:", error)
        return {
            success: false,
            data: null,
            error: "Failed to fetch incidents"
        }
    }
}

export async function getFeedData(projectId: number, pageSize: number = 10) {
    try {
        await requireSession()

        // Fetch project data
        const projectResult = await getProjectBySlug(projectId.toString())
        if (!projectResult.success) {
            return {
                success: false,
                data: null,
                error: projectResult.error
            }
        }

        // Fetch initial RDOs
        const rdosResult = await getProjectRDOs(projectId, 1, pageSize)
        if (!rdosResult.success) {
            return {
                success: false,
                data: null,
                error: rdosResult.error
            }
        }

        // Fetch initial incidents
        const incidentsResult = await getProjectIncidents(projectId, 1, pageSize)
        if (!incidentsResult.success) {
            return {
                success: false,
                data: null,
                error: incidentsResult.error
            }
        }

        return {
            success: true,
            data: {
                project: projectResult.data,
                rdos: rdosResult.data,
                incidents: incidentsResult.data,
                rdosPagination: rdosResult.pagination,
                incidentsPagination: incidentsResult.pagination
            }
        }
    } catch (error) {
        console.error("Error fetching feed data:", error)
        return {
            success: false,
            data: null,
            error: "Failed to fetch feed data"
        }
    }
}

// Legacy functions for backward compatibility with existing components
export async function getPaginatedRdos(projectId: number, page: number, pageSize: number) {
    return await getProjectRDOs(projectId, page, pageSize)
}

export async function getPaginatedIncidents(projectId: number, page: number, pageSize: number) {
    return await getProjectIncidents(projectId, page, pageSize)
} 