import { FieldValue } from "firebase-admin/firestore"
import { adminDb } from "@/lib/firebase/admin"
import { collections } from "@/lib/firebase/collections"
import type { FirestoreUser, UserLanguage, UserTheme } from "@/lib/firebase/types"

export const getUserProfile = async (uid: string): Promise<FirestoreUser | null> => {
  const snap = await adminDb.collection(collections.users).doc(uid).get()
  if (!snap.exists) {
    return null
  }
  return snap.data() as FirestoreUser
}

export const createUserProfile = async (params: {
  uid: string
  email: string
  firstName: string
  lastName?: string
  phone?: string
  language: UserLanguage
  theme?: UserTheme
  avatarUrl?: string
}) => {
  const now = FieldValue.serverTimestamp()
  await adminDb.collection(collections.users).doc(params.uid).set({
    uid: params.uid,
    email: params.email,
    firstName: params.firstName,
    lastName: params.lastName ?? null,
    phone: params.phone ?? null,
    language: params.language,
    theme: params.theme ?? "system",
    avatarUrl: params.avatarUrl ?? null,
    createdAt: now,
    updatedAt: now,
  })
}

export const updateUserProfile = async (uid: string, data: Partial<FirestoreUser>) => {
  await adminDb.collection(collections.users).doc(uid).set(
    {
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  )
}

export const mapUserToClient = (user: FirestoreUser) => ({
  id: user.uid,
  uid: user.uid,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName ?? null,
  name: [user.firstName, user.lastName].filter(Boolean).join(" "),
  phone: user.phone ?? null,
  avatarUrl: user.avatarUrl ?? null,
  language: user.language === "pt_BR" ? "pt-BR" : "en",
  theme: user.theme,
  defaultCompanyId: user.defaultCompanyId ?? null,
  usagePercentage: 0,
})
