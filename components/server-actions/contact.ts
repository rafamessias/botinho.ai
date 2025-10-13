"use server"

import { z } from "zod"
import resend from "@/lib/resend"
import ContactEmail from "@/emails/ContactEmail"
import { emailConfig } from "@/lib/emailConfig"
import { checkBotId } from 'botid/server'

// Types for form data
export interface ContactFormData {
    name: string
    email: string
    message: string
}

// Validation schema
const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(10, "Message must be at least 10 characters"),
})

/**
 * Send contact form email using Resend
 */
export async function sendContactEmail(formData: ContactFormData) {
    try {
        // Bot protection
        const verification = await checkBotId();

        if (verification.isBot) {
            throw new Error('Access denied');
        }

        // Validate form data
        const validatedData = contactSchema.parse(formData)

        // Send email using Resend
        const { data, error } = await resend.emails.send({
            from: emailConfig.fromEmail,
            to: "contact@opineeo.com", // Send to your support email
            replyTo: validatedData.email, // Allow direct reply to the user
            subject: `Support Form: ${validatedData.name}`,
            react: ContactEmail({
                name: validatedData.name,
                email: validatedData.email,
                message: validatedData.message,
            }),
        })

        if (error) {
            console.error("Error sending contact email:", error)
            return {
                success: false,
                error: "Failed to send message. Please try again later.",
            }
        }

        return {
            success: true,
            data,
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.errors[0].message,
            }
        }

        console.error("Unexpected error sending contact email:", error)
        return {
            success: false,
            error: "An unexpected error occurred. Please try again later.",
        }
    }
}

