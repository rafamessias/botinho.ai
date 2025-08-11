'use server';

import { prisma } from '@/prisma/lib/prisma';
import { uploadFileToCloudinary, deleteFileFromCloudinary } from './cloudinary-upload-action';
import { requireSession } from './check-session';
import { revalidateTag } from 'next/cache';

export interface UpdateProfileData {
    firstName: string;
    lastName: string;
    phone: string;
    language: 'en' | 'pt-BR';
    avatar?: File | null;
}

export interface UpdateProfileResult {
    success: boolean;
    data?: any;
    error?: string;
}

export async function deleteProfileAction() {
    try {
        // Check authentication
        const user = await requireSession();

        if (!user?.email) {
            return {
                success: false,
                error: 'No authenticated user found'
            };
        }

        // Find the current user with all relations
        const currentUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: {
                avatar: true,
                companyMembers: true,
                projectUsers: true,
                ownedCompanies: true
            }
        });

        if (!currentUser) {
            return {
                success: false,
                error: 'User not found'
            };
        }

        // Check if user is a company owner
        if (currentUser.ownedCompanies.length > 0) {
            return {
                success: false,
                error: 'Company owners cannot delete their profile'
            };
        }

        // Delete avatar from Cloudinary if exists
        if (currentUser.avatar) {
            await deleteFileFromCloudinary(currentUser.avatar.id);
        }

        // Delete user and all related data (cascade will handle relations)
        await prisma.user.delete({
            where: { id: currentUser.id }
        });

        // Revalidate cache
        revalidateTag('me');

        return {
            success: true,
            message: 'Profile deleted successfully'
        };
    } catch (error) {
        console.error('Error deleting profile:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete profile'
        };
    }
}

export async function updateProfileAction(data: UpdateProfileData): Promise<UpdateProfileResult> {
    try {
        // Check authentication
        const user = await requireSession();

        if (!user?.email) {
            return {
                success: false,
                error: 'No authenticated user found'
            };
        }

        // Find the current user
        const currentUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { avatar: true }
        });

        if (!currentUser) {
            return {
                success: false,
                error: 'User not found'
            };
        }

        // Prepare update data
        const updateData: any = {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            language: data.language === 'pt-BR' ? 'pt_BR' : 'en',
        };

        // Handle avatar upload if provided
        if (data.avatar && data.avatar instanceof File) {
            // Delete old avatar if exists
            if (currentUser.avatar) {
                await deleteFileFromCloudinary(currentUser.avatar.id);
            }

            // Upload new avatar
            const uploadResult = await uploadFileToCloudinary({
                file: data.avatar,
                tableName: 'User',
                recordId: currentUser.id,
                fieldName: 'avatarId',
                folder: 'obraguru/avatars'
            });

            if (uploadResult.success && uploadResult.data) {
                updateData.avatarId = uploadResult.data.id;
            } else {
                console.error('Failed to upload avatar:', uploadResult.error);
                // Continue with profile update even if avatar upload fails
            }
        }

        // Update user profile
        const updatedUser = await prisma.user.update({
            where: { id: currentUser.id },
            data: updateData,
            include: {
                avatar: true,
                company: true,
                companyMembers: {
                    include: {
                        company: true
                    }
                },
                projectUsers: {
                    include: {
                        project: true,
                        company: true
                    }
                }
            }
        });

        // Transform the data to match the expected format
        const userData = {
            id: updatedUser.id,
            email: updatedUser.email,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            phone: updatedUser.phone,
            type: updatedUser.type,
            language: updatedUser.language === "pt_BR" ? "pt-BR" : "en",
            avatar: updatedUser.avatar,
            company: updatedUser.company,
        };

        // Revalidate cache
        revalidateTag('me');

        console.log(userData);

        return {
            success: true,
            data: userData
        };

    } catch (error) {
        console.error('Error updating profile:', error);
        return {
            success: false,
            error: 'Failed to update profile'
        };
    }
} 