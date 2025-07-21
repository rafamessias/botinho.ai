'use server';

import { fetchContentApi } from './fetch-content-api';
import { RDO, Incident, Project, ApiResponse } from '../types/strapi';

export async function getPaginatedProjectRdos(projectSlug: string, page: number, pageSize: number): Promise<ApiResponse<RDO[]>> {
    try {
        const response = await fetchContentApi<RDO[]>(
            `rdos?filters[project][documentId][$eq]=${projectSlug}&populate[0]=user&populate[1]=media&sort[0]=date:desc&sort[1]=id:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
            {
                next: {
                    revalidate: 300,
                    tags: [`project:rdos:${projectSlug}`]
                }
            }
        );
        return response;
    } catch (error) {
        console.error('Error fetching paginated project RDOs:', error);
        return { success: false, data: null, meta: null, error: 'Failed to fetch RDOs' };
    }
}

export async function getPaginatedProjectIncidents(projectSlug: string, page: number, pageSize: number): Promise<ApiResponse<Incident[]>> {
    try {
        const response = await fetchContentApi<Incident[]>(
            `incidents?filters[project][documentId][$eq]=${projectSlug}&populate[0]=user&populate[1]=media&sort[0]=date:desc&sort[1]=id:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
            {
                next: {
                    revalidate: 300,
                    tags: [`project:incidents:${projectSlug}`]
                }
            }
        );
        return response;
    } catch (error) {
        console.error('Error fetching paginated project incidents:', error);
        return { success: false, data: null, meta: null, error: 'Failed to fetch incidents' };
    }
}

export async function getFilteredProjects(status: string = 'active'): Promise<ApiResponse<Project[]>> {
    try {
        let endpoint = 'projects?populate=*&sort=id:desc';

        if (status !== 'all') {
            endpoint += `&filters[active][$eq]=${status === 'active' ? true : false}`;
        }

        const response = await fetchContentApi<Project[]>(endpoint, {
            next: {
                revalidate: 300,
                tags: ['projects']
            }
        });
        return response;
    } catch (error) {
        console.error('Error fetching filtered projects:', error);
        return { success: false, data: null, meta: null, error: 'Failed to fetch projects' };
    }
}

export async function searchProjects(searchTerm: string, status: string = 'all'): Promise<ApiResponse<Project[]>> {
    try {
        let endpoint = 'projects?populate=*&sort=id:desc';

        // Add status filter if not 'all'
        if (status !== 'all') {
            endpoint += `&filters[active][$eq]=${status === 'active' ? true : false}`;
        }

        // Add search filters
        if (searchTerm.trim()) {
            endpoint += `&filters[$or][0][name][$containsi]=${encodeURIComponent(searchTerm.trim())}`;
            endpoint += `&filters[$or][1][description][$containsi]=${encodeURIComponent(searchTerm.trim())}`;
            endpoint += `&filters[$or][2][id][$eq]=${searchTerm.trim()}`;
        }

        const response = await fetchContentApi<Project[]>(endpoint, {
            next: {
                revalidate: 300,
                tags: ['projects']
            }
        });
        return response;
    } catch (error) {
        console.error('Error searching projects:', error);
        return { success: false, data: null, meta: null, error: 'Failed to search projects' };
    }
} 