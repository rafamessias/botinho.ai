"use server"

import { z } from "zod"
import { getTranslations } from "next-intl/server"
import bcrypt from "bcryptjs"
import { getServerAuthSession } from "@/lib/auth/server-session"
import { createCompanyForUser, getUserCompaniesLight } from "@/lib/firebase/services/company-service"
import {
  assertCompanyAdmin,
  assertCompanyMember,
  getCompanyById as fetchCompanyById,
  getCompanyWithMembers,
  getUserCompanies,
  inviteMemberByEmail,
  removeMember,
  updateCompany,
  updateCompanyToken,
  updateMemberPermissions,
} from "@/lib/firebase/services/company-operations"
import { getCompanySubscription } from "@/lib/firebase/services/subscription-service"
import { generateConfirmationToken, getCurrentLocale } from "./auth"
import { sendTransactionalEmail } from "@/lib/email/send-transactional-email"
import { buildCompanyInviteEmail } from "@/lib/email/email-messages"
import { validateApiAccess } from "@/lib/services/subscription-validation"

const createCompanySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
})

const updateCompanySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2),
  description: z.string().optional(),
})

const inviteMemberSchema = z.object({
  companyId: z.string().min(1),
  email: z.string().email(),
  isAdmin: z.boolean().default(false),
  canPost: z.boolean().default(true),
  canApprove: z.boolean().default(false),
})

const updateMemberSchema = z.object({
  companyId: z.string().min(1),
  userId: z.string().min(1),
  isAdmin: z.boolean(),
  canPost: z.boolean(),
  canApprove: z.boolean(),
})

const removeMemberSchema = z.object({
  companyId: z.string().min(1),
  userId: z.string().min(1),
})

const tokenSchema = z.object({
  companyId: z.string().min(1),
  tokenType: z.enum(["survey", "api"]).default("api"),
})

const bulkInviteMembersSchema = z.object({
  companyId: z.string().min(1),
  members: z.array(
    z.object({
      email: z.string().email(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      isAdmin: z.union([z.boolean(), z.string()]).optional(),
      canPost: z.union([z.boolean(), z.string()]).optional(),
      canApprove: z.union([z.boolean(), z.string()]).optional(),
    }),
  ),
})

const requireSession = async () => {
  const session = await getServerAuthSession()
  if (!session?.uid || !session.email) {
    throw new Error("Not authenticated")
  }
  return session
}

export const createCompanyAction = async (formData: z.infer<typeof createCompanySchema>) => {
  const t = await getTranslations("Company")
  try {
    const session = await requireSession()
    const validatedData = createCompanySchema.parse(formData)
    const { companyId } = await createCompanyForUser({
      uid: session.uid,
      firstName: session.email!.split("@")[0],
      companyName: validatedData.name,
      companyDescription: validatedData.description,
    })
    const company = await fetchCompanyById(companyId)
    return { success: true, message: t("messages.createSuccess"), company }
  } catch (error) {
    console.error("Create company error:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: t("messages.createFailed") }
  }
}

export const updateCompanyAction = async (formData: z.infer<typeof updateCompanySchema>) => {
  const t = await getTranslations("Company")
  try {
    const session = await requireSession()
    const validatedData = updateCompanySchema.parse(formData)
    await assertCompanyAdmin(validatedData.id, session.uid)
    const company = await updateCompany(validatedData.id, {
      name: validatedData.name,
      description: validatedData.description,
    })
    return { success: true, message: t("messages.updateSuccess"), company }
  } catch (error) {
    console.error("Update company error:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: t("messages.updateFailed") }
  }
}

export const inviteMemberAction = async (formData: z.infer<typeof inviteMemberSchema>) => {
  const t = await getTranslations("Company")
  try {
    const session = await requireSession()
    const validatedData = inviteMemberSchema.parse(formData)
    await assertCompanyAdmin(validatedData.companyId, session.uid)

    const currentLocale = await getCurrentLocale()
    const confirmationToken = await generateConfirmationToken()
    const invite = await inviteMemberByEmail({
      companyId: validatedData.companyId,
      email: validatedData.email,
      isAdmin: validatedData.isAdmin,
      canPost: validatedData.canPost,
      canApprove: validatedData.canApprove,
      inviterEmail: session.email!,
      locale: currentLocale,
      confirmationToken,
    })

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const invitationUrl = `${baseUrl}/${currentLocale}/sign-up/confirm?token=${confirmationToken}&companyId=${validatedData.companyId}`
    const firstName = validatedData.email.trim().split("@")[0]
    const inviteEmail = buildCompanyInviteEmail({
      firstName,
      companyName: invite.companyName,
      inviterEmail: session.email!,
      invitationUrl,
      locale: currentLocale === "pt-BR" ? "pt-BR" : "en",
      temporaryPassword: invite.temporaryPassword,
    })

    await sendTransactionalEmail({
      to: validatedData.email,
      subject: inviteEmail.subject,
      text: inviteEmail.text,
    })

    return { success: true, message: t("messages.inviteSuccess") }
  } catch (error) {
    console.error("Invite member error:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: error instanceof Error ? error.message : t("messages.inviteFailed") }
  }
}

export const updateMemberAction = async (formData: z.infer<typeof updateMemberSchema>) => {
  const t = await getTranslations("Company")
  try {
    const session = await requireSession()
    const validatedData = updateMemberSchema.parse(formData)
    await assertCompanyAdmin(validatedData.companyId, session.uid)
    await updateMemberPermissions(validatedData.companyId, validatedData.userId, {
      isAdmin: validatedData.isAdmin,
      canPost: validatedData.canPost,
      canApprove: validatedData.canApprove,
    })
    return { success: true, message: t("messages.memberUpdateSuccess") }
  } catch (error) {
    console.error("Update member error:", error)
    return { success: false, error: t("messages.memberUpdateFailed") }
  }
}

export const bulkInviteMembersAction = async (formData: z.infer<typeof bulkInviteMembersSchema>) => {
  const t = await getTranslations("Company")
  try {
    const session = await requireSession()
    const validatedData = bulkInviteMembersSchema.parse(formData)
    await assertCompanyAdmin(validatedData.companyId, session.uid)

    const currentLocale = await getCurrentLocale()
    const results = { successCount: 0, errorCount: 0, errors: [] as string[] }

    for (const memberData of validatedData.members) {
      try {
        const normalizeBool = (val: unknown): boolean => {
          if (typeof val === "boolean") return val
          if (typeof val === "string") {
            const lower = val.toLowerCase().trim()
            return lower === "true" || lower === "yes" || lower === "1" || lower === "y"
          }
          return false
        }

        const confirmationToken = await generateConfirmationToken()
        const invite = await inviteMemberByEmail({
          companyId: validatedData.companyId,
          email: memberData.email,
          isAdmin: normalizeBool(memberData.isAdmin ?? false),
          canPost: normalizeBool(memberData.canPost ?? true),
          canApprove: normalizeBool(memberData.canApprove ?? false),
          inviterEmail: session.email!,
          locale: currentLocale,
          confirmationToken,
        })

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        const invitationUrl = `${baseUrl}/${currentLocale}/sign-up/confirm?token=${confirmationToken}&companyId=${validatedData.companyId}`
        const firstName = memberData.firstName || memberData.email.trim().split("@")[0]
        const inviteEmail = buildCompanyInviteEmail({
          firstName,
          companyName: invite.companyName,
          inviterEmail: session.email!,
          invitationUrl,
          locale: currentLocale === "pt-BR" ? "pt-BR" : "en",
          temporaryPassword: invite.temporaryPassword,
        })

        await sendTransactionalEmail({
          to: memberData.email,
          subject: inviteEmail.subject,
          text: inviteEmail.text,
        })

        results.successCount += 1
      } catch (error) {
        results.errorCount += 1
        results.errors.push(`${memberData.email}: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }

    if (results.errorCount > 0 && results.successCount === 0) {
      return { success: false, error: t("messages.bulkInviteFailed"), ...results }
    }

    return {
      success: true,
      message: t("messages.bulkInviteSuccess", { count: results.successCount }),
      ...results,
    }
  } catch (error) {
    console.error("Bulk invite members error:", error)
    return { success: false, error: t("messages.bulkInviteFailed") }
  }
}

export const removeMemberAction = async (formData: z.infer<typeof removeMemberSchema>) => {
  const t = await getTranslations("Company")
  try {
    const session = await requireSession()
    const validatedData = removeMemberSchema.parse(formData)
    await assertCompanyAdmin(validatedData.companyId, session.uid)
    await removeMember(validatedData.companyId, validatedData.userId)
    return { success: true, message: t("messages.memberRemoveSuccess") }
  } catch (error) {
    console.error("Remove member error:", error)
    return { success: false, error: t("messages.memberRemoveFailed") }
  }
}

export const deleteCompanyAction = async () => {
  return { success: false, error: "Deleting companies is not allowed" }
}

export const getCompanyAction = async (companyId: string) => {
  try {
    const session = await requireSession()
    await assertCompanyMember(companyId, session.uid)
    const company = await getCompanyWithMembers(companyId)
    if (!company) {
      return { success: false, error: "Company not found" }
    }
    return { success: true, company }
  } catch (error) {
    console.error("Get company error:", error)
    return { success: false, error: "Failed to get company information" }
  }
}

export const getUserCompaniesAction = async (onlyMyCompaniesMembers: boolean = false) => {
  try {
    const session = await requireSession()
    const companies = await getUserCompanies(session.uid, onlyMyCompaniesMembers)
    return { success: true, companies }
  } catch (error) {
    console.error("Get user companies error:", error)
    return { success: false, error: "Failed to get companies" }
  }
}

const generateToken = async () => {
  const randomString = Math.random().toString(36) + Date.now().toString(36)
  return bcrypt.hash(randomString, 10)
}

export const generateCompanyTokenAction = async (formData: z.infer<typeof tokenSchema>) => {
  const t = await getTranslations("Company")
  try {
    const session = await requireSession()
    const validatedData = tokenSchema.parse(formData)
    await assertCompanyAdmin(validatedData.companyId, session.uid)

    if (validatedData.tokenType === "api") {
      const hasApiAccess = await validateApiAccess(validatedData.companyId)
      if (!hasApiAccess) {
        return {
          success: false,
          error: "API access is not available in your current plan",
          requiresUpgrade: true,
          limitType: "apis",
        }
      }
    }

    const token = await generateToken()
    await updateCompanyToken(validatedData.companyId, token)
    return { success: true, message: t("messages.tokenGenerated"), token }
  } catch (error) {
    console.error("Generate company token error:", error)
    return { success: false, error: t("messages.tokenGenerationFailed") }
  }
}

export const regenerateCompanyTokenAction = generateCompanyTokenAction

export const getCompanyTokenAction = async (companyId: string) => {
  try {
    const session = await requireSession()
    await assertCompanyAdmin(companyId, session.uid)
    const company = await fetchCompanyById(companyId)
    if (!company) {
      return { success: false, error: "Company not found" }
    }
    return {
      success: true,
      company: {
        id: company.id,
        name: company.name,
        tokenApi: company.tokenApi,
      },
    }
  } catch (error) {
    console.error("Get company token error:", error)
    return { success: false, error: "Failed to get company token" }
  }
}

export const getUserCompaniesLightAction = async (userId: string, defaultCompanyId: string) => {
  try {
    const companies = await getUserCompaniesLight(userId, defaultCompanyId)
    let customerSubscription = null
    if (defaultCompanyId) {
      customerSubscription = await getCompanySubscription(defaultCompanyId)
    }
    return { success: true, companies, customerSubscription }
  } catch (error) {
    console.error("Get user companies light error:", error)
    return { success: false, error: "Failed to get companies" }
  }
}

export const getCompanyById = async (companyId: string) => {
  try {
    const company = await fetchCompanyById(companyId)
    if (!company) {
      return { success: false, error: "Company not found" }
    }
    return { success: true, company }
  } catch (error) {
    console.error("Get company by id error:", error)
    return { success: false, error: "Failed to get company" }
  }
}

export const updateCompanyBrandingAction = async () => ({ success: true })
