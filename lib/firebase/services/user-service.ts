import { cache } from "react"
import { FieldValue } from "firebase-admin/firestore"
import { adminDb } from "@/lib/firebase/admin"
import { collections } from "@/lib/firebase/collections"
import type { FirestoreUser, OnboardingStatus, OnboardingStep, UserLanguage, UserTheme } from "@/lib/firebase/types"

const loadUserProfile = cache(async (uid: string): Promise<FirestoreUser | null> => {
  const snap = await adminDb.collection(collections.users).doc(uid).get()
  if (!snap.exists) {
    return null
  }
  return snap.data() as FirestoreUser
})

export const getUserProfile = (uid: string): Promise<FirestoreUser | null> => loadUserProfile(uid)

export const createUserProfile = async (params: {
  uid: string
  email: string
  firstName: string
  lastName?: string
  phone?: string
  language: UserLanguage
  theme?: UserTheme
  avatarUrl?: string
  onboardingStatus?: OnboardingStatus
  onboardingStep?: OnboardingStep
  preferredPlanType?: string | null
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
    onboardingStatus: params.onboardingStatus ?? "pending",
    onboardingStep: params.onboardingStep ?? 1,
    preferredPlanType: params.preferredPlanType ?? null,
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

export const completeUserOnboarding = async (uid: string) => {
  await adminDb.collection(collections.users).doc(uid).set(
    {
      onboardingStatus: "completed",
      onboardingCompletedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  )
}

export const updateOnboardingStep = async (uid: string, step: OnboardingStep) => {
  await adminDb.collection(collections.users).doc(uid).update({
    onboardingStep: step,
    updatedAt: FieldValue.serverTimestamp(),
  })
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
  onboardingStatus: user.onboardingStatus ?? null,
  onboardingStep: user.onboardingStep ?? null,
  usagePercentage: 0,
})
