'use server';

import { cookies } from 'next/headers';
import { uploadFile } from '@/lib/strapi';
import { fetchContentApi } from './fetch-content-api';
import { ApiResponse, Project, User } from '@/components/types/strapi';
import { revalidateTag } from 'next/cache';

interface ProjectData {
    name: string;
    description: string;
    address: string;
    files?: File[];
}

interface UserRegistrationData {
    email: string;
    name: string;
    phone: string;
    type: string;
    company: string;
    projectId?: number;
    projectName?: string;
    companyName?: string;
}

const PROJECT_USER_ROLE = 4;
const COMPANY_USER_ROLE = 3;

async function registerUserWithConflictHandling(userData: UserRegistrationData) {
    try {

        // Split name into firstName and lastName
        const nameParts = userData.name.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // First, check if user already exists
        const existingUserResponse = await fetchContentApi<User[]>(`users?filters[email][$eq]=${userData.email}`, {
            method: 'GET'
        });

        if (existingUserResponse.success && existingUserResponse.data && existingUserResponse.data.length > 0) {
            // User already exists, return the existing user
            const existingUser = existingUserResponse.data[0];
            console.log('User already exists:', existingUser.email);
            return {
                success: true,
                data: existingUser,
                message: 'User already exists'
            };
        }

        // User doesn't exist, create new user
        // Generate a random 16-character password including punctuation, numbers, lowercase and uppercase letters
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        let pwd = '';
        for (let i = 0; i < 16; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const newUserResponse: any = await fetchContentApi<User>(`auth/local/register`, {
            method: 'POST',
            body: {
                username: userData.email,
                email: userData.email,
                password: pwd,
                firstName: userData.name.split(' ')[0],
                lastName: userData.name.split(' ').slice(1).join(' '),
                phone: userData.phone,
                company: userData.company,
                type: userData.type,
                ...(userData?.projectId && {
                    projectId: userData?.projectId,
                    projectName: userData?.projectName,
                    role: PROJECT_USER_ROLE
                }),
                ...(userData?.companyName && {
                    companyName: userData?.companyName,
                    role: COMPANY_USER_ROLE
                })
            }
        });

        if (!newUserResponse.success || !newUserResponse.data) {
            console.error('Error creating user:', newUserResponse.error);
            return {
                success: false,
                error: newUserResponse.error || 'Failed to create user',
                data: null
            };
        }

        const user = newUserResponse.data.user;

        console.log('New user created:', user.email);
        return {
            success: true,
            data: user,
            message: 'User created successfully'
        };

    } catch (error) {
        console.error('Error in registerUserWithConflictHandling:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred',
            data: null
        };
    }
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
                            canApprove: user.canApprove,
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

export async function createProjectUser(projectId: number, projectName: string, user: any) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        if (!token) {
            throw new Error('Not authenticated');
        }

        const userData: any = await registerUserWithConflictHandling({
            email: user.email,
            name: user.name,
            phone: user.phone,
            type: 'projectUser',
            company: user.company,
            projectId: projectId,
            projectName: projectName
        });

        if (!userData.success) {
            return {
                success: false,
                error: userData.error || 'Failed to create project user',
                data: null
            };
        }

        const response = await fetchContentApi('project-users', {
            method: 'POST',
            body: {
                data: {
                    project: projectId,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    user: userData.data.id,
                    canApprove: user.canApprove || false,
                }
            },
            revalidateTag: [`project:users:${projectId}`]
        });

        if (!response.success || !response.data) {
            console.error('Error creating project user:', response.error);
            return {
                success: false,
                error: response.error || 'Failed to create project user',
                data: null
            };
        }

        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error creating project user:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred',
            data: null
        };
    }
}

export async function updateProjectUser(projectId: number, documentId: string, user: any) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await fetchContentApi(`project-users/${documentId}`, {
            method: 'PUT',
            body: {
                data: {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    canApprove: user.canApprove || false,
                }
            },
            revalidateTag: [`project:users:${projectId}`]
        });

        if (!response.success || !response.data) {
            console.error('Error updating project user:', response.error);
            return {
                success: false,
                error: response.error || 'Failed to update project user',
                data: null
            };
        }

        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error updating project user:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred',
            data: null
        };
    }
}

export async function removeProjectUser(projectId: number, documentId: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await fetchContentApi(`project-users/${documentId}`, {
            method: 'DELETE',
            revalidateTag: [`project:users:${projectId}`]
        });

        if (!response.success) {
            console.error('Error removing project user:', response.error);
            return {
                success: false,
                error: response.error || 'Failed to remove project user'
            };
        }

        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error removing project user:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred'
        };
    }
} 