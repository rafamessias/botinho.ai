"use server";

import { prisma } from "@/prisma/lib/prisma";
import ResetPasswordEmail from "@/emails/ResetPasswordEmail";
import resend from "@/lib/resend";
import { getTranslations } from "next-intl/server";

export async function forgotPasswordAction(email: string) {
    const t = await getTranslations('auth.resetPassword');

    try {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            // For security, do not reveal if user does not exist
            return { success: true, message: t('success') };
        }

        // Generate a secure token and expiry (e.g., 1 hour)
        const crypto = await import('crypto');
        const token = crypto.randomBytes(32).toString('hex');

        // Update user with reset token and expiry
        await prisma.user.update({
            where: { email: email },
            data: {
                resetPasswordToken: token,
            },
        });

        // Send reset password email
        const baseUrl = process.env.HOST;
        const fromEmail = process.env.FROM_EMAIL || "Obraguru <contact@obra.guru>";

        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: user.email,
            subject: t('subject'),
            react: ResetPasswordEmail({
                resetPasswordLink: `${baseUrl}/reset-password/new?email=${encodeURIComponent(email)}&token=${token}`,
                lang: user.language,
                userName: `${user.firstName} ${user.lastName}`,
                baseUrl: baseUrl,
            }),
        });

        if (data) {
            return { success: true, message: t('success') };
        } else {
            return { success: false, error: error?.message || t('error') };
        }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}
