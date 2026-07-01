import { FieldValue, Timestamp } from "firebase-admin/firestore"
import { adminDb } from "@/lib/firebase/admin"
import { collections, companySubcollections, settingsDocIds } from "@/lib/firebase/collections"
import { slugifyCompanyName, withSlugSuffix } from "@/lib/firebase/slug"
import { userHasActiveCompanyMembership } from "@/lib/company-membership-guards-server"
import { syncUserWorkspace } from "@/lib/sync-user-workspace"
import type { FirestoreCompanyMember, FirestoreCompanySettings } from "@/lib/firebase/types"

const defaultSettings = (): Omit<FirestoreCompanySettings, "updatedAt"> => ({
  emailNotifications: true,
  newMessageAlerts: true,
  dailyReports: false,
  autoReply: true,
  smsFallbackEnabled: false,
})

const reserveUniqueSlug = async (name: string): Promise<string> => {
  const base = slugifyCompanyName(name)
  let candidate = base
  let attempt = 2

  while (true) {
    const existing = await adminDb
      .collection(collections.companies)
      .where("slug", "==", candidate)
      .limit(1)
      .get()

    if (existing.empty) {
      return candidate
    }

    candidate = withSlugSuffix(base, attempt)
    attempt += 1
  }
}

export const createCompanyForUser = async (params: {
  uid: string
  firstName: string
  companyName?: string
  companyDescription?: string
}) => {
  if (await userHasActiveCompanyMembership(params.uid)) {
    throw new Error("ALREADY_HAS_COMPANY")
  }

  const name = params.companyName ?? `${params.firstName}'s Company`
  const slug = await reserveUniqueSlug(name)
  const now = FieldValue.serverTimestamp()
  const companyRef = adminDb.collection(collections.companies).doc()

  await adminDb.runTransaction(async (tx) => {
    tx.set(companyRef, {
      slug,
      name,
      description: params.companyDescription ?? name,
      createdAt: now,
      updatedAt: now,
    })

    const member = {
      uid: params.uid,
      isOwner: true,
      isAdmin: true,
      canPost: true,
      canApprove: true,
      canManageAgenda: true,
      status: "accepted" as const,
      createdAt: now,
      updatedAt: now,
    }

    tx.set(companyRef.collection(companySubcollections.members).doc(params.uid), member)

    tx.set(companyRef.collection(companySubcollections.settings).doc(settingsDocIds.default), {
      ...defaultSettings(),
      updatedAt: now,
    })

    tx.set(adminDb.collection(collections.users).doc(params.uid), {
      defaultCompanyId: companyRef.id,
      updatedAt: now,
    }, { merge: true })
  })

  const { createFreeSubscriptionForCompany } = await import("@/lib/firebase/services/subscription-service")
  try {
    await createFreeSubscriptionForCompany(companyRef.id)
  } catch (error) {
    console.error(`Failed to create free subscription for company ${companyRef.id}:`, error)
  }

  await syncUserWorkspace(params.uid)

  return { companyId: companyRef.id, slug }
}

export const getUserCompaniesLight = async (uid: string, defaultCompanyId?: string) => {
  const snapshot = await adminDb.collectionGroup(companySubcollections.members).where("uid", "==", uid).where("status", "==", "accepted").get()

  const companies = await Promise.all(
    snapshot.docs.map(async (memberDoc) => {
      const companyRef = memberDoc.ref.parent.parent
      if (!companyRef) {
        return null
      }

      const companySnap = await companyRef.get()
      if (!companySnap.exists) {
        return null
      }

      const data = companySnap.data()!
      const member = memberDoc.data() as FirestoreCompanyMember

      return {
        id: companyRef.id,
        slug: data.slug as string,
        name: data.name as string,
        members: [
          {
            id: memberDoc.id,
            isAdmin: member.isAdmin,
            canPost: member.canPost,
            canApprove: member.canApprove,
            canManageAgenda: member.canManageAgenda ?? member.isAdmin ?? member.isOwner ?? false,
            isOwner: member.isOwner,
          },
        ],
      }
    }),
  )

  return companies.filter(Boolean) as Array<{
    id: string
    slug: string
    name: string
    members: Array<{
      id: string
      isAdmin: boolean
      canPost: boolean
      canApprove: boolean
      canManageAgenda: boolean
      isOwner: boolean
    }>
  }>
}

export const getCompanyIdBySlug = async (slug: string): Promise<string | null> => {
  const snap = await adminDb.collection(collections.companies).where("slug", "==", slug).limit(1).get()
  return snap.empty ? null : snap.docs[0]!.id
}

export const timestampNow = () => Timestamp.now()
