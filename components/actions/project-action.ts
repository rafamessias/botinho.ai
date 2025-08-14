'use server';

import { uploadFileToCloudinary, deleteFileFromCloudinary } from './cloudinary-upload-action';
import { prisma } from '@/prisma/lib/prisma';
import { revalidateTag } from 'next/cache';
import { requireSession } from './check-session';
import { getUserMe } from './get-user-me-action';
import { getLocale } from "next-intl/server";
import resend from '@/lib/resend';
import ProjectInvitationEmail from '@/emails/ProjectInvitationEmail';
import bcrypt from 'bcryptjs';

interface ProjectData {
    name: string;
    description: string;
    address: string;
    projectStatus?: string;
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

interface CreateProjectData {
    name: string;
    description: string;
    address: string;
    projectPhoto?: File;
    users: Array<{
        name: string;
        email: string;
        phone: string;
        canApprove: boolean;
    }>;
}

async function registerUserWithConflictHandling(userData: UserRegistrationData) {
    try {

        // Split name into firstName and lastName
        const nameParts = userData.name.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // First, check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: userData.email }
        });

        if (existingUser) {
            // User already exists, return the existing user
            console.log('User already exists:', existingUser.email);
            return {
                success: true,
                data: existingUser,
                message: 'User already exists'
            };
        }

        const locale = await getLocale();
        const lang = locale === 'pt-BR' ? 'pt_BR' : 'en';

        // User doesn't exist, create new user
        // Generate a random 16-character password including punctuation, numbers, lowercase and uppercase letters
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        let pwd = '';
        for (let i = 0; i < 16; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const hashedPassword = await bcrypt.hash(pwd, 10);
        const confirmationToken = (await import('crypto')).randomBytes(32).toString('hex');

        const newUser = await prisma.user.create({
            data: {
                email: userData.email,
                password: hashedPassword,
                firstName: firstName,
                lastName: lastName,
                phone: userData.phone,
                type: "projectUser",
                language: lang,
                provider: 'local',
                confirmed: false,
                confirmationToken,
            }
        });

        if (!newUser) {
            console.error('Error creating user');
            return {
                success: false,
                error: 'Failed to create user',
                data: null
            };
        }

        // Send invitation email using Resend and ProjectInvitationEmail

        // Get base URL for links in the email
        const baseUrl = process.env.HOST;
        const fromEmail = process.env.FROM_EMAIL || "Obraguru <contact@obra.guru>";

        // Generate invitation URL (customize as needed)
        const invitationUrl = `${baseUrl}/sign-up/check-email?email=${userData.email}&token=${confirmationToken}`;

        // Prepare the email HTML using the React email template
        const emailHtml = ProjectInvitationEmail({
            userName: userData.name,
            inviterName: userData.companyName, // Optionally pass inviter's name if available
            projectName: userData.projectName, // Optionally pass project name if available
            invitationUrl,
            lang,
            baseUrl,
            password: pwd,
        });

        // Send the email
        try {
            await resend.emails.send({
                from: fromEmail,
                to: newUser.email,
                subject: locale === 'pt-BR'
                    ? 'Obraguru - Você foi convidado para um projeto!'
                    : 'Obraguru - You have been invited to a project!',
                react: emailHtml,
            });
        } catch (emailError) {
            console.error('Failed to send invitation email:', emailError);
        }

        console.log('New user created:', newUser.email);
        return {
            success: true,
            data: newUser,
            message: 'User created successfully'
        };

    } catch (error) {
        console.error('Error in registerUserWithConflictHandling:', error);
        return {
            success: false,
            error: error,
            data: null
        };
    }
}

export async function createProject(data: CreateProjectData) {
    try {
        // Check authentication
        await requireSession();

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

        // Create the project
        const newProject = await prisma.project.create({
            data: {
                name: data.name,
                description: data.description,
                address: data.address,
                projectStatus: 'active',
                companyId: companyId,
            }
        });

        if (!newProject) {
            throw new Error('Failed to create project');
        }

        // Upload project photo if exists
        if (data.projectPhoto) {
            const uploadResult = await uploadFileToCloudinary({
                file: data.projectPhoto,
                tableName: 'Project',
                recordId: newProject.id,
                fieldName: 'imageId',
                folder: 'obraguru/projects'
            });

            if (!uploadResult.success) {
                console.error('Failed to upload project photo:', uploadResult.error);
            }
        }

        // Create project users for each user
        if (data.users && data.users.length > 0) {
            for (const userData of data.users) {
                // Register user if needed
                const userRegistration = await registerUserWithConflictHandling({
                    email: userData.email,
                    name: userData.name,
                    phone: userData.phone,
                    type: 'projectUser',
                    company: userData.name, // Using name as company for now
                    projectId: newProject.id,
                    projectName: data.name
                });

                if (userRegistration.success && userRegistration.data) {
                    // Create project user record
                    await prisma.projectUser.create({
                        data: {
                            projectId: newProject.id,
                            companyId: companyId,
                            userId: userRegistration.data.id,
                            name: userData.name,
                            email: userData.email,
                            phone: userData.phone,
                            canApprove: userData.canApprove,
                            projectUserStatus: 'invited'
                        }
                    });
                }
            }
        }

        revalidateTag(`project:${newProject.id}`);
        revalidateTag('projects');

        return {
            success: true,
            data: newProject
        };

    } catch (error) {
        console.error('Failed to create project:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred',
            data: null
        };
    }
}

export async function updateProject(projectId: number, data: ProjectData) {
    try {
        await requireSession();

        const response = await prisma.project.update({
            where: { id: projectId },
            data: {
                name: data.name,
                description: data.description,
                address: data.address,
                projectStatus: data.projectStatus as any,
            }
        });

        if (!response) {
            console.error(`Error updating project: ${projectId}`);
            return {
                success: false,
                error: `Error updating project: ${projectId}`,
                data: null
            };
        }

        revalidateTag(`project:${projectId}`);
        revalidateTag('projects');

        return { success: true, data: response };
    } catch (error) {
        console.error('Error updating project:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred',
            data: null
        };
    }
}

export async function uploadProjectAttachments(projectId: number, files: File[]) {
    try {
        await requireSession();

        if (!files || files.length === 0) {
            return { success: true, data: [] };
        }

        const uploadPromises = files.map(async (file) => {
            const uploadResponse = await uploadFileToCloudinary({
                file,
                tableName: 'Project',
                recordId: projectId,
                fieldName: 'imageId',
                folder: 'obraguru/projects'
            });

            if (!uploadResponse.success) {
                throw new Error(`Failed to upload file: ${file.name}`);
            }
            return uploadResponse.data;
        });

        const uploadedFiles = await Promise.all(uploadPromises);
        revalidateTag(`project:${projectId}`);
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

export async function removeProjectAttachments(fileIds: number[], projectId: number) {
    try {
        await requireSession();

        if (!fileIds || fileIds.length === 0) {
            return { success: true, data: [] };
        }

        const deletePromises = fileIds.map(async (fileId) => {
            const file = await prisma.file.findUnique({
                where: { id: fileId }
            });

            if (!file) {
                console.error(`File with ID ${fileId} not found`);
                return { success: false, error: `File with ID ${fileId} not found` };
            }

            // Delete from Cloudinary and database
            const deleteResult = await deleteFileFromCloudinary(fileId);

            if (!deleteResult.success) {
                console.error(`Failed to delete file with ID: ${fileId}`);
                return { success: false, error: `Failed to delete file with ID: ${fileId}` };
            }
            return { success: true, data: file };
        });

        const deletedFiles = await Promise.all(deletePromises);
        revalidateTag(`project:${projectId}`);
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

export async function updateProjectUsers(projectId: number, users: any[]) {
    try {
        await requireSession();

        // Get current user's company ID
        const userMeResponse = await getUserMe();
        if (!userMeResponse.success || !userMeResponse.data?.company?.id) {
            return {
                success: false,
                error: 'User not found or no company associated',
                data: null
            };
        }

        const companyId = userMeResponse.data.company.id;

        // First, get existing project users to delete them
        const existingUsers = await prisma.projectUser.findMany({
            where: { projectId: projectId }
        });

        // Delete existing project users
        if (existingUsers.length > 0) {
            await prisma.projectUser.deleteMany({
                where: { projectId: projectId }
            });
        }

        // Then create new project users
        if (users && users.length > 0) {
            const createPromises = users.map(async (user) => {
                const response = await prisma.projectUser.create({
                    data: {
                        projectId: projectId,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        canApprove: user.canApprove,
                        projectUserStatus: 'invited',
                        companyId: companyId
                    }
                });

                if (!response) {
                    console.error(`Failed to create project user: ${user.name}`);
                    return { success: false, error: `Failed to create project user: ${user.name}` };
                }
                return response;
            });

            await Promise.all(createPromises);
        }

        revalidateTag(`project:${projectId}`);
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
        await requireSession();

        // Get current user's company ID
        const userMeResponse = await getUserMe();
        if (!userMeResponse.success || !userMeResponse.data?.company?.id) {
            return {
                success: false,
                error: 'User not found or no company associated',
                data: null
            };
        }

        const companyId = userMeResponse.data.company.id;

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

        const response = await prisma.projectUser.create({
            data: {
                projectId: projectId,
                name: user.name,
                email: user.email,
                phone: user.phone,
                userId: userData.data.id,
                canApprove: user.canApprove || false,
                projectUserStatus: 'invited',
                companyId: companyId
            }
        });

        if (!response) {
            console.error('Error creating project user');
            return {
                success: false,
                error: 'Failed to create project user',
                data: null
            };
        }

        revalidateTag(`project:users:${projectId}`);

        return { success: true, data: response };
    } catch (error) {
        console.error('Error creating project user:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred',
            data: null
        };
    }
}

export async function updateProjectUser(projectId: number, documentId: number, user: any) {
    try {
        await requireSession();

        const response = await prisma.projectUser.update({
            where: { id: documentId },
            data: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                canApprove: user.canApprove || false,
            }
        });

        if (!response) {
            console.error('Error updating project user');
            return {
                success: false,
                error: 'Failed to update project user',
                data: null
            };
        }

        revalidateTag(`project:users:${projectId}`);

        return { success: true, data: response };
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
        await requireSession();

        const response = await prisma.projectUser.delete({
            where: { id: parseInt(documentId) }
        });

        if (!response) {
            console.error('Error removing project user');
            return {
                success: false,
                error: 'Failed to remove project user'
            };
        }

        revalidateTag(`project:users:${projectId}`);

        return { success: true, data: response };
    } catch (error) {
        console.error('Error removing project user:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred'
        };
    }
} 