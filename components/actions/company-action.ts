'use server';

import { cookies } from 'next/headers';
import { uploadFile } from '@/lib/strapi';
import { fetchContentApi } from './fetch-content-api';
import { getUserMeLoader } from '../services/get-user-me-loader';
import { ApiResponse, Company, CompanyMember, CompanyMemberDialog, User } from '@/components/types/strapi';

const COMPANY_USER_ROLE = 3;


export async function createCompany(data: Company, members: CompanyMemberDialog[], image: FormData) {

    let companyRecordCreated: Company | null = null;

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        if (!token) {
            throw new Error('Not authenticated');
        }


        const userMeLoader: any = await getUserMeLoader();
        if (!userMeLoader.ok) {
            throw new Error('Failed to get current user');
        }

        const currentUser: User = userMeLoader.data;

        // Create the company
        const companyResponse: ApiResponse<Company> = await fetchContentApi<Company>(`companies`, {
            method: 'POST',
            body: {
                data: {
                    name: data.name,
                    documentType: data.documentType.toUpperCase(),
                    document: data.document,
                    zipCode: data.zipCode,
                    state: data.state,
                    city: data.city,
                    address: data.address,
                    owner: currentUser.id
                }
            }
        });

        //console.log(`companyResponse: ${JSON.stringify(companyResponse)}`);
        const companyRecord = companyResponse.data;
        if (!companyRecord?.id) {
            throw new Error('Failed to create company');
        }

        console.log(`Creating Company ${companyRecord.id} - Company created successfully`);

        // Update the current user with the company relationship
        const currentUserResponse: ApiResponse<User> = await fetchContentApi<User>(`users/${currentUser.id}`, {
            method: 'PUT',
            body: {
                company: companyRecord.id
            },
        });

        if (!currentUserResponse.data?.id) {
            throw new Error('Failed to update current user with company');
        }

        console.log(`Creating Company ${companyRecord.id} - Current user updated successfully`);


        // Add current user as company member - Admin role
        const memberResponse: ApiResponse<CompanyMember> = await fetchContentApi<CompanyMember>(`company-members`, {
            method: 'POST',
            body: {
                data: {
                    company: companyRecord.id,
                    user: currentUser.id,
                    role: 'admin',
                    isAdmin: true,
                    canPost: true,
                    canApprove: true,
                    isOwner: true
                }
            }
        });

        if (!memberResponse.data) {
            throw new Error('Failed to add current user as company member');
        }

        //save here, if it fails - catch will return the companyRecordCreated
        companyRecordCreated = companyRecord;

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
                const userResponse: any = await fetchContentApi<User>(`auth/local/register`, {
                    method: 'POST',
                    body: {
                        username: user.email,
                        email: user.email,
                        password: pwd,
                        firstName: user.name.split(' ')[0],
                        lastName: user.name.split(' ').slice(1).join(' '),
                        phone: user.phone,
                        company: companyRecord.id
                    }
                });

                if (!userResponse?.success || !userResponse.data) {
                    console.error(`Failed to create user: ${user.email}`);
                    return { success: false, error: `Failed to create user: ${user.email}` };
                }

                let userData: User;

                if (!userResponse?.success || !userResponse.data) {
                    // Check if the error is due to email/username already taken
                    if (userResponse.error?.includes('Email') || userResponse.error?.includes('Username')) {
                        // Try to get the existing user by email
                        const existingUserResponse: any = await fetchContentApi<User>(`users?filters[email][$eq]=${user.email}`, {
                            method: 'GET'
                        });

                        if (existingUserResponse?.success && existingUserResponse.data?.length > 0) {
                            userData = existingUserResponse.data[0];
                            console.log(`User already exists: ${user.email} - Using existing user ID: ${userData.id}`);
                        } else {
                            console.error(`Failed to create user: ${user.email} - ${userResponse.error}`);
                            return { success: false, error: `Failed to create user: ${userResponse.error}` };
                        }
                    } else {
                        console.error(`Failed to create user: ${user.email} - ${userResponse.error}`);
                        return { success: false, error: `Failed to create user: ${userResponse.error}` };
                    }
                } else {
                    userData = userResponse.data?.user;
                }

                // Then, add the user as a company member
                const memberResponse: ApiResponse<CompanyMember> = await fetchContentApi<CompanyMember>(`company-members`, {
                    method: 'POST',
                    body: {
                        data: {
                            company: companyRecord.id,
                            user: userData.id,
                            role: 'member',
                            isAdmin: user.isAdmin,
                            canPost: user.canPost,
                            canApprove: user.canApprove
                        }
                    }
                });

                if (!memberResponse) {
                    console.error(`Failed to add member: ${user.email}`);
                    return { success: false, error: `Failed to add member: ${user.email}` };
                }

                console.log(`Creating Company ${companyRecord.id} - Member ${user.email} added successfully`);
                return { success: true, data: memberResponse };

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

        const response: any = await fetchContentApi(`companies/${documentId}`, {
            method: 'PUT',
            body: {
                data: companyData
            },
        });

        if (!response.data) {
            throw new Error('Failed to update company');
        }

        const company = response.data;

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


        const userMeLoader: any = await getUserMeLoader();
        if (!userMeLoader.ok) {
            throw new Error('Failed to get current user');
        }

        const currentUser: User = userMeLoader.data;

        if (!currentUser.company) {
            console.error('Current user does not have a company');
            return { success: false, error: 'Current user does not have a company' };
        }

        // First, create or get the user
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        let pwd = '';
        for (let i = 0; i < 16; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const userResponse: any = await fetchContentApi<User>(`auth/local/register`, {
            method: 'POST',
            body: {
                username: user.user.email,
                email: user.user.email,
                password: pwd,
                firstName: user.user.firstName,
                lastName: user.user.lastName,
                phone: user.user.phone,
                company: currentUser.company,
                type: 'companyUser',
                companyName: user.companyName,
                role: COMPANY_USER_ROLE
            }
        });

        let userData: User;

        if (!userResponse?.success || !userResponse.data) {
            console.log(userResponse);
            // Check if the error is due to email/username already taken
            if (userResponse.error?.includes('Email') || userResponse.error?.includes('Username')) {
                // Try to get the existing user by email
                return userResponse;
                const existingUserResponse: any = await fetchContentApi<User>(`users?filters[email][$eq]=${user.user.email}`, {
                    method: 'GET'
                });

                if (existingUserResponse?.success && existingUserResponse.data?.length > 0) {
                    userData = existingUserResponse.data[0];
                    console.log(`User already exists: ${user.user.email} - Using existing user ID: ${userData.id}`);
                } else {
                    console.error(`Failed to create user: ${user.user.email} - ${userResponse.error}`);
                    return { success: false, error: `Failed to create user: ${userResponse.error}` };
                }
            } else {
                console.error(`Failed to create user: ${user.user.email} - ${userResponse.error}`);
                return { success: false, error: `Failed to create user: ${userResponse.error}` };
            }
        } else {
            userData = userResponse.data?.user;
        }

        // Check if user is already a member of the company
        const existingMemberResponse: any = await fetchContentApi<CompanyMember>(`company-members?filters[user][id][$eq]=${userData.id}&filters[company][id][$eq]=${currentUser.company}`, {
            method: 'GET'
        });

        if (existingMemberResponse?.success && existingMemberResponse.data?.length > 0) {
            console.log(`User ${user.user.email} is already a member of the company`);
            return {
                success: false,
                error: 'User is already a member of this company',
                data: existingMemberResponse.data[0]
            };
        }

        const response: ApiResponse<CompanyMember> = await fetchContentApi<CompanyMember>('company-members', {
            method: 'POST',
            body: {
                data: {
                    user: userData.id,
                    role: 'member',
                    isAdmin: user.isAdmin,
                    canPost: user.canPost,
                    canApprove: user.canApprove
                }
            },
        });

        if (!response.data) {
            console.error(`Failed to create company member - ${response.error}`);
            return {
                success: false,
                error: `Failed to create company member - ${response.error}`
            };
        }

        return {
            success: true,
            data: { ...response.data, id: userData.id, documentId: userData.documentId }
        };
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

        const response: ApiResponse<CompanyMember> = await fetchContentApi<CompanyMember>(`company-members/${documentId}`, {
            method: 'PUT',
            body: {
                data: {
                    role: memberData.role,
                    isAdmin: memberData.isAdmin,
                    canPost: memberData.canPost,
                    canApprove: memberData.canApprove
                }
            },
        });

        if (!response.data) {
            console.error(`Failed to update company member - ${response.error}`);
            return {
                success: false,
                error: `Failed to update company member - ${response.error}`
            };
        }

        return {
            success: true,
            data: response.data
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

        const response: ApiResponse<CompanyMember> = await fetchContentApi<CompanyMember>(`company-members/${documentId}`, {
            method: 'DELETE'
        });

        if (!response.success && !response.data) {
            console.error(`Failed to remove company member - ${response.error}`);
            return {
                success: false,
                error: `Failed to remove company member - ${response.error}`
            };
        }

        console.log(`Removing company member - ${response.data?.id}`);

        // Delete the associated user
        /*
        const userResponse: ApiResponse<User> = await fetchContentApi<User>(`users/${userId}`, {
            method: 'DELETE'
        });

        if (!userResponse.data) {
            console.error(`Failed to remove user - ${userResponse.error}`);
            return {
                success: false,
                error: `Failed to remove user - ${userResponse.error}`
            };
        }

        console.log(`Removing user - ${userResponse.data.id}`);
        */

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error('Error removing company member:', error);
        return {
            success: false,
            error: 'Failed to remove company member'
        };
    }
}
