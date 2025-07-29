"use server";
import { getAuthToken } from "@/components/services/get-token";
import { cookies } from "next/headers";
import { fetchContentApi } from "@/components/actions/fetch-content-api";
import { ApiResponse } from "@/components/types/strapi";
import { User } from "@/components/types/strapi";
import { CompanyMember } from "@/components/types/strapi";
import { ProjectUser } from "@/components/types/strapi";
const strapiUrl = process.env.STRAPI_URL;

const config = {
    maxAge: 60 * 60 * 24 * 1, // 1 day
    path: "/",
    domain: process.env.HOST ?? "localhost",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
};

interface SignUpData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    language: string;
}

export async function signUp(data: SignUpData) {
    try {
        const response = await fetch(`${strapiUrl}/api/auth/local/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: data.email.split('@')[0], // Use part of email as username
                email: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                language: data.language,
                type: 'companyUser'
            }),
        });

        const responseData = await response.json();

        if (!responseData.user) {
            return {
                success: false,
                error: responseData.error?.message ||
                    responseData.error?.details?.errors?.[0]?.message ||
                    'Failed to sign up',
                user: null
            }
        }

        //const cookieStore = await cookies();
        //cookieStore.set("jwt", responseData.jwt, config);

        return {
            success: true,
            user: responseData.user
        }
    } catch (error) {
        console.error('Sign up error:', error);
        return {
            success: false,
            error: error,
            user: null
        }
    }
}

export async function signIn(email: string, password: string) {
    try {
        const response = await fetch(`${strapiUrl}/api/auth/local`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                identifier: email,
                password,
            }),
        });

        const responseData: any = await response.json();

        //console.log("responseData", responseData);

        if (responseData.error) {
            return {
                success: false,
                error: responseData.error?.message ||
                    responseData.error?.details?.errors?.[0]?.message ||
                    'Failed to sign in',
                user: null
            }
        }

        const cookieStore = await cookies();
        cookieStore.set("jwt", responseData.jwt, config);

        const user: ApiResponse<User> = await fetchContentApi<User>(`users/me?populate=*`, {
            token: responseData.jwt
        })

        if (!user.success) {
            return {
                success: false,
                error: user.error || "Failed to fetch user",
                user: null
            }
        }

        let userData: User = user.data as User;

        // Fetch additional user data (companyMember or projectUser)
        if (userData.type === "companyUser") {
            const companyMember = await fetchContentApi<CompanyMember[]>(`company-members?filters[user][id][$eq]=${userData.id}`, {
                token: responseData.jwt
            });

            if (companyMember.success && companyMember.data) {
                userData.companyMember = companyMember.data[0];
            }
        } else if (userData.type === "projectUser") {
            const projectUser = await fetchContentApi<ProjectUser[]>(`project-users?populate[0]=project&filters[email][$eq]=${userData.email}`, {
                token: responseData.jwt
            });

            if (projectUser.success && projectUser.data) {
                userData.projectUser = projectUser.data;
            }
        }

        return {
            success: true,
            responseData,
            user: userData
        }

    } catch (error) {
        console.error('Sign in error:', error);
        return {
            success: false,
            error: error,
            user: null
        }
    }
}

export async function getGoogleOAuthUrl() {
    return `${strapiUrl}/api/connect/google`;
}

export async function uploadFile(file: File, id: number, collection: string, field: string) {
    try {
        // Create form data
        const formData = new FormData();
        formData.append('files', file);
        formData.append('ref', collection);
        formData.append('refId', id.toString());
        formData.append('field', field);

        //file info
        const fileInfo = {
            name: `${id}-${file.name}`,
            type: file.type,
            size: file.size,
        }

        formData.append('fileInfo', JSON.stringify(fileInfo));

        // Upload file
        const response = await fetchContentApi(`upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.success) {
            console.error('Upload failed:', response.error);
            return {
                success: false,
                error: 'Failed to upload file',
                data: null
            }
        }

        return {
            success: true,
            data: response.data
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        return {
            success: false,
            error: error,
            data: null
        }
    }
}
