'use server';

import { cookies } from 'next/headers';
import { uploadFile } from '@/lib/strapi';
import { fetchContentApi } from './fetch-content-api';
import { getUserMeLoader } from '../services/get-user-me-loader';
import { Company, CompanyMemberDialog } from '@/components/types/strapi';


export async function createCompany(data: Company, members: CompanyMemberDialog[], image: FormData) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        if (!token) {
            throw new Error('Not authenticated');
        }

        // Create the company
        const companyResponse: any = await fetchContentApi(`companies`, {
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
        const currentUser: any = await getUserMeLoader();
        const currentUserResponse: any = await fetchContentApi(`users/${currentUser.data.id}`, {
            method: 'PUT',
            body: {
                company: companyRecord.id
            },
        });

        if (!currentUserResponse.id) {
            throw new Error('Failed to update current user with company');
        }

        console.log(`Creating Company ${companyRecord.id} - Current user updated successfully`);


        // Add current user as company member - Admin role
        const memberResponse: any = await fetchContentApi(`company-members`, {
            method: 'POST',
            body: {
                data: {
                    company: companyRecord.id,
                    user: currentUser.data.id,
                    role: 'admin',
                    isAdmin: true,
                    canPost: true,
                    canApprove: true
                }
            }
        });

        if (!memberResponse) {
            throw new Error('Failed to add current user as company member');
        }

        console.log(`Creating Company ${companyRecord.id} - Current user added as company member Admin successfully`);

        // First, upload the company logo if it exists
        const logoFile = image.get('companyLogo');
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
                const userResponse: any = await fetchContentApi(`auth/local/register`, {
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

                if (!userResponse?.user) {
                    throw new Error(`Failed to create user: ${user.email}`);
                }

                const userData = userResponse.user;

                // Then, add the user as a company member
                const memberResponse: any = await fetchContentApi(`company-members`, {
                    method: 'POST',
                    body: {
                        data: {
                            company: companyRecord.id,
                            user: userData.id,
                            role: 'member',
                            isAdmin: false,
                            canPost: true,
                            canApprove: false
                        }
                    }
                });

                if (!memberResponse) {
                    throw new Error(`Failed to add member: ${user.email}`);
                }
                console.log(`Creating Company ${companyRecord.id} - Member ${user.email} added successfully`);

            });

            await Promise.all(memberPromises);
        }

        return { success: true, data: companyRecord };
    } catch (error) {
        console.error('Error creating company:', error);
        return { success: false, error: error instanceof Error ? error.message : 'An error occurred' };
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