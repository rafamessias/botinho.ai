'use server';

import { fetchContentApi } from './fetch-content-api';
import { RDO, Incident, ApiResponse } from '../types/strapi';

export async function getPaginatedRdos(projectId: number, page: number, pageSize: number): Promise<ApiResponse<RDO[]>> {
    try {
        const response = await fetchContentApi<RDO[]>(
            `rdos?populate=*&filters[project][$eq]=${projectId}&sort=date:desc&sort=id:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
            {
                next: {
                    revalidate: 300,
                    tags: [`rdos`]
                }
            }
        );
        return response;
    } catch (error) {
        console.error('Error fetching paginated RDOs:', error);
        return { success: false, data: null, meta: null, error: 'Failed to fetch RDOs' };
    }
}

export async function getPaginatedIncidents(projectId: number, page: number, pageSize: number): Promise<ApiResponse<Incident[]>> {
    try {
        const response = await fetchContentApi<Incident[]>(
            `incidents?populate=*&filters[project][$eq]=${projectId}&sort=date:desc&sort=id:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
            {
                next: {
                    revalidate: 300,
                    tags: [`incidents`]
                }
            }
        );
        return response;
    } catch (error) {
        console.error('Error fetching paginated incidents:', error);
        return { success: false, data: null, meta: null, error: 'Failed to fetch incidents' };
    }
} 