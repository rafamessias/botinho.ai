"use server";

import { signUp, signIn } from '@/lib/strapi';


export async function registerUserAction(formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    try {
        const response = await signUp({
            firstName: data.firstName as string,
            lastName: data.lastName as string,
            email: data.email as string,
            phone: data.phone as string,
            password: data.password as string,
            language: data.language as string,
        });

        if (response.success) {
            return { success: true, user: response.user };
        } else {
            return { success: false, error: response.error || "No User Found" };
        }
    } catch (error: any) {
        return { success: false, error: error.message || "Unknown error" };
    }
}

export async function signInAction(formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    try {
        const response = await signIn(data.email as string, data.password as string);

        // You can return the response or a redirect instruction
        return { success: true, user: response.user };
    } catch (error: any) {
        return { success: false, error: error.message || "Unknown error" };
    }
}

export async function googleSignUpAction() {
    // Implement your Google sign-up logic here
    // This is a placeholder
    return { success: false, error: "Not implemented" };
}