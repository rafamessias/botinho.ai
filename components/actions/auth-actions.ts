"use server"

import { Language } from "@/lib/generated/prisma"
import { prisma } from "@/prisma/lib/prisma"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

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
            }
        })

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