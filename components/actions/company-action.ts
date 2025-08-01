'use server';

import { cookies } from 'next/headers';
import { uploadFile } from '@/lib/strapi';
import { prisma } from '@/prisma/lib/prisma';
import { getUserMe } from './get-user-me-action';
import { ApiResponse, Company, CompanyMember, CompanyMemberDialog, User } from '@/components/types/prisma';
import { DocumentType, UserType, Language } from '@/lib/generated/prisma';
import bcrypt from 'bcryptjs';

const COMPANY_USER_ROLE = 3;

export async function createCompany(data: Company, members: CompanyMemberDialog[], image: FormData) {

    let companyRecordCreated: Company | null = null;

    try {


        const userMeResponse = await getUserMe();
        if (!userMeResponse.success) {
            return { success: false, error: 'Failed to get current user' };
        }

        const currentUser: User = userMeResponse.data;

        // Create the company
        const companyRecord = await prisma.company.create({
            data: {
                name: data.name,
                documentType: data.documentType.toUpperCase() as DocumentType,
                document: data.document,
                zipCode: data.zipCode,
                state: data.state,
                city: data.city,
                address: data.address,
                ownerId: currentUser.id!
            }
        });

        if (!companyRecord?.id) {
            throw new Error('Failed to create company');
        }

        // Transform to match the Company interface
        const companyWithOwner: Company = {
            ...companyRecord,
            owner: currentUser.id!
        };

        console.log(`Creating Company ${companyRecord.id} - Company created successfully`);

        // Update the current user with the company relationship
        const updatedUser = await prisma.user.update({
            where: { id: currentUser.id! },
            data: {
                companyId: companyRecord.id
            }
        });

        if (!updatedUser?.id) {
            throw new Error('Failed to update current user with company');
        }

        console.log(`Creating Company ${companyRecord.id} - Current user updated successfully`);

        // Add current user as company member - Admin role
        const memberRecord = await prisma.companyMember.create({
            data: {
                companyId: companyRecord.id,
                userId: currentUser.id!,
                isAdmin: true,
                canPost: true,
                canApprove: true,
                isOwner: true,
                companyMemberStatus: 'accepted'
            }
        });

        if (!memberRecord) {
            throw new Error('Failed to add current user as company member');
        }

        //save here, if it fails - catch will return the companyRecordCreated
        companyRecordCreated = companyWithOwner;

        console.log(`Creating Company ${companyRecord.id} - Current user added as company member Admin successfully`);

        // First, upload the company logo if it exists
        const logoFile = image.get('logo');
        if (logoFile) {
            const uploadResponse = await uploadFile(logoFile as File, companyRecord.id, 'api::company.company', 'logo');
            if (!uploadResponse) {
                throw new Error('Failed to upload logo');
            }

            console.log(`Creating Company ${companyRecord.id} - Logo uploaded successfully`);
        }

        // Add users as company members
        if (members.length > 0) {
            const memberPromises = members.map(async (user) => {
                // First, create or get the user
                const pwd = Math.random().toString(36).slice(-8); // Generate random password
                const hashedPassword = await bcrypt.hash(pwd, 10);

                try {
                    const userData = await prisma.user.create({
                        data: {
                            email: user.email,
                            password: hashedPassword,
                            firstName: user.name.split(' ')[0],
                            lastName: user.name.split(' ').slice(1).join(' '),
                            phone: user.phone,
                            companyId: companyRecord.id,
                            type: 'companyUser' as UserType,
                            language: 'pt_BR' as Language,
                            confirmed: true
                        }
                    });

                    // Then, add the user as a company member
                    const memberResponse = await prisma.companyMember.create({
                        data: {
                            companyId: companyRecord.id,
                            userId: userData.id,
                            isAdmin: user.isAdmin,
                            canPost: user.canPost,
                            canApprove: user.canApprove,
                            isOwner: false,
                            companyMemberStatus: 'accepted'
                        }
                    });

                    console.log(`Creating Company ${companyRecord.id} - Member ${user.email} added successfully`);
                    return { success: true, data: memberResponse };

                } catch (error: any) {
                    // Check if the error is due to email/username already taken
                    if (error.code === 'P2002' && (error.meta?.target?.includes('email') || error.meta?.target?.includes('username'))) {
                        // Try to get the existing user by email
                        const existingUser = await prisma.user.findUnique({
                            where: { email: user.email }
                        });

                        if (existingUser) {
                            // Then, add the user as a company member
                            const memberResponse = await prisma.companyMember.create({
                                data: {
                                    companyId: companyRecord.id,
                                    userId: existingUser.id,
                                    isAdmin: user.isAdmin,
                                    canPost: user.canPost,
                                    canApprove: user.canApprove,
                                    isOwner: false,
                                    companyMemberStatus: 'accepted'
                                }
                            });

                            console.log(`Creating Company ${companyRecord.id} - Member ${user.email} added successfully`);
                            return { success: true, data: memberResponse };
                        } else {
                            console.error(`Failed to create user: ${user.email} - ${error.message}`);
                            return { success: false, error: `Failed to create user: ${error.message}` };
                        }
                    } else {
                        console.error(`Failed to create user: ${user.email} - ${error.message}`);
                        return { success: false, error: `Failed to create user: ${error.message}` };
                    }
                }
            });

            await Promise.all(memberPromises);
        }

        return { success: true, data: companyRecord };
    } catch (error) {
        console.error('Error creating company:', error);
        return { success: false, error: error instanceof Error ? error.message : 'An error occurred', data: companyRecordCreated };
    }
}

export async function updateCompany(data: any) {
    try {
        //remove documentId, id, createdAt, updatedAt, publishedAt, logo
        const { documentId, id, createdAt, updatedAt, publishedAt, logo, ...companyData } = data;

        const company = await prisma.company.update({
            where: { id: parseInt(documentId) },
            data: companyData
        });

        if (!company) {
            throw new Error('Failed to update company');
        }

        return {
            success: true,
            data: company
        };
    } catch (error) {
        console.error('Error updating company:', error);
        return {
            success: false,
            error: 'Failed to update company'
        };
    }
}

export async function createCompanyMember(user: any) {
    try {
        const userMeResponse = await getUserMe();
        if (!userMeResponse.success) {
            throw new Error('Failed to get current user');
        }

        const currentUser: User = userMeResponse.data;

        if (!currentUser.company) {
            console.error('Current user does not have a company');
            return { success: false, error: 'Current user does not have a company' };
        }

        const companyId = typeof currentUser.company === 'number' ? currentUser.company : currentUser.company.id;
        if (!companyId) {
            console.error('Invalid company ID');
            return { success: false, error: 'Invalid company ID' };
        }

        // First, create or get the user
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        let pwd = '';
        for (let i = 0; i < 16; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const hashedPassword = await bcrypt.hash(pwd, 10);

        try {
            const userData = await prisma.user.create({
                data: {
                    email: user.user.email,
                    password: hashedPassword,
                    firstName: user.user.firstName,
                    lastName: user.user.lastName,
                    phone: user.user.phone,
                    companyId: companyId,
                    type: 'companyUser' as UserType,
                    language: user.language === 'pt-BR' ? 'pt_BR' : 'en' as Language,
                    confirmed: true
                }
            });

            // Check if user is already a member of the company
            const existingMember = await prisma.companyMember.findFirst({
                where: {
                    userId: userData.id,
                    companyId: companyId
                }
            });

            if (existingMember) {
                console.log(`User ${user.user.email} is already a member of the company`);
                return {
                    success: false,
                    error: 'User is already a member of this company',
                    data: existingMember
                };
            }

            const memberResponse = await prisma.companyMember.create({
                data: {
                    companyId: companyId,
                    userId: userData.id,
                    isAdmin: user.isAdmin,
                    canPost: user.canPost,
                    canApprove: user.canApprove,
                    isOwner: false,
                    companyMemberStatus: 'accepted'
                }
            });

            return {
                success: true,
                data: { ...memberResponse, id: userData.id }
            };

        } catch (error: any) {
            // Check if the error is due to email/username already taken
            if (error.code === 'P2002' && (error.meta?.target?.includes('email') || error.meta?.target?.includes('username'))) {
                // Try to get the existing user by email
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.user.email }
                });

                if (existingUser) {
                    // Check if user is already a member of the company
                    const existingMember = await prisma.companyMember.findFirst({
                        where: {
                            userId: existingUser.id,
                            companyId: companyId
                        }
                    });

                    if (existingMember) {
                        console.log(`User ${user.user.email} is already a member of the company`);
                        return {
                            success: false,
                            error: 'User is already a member of this company',
                            data: existingMember
                        };
                    }

                    const memberResponse = await prisma.companyMember.create({
                        data: {
                            companyId: companyId,
                            userId: existingUser.id,
                            isAdmin: user.isAdmin,
                            canPost: user.canPost,
                            canApprove: user.canApprove,
                            isOwner: false,
                            companyMemberStatus: 'accepted'
                        }
                    });

                    return {
                        success: true,
                        data: { ...memberResponse, id: existingUser.id }
                    };
                } else {
                    console.error(`Failed to create user: ${user.user.email} - ${error.message}`);
                    return { success: false, error: `Failed to create user: ${error.message}` };
                }
            } else {
                console.error(`Failed to create user: ${user.user.email} - ${error.message}`);
                return { success: false, error: `Failed to create user: ${error.message}` };
            }
        }
    } catch (error) {
        console.error('Error creating company member:', error);
        return {
            success: false,
            error: 'Failed to create company member'
        };
    }
}

export async function updateCompanyMember(data: any) {
    try {
        const { documentId, id, createdAt, updatedAt, publishedAt, ...memberData } = data;

        const member = await prisma.companyMember.update({
            where: { id: parseInt(documentId) },
            data: {
                isAdmin: memberData.isAdmin,
                canPost: memberData.canPost,
                canApprove: memberData.canApprove
            }
        });

        if (!member) {
            console.error(`Failed to update company member`);
            return {
                success: false,
                error: `Failed to update company member`
            };
        }

        return {
            success: true,
            data: member
        };
    } catch (error) {
        console.error('Error updating company member:', error);
        return {
            success: false,
            error: 'Failed to update company member'
        };
    }
}

export async function removeCompanyMember(documentId: string, userId: number) {
    try {
        const member = await prisma.companyMember.delete({
            where: { id: parseInt(documentId) }
        });

        if (!member) {
            console.error(`Failed to remove company member`);
            return {
                success: false,
                error: `Failed to remove company member`
            };
        }

        console.log(`Removing company member - ${member.id}`);

        // Note: We're not deleting the user as requested in the original code
        // The user deletion was commented out in the original implementation

        return {
            success: true,
            data: member
        };
    } catch (error) {
        console.error('Error removing company member:', error);
        return {
            success: false,
            error: 'Failed to remove company member'
        };
    }
}
