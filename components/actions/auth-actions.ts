"use server"

import { Language } from "@/lib/generated/prisma"
import { prisma } from "@/prisma/lib/prisma"
import bcrypt from "bcryptjs"
import WelcomeEmail from "@/emails/WelcomeEmail"
import resend from "@/lib/resend"

const baseUrl = process.env.HOST;
const fromEmail = process.env.FROM_EMAIL || "Obraguru <contact@obra.guru>";

export async function signUpAction(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const phone = formData.get("phone") as string
    const language = formData.get("language") as string === "pt-BR" ? "pt_BR" : "en"

    if (!email || !password || !firstName || !lastName) {
        return { success: false, error: "Missing required fields" }
    }

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return { success: false, error: "User already exists" }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12)

        // INSERT_YOUR_CODE
        // Generate a random confirmation token using crypto
        const confirmationToken = (await import('crypto')).randomBytes(32).toString('hex');

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phone,
                language: language as Language,
                type: 'companyUser',
                provider: 'local',
                confirmed: false,
                confirmationToken,
            }
        })

        // send welcome email
        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: [user.email],
            subject: user.language === 'pt_BR' ? 'Bem-vindo à Obraguru' : 'Welcome to Obraguru',
            react: WelcomeEmail({
                userName: user.firstName,
                confirmationUrl: `${baseUrl}/sign-up/check-email?email=${user.email}&token=${confirmationToken}`,
                lang: user.language,
                baseUrl: baseUrl
            }),
        });

        return { success: true, user }
    } catch (error) {
        console.error("Sign up error:", error)
        return { success: false, error: "Sign up error" }
    }
}

export async function signInAction(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
        return { success: false, error: "Missing credentials" }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user || !user.password) {
            return { success: false, error: "Invalid credentials" }
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return { success: false, error: "Invalid credentials" }
        }

        return { success: true, user }
    } catch (error) {
        console.error("Sign in error:", error)
        return { success: false, error: "Sign in error" }
    }
}