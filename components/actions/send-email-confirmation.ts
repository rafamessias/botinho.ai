"use server";

import { fetchContentApi } from "./fetch-content-api";
import { getTranslations } from "next-intl/server";

export async function sendEmailConfirmationAction(email: string) {
    const t = await getTranslations('auth');
    try {
        const res: any = await fetchContentApi('auth/send-email-confirmation', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: { email: email },
        });

        if (res.success) {
            return {
                success: true,
                message: t('checkEmail.sending')
            };
        } else {
            return {
                success: false,
                error: res.error?.message || t('checkEmail.error')
            };
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error)
        };
    }
}
