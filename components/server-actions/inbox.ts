"use server"

import { z } from "zod"
import { BaseActionResponse, handleAction, resolveCompanyContext } from "./utils"
import {
  createInboxConversation,
  createInboxMessage,
  getInboxConversationDetail,
  getLastCustomerMessage,
  listInboxConversations,
  markConversationRead,
  sanitizeTags,
  updateConversationMetadata,
} from "@/lib/firebase/services/inbox-service"
import { generateSuggestedResponses } from "@/lib/firebase/ai/generate"
import type {
  InboxConversationPriority,
  InboxMessageSenderType,
  InboxMessageStatus,
} from "@/lib/firebase/types"

const companyIdSchema = z.object({
  companyId: z.string().optional(),
})

const getInboxConversationsSchema = companyIdSchema.extend({
  search: z.string().optional(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().min(1).max(100).optional(),
  includeCounts: z.boolean().optional(),
  includeArchived: z.boolean().optional(),
})

export const getInboxConversationsAction = async (
  input?: z.infer<typeof getInboxConversationsSchema>,
): Promise<
  BaseActionResponse<{
    conversations: Awaited<ReturnType<typeof listInboxConversations>>["conversations"]
    pagination: Awaited<ReturnType<typeof listInboxConversations>>["pagination"]
    metrics?: { unreadTotal: number }
  }>
> =>
  handleAction(async () => {
    const payload = getInboxConversationsSchema.parse(input ?? {})
    const { companyId } = await resolveCompanyContext({ companyId: payload.companyId })
    const result = await listInboxConversations({
      companyId,
      search: payload.search,
      page: payload.page,
      pageSize: payload.pageSize,
      includeArchived: payload.includeArchived,
    })

    return {
      success: true,
      data: {
        conversations: result.conversations,
        pagination: result.pagination,
        ...(payload.includeCounts ? { metrics: result.metrics } : {}),
      },
    }
  })

const getInboxConversationDetailSchema = z.object({
  conversationId: z.string().min(1),
})

export const getInboxConversationDetailAction = async (
  input: z.infer<typeof getInboxConversationDetailSchema>,
): Promise<BaseActionResponse<NonNullable<Awaited<ReturnType<typeof getInboxConversationDetail>>>>> =>
  handleAction(async () => {
    const payload = getInboxConversationDetailSchema.parse(input)
    const { companyId } = await resolveCompanyContext()

    const conversation = await getInboxConversationDetail({
      companyId,
      conversationId: payload.conversationId,
    })

    if (!conversation) {
      return { success: false, error: "Conversation not found" }
    }

    return { success: true, data: conversation }
  })

const baseCustomerSchema = z.object({
  name: z.string().trim().min(1),
  phone: z.string().trim().min(8).max(20).optional(),
  email: z.string().trim().email().optional(),
  address: z.string().trim().max(255).optional(),
  notes: z.string().trim().max(1000).optional(),
})

const createInboxConversationSchema = companyIdSchema.extend({
  customer: baseCustomerSchema,
  priority: z.enum(["low", "medium", "high"]).optional(),
  tags: z.array(z.string()).max(15).optional(),
  satisfactionScore: z.number().int().min(1).max(5).optional(),
  subject: z.string().trim().max(255).optional(),
  initialMessage: z
    .object({
      content: z.string().trim().min(1),
      senderType: z.enum(["customer", "agent", "bot", "system"]).default("agent"),
      status: z.enum(["pending", "sent", "delivered", "read", "failed"]).optional(),
    })
    .optional(),
})

export const createInboxConversationAction = async (
  input: z.infer<typeof createInboxConversationSchema>,
): Promise<
  BaseActionResponse<{
    conversation: Awaited<ReturnType<typeof createInboxConversation>>["conversation"]
    initialMessage?: Awaited<ReturnType<typeof createInboxMessage>>
  }>
> =>
  handleAction(async () => {
    const payload = createInboxConversationSchema.parse(input)
    const { companyId, userId } = await resolveCompanyContext({
      companyId: payload.companyId,
      requireCanPost: true,
    })

    const result = await createInboxConversation({
      companyId,
      customer: payload.customer,
      priority: payload.priority as InboxConversationPriority | undefined,
      tags: payload.tags,
      satisfactionScore: payload.satisfactionScore,
      subject: payload.subject,
      initialMessage: payload.initialMessage
        ? {
            content: payload.initialMessage.content,
            senderType: payload.initialMessage.senderType as InboxMessageSenderType,
            senderUserId:
              payload.initialMessage.senderType === "agent" ? userId : undefined,
            status: payload.initialMessage.status as InboxMessageStatus | undefined,
          }
        : undefined,
    })

    return { success: true, data: result }
  })

const sendInboxMessageSchema = z.object({
  conversationId: z.string().min(1),
  content: z.string().trim().min(1),
  senderType: z.enum(["customer", "agent", "bot", "system"]).default("agent"),
  status: z.enum(["pending", "sent", "delivered", "read", "failed"]).optional(),
})

export const sendInboxMessageAction = async (
  input: z.infer<typeof sendInboxMessageSchema>,
): Promise<
  BaseActionResponse<{
    message: Awaited<ReturnType<typeof createInboxMessage>>
    conversation: NonNullable<Awaited<ReturnType<typeof getInboxConversationDetail>>>
  }>
> =>
  handleAction(async () => {
    const payload = sendInboxMessageSchema.parse(input)
    const { companyId, userId } = await resolveCompanyContext({ requireCanPost: true })

    const conversationDetail = await getInboxConversationDetail({
      companyId,
      conversationId: payload.conversationId,
    })

    if (!conversationDetail) {
      return { success: false, error: "Conversation not found" }
    }

    const message = await createInboxMessage({
      companyId,
      conversationId: payload.conversationId,
      content: payload.content,
      senderType: payload.senderType as InboxMessageSenderType,
      senderUserId: payload.senderType === "agent" ? userId : undefined,
      status: payload.status as InboxMessageStatus | undefined,
      incrementUnread: payload.senderType === "customer",
    })

    const conversation = await getInboxConversationDetail({
      companyId,
      conversationId: payload.conversationId,
    })

    return {
      success: true,
      data: {
        message,
        conversation: conversation!,
      },
    }
  })

const markInboxConversationReadSchema = z.object({
  conversationId: z.string().min(1),
})

export const markInboxConversationReadAction = async (
  input: z.infer<typeof markInboxConversationReadSchema>,
): Promise<BaseActionResponse<{ conversationId: string }>> =>
  handleAction(async () => {
    const payload = markInboxConversationReadSchema.parse(input)
    const { companyId } = await resolveCompanyContext()

    await markConversationRead({
      companyId,
      conversationId: payload.conversationId,
    })

    return { success: true, data: { conversationId: payload.conversationId } }
  })

const updateInboxConversationMetadataSchema = z.object({
  conversationId: z.string().min(1),
  priority: z.enum(["low", "medium", "high"]).optional(),
  tags: z.array(z.string()).max(20).optional(),
  satisfactionScore: z.number().int().min(1).max(5).optional(),
  assignedToId: z.string().nullable().optional(),
  isArchived: z.boolean().optional(),
})

export const updateInboxConversationMetadataAction = async (
  input: z.infer<typeof updateInboxConversationMetadataSchema>,
): Promise<BaseActionResponse<{ conversation: Awaited<ReturnType<typeof updateConversationMetadata>> }>> =>
  handleAction(async () => {
    const payload = updateInboxConversationMetadataSchema.parse(input)
    const { companyId } = await resolveCompanyContext()

    const conversation = await updateConversationMetadata({
      companyId,
      conversationId: payload.conversationId,
      priority: payload.priority as InboxConversationPriority | undefined,
      tags: payload.tags ? sanitizeTags(payload.tags) : undefined,
      satisfactionScore: payload.satisfactionScore,
      assignedToId: payload.assignedToId,
      isArchived: payload.isArchived,
    })

    return { success: true, data: { conversation } }
  })

const getSuggestedResponsesSchema = z.object({
  conversationId: z.string().optional(),
  customerMessage: z.string().trim().optional(),
})

export const getSuggestedResponsesAction = async (
  input?: z.infer<typeof getSuggestedResponsesSchema>,
): Promise<
  BaseActionResponse<Array<{ id: string; text: string; category: string }>>
> =>
  handleAction(async () => {
    const payload = getSuggestedResponsesSchema.parse(input ?? {})
    const { companyId } = await resolveCompanyContext()

    let customerMessage = payload.customerMessage

    if (!customerMessage && payload.conversationId) {
      const lastMessage = await getLastCustomerMessage({
        companyId,
        conversationId: payload.conversationId,
      })
      customerMessage = lastMessage?.content
    }

    const suggestions = await generateSuggestedResponses({
      companyId,
      conversationId: payload.conversationId,
      customerMessage,
    })

    return { success: true, data: suggestions }
  })
