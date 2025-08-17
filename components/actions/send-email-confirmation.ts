"use server";

import { getTranslations } from "next-intl/server";
import { prisma } from "@/prisma/lib/prisma";

export async function sendEmailConfirmationAction(email: string, token: string | null) {
    const t = await getTranslations('auth');
    try {

        // INSERT_YOUR_CODE
        // Get user by email, select confirmationToken and confirmed fields
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                confirmationToken: true,
                confirmed: true,
                language: true,
                firstName: true,
                lastName: true,
            },
        });

        if (!user) {
            return {
                success: false,
                error: t('checkEmail.error')
            };
        }


        if (user.confirmed) {
            return {
                success: true,
                message: t('checkEmail.confirmed')
            };
        }

        if (!user.confirmed && token) {
            if (user.confirmationToken !== token) {
                return {
                    success: false,
                    error: t('checkEmail.invalidToken')
                };
            } else {
                // INSERT_YOUR_CODE
                const updatedUser = await prisma.user.update({
                    where: { email },
                    data: {
                        confirmed: true,
                        confirmationToken: null,
                    },
                });

                if (updatedUser) {
                    return {
                        success: true,
                        message: t('checkEmail.confirmed')
                    };
                } else {
                    return {
                        success: false,
                        error: t('checkEmail.error')
                    };
                }
            }
        }

        // Generate a new confirmation token
        const newToken = (await import('crypto')).randomBytes(32).toString('hex');

        // Update the user's confirmationToken in the database
        await prisma.user.update({
            where: { email },
            data: {
                confirmationToken: newToken,
            },
        });

        // Prepare and send the confirmation email
        // Import EmailConfirmationEmail and render if not already imported
        // Assume baseUrl and fromEmail are available in this scope or set them here
        const baseUrl = process.env.HOST;
        const fromEmail = process.env.FROM_EMAIL || "Obraguru <contact@obra.guru>";
        const { render } = await import("@react-email/render");
        const EmailConfirmationEmail = (await import("@/emails/EmailConfirmationEmail")).default;
        const resend = (await import("@/lib/resend")).default;

        // Send the email
        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: [email],
            subject: t('checkEmail.subject'),
            react: EmailConfirmationEmail({
                confirmationLink: `${baseUrl}/sign-up/check-email?email=${encodeURIComponent(email)}&token=${newToken}`,
                lang: user.language,
                userName: `${user.firstName} ${user.lastName}`,
                baseUrl: baseUrl,
            })
        });

        if (data) {
            return {
                success: true,
                message: t('checkEmail.sending')
            };
        } else {
            return {
                success: false,
                error: error?.message || t('checkEmail.error')
            };
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error)
        };
    }
}
