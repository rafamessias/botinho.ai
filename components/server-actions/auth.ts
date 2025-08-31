"use server"

import { signIn, signOut } from "@/app/auth"
import { prisma } from "@/prisma/lib/prisma"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { z } from "zod"
import { AuthError } from "next-auth"
import resend from "@/lib/resend"
import EmailConfirmationEmail from "@/emails/EmailConfirmationEmail"
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

        // Attempt to sign in using NextAuth
        const result = await signIn("credentials", {
            email: validatedData.email,
            password: validatedData.password,
            redirect: false,
        })

        // If sign in successful, redirect to home
        if (result && !result.error) {
            const locale = await getCurrentLocale()
            redirect(`/${locale}`)
        }

        return { success: false, error: t("invalidCredentials") }
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
export const googleSignInAction = async () => {
    try {
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

        console.log("Email sent:", data)

        return { success: true, message: "Confirmation email sent successfully" }

    } catch (error) {
        console.error("Resend confirmation email error:", error)
        return { success: false, error: t("resendFailed") }
    }
}
