import { FieldValue, Timestamp } from "firebase-admin/firestore"
import { adminDb } from "@/lib/firebase/admin"
import { collections, companySubcollections } from "@/lib/firebase/collections"
import { customerMatchesTagFilter } from "@/components/customer/customer-tag-utils"
import {
  DEFAULT_CAMPAIGN_METRICS as defaultMetrics,
  DEFAULT_CAMPAIGN_RUNTIME as defaultRuntime,
  DEFAULT_CAMPAIGN_SCHEDULE as defaultSchedule,
  type CampaignDeliveryFailureReason,
  type CampaignDeliveryStatus,
  type CampaignMetrics,
  type CampaignRuntime,
  type CampaignSchedule,
  type CampaignStatus,
  type CampaignTargetCustomerStatus,
} from "@/lib/types/campaign"
import type { CustomerStatus } from "@/lib/types/customer"
import { isValidPhoneLength, normalizeStoredPhone } from "@/lib/phone-utils"
import type { FirestoreInboxCustomer } from "@/lib/firebase/types"
import { getAiAgent } from "@/lib/firebase/services/ai-agent-service"
import { isWhatsAppConfigured } from "@/lib/whatsapp"
import { WhatsAppSessionRepository } from "@/lib/whatsapp/session-repository"

const companyRef = (companyId: string) => adminDb.collection(collections.companies).doc(companyId)
const toDate = (value: Timestamp) => value.toDate()

const campaignsRef = (companyId: string) => companyRef(companyId).collection(companySubcollections.campaigns)
const campaignDeliveriesRef = (companyId: string) =>
  companyRef(companyId).collection(companySubcollections.campaignDeliveries)
const customersRef = (companyId: string) => companyRef(companyId).collection(companySubcollections.customers)
const conversationsRef = (companyId: string) =>
  companyRef(companyId).collection(companySubcollections.conversations)

export type CampaignRecord = {
  id: string
  name: string
  description?: string
  status: CampaignStatus
  messageTemplate: string
  targetTags: string[]
  targetCustomerStatus: CampaignTargetCustomerStatus
  agentId?: string
  sessionId?: string
  schedule: CampaignSchedule
  runtime: CampaignRuntime
  metrics: CampaignMetrics
  createdById: string
  startedAt?: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export type CampaignSummary = {
  id: string
  name: string
  status: CampaignStatus
  targetTags: string[]
  metrics: CampaignMetrics
  audienceCount: number
  updatedAt: Date
}

export type CampaignDeliveryRecord = {
  id: string
  campaignId: string
  customerId: string
  customerName: string
  customerPhone: string
  conversationId?: string
  messageId?: string
  status: CampaignDeliveryStatus
  failureReason?: CampaignDeliveryFailureReason
  renderedMessage?: string
  queuedAt?: Date
  sentAt?: Date
  deliveredAt?: Date
  respondedAt?: Date
  nextAttemptAt?: Date
  attempts: number
  createdAt: Date
  updatedAt: Date
}

export type CampaignAudiencePreview = {
  matchedByTags: number
  eligible: number
  sample: Array<{
    id: string
    name: string
    phone: string
    tags: string[]
  }>
}

export type CampaignMetricsDetail = CampaignMetrics & {
  deliveries: CampaignDeliveryRecord[]
  totalDeliveries: number
}

const mapSchedule = (value: FirebaseFirestore.DocumentData | undefined): CampaignSchedule => ({
  startAt: value?.startAt ? toDate(value.startAt as Timestamp) : undefined,
  messagesPerInterval: Number(value?.messagesPerInterval ?? defaultSchedule().messagesPerInterval),
  intervalMinutes: Number(value?.intervalMinutes ?? defaultSchedule().intervalMinutes),
})

const mapRuntime = (value: FirebaseFirestore.DocumentData | undefined): CampaignRuntime => ({
  lastBatchAt: value?.lastBatchAt ? toDate(value.lastBatchAt as Timestamp) : undefined,
  sentInCurrentInterval: Number(value?.sentInCurrentInterval ?? 0),
})

const mapMetrics = (value: FirebaseFirestore.DocumentData | undefined): CampaignMetrics => {
  const base = defaultMetrics()
  if (!value) return base
  return {
    targeted: Number(value.targeted ?? base.targeted),
    queued: Number(value.queued ?? base.queued),
    sent: Number(value.sent ?? base.sent),
    delivered: Number(value.delivered ?? base.delivered),
    failed: Number(value.failed ?? base.failed),
    skipped: Number(value.skipped ?? base.skipped),
    responses: Number(value.responses ?? base.responses),
    responseRate: Number(value.responseRate ?? base.responseRate),
    botReplies: Number(value.botReplies ?? base.botReplies),
  }
}

const mapCampaign = (id: string, data: FirebaseFirestore.DocumentData): CampaignRecord => ({
  id,
  name: data.name as string,
  description: data.description as string | undefined,
  status: data.status as CampaignStatus,
  messageTemplate: data.messageTemplate as string,
  targetTags: (data.targetTags as string[]) ?? [],
  targetCustomerStatus: (data.targetCustomerStatus as CampaignTargetCustomerStatus) ?? "active",
  agentId: data.agentId as string | undefined,
  sessionId: data.sessionId as string | undefined,
  schedule: mapSchedule(data.schedule as FirebaseFirestore.DocumentData),
  runtime: mapRuntime(data.runtime as FirebaseFirestore.DocumentData),
  metrics: mapMetrics(data.metrics as FirebaseFirestore.DocumentData),
  createdById: data.createdById as string,
  startedAt: data.startedAt ? toDate(data.startedAt as Timestamp) : undefined,
  completedAt: data.completedAt ? toDate(data.completedAt as Timestamp) : undefined,
  createdAt: toDate(data.createdAt as Timestamp),
  updatedAt: toDate(data.updatedAt as Timestamp),
})

const mapDelivery = (id: string, data: FirebaseFirestore.DocumentData): CampaignDeliveryRecord => ({
  id,
  campaignId: data.campaignId as string,
  customerId: data.customerId as string,
  customerName: data.customerName as string,
  customerPhone: data.customerPhone as string,
  conversationId: data.conversationId as string | undefined,
  messageId: data.messageId as string | undefined,
  status: data.status as CampaignDeliveryStatus,
  failureReason: data.failureReason as CampaignDeliveryFailureReason | undefined,
  renderedMessage: data.renderedMessage as string | undefined,
  queuedAt: data.queuedAt ? toDate(data.queuedAt as Timestamp) : undefined,
  sentAt: data.sentAt ? toDate(data.sentAt as Timestamp) : undefined,
  deliveredAt: data.deliveredAt ? toDate(data.deliveredAt as Timestamp) : undefined,
  respondedAt: data.respondedAt ? toDate(data.respondedAt as Timestamp) : undefined,
  nextAttemptAt: data.nextAttemptAt ? toDate(data.nextAttemptAt as Timestamp) : undefined,
  attempts: Number(data.attempts ?? 0),
  createdAt: toDate(data.createdAt as Timestamp),
  updatedAt: toDate(data.updatedAt as Timestamp),
})

export const isValidCampaignPhone = (phone: string | null | undefined): boolean => {
  if (!phone?.trim()) return false
  const normalized = normalizeStoredPhone(phone)
  return Boolean(normalized) && isValidPhoneLength(normalized)
}

export const resolveCampaignSessionId = async (
  companyId: string,
  campaign: Pick<CampaignRecord, "sessionId" | "agentId">,
): Promise<string | null> => {
  if (campaign.sessionId) return campaign.sessionId

  if (campaign.agentId) {
    const agent = await getAiAgent(companyId, campaign.agentId)
    if (agent?.sessionIds[0]) return agent.sessionIds[0]
  }

  const repository = new WhatsAppSessionRepository()
  const connected = await repository.getConnectedSessionForCompany(companyId)
  return connected?.sessionId ?? null
}

export const assertCampaignCanSend = async (
  companyId: string,
  campaign: Pick<CampaignRecord, "sessionId" | "agentId">,
) => {
  if (!isWhatsAppConfigured()) {
    throw new Error(
      "WhatsApp is not configured. Connect WhatsApp in Settings before launching a campaign.",
    )
  }

  const sessionId = await resolveCampaignSessionId(companyId, campaign)
  if (!sessionId) {
    throw new Error(
      "No connected WhatsApp session found. Connect WhatsApp in Settings or assign a Botinho with a connected number.",
    )
  }

  return sessionId
}

const customerMatchesStatus = (status: CustomerStatus, target: CampaignTargetCustomerStatus) =>
  status === target

const toCustomerForTagFilter = (id: string, data: FirestoreInboxCustomer) => ({
  id,
  name: data.name,
  phone: data.phone ?? "",
  tags: data.tags ?? [],
  status: (data.status ?? "active") as CustomerStatus,
  createdAt: "",
  updatedAt: "",
})

const MAX_AUDIENCE_SCAN = 5000

const loadCustomersMatchingTags = async (companyId: string, targetTags: string[]) => {
  if (targetTags.length === 0) return []

  const normalizedTags = targetTags.map((tag) => tag.trim()).filter(Boolean)
  const matches = new Map<string, FirestoreInboxCustomer & { id: string }>()
  let lastDoc: FirebaseFirestore.QueryDocumentSnapshot | undefined

  while (matches.size < MAX_AUDIENCE_SCAN) {
    let query = customersRef(companyId).orderBy("name").limit(500)
    if (lastDoc) query = query.startAfter(lastDoc)

    const snap = await query.get()
    if (snap.empty) break

    for (const doc of snap.docs) {
      const data = doc.data() as FirestoreInboxCustomer
      if (customerMatchesTagFilter(toCustomerForTagFilter(doc.id, data), normalizedTags)) {
        matches.set(doc.id, { id: doc.id, ...data })
      }
    }

    lastDoc = snap.docs[snap.docs.length - 1]
    if (snap.size < 500) break
  }

  return Array.from(matches.values())
}

export const resolveCampaignAudience = async (
  companyId: string,
  params: {
    targetTags: string[]
    targetCustomerStatus: CampaignTargetCustomerStatus
  },
): Promise<{
  matchedByTags: Array<FirestoreInboxCustomer & { id: string }>
  eligible: Array<FirestoreInboxCustomer & { id: string }>
}> => {
  const normalizedTags = params.targetTags.map((tag) => tag.trim()).filter(Boolean)
  const customers = await loadCustomersMatchingTags(companyId, normalizedTags)

  const matchedByTags = customers.filter((customer) => {
    const status = (customer.status ?? "active") as CustomerStatus
    return customerMatchesStatus(status, params.targetCustomerStatus)
  })

  const eligible = matchedByTags.filter((customer) => isValidCampaignPhone(customer.phone))

  return { matchedByTags, eligible }
}

export const previewCampaignAudience = async (
  companyId: string,
  params: {
    targetTags: string[]
    targetCustomerStatus: CampaignTargetCustomerStatus
  },
): Promise<CampaignAudiencePreview> => {
  const { matchedByTags, eligible } = await resolveCampaignAudience(companyId, params)

  return {
    matchedByTags: matchedByTags.length,
    eligible: eligible.length,
    sample: eligible.slice(0, 2).map((customer) => ({
      id: customer.id,
      name: customer.name,
      phone: customer.phone ?? "",
      tags: customer.tags ?? [],
    })),
  }
}

export const listCampaigns = async (companyId: string): Promise<CampaignSummary[]> => {
  const snap = await campaignsRef(companyId).orderBy("updatedAt", "desc").get()

  const summaries = snap.docs.map((doc) => {
    const data = doc.data()
    const metrics = mapMetrics(data.metrics as FirebaseFirestore.DocumentData)
    return {
      id: doc.id,
      name: data.name as string,
      status: data.status as CampaignStatus,
      targetTags: (data.targetTags as string[]) ?? [],
      metrics,
      updatedAt: toDate(data.updatedAt as Timestamp),
      targetCustomerStatus:
        (data.targetCustomerStatus as CampaignTargetCustomerStatus | undefined) ?? "active",
    }
  })

  return Promise.all(
    summaries.map(async (summary) => {
      if (summary.metrics.targeted > 0) {
        return {
          id: summary.id,
          name: summary.name,
          status: summary.status,
          targetTags: summary.targetTags,
          metrics: summary.metrics,
          audienceCount: summary.metrics.targeted,
          updatedAt: summary.updatedAt,
        }
      }

      if (summary.targetTags.length === 0) {
        return {
          id: summary.id,
          name: summary.name,
          status: summary.status,
          targetTags: summary.targetTags,
          metrics: summary.metrics,
          audienceCount: 0,
          updatedAt: summary.updatedAt,
        }
      }

      const { eligible } = await resolveCampaignAudience(companyId, {
        targetTags: summary.targetTags,
        targetCustomerStatus: summary.targetCustomerStatus,
      })

      return {
        id: summary.id,
        name: summary.name,
        status: summary.status,
        targetTags: summary.targetTags,
        metrics: summary.metrics,
        audienceCount: eligible.length,
        updatedAt: summary.updatedAt,
      }
    }),
  )
}

export const getCampaign = async (companyId: string, campaignId: string): Promise<CampaignRecord | null> => {
  const snap = await campaignsRef(companyId).doc(campaignId).get()
  if (!snap.exists) return null
  return mapCampaign(snap.id, snap.data()!)
}

export const createCampaign = async (
  companyId: string,
  userId: string,
  input: {
    name: string
    description?: string
    messageTemplate: string
    targetTags: string[]
    targetCustomerStatus?: CampaignTargetCustomerStatus
    agentId?: string
    sessionId?: string
    schedule?: Partial<CampaignSchedule>
  },
): Promise<CampaignRecord> => {
  const ref = campaignsRef(companyId).doc()
  const now = FieldValue.serverTimestamp()
  const schedule = { ...defaultSchedule(), ...input.schedule }

  await ref.set({
    name: input.name.trim(),
    description: input.description?.trim() || null,
    status: "draft",
    messageTemplate: input.messageTemplate.trim(),
    targetTags: input.targetTags.map((tag) => tag.trim()).filter(Boolean),
    targetCustomerStatus: input.targetCustomerStatus ?? "active",
    agentId: input.agentId ?? null,
    sessionId: input.sessionId ?? null,
    schedule: {
      startAt: schedule.startAt ? Timestamp.fromDate(schedule.startAt) : null,
      messagesPerInterval: schedule.messagesPerInterval,
      intervalMinutes: schedule.intervalMinutes,
    },
    runtime: defaultRuntime(),
    metrics: defaultMetrics(),
    createdById: userId,
    startedAt: null,
    completedAt: null,
    createdAt: now,
    updatedAt: now,
  })

  const created = await ref.get()
  return mapCampaign(created.id, created.data()!)
}

export const updateCampaign = async (
  companyId: string,
  campaignId: string,
  input: Partial<{
    name: string
    description: string
    messageTemplate: string
    targetTags: string[]
    targetCustomerStatus: CampaignTargetCustomerStatus
    agentId: string | null
    sessionId: string | null
    schedule: Partial<CampaignSchedule>
  }>,
): Promise<CampaignRecord> => {
  const ref = campaignsRef(companyId).doc(campaignId)
  const existing = await ref.get()
  if (!existing.exists) throw new Error("Campaign not found")

  const current = mapCampaign(existing.id, existing.data()!)
  if (!["draft", "paused"].includes(current.status)) {
    throw new Error("Only draft or paused campaigns can be edited")
  }

  const patch: Record<string, unknown> = {
    updatedAt: FieldValue.serverTimestamp(),
  }

  if (input.name != null) patch.name = input.name.trim()
  if (input.description != null) patch.description = input.description.trim() || null
  if (input.messageTemplate != null) patch.messageTemplate = input.messageTemplate.trim()
  if (input.targetTags != null) {
    patch.targetTags = input.targetTags.map((tag) => tag.trim()).filter(Boolean)
  }
  if (input.targetCustomerStatus != null) patch.targetCustomerStatus = input.targetCustomerStatus
  if (input.agentId !== undefined) patch.agentId = input.agentId
  if (input.sessionId !== undefined) patch.sessionId = input.sessionId
  if (input.schedule != null) {
    const schedule = { ...current.schedule, ...input.schedule }
    patch.schedule = {
      startAt: schedule.startAt ? Timestamp.fromDate(schedule.startAt) : null,
      messagesPerInterval: schedule.messagesPerInterval,
      intervalMinutes: schedule.intervalMinutes,
    }
  }

  await ref.update(patch)
  const updated = await ref.get()
  return mapCampaign(updated.id, updated.data()!)
}

export const duplicateCampaign = async (
  companyId: string,
  userId: string,
  campaignId: string,
): Promise<CampaignRecord> => {
  const source = await getCampaign(companyId, campaignId)
  if (!source) throw new Error("Campaign not found")

  return createCampaign(companyId, userId, {
    name: `${source.name} (copy)`,
    description: source.description,
    messageTemplate: source.messageTemplate,
    targetTags: source.targetTags,
    targetCustomerStatus: source.targetCustomerStatus,
    agentId: source.agentId,
    sessionId: source.sessionId,
    schedule: source.schedule,
  })
}

export const createCampaignDeliveries = async (
  companyId: string,
  campaignId: string,
  customers: Array<FirestoreInboxCustomer & { id: string }>,
) => {
  const batchSize = 400
  for (let index = 0; index < customers.length; index += batchSize) {
    const batch = adminDb.batch()
    const slice = customers.slice(index, index + batchSize)
    const now = FieldValue.serverTimestamp()

    for (const customer of slice) {
      const ref = campaignDeliveriesRef(companyId).doc()
      batch.set(ref, {
        campaignId,
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: normalizeStoredPhone(customer.phone ?? ""),
        status: "pending",
        attempts: 0,
        createdAt: now,
        updatedAt: now,
      })
    }

    await batch.commit()
  }
}

export const launchCampaign = async (companyId: string, campaignId: string): Promise<CampaignRecord> => {
  const ref = campaignsRef(companyId).doc(campaignId)
  const snap = await ref.get()
  if (!snap.exists) throw new Error("Campaign not found")

  const campaign = mapCampaign(snap.id, snap.data()!)
  if (!["draft", "scheduled"].includes(campaign.status)) {
    throw new Error("Campaign cannot be launched in its current status")
  }
  if (!campaign.messageTemplate.trim()) throw new Error("Message template is required")
  if (campaign.targetTags.length === 0) throw new Error("At least one target tag is required")

  const { eligible } = await resolveCampaignAudience(companyId, {
    targetTags: campaign.targetTags,
    targetCustomerStatus: campaign.targetCustomerStatus,
  })

  if (eligible.length === 0) {
    throw new Error("No eligible customers found for the selected tags")
  }

  const sessionId = await assertCampaignCanSend(companyId, campaign)

  await createCampaignDeliveries(companyId, campaignId, eligible)

  const now = new Date()
  const startAt = campaign.schedule.startAt
  const nextStatus: CampaignStatus =
    startAt && startAt.getTime() > now.getTime() ? "scheduled" : "running"

  await ref.update({
    status: nextStatus,
    startedAt: nextStatus === "running" ? FieldValue.serverTimestamp() : null,
    sessionId: campaign.sessionId ?? sessionId,
    runtime: defaultRuntime(),
    metrics: {
      ...defaultMetrics(),
      targeted: eligible.length,
      queued: eligible.length,
    },
    updatedAt: FieldValue.serverTimestamp(),
  })

  const updated = await ref.get()
  return mapCampaign(updated.id, updated.data()!)
}

export const pauseCampaign = async (companyId: string, campaignId: string): Promise<CampaignRecord> => {
  const ref = campaignsRef(companyId).doc(campaignId)
  const campaign = await getCampaign(companyId, campaignId)
  if (!campaign) throw new Error("Campaign not found")
  if (campaign.status !== "running" && campaign.status !== "scheduled") {
    throw new Error("Only running or scheduled campaigns can be paused")
  }

  await ref.update({ status: "paused", updatedAt: FieldValue.serverTimestamp() })
  const updated = await ref.get()
  return mapCampaign(updated.id, updated.data()!)
}

export const resumeCampaign = async (companyId: string, campaignId: string): Promise<CampaignRecord> => {
  const ref = campaignsRef(companyId).doc(campaignId)
  const campaign = await getCampaign(companyId, campaignId)
  if (!campaign) throw new Error("Campaign not found")
  if (campaign.status !== "paused") throw new Error("Only paused campaigns can be resumed")

  await ref.update({ status: "running", updatedAt: FieldValue.serverTimestamp() })
  const updated = await ref.get()
  return mapCampaign(updated.id, updated.data()!)
}

export const cancelCampaign = async (companyId: string, campaignId: string): Promise<CampaignRecord> => {
  const ref = campaignsRef(companyId).doc(campaignId)
  const campaign = await getCampaign(companyId, campaignId)
  if (!campaign) throw new Error("Campaign not found")
  if (campaign.status === "completed" || campaign.status === "cancelled") {
    throw new Error("Campaign is already finished")
  }

  await ref.update({
    status: "cancelled",
    completedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })

  await clearCampaignConversationFlags(companyId, campaignId)

  const pendingSnap = await campaignDeliveriesRef(companyId)
    .where("campaignId", "==", campaignId)
    .where("status", "in", ["pending", "queued"])
    .get()

  const batch = adminDb.batch()
  for (const doc of pendingSnap.docs) {
    batch.update(doc.ref, {
      status: "skipped",
      updatedAt: FieldValue.serverTimestamp(),
    })
  }
  if (!pendingSnap.empty) await batch.commit()

  const updated = await ref.get()
  return mapCampaign(updated.id, updated.data()!)
}

export const clearCampaignConversationFlags = async (companyId: string, campaignId: string) => {
  const snap = await conversationsRef(companyId).where("activeCampaignId", "==", campaignId).get()
  const batch = adminDb.batch()
  for (const doc of snap.docs) {
    batch.update(doc.ref, {
      activeCampaignId: null,
      activeCampaignDeliveryId: null,
      updatedAt: FieldValue.serverTimestamp(),
    })
  }
  if (!snap.empty) await batch.commit()
}

export const listCampaignDeliveries = async (
  companyId: string,
  campaignId: string,
  params?: { limit?: number },
): Promise<CampaignDeliveryRecord[]> => {
  const limit = params?.limit ?? 200
  const snap = await campaignDeliveriesRef(companyId)
    .where("campaignId", "==", campaignId)
    .limit(limit)
    .get()

  return snap.docs
    .map((doc) => mapDelivery(doc.id, doc.data()))
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
}

export const getCampaignMetricsDetail = async (
  companyId: string,
  campaignId: string,
): Promise<CampaignMetricsDetail> => {
  const campaign = await getCampaign(companyId, campaignId)
  if (!campaign) throw new Error("Campaign not found")

  const deliveries = await listCampaignDeliveries(companyId, campaignId)
  return {
    ...campaign.metrics,
    deliveries,
    totalDeliveries: deliveries.length,
  }
}

export const listActiveCampaigns = async (companyId?: string): Promise<CampaignRecord[]> => {
  if (companyId) {
    const snap = await campaignsRef(companyId).where("status", "in", ["scheduled", "running"]).get()
    return snap.docs.map((doc) => mapCampaign(doc.id, doc.data()))
  }

  const companiesSnap = await adminDb.collection(collections.companies).limit(100).get()
  const campaigns: CampaignRecord[] = []

  for (const companyDoc of companiesSnap.docs) {
    const snap = await campaignsRef(companyDoc.id).where("status", "in", ["scheduled", "running"]).get()
    campaigns.push(...snap.docs.map((doc) => mapCampaign(doc.id, doc.data())))
  }

  return campaigns
}

export const listPendingCampaignDeliveries = async (
  companyId: string,
  campaignId: string,
  limit: number,
): Promise<CampaignDeliveryRecord[]> => {
  const now = Timestamp.now()

  const pendingSnap = await campaignDeliveriesRef(companyId)
    .where("campaignId", "==", campaignId)
    .where("status", "==", "pending")
    .limit(limit)
    .get()

  const pending = pendingSnap.docs.map((doc) => mapDelivery(doc.id, doc.data()))
  if (pending.length >= limit) {
    return pending
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice(0, limit)
  }

  const failedSnap = await campaignDeliveriesRef(companyId)
    .where("campaignId", "==", campaignId)
    .where("status", "==", "failed")
    .limit(limit * 3)
    .get()

  const retryableFailed = failedSnap.docs
    .map((doc) => mapDelivery(doc.id, doc.data()))
    .filter((delivery) => {
      if (delivery.attempts >= 3) return false
      return !delivery.nextAttemptAt || delivery.nextAttemptAt.getTime() <= now.toMillis()
    })
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .slice(0, limit - pending.length)

  return [...pending, ...retryableFailed]
}

export const incrementCampaignMetrics = async (
  companyId: string,
  campaignId: string,
  deltas: Partial<CampaignMetrics>,
) => {
  const ref = campaignsRef(companyId).doc(campaignId)
  const snap = await ref.get()
  if (!snap.exists) return

  const metrics = mapMetrics(snap.data()?.metrics as FirebaseFirestore.DocumentData)
  const next: CampaignMetrics = {
    targeted: metrics.targeted + (deltas.targeted ?? 0),
    queued: Math.max(0, metrics.queued + (deltas.queued ?? 0)),
    sent: metrics.sent + (deltas.sent ?? 0),
    delivered: metrics.delivered + (deltas.delivered ?? 0),
    failed: metrics.failed + (deltas.failed ?? 0),
    skipped: metrics.skipped + (deltas.skipped ?? 0),
    responses: metrics.responses + (deltas.responses ?? 0),
    botReplies: metrics.botReplies + (deltas.botReplies ?? 0),
    responseRate: 0,
  }

  next.responseRate =
    next.delivered > 0 ? Math.round((next.responses / next.delivered) * 1000) / 1000 : 0

  await ref.update({
    metrics: next,
    updatedAt: FieldValue.serverTimestamp(),
  })
}

export const updateCampaignRuntime = async (
  companyId: string,
  campaignId: string,
  runtime: CampaignRuntime,
) => {
  await campaignsRef(companyId)
    .doc(campaignId)
    .update({
      runtime: {
        lastBatchAt: runtime.lastBatchAt ? Timestamp.fromDate(runtime.lastBatchAt) : null,
        sentInCurrentInterval: runtime.sentInCurrentInterval,
      },
      updatedAt: FieldValue.serverTimestamp(),
    })
}

export const markCampaignCompletedIfDone = async (companyId: string, campaignId: string) => {
  const activeSnap = await campaignDeliveriesRef(companyId)
    .where("campaignId", "==", campaignId)
    .where("status", "in", ["pending", "queued", "sent"])
    .limit(1)
    .get()

  if (!activeSnap.empty) return false

  const failedSnap = await campaignDeliveriesRef(companyId)
    .where("campaignId", "==", campaignId)
    .where("status", "==", "failed")
    .limit(100)
    .get()

  const hasRetryableFailed = failedSnap.docs.some((doc) => {
    const attempts = Number(doc.data().attempts ?? 0)
    return attempts < 3
  })

  if (hasRetryableFailed) return false

  await campaignsRef(companyId).doc(campaignId).update({
    status: "completed",
    completedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })

  await clearCampaignConversationFlags(companyId, campaignId)
  return true
}

export const trackCampaignResponse = async (
  companyId: string,
  params: {
    campaignId: string
    deliveryId: string
  },
) => {
  const deliveryRef = campaignDeliveriesRef(companyId).doc(params.deliveryId)
  const deliverySnap = await deliveryRef.get()
  if (!deliverySnap.exists) return

  const delivery = mapDelivery(deliverySnap.id, deliverySnap.data()!)
  if (delivery.status === "responded") return

  await deliveryRef.update({
    status: "responded",
    respondedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })

  await incrementCampaignMetrics(companyId, params.campaignId, {
    responses: 1,
  })
}

export const getCampaignDelivery = async (
  companyId: string,
  deliveryId: string,
): Promise<CampaignDeliveryRecord | null> => {
  const snap = await campaignDeliveriesRef(companyId).doc(deliveryId).get()
  if (!snap.exists) return null
  return mapDelivery(snap.id, snap.data()!)
}

export {
  campaignsRef,
  campaignDeliveriesRef,
  mapCampaign,
  mapDelivery,
}
