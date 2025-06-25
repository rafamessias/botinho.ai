'use server';

import { cookies } from 'next/headers';
import { uploadFile } from '@/lib/strapi';
import { fetchContentApi } from './fetch-content-api';
import { ApiResponse, Approval, Project, RDO, WeatherOption, RDOWeather } from '@/components/types/strapi';
import { revalidateTag } from 'next/cache';

interface RDOData {
    project: Project;
    status: string;
    date: string;
    weather: WeatherOption;
    description: string;
    equipment: string;
    labor: string;
    files: File[];
}

// Helper function to remove id fields from weather data for Strapi v5 repeatable components
function removeWeatherIds(data: RDO): RDO {
    let cleanedData = { ...data };

    // Remove id fields from weather arrays if they exist
    if (cleanedData.weatherMorning && Array.isArray(cleanedData.weatherMorning)) {
        cleanedData.weatherMorning = cleanedData.weatherMorning.map(weather => {
            const { id, ...weatherWithoutId } = weather as any;
            return weatherWithoutId;
        });
    }

    if (cleanedData.weatherAfternoon && Array.isArray(cleanedData.weatherAfternoon)) {
        cleanedData.weatherAfternoon = cleanedData.weatherAfternoon.map(weather => {
            const { id, ...weatherWithoutId } = weather as any;
            return weatherWithoutId;
        });
    }

    if (cleanedData.weatherNight && Array.isArray(cleanedData.weatherNight)) {
        cleanedData.weatherNight = cleanedData.weatherNight.map(weather => {
            const { id, ...weatherWithoutId } = weather as any;
            return weatherWithoutId;
        });
    }

    return cleanedData;
}

export async function createRDO(data: RDOData) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        if (!token) {
            throw new Error('Not authenticated');
        }

        const weatherMorning = Array.isArray(data.weather.weatherMorning) ? data.weather.weatherMorning : [data.weather.weatherMorning];
        const weatherAfternoon = Array.isArray(data.weather.weatherAfternoon) ? data.weather.weatherAfternoon : [data.weather.weatherAfternoon];
        const weatherNight = Array.isArray(data.weather.weatherNight) ? data.weather.weatherNight : [data.weather.weatherNight];

        // Create the RDO
        const rdoResponse: ApiResponse<RDO> = await fetchContentApi<RDO>(`rdos`, {
            method: 'POST',
            body: {
                data: {
                    project: data.project.id,
                    projectDocumentId: data.project.documentId,
                    //rdoStatus: data.status,
                    date: data.date,
                    weatherMorning: weatherMorning,
                    weatherAfternoon: weatherAfternoon,
                    weatherNight: weatherNight,
                    description: data.description,
                    equipmentUsed: data.equipment,
                    workforce: data.labor,
                }
            }
        });

        if (!rdoResponse.success) {
            console.error(`Error creating RDO: ${rdoResponse.error}`);
            return {
                success: false,
                error: `Error creating RDO: ${rdoResponse.error}`,
                data: null
            };
        }

        console.log(`Creating RDO ${rdoResponse.data?.id} - RDO created successfully`);

        // Upload files if they exist
        if (data.files.length > 0) {
            const uploadPromises = data.files.map(async (file) => {
                const uploadResponse = await uploadFile(
                    file,
                    rdoResponse.data?.id || 0,
                    'api::rdo.rdo',
                    'media'
                );
                if (!uploadResponse) {
                    console.error(`Failed to upload file: ${file.name}`);
                    return { success: false, error: `Failed to upload file: ${file.name}` };
                }
                return { success: true, data: uploadResponse };
            });

            console.log(`Uploading ${data.files.length} files successfully`);
            await Promise.all(uploadPromises);
        }
        revalidateTag(`rdos`);

        return { success: true, data: rdoResponse.data };
    } catch (error) {
        console.error(`Error creating RDO: ${error}`);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred'
        };
    }
}

export async function updateRDOStatus(rdoId: string, status: 'Approved' | 'Rejected', auditData?: Approval) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        if (!token) {
            throw new Error('Not authenticated');
        }

        const response: ApiResponse<RDO> = await fetchContentApi<RDO>(`rdos/${rdoId}`, {
            method: 'PUT',
            body: {
                data: {
                    rdoStatus: status,
                    audit: {
                        ...{ ...auditData, action: status },
                        rdo: rdoId,
                        date: new Date().toISOString()
                    }
                }
            },
            revalidateTag: [`rdos:${rdoId}`, `rdos`]
        });

        if (!response.data?.id) {
            console.error(`Error updating RDO: ${response.error}`);
            return {
                success: false,
                error: `Error updating RDO: ${response.error}`,
                data: null
            };
        }

        return { success: true, data: response.data };
    } catch (error) {
        console.error(`Error ${status}ing RDO:`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred'
        };
    }
}

export async function updateRDO(rdoId: string, data: RDO) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        if (!token) {
            throw new Error('Not authenticated');
        }

        // Remove id fields from weather data for Strapi v5 repeatable components
        const cleanedData = removeWeatherIds(data);

        const response: ApiResponse<RDO> = await fetchContentApi<RDO>(`rdos/${rdoId}`, {
            method: 'PUT',
            body: {
                data: {
                    ...cleanedData
                }
            },
            revalidateTag: [`rdos:${rdoId}`, `rdos`]
        });

        if (!response.success) {
            console.error(`Error updating RDO: ${response.error}`);
            return {
                success: false,
                error: `Error updating RDO: ${response.error}`,
                data: null
            };
        }

        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error updating RDO:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred'
        };
    }
}

export async function uploadRdoAttachments(rdoId: number, documentId: string, files: File[]) {
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
                rdoId,
                'api::rdo.rdo',
                'media'
            );
            if (!uploadResponse) {
                throw new Error(`Failed to upload file: ${file.name}`);
            }
            return uploadResponse;
        });

        const uploadedFiles = await Promise.all(uploadPromises);
        revalidateTag(`rdos:${documentId}`);
        revalidateTag(`rdos`);

        return { success: true, data: uploadedFiles };
    } catch (error) {
        console.error('Error uploading files:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred while uploading files'
        };
    }
}

export async function removeRdoAttachments(fileIds: number[], documentId: string) {
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
                revalidateTag: `rdos:${documentId}`
            });

            if (!response.success) {
                console.error(`Failed to delete file with ID: ${fileId}`);
                return { success: false, error: `Failed to delete file with ID: ${fileId}` };
            }
            return response.data;
        });

        const deletedFiles = await Promise.all(deletePromises);
        revalidateTag(`rdos:${documentId}`);
        revalidateTag(`rdos`);

        return { success: true, data: deletedFiles };
    } catch (error) {
        console.error('Error removing files:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred while removing files'
        };
    }
}
