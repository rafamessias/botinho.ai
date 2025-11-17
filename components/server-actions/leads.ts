"use server"

import { z } from "zod"
import { prisma } from "@/lib/generated/prisma"

// Validation schema for lead form
const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  captchaToken: z.string().min(1, "Captcha verification is required"),
})

export interface LeadFormData {
  name: string
  email: string
  captchaToken: string
}

/**
 * Verify Turnstile captcha token
 */
async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY

  if (!secretKey) {
    console.warn("TURNSTILE_SECRET_KEY not set, skipping captcha verification")
    return true // Allow in development if key not set
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
      }),
    })

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error("Error verifying Turnstile token:", error)
    return false
  }
}

/**
 * Save lead to database
 */
export async function saveLead(formData: LeadFormData) {
  try {
    // Verify captcha first
    const isCaptchaValid = await verifyTurnstileToken(formData.captchaToken)
    if (!isCaptchaValid) {
      return {
        success: false,
        error: "Verification failed. Please try again.",
      }
    }

    // Validate form data
    const validatedData = leadSchema.parse(formData)

    // Save lead to database
    const lead = await prisma.lead.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        source: "landing_page",
      },
    })

    return {
      success: true,
      data: lead,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      }
    }

    console.error("Unexpected error saving lead:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    }
  }
}

