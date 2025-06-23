'use server';

import { cookies } from 'next/headers';
import { uploadFile } from '@/lib/strapi';
import { fetchContentApi } from './fetch-content-api';
import { ApiResponse, Approval, Project, RDO, WeatherOption, RDOWeather } from '@/components/types/strapi';

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

export async function createRDO(data: RDOData) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        if (!token) {
            throw new Error('Not authenticated');
        }

        // Create the RDO
        const rdoResponse: ApiResponse<RDO> = await fetchContentApi<RDO>(`rdos`, {
            method: 'POST',
            body: {
                data: {
                    project: data.project.id,
                    projectDocumentId: data.project.documentId,
                    //rdoStatus: data.status,
                    date: data.date,
                    weatherMorning: [data.weather.weatherMorning],
                    weatherAfternoon: [data.weather.weatherAfternoon],
                    weatherNight: [data.weather.weatherNight],
                    description: data.description,
                    equipmentUsed: data.equipment,
                    workforce: data.labor,
                }
            }
        });

        if (!rdoResponse.data?.id) {
            console.error('Error creating RDO');
            return {
                success: false,
                error: 'Error creating RDO',
                data: null
            };
        }

        console.log(`Creating RDO ${rdoResponse.data.id} - RDO created successfully`);

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

        return { success: true, data: rdoResponse.data };
    } catch (error) {
        console.error('Error creating RDO:', error);
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
            }
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

        const response: ApiResponse<RDO> = await fetchContentApi<RDO>(`rdos/${rdoId}`, {
            method: 'PUT',
            body: {
                data: {
                    ...data
                }
            }
        });

        if (!response.data?.id) {
            console.error('Error updating RDO');
            return {
                success: false,
                error: 'Error updating RDO',
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