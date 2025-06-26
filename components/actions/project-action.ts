'use server';

import { cookies } from 'next/headers';
import { uploadFile } from '@/lib/strapi';
import { fetchContentApi } from './fetch-content-api';
import { ApiResponse, Project } from '@/components/types/strapi';
import { revalidateTag } from 'next/cache';

interface ProjectData {
    name: string;
    description: string;
    address: string;
    files?: File[];
}

export async function updateProject(projectId: string, data: ProjectData) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        if (!token) {
            throw new Error('Not authenticated');
        }

        const response: ApiResponse<Project> = await fetchContentApi<Project>(`projects/${projectId}`, {
            method: 'PUT',
            body: {
                data: {
                    name: data.name,
                    description: data.description,
                    address: data.address,
                }
            },
            revalidateTag: [`project:${projectId}`, 'projects']
        });

        if (!response.success) {
            console.error(`Error updating project: ${response.error}`);
            return {
                success: false,
                error: `Error updating project: ${response.error}`,
                data: null
            };
        }

        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error updating project:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred',
            data: null
        };
    }
}

export async function uploadProjectAttachments(projectId: number, documentId: string, files: File[]) {
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
                projectId,
                'api::project.project',
                'image'
            );
            if (!uploadResponse) {
                throw new Error(`Failed to upload file: ${file.name}`);
            }
            return uploadResponse;
        });

        const uploadedFiles = await Promise.all(uploadPromises);
        revalidateTag(`project:${documentId}`);
        revalidateTag('projects');

        return { success: true, data: uploadedFiles };
    } catch (error) {
        console.error('Error uploading files:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred while uploading files'
        };
    }
}

export async function removeProjectAttachments(fileIds: number[], documentId: string) {
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
                revalidateTag: `project:${documentId}`
            });

            if (!response.success) {
                console.error(`Failed to delete file with ID: ${fileId}`);
                return { success: false, error: `Failed to delete file with ID: ${fileId}` };
            }
            return response.data;
        });

        const deletedFiles = await Promise.all(deletePromises);
        revalidateTag(`project:${documentId}`);
        revalidateTag('projects');

        return { success: true, data: deletedFiles };
    } catch (error) {
        console.error('Error removing files:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred while removing files'
        };
    }
}

export async function updateProjectUsers(projectId: number, documentId: string, users: any[]) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        if (!token) {
            throw new Error('Not authenticated');
        }

        // First, get existing project users to delete them
        const existingUsersResponse = await fetchContentApi<any[]>(`project-users?filters[project][id][$eq]=${projectId}`, {
            method: 'GET'
        });

        if (existingUsersResponse.success && existingUsersResponse.data) {
            // Delete existing project users
            for (const user of existingUsersResponse.data) {
                await fetchContentApi(`project-users/${user.id}`, {
                    method: 'DELETE',
                    revalidateTag: [`project:${documentId}`, 'projects']
                });
            }
        }

        // Then create new project users
        if (users && users.length > 0) {
            const createPromises = users.map(async (user) => {
                const response = await fetchContentApi('project-users', {
                    method: 'POST',
                    body: {
                        data: {
                            project: projectId,
                            name: user.name,
                            email: user.email,
                            phone: user.phone,
                        }
                    },
                    revalidateTag: [`project:${documentId}`, 'projects']
                });

                if (!response.success) {
                    console.error(`Failed to create project user: ${user.name}`);
                    return { success: false, error: `Failed to create project user: ${user.name}` };
                }
                return response.data;
            });

            await Promise.all(createPromises);
        }

        revalidateTag(`project:${documentId}`);
        revalidateTag('projects');

        return { success: true, data: users };
    } catch (error) {
        console.error('Error updating project users:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred while updating project users'
        };
    }
} 