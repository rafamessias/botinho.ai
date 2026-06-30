import { Timestamp } from "firebase-admin/firestore"
import { adminDb } from "@/lib/firebase/admin"
import {
  collections,
  companySubcollections,
  conversationSubcollections,
} from "@/lib/firebase/collections"
import type { FirestoreInboxConversation, FirestoreInboxMessage } from "@/lib/firebase/types"

const CONVERSATION_FETCH_LIMIT = 75

const companyRef = (companyId: string) =>
  adminDb.collection(collections.companies).doc(companyId)

const customersRef = (companyId: string) =>
  companyRef(companyId).collection(companySubcollections.customers)

const conversationsRef = (companyId: string) =>
  companyRef(companyId).collection(companySubcollections.conversations)

const messagesRef = (companyId: string, conversationId: string) =>
  conversationsRef(companyId)
    .doc(conversationId)
    .collection(conversationSubcollections.messages)

const toDate = (value: Timestamp | Date | undefined | null): Date | null => {
  if (!value) return null
  if (value instanceof Date) return value
  if (value instanceof Timestamp) return value.toDate()
  return null
}

const startOfUtcDay = (date: Date) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))

const addUtcDays = (date: Date, days: number) => {
  const next = new Date(date)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

const toDayKey = (date: Date) => date.toISOString().slice(0, 10)

const calcPercentChange = (current: number, previous: number) => {
  if (current === 0 && previous === 0) return null
  if (previous === 0) {
    return { percent: 100, direction: "up" as const }
  }

  const delta = ((current - previous) / previous) * 100
  const rounded = Math.round(Math.abs(delta))

  return {
    percent: rounded,
    direction: delta > 0 ? ("up" as const) : delta < 0 ? ("down" as const) : ("neutral" as const),
  }
}

const average = (values: number[]) =>
  values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : null

const isAgentReply = (senderType: FirestoreInboxMessage["senderType"]) =>
  senderType === "agent" || senderType === "bot"

const buildDailyVolume = (start: Date, days: number) => {
  const volume: Array<{ date: string; messages: number }> = []
  for (let index = 0; index < days; index += 1) {
    const day = addUtcDays(start, index)
    volume.push({ date: toDayKey(day), messages: 0 })
  }
  return volume
}

export type DashboardStatChange = {
  percent: number
  direction: "up" | "down" | "neutral"
}

export type DashboardDailyVolume = {
  date: string
  messages: number
}

export type DashboardMetrics = {
  messagesHandled: number
  messagesHandledChange: DashboardStatChange | null
  avgResponseTimeMs: number | null
  avgResponseTimeChange: DashboardStatChange | null
  satisfactionRate: number | null
  satisfactionChange: DashboardStatChange | null
  activeCustomers: number
  activeCustomersChange: DashboardStatChange | null
  messageVolume: DashboardDailyVolume[]
}

export const getDashboardMetrics = async (companyId: string): Promise<DashboardMetrics> => {
  const now = new Date()
  const todayStart = startOfUtcDay(now)
  const chartStart = addUtcDays(todayStart, -6)
  const currentWeekStart = addUtcDays(todayStart, -6)
  const previousWeekStart = addUtcDays(todayStart, -13)
  const previousWeekEnd = currentWeekStart
  const lookbackStart = previousWeekStart

  const lookbackTimestamp = Timestamp.fromDate(lookbackStart)
  const messageVolume = buildDailyVolume(chartStart, 7)
  const volumeByDay = new Map(messageVolume.map((entry) => [entry.date, entry]))

  let currentWeekMessages = 0
  let previousWeekMessages = 0
  const currentWeekResponseTimes: number[] = []
  const previousWeekResponseTimes: number[] = []
  const currentWeekSatisfaction: number[] = []
  const previousWeekSatisfaction: number[] = []
  const allSatisfaction: number[] = []

  const [activeCustomersSnap, newCustomersCurrentSnap, newCustomersPreviousSnap, conversationsSnap] =
    await Promise.all([
      customersRef(companyId).where("status", "==", "active").count().get(),
      customersRef(companyId)
        .where("createdAt", ">=", Timestamp.fromDate(currentWeekStart))
        .count()
        .get(),
      customersRef(companyId)
        .where("createdAt", ">=", Timestamp.fromDate(previousWeekStart))
        .where("createdAt", "<", Timestamp.fromDate(previousWeekEnd))
        .count()
        .get(),
      conversationsRef(companyId).orderBy("lastMessageSentAt", "desc").limit(CONVERSATION_FETCH_LIMIT).get(),
    ])

  const activeCustomers = activeCustomersSnap.data().count
  const newCustomersCurrent = newCustomersCurrentSnap.data().count
  const newCustomersPrevious = newCustomersPreviousSnap.data().count

  const relevantConversations = conversationsSnap.docs.filter((doc) => {
    const data = doc.data() as FirestoreInboxConversation
    const lastMessageSentAt = toDate(data.lastMessageSentAt)
    return lastMessageSentAt != null && lastMessageSentAt >= lookbackStart
  })

  await Promise.all(
    relevantConversations.map(async (conversationDoc) => {
      const conversation = conversationDoc.data() as FirestoreInboxConversation
      const lastMessageSentAt = toDate(conversation.lastMessageSentAt)

      if (conversation.satisfactionScore != null) {
        allSatisfaction.push(conversation.satisfactionScore)
        if (lastMessageSentAt && lastMessageSentAt >= currentWeekStart) {
          currentWeekSatisfaction.push(conversation.satisfactionScore)
        } else if (
          lastMessageSentAt &&
          lastMessageSentAt >= previousWeekStart &&
          lastMessageSentAt < previousWeekEnd
        ) {
          previousWeekSatisfaction.push(conversation.satisfactionScore)
        }
      }

      const messagesSnap = await messagesRef(companyId, conversationDoc.id)
        .where("sentAt", ">=", lookbackTimestamp)
        .get()

      const messages = messagesSnap.docs
        .map((doc) => {
          const data = doc.data() as FirestoreInboxMessage
          const sentAt = toDate(data.sentAt)
          if (!sentAt) return null
          return {
            senderType: data.senderType,
            sentAt,
          }
        })
        .filter((message): message is { senderType: FirestoreInboxMessage["senderType"]; sentAt: Date } =>
          message != null,
        )
        .sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime())

      for (const message of messages) {
        const dayKey = toDayKey(message.sentAt)
        const volumeEntry = volumeByDay.get(dayKey)
        if (volumeEntry) {
          volumeEntry.messages += 1
        }

        if (message.sentAt >= currentWeekStart) {
          currentWeekMessages += 1
        } else if (message.sentAt >= previousWeekStart && message.sentAt < previousWeekEnd) {
          previousWeekMessages += 1
        }
      }

      for (let index = 0; index < messages.length; index += 1) {
        const message = messages[index]!
        if (message.senderType !== "customer") continue

        const reply = messages.slice(index + 1).find((candidate) => isAgentReply(candidate.senderType))
        if (!reply) continue

        const responseMs = reply.sentAt.getTime() - message.sentAt.getTime()
        if (responseMs <= 0) continue

        if (message.sentAt >= currentWeekStart) {
          currentWeekResponseTimes.push(responseMs)
        } else if (message.sentAt >= previousWeekStart && message.sentAt < previousWeekEnd) {
          previousWeekResponseTimes.push(responseMs)
        }
      }
    }),
  )

  const avgResponseTimeMs = average(currentWeekResponseTimes)
  const previousAvgResponseTimeMs = average(previousWeekResponseTimes)

  const satisfactionAverage = average(allSatisfaction)
  const satisfactionRate =
    satisfactionAverage != null ? Math.round((satisfactionAverage / 5) * 100) : null

  const currentWeekSatisfactionRate = average(currentWeekSatisfaction)
  const previousWeekSatisfactionRate = average(previousWeekSatisfaction)

  const satisfactionChange =
    currentWeekSatisfactionRate != null && previousWeekSatisfactionRate != null
      ? calcPercentChange(
          Math.round((currentWeekSatisfactionRate / 5) * 100),
          Math.round((previousWeekSatisfactionRate / 5) * 100),
        )
      : null

  const avgResponseTimeChange =
    avgResponseTimeMs != null && previousAvgResponseTimeMs != null
      ? calcPercentChange(previousAvgResponseTimeMs, avgResponseTimeMs)
      : null

  return {
    messagesHandled: currentWeekMessages,
    messagesHandledChange: calcPercentChange(currentWeekMessages, previousWeekMessages),
    avgResponseTimeMs,
    avgResponseTimeChange,
    satisfactionRate,
    satisfactionChange,
    activeCustomers,
    activeCustomersChange: calcPercentChange(newCustomersCurrent, newCustomersPrevious),
    messageVolume: messageVolume.map((entry) => ({
      date: entry.date,
      messages: volumeByDay.get(entry.date)?.messages ?? 0,
    })),
  }
}
