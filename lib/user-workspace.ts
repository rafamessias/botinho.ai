import { adminDb } from "@/lib/firebase/admin"
import { companySubcollections } from "@/lib/firebase/collections"
import { getUserProfile } from "@/lib/firebase/services/user-service"
import { isActiveMemberStatus } from "@/lib/member-status"
import { resolveActiveCompanyIdForUser } from "@/lib/user-workspace-resolution"
import type { FirestoreCompanyMember, MemberStatus } from "@/lib/firebase/types"

export type { UserMembershipSummary } from "@/lib/user-workspace-resolution"
export { resolveActiveCompanyIdForUser } from "@/lib/user-workspace-resolution"

export type UserMembership = {
  companyId: string
  uid: string
  status: MemberStatus
  isOwner: boolean
  isAdmin: boolean
  canPost: boolean
  canApprove: boolean
}

const mapMembershipDoc = (
  memberDoc: FirebaseFirestore.QueryDocumentSnapshot,
): UserMembership | null => {
  const companyRef = memberDoc.ref.parent.parent
  if (!companyRef) {
    return null
  }

  const data = memberDoc.data() as FirestoreCompanyMember
  return {
    companyId: companyRef.id,
    uid: data.uid,
    status: data.status,
    isOwner: data.isOwner,
    isAdmin: data.isAdmin,
    canPost: data.canPost,
    canApprove: data.canApprove,
  }
}

export const loadMembershipsForUser = async (
  uid: string,
  options: { onlyAccepted?: boolean } = {},
): Promise<UserMembership[]> => {
  let query = adminDb
    .collectionGroup(companySubcollections.members)
    .where("uid", "==", uid) as FirebaseFirestore.Query

  if (options.onlyAccepted) {
    query = query.where("status", "==", "accepted")
  }

  const snapshot = await query.get()
  return snapshot.docs.map(mapMembershipDoc).filter((membership): membership is UserMembership => membership !== null)
}

export const loadAcceptedMemberships = async (uid: string): Promise<UserMembership[]> =>
  loadMembershipsForUser(uid, { onlyAccepted: true })

export const loadActiveMemberships = async (uid: string): Promise<UserMembership[]> => {
  const memberships = await loadMembershipsForUser(uid)
  return memberships.filter((membership) => isActiveMemberStatus(membership.status))
}

export const resolveActiveCompanyId = async (uid: string): Promise<string | null> => {
  const [user, acceptedMemberships] = await Promise.all([
    getUserProfile(uid),
    loadAcceptedMemberships(uid),
  ])

  if (!user) {
    return null
  }

  return resolveActiveCompanyIdForUser(user, acceptedMemberships)
}

export const userHasAcceptedMembership = async (uid: string): Promise<boolean> => {
  const memberships = await loadAcceptedMemberships(uid)
  return memberships.length > 0
}
