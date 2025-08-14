import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma/lib/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { CredentialsSignin } from "next-auth"
import { User as UserType } from "@/components/types/prisma"
import WelcomeEmail from "@/emails/WelcomeEmail"
import resend from "@/lib/resend"

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
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/sign-in",
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
                        where: { email: credentials.email as string }
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
                        company: user?.companyId?.toString(),
                        language: user.language === "pt_BR" ? "pt-BR" : "en",
                    }
                } catch (error) {
                    console.error("Auth error:", error)
                    if (error instanceof CredentialsSignin) {
                        throw error
                    }
                    throw new InvalidCredentialsError()
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, account, trigger }) {
            if (user) {
                token.id = user.id
                token.email = user.email
                token.company = (user as any)?.company
                token.language = (user as any)?.language
            }

            // Handle Google OAuth user creation/update in JWT callback
            if (account?.provider === "google" && user) {
                try {
                    const existingUser = await prisma.user.findUnique({
                        where: { email: token.email! }
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
                                type: 'companyUser',
                                language: currentLocale === 'pt-BR' ? 'pt_BR' : 'en',
                                phone: '',
                                confirmed: true,
                            },
                            include: { company: true }
                        })
                        token.id = newUser.id.toString()
                        token.email = newUser.email
                        token.company = newUser.companyId?.toString()
                        token.language = newUser.language

                        const baseUrl = process.env.HOST;
                        const fromEmail = process.env.FROM_EMAIL || "Obraguru <contact@obra.guru>";

                        // send welcome email
                        const { data, error } = await resend.emails.send({
                            from: fromEmail,
                            to: [token.email!],
                            subject: currentLocale === 'pt-BR' ? 'Bem-vindo à Obraguru' : 'Welcome to Obraguru',
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
                        token.company = existingUser.companyId?.toString()
                        token.language = existingUser.language
                    }
                } catch (error) {
                    console.error('Error handling Google OAuth user:', error);
                }
            }

            // Only handle session updates on the server side and avoid middleware context
            if (trigger === 'update' && (token.email && !token.company)) {
                try {
                    // Check if we're in a server environment and not in middleware
                    if (typeof window === 'undefined' &&
                        process.env.NODE_ENV &&
                        !process.env.NEXT_RUNTIME?.includes('edge')) {

                        const updatedUser = await prisma.user.findUnique({
                            where: { email: token.email! },
                            include: { company: true }
                        });

                        if (updatedUser) {
                            token.company = updatedUser.company;
                            token.language = updatedUser.language === "pt_BR" ? "pt-BR" : "en";
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
                session.user.id = token.id as string
                session.user.email = token.email as string
                session.user.company = token.company as string
                session.user.language = token.language as string
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