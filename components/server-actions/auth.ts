"use server"

import { signIn, signOut, auth } from "@/app/auth"
import { prisma } from "@/prisma/lib/prisma"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { z } from "zod"
import { AuthError } from "next-auth"
import resend from "@/lib/resend"
import EmailConfirmationEmail from "@/emails/EmailConfirmationEmail"
import ResetPasswordEmail from "@/emails/ResetPasswordEmail"
import { cookies } from "next/headers"
import { getTranslations } from "next-intl/server"

// Types for form data
export interface SignInFormData {
    email: string
    password: string
}

export interface SignUpFormData {
    name: string
    email: string
    phone: string
    password: string
    confirmPassword: string
}

// Validation schemas
const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

const signUpSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 characters").regex(/^[+]?[\d\s\-\(\)]{10,}$/, "Invalid phone number format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

// Helper function to get current locale
const getCurrentLocale = async (): Promise<string> => {
    const cookieStore = await cookies()
    return cookieStore.get('NEXT_LOCALE')?.value || 'en'
}

// Helper function to generate confirmation token
const generateConfirmationToken = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

/**
 * Server action for user sign-in using credentials
 */
export const signInAction = async (formData: SignInFormData) => {
    const t = await getTranslations("AuthErrors")

    try {
        // Validate form data
        const validatedData = signInSchema.parse(formData)

        // Attempt to sign in using NextAuth without redirect
        const result = await signIn("credentials", {
            email: validatedData.email,
            password: validatedData.password,
            redirect: false,
        })

        // Check result and handle accordingly
        if (result?.error) {
            return { success: false, error: result.error }
        }

        // If successful, return success and let client handle redirect
        return { success: true }
    } catch (error) {
        // NextAuth throws NEXT_REDIRECT which is expected behavior for redirects
        if (error instanceof Error && error.message === "NEXT_REDIRECT") {
            // This is expected - NextAuth is redirecting after successful sign-in
            throw error
        }

        console.error("Sign in error:", error)

        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    // Check error message for specific error types

                    if ((error as any).code?.includes("invalid-credentials")) {
                        return { success: false, errorCode: "invalid-credentials", error: t("invalidCredentials") }
                    }
                    if ((error as any).code?.includes("email-not-confirmed")) {
                        return { success: false, errorCode: "email-not-confirmed", error: t("emailNotConfirmed") }
                    }
                    if ((error as any).code?.includes("account-blocked")) {
                        return { success: false, errorCode: "account-blocked", error: t("accountBlocked") }
                    }
                    return { success: false, errorCode: "invalid-credentials", error: t("invalidCredentials") }
                default:
                    return { success: false, errorCode: "authentication-failed", error: t("authenticationFailed") }
            }
        }

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: t("unexpectedError") }
    }
}

/**
 * Server action for user sign-up (registration)
 */
export const signUpAction = async (formData: SignUpFormData) => {
    const t = await getTranslations("AuthErrors")

    try {
        // Validate form data
        const validatedData = signUpSchema.parse(formData)

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: validatedData.email },
                    { phone: validatedData.phone }
                ]
            }
        })

        if (existingUser) {
            if (existingUser.email === validatedData.email) {
                return { success: false, error: t("emailExists") }
            }
            if (existingUser.phone === validatedData.phone) {
                return { success: false, error: t("phoneExists") }
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(validatedData.password, 12)

        // Generate confirmation token
        const confirmationToken = generateConfirmationToken()

        // Get current locale
        const currentLocale = await getCurrentLocale()

        // Split name into first and last name
        const nameParts = validatedData.name.trim().split(' ')
        const firstName = nameParts[0]
        const lastName = nameParts.slice(1).join(' ') || ''

        // Create user in database
        const newUser = await prisma.user.create({
            data: {
                email: validatedData.email,
                password: hashedPassword,
                phone: validatedData.phone,
                firstName,
                lastName,
                provider: 'local',
                language: currentLocale === 'pt-BR' ? 'pt_BR' : 'en',
                confirmationToken,
                confirmed: false,
                blocked: false,
            }
        })

        // Send confirmation email
        const baseUrl = process.env.HOST || process.env.NEXTAUTH_URL || 'http://localhost:3000'
        const fromEmail = process.env.FROM_EMAIL || "SaaS Framework <noreply@example.com>"
        const confirmationUrl = `${baseUrl}/${currentLocale}/sign-up/confirm?token=${confirmationToken}`

        try {
            await resend.emails.send({
                from: fromEmail,
                to: [validatedData.email],
                subject: currentLocale === 'pt-BR' ? 'Confirme seu email' : 'Confirm your email',
                react: EmailConfirmationEmail({
                    userName: firstName,
                    confirmationLink: confirmationUrl,
                    lang: currentLocale,
                    baseUrl
                }),
            })
        } catch (emailError) {
            console.error("Failed to send confirmation email:", emailError)
            // Don't fail the registration if email fails
        }

        return {
            success: true,
            message: "Account created successfully. Please check your email to confirm your account.",
            userId: newUser.id
        }

    } catch (error) {
        console.error("Sign up error:", error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: t("registrationFailed") }
    }
}

/**
 * Server action for Google OAuth sign-in
 */
export const googleSignInAction = async (redirectPath?: string) => {
    try {
        // Store redirect path in cookies if provided
        if (redirectPath) {
            const cookieStore = await cookies()
            cookieStore.set('oauth_redirect', redirectPath, {
                maxAge: 300, // 5 minutes
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            })
        }

        await signIn("google")
    } catch (error) {
        // NextAuth throws NEXT_REDIRECT which is expected behavior for redirects
        if (error instanceof Error && error.message === "NEXT_REDIRECT") {
            // This is expected - NextAuth is redirecting to Google OAuth
            throw error
        }
        console.error("Google sign in error:", error)
        const t = await getTranslations("AuthErrors")
        return { success: false, error: t("googleSignInFailed") }
    }
}

/**
 * Server action for user logout
 */
export const logoutAction = async () => {
    try {
        await signOut()
    } catch (error) {
        // NextAuth throws NEXT_REDIRECT which is expected behavior for redirects
        if (error instanceof Error && error.message === "NEXT_REDIRECT") {
            // This is expected - NextAuth is redirecting after logout
            throw error
        }
        console.error("Logout error:", error)
        const t = await getTranslations("AuthErrors")
        return { success: false, error: t("logoutFailed") }
    }
}

/**
 * Server action to confirm email address
 */
export const confirmEmailAction = async (token: string) => {
    const t = await getTranslations("AuthErrors")

    try {
        if (!token) {
            return { success: false, error: "Confirmation token is required" }
        }

        // Find user with the confirmation token
        const user = await prisma.user.findFirst({
            where: {
                confirmationToken: token,
                confirmed: false,
            }
        })

        if (!user) {
            return { success: false, error: t("invalidToken") }
        }

        // Update user to confirmed
        await prisma.user.update({
            where: { id: user.id },
            data: {
                confirmed: true,
                confirmationToken: null,
            }
        })

        return { success: true, message: "Email confirmed successfully. You can now sign in." }

    } catch (error) {
        console.error("Email confirmation error:", error)
        return { success: false, error: t("confirmationFailed") }
    }
}

/**
 * Server action to resend confirmation email
 */
export const resendConfirmationEmailAction = async (email: string) => {
    const t = await getTranslations("AuthErrors")

    try {
        if (!email) {
            return { success: false, error: "Email is required" }
        }

        // Find user with the email
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return { success: false, error: t("userNotFound") }
        }

        if (user.confirmed) {
            return { success: false, error: t("emailAlreadyConfirmed") }
        }

        // Generate new confirmation token
        const confirmationToken = generateConfirmationToken()

        // Update user with new token
        await prisma.user.update({
            where: { id: user.id },
            data: { confirmationToken }
        })

        // Get current locale
        const currentLocale = await getCurrentLocale()

        // Send confirmation email
        const baseUrl = process.env.HOST || process.env.NEXTAUTH_URL || 'http://localhost:3000'
        const fromEmail = process.env.FROM_EMAIL || "SaaS Framework <noreply@example.com>"
        const confirmationUrl = `${baseUrl}/${currentLocale}/sign-up/confirm?token=${confirmationToken}`

        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: [email],
            subject: currentLocale === 'pt-BR' ? 'Confirme seu email' : 'Confirm your email',
            react: EmailConfirmationEmail({
                userName: user.firstName,
                confirmationLink: confirmationUrl,
                lang: currentLocale,
                baseUrl
            }),
        })
        if (error) {
            console.error("Failed to send confirmation email:", error)
        }

        return { success: true, message: "Confirmation email sent successfully" }

    } catch (error) {
        console.error("Resend confirmation email error:", error)
        return { success: false, error: t("resendFailed") }
    }
}

/**
 * Server action to get current user information
 */
export const getCurrentUserAction = async () => {
    try {
        const session = await auth()

        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated", user: null }
        }

        // Get complete user information from database
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                avatarUrl: true,
                language: true,
                provider: true,
                confirmed: true,
                blocked: true,
                createdAt: true,
                updatedAt: true,
                avatar: {
                    select: {
                        id: true,
                        url: true,
                        name: true
                    }
                }
            }
        })

        if (!user) {
            return { success: false, error: "User not found", user: null }
        }

        // Transform data for frontend use
        const userData = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            name: `${user.firstName} ${user.lastName || ''}`.trim(),
            phone: user.phone,
            avatarUrl: user.avatarUrl || user.avatar?.url || null,
            language: user.language,
            provider: user.provider,
            confirmed: user.confirmed,
            blocked: user.blocked,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            // Access control flags
            isActive: Boolean(user.confirmed && !user.blocked),
            canAccess: Boolean(user.confirmed && !user.blocked),
        }

        return { success: true, user: userData }
    } catch (error) {
        console.error("Get current user error:", error)
        return { success: false, error: "Failed to get user information", user: null }
    }
}

/**
 * Server action to request password reset
 */
export const resetPasswordAction = async (email: string) => {
    const t = await getTranslations("AuthErrors")

    try {
        if (!email) {
            return { success: false, error: "Email is required" }
        }

        // Validate email format
        const emailSchema = z.string().email("Invalid email address")
        const validatedEmail = emailSchema.parse(email)

        // Find user with the email
        const user = await prisma.user.findUnique({
            where: { email: validatedEmail }
        })

        // Always return success to prevent email enumeration attacks
        // but only send email if user exists
        if (user && user.confirmed && !user.blocked) {
            // Generate reset token
            const resetPasswordToken = generateConfirmationToken()
            const resetPasswordExpires = new Date(Date.now() + 3600000) // 1 hour from now

            // Update user with reset token and expiration
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    resetPasswordToken,
                    resetPasswordExpires
                }
            })

            // Get current locale
            const currentLocale = await getCurrentLocale()

            // Send reset password email
            const baseUrl = process.env.HOST || process.env.NEXTAUTH_URL || 'http://localhost:3000'
            const fromEmail = process.env.FROM_EMAIL || "SaaS Framework <noreply@example.com>"
            const resetUrl = `${baseUrl}/${currentLocale}/reset-password/confirm?token=${resetPasswordToken}`

            try {
                await resend.emails.send({
                    from: fromEmail,
                    to: [validatedEmail],
                    subject: currentLocale === 'pt-BR' ? 'Redefinir sua senha' : 'Reset your password',
                    react: ResetPasswordEmail({
                        userName: user.firstName,
                        resetPasswordLink: resetUrl,
                        lang: currentLocale,
                        baseUrl
                    }),
                })
            } catch (emailError) {
                console.error("Failed to send reset password email:", emailError)
                // Don't fail the request if email fails
            }
        }

        return { success: true, message: "If an account with that email exists, we've sent you a reset link." }

    } catch (error) {
        console.error("Reset password error:", error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: t("unexpectedError") }
    }
}

/**
 * Server action to confirm password reset with new password
 */
export const confirmPasswordResetAction = async (token: string, password: string) => {
    const t = await getTranslations("AuthErrors")

    try {
        if (!token || !password) {
            return { success: false, error: "Token and password are required" }
        }

        // Validate password
        const passwordSchema = z.string().min(6, "Password must be at least 6 characters")
        const validatedPassword = passwordSchema.parse(password)

        // Find user with valid reset token
        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: {
                    gt: new Date() // Token must not be expired
                },
                confirmed: true,
                blocked: false
            }
        })

        if (!user) {
            return { success: false, error: t("invalidToken") }
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(validatedPassword, 12)

        // Update user with new password and clear reset token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null
            }
        })

        return { success: true, message: "Password reset successfully. You can now sign in with your new password." }

    } catch (error) {
        console.error("Password reset confirmation error:", error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: t("unexpectedError") }
    }
}
