import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma/lib/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { Company } from "@/lib/generated/prisma"

// Add type declarations at the top of the file
declare module "next-auth" {
    interface Session {
        user: {
            id: string
            email: string
            name?: string | null
            image?: string | null
            company?: Company | null
        }
    }

    interface User {
        id: string
        email: string
        name?: string | null
        image?: string | null
        company?: Company | null
    }
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
                        where: {
                            email: credentials.email as string
                        },
                        include: {
                            company: true
                        }
                    })

                    if (!user || !user.password) {
                        return null
                    }

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password as string,
                        user.password
                    )

                    if (!isPasswordValid) {
                        return null
                    }

                    return {
                        id: user.id.toString(),
                        email: user.email,
                        name: `${user.firstName} ${user.lastName}`,
                        image: null,
                        company: user.company,
                    }
                } catch (error) {
                    console.error("Auth error:", error)
                    return null
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id
                token.email = user.email
                token.company = user.company as Company
            }

            if (account?.provider === "google") {
                // Handle Google OAuth user creation/update
                const existingUser = await prisma.user.findUnique({
                    where: { email: token.email! },
                    include: { company: true }
                })

                if (!existingUser) {
                    // Create new user from Google OAuth
                    const newUser = await prisma.user.create({
                        data: {
                            email: token.email!,
                            firstName: token.name?.split(' ')[0] || '',
                            lastName: token.name?.split(' ').slice(1).join(' ') || '',
                            provider: 'google',
                            type: 'companyUser',
                            language: 'en',
                            phone: '',
                            confirmed: true,
                        },
                        include: { company: true }
                    })
                    token.id = newUser.id.toString()
                    token.company = newUser.company
                } else {
                    token.id = existingUser.id.toString()
                    token.company = existingUser.company
                }
            }

            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string
                session.user.email = token.email as string
                session.user.company = token.company as Company
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
                            language: 'en',
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