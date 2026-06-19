"use server"

import { getServerAuthSession } from "@/lib/auth/server-session"
import { adminDb } from "@/lib/firebase/admin"
import { collections, companySubcollections } from "@/lib/firebase/collections"
import { z } from "zod"

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

export const resolveCompanyContext = async (options: CompanyMembershipGuardOptions = {}) => {
  const session = await getServerAuthSession()

  if (!session?.uid) {
    throw new Error("Not authenticated")
  }

  const userId = session.uid
  const userSnap = await adminDb.collection(collections.users).doc(userId).get()
  const userData = userSnap.data()

  let companyId = options.companyId ?? userData?.defaultCompanyId ?? null

  if (!companyId) {
    const membershipSnap = await adminDb
      .collectionGroup(companySubcollections.members)
      .where("uid", "==", userId)
      .where("status", "==", "accepted")
      .limit(1)
      .get()

    companyId = membershipSnap.docs[0]?.ref.parent.parent?.id ?? null
  }

  if (!companyId) {
    throw new Error("Company not selected")
  }

  const memberSnap = await adminDb
    .collection(collections.companies)
    .doc(companyId)
    .collection(companySubcollections.members)
    .doc(userId)
    .get()

  const membership = memberSnap.data()

  if (!membership || membership.status !== "accepted") {
    throw new Error("Not authorized for this company")
  }

  if (options.requireAdmin && !membership.isAdmin) {
    throw new Error("Requires admin permissions")
  }

  if (options.requireCanPost && !(membership.isAdmin || membership.canPost)) {
    throw new Error("Insufficient permissions")
  }

  return {
    companyId,
    userId,
    membership: {
      companyMemberStatus: membership.status,
      isAdmin: membership.isAdmin,
      canPost: membership.canPost,
    },
  }
}

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
