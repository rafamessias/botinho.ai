'use server';

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
const { prisma } = await import('@/prisma/lib/prisma');

export async function setNewPasswordAction(token: string, email: string, password: string, passwordConfirmation: string) {
    try {
        // Use prisma to get the user by email and check resetPasswordToken
        const user = await prisma.user.findUnique({
            where: { email },
            select: { resetPasswordToken: true }
        });

        if (!user || user.resetPasswordToken !== token) {
            return { success: false, error: "Invalid or expired reset token.", user: null };
        }

        // Update the user's password
        if (password !== passwordConfirmation) return { success: false, error: "Passwords do not match.", user: null };

        const hashedPassword = await bcrypt.hash(password, 12)

        const updatedUser = await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });

        return { success: true, message: "Your password has been reset. You can now sign in.", user: updatedUser };

    } catch (error) {
        console.log(error);
        return { success: false, error: error instanceof Error ? error.message : String(error), user: null };
    }
}
