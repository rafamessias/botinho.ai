'use server';

import { fetchContentApi } from "./fetch-content-api";

export async function sendEmailConfirmationAction(email: string) {
    try {
        const res: any = await fetchContentApi('auth/send-email-confirmation', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: { email: email },
        });

        if (res.ok) {
            return {
                success: true,
                message: "Verification email has been sent. Please check your inbox."
            };
        } else {
            return {
                success: false,
                error: res.error?.message || "Failed to send verification email."
            };
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error)
        };
    }
}
