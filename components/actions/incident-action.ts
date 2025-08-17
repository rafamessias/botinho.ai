'use server';

import { prisma } from '@/prisma/lib/prisma';
import { prismaWithCompany } from './prisma-with-company';
import { requireSession } from './check-session';
import { uploadFileToCloudinary, deleteFileFromCloudinary } from './cloudinary-upload-action';
import { getUserMe } from './get-user-me-action';
import { revalidateTag } from 'next/cache';
import { IncidentStatus } from '@/lib/generated/prisma';

// Types for the refactored functions
export interface CreateIncidentData {
    projectId: number;
    date: Date;
    incidentStatus: IncidentStatus;
    description: string;
    priority?: number;
    media?: File[];
}

export interface UpdateIncidentData {
    date?: Date;
    incidentStatus?: IncidentStatus;
    description?: string;
    priority?: number;
}

export interface ClientInfo {
    ip_address?: string;
    latitude?: string;
    longitude?: string;
    device_type?: string;
    time_zone?: string;
    geo_location?: string;
}

export async function createIncident(data: CreateIncidentData) {
    try {
        // Check authentication
        const user = await requireSession();

        // Get current user with company info
        const userMeResponse = await getUserMe();
        if (!userMeResponse.success || !userMeResponse.data?.company?.id) {
            return {
                success: false,
                error: 'User not found or no company associated',
                data: null
            };
        }

        const companyId = userMeResponse.data.company.id;
        const userId = userMeResponse.data.id;

        // Create the incident
        const incident = await prismaWithCompany.incident.create({
            projectId: data.projectId,
            userId: userId,
            date: data.date,
            incidentStatus: data.incidentStatus,
            description: data.description,
            priority: data.priority || 1,
            createdBy: `${userMeResponse.data.firstName} ${userMeResponse.data.lastName}`.trim(),
        });

        console.log(`Creating incident ${incident.id} - Incident created successfully`);

        // Upload files if they exist
        if (data.media && data.media.length > 0) {
            const uploadPromises = data.media.map(async (file) => {
                const uploadResponse = await uploadFileToCloudinary({
                    file,
                    tableName: 'Incident',
                    recordId: incident.id,
                    fieldName: 'media',
                    folder: 'obraguru/incidents'
                });

                if (!uploadResponse.success) {
                    console.error(`Failed to upload file: ${file.name}`);
                    return { success: false, error: `Failed to upload file: ${file.name}` };
                }
                return { success: true, data: uploadResponse.data };
            });

            console.log(`Uploading ${data.media.length} files successfully`);
            await Promise.all(uploadPromises);
        }

        // Update project incident count
        await prisma.project.update({
            where: { id: data.projectId },
            data: {
                incidentCount: {
                    increment: 1
                },
                ...(data.incidentStatus === 'draft' && {
                    incidentCountDraft: {
                        increment: 1
                    }
                })
            }
        });

        revalidateTag(`incidents`);
        revalidateTag(`project:${data.projectId}`);

        return { success: true, data: incident };
    } catch (error) {
        console.error(`Error creating incident: ${error}`);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred',
            data: null
        };
    }
}

export async function updateIncident(incidentId: number, data: UpdateIncidentData) {
    try {
        // Check authentication
        await requireSession();

        const updateData: any = {};
        if (data.date) updateData.date = data.date;
        if (data.incidentStatus) updateData.incidentStatus = data.incidentStatus;
        if (data.description) updateData.description = data.description;
        if (data.priority !== undefined) updateData.priority = data.priority;

        const incident = await prisma.incident.update({
            where: { id: incidentId },
            data: updateData,
            include: {
                project: true,
                user: {
                    include: {
                        avatar: true
                    }
                },
                company: true,
                media: true
            }
        });

        revalidateTag(`incident:${incidentId}`);
        revalidateTag(`incidents`);

        return { success: true, data: incident };
    } catch (error) {
        console.error('Error updating incident:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred',
            data: null
        };
    }
}

export async function uploadIncidentAttachments(incidentId: number, files: File[]) {
    try {
        // Check authentication
        await requireSession();

        if (!files || files.length === 0) {
            return { success: true, data: [] };
        }

        const uploadPromises = files.map(async (file) => {
            const uploadResponse = await uploadFileToCloudinary({
                file,
                tableName: 'Incident',
                recordId: incidentId,
                fieldName: 'media',
                folder: 'obraguru/incidents'
            });

            if (!uploadResponse.success) {
                throw new Error(`Failed to upload file: ${file.name}`);
            }
            return uploadResponse.data;
        });

        const uploadedFiles = await Promise.all(uploadPromises);
        revalidateTag(`incident:${incidentId}`);
        revalidateTag(`incidents`);

        return { success: true, data: uploadedFiles };
    } catch (error) {
        console.error('Error uploading files:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred while uploading files',
            data: null
        };
    }
}

export async function removeIncidentAttachments(fileIds: number[], incidentId: number) {
    try {
        // Check authentication
        await requireSession();

        if (!fileIds || fileIds.length === 0) {
            return { success: true, data: [] };
        }

        const deletePromises = fileIds.map(async (fileId) => {
            const deleteResponse = await deleteFileFromCloudinary(fileId);

            if (!deleteResponse.success) {
                console.error(`Failed to delete file with ID: ${fileId}`);
                return { success: false, error: `Failed to delete file with ID: ${fileId}` };
            }
            return { success: true, data: { id: fileId } };
        });

        const deletedFiles = await Promise.all(deletePromises);
        revalidateTag(`incident:${incidentId}`);
        revalidateTag(`incidents`);

        return { success: true, data: deletedFiles };
    } catch (error) {
        console.error('Error removing files:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred while removing files',
            data: null
        };
    }
}

export async function updateIncidentStatus(incidentId: number, status: IncidentStatus, clientInfo?: ClientInfo) {
    try {
        // Check authentication
        const user = await requireSession();

        // Get current user with company info
        const userMeResponse = await getUserMe();
        if (!userMeResponse.success || !userMeResponse.data?.company?.id) {
            return {
                success: false,
                error: 'User not found or no company associated',
                data: null
            };
        }

        // Create approval record for audit trail if client info is provided
        if (clientInfo) {
            await prismaWithCompany.approvalAudit.create({
                incidentId: incidentId,
                action: status === 'open' || status === 'wip' || status === 'closed' ? 'approved' : 'rejected',
                description: `Status updated to ${status}`,
                date: new Date(),
                ip_address: clientInfo.ip_address,
                latitude: clientInfo.latitude,
                longitude: clientInfo.longitude,
                device_type: clientInfo.device_type,
                time_zone: clientInfo.time_zone,
                geo_location: clientInfo.geo_location,
                document_hash: `incident_${incidentId}_${Date.now()}`,
                userName: `${userMeResponse.data.firstName} ${userMeResponse.data.lastName}`.trim(),
                userId: userMeResponse.data.id
            });
        }

        const response = await updateIncident(incidentId, { incidentStatus: status });

        if (!response.success) {
            console.error(`Error updating incident status: ${response.error}`);
            return {
                success: false,
                error: `Error updating incident status: ${response.error}`,
                data: null
            };
        }

        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error updating incident status:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred',
            data: null
        };
    }
}

export async function getIncidentById(incidentId: number) {
    try {
        // Check authentication
        await requireSession();

        const incident = await prismaWithCompany.incident.findUnique({
            where: {
                id: incidentId
            },
            include: {
                project: {
                    include: {
                        company: {
                            include: {
                                owner: true
                            }
                        }
                    }
                },
                user: {
                    include: {
                        avatar: true
                    }
                },
                company: {
                    include: {
                        owner: true
                    }
                },
                media: true,
                comments: {
                    include: {
                        user: {
                            include: {
                                avatar: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                approvalAudits: {
                    include: {
                        user: {
                            include: {
                                avatar: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        if (!incident) {
            return {
                success: false,
                error: 'Incident not found',
                data: null
            };
        }

        return {
            success: true,
            data: incident
        };
    } catch (error) {
        console.error('Error fetching incident:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred while fetching incident',
            data: null
        };
    }
} 