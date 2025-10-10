"use server"

import { signIn, signOut, auth } from "@/app/auth"
import { prisma } from "@/prisma/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { AuthError } from "next-auth"
import resend from "@/lib/resend"
import EmailConfirmationEmail from "@/emails/EmailConfirmationEmail"
import ResetPasswordEmail from "@/emails/ResetPasswordEmail"
import OTPEmail from "@/emails/OTPEmail"
import { cookies } from "next/headers"
import { getTranslations } from "next-intl/server"
import { Provider, Theme, SubscriptionStatus, PlanType, Prisma } from "@/lib/generated/prisma"
import { createCustomerSubscription } from "@/lib/customer-subscription"
import { createCheckoutSession } from "@/lib/stripe-service"

// Types for form data
export interface SignInFormData {
    email: string
    password: string
}

export interface SignUpFormData {
    name: string
    email: string
    phone?: string
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
    phone: z.string().min(10, "Phone number must be at least 10 characters").regex(/^[+]?[\d\s\-\(\)]{10,}$/, "Invalid phone number format").optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

// Helper function to get current locale
export const getCurrentLocale = async (): Promise<string> => {
    const cookieStore = await cookies()
    return cookieStore.get('NEXT_LOCALE')?.value || 'en'
}

// Helper function to generate confirmation token
export const generateConfirmationToken = async (randomCharacters: number = 36, numberCharacters: number = 15): Promise<string> => {
    return Math.random().toString(randomCharacters).substring(2, numberCharacters) + Math.random().toString(randomCharacters).substring(2, numberCharacters)
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

        // If successful, check subscription and handle checkout if needed
        console.log('Checking subscription for user:', validatedData.email)
        const subscriptionCheck = await checkSubscriptionAndRedirect(validatedData.email)
        console.log('Subscription check result:', subscriptionCheck)

        if (subscriptionCheck?.success && subscriptionCheck.needsCheckout && subscriptionCheck.planType) {
            console.log('Creating checkout session for plan:', subscriptionCheck.planType)

            // Get user's team and existing subscription
            const user = await prisma.user.findUnique({
                where: { email: validatedData.email },
                include: {
                    team: {
                        include: {
                            subscriptions: {
                                where: {
                                    status: {
                                        in: ['active', 'trialing']
                                    }
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                },
                                take: 1
                            }
                        }
                    }
                }
            }) as Prisma.UserGetPayload<{
                include: { team: { include: { subscriptions: true } } }
            }> | null

            if (!user?.defaultTeamId) {
                console.error('No team found for user:', validatedData.email)
                return {
                    success: true,
                    needsCheckout: false,
                    error: 'No team found for user'
                }
            }

            // Get existing CustomerSubscription ID if it exists
            const existingSubscriptionId = user.team?.subscriptions[0]?.id
            console.log('Existing CustomerSubscription ID:', existingSubscriptionId)

            // Create checkout session server-side
            const checkoutResult = await createCheckoutSessionAction(
                subscriptionCheck.planType as PlanType,
                'monthly',
                validatedData.email,
                user.defaultTeamId,
                existingSubscriptionId
            )
            console.log('Checkout session result:', checkoutResult)

            if (checkoutResult.success && checkoutResult.checkoutUrl) {
                return {
                    success: true,
                    needsCheckout: true,
                    checkoutUrl: checkoutResult.checkoutUrl
                }
            } else {
                console.error('Failed to create checkout session server-side:', checkoutResult.error)
                // Return success but without checkout URL - client will handle fallback
                return {
                    success: true,
                    needsCheckout: false,
                    error: 'Failed to create checkout session'
                }
            }
        }

        // No checkout needed, return success
        return { success: true, needsCheckout: false }
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
 * Server action to check user subscription and redirect to Stripe checkout if needed
 */
export const checkSubscriptionAndRedirect = async (userEmail: string) => {
    try {
        console.log('Checking subscription for user email:', userEmail)

        // Get user with their team and subscription
        const user = await prisma.user.findUnique({
            where: { email: userEmail },
            include: {
                team: {
                    include: {
                        subscriptions: {
                            where: {
                                status: {
                                    in: ['active', 'trialing', 'pending']
                                }
                            },
                            include: {
                                plan: true
                            },
                            orderBy: {
                                createdAt: 'desc'
                            },
                            take: 1
                        }
                    }
                }
            }
        }) as Prisma.UserGetPayload<{
            include: { team: { include: { subscriptions: { include: { plan: true } } } } }
        }> | null

        console.log('User found:', !!user, 'Team found:', !!user?.team)
        console.log('Subscription found:', !!user?.team?.subscriptions?.[0])
        console.log('Subscription status:', user?.team?.subscriptions?.[0]?.status)
        console.log('Plan found:', !!user?.team?.subscriptions?.[0]?.plan)
        console.log('Plan type:', user?.team?.subscriptions?.[0]?.plan?.planType)

        if (!user || !user.team) {
            return { success: false, error: "User or team not found" }
        }

        const subscription = user.team.subscriptions[0]

        // If no subscription or subscription is pending, redirect to Stripe checkout
        if (!subscription || subscription.status === 'pending') {
            // Find the plan to redirect to
            let planToRedirect = 'FREE' // Use database enum value, not mapped string

            if (subscription && subscription.plan) {
                // Use the original database plan type directly
                planToRedirect = subscription.plan.planType
            }

            console.log('Plan to redirect to:', planToRedirect)

            // Return redirect information
            return {
                success: true,
                needsCheckout: true,
                planType: planToRedirect
            }
        }

        // If subscription is active, no redirect needed
        console.log('Subscription is active, no checkout needed')
        return {
            success: true,
            needsCheckout: false
        }

    } catch (error) {
        console.error("Error checking subscription:", error)
        return { success: false, error: "Failed to check subscription" }
    }
}

/**
 * Server action for user sign-up (registration)
 */
export const signUpAction = async (formData: SignUpFormData, planParam?: string | null) => {
    const t = await getTranslations("AuthErrors")

    try {
        // Validate form data
        const validatedData = signUpSchema.parse(formData)

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: validatedData.email },
                    { phone: validatedData.phone || "" }
                ]
            }
        })

        if (existingUser) {
            if (existingUser.email === validatedData.email) {
                return { success: false, error: t("emailExists") }
            }
            if (validatedData.phone && existingUser.phone === validatedData.phone) {
                return { success: false, error: t("phoneExists") }
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(validatedData.password, 12)

        // Generate confirmation token or OTP based on environment
        const isOTPEnabled = process.env.OTP_ENABLED === 'TRUE'
        const confirmationToken = isOTPEnabled
            ? Math.floor(100000 + Math.random() * 900000).toString() // 6-digit OTP
            : await generateConfirmationToken() // Random token for email confirmation

        // Get current locale
        const currentLocale = await getCurrentLocale()

        // Split name into first and last name
        const nameParts = validatedData.name.trim().split(' ')
        const firstName = nameParts[0]
        const lastName = nameParts.slice(1).join(' ') || ''

        // Create user and team in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create user
            const newUser = await tx.user.create({
                data: {
                    email: validatedData.email,
                    password: hashedPassword,
                    phone: validatedData.phone || null,
                    firstName,
                    lastName,
                    provider: 'local',
                    language: currentLocale === 'pt-BR' ? 'pt_BR' : 'en',
                    confirmationToken,
                    confirmed: false,
                    blocked: false,
                }
            })

            // Create a default team for the user
            const team = await tx.team.create({
                data: {
                    name: t("defaultTeamName", { firstName }),
                    description: t("defaultTeamDescription", { firstName })
                }
            })

            // Create team member (owner)
            await tx.teamMember.create({
                data: {
                    userId: newUser.id,
                    teamId: team.id,
                    isAdmin: true,
                    canPost: true,
                    canApprove: true,
                    isOwner: true,
                    teamMemberStatus: 'accepted',
                }
            })

            // Add default survey types to the team using createMany for efficiency
            let defaultSurveyTypes = [{ name: "Product Feedback", isDefault: true, teamId: team.id }]
            defaultSurveyTypes.push(...["Customer Satisfaction", "Employee Engagement", "Market Research", "Event Feedback", "User Experience"].map(name => ({ name, isDefault: false, teamId: team.id })))

            await tx.surveyType.createMany({
                data: defaultSurveyTypes
            })

            // Update user's default team
            await tx.user.update({
                where: { id: newUser.id },
                data: { defaultTeamId: team.id }
            })

            return { user: newUser, team }
        })

        const newUser = result.user
        const team = result.team

        // Create CustomerSubscription if plan parameter is provided
        if (planParam && planParam !== 'free') {
            try {
                // Find the subscription plan by planType
                const subscriptionPlan = await prisma.subscriptionPlan.findFirst({
                    where: {
                        planType: planParam.toUpperCase() as any,
                        isActive: true
                    }
                })
                console.log("subscriptionPlan", subscriptionPlan)
                if (subscriptionPlan) {
                    // Create customer subscription with pending status for paid plans
                    const subscriptionResult = await createCustomerSubscription({
                        teamId: team.id,
                        planId: subscriptionPlan.id,
                        status: SubscriptionStatus.pending,
                        cancelAtPeriodEnd: false
                    })

                    if (!subscriptionResult.success) {
                        console.error("Failed to create customer subscription:", subscriptionResult.error)
                    }
                } else {
                    console.warn(`Subscription plan not found for plan type: ${planParam}`)
                }
            } catch (subscriptionError) {
                console.error("Error creating customer subscription:", subscriptionError)
                // Don't fail the sign-up if subscription creation fails
            }
        } else if (planParam === 'free' || !planParam) {
            // Create free subscription with active status
            try {
                const freePlan = await prisma.subscriptionPlan.findFirst({
                    where: {
                        planType: 'FREE',
                        isActive: true
                    }
                })

                if (freePlan) {
                    const subscriptionResult = await createCustomerSubscription({
                        teamId: team.id,
                        planId: freePlan.id,
                        status: SubscriptionStatus.active,
                        cancelAtPeriodEnd: false
                    })

                    if (!subscriptionResult.success) {
                        console.error("Failed to create free subscription:", subscriptionResult.error)
                    }
                }
            } catch (subscriptionError) {
                console.error("Error creating free subscription:", subscriptionError)
                // Don't fail the sign-up if subscription creation fails
            }
        }

        // Send confirmation email or OTP based on environment
        const baseUrl = (process.env.HOST || process.env.NEXTAUTH_URL || 'http://localhost:3000') + `/${currentLocale}/sign-up/otp?otp=${confirmationToken}&email=${validatedData.email}&phone=${validatedData.phone}`
        const fromEmail = process.env.FROM_EMAIL || "Opineeo <contact@opineeo.com>"

        try {
            if (isOTPEnabled) {
                // Send OTP via email (fallback until SMS is implemented)
                await resend.emails.send({
                    from: fromEmail,
                    to: [validatedData.email],
                    subject: currentLocale === 'pt-BR' ? 'Seu código de verificação' : 'Your verification code',
                    react: OTPEmail({
                        userName: firstName,
                        otpCode: confirmationToken,
                        lang: currentLocale,
                        baseUrl
                    }),
                })

                // TODO: Send OTP via SMS
                console.log(`OTP for ${validatedData.phone}: ${confirmationToken}`)
            } else {
                // Send email confirmation link
                const confirmationUrl = `${baseUrl}/${currentLocale}/sign-up/confirm?token=${confirmationToken}`
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
            }
        } catch (emailError) {
            console.error("Failed to send confirmation email:", emailError)
            // Don't fail the registration if email fails
        }

        return {
            success: true,
            message: isOTPEnabled
                ? t("otpSentSignup")
                : t("emailSent"),
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
export const logoutAction = async (redirectTo: string) => {
    try {
        await signOut({ redirect: true, redirectTo })
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
export const confirmEmailAction = async (token: string, teamId: number) => {
    const t = await getTranslations("AuthErrors")

    try {
        if (!token) {
            return { success: false, error: "Confirmation token is required" }
        }

        // Find user with the confirmation token
        const user = await prisma.user.findFirst({
            where: {
                confirmationToken: token,
                //confirmed: false,
            }
        })

        if (!user) {
            return { success: false, error: t("invalidToken") }
        }

        // Update user to confirmed and update any pending team invitations
        await prisma.$transaction(async (tx) => {
            // Update user to confirmed
            await tx.user.update({
                where: { id: user.id },
                data: {
                    confirmed: true,
                    confirmationToken: null,
                }
            })

            // Update any pending team member invitations to accepted
            await tx.teamMember.updateMany({
                where: {
                    userId: user.id,
                    teamId: teamId,
                },
                data: {
                    teamMemberStatus: "accepted"
                }
            })
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
        const confirmationToken = await generateConfirmationToken()

        // Update user with new token
        await prisma.user.update({
            where: { id: user.id },
            data: { confirmationToken }
        })

        // Get current locale
        const currentLocale = await getCurrentLocale()

        // Send confirmation email
        const baseUrl = process.env.HOST || process.env.NEXTAUTH_URL || 'http://localhost:3000'
        const fromEmail = process.env.FROM_EMAIL || "Opineeo <contact@opineeo.com>"
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
                theme: true,
                defaultTeamId: true,
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

        // Check if user's default team has exceeded usage metric
        let usagePercentage = 0;
        if (user?.defaultTeamId) {
            // Example: Check if team has exceeded ACTIVE_SURVEYS or TOTAL_COMPLETED_RESPONSES
            const usage = await prisma.usageTracking.findMany({
                where: {
                    teamId: user.defaultTeamId,
                    OR: [
                        { metricType: "ACTIVE_SURVEYS" },
                        { metricType: "TOTAL_COMPLETED_RESPONSES" }
                    ],
                    periodStart: {
                        lte: new Date()
                    },
                    periodEnd: {
                        gte: new Date()
                    }
                },
                select: {
                    metricType: true,
                    currentUsage: true,
                    limitValue: true
                }
            });

            // If any metric value exceeds its limit, set overusage to true
            if (usage && usage.length > 0) {
                // Calculate the highest usage percentage among the tracked metrics
                // If any metric has a limitValue > 0, compute currentUsage / limitValue * 100, else 0
                // overusage will be the highest percentage (rounded down), or 0 if no limits
                usagePercentage = Math.floor(
                    Math.max(
                        ...usage.map(metric =>
                            metric.limitValue > 0
                                ? (metric.currentUsage / metric.limitValue) * 100
                                : 0
                        )
                    )
                );
            }
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
            language: user.language === "pt_BR" ? "pt-BR" : "en",
            theme: user.theme as Theme,
            defaultTeamId: user.defaultTeamId,
            usagePercentage: usagePercentage
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
            const resetPasswordToken = await generateConfirmationToken()
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
            const fromEmail = process.env.FROM_EMAIL || "Opineeo <contact@opineeo.com>"
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

/**
 * Server action to confirm OTP for account verification and auto sign-in
 */
export const confirmOTPAction = async (otp: string, email?: string, phone?: string) => {
    const t = await getTranslations("AuthErrors")

    try {
        if (!otp || (!email && !phone)) {
            return { success: false, error: t("otpRequired") }
        }

        // Validate OTP format (6 digits)
        const otpSchema = z.string().regex(/^\d{6}$/, t("otpInvalidFormat"))
        const validatedOTP = otpSchema.parse(otp)



        // Auto sign-in the user using NextAuth's signIn function
        try {
            const signInResult = await signIn("otp", {
                email: email || "",
                phone: phone || "",
                otp: validatedOTP,
                redirect: false,
            })

            if (signInResult?.error || !signInResult) {
                // If sign-in fails, return success for OTP confirmation but indicate sign-in failed
                return {
                    success: false,
                    message: t("otpInvalidFormat"),
                }
            }

            // Check if user needs subscription after successful sign-in
            const subscriptionCheck = await checkSubscriptionAndRedirect(email || "")

            if (subscriptionCheck?.success && subscriptionCheck.needsCheckout && subscriptionCheck.planType) {
                // Get user's team and existing subscription
                // Check if user needs subscription after successful sign-in
                // IT IS BEING CALLED TWICE FOR SOME REASON - FIX IT
                const user = await prisma.user.findUnique({
                    where: { email: email || "" },
                    include: {
                        team: {
                            include: {
                                subscriptions: {
                                    where: {
                                        status: {
                                            in: ['active', 'trialing']
                                        }
                                    },
                                    orderBy: {
                                        createdAt: 'desc'
                                    },
                                    take: 1
                                }
                            }
                        }
                    }
                }) as Prisma.UserGetPayload<{
                    include: { team: { include: { subscriptions: true } } }
                }> | null

                if (!user?.defaultTeamId) {
                    console.error('No team found for user in OTP flow:', email)
                    return {
                        success: true,
                        message: t("accountConfirmed"),
                        needsCheckout: false
                    }
                }

                // Get existing CustomerSubscription ID if it exists
                const existingSubscriptionId = user.team?.subscriptions?.[0]?.id
                console.log('Existing CustomerSubscription ID in OTP flow:', existingSubscriptionId)

                // Create checkout session server-side
                const checkoutResult = await createCheckoutSessionAction(
                    subscriptionCheck.planType as PlanType,
                    'monthly',
                    email || "",
                    user.defaultTeamId,
                    existingSubscriptionId
                )

                if (checkoutResult.success) {
                    return {
                        success: true,
                        message: t("accountConfirmed"),
                        needsCheckout: true,
                        checkoutUrl: checkoutResult.checkoutUrl
                    }
                } else {
                    // Checkout failed, but sign-in was successful
                    return {
                        success: true,
                        message: t("accountConfirmed"),
                        needsCheckout: false
                    }
                }
            }

            // Both OTP confirmation and sign-in successful, no checkout needed
            return {
                success: true,
                message: t("accountConfirmed"),
                needsCheckout: false
            }

        } catch (signInError) {
            console.error("Sign-in after OTP confirmation failed:", signInError)
            // Still return success for OTP confirmation, but user needs to sign in manually
            return {
                success: false,
                message: t("otpInvalidFormat"),

            }
        }

    } catch (error) {
        console.error("OTP confirmation error:", error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: t("unexpectedError") }
    }
}

/**
 * Server action to create Stripe checkout session
 */
export const createCheckoutSessionAction = async (planType: PlanType, billingCycle: string = 'monthly', userEmail?: string, teamId?: number, customerSubscriptionId?: string) => {
    try {
        const result = await createCheckoutSession({
            planId: planType as PlanType,
            billingCycle: billingCycle as 'monthly' | 'yearly',
            userEmail: userEmail,
            teamId: teamId,
            customerSubscriptionId: customerSubscriptionId
        })
        console.log('result', result)

        if (!result.success) {
            return { success: false, error: result.error || 'Failed to create checkout session' }
        }

        if (!result.url) {
            return { success: false, error: 'No checkout URL received' }
        }

        return { success: true, checkoutUrl: result.url }
    } catch (error) {
        console.error('Error creating checkout session:', error)
        return { success: false, error: 'Failed to create checkout session' }
    }
}

/**
 * Server action to resend OTP for account verification
 */
export const resendOTPAction = async (email?: string, phone?: string) => {
    const t = await getTranslations("AuthErrors")

    try {
        if (!email && !phone) {
            return { success: false, error: t("emailOrPhoneRequired") }
        }

        // Find user with the email or phone
        const user = await prisma.user.findFirst({
            where: {
                confirmed: false,
                ...(email ? { email } : {}),
                ...(phone ? { phone } : {})
            }
        })

        if (!user) {
            return { success: false, error: t("userNotFound") }
        }

        // Generate new OTP (6 digits)
        const newOTP = Math.floor(100000 + Math.random() * 900000).toString()

        // Update user with new OTP
        await prisma.user.update({
            where: { id: user.id },
            data: { confirmationToken: newOTP }
        })

        // TODO: Implement SMS sending logic here
        // For now, we'll just log the OTP (in production, this should be sent via SMS)
        console.log(`OTP for ${email || phone}: ${newOTP}`)

        // Get current locale
        const currentLocale = await getCurrentLocale()

        // Send OTP via SMS (placeholder - implement your SMS provider here)
        try {
            // Example SMS sending logic (replace with your SMS provider)
            // await sendSMS({
            //     to: phone,
            //     message: `Your verification code is: ${newOTP}`
            // })

            // For now, we'll also send an email with the OTP as a fallback
            if (email) {
                const baseUrl = (process.env.HOST || process.env.NEXTAUTH_URL || 'http://localhost:3000') + `/${currentLocale}/sign-up/otp?otp=${newOTP}&email=${email}`
                const fromEmail = process.env.FROM_EMAIL || "SaaS Framework <noreply@example.com>"

                await resend.emails.send({
                    from: fromEmail,
                    to: [email],
                    subject: currentLocale === 'pt-BR' ? 'Seu código de verificação' : 'Your verification code',
                    react: OTPEmail({
                        userName: user.firstName,
                        otpCode: newOTP,
                        lang: currentLocale,
                        baseUrl
                    }),
                })
            }
        } catch (smsError) {
            console.error("Failed to send OTP:", smsError)
            // Don't fail the request if SMS/email fails
        }

        return { success: true, message: t("otpSent") }

    } catch (error) {
        console.error("Resend OTP error:", error)
        return { success: false, error: t("unexpectedError") }
    }
}
