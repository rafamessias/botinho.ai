import { FieldValue } from "firebase-admin/firestore"
import { adminDb } from "@/lib/firebase/admin"
import { collections } from "@/lib/firebase/collections"

export const backfillOnboardingStatus = async () => {
  const snapshot = await adminDb.collection(collections.users).get()
  let completed = 0
  let pending = 0

  for (const doc of snapshot.docs) {
    const data = doc.data()
    if (data.onboardingStatus) {
      continue
    }

    if (data.defaultCompanyId) {
      await doc.ref.update({
        onboardingStatus: "completed",
        updatedAt: FieldValue.serverTimestamp(),
      })
      completed += 1
      continue
    }

    await doc.ref.update({
      onboardingStatus: "pending",
      onboardingStep: 1,
      updatedAt: FieldValue.serverTimestamp(),
    })
    pending += 1
  }

  return { completed, pending, total: snapshot.size }
}
