'use server';

import { fetchContentApi } from "./fetch-content-api";

export async function forgotPasswordAction(email: string) {
    try {

        const res: any = await fetchContentApi('auth/forgot-password', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: { email: email },
        });
        //const result = await res.json();
        if (res.ok) {
            return { success: true, message: "If your email exists, you will receive a password reset link." };
        } else {
            return { success: false, error: res.error?.message || "Failed to send reset email." };
        }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}
