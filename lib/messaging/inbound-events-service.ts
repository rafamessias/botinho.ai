import { FieldValue, Timestamp } from "firebase-admin/firestore"
import { adminDb } from "@/lib/firebase/admin"
import { collections, companySubcollections } from "@/lib/firebase/collections"
import type { FirestoreInboundEvent, InboundEventStatus } from "@/lib/firebase/types"
import { buildInboundEventId } from "@/lib/messaging/inbound-event-id"
import type { InboundEventRecord } from "@/lib/messaging/types"

const inboundEventsRef = (companyId: string) =>
  adminDb.collection(collections.companies).doc(companyId).collection(companySubcollections.inboundEvents)

const toDate = (value: unknown): Date => {
  if (!value) return new Date()
  if (value instanceof Date) return value
  if (value instanceof Timestamp) return value.toDate()
  if (typeof value === "string") {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed
  }
  return new Date()
}

export const mapInboundEvent = (companyId: string, id: string, data: FirestoreInboundEvent): InboundEventRecord => ({
  id,
  companyId,
  channel: data.channel,
  sessionId: data.sessionId,
  messageId: data.messageId,
  from: data.from,
  to: data.to,
  body: data.body,
  type: data.type,
  timestamp: toDate(data.timestamp),
  phoneNumber: data.phoneNumber,
  quotedMessageId: data.quotedMessageId,
  quotedBody: data.quotedBody,
  quotedParticipant: data.quotedParticipant,
  senderJid: data.senderJid,
  status: data.status,
  attempts: data.attempts ?? 0,
  lastError: data.lastError ?? null,
  nextAttemptAt: data.nextAttemptAt ? toDate(data.nextAttemptAt) : null,
  inboxMessageId: data.inboxMessageId ?? null,
  conversationId: data.conversationId ?? null,
  autoReplyStatus: data.autoReplyStatus,
  autoReplyReason: data.autoReplyReason ?? null,
  metricsReceivedCounted: data.metricsReceivedCounted,
  createdAt: toDate(data.createdAt),
  updatedAt: toDate(data.updatedAt),
  processedAt: data.processedAt ? toDate(data.processedAt) : null,
})

export const getInboundEvent = async (companyId: string, eventId: string) => {
  const snap = await inboundEventsRef(companyId).doc(eventId).get()
  if (!snap.exists) return null
  return mapInboundEvent(companyId, snap.id, snap.data() as FirestoreInboundEvent)
}

export const resolveInboundEventId = (sessionId: string, messageId: string) =>
  buildInboundEventId(sessionId, messageId)

export const upsertInboundEventFromWebhook = async (params: {
  companyId: string
  eventId: string
  sessionId: string
  messageId: string
  from: string
  body: string
  to?: string
  type?: string
  phoneNumber?: string
  quotedMessageId?: string
  quotedBody?: string
  quotedParticipant?: string
  senderJid?: string
}) => {
  const ref = inboundEventsRef(params.companyId).doc(params.eventId)
  const existing = await ref.get()
  if (existing.exists) {
    return
  }

  const now = FieldValue.serverTimestamp()
  await ref.set({
    channel: "whatsapp",
    sessionId: params.sessionId,
    messageId: params.messageId,
    from: params.from,
    to: params.to ?? null,
    body: params.body,
    type: params.type ?? "text",
    timestamp: now,
    phoneNumber: params.phoneNumber ?? null,
    ...(params.quotedMessageId ? { quotedMessageId: params.quotedMessageId } : {}),
    ...(params.quotedBody ? { quotedBody: params.quotedBody } : {}),
    ...(params.quotedParticipant ? { quotedParticipant: params.quotedParticipant } : {}),
    ...(params.senderJid ? { senderJid: params.senderJid } : {}),
    status: "pending",
    attempts: 0,
    createdAt: now,
    updatedAt: now,
  })
}

export const listPendingInboundEvents = async (params: {
  companyId?: string
  limit?: number
  maxAttempts?: number
}) => {
  const limit = params.limit ?? 50
  const maxAttempts = params.maxAttempts ?? 10
  const now = Timestamp.now()

  const companiesSnap = params.companyId
    ? [await adminDb.collection(collections.companies).doc(params.companyId).get()]
    : (await adminDb.collection(collections.companies).limit(100).get()).docs

  const events: InboundEventRecord[] = []

  for (const companyDoc of companiesSnap) {
    if (!companyDoc.exists) continue
    const companyId = companyDoc.id

    const pendingSnap = await inboundEventsRef(companyId)
      .where("status", "in", ["pending", "failed"])
      .where("attempts", "<", maxAttempts)
      .limit(limit)
      .get()

    for (const doc of pendingSnap.docs) {
      const event = mapInboundEvent(companyId, doc.id, doc.data() as FirestoreInboundEvent)
      if (event.nextAttemptAt && event.nextAttemptAt.getTime() > now.toDate().getTime()) {
        continue
      }
      events.push(event)
      if (events.length >= limit) {
        return events
      }
    }
  }

  return events
}

export const listFailedAutoReplyEvents = async (params: { companyId?: string; limit?: number } = {}) => {
  const limit = params.limit ?? 25
  const companiesSnap = params.companyId
    ? [await adminDb.collection(collections.companies).doc(params.companyId).get()]
    : (await adminDb.collection(collections.companies).limit(100).get()).docs

  const events: InboundEventRecord[] = []

  for (const companyDoc of companiesSnap) {
    if (!companyDoc.exists) continue
    const companyId = companyDoc.id

    const snap = await inboundEventsRef(companyId)
      .where("status", "==", "processed")
      .where("autoReplyStatus", "==", "failed")
      .limit(limit)
      .get()

    for (const doc of snap.docs) {
      events.push(mapInboundEvent(companyId, doc.id, doc.data() as FirestoreInboundEvent))
    }
  }

  return events.slice(0, limit)
}

export const markInboundEventProcessing = async (companyId: string, eventId: string) => {
  const ref = inboundEventsRef(companyId).doc(eventId)
  await adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(ref)
    if (!snap.exists) {
      throw new Error("Inbound event not found")
    }
    const status = snap.data()?.status as InboundEventStatus
    if (status === "processed") {
      return
    }
    tx.update(ref, {
      status: "processing",
      attempts: FieldValue.increment(1),
      updatedAt: FieldValue.serverTimestamp(),
    })
  })
}

export const markInboundEventProcessed = async (
  companyId: string,
  eventId: string,
  update: {
    conversationId: string
    inboxMessageId: string
    metricsReceivedCounted: boolean
  },
) => {
  await inboundEventsRef(companyId).doc(eventId).update({
    status: "processed",
    conversationId: update.conversationId,
    inboxMessageId: update.inboxMessageId,
    metricsReceivedCounted: update.metricsReceivedCounted,
    processedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })
}

export const markInboundEventFailed = async (
  companyId: string,
  eventId: string,
  error: string,
  nextAttemptAt: Date,
) => {
  await inboundEventsRef(companyId).doc(eventId).update({
    status: "failed",
    lastError: error.slice(0, 500),
    nextAttemptAt: Timestamp.fromDate(nextAttemptAt),
    updatedAt: FieldValue.serverTimestamp(),
  })
}

export const updateInboundEventAutoReply = async (
  companyId: string,
  eventId: string,
  update: {
    autoReplyStatus: FirestoreInboundEvent["autoReplyStatus"]
    autoReplyReason?: string | null
  },
) => {
  await inboundEventsRef(companyId).doc(eventId).update({
    autoReplyStatus: update.autoReplyStatus,
    autoReplyReason: update.autoReplyReason ?? null,
    updatedAt: FieldValue.serverTimestamp(),
  })
}
