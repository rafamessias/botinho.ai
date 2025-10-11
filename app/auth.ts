import NextAuth from "next-auth"
import { prisma } from "@/prisma/lib/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { CredentialsSignin } from "next-auth"
import WelcomeEmail from "@/emails/WelcomeEmail"
import resend from "@/lib/resend"
import { addDefaultSurveyTypes } from "@/components/server-actions/team"
import { createCustomerSubscription } from "@/lib/customer-subscription"
import { BillingInterval, PlanType, SubscriptionStatus } from "@/lib/generated/prisma"

// Add type declarations at the top of the file
declare module "next-auth" {
    interface Session {
        user?: User | null,
        error?: string | null
    }
}

interface User {
    id: string
    email: string
    password?: string | null
    name?: string | null
    company?: string | null
    language?: string | null
    avatarUrl?: string | null
    defaultTeamId?: number | null
}

const locale = async () => {
    const cookies = require('next/headers').cookies;
    const cookieStore = await cookies();
    return cookieStore.get('NEXT_LOCALE')?.value || 'en';
}


// Create custom error classes for specific error types
class InvalidCredentialsError extends CredentialsSignin {
    code = "invalid-credentials"
}

class EmailNotConfirmedError extends CredentialsSignin {
    code = "email-not-confirmed"
}

class AccountBlockedError extends CredentialsSignin {
    code = "account-blocked"
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    // Remove the PrismaAdapter since we're handling user creation manually
    // adapter: PrismaAdapter(prisma),
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: "/sign-in",
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production'
            }
        }
    },
    providers: [
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email as string },
                        include: { avatar: true }
                    })

                    if (!user || !user.password) {
                        throw new InvalidCredentialsError()
                    }
                    if (!user.confirmed) {
                        throw new EmailNotConfirmedError()
                    }
                    if (user.blocked) {
                        throw new AccountBlockedError()
                    }

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password as string,
                        user.password
                    )

                    if (!isPasswordValid) {
                        throw new InvalidCredentialsError()
                    }

                    return {
                        id: user.id.toString(),
                        email: user.email,
                        name: `${user.firstName} ${user.lastName}`,
                        language: user.language === "pt_BR" ? "pt-BR" : "en",
                        avatarUrl: user?.avatarUrl || user.avatar?.url || null,
                        defaultTeamId: user.defaultTeamId
                    }
                } catch (error) {
                    console.error("Auth error:", error)
                    if (error instanceof CredentialsSignin) {
                        throw error
                    }
                    throw new InvalidCredentialsError()
                }
            }
        }),
        CredentialsProvider({
            id: "otp",
            name: "OTP Verification",
            credentials: {
                email: { label: "Email", type: "email" },
                phone: { label: "Phone", type: "text" },
                otp: { label: "OTP Code", type: "text" }
            },
            async authorize(credentials) {
                if (!credentials?.otp || (!credentials?.email && !credentials?.phone)) {
                    return null
                }

                try {
                    // Find user with the OTP token
                    const user = await prisma.user.findFirst({
                        where: {
                            confirmationToken: credentials.otp as string,
                            confirmed: false,
                            blocked: false,
                            ...(credentials.email ? { email: credentials.email as string } : {}),
                            ...(credentials.phone ? { phone: credentials.phone as string } : {})
                        }
                    })

                    if (!user) {
                        return null
                    }

                    // Update user to confirmed and clear OTP token
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            confirmed: true,
                            confirmationToken: null,
                        }
                    })

                    return {
                        id: user.id.toString(),
                        email: user.email,
                        name: `${user.firstName} ${user.lastName}`,
                        language: user.language === "pt_BR" ? "pt-BR" : "en",
                        avatarUrl: user?.avatarUrl || null,
                        defaultTeamId: user.defaultTeamId
                    }
                } catch (error) {
                    console.error("OTP provider error:", error)
                    return null
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, account, trigger }) {
            if (user) {
                token.id = user.id
                token.email = user.email
                token.name = user.name
                token.language = (user as any)?.language
                token.avatarUrl = (user as any)?.avatarUrl
                token.defaultTeamId = (user as any)?.defaultTeamId
            }

            // Handle Google OAuth user creation/update in JWT callback
            if (account?.provider === "google" && user) {
                try {
                    const existingUser = await prisma.user.findUnique({
                        where: { email: token.email! },
                    });

                    if (!existingUser) {
                        // Get locale from cookies
                        const currentLocale = await locale();

                        // Create new user from Google OAuth
                        const newUser = await prisma.user.create({
                            data: {
                                email: token.email!,
                                firstName: token.name?.split(' ')[0] || '',
                                lastName: token.name?.split(' ').slice(1).join(' ') || '',
                                provider: 'google',
                                language: currentLocale === 'pt-BR' ? 'pt_BR' : 'en',
                                phone: '',
                                blocked: false,
                                avatarUrl: token.picture as string | null,
                                idProvider: token.id as string | null,
                                confirmed: true,
                            },
                        })

                        // Create a new team for the user and assign ownership
                        const newTeam = await prisma.team.create({
                            data: {
                                name: `${newUser.firstName || "New"}'s Team`,
                                members: {
                                    create: [
                                        {
                                            userId: newUser.id,
                                            isOwner: true,
                                            isAdmin: true,
                                            canPost: true,
                                            canApprove: true,
                                            teamMemberStatus: 'accepted',
                                        }
                                    ]
                                }
                            }
                        });

                        // Update user's default team
                        await prisma.user.update({
                            where: { id: newUser.id },
                            data: { defaultTeamId: newTeam.id }
                        });

                        await addDefaultSurveyTypes(newTeam.id)

                        // Create subscription for Google OAuth users
                        try {
                            // Read signup plan and interval from cookies
                            const { cookies } = require('next/headers');
                            const cookieStore = await cookies();

                            const signupPlan = cookieStore.get('signup_plan')?.value || null;
                            const interval = cookieStore.get('signup_interval')?.value || null;

                            let validSignupPlan: PlanType | null = null;
                            let validInterval: BillingInterval | null = null;

                            // Fetch allowed planTypes and intervals from the DB for validation
                            const allowedPlanTypes = new Set(Object.values(PlanType));
                            const allowedIntervals = new Set(
                                Object.values(BillingInterval)
                            );

                            if (signupPlan && allowedPlanTypes.has(signupPlan.toUpperCase() as PlanType)) {
                                validSignupPlan = signupPlan.toUpperCase() as PlanType;
                            }

                            if (interval && allowedIntervals.has(interval as BillingInterval)) {
                                validInterval = interval as BillingInterval;
                            }

                            console.log("signupPlan", signupPlan)
                            console.log("interval", interval)
                            console.log("validSignupPlan", validSignupPlan)
                            console.log("validInterval", validInterval)

                            if (validSignupPlan && validSignupPlan !== PlanType.FREE) {
                                // Find the subscription plan by planType
                                const subscriptionPlan = await prisma.subscriptionPlan.findFirst({
                                    where: {
                                        planType: validSignupPlan as PlanType,
                                        isActive: true
                                    }
                                })

                                if (subscriptionPlan) {
                                    // Create customer subscription with pending status for paid plans
                                    const subscriptionResult = await createCustomerSubscription({
                                        teamId: newTeam.id,
                                        planId: subscriptionPlan.id,
                                        status: SubscriptionStatus.pending,
                                        cancelAtPeriodEnd: false,
                                        billingInterval: validInterval as BillingInterval
                                    })

                                    if (!subscriptionResult.success) {
                                        console.error("Failed to create customer subscription for Google OAuth:", subscriptionResult.error)
                                    }
                                }
                            } else {
                                // Create free subscription with active status
                                const freePlan = await prisma.subscriptionPlan.findFirst({
                                    where: {
                                        planType: PlanType.FREE,
                                        isActive: true
                                    }
                                })

                                if (freePlan) {
                                    const subscriptionResult = await createCustomerSubscription({
                                        teamId: newTeam.id,
                                        planId: freePlan.id,
                                        status: SubscriptionStatus.active,
                                        cancelAtPeriodEnd: false
                                    })

                                    if (!subscriptionResult.success) {
                                        console.error("Failed to create free subscription for Google OAuth:", subscriptionResult.error)
                                    }
                                }
                            }
                        } catch (subscriptionError) {
                            console.error("Error creating subscription for Google OAuth user:", subscriptionError)
                            // Don't fail the OAuth flow if subscription creation fails
                        }

                        token.id = newUser.id.toString()
                        token.email = newUser.email
                        token.language = newUser.language
                        token.avatarUrl = newUser.avatarUrl
                        token.name = `${newUser.firstName} ${newUser.lastName}`
                        token.defaultTeamId = newTeam.id

                        const baseUrl = process.env.HOST;
                        const fromEmail = process.env.FROM_EMAIL || "Opineeo <contact@opineeo.com>";

                        // send welcome email
                        const { data, error } = await resend.emails.send({
                            from: fromEmail,
                            to: [token.email!],
                            subject: currentLocale === 'pt-BR' ? 'Bem-vindo à Opineeo' : 'Welcome to Opineeo',
                            react: WelcomeEmail({
                                userName: token.name || "",
                                confirmationUrl: `${baseUrl}/sign-up/success`,
                                lang: currentLocale,
                                baseUrl: baseUrl
                            }),
                        });

                    } else {
                        token.id = existingUser.id?.toString()
                        token.email = existingUser.email
                        token.language = existingUser.language === "pt_BR" ? "pt-BR" : "en"
                        token.avatarUrl = existingUser.avatarUrl
                        token.name = `${existingUser.firstName} ${existingUser.lastName}`
                        token.defaultTeamId = existingUser.defaultTeamId
                    }
                } catch (error) {
                    console.error('Error handling Google OAuth user:', error);
                }
            }

            // Handle session updates when trigger is 'update'
            if (trigger === 'update') {
                try {
                    // Check if we're in a server environment and not in middleware
                    if (typeof window === 'undefined' &&
                        process.env.NODE_ENV &&
                        !process.env.NEXT_RUNTIME?.includes('edge')) {

                        const updatedUser = await prisma.user.findUnique({
                            where: { email: token.email! },
                            select: {
                                language: true,
                                firstName: true,
                                lastName: true,
                                avatarUrl: true,
                                defaultTeamId: true
                            }
                        });

                        if (updatedUser) {
                            // Update token with fresh data from database
                            token.language = updatedUser.language === "pt_BR" ? "pt-BR" : "en";
                            token.name = `${updatedUser.firstName} ${updatedUser.lastName || ''}`.trim();
                            token.avatarUrl = updatedUser.avatarUrl;
                            token.defaultTeamId = updatedUser.defaultTeamId;
                        }
                    }
                } catch (error) {
                    console.error('Error updating JWT token:', error);
                }
            }

            return token
        },
        async session({ session, token }) {
            if (token) {
                // Ensure session.user exists and has all required properties
                session.user = {
                    ...session.user,
                    id: token.id as string,
                    email: token.email as string,
                    name: token.name as string,
                    avatarUrl: token.avatarUrl as string,
                    language: token.language as string,
                    defaultTeamId: token.defaultTeamId as number
                }
            }

            return session
        },
        async signIn({ user, account, profile }) {
            // Allow all sign-ins
            return true
        }
    },
    events: {
        async signIn({ user, account, profile }) {
            console.log("User signed in:", user.email)
        },
        async signOut() {
            console.log("User signed out")
        }
    }
})