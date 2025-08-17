'use server';

import { prisma } from '@/prisma/lib/prisma';
import { prismaWithCompany } from './prisma-with-company';
import { RDO, Project, ApiResponse } from '@/components/types/prisma';
import { WeatherCondition, RDOStatus, Action } from '@/lib/generated/prisma';
import { uploadMultipleFilesToCloudinary, deleteFileFromCloudinary } from './cloudinary-upload-action';
import { requireSession } from './check-session';
import { getUserMe } from './get-user-me-action';

interface RDOData {
    project: Project;
    status: string;
    date: string;
    weather: {
        weatherMorning: { condition: WeatherCondition | null, workable: boolean | null };
        weatherAfternoon: { condition: WeatherCondition | null, workable: boolean | null };
        weatherNight: { condition: WeatherCondition | null, workable: boolean | null };
    };
    description: string;
    equipment: string;
    labor: string;
    files: File[];
}

export async function createRDO(data: RDOData): Promise<ApiResponse<RDO>> {
    try {
        // Check authentication
        await requireSession();

        // Get current user
        const userMeResponse = await getUserMe();
        if (!userMeResponse.success || !userMeResponse.data?.id) {
            return {
                success: false,
                error: 'User not authenticated',
                data: null
            };
        }

        const userId = userMeResponse.data.id;
        const companyId = userMeResponse.data.company?.id;

        if (!companyId) {
            return {
                success: false,
                error: 'User not associated with a company',
                data: null
            };
        }

        // Create the RDO
        const rdoData = {
            date: new Date(data.date),
            rdoStatus: data.status as RDOStatus,
            description: data.description,
            equipmentUsed: data.equipment,
            workforce: data.labor,
            createdBy: userMeResponse.data.firstName || 'Unknown',
            weatherMorningCondition: data.weather.weatherMorning.condition,
            weatherMorningWorkable: data.weather.weatherMorning.workable,
            weatherAfternoonCondition: data.weather.weatherAfternoon.condition,
            weatherAfternoonWorkable: data.weather.weatherAfternoon.workable,
            weatherNightCondition: data.weather.weatherNight.condition,
            weatherNightWorkable: data.weather.weatherNight.workable,
            companyId: companyId,
            userId: userId,
            projectId: data.project.id!
        };

        const newRDO = await prismaWithCompany.rdo.create({
            date: new Date(data.date),
            rdoStatus: data.status as RDOStatus,
            description: data.description,
            equipmentUsed: data.equipment,
            workforce: data.labor,
            createdBy: userMeResponse.data.firstName || 'Unknown',
            weatherMorningCondition: data.weather.weatherMorning.condition,
            weatherMorningWorkable: data.weather.weatherMorning.workable,
            weatherAfternoonCondition: data.weather.weatherAfternoon.condition,
            weatherAfternoonWorkable: data.weather.weatherAfternoon.workable,
            weatherNightCondition: data.weather.weatherNight.condition,
            weatherNightWorkable: data.weather.weatherNight.workable,
            userId: userId,
            projectId: data.project.id!
        });

        if (!newRDO) {
            return {
                success: false,
                error: 'Failed to create RDO',
                data: null
            };
        }

        console.log(`Creating RDO ${newRDO.id} - RDO created successfully`);

        // Upload files if they exist
        if (data.files.length > 0) {
            const uploadResults = await uploadMultipleFilesToCloudinary(
                data.files,
                'RDO',
                newRDO.id,
                'media',
                'obraguru/rdo-media'
            );

            // Check for upload failures
            const failedUploads = uploadResults.filter(result => !result.success);
            if (failedUploads.length > 0) {
                console.error('Some files failed to upload:', failedUploads);
            }

            console.log(`Uploading ${data.files.length} files successfully`);
        }

        // Update project RDO count
        await prisma.project.update({
            where: { id: data.project.id! },
            data: {
                rdoCount: {
                    increment: 1
                },
                rdoCountDraft: {
                    increment: data.status === 'draft' ? 1 : 0
                }
            }
        });

        return {
            success: true,
            data: newRDO as unknown as RDO
        };
    } catch (error) {
        console.error(`Error creating RDO: ${error}`);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred',
            data: null
        };
    }
}

export async function updateRDOStatus(rdoId: number, status: RDOStatus, auditData?: any): Promise<ApiResponse<RDO>> {
    try {
        await requireSession();

        const userMeResponse = await getUserMe();
        if (!userMeResponse.success || !userMeResponse.data?.id) {
            return {
                success: false,
                error: 'User not authenticated',
                data: null
            };
        }

        const userId = userMeResponse.data.id;

        // Update RDO status
        const updatedRDO = await prisma.rDO.update({
            where: { id: rdoId },
            data: {
                rdoStatus: status
            },
            include: {
                user: {
                    include: {
                        avatar: true
                    }
                },
                project: {
                    include: {
                        company: true
                    }
                },
                company: true,
                media: true
            }
        });

        if (!updatedRDO) {
            return {
                success: false,
                error: 'Failed to update RDO status',
                data: null
            };
        }

        // Create approval audit record
        if (auditData) {
            await prismaWithCompany.approvalAudit.create({
                action: status === 'approved' || status === 'pendingApproval' ? Action.approved : Action.rejected,
                description: auditData.description,
                date: new Date(),
                ip_address: auditData.ip_address,
                latitude: auditData.latitude,
                longitude: auditData.longitude,
                device_type: auditData.device_type,
                time_zone: auditData.time_zone,
                geo_location: auditData.geo_location,
                document_hash: auditData.document_hash || '',
                userName: userMeResponse.data.firstName + ' ' + userMeResponse.data.lastName || 'Unknown',
                projectId: updatedRDO.projectId,
                rdoId: rdoId,
                userId: userId
            });
        }

        return {
            success: true,
            data: updatedRDO as unknown as RDO
        };
    } catch (error) {
        console.error(`Error updating RDO status:`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred',
            data: null
        };
    }
}

export async function updateRDO(rdoId: number, data: {
    description?: string;
    equipmentUsed?: string;
    workforce?: string;
    rdoStatus?: RDOStatus;
    weatherMorningCondition?: WeatherCondition | null;
    weatherMorningWorkable?: boolean | null;
    weatherAfternoonCondition?: WeatherCondition | null;
    weatherAfternoonWorkable?: boolean | null;
    weatherNightCondition?: WeatherCondition | null;
    weatherNightWorkable?: boolean | null;
    date?: Date;
}): Promise<ApiResponse<RDO>> {
    try {
        await requireSession();

        const updatedRDO = await prisma.rDO.update({
            where: { id: rdoId },
            data: {
                date: data.date ? new Date(data.date) : undefined,
                description: data.description,
                equipmentUsed: data.equipmentUsed,
                workforce: data.workforce,
                rdoStatus: data.rdoStatus,
                weatherMorningCondition: data.weatherMorningCondition,
                weatherMorningWorkable: data.weatherMorningWorkable,
                weatherAfternoonCondition: data.weatherAfternoonCondition,
                weatherAfternoonWorkable: data.weatherAfternoonWorkable,
                weatherNightCondition: data.weatherNightCondition,
                weatherNightWorkable: data.weatherNightWorkable
            },
            include: {
                user: {
                    include: {
                        avatar: true
                    }
                },
                project: {
                    include: {
                        company: true
                    }
                },
                company: true,
                media: true
            }
        });

        if (!updatedRDO) {
            return {
                success: false,
                error: 'Failed to update RDO',
                data: null
            };
        }

        return {
            success: true,
            data: updatedRDO as unknown as RDO
        };
    } catch (error) {
        console.error('Error updating RDO:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred',
            data: null
        };
    }
}

export async function uploadRdoAttachments(rdoId: number, files: File[]): Promise<ApiResponse<any[]>> {
    try {
        await requireSession();

        if (!files || files.length === 0) {
            return { success: true, data: [] };
        }

        const uploadResults = await uploadMultipleFilesToCloudinary(
            files,
            'RDO',
            rdoId,
            'media',
            'obraguru/rdo-media'
        );

        const successfulUploads = uploadResults.filter(result => result.success);
        const failedUploads = uploadResults.filter(result => !result.success);

        if (failedUploads.length > 0) {
            console.error('Some files failed to upload:', failedUploads);
        }

        return {
            success: true,
            data: successfulUploads.map(result => result.data)
        };
    } catch (error) {
        console.error('Error uploading files:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred while uploading files',
            data: null
        };
    }
}

export async function removeRdoAttachments(fileIds: number[]): Promise<ApiResponse<any[]>> {
    try {
        await requireSession();

        if (!fileIds || fileIds.length === 0) {
            return { success: true, data: [] };
        }

        const deletePromises = fileIds.map(async (fileId) => {
            const result = await deleteFileFromCloudinary(fileId);
            if (!result.success) {
                console.error(`Failed to delete file with ID: ${fileId}`);
                return { success: false, error: `Failed to delete file with ID: ${fileId}` };
            }
            return { success: true, fileId };
        });

        const deletedFiles = await Promise.all(deletePromises);
        const successfulDeletes = deletedFiles.filter((result: any) => result.success);

        return {
            success: true,
            data: successfulDeletes.map(result => result.fileId)
        };
    } catch (error) {
        console.error('Error removing files:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred while removing files',
            data: null
        };
    }
}

export async function getRDOById(rdoId: number): Promise<ApiResponse<RDO>> {
    try {
        await requireSession();

        const rdo = await prismaWithCompany.rdo.findUnique({
            where: { id: rdoId },
            include: {
                user: {
                    include: {
                        avatar: true
                    }
                },
                project: {
                    include: {
                        company: true
                    }
                },
                company: true,
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
                        user: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        if (!rdo) {
            return {
                success: false,
                error: 'RDO not found',
                data: null
            };
        }

        return {
            success: true,
            data: rdo as unknown as RDO
        };
    } catch (error) {
        console.error('Error fetching RDO:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred while fetching RDO',
            data: null
        };
    }
}
