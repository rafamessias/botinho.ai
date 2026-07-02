import { adminDb } from "@/lib/firebase/admin"
import { collections, systemPropertyDocIds } from "@/lib/firebase/collections"

export type SystemProperties = {
  whatsappSkipHistorySync: boolean
  updatedAt?: string
}

const defaultSystemProperties: SystemProperties = {
  whatsappSkipHistorySync: true,
}

const toIso = (value: unknown): string | undefined => {
  if (!value) return undefined
  if (value instanceof Date) return value.toISOString()
  if (typeof value === "object" && value !== null && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate().toISOString()
  }
  if (typeof value === "string") return value
  return undefined
}

export const getSystemProperties = async (): Promise<SystemProperties> => {
  const snap = await adminDb
    .collection(collections.systemProperties)
    .doc(systemPropertyDocIds.default)
    .get()

  if (!snap.exists) {
    return defaultSystemProperties
  }

  const data = snap.data()
  return {
    whatsappSkipHistorySync: data?.whatsappSkipHistorySync !== false,
    updatedAt: toIso(data?.updatedAt),
  }
}

export const updateSystemProperties = async (
  input: Partial<SystemProperties>,
): Promise<SystemProperties> => {
  const { FieldValue } = await import("firebase-admin/firestore")
  const ref = adminDb.collection(collections.systemProperties).doc(systemPropertyDocIds.default)

  await ref.set(
    {
      ...(input.whatsappSkipHistorySync !== undefined
        ? { whatsappSkipHistorySync: input.whatsappSkipHistorySync }
        : {}),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  )

  return getSystemProperties()
}
