"use server"

import { z } from "zod"
import { SUPPORT_EMAIL } from "@/lib/constants/support"
import { sendTransactionalEmail } from "@/lib/email/send-transactional-email"

export interface ContactFormData {
    name: string
    email: string
    message: string
}

const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(10, "Message must be at least 10 characters"),
})

export async function sendContactEmail(formData: ContactFormData) {
    try {
        const validatedData = contactSchema.parse(formData)

        await sendTransactionalEmail({
            to: SUPPORT_EMAIL,
            subject: `Support Form: ${validatedData.name}`,
            text: [
                `Name: ${validatedData.name}`,
                `Email: ${validatedData.email}`,
                "",
                validatedData.message,
            ].join("\n"),
            html: `<p><strong>Name:</strong> ${validatedData.name}</p><p><strong>Email:</strong> ${validatedData.email}</p><p>${validatedData.message}</p>`,
        })

        return { success: true }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        console.error("Unexpected error sending contact email:", error)
        return {
            success: false,
            error: "An unexpected error occurred. Please try again later.",
        }
    }
}
