'use server';

import { cookies } from 'next/headers';
import { uploadFile } from '@/lib/strapi';
import { fetchContentApi } from './fetch-content-api';
import { ApiResponse, Project, Incident } from '@/components/types/strapi';
import { revalidateTag } from 'next/cache';

export async function createIncident(data: Incident) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        if (!token) {
            throw new Error('Not authenticated');
        }

        const project = data.project as Project;

        // Create the incident
        const incidentResponse: ApiResponse<Incident> = await fetchContentApi<Incident>(`incidents`, {
            method: 'POST',
            body: {
                data: {
                    project: project.id,
                    projectDocumentId: project.documentId,
                    date: data.date,
                    incidentStatus: data.incidentStatus,
                    description: data.description,
                }
            },
            revalidateTag: [`project:${project.documentId}`, `incidents`]
        });

        if (!incidentResponse.success) {
            console.error(`Error creating incident: ${incidentResponse.error}`);
            return {
                success: false,
                error: `Error creating incident: ${incidentResponse.error}`,
                data: null
            };
        }

        console.log(`Creating incident ${incidentResponse.data?.id} - Incident created successfully`);

        // Upload files if they exist
        if (data.media) {
            const files = Array.isArray(data.media) ? data.media : [data.media];
            const uploadPromises = files.map(async (file) => {
                const uploadResponse = await uploadFile(
                    file as File,
                    incidentResponse.data?.id || 0,
                    'api::incident.incident',
                    'media'
                );
                if (!uploadResponse) {
                    console.error(`Failed to upload file: ${file.name}`);
                    return { success: false, error: `Failed to upload file: ${file.name}` };
                }
                return { success: true, data: uploadResponse };
            });

            console.log(`Uploading ${files.length} files successfully`);
            await Promise.all(uploadPromises);
        }

        revalidateTag(`incidents`);
        revalidateTag(`project:${project.documentId}`);

        return { success: true, data: incidentResponse.data };
    } catch (error) {
        console.error(`Error creating incident: ${error}`);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred',
            data: null
        };
    }
}

export async function updateIncident(incidentId: string, data: Partial<Incident>) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        if (!token) {
            throw new Error('Not authenticated');
        }

        const response: ApiResponse<Incident> = await fetchContentApi<Incident>(`incidents/${incidentId}`, {
            method: 'PUT',
            body: {
                data: {
                    ...data
                }
            },
            revalidateTag: [`incident:${incidentId}`, `incidents`]
        });

        if (!response.success) {
            console.error(`Error updating incident: ${response.error}`);
            return {
                success: false,
                error: `Error updating incident: ${response.error}`,
                data: null
            };
        }

        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error updating incident:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred',
            data: null
        };
    }
}

export async function uploadIncidentAttachments(incidentId: number, documentId: string, files: File[]) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        if (!token) {
            throw new Error('Not authenticated');
        }

        if (!files || files.length === 0) {
            return { success: true, data: [] };
        }

        const uploadPromises = files.map(async (file) => {
            const uploadResponse = await uploadFile(
                file,
                incidentId,
                'api::incident.incident',
                'media'
            );
            if (!uploadResponse) {
                throw new Error(`Failed to upload file: ${file.name}`);
            }
            return uploadResponse;
        });

        const uploadedFiles = await Promise.all(uploadPromises);
        revalidateTag(`incident:${documentId}`);
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

export async function removeIncidentAttachments(fileIds: number[], documentId: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        if (!token) {
            throw new Error('Not authenticated');
        }

        if (!fileIds || fileIds.length === 0) {
            return { success: true, data: [] };
        }

        const deletePromises = fileIds.map(async (fileId) => {
            const response = await fetchContentApi<any>(`upload/files/${fileId}`, {
                method: 'DELETE',
                revalidateTag: `incident:${documentId}`
            });

            if (!response.success) {
                console.error(`Failed to delete file with ID: ${fileId}`);
                return { success: false, error: `Failed to delete file with ID: ${fileId}` };
            }
            return response.data;
        });

        const deletedFiles = await Promise.all(deletePromises);
        revalidateTag(`incident:${documentId}`);
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

export async function updateIncidentStatus(documentId: string, status: 'draft' | 'open' | 'wip' | 'closed', clientInfo?: any) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        if (!token) {
            throw new Error('Not authenticated');
        }

        // Create approval record for audit trail
        if (clientInfo) {
            await fetchContentApi<any>(`approvals`, {
                method: 'POST',
                body: {
                    data: {
                        incident: documentId,
                        action: status,
                        description: `Status updated to ${status}`,
                        ip_address: clientInfo.ip_address,
                        latitude: clientInfo.latitude,
                        longitude: clientInfo.longitude,
                        device_type: clientInfo.device_type,
                        time_zone: clientInfo.time_zone,
                        geo_location: clientInfo.geo_location,
                    }
                }
            });
        }

        const response = await updateIncident(documentId, { incidentStatus: status });

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