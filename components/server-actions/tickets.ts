"use server"

import { z } from "zod"
import type {
  Ticket,
  TicketActivity,
  TicketComment,
  TicketPriority,
  TicketStatus,
  TicketType,
} from "@/lib/types/ticket"
import { BaseActionResponse, handleAction, resolveCompanyContext } from "./utils"
import {
  addTicketComment,
  createTicket,
  listTicketActivities,
  listTicketComments,
  listTickets,
  updateTicket,
  type TicketActivityRecord,
  type TicketCommentRecord,
  type TicketRecord,
} from "@/lib/firebase/services/ticket-service"
import {
  decodeTicketListCursor,
  encodeTicketListCursor,
} from "@/lib/tickets/ticket-list-pagination"
import { DEFAULT_TICKET_STATUS_FILTERS } from "@/lib/tickets/ticket-status-filters"
import { getUserProfile } from "@/lib/firebase/services/user-service"

const ticketTypeSchema = z.enum(["customer_request", "order", "support", "complaint", "other"])
const ticketStatusSchema = z.enum(["open", "in_progress", "waiting", "resolved", "closed"])
const ticketPrioritySchema = z.enum(["low", "medium", "high"])

const resolveActorName = async (userId: string) => {
  const profile = await getUserProfile(userId)
  return profile ? [profile.firstName, profile.lastName].filter(Boolean).join(" ") : undefined
}

const mapTicketRecord = (record: TicketRecord): Ticket => ({
  id: record.id,
  ticketNumber: record.ticketNumber,
  ticketSequence: record.ticketSequence,
  ticketScopeCode: record.ticketScopeCode,
  title: record.title,
  description: record.description,
  type: record.type,
  status: record.status,
  priority: record.priority,
  customerId: record.customerId ?? undefined,
  customerName: record.customerName ?? undefined,
  orderReference: record.orderReference ?? undefined,
  conversationId: record.conversationId ?? undefined,
  assignedToId: record.assignedToId ?? undefined,
  assignedToName: record.assignedToName ?? undefined,
  createdById: record.createdById,
  createdByName: record.createdByName ?? undefined,
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
})

const mapCommentRecord = (record: TicketCommentRecord): TicketComment => ({
  id: record.id,
  ticketId: record.ticketId,
  content: record.content,
  authorId: record.authorId,
  authorName: record.authorName ?? undefined,
  createdAt: record.createdAt.toISOString(),
})

const mapActivityRecord = (record: TicketActivityRecord): TicketActivity => ({
  id: record.id,
  ticketId: record.ticketId,
  action: record.action,
  actorId: record.actorId,
  actorName: record.actorName ?? undefined,
  field: record.field ?? undefined,
  previousValue: record.previousValue ?? undefined,
  newValue: record.newValue ?? undefined,
  createdAt: record.createdAt.toISOString(),
})

const ticketInputSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1).max(5000),
  type: ticketTypeSchema,
  priority: ticketPrioritySchema.default("medium"),
  customerId: z.string().optional(),
  customerName: z.string().trim().optional(),
  orderReference: z.string().trim().max(200).optional(),
  conversationId: z.string().optional(),
})

const listTicketsSchema = z.object({
  companyId: z.string().optional(),
  search: z.string().optional(),
  status: ticketStatusSchema.optional(),
  statuses: z.array(ticketStatusSchema).optional(),
  type: ticketTypeSchema.optional(),
  pageSize: z.number().int().min(1).max(50).optional(),
  cursor: z.string().optional(),
})

const ticketIdSchema = z.object({
  ticketId: z.string().min(1),
})

export const listTicketsAction = async (
  input?: z.infer<typeof listTicketsSchema>,
): Promise<
  BaseActionResponse<{
    tickets: Ticket[]
    pagination: {
      pageSize: number
      hasMore: boolean
      nextCursor: string | null
    }
  }>
> =>
  handleAction(async () => {
    const payload = listTicketsSchema.parse(input ?? {})
    const { companyId } = await resolveCompanyContext({ companyId: payload.companyId })
    const statuses =
      payload.statuses !== undefined
        ? payload.statuses.length > 0
          ? payload.statuses
          : undefined
        : payload.status
          ? [payload.status]
          : DEFAULT_TICKET_STATUS_FILTERS
    const decodedCursor = payload.cursor ? decodeTicketListCursor(payload.cursor) : null
    const result = await listTickets({
      companyId,
      search: payload.search,
      statuses,
      type: payload.type,
      pageSize: payload.pageSize,
      cursor: decodedCursor,
    })

    return {
      success: true,
      data: {
        tickets: result.tickets.map(mapTicketRecord),
        pagination: {
          pageSize: result.pagination.pageSize,
          hasMore: result.pagination.hasMore,
          nextCursor: result.pagination.nextCursor
            ? encodeTicketListCursor(result.pagination.nextCursor)
            : null,
        },
      },
    }
  })

export const listTicketCommentsAction = async (
  input: z.infer<typeof ticketIdSchema>,
): Promise<BaseActionResponse<{ comments: TicketComment[] }>> =>
  handleAction(async () => {
    const payload = ticketIdSchema.parse(input)
    const { companyId } = await resolveCompanyContext()
    const comments = await listTicketComments(companyId, payload.ticketId)
    return {
      success: true,
      data: { comments: comments.map(mapCommentRecord) },
    }
  })

export const listTicketActivitiesAction = async (
  input: z.infer<typeof ticketIdSchema>,
): Promise<BaseActionResponse<{ activities: TicketActivity[] }>> =>
  handleAction(async () => {
    const payload = ticketIdSchema.parse(input)
    const { companyId } = await resolveCompanyContext()
    const activities = await listTicketActivities(companyId, payload.ticketId)
    return {
      success: true,
      data: { activities: activities.map(mapActivityRecord) },
    }
  })

export const createTicketAction = async (
  input: z.infer<typeof ticketInputSchema>,
): Promise<BaseActionResponse<{ ticket: Ticket }>> =>
  handleAction(async () => {
    const payload = ticketInputSchema.parse(input)
    const { companyId, userId } = await resolveCompanyContext({ requireCanPost: true })
    const userName = await resolveActorName(userId)

    const ticket = await createTicket({
      companyId,
      userId,
      userName,
      title: payload.title,
      description: payload.description,
      type: payload.type,
      priority: payload.priority,
      customerId: payload.customerId,
      customerName: payload.customerName,
      orderReference: payload.orderReference,
      conversationId: payload.conversationId,
    })

    return {
      success: true,
      data: { ticket: mapTicketRecord(ticket) },
    }
  })

const updateTicketSchema = ticketInputSchema
  .partial()
  .extend({
    ticketId: z.string().min(1),
    status: ticketStatusSchema.optional(),
    customerId: z.string().nullable().optional(),
    customerName: z.string().nullable().optional(),
    assignedToId: z.string().nullable().optional(),
    assignedToName: z.string().nullable().optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.description !== undefined ||
      data.type !== undefined ||
      data.priority !== undefined ||
      data.status !== undefined ||
      data.customerId !== undefined ||
      data.customerName !== undefined ||
      data.orderReference !== undefined ||
      data.assignedToId !== undefined ||
      data.assignedToName !== undefined,
    { message: "At least one field must be provided" },
  )

export const updateTicketAction = async (
  input: z.infer<typeof updateTicketSchema>,
): Promise<BaseActionResponse<{ ticket: Ticket }>> =>
  handleAction(async () => {
    const payload = updateTicketSchema.parse(input)
    const { companyId, userId } = await resolveCompanyContext({ requireCanPost: true })
    const userName = await resolveActorName(userId)

    const ticket = await updateTicket({
      companyId,
      ticketId: payload.ticketId,
      actor: { userId, userName },
      title: payload.title,
      description: payload.description,
      type: payload.type as TicketType | undefined,
      status: payload.status as TicketStatus | undefined,
      priority: payload.priority as TicketPriority | undefined,
      customerId: payload.customerId,
      customerName: payload.customerName,
      orderReference: payload.orderReference,
      assignedToId: payload.assignedToId,
      assignedToName: payload.assignedToName,
    })

    return {
      success: true,
      data: { ticket: mapTicketRecord(ticket) },
    }
  })

const addTicketCommentSchema = ticketIdSchema.extend({
  content: z.string().trim().min(1).max(5000),
})

export const addTicketCommentAction = async (
  input: z.infer<typeof addTicketCommentSchema>,
): Promise<BaseActionResponse<{ comment: TicketComment }>> =>
  handleAction(async () => {
    const payload = addTicketCommentSchema.parse(input)
    const { companyId, userId } = await resolveCompanyContext({ requireCanPost: true })
    const userName = await resolveActorName(userId)

    const comment = await addTicketComment({
      companyId,
      ticketId: payload.ticketId,
      actor: { userId, userName },
      content: payload.content,
    })

    return {
      success: true,
      data: { comment: mapCommentRecord(comment) },
    }
  })
