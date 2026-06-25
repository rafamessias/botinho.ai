import { cache } from "react"
import { getServerAuthSession } from "@/lib/auth/server-session"
import { adminDb } from "@/lib/firebase/admin"
import { collections, companySubcollections } from "@/lib/firebase/collections"
import { getUserProfile } from "@/lib/firebase/services/user-service"
import { resolveActiveCompanyId } from "@/lib/user-workspace"
import type { FirestoreCompanyMember } from "@/lib/firebase/types"

export type AccessMode = "read" | "write" | "manage"

export type BotinhoSessionResult = {
  ok: boolean
  error?: string
  uid?: string
  email?: string
  companyId?: string
}

type MemberPermissionFields = {
  isOwner: boolean
  isAdmin: boolean
  canPost: boolean
}

const canPostAsMember = (member: MemberPermissionFields) =>
  member.isOwner || member.isAdmin || member.canPost

const canManageAsMember = (member: MemberPermissionFields) => member.isOwner || member.isAdmin

const memberPassesMode = (member: MemberPermissionFields, mode: AccessMode): boolean => {
  if (mode === "read") return true
  if (mode === "write") return canPostAsMember(member)
  return canManageAsMember(member)
}

const loadBotinhoSession = cache(async (): Promise<BotinhoSessionResult> => {
  const session = await getServerAuthSession()
  if (!session?.uid) {
    return { ok: false, error: "Not authenticated" }
  }

  const user = await getUserProfile(session.uid)
  if (!user) {
    return { ok: false, error: "User not found" }
  }

  const companyId = await resolveActiveCompanyId(session.uid)
  if (!companyId) {
    return { ok: false, error: "Company not selected" }
  }

  return {
    ok: true,
    uid: session.uid,
    email: session.email ?? user.email,
    companyId,
  }
})

export const getBotinhoSession = (): Promise<BotinhoSessionResult> => loadBotinhoSession()

const loadCompanyMembership = cache(
  async (companyId: string, uid: string): Promise<FirestoreCompanyMember | null> => {
    const memberSnap = await adminDb
      .collection(collections.companies)
      .doc(companyId)
      .collection(companySubcollections.members)
      .doc(uid)
      .get()

    if (!memberSnap.exists) {
      return null
    }

    return memberSnap.data() as FirestoreCompanyMember
  },
)

export const assertCompanyMember = async (
  companyId: string,
  uid: string,
  mode: AccessMode = "read",
): Promise<FirestoreCompanyMember> => {
  const member = await loadCompanyMembership(companyId, uid)
  if (!member || member.status !== "accepted") {
    throw new Error("Not authorized for this company")
  }

  if (!memberPassesMode(member, mode)) {
    throw new Error(mode === "manage" ? "Requires admin permissions" : "Insufficient permissions")
  }

  return member
}

export const assertCompanyAdmin = async (
  companyId: string,
  uid: string,
): Promise<FirestoreCompanyMember> => assertCompanyMember(companyId, uid, "manage")

export type CompanyMembershipGuardOptions = {
  companyId?: string
  requireAdmin?: boolean
  requireCanPost?: boolean
}

export const resolveCompanyContext = async (options: CompanyMembershipGuardOptions = {}) => {
  const session = await getBotinhoSession()
  if (!session.ok || !session.uid) {
    throw new Error(session.error ?? "Not authenticated")
  }

  const companyId = options.companyId ?? session.companyId
  if (!companyId) {
    throw new Error("Company not selected")
  }

  const mode: AccessMode = options.requireAdmin
    ? "manage"
    : options.requireCanPost
      ? "write"
      : "read"

  const membership = await assertCompanyMember(companyId, session.uid, mode)

  return {
    companyId,
    userId: session.uid,
    membership: {
      companyMemberStatus: membership.status,
      isAdmin: membership.isAdmin || membership.isOwner,
      canPost: membership.canPost,
      isOwner: membership.isOwner,
      canApprove: membership.canApprove,
    },
  }
}
