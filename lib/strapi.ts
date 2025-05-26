"use server";
import { getAuthToken } from "@/components/services/get-token";
import { cookies } from "next/headers";
import { fetchContentApi } from "@/components/actions/fetch-content-api";
const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

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
            }),
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(
                responseData.error?.message ||
                responseData.error?.details?.errors?.[0]?.message ||
                'Failed to sign up'
            );
        }

        const cookieStore = await cookies();
        cookieStore.set("jwt", responseData.jwt, config);

        return responseData;
    } catch (error) {
        console.error('Sign up error:', error);
        throw error;
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

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(
                responseData.error?.message ||
                responseData.error?.details?.errors?.[0]?.message ||
                'Failed to sign in'
            );
        }

        const cookieStore = await cookies();
        cookieStore.set("jwt", responseData.jwt, config);

        const user = await fetchContentApi(`users/me?populate=*`, {
            token: responseData.jwt
        })

        return { responseData, user };
    } catch (error) {
        console.error('Sign in error:', error);
        throw error;
    }
}

export async function uploadFile(file: File, id: string, collection: string, field: string) {
    try {
        // Create form data
        const formData = new FormData();
        formData.append('files', file);
        formData.append('ref', collection);
        formData.append('refId', id);
        formData.append('field', field);

        //file info
        const fileInfo = {
            name: `${id}-${file.name}`,
            type: file.type,
            size: file.size,
        }

        formData.append('fileInfo', JSON.stringify(fileInfo));

        // Upload file
        const response = await fetch(`${strapiUrl}/api/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${await getAuthToken()}`
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload file');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}
