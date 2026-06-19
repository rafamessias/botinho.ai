import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend,
  Schema,
  type GenerativeModel,
} from "firebase/ai"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export const AI_MODELS = {
  suggestions: "gemini-2.0-flash",
  autoReply: "gemini-2.0-pro",
  urlSummary: "gemini-2.0-flash",
} as const

const getServerFirebaseApp = (): FirebaseApp => {
  const existing = getApps().find((app) => app.name === "server-ai")
  if (existing) {
    return existing
  }
  return initializeApp(firebaseConfig, "server-ai")
}

const getAiBackend = () => {
  const app = getServerFirebaseApp()
  return getAI(app, { backend: new GoogleAIBackend() })
}

export const getGenerativeModelFor = (modelName: string, config?: {
  temperature?: number
  maxOutputTokens?: number
  responseMimeType?: string
  responseSchema?: ReturnType<typeof Schema.object>
}): GenerativeModel => {
  const ai = getAiBackend()
  return getGenerativeModel(ai, {
    model: modelName,
    generationConfig: {
      temperature: config?.temperature ?? 0.4,
      maxOutputTokens: config?.maxOutputTokens ?? 1024,
      ...(config?.responseMimeType ? { responseMimeType: config.responseMimeType } : {}),
      ...(config?.responseSchema ? { responseSchema: config.responseSchema } : {}),
    },
  })
}

export const isAiConfigured = (): boolean =>
  Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

export { Schema }
