'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/prisma/lib/prisma';
import { getUserMe } from './get-user-me-action';
import { Company, CompanyMemberDialog, User } from '@/components/types/prisma';
import { DocumentType, UserType, Language } from '@/lib/generated/prisma';
import { uploadFileToCloudinary } from './cloudinary-upload-action';
import CompanyInvitationEmail from '@/emails/CompanyInvitationEmail';
import resend from '@/lib/resend';

// Compose invitation URL (adjust as needed for your app)
const baseUrl = process.env.HOST || 'http://localhost:3000';
const fromEmail = process.env.FROM_EMAIL || 'Obraguru <obraguru@gmail.com>';

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
                documentType: data.documentType as DocumentType,
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
            },
            include: {
                company: true
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
            // Use the Cloudinary upload action
            // Import { uploadFileToCloudinary } from './cloudinary-upload-action' at the top of your file
            const uploadResponse = await uploadFileToCloudinary({
                file: logoFile as File,
                tableName: 'Company',
                recordId: companyRecord.id,
                fieldName: 'logoId',
                folder: companyRecord.id.toString()
            });

            if (!uploadResponse.success) {
                throw new Error('Failed to upload logo: ' + (uploadResponse.error || 'Unknown error'));
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

        return { success: true, data: companyWithOwner };
    } catch (error) {
        console.error('Error creating company:', error);
        return { success: false, error: error instanceof Error ? error.message : 'An error occurred', data: companyRecordCreated };
    }
}

export async function updateCompany(data: any) {
    try {
        //remove id, createdAt, updatedAt, publishedAt, logo
        const { id, createdAt, updatedAt, publishedAt, logo, ...companyData } = data;

        const company = await prisma.company.update({
            where: { id: parseInt(id) },
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

/**
 * Updates the company logo by uploading a new file to Cloudinary and updating the company record.
 * @param companyId - The ID of the company to update.
 * @param file - The new logo file (File object).
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export async function updateCompanyLogo(companyId: number, file: File) {
    try {
        // Upload the file to Cloudinary and get the file record
        const uploadResponse = await uploadFileToCloudinary({
            file,
            tableName: 'Company',
            recordId: companyId,
            fieldName: 'logoId'
        });

        if (!uploadResponse.success || !uploadResponse.data) {
            return {
                success: false,
                error: uploadResponse.error || 'Failed to upload logo'
            };
        }

        return {
            success: true,
            data: uploadResponse.data
        };
    } catch (error) {
        console.error('Error updating company logo:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred while updating company logo'
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

        const confirmationToken = (await import('crypto')).randomBytes(32).toString('hex');
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
                    confirmed: false,
                    confirmationToken: confirmationToken
                }
            });
            console.log(`Create Company Member - User ${user.user.email} created successfully`);

            // Check if user is already a member of the company
            const existingMember = await prisma.companyMember.findFirst({
                where: {
                    userId: userData.id,
                    companyId: companyId
                }
            });
            console.log(`Create Company Member - User ${user.user.email} checked if is already a member of the company`);
            if (existingMember) {
                console.log(`Create Company Member - User ${user.user.email} is already a member of the company`);
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
            console.log(`Create Company Member - User ${userData.email} created successfully`);

            // Send invitation email to the new user
            try {
                console.log(`Create Company Member - Sending invitation email to the new user`);
                const invitationUrl = `${baseUrl}/${user.language}/sign-up/check-email?email=${userData.email}&token=${confirmationToken}`;

                // Prepare email HTML using the template
                const emailHtml = CompanyInvitationEmail({
                    userName: userData.firstName,
                    inviterName: `${userData.firstName} ${userData.lastName}`,
                    companyName: user.companyName || '',
                    invitationUrl,
                    lang: user.language,
                    baseUrl,
                    password: pwd
                });

                const { data, error } = await resend.emails.send({
                    from: fromEmail,
                    to: [userData.email],
                    subject: user.language === 'pt-BR'
                        ? `Convite para entrar na empresa ${user.companyName} no Obraguru`
                        : `Invitation to join ${user.companyName} on Obraguru`,
                    react: emailHtml,
                });
                console.log(`Create Company Member - Email sent successfully to the new user`);

            } catch (emailError) {
                console.error('Failed to send company invitation email:', emailError);
                // Do not fail the main operation if email sending fails
            }

            return {
                success: true,
                data: { ...memberResponse, id: userData.id }
            };

        } catch (error: any) {
            console.error('Error creating company member:', JSON.stringify(error));
            return {
                success: false,
                error: error.code,
                data: null
            };
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
        const { id, createdAt, updatedAt, publishedAt, ...memberData } = data;

        const member = await prisma.companyMember.update({
            where: { id: parseInt(id) },
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

export async function removeCompanyMember(id: number, userId: number) {
    try {
        const member = await prisma.companyMember.delete({
            where: { id: id }
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
