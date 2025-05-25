import { strapi } from '@strapi/client';

export const client = strapi({ baseURL: `${process.env.NEXT_PUBLIC_STRAPI_URL}/api` });
export const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

interface SignUpData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
}

export const authService = {
    async signUp(data: SignUpData) {
        console.log(`${strapiUrl}/api/auth/local/register`);

        const response = await fetch(`${strapiUrl}/api/auth/local/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: data.email,
                email: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to sign up');
        }

        return response.json();
    },

    async signIn(email: string, password: string) {
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

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to sign in');
        }

        return response.json();
    },
};

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
