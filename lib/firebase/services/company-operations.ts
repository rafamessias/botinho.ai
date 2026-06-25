import { FieldValue } from "firebase-admin/firestore"
import { adminAuth, adminDb } from "@/lib/firebase/admin"
import { collections, companySubcollections } from "@/lib/firebase/collections"
import { getUserProfile } from "@/lib/firebase/services/user-service"
import {
  assertNoMembershipOutsideCompany,
  SingleCompanyMembershipError,
} from "@/lib/company-membership-guards"
import { userHasActiveCompanyMembership } from "@/lib/company-membership-guards-server"
import { loadActiveMemberships } from "@/lib/user-workspace"
import { syncUserWorkspace } from "@/lib/sync-user-workspace"
import type { FirestoreCompanyMember, MemberStatus, UserLanguage } from "@/lib/firebase/types"

const companyRef = (companyId: string) => adminDb.collection(collections.companies).doc(companyId)

const mapMemberForClient = (
  docId: string,
  member: FirestoreCompanyMember,
  user: Awaited<ReturnType<typeof getMemberProfile>>,
) => ({
  id: docId,
  uid: member.uid,
  isOwner: member.isOwner,
  isAdmin: member.isAdmin,
  canPost: member.canPost,
  canApprove: member.canApprove,
  companyMemberStatus: member.status,
  status: member.status,
  user,
})

const mapCompanyForClient = (
  companyId: string,
  data: FirebaseFirestore.DocumentData,
  members: ReturnType<typeof mapMemberForClient>[],
) => ({
  id: companyId,
  slug: data.slug as string,
  name: data.name as string,
  description: (data.description as string | undefined) ?? null,
  members,
})

export const getCompanyById = async (companyId: string) => {
  const snap = await companyRef(companyId).get()
  if (!snap.exists) {
    return null
  }
  const data = snap.data()!
  return {
    id: snap.id,
    name: data.name as string,
    description: (data.description as string | undefined) ?? null,
    tokenApi: (data.tokenApi as string | undefined) ?? null,
    slug: data.slug as string | undefined,
  }
}

export const getMemberProfile = async (uid: string) => {
  const profile = await getUserProfile(uid)
  if (!profile) {
    return null
  }
  return {
    id: profile.uid,
    firstName: profile.firstName,
    lastName: profile.lastName ?? null,
    email: profile.email,
    avatarUrl: profile.avatarUrl ?? null,
  }
}

export const assertCompanyAdmin = async (companyId: string, uid: string) => {
  const memberSnap = await companyRef(companyId).collection(companySubcollections.members).doc(uid).get()
  const member = memberSnap.data() as FirestoreCompanyMember | undefined
  if (!member || member.status !== "accepted" || !(member.isAdmin || member.isOwner)) {
    throw new Error("Not authorized")
  }
  return member
}

export const assertCompanyMember = async (companyId: string, uid: string) => {
  const memberSnap = await companyRef(companyId).collection(companySubcollections.members).doc(uid).get()
  const member = memberSnap.data() as FirestoreCompanyMember | undefined
  if (!member || member.status !== "accepted") {
    throw new Error("Not authorized")
  }
  return member
}

export const updateCompany = async (companyId: string, data: { name?: string; description?: string }) => {
  await companyRef(companyId).set(
    {
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  )
  return getCompanyById(companyId)
}

export const getCompanyWithMembers = async (companyId: string) => {
  const company = await getCompanyById(companyId)
  if (!company) {
    return null
  }

  const membersSnap = await companyRef(companyId).collection(companySubcollections.members).get()
  const members = await Promise.all(
    membersSnap.docs.map(async (doc) => {
      const member = doc.data() as FirestoreCompanyMember
      const user = await getMemberProfile(member.uid)
      return mapMemberForClient(doc.id, member, user)
    }),
  )

  return { ...company, members }
}

export const getUserCompanies = async (uid: string, onlyAccepted = false) => {
  const membershipSnap = await adminDb
    .collectionGroup(companySubcollections.members)
    .where("uid", "==", uid)
    .get()

  const companies = await Promise.all(
    membershipSnap.docs.map(async (memberDoc) => {
      const member = memberDoc.data() as FirestoreCompanyMember
      if (onlyAccepted && member.status !== "accepted") {
        return null
      }

      const ref = memberDoc.ref.parent.parent
      if (!ref) {
        return null
      }

      const companySnap = await ref.get()
      if (!companySnap.exists) {
        return null
      }

      const membersSnap = await ref.collection(companySubcollections.members).get()
      const members = await Promise.all(
        membersSnap.docs
          .filter((doc) => !onlyAccepted || (doc.data() as FirestoreCompanyMember).status === "accepted")
          .map(async (doc) => {
            const memberData = doc.data() as FirestoreCompanyMember
            const user = await getMemberProfile(memberData.uid)
            return mapMemberForClient(doc.id, memberData, user)
          }),
      )

      return mapCompanyForClient(ref.id, companySnap.data()!, members)
    }),
  )

  return companies.filter(Boolean)
}

export const updateMemberPermissions = async (
  companyId: string,
  memberUid: string,
  permissions: { isAdmin: boolean; canPost: boolean; canApprove: boolean },
) => {
  await companyRef(companyId)
    .collection(companySubcollections.members)
    .doc(memberUid)
    .set(
      {
        isAdmin: permissions.isAdmin,
        canPost: permissions.isAdmin ? true : permissions.canPost,
        canApprove: permissions.isAdmin ? true : permissions.canApprove,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    )
}

export const removeMember = async (companyId: string, memberUid: string) => {
  const memberSnap = await companyRef(companyId).collection(companySubcollections.members).doc(memberUid).get()
  const member = memberSnap.data() as FirestoreCompanyMember | undefined
  if (member?.isOwner) {
    throw new Error("Cannot remove the company owner")
  }

  await memberSnap.ref.delete()
  await syncUserWorkspace(memberUid)
}

export const inviteMemberByEmail = async (params: {
  companyId: string
  email: string
  isAdmin: boolean
  canPost: boolean
  canApprove: boolean
  inviterEmail: string
  locale: string
  confirmationToken: string
}) => {
  const company = await getCompanyById(params.companyId)
  if (!company) {
    throw new Error("Company not found")
  }

  const normalizedEmail = params.email.toLowerCase()
  let uid: string
  let temporaryPassword: string | undefined

  try {
    uid = (await adminAuth.getUserByEmail(normalizedEmail)).uid
  } catch {
    temporaryPassword = Math.random().toString(36).slice(2, 12)
    const language: UserLanguage = params.locale === "pt-BR" ? "pt_BR" : "en"
    const created = await adminAuth.createUser({
      email: normalizedEmail,
      password: temporaryPassword,
      displayName: normalizedEmail.split("@")[0],
      emailVerified: false,
    })
    uid = created.uid
    await adminDb.collection(collections.users).doc(uid).set(
      {
        uid,
        email: normalizedEmail,
        firstName: normalizedEmail.split("@")[0],
        lastName: null,
        language,
        theme: "system",
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    )
  }

  const memberRef = companyRef(params.companyId).collection(companySubcollections.members).doc(uid)
  const existing = await memberRef.get()
  if (existing.exists) {
    throw new Error("User is already a member of this company")
  }

  const activeMemberships = await loadActiveMemberships(uid)
  assertNoMembershipOutsideCompany(activeMemberships, params.companyId)

  await memberRef.set({
    uid,
    email: normalizedEmail,
    isOwner: false,
    isAdmin: params.isAdmin,
    canPost: params.isAdmin ? true : params.canPost,
    canApprove: params.isAdmin ? true : params.canApprove,
    status: "invited" as MemberStatus,
    inviteToken: params.confirmationToken,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })

  return {
    uid,
    temporaryPassword,
    companyName: String(company.name ?? "Company"),
  }
}

export const acceptCompanyInvite = async (companyId: string, token: string) => {
  const membersSnap = await companyRef(companyId).collection(companySubcollections.members).get()
  const memberDoc = membersSnap.docs.find((doc) => doc.data().inviteToken === token)
  if (!memberDoc) {
    return { success: false as const, error: "Invalid invitation token" }
  }

  const uid = memberDoc.id
  const activeMemberships = await loadActiveMemberships(uid)
  try {
    assertNoMembershipOutsideCompany(activeMemberships, companyId)
  } catch (error) {
    if (error instanceof SingleCompanyMembershipError) {
      return { success: false as const, error: "INVITE_COMPANY_CONFLICT" }
    }
    throw error
  }

  await memberDoc.ref.update({
    status: "accepted",
    inviteToken: FieldValue.delete(),
    updatedAt: FieldValue.serverTimestamp(),
  })

  await syncUserWorkspace(uid)

  return { success: true as const, uid }
}

export const resendMemberInvite = async (params: {
  companyId: string
  memberUid: string
  confirmationToken: string
}) => {
  const memberSnap = await companyRef(params.companyId)
    .collection(companySubcollections.members)
    .doc(params.memberUid)
    .get()

  const member = memberSnap.data() as FirestoreCompanyMember | undefined
  if (!member) {
    throw new Error("Member not found")
  }
  if (member.status !== "invited") {
    throw new Error("Only invited members can receive a new invitation")
  }

  const company = await getCompanyById(params.companyId)
  if (!company) {
    throw new Error("Company not found")
  }

  const profile = await getMemberProfile(params.memberUid)
  const email = member.email ?? profile?.email
  if (!email) {
    throw new Error("Member email not found")
  }

  await memberSnap.ref.update({
    inviteToken: params.confirmationToken,
    updatedAt: FieldValue.serverTimestamp(),
  })

  return {
    email,
    companyName: String(company.name ?? "Company"),
    firstName: profile?.firstName ?? email.split("@")[0],
  }
}

export const userCanCreateCompany = async (uid: string): Promise<boolean> => {
  return !(await userHasActiveCompanyMembership(uid))
}

export const updateCompanyToken = async (companyId: string, token: string) => {
  await companyRef(companyId).set({ tokenApi: token, updatedAt: FieldValue.serverTimestamp() }, { merge: true })
  return token
}
