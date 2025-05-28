'use server';

import { cookies } from 'next/headers';
import { User } from '@/components/shared/add-user-dialog';
import { uploadFile } from '@/lib/strapi';
import { fetchContentApi } from './fetch-content-api';
import { getUserMeLoader } from '../services/get-user-me-loader';

interface CreateCompanyData {
    companyName: string;
    documentType: 'cpf' | 'cnpj';
    cpf?: string;
    cnpj?: string;
    zipcode: string;
    state: string;
    city: string;
    companyAddress: string;
    companyLogo?: FileList;
    users: User[];
}

export async function createCompany(data: CreateCompanyData, image: FormData) {
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
                    name: data.companyName,
                    documentType: data.documentType.toUpperCase(),
                    document: data.documentType === 'cpf' ? data.cpf : data.cnpj,
                    zipCode: data.zipcode,
                    state: data.state,
                    city: data.city,
                    address: data.companyAddress,
                }
            }
        });

        //console.log(`companyResponse: ${JSON.stringify(companyResponse)}`);
        if (!companyResponse?.data?.id) {
            throw new Error('Failed to create company');
        }

        // Update the current user with the company relationship
        const currentUser: any = await getUserMeLoader();
        const currentUserResponse: any = await fetchContentApi(`users/${currentUser.data.id}`, {
            method: 'PUT',
            body: {
                company: companyResponse.data.id
            },
        });

        if (!currentUserResponse.id) {
            throw new Error('Failed to update current user with company');
        }

        // First, upload the company logo if it exists
        let logoUrl = '';
        const logoFile = image.get('companyLogo');
        if (logoFile) {
            console.log('Uploading logo file:', {
                name: (logoFile as File).name,
                type: (logoFile as File).type,
                size: (logoFile as File).size
            });

            const uploadResponse = await uploadFile(logoFile as File, companyResponse.data.documentId, 'api::company.companies', 'logo');
            console.log(`uploadResponse: ${JSON.stringify(uploadResponse)}`);
            if (!uploadResponse.ok) {
                throw new Error('Failed to upload logo');
            }

            const uploadData = await uploadResponse.json();
            logoUrl = uploadData[0].url;
            console.log('Logo uploaded successfully:', logoUrl);
        }

        // Add users as company members
        if (data.users.length > 0) {
            const memberPromises = data.users.map(async (user) => {
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
                        company: companyResponse.data.documentID
                    }
                });

                console.log(`userResponse: ${userResponse} +  password: ${pwd}`);

                if (!userResponse.ok) {
                    throw new Error(`Failed to create user: ${user.email}`);
                }

                const userData = await userResponse.json();

                // Then, add the user as a company member
                const memberResponse: any = await fetchContentApi(`company-members`, {
                    method: 'POST',
                    body: {
                        data: {
                            company: companyResponse.data.documentID,
                            user: userData.id,
                            role: 'member',
                        }
                    }
                });

                if (!memberResponse.ok) {
                    throw new Error(`Failed to add member: ${user.email}`);
                }
            });

            await Promise.all(memberPromises);
        }

        return { success: true, data: companyResponse };
    } catch (error) {
        console.error('Error creating company:', error);
        return { success: false, error: error instanceof Error ? error.message : 'An error occurred' };
    }
} 