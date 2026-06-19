"use server"

import { z } from "zod"
import { getTranslations } from "next-intl/server"
import { cookies } from "next/headers"
import { getServerAuthSession } from "@/lib/auth/server-session"
import { getUserProfile, updateUserProfile } from "@/lib/firebase/services/user-service"
import { assertCompanyMember } from "@/lib/firebase/services/company-operations"
import { adminAuth } from "@/lib/firebase/admin"
import type { UserTheme } from "@/lib/types/enums"

const updateThemeSchema = z.object({
  theme: z.enum(["light", "dark", "system"] as const),
})

const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().max(50).optional(),
  phone: z.string().optional(),
  position: z.string().max(100).optional(),
  companyName: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  twitterUrl: z.string().url().optional().or(z.literal("")),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
})

const updateLanguageSchema = z.object({
  language: z.enum(["en", "pt-BR"] as const),
})

const requireSession = async () => {
  const session = await getServerAuthSession()
  if (!session?.uid) {
    throw new Error("Not authenticated")
  }
  return session
}

export const updateUserThemeAction = async (theme: "light" | "dark" | "system") => {
  const t = await getTranslations("AuthErrors")
  try {
    const validatedData = updateThemeSchema.parse({ theme })
    const session = await requireSession()
    await updateUserProfile(session.uid, { theme: validatedData.theme as UserTheme })
    return { success: true, message: "Theme updated successfully" }
  } catch (error) {
    console.error("Update theme error:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: t("unexpectedError") }
  }
}

export const updateUserProfileAction = async (profileData: z.infer<typeof updateProfileSchema>) => {
  const t = await getTranslations("AuthErrors")
  try {
    const validatedData = updateProfileSchema.parse(profileData)
    const session = await requireSession()
    await updateUserProfile(session.uid, {
      ...(validatedData.firstName && { firstName: validatedData.firstName }),
      ...(validatedData.lastName !== undefined && { lastName: validatedData.lastName }),
      ...(validatedData.phone !== undefined && { phone: validatedData.phone }),
    })
    return { success: true, message: "Profile updated successfully" }
  } catch (error) {
    console.error("Update profile error:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: t("unexpectedError") }
  }
}

export const updateUserLanguageAction = async (language: "en" | "pt-BR") => {
  const t = await getTranslations("AuthErrors")
  try {
    const validatedData = updateLanguageSchema.parse({ language })
    const session = await requireSession()
    const dbLanguage = validatedData.language === "pt-BR" ? "pt_BR" : "en"
    await updateUserProfile(session.uid, { language: dbLanguage })
    const cookieStore = await cookies()
    cookieStore.set("user-language", dbLanguage, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
    })
    return { success: true, message: "Language updated successfully", locale: validatedData.language }
  } catch (error) {
    console.error("Update language error:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: t("unexpectedError") }
  }
}

export const updateUserAvatarAction = async (avatarUrl: string) => {
  const t = await getTranslations("AuthErrors")
  try {
    const validatedAvatarUrl = z.string().url().parse(avatarUrl)
    const session = await requireSession()
    await updateUserProfile(session.uid, { avatarUrl: validatedAvatarUrl })
    return { success: true, message: "Avatar updated successfully" }
  } catch (error) {
    console.error("Update avatar error:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: t("unexpectedError") }
  }
}

export const getUserPreferencesAction = async () => {
  try {
    const session = await requireSession()
    const user = await getUserProfile(session.uid)
    if (!user) {
      return { success: false, error: "User not found", preferences: null }
    }
    return {
      success: true,
      preferences: {
        theme: user.theme,
        language: user.language === "pt_BR" ? "pt-BR" : "en",
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
      },
    }
  } catch (error) {
    console.error("Get user preferences error:", error)
    return { success: false, error: "Failed to get user preferences", preferences: null }
  }
}

export const updateDefaultCompanyAction = async (companyId: string) => {
  try {
    const session = await requireSession()
    await assertCompanyMember(companyId, session.uid)
    await updateUserProfile(session.uid, { defaultCompanyId: companyId })
    return { success: true }
  } catch (error) {
    console.error("Update default company error:", error)
    return { success: false, error: "Failed to update default company" }
  }
}

export const deleteUserAccountAction = async (userEmail: string) => {
  const t = await getTranslations("AuthErrors")
  try {
    const session = await requireSession()
    if (session.email !== userEmail) {
      return { success: false, error: "Email does not match your account" }
    }

    await adminAuth.updateUser(session.uid, { disabled: true })
    const now = new Date()
    const dateStr = `${now.getDate()}_${now.getMonth() + 1}_${now.getFullYear()}_${now.getTime()}`
    await updateUserProfile(session.uid, {
      email: `deleted_${dateStr}_${userEmail}`,
    })

    return { success: true, message: "Account deleted successfully" }
  } catch (error) {
    console.error("Delete account error:", error)
    return { success: false, error: t("unexpectedError") }
  }
}
