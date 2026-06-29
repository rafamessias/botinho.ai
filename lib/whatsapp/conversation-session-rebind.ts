import { FieldValue } from "firebase-admin/firestore"
import { adminDb } from "@/lib/firebase/admin"
import { collections, companySubcollections } from "@/lib/firebase/collections"
import { WhatsAppSessionRepository } from "@/lib/whatsapp/session-repository"
import { pickConnectedSessionTarget } from "@/lib/whatsapp/conversation-session-target"
import type { WhatsAppSession } from "@/lib/whatsapp/types"

const conversationsRef = (companyId: string) =>
  adminDb.collection(collections.companies).doc(companyId).collection(companySubcollections.conversations)

export type ConversationSessionRebindResult = {
  scanned: number
  updated: number
  cleared: number
}

export { pickConnectedSessionTarget } from "@/lib/whatsapp/conversation-session-target"

const isOpenConversation = (data: Record<string, unknown>): boolean => data.isArchived !== true

const isStaleConversationSession = (
  sessionId: string,
  connectedIds: Set<string>,
  existingIds: Set<string>,
): boolean => {
  if (connectedIds.has(sessionId)) {
    return false
  }

  return !existingIds.has(sessionId) || !connectedIds.has(sessionId)
}

export const rebindConversationsFromSession = async (params: {
  companyId: string
  fromSessionId: string
  targetSessionId: string | null
  limit?: number
}): Promise<ConversationSessionRebindResult> => {
  const limit = params.limit ?? 500
  const snap = await conversationsRef(params.companyId)
    .where("sessionId", "==", params.fromSessionId)
    .limit(limit)
    .get()

  let updated = 0
  let cleared = 0

  for (const doc of snap.docs) {
    if (!isOpenConversation(doc.data())) {
      continue
    }

    if (params.targetSessionId) {
      await doc.ref.update({
        sessionId: params.targetSessionId,
        updatedAt: FieldValue.serverTimestamp(),
      })
      updated += 1
      continue
    }

    await doc.ref.update({
      sessionId: FieldValue.delete(),
      updatedAt: FieldValue.serverTimestamp(),
    })
    cleared += 1
  }

  return {
    scanned: snap.size,
    updated,
    cleared,
  }
}

export const repairStaleConversationSessions = async (params: {
  companyId: string
  preferredSessionId?: string
  connectedSessions?: WhatsAppSession[]
  limit?: number
}): Promise<ConversationSessionRebindResult> => {
  const repository = new WhatsAppSessionRepository()
  const allSessions =
    params.connectedSessions ?? (await repository.listSessionsByCompany(params.companyId))

  const connectedIds = new Set(
    allSessions
      .filter((session) => session.status === "connected" && session.phoneNumber)
      .map((session) => session.sessionId),
  )
  const existingIds = new Set(allSessions.map((session) => session.sessionId))
  const targetSessionId = pickConnectedSessionTarget(allSessions, params.preferredSessionId)
  const limit = params.limit ?? 200

  const snap = await conversationsRef(params.companyId)
    .orderBy("updatedAt", "desc")
    .limit(limit)
    .get()

  let updated = 0
  let cleared = 0
  let scanned = 0

  for (const doc of snap.docs) {
    const data = doc.data()
    if (!isOpenConversation(data)) {
      continue
    }

    const sessionId = typeof data.sessionId === "string" ? data.sessionId : null
    if (!sessionId || !isStaleConversationSession(sessionId, connectedIds, existingIds)) {
      continue
    }

    scanned += 1

    if (!targetSessionId) {
      if (!existingIds.has(sessionId)) {
        await doc.ref.update({
          sessionId: FieldValue.delete(),
          updatedAt: FieldValue.serverTimestamp(),
        })
        cleared += 1
      }
      continue
    }

    await doc.ref.update({
      sessionId: targetSessionId,
      updatedAt: FieldValue.serverTimestamp(),
    })
    updated += 1
  }

  if (updated > 0 || cleared > 0) {
    console.info("[whatsapp] repaired stale conversation session bindings:", {
      companyId: params.companyId,
      preferredSessionId: params.preferredSessionId ?? null,
      targetSessionId,
      scanned,
      updated,
      cleared,
    })
  }

  return { scanned, updated, cleared }
}
