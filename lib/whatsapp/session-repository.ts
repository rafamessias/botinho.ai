import type { DocumentData } from "firebase-admin/firestore"
import { FieldValue } from "firebase-admin/firestore"
import { adminDb } from "@/lib/firebase/admin"
import type { SendMessageRequest, SessionStatus, WhatsAppMessage, WhatsAppSession } from "@/lib/whatsapp/types"

const SESSIONS_COLLECTION = "sessions"
const MESSAGES_COLLECTION = "messages"
const PHONE_INDEX_COLLECTION = "phoneIndex"

const stripUndefined = <T extends Record<string, unknown>>(value: T): Partial<T> =>
  Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined)) as Partial<T>

const toFirestoreSession = (session: WhatsAppSession): DocumentData =>
  stripUndefined({
    sessionId: session.sessionId,
    companyId: session.companyId,
    workerId: session.workerId,
    status: session.status,
    phoneNumber: session.phoneNumber,
    qrCode: session.qrCode,
    qrImage: session.qrImage,
    label: session.label,
    webhookUrl: session.webhookUrl,
    expiresAt: session.expiresAt ? new Date(session.expiresAt) : undefined,
    lastSeenAt: session.lastSeenAt ? new Date(session.lastSeenAt) : undefined,
    createdAt: new Date(session.createdAt),
    updatedAt: new Date(session.updatedAt),
  })

const toIso = (value: unknown): string | undefined => {
  if (!value) return undefined
  if (value instanceof Date) return value.toISOString()
  if (typeof value === "object" && value !== null && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate().toISOString()
  }
  if (typeof value === "string") return value
  return undefined
}

const mapSession = (id: string, data: DocumentData): WhatsAppSession => ({
  sessionId: id,
  companyId: String(data.companyId ?? ""),
  phoneNumber: data.phoneNumber ?? undefined,
  workerId: data.workerId ?? undefined,
  status: (data.status ?? "pending") as SessionStatus,
  qrCode: data.qrCode ?? undefined,
  qrImage: data.qrImage ?? undefined,
  expiresAt: toIso(data.expiresAt),
  label: data.label ?? undefined,
  webhookUrl: data.webhookUrl ?? undefined,
  createdAt: toIso(data.createdAt) ?? new Date().toISOString(),
  updatedAt: toIso(data.updatedAt) ?? new Date().toISOString(),
  lastSeenAt: toIso(data.lastSeenAt),
})

export class WhatsAppSessionRepository {
  async createSession(session: WhatsAppSession): Promise<void> {
    await adminDb.collection(SESSIONS_COLLECTION).doc(session.sessionId).set(toFirestoreSession(session))
  }

  async updateSession(session: WhatsAppSession): Promise<void> {
    const payload = toFirestoreSession({ ...session, updatedAt: new Date().toISOString() })
    const ref = adminDb.collection(SESSIONS_COLLECTION).doc(session.sessionId)

    if (
      !session.phoneNumber &&
      (session.status === "needs_qr" || session.status === "qr_pending" || session.status === "pending")
    ) {
      await ref.set({ ...payload, phoneNumber: FieldValue.delete() }, { merge: true })
      return
    }

    await ref.set(payload, { merge: true })
  }

  async patchSessionLabel(sessionId: string, label: string): Promise<void> {
    await adminDb.collection(SESSIONS_COLLECTION).doc(sessionId).update({
      label,
      updatedAt: new Date(),
    })
  }

  async getSession(sessionId: string): Promise<WhatsAppSession | null> {
    const snap = await adminDb.collection(SESSIONS_COLLECTION).doc(sessionId).get()
    if (!snap.exists) return null
    return mapSession(snap.id, snap.data()!)
  }

  async listSessionsByCompany(companyId: string): Promise<WhatsAppSession[]> {
    const snap = await adminDb
      .collection(SESSIONS_COLLECTION)
      .where("companyId", "==", companyId)
      .get()

    return snap.docs.map((doc) => mapSession(doc.id, doc.data()))
  }

  async deleteSession(sessionId: string): Promise<void> {
    await adminDb.collection(SESSIONS_COLLECTION).doc(sessionId).delete()
  }

  async setPhoneIndex(phoneNumber: string, sessionId: string): Promise<void> {
    await adminDb.collection(PHONE_INDEX_COLLECTION).doc(phoneNumber).set({ sessionId })
  }

  async getSessionByPhone(phoneNumber: string): Promise<string | null> {
    const snap = await adminDb.collection(PHONE_INDEX_COLLECTION).doc(phoneNumber).get()
    if (!snap.exists) return null
    const sessionId = snap.data()?.sessionId
    return typeof sessionId === "string" ? sessionId : null
  }

  async deletePhoneIndex(phoneNumber: string): Promise<void> {
    await adminDb.collection(PHONE_INDEX_COLLECTION).doc(phoneNumber).delete()
  }

  async getConnectedSessionForCompany(companyId: string): Promise<WhatsAppSession | null> {
    const sessions = await this.listSessionsByCompany(companyId)
    return sessions.find((session) => session.status === "connected") ?? null
  }

  async saveMessage(message: WhatsAppMessage): Promise<void> {
    const ref = adminDb.collection(MESSAGES_COLLECTION).doc()
    await ref.set(
      stripUndefined({
        ...message,
        id: ref.id,
        timestamp: new Date(message.timestamp),
      }),
    )
  }

  async listMessages(sessionId: string, limit = 50): Promise<WhatsAppMessage[]> {
    const snap = await adminDb
      .collection(MESSAGES_COLLECTION)
      .where("sessionId", "==", sessionId)
      .orderBy("timestamp", "desc")
      .limit(limit)
      .get()

    return snap.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        sessionId: String(data.sessionId),
        companyId: data.companyId ? String(data.companyId) : undefined,
        phoneNumber: String(data.phoneNumber),
        messageId: String(data.messageId),
        chatJid: String(data.chatJid),
        from: String(data.from),
        to: String(data.to),
        direction: data.direction,
        type: String(data.type),
        body: String(data.body),
        mediaUrl: data.mediaUrl ? String(data.mediaUrl) : undefined,
        timestamp: toIso(data.timestamp) ?? new Date().toISOString(),
      }
    })
  }
}

export type { SendMessageRequest }
