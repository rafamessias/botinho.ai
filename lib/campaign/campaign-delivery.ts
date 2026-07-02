import { FieldValue, Timestamp } from "firebase-admin/firestore"
import { adminDb } from "@/lib/firebase/admin"
import { collections, companySubcollections } from "@/lib/firebase/collections"
import { renderCampaignMessage } from "@/lib/campaign/message-variables"
import {
  campaignDeliveriesRef,
  campaignsRef,
  incrementCampaignMetrics,
  listActiveCampaigns,
  listPendingCampaignDeliveries,
  mapCampaign,
  markCampaignCompletedIfDone,
  resolveCampaignSessionId,
  trackCampaignResponse,
  updateCampaignRuntime,
  type CampaignDeliveryRecord,
  type CampaignRecord,
} from "@/lib/firebase/services/campaign-service"
import {
  findOpenConversationForCustomer,
  mapInboxCustomerRecord,
} from "@/lib/firebase/services/inbox-service"
import type { FirestoreInboxCustomer } from "@/lib/firebase/types"
import { CAMPAIGN_IMMEDIATE_DELIVERY_THRESHOLD, isImmediateCampaignAudience } from "@/lib/types/campaign"
import { sendOutbound } from "@/lib/messaging/messaging-service"
import { isWhatsAppConfigured } from "@/lib/whatsapp"

const companyRef = (companyId: string) => adminDb.collection(collections.companies).doc(companyId)
const conversationsRef = (companyId: string) =>
  companyRef(companyId).collection(companySubcollections.conversations)
const customersRef = (companyId: string) => companyRef(companyId).collection(companySubcollections.customers)

const RETRY_DELAY_MS = 60_000
const MAX_DELIVERY_ATTEMPTS = 3

const resolveSessionId = async (companyId: string, campaign: CampaignRecord): Promise<string | null> =>
  resolveCampaignSessionId(companyId, campaign)

const ensureConversation = async (params: {
  companyId: string
  customerId: string
  sessionId: string | null
  campaignId: string
  deliveryId: string
}) => {
  const existing = await findOpenConversationForCustomer({
    companyId: params.companyId,
    customerId: params.customerId,
    sessionId: params.sessionId,
  })

  if (existing) {
    await conversationsRef(params.companyId).doc(existing.id).update({
      sessionId: params.sessionId,
      activeCampaignId: params.campaignId,
      activeCampaignDeliveryId: params.deliveryId,
      updatedAt: FieldValue.serverTimestamp(),
    })
    return existing.id
  }

  const conversationRef = conversationsRef(params.companyId).doc()
  const now = FieldValue.serverTimestamp()
  await conversationRef.set({
    customerId: params.customerId,
    sessionId: params.sessionId,
    activeCampaignId: params.campaignId,
    activeCampaignDeliveryId: params.deliveryId,
    priority: "medium",
    tags: [],
    unreadCount: 0,
    isArchived: false,
    isBookmarked: false,
    archivedAt: null,
    createdAt: now,
    updatedAt: now,
  })

  return conversationRef.id
}

export const processCampaignDelivery = async (
  companyId: string,
  campaign: CampaignRecord,
  delivery: CampaignDeliveryRecord,
): Promise<{ success: boolean; error?: string }> => {
  const deliveryRef = campaignDeliveriesRef(companyId).doc(delivery.id)

  if (!isWhatsAppConfigured()) {
    await deliveryRef.update({
      status: "failed",
      failureReason: "no_session",
      attempts: delivery.attempts + 1,
      nextAttemptAt: Timestamp.fromDate(new Date(Date.now() + RETRY_DELAY_MS)),
      updatedAt: FieldValue.serverTimestamp(),
    })
    await incrementCampaignMetrics(companyId, campaign.id, {
      failed: 1,
      queued: -1,
    })
    return { success: false, error: "no_session" }
  }

  const sessionId = await resolveSessionId(companyId, campaign)
  if (!sessionId) {
    await deliveryRef.update({
      status: "failed",
      failureReason: "no_session",
      attempts: delivery.attempts + 1,
      nextAttemptAt: Timestamp.fromDate(new Date(Date.now() + RETRY_DELAY_MS)),
      updatedAt: FieldValue.serverTimestamp(),
    })
    await incrementCampaignMetrics(companyId, campaign.id, {
      failed: 1,
      queued: -1,
    })
    return { success: false, error: "no_session" }
  }

  const customerSnap = await customersRef(companyId).doc(delivery.customerId).get()
  if (!customerSnap.exists) {
    await deliveryRef.update({
      status: "failed",
      failureReason: "customer_not_found",
      updatedAt: FieldValue.serverTimestamp(),
    })
    await incrementCampaignMetrics(companyId, campaign.id, {
      failed: 1,
      queued: -1,
    })
    return { success: false, error: "customer_not_found" }
  }

  const customer = mapInboxCustomerRecord(
    customerSnap.id,
    customerSnap.data() as FirestoreInboxCustomer,
  )

  const companySnap = await companyRef(companyId).get()
  const renderedMessage = renderCampaignMessage(campaign.messageTemplate, {
    customer: {
      name: customer.name,
      phone: customer.phone,
      email: customer.email ?? undefined,
      company: customer.company ?? undefined,
    },
    company: {
      name: (companySnap.data()?.name as string | undefined) ?? "",
    },
  })

  const conversationId = await ensureConversation({
    companyId,
    customerId: delivery.customerId,
    sessionId,
    campaignId: campaign.id,
    deliveryId: delivery.id,
  })

  await deliveryRef.update({
    status: "sent",
    conversationId,
    renderedMessage,
    sentAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })

  const result = await sendOutbound({
    companyId,
    conversationId,
    content: renderedMessage,
    senderType: "agent",
    senderUserId: campaign.createdById,
    status: "pending",
    incrementUnread: false,
    sessionId,
    customerPhone: delivery.customerPhone,
    countAsBotAutoReply: false,
  })

  if (result.delivered) {
    await deliveryRef.update({
      status: "delivered",
      messageId: result.message.id,
      deliveredAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })
    await incrementCampaignMetrics(companyId, campaign.id, {
      sent: 1,
      delivered: 1,
      queued: -1,
    })
    return { success: true }
  }

  const attempts = delivery.attempts + 1
  const terminal = attempts >= MAX_DELIVERY_ATTEMPTS

  await deliveryRef.update({
    status: "failed",
    messageId: result.message.id,
    failureReason: "delivery_failed",
    attempts,
    nextAttemptAt: terminal
      ? null
      : Timestamp.fromDate(new Date(Date.now() + RETRY_DELAY_MS * attempts)),
    updatedAt: FieldValue.serverTimestamp(),
  })

  if (terminal) {
    await incrementCampaignMetrics(companyId, campaign.id, {
      sent: 1,
      failed: 1,
      queued: -1,
    })
  }

  return { success: false, error: "delivery_failed" }
}

const getRemainingBatchCapacity = (campaign: CampaignRecord): number => {
  const { messagesPerInterval, intervalMinutes } = campaign.schedule
  const runtime = campaign.runtime
  const now = Date.now()

  if (!runtime.lastBatchAt) {
    return messagesPerInterval
  }

  const elapsedMs = now - runtime.lastBatchAt.getTime()
  if (elapsedMs >= intervalMinutes * 60_000) {
    return messagesPerInterval
  }

  return Math.max(0, messagesPerInterval - runtime.sentInCurrentInterval)
}

export const processCampaignBatch = async (
  companyId: string,
  campaignId: string,
): Promise<{ processed: number; succeeded: number }> => {
  const campaignSnap = await campaignsRef(companyId).doc(campaignId).get()
  if (!campaignSnap.exists) return { processed: 0, succeeded: 0 }

  const campaign = mapCampaign(campaignSnap.id, campaignSnap.data()!)
  if (campaign.status !== "running") return { processed: 0, succeeded: 0 }

  if (isImmediateCampaignAudience(campaign.metrics.targeted)) {
    return processImmediateCampaignBatch(companyId, campaign)
  }

  const capacity = getRemainingBatchCapacity(campaign)
  if (capacity <= 0) return { processed: 0, succeeded: 0 }

  const deliveries = await listPendingCampaignDeliveries(companyId, campaignId, capacity)
  if (deliveries.length === 0) {
    await markCampaignCompletedIfDone(companyId, campaignId)
    return { processed: 0, succeeded: 0 }
  }

  return finalizeCampaignBatch(companyId, campaignId, campaign, deliveries)
}

const processImmediateCampaignBatch = async (
  companyId: string,
  campaign: CampaignRecord,
): Promise<{ processed: number; succeeded: number }> => {
  let processed = 0
  let succeeded = 0

  while (true) {
    const deliveries = await listPendingCampaignDeliveries(
      companyId,
      campaign.id,
      CAMPAIGN_IMMEDIATE_DELIVERY_THRESHOLD,
    )
    if (deliveries.length === 0) break

    for (const delivery of deliveries) {
      const result = await processCampaignDelivery(companyId, campaign, delivery)
      processed += 1
      if (result.success) succeeded += 1
    }
  }

  const now = new Date()
  await updateCampaignRuntime(companyId, campaign.id, {
    lastBatchAt: now,
    sentInCurrentInterval: processed,
  })
  await markCampaignCompletedIfDone(companyId, campaign.id)

  return { processed, succeeded }
}

const finalizeCampaignBatch = async (
  companyId: string,
  campaignId: string,
  campaign: CampaignRecord,
  deliveries: CampaignDeliveryRecord[],
): Promise<{ processed: number; succeeded: number }> => {
  let succeeded = 0
  for (const delivery of deliveries) {
    const result = await processCampaignDelivery(companyId, campaign, delivery)
    if (result.success) succeeded += 1
  }

  const now = new Date()
  const elapsedMs = campaign.runtime.lastBatchAt
    ? now.getTime() - campaign.runtime.lastBatchAt.getTime()
    : Number.POSITIVE_INFINITY
  const intervalMs = campaign.schedule.intervalMinutes * 60_000
  const resetInterval = !campaign.runtime.lastBatchAt || elapsedMs >= intervalMs

  await updateCampaignRuntime(companyId, campaignId, {
    lastBatchAt: resetInterval ? now : campaign.runtime.lastBatchAt ?? now,
    sentInCurrentInterval: resetInterval
      ? deliveries.length
      : campaign.runtime.sentInCurrentInterval + deliveries.length,
  })

  await markCampaignCompletedIfDone(companyId, campaignId)

  return { processed: deliveries.length, succeeded }
}

export const promoteScheduledCampaigns = async (companyId: string) => {
  const snap = await campaignsRef(companyId).where("status", "==", "scheduled").get()
  const now = Date.now()

  for (const doc of snap.docs) {
    const campaign = mapCampaign(doc.id, doc.data())
    const startAt = campaign.schedule.startAt
    if (startAt && startAt.getTime() <= now) {
      await campaignsRef(companyId).doc(campaign.id).update({
        status: "running",
        startedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      })
    }
  }
}

export const processCompanyCampaigns = async (companyId: string) => {
  await promoteScheduledCampaigns(companyId)

  const campaigns = await listActiveCampaigns(companyId)
  const results = []

  for (const campaign of campaigns.filter((item) => item.status === "running")) {
    const result = await processCampaignBatch(companyId, campaign.id)
    results.push({ campaignId: campaign.id, ...result })
  }

  return results
}

export const processAllCampaigns = async () => {
  const companiesSnap = await adminDb.collection(collections.companies).limit(100).get()
  const allResults = []

  for (const companyDoc of companiesSnap.docs) {
    const results = await processCompanyCampaigns(companyDoc.id)
    allResults.push(...results.map((item) => ({ companyId: companyDoc.id, ...item })))
  }

  return allResults
}

export const trackCampaignResponseIfApplicable = async (params: {
  companyId: string
  conversationId: string
}) => {
  const conversationSnap = await conversationsRef(params.companyId).doc(params.conversationId).get()
  if (!conversationSnap.exists) return null

  const data = conversationSnap.data()
  const campaignId = data?.activeCampaignId as string | undefined
  const deliveryId = data?.activeCampaignDeliveryId as string | undefined
  if (!campaignId || !deliveryId) return null

  await trackCampaignResponse(params.companyId, { campaignId, deliveryId })
  const { getCampaign } = await import("@/lib/firebase/services/campaign-service")
  return getCampaign(params.companyId, campaignId)
}
