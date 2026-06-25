"use server"

import { getServerAuthSession } from "@/lib/auth/server-session"
import { z } from "zod"
import { resolveCompanyContext } from "@/lib/botinho-auth"

export type BaseActionResponse<T = undefined> = {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export type CompanyMembershipGuardOptions = {
  companyId?: string
  requireAdmin?: boolean
  requireCanPost?: boolean
}

export { resolveCompanyContext }

export const handleAction = async <T>(fn: () => Promise<BaseActionResponse<T>>): Promise<BaseActionResponse<T>> => {
  try {
    return await fn()
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fallback = error.errors[0]?.message ?? "Invalid data"
      return { success: false, error: fallback }
    }

    if (error instanceof Error) {
      return { success: false, error: error.message }
    }

    return { success: false, error: "Unexpected error" }
  }
}

/** @deprecated Use getServerAuthSession from lib/auth/server-session */
export const getAuthSession = getServerAuthSession
