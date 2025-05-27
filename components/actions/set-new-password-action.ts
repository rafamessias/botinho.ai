'use server';

import { cookies } from "next/headers";
import { fetchContentApi } from "./fetch-content-api";

export async function setNewPasswordAction(code: string, password: string, passwordConfirmation: string) {
    try {
        const res: any = await fetchContentApi('auth/reset-password', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: { code, password, passwordConfirmation },
        });


        if (res.jwt) {
            const cookieStore = await cookies();
            cookieStore.set('jwt', res.jwt, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 30 * 24 * 60 * 1 // 1 day
            });

            const user = await fetchContentApi(`users/me?populate=*`, {
                token: res.jwt
            })

            return { success: true, message: "Your password has been reset. You can now sign in.", user };
        } else {
            return { success: false, error: res.error?.message || "Failed to reset password." };
        }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}
