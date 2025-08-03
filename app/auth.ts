import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma/lib/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { Company } from "@/lib/generated/prisma"
import { CredentialsSignin } from "next-auth"

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
    name?: string | null
    company?: Company | null
    language?: string | null
}

const locale = async () => {
    const cookies = require('next/headers').cookies;
    return cookies().get('NEXT_LOCALE')?.value || 'en';
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
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/sign-in",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
                        include: { company: true }
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
                        company: user.company,
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
                token.company = (user as User)?.company as Company | null
                // Add language to token
                token.language = (user as User)?.language
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
                    // Don't fail the token generation, just log the error
                }
            }


            if (account?.provider === "google") {
                // Handle Google OAuth user creation/update
                const existingUser = await prisma.user.findUnique({
                    where: { email: token.email! },
                    include: { company: true }
                })

                if (!existingUser) {
                    // Get locale from cookies
                    const currentLocale = await locale()

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
                    token.company = newUser.company
                    // Add language to token
                    token.language = newUser.language
                } else {
                    token.id = existingUser.id.toString()
                    token.company = existingUser.company
                    // Add language to token
                    token.language = existingUser.language
                }
            }

            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string
                session.user.email = token.email as string
                session.user.company = token.company as Company
                // Fix the language assignment
                session.user.language = token.language as string
            }
            return session
        },
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {

                // Ensure user exists in database
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email! },
                    include: { company: true }
                })

                if (!existingUser) {
                    // Create user if doesn't exist
                    await prisma.user.create({
                        data: {
                            email: user.email!,
                            firstName: user.name?.split(' ')[0] || '',
                            lastName: user.name?.split(' ').slice(1).join(' ') || '',
                            provider: 'google',
                            type: 'companyUser',
                            language: await locale(),
                            phone: '',
                            confirmed: true,
                        }
                    })
                }
            }
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