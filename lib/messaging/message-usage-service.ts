import { FieldValue } from "firebase-admin/firestore"
import { adminDb } from "@/lib/firebase/admin"
import { collections, companySubcollections } from "@/lib/firebase/collections"
import { normalizeStoredPhone } from "@/lib/phone-utils"
import type { MessageUsageMetric, MessageUsageSnapshot } from "@/lib/messaging/types"

const METRICS = {
  MESSAGES_RECEIVED: "MESSAGES_RECEIVED",
  MESSAGES_SENT: "MESSAGES_SENT",
  BOT_AUTO_REPLIES: "BOT_AUTO_REPLIES",
} as const satisfies Record<MessageUsageMetric, MessageUsageMetric>

const currentPeriodId = () => {
  const now = new Date()
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`
}

const companyUsageRef = (companyId: string, periodId: string) =>
  adminDb
    .collection(collections.companies)
    .doc(companyId)
    .collection(companySubcollections.usage)
    .doc(periodId)

const channelUsageDocId = (periodId: string, phoneNumber: string) => {
  const normalized = normalizeStoredPhone(phoneNumber) || phoneNumber.replace(/\D/g, "")
  return `${periodId}_${normalized}`
}

const channelUsageRef = (companyId: string, periodId: string, phoneNumber: string) =>
  adminDb
    .collection(collections.companies)
    .doc(companyId)
    .collection(companySubcollections.channelUsage)
    .doc(channelUsageDocId(periodId, phoneNumber))

const readMetric = (data: FirebaseFirestore.DocumentData | undefined, metric: MessageUsageMetric) =>
  (data?.[metric] as number | undefined) ?? 0

export const incrementMessageUsage = async (
  companyId: string,
  phoneNumber: string,
  metric: MessageUsageMetric,
  count = 1,
  sessionId?: string,
): Promise<void> => {
  const normalizedPhone = normalizeStoredPhone(phoneNumber) || phoneNumber.replace(/\D/g, "")
  if (!normalizedPhone) {
    return
  }

  const periodId = currentPeriodId()
  const batch = adminDb.batch()
  const now = FieldValue.serverTimestamp()

  batch.set(
    companyUsageRef(companyId, periodId),
    {
      periodId,
      [metric]: FieldValue.increment(count),
      updatedAt: now,
    },
    { merge: true },
  )

  batch.set(
    channelUsageRef(companyId, periodId, normalizedPhone),
    {
      periodId,
      phoneNumber: normalizedPhone,
      ...(sessionId ? { sessionId } : {}),
      [metric]: FieldValue.increment(count),
      updatedAt: now,
    },
    { merge: true },
  )

  await batch.commit()
}

export const getMessageUsageSnapshot = async (
  companyId: string,
  phoneNumber?: string,
  periodId = currentPeriodId(),
): Promise<MessageUsageSnapshot> => {
  if (phoneNumber) {
    const normalizedPhone = normalizeStoredPhone(phoneNumber) || phoneNumber.replace(/\D/g, "")
    const snap = await channelUsageRef(companyId, periodId, normalizedPhone).get()
    const data = snap.data()
    return {
      periodId,
      phoneNumber: normalizedPhone,
      messagesReceived: readMetric(data, METRICS.MESSAGES_RECEIVED),
      messagesSent: readMetric(data, METRICS.MESSAGES_SENT),
      botAutoReplies: readMetric(data, METRICS.BOT_AUTO_REPLIES),
    }
  }

  const snap = await companyUsageRef(companyId, periodId).get()
  const data = snap.data()
  return {
    periodId,
    messagesReceived: readMetric(data, METRICS.MESSAGES_RECEIVED),
    messagesSent: readMetric(data, METRICS.MESSAGES_SENT),
    botAutoReplies: readMetric(data, METRICS.BOT_AUTO_REPLIES),
  }
}

export const getMessageUsageMetrics = async (companyId: string) => {
  const snapshot = await getMessageUsageSnapshot(companyId)
  const toMetric = (metricType: MessageUsageMetric, currentUsage: number) => ({
    metricType,
    limit: -1,
    currentUsage,
    remaining: -1,
    percentageUsed: 0,
    isOverLimit: false,
    periodId: snapshot.periodId,
  })

  return [
    toMetric("MESSAGES_RECEIVED", snapshot.messagesReceived),
    toMetric("MESSAGES_SENT", snapshot.messagesSent),
    toMetric("BOT_AUTO_REPLIES", snapshot.botAutoReplies),
  ]
}

export const listChannelUsageForCompany = async (
  companyId: string,
  periodId = currentPeriodId(),
): Promise<MessageUsageSnapshot[]> => {
  const prefix = `${periodId}_`
  const snap = await adminDb
    .collection(collections.companies)
    .doc(companyId)
    .collection(companySubcollections.channelUsage)
    .get()

  return snap.docs
    .filter((doc) => doc.id.startsWith(prefix))
    .map((doc) => {
      const data = doc.data()
      return {
        periodId,
        phoneNumber: String(data.phoneNumber ?? doc.id.slice(prefix.length)),
        messagesReceived: readMetric(data, METRICS.MESSAGES_RECEIVED),
        messagesSent: readMetric(data, METRICS.MESSAGES_SENT),
        botAutoReplies: readMetric(data, METRICS.BOT_AUTO_REPLIES),
      }
    })
    .sort((a, b) => (a.phoneNumber ?? "").localeCompare(b.phoneNumber ?? ""))
}
