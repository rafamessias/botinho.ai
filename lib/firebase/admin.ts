import { initializeApp, getApps, cert, type App, type ServiceAccount } from "firebase-admin/app"
import { getAuth, type Auth } from "firebase-admin/auth"
import { getFirestore, type Firestore } from "firebase-admin/firestore"

const parseServiceAccount = (): Record<string, string> | null => {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim()
  if (!raw) return null

  try {
    return JSON.parse(raw) as Record<string, string>
  } catch (error) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_JSON is invalid JSON. Download a service account key from Firebase Console > Project Settings > Service Accounts.",
      { cause: error },
    )
  }
}

function createAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0]!
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const serviceAccount = parseServiceAccount()

  if (serviceAccount) {
    return initializeApp({
      credential: cert(serviceAccount as ServiceAccount),
      projectId: serviceAccount.project_id ?? projectId,
    })
  }

  if (!projectId) {
    throw new Error(
      "Firebase Admin SDK is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON in .env (Firebase Console > Project Settings > Service Accounts > Generate new private key).",
    )
  }

  return initializeApp({ projectId })
}

export const adminApp = createAdminApp()
export const adminAuth: Auth = getAuth(adminApp)
export const adminDb: Firestore = getFirestore(adminApp)
