import type { MemberStatus } from "@/lib/firebase/types"

export type UserMembershipSummary = {
  companyId: string
  status: MemberStatus
  isOwner: boolean
}

export const resolveActiveCompanyIdForUser = (
  user: { defaultCompanyId?: string | null },
  acceptedMemberships: Array<UserMembershipSummary & { uid: string; isAdmin: boolean; canPost: boolean; canApprove: boolean }>,
): string | null => {
  const validCompanyIds = [...new Set(acceptedMemberships.map((membership) => membership.companyId))]
  if (validCompanyIds.length === 0) {
    return null
  }

  if (user.defaultCompanyId && validCompanyIds.includes(user.defaultCompanyId)) {
    return user.defaultCompanyId
  }

  const ownedMembership = acceptedMemberships.find(
    (membership) => membership.isOwner && validCompanyIds.includes(membership.companyId),
  )
  if (ownedMembership) {
    return ownedMembership.companyId
  }

  return validCompanyIds[0] ?? null
}
