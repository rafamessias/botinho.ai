"use server"

import { z } from "zod"
import { BaseActionResponse, handleAction, resolveCompanyContext } from "./utils"
import { extractUnknownCampaignTokens } from "@/lib/campaign/message-variables"
import {
  cancelCampaign,
  createCampaign,
  duplicateCampaign,
  getCampaign,
  getCampaignMetricsDetail,
  launchCampaign,
  listCampaigns,
  pauseCampaign,
  previewCampaignAudience,
  resumeCampaign,
  updateCampaign,
  type CampaignAudiencePreview,
  type CampaignMetricsDetail,
  type CampaignRecord,
  type CampaignSummary,
} from "@/lib/firebase/services/campaign-service"
import { processCampaignBatch } from "@/lib/campaign/campaign-delivery"
import type { CampaignTargetCustomerStatus } from "@/lib/types/campaign"

const scheduleSchema = z.object({
  startAt: z.string().datetime().optional(),
  messagesPerInterval: z.number().int().min(1).max(500),
  intervalMinutes: z.number().int().min(1).max(1440),
})

const campaignInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional(),
  messageTemplate: z.string().trim().min(1).max(4096),
  targetTags: z.array(z.string().trim().min(1)).min(1).max(20),
  targetCustomerStatus: z.enum(["active", "inactive", "prospect"]).optional(),
  agentId: z.string().min(1).optional().nullable(),
  sessionId: z.string().min(1).optional().nullable(),
  schedule: scheduleSchema.optional(),
})

export type CampaignView = CampaignRecord
export type CampaignSummaryView = CampaignSummary
export type CampaignAudiencePreviewView = CampaignAudiencePreview
export type CampaignMetricsView = CampaignMetricsDetail

const mapScheduleInput = (schedule?: z.infer<typeof scheduleSchema>) => {
  if (!schedule) return undefined
  return {
    startAt: schedule.startAt ? new Date(schedule.startAt) : undefined,
    messagesPerInterval: schedule.messagesPerInterval,
    intervalMinutes: schedule.intervalMinutes,
  }
}

export const listCampaignsAction = async (): Promise<
  BaseActionResponse<{ campaigns: CampaignSummaryView[] }>
> =>
  handleAction(async () => {
    const { companyId } = await resolveCompanyContext()
    const campaigns = await listCampaigns(companyId)
    return { success: true, data: { campaigns } }
  })

export const getCampaignAction = async (input: {
  campaignId: string
}): Promise<BaseActionResponse<{ campaign: CampaignView }>> =>
  handleAction(async () => {
    const payload = z.object({ campaignId: z.string().min(1) }).parse(input)
    const { companyId } = await resolveCompanyContext()
    const campaign = await getCampaign(companyId, payload.campaignId)
    if (!campaign) throw new Error("Campaign not found")
    return { success: true, data: { campaign } }
  })

export const createCampaignAction = async (
  input: z.infer<typeof campaignInputSchema>,
): Promise<BaseActionResponse<{ campaign: CampaignView }>> =>
  handleAction(async () => {
    const payload = campaignInputSchema.parse(input)
    const unknownTokens = extractUnknownCampaignTokens(payload.messageTemplate)
    if (unknownTokens.length > 0) {
      throw new Error(`Unknown variables: ${unknownTokens.join(", ")}`)
    }

    const { companyId, userId } = await resolveCompanyContext({ requireCanPost: true })
    const campaign = await createCampaign(companyId, userId, {
      name: payload.name,
      description: payload.description,
      messageTemplate: payload.messageTemplate,
      targetTags: payload.targetTags,
      targetCustomerStatus: payload.targetCustomerStatus as CampaignTargetCustomerStatus | undefined,
      agentId: payload.agentId ?? undefined,
      sessionId: payload.sessionId ?? undefined,
      schedule: mapScheduleInput(payload.schedule),
    })
    return { success: true, data: { campaign }, message: "Campaign created" }
  })

export const updateCampaignAction = async (
  input: z.infer<typeof campaignInputSchema> & { campaignId: string },
): Promise<BaseActionResponse<{ campaign: CampaignView }>> =>
  handleAction(async () => {
    const payload = z
      .object({ campaignId: z.string().min(1) })
      .merge(campaignInputSchema.partial())
      .parse(input)

    if (payload.messageTemplate) {
      const unknownTokens = extractUnknownCampaignTokens(payload.messageTemplate)
      if (unknownTokens.length > 0) {
        throw new Error(`Unknown variables: ${unknownTokens.join(", ")}`)
      }
    }

    const { companyId } = await resolveCompanyContext({ requireCanPost: true })
    const { campaignId, schedule, ...rest } = payload
    const campaign = await updateCampaign(companyId, campaignId, {
      ...rest,
      targetCustomerStatus: rest.targetCustomerStatus as CampaignTargetCustomerStatus | undefined,
      schedule: mapScheduleInput(schedule),
    })
    return { success: true, data: { campaign }, message: "Campaign updated" }
  })

export const launchCampaignAction = async (input: {
  campaignId: string
}): Promise<BaseActionResponse<{ campaign: CampaignView }>> =>
  handleAction(async () => {
    const payload = z.object({ campaignId: z.string().min(1) }).parse(input)
    const { companyId } = await resolveCompanyContext({ requireCanPost: true })
    let campaign = await launchCampaign(companyId, payload.campaignId)

    if (campaign.status === "running") {
      await processCampaignBatch(companyId, campaign.id)
      const refreshed = await getCampaign(companyId, campaign.id)
      if (refreshed) campaign = refreshed
    }

    return { success: true, data: { campaign }, message: "Campaign launched" }
  })

export const pauseCampaignAction = async (input: {
  campaignId: string
}): Promise<BaseActionResponse<{ campaign: CampaignView }>> =>
  handleAction(async () => {
    const payload = z.object({ campaignId: z.string().min(1) }).parse(input)
    const { companyId } = await resolveCompanyContext({ requireCanPost: true })
    const campaign = await pauseCampaign(companyId, payload.campaignId)
    return { success: true, data: { campaign }, message: "Campaign paused" }
  })

export const resumeCampaignAction = async (input: {
  campaignId: string
}): Promise<BaseActionResponse<{ campaign: CampaignView }>> =>
  handleAction(async () => {
    const payload = z.object({ campaignId: z.string().min(1) }).parse(input)
    const { companyId } = await resolveCompanyContext({ requireCanPost: true })
    let campaign = await resumeCampaign(companyId, payload.campaignId)
    await processCampaignBatch(companyId, campaign.id)
    const refreshed = await getCampaign(companyId, campaign.id)
    if (refreshed) campaign = refreshed
    return { success: true, data: { campaign }, message: "Campaign resumed" }
  })

export const cancelCampaignAction = async (input: {
  campaignId: string
}): Promise<BaseActionResponse<{ campaign: CampaignView }>> =>
  handleAction(async () => {
    const payload = z.object({ campaignId: z.string().min(1) }).parse(input)
    const { companyId } = await resolveCompanyContext({ requireCanPost: true })
    const campaign = await cancelCampaign(companyId, payload.campaignId)
    return { success: true, data: { campaign }, message: "Campaign cancelled" }
  })

export const previewCampaignAudienceAction = async (input: {
  targetTags: string[]
  targetCustomerStatus?: CampaignTargetCustomerStatus
}): Promise<BaseActionResponse<{ preview: CampaignAudiencePreviewView }>> =>
  handleAction(async () => {
    const payload = z
      .object({
        targetTags: z.array(z.string().trim().min(1)).min(1).max(20),
        targetCustomerStatus: z.enum(["active", "inactive", "prospect"]).optional(),
      })
      .parse(input)
    const { companyId } = await resolveCompanyContext()
    const preview = await previewCampaignAudience(companyId, {
      targetTags: payload.targetTags,
      targetCustomerStatus: payload.targetCustomerStatus ?? "active",
    })
    return { success: true, data: { preview } }
  })

export const getCampaignMetricsAction = async (input: {
  campaignId: string
}): Promise<BaseActionResponse<{ metrics: CampaignMetricsView }>> =>
  handleAction(async () => {
    const payload = z.object({ campaignId: z.string().min(1) }).parse(input)
    const { companyId } = await resolveCompanyContext()
    const metrics = await getCampaignMetricsDetail(companyId, payload.campaignId)
    return { success: true, data: { metrics } }
  })

export const duplicateCampaignAction = async (input: {
  campaignId: string
}): Promise<BaseActionResponse<{ campaign: CampaignView }>> =>
  handleAction(async () => {
    const payload = z.object({ campaignId: z.string().min(1) }).parse(input)
    const { companyId, userId } = await resolveCompanyContext({ requireCanPost: true })
    const campaign = await duplicateCampaign(companyId, userId, payload.campaignId)
    return { success: true, data: { campaign }, message: "Campaign duplicated" }
  })

export const listCompanyTagsAction = async (): Promise<BaseActionResponse<{ tags: string[] }>> =>
  handleAction(async () => {
    const { companyId } = await resolveCompanyContext()
    const { adminDb } = await import("@/lib/firebase/admin")
    const { collections, companySubcollections } = await import("@/lib/firebase/collections")
    const snap = await adminDb
      .collection(collections.companies)
      .doc(companyId)
      .collection(companySubcollections.customers)
      .limit(500)
      .get()

    const tagMap = new Map<string, string>()
    for (const doc of snap.docs) {
      const tags = (doc.data().tags as string[] | undefined) ?? []
      for (const tag of tags) {
        const normalized = tag.trim().toLowerCase()
        if (normalized && !tagMap.has(normalized)) {
          tagMap.set(normalized, tag.trim())
        }
      }
    }

    return {
      success: true,
      data: { tags: Array.from(tagMap.values()).sort((a, b) => a.localeCompare(b)) },
    }
  })

export const listAgentsForCampaignAction = async (): Promise<
  BaseActionResponse<{
    agents: Array<{ id: string; name: string; sessionIds: string[]; autoReply: boolean }>
  }>
> =>
  handleAction(async () => {
    const { companyId, userId } = await resolveCompanyContext()
    const { listAiAgents } = await import("@/lib/firebase/services/ai-agent-service")
    const agents = await listAiAgents(companyId, userId)
    return {
      success: true,
      data: {
        agents: agents.map((agent) => ({
          id: agent.id,
          name: agent.name,
          sessionIds: agent.sessionIds,
          autoReply: agent.autoReply,
        })),
      },
    }
  })
