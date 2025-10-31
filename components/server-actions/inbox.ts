"use server"

import { prisma } from "@/prisma/lib/prisma"
import { InboxConversationPriority, InboxMessageSenderType, InboxMessageStatus, Prisma } from "@/lib/generated/prisma"
import { z } from "zod"
import { BaseActionResponse, handleAction, resolveCompanyContext } from "./utils"

const baseCustomerSchema = z.object({
    name: z.string().trim().min(1),
    phone: z
        .string()
        .trim()
        .min(8)
        .max(20)
        .optional(),
    email: z.string().trim().email().optional(),
    address: z.string().trim().max(255).optional(),
    notes: z.string().trim().max(1000).optional(),
})

const sanitizeTags = (tags?: string[]) => {
    if (!tags?.length) return []

    const seen = new Set<string>()
    const sanitized: string[] = []

    for (const tag of tags) {
        if (sanitized.length >= 20) break

        const trimmed = tag.trim()
        if (!trimmed) continue

        const normalized = trimmed.toLowerCase()
        if (seen.has(normalized)) continue

        seen.add(normalized)
        sanitized.push(trimmed)
    }

    return sanitized
}

const conversationInclude = {
    customer: {
        select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            address: true,
        },
    },
    assignedTo: {
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
        },
    },
} as const

type ConversationWithRelations = Prisma.InboxConversationGetPayload<{ include: typeof conversationInclude }>
type InboxMessageEntity = Awaited<ReturnType<typeof prisma.inboxMessage.findMany>>[number]

const getInboxConversationsSchema = z.object({
    companyId: z.number().optional(),
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
        conversations: ConversationWithRelations[]
        pagination: {
            page: number
            pageSize: number
            total: number
            totalPages: number
        }
        metrics?: {
            unreadTotal: number
        }
    }>
> =>
    handleAction(async () => {
        const payload = getInboxConversationsSchema.parse(input ?? {})
        const { companyId } = await resolveCompanyContext({ companyId: payload.companyId })

        const page = payload.page ?? 1
        const pageSize = payload.pageSize ?? 20
        const skip = (page - 1) * pageSize

        const searchTerm = payload.search?.trim() ?? ""

        const where = {
            companyId,
            ...(payload.includeArchived ? {} : { isArchived: false }),
            ...(searchTerm
                ? {
                    OR: [
                        { customer: { name: { contains: searchTerm, mode: "insensitive" } } },
                        { customer: { email: { contains: searchTerm, mode: "insensitive" } } },
                        { customer: { phone: { contains: searchTerm } } },
                        { lastMessagePreview: { contains: searchTerm, mode: "insensitive" } },
                        { tags: { has: searchTerm } },
                    ],
                }
                : {}),
        }

        const conversationsPromise = prisma.inboxConversation.findMany({
            where,
            include: conversationInclude,
            orderBy: [
                { lastMessageSentAt: "desc" },
                { updatedAt: "desc" },
            ],
            skip,
            take: pageSize,
        })

        const totalPromise = prisma.inboxConversation.count({ where })

        const unreadPromise = payload.includeCounts
            ? prisma.inboxConversation.aggregate({
                where: { ...where, unreadCount: { gt: 0 } },
                _sum: { unreadCount: true },
            })
            : Promise.resolve<{ _sum: { unreadCount: number | null } }>({
                _sum: { unreadCount: 0 },
            })

        const [conversations, total, unreadAggregate] = await Promise.all([
            conversationsPromise,
            totalPromise,
            unreadPromise,
        ])

        const totalPages = Math.max(1, Math.ceil(total / pageSize))
        const metrics = payload.includeCounts
            ? { unreadTotal: unreadAggregate._sum.unreadCount ?? 0 }
            : undefined

        return {
            success: true,
            data: {
                conversations,
                pagination: { page, pageSize, total, totalPages },
                ...(metrics ? { metrics } : {}),
            },
        }
    })

export const getInboxConversationDetailAction = async (
    input: z.infer<typeof getInboxConversationDetailSchema>,
): Promise<BaseActionResponse<ConversationWithRelations & { messages: InboxMessageEntity[] }>> =>
    handleAction(async () => {
        const payload = getInboxConversationDetailSchema.parse(input)
        const { companyId } = await resolveCompanyContext()

        const conversation = await prisma.inboxConversation.findFirst({
            where: {
                id: payload.conversationId,
                companyId,
            },
            include: conversationInclude,
        })

        if (!conversation) {
            return { success: false, error: "Conversation not found" }
        }

        const messages = await prisma.inboxMessage.findMany({
            where: {
                conversationId: conversation.id,
                companyId,
            },
            orderBy: { sentAt: "asc" },
        })

        return {
            success: true,
            data: {
                ...conversation,
                messages,
            },
        }
    })

const getInboxConversationDetailSchema = z.object({
    conversationId: z.string().cuid(),
})

const createInboxConversationSchema = z.object({
    companyId: z.number().optional(),
    customer: baseCustomerSchema,
    priority: z.nativeEnum(InboxConversationPriority).optional(),
    tags: z.array(z.string()).max(15).optional(),
    satisfactionScore: z.number().int().min(1).max(5).optional(),
    subject: z.string().trim().max(255).optional(),
    initialMessage: z
        .object({
            content: z.string().trim().min(1),
            senderType: z.nativeEnum(InboxMessageSenderType).default(InboxMessageSenderType.agent),
            status: z.nativeEnum(InboxMessageStatus).optional(),
        })
        .optional(),
})

export const createInboxConversationAction = async (
    input: z.infer<typeof createInboxConversationSchema>,
): Promise<
    BaseActionResponse<
        {
            conversation: ConversationWithRelations
            initialMessage?: InboxMessageEntity
        }
    >
> =>
    handleAction(async () => {
        const payload = createInboxConversationSchema.parse(input)
        const { companyId, userId } = await resolveCompanyContext({
            companyId: payload.companyId,
            requireCanPost: true,
        })

        const normalizedTags = sanitizeTags(payload.tags)

        const identifierFilters: Prisma.InboxCustomerWhereInput[] = []
        if (payload.customer.email) {
            identifierFilters.push({ email: payload.customer.email })
        }
        if (payload.customer.phone) {
            identifierFilters.push({ phone: payload.customer.phone })
        }

        const existingCustomer = identifierFilters.length
            ? await prisma.inboxCustomer.findFirst({
                where: {
                    companyId,
                    OR: identifierFilters,
                },
            })
            : null

        const conversationResult = await prisma.$transaction(async (tx) => {
            const customer = existingCustomer
                ? await tx.inboxCustomer.update({
                    where: { id: existingCustomer.id },
                    data: {
                        name: payload.customer.name,
                        phone: payload.customer.phone,
                        email: payload.customer.email,
                        address: payload.customer.address,
                        notes: payload.customer.notes,
                    },
                })
                : await tx.inboxCustomer.create({
                    data: {
                        companyId,
                        name: payload.customer.name,
                        phone: payload.customer.phone,
                        email: payload.customer.email,
                        address: payload.customer.address,
                        notes: payload.customer.notes,
                    },
                })

            const conversation = await tx.inboxConversation.create({
                data: {
                    companyId,
                    customerId: customer.id,
                    subject: payload.subject,
                    priority: payload.priority ?? InboxConversationPriority.medium,
                    tags: normalizedTags,
                    satisfactionScore: payload.satisfactionScore,
                },
                include: conversationInclude,
            })

            if (!payload.initialMessage) {
                return { conversation }
            }

            const message = await tx.inboxMessage.create({
                data: {
                    companyId,
                    conversationId: conversation.id,
                    senderType: payload.initialMessage.senderType,
                    senderUserId:
                        payload.initialMessage.senderType === InboxMessageSenderType.agent
                            ? userId
                            : undefined,
                    content: payload.initialMessage.content,
                    status: payload.initialMessage.status ?? InboxMessageStatus.sent,
                },
            })

            const updatedConversation = await tx.inboxConversation.update({
                where: { id: conversation.id },
                data: {
                    lastMessagePreview: payload.initialMessage.content,
                    lastMessageSentAt: message.sentAt,
                    unreadCount:
                        payload.initialMessage.senderType === InboxMessageSenderType.customer ? 1 : 0,
                },
                include: conversationInclude,
            })

            return { conversation: updatedConversation, message }
        })

        return {
            success: true,
            data: {
                conversation: conversationResult.conversation,
                initialMessage: conversationResult.message,
            },
        }
    })

const sendInboxMessageSchema = z.object({
    conversationId: z.string().cuid(),
    content: z.string().trim().min(1),
    senderType: z
        .nativeEnum(InboxMessageSenderType)
        .default(InboxMessageSenderType.agent),
    status: z.nativeEnum(InboxMessageStatus).optional(),
})

export const sendInboxMessageAction = async (
    input: z.infer<typeof sendInboxMessageSchema>,
): Promise<
    BaseActionResponse<{
        message: InboxMessageEntity
        conversation: ConversationWithRelations
    }>
> =>
    handleAction(async () => {
        const payload = sendInboxMessageSchema.parse(input)
        const { companyId, userId } = await resolveCompanyContext({ requireCanPost: true })

        const conversation = await prisma.inboxConversation.findFirst({
            where: {
                id: payload.conversationId,
                companyId,
            },
            select: { id: true },
        })

        if (!conversation) {
            return { success: false, error: "Conversation not found" }
        }

        const result = await prisma.$transaction(async (tx) => {
            const message = await tx.inboxMessage.create({
                data: {
                    companyId,
                    conversationId: payload.conversationId,
                    senderType: payload.senderType,
                    senderUserId:
                        payload.senderType === InboxMessageSenderType.agent ? userId : undefined,
                    content: payload.content,
                    status: payload.status ?? InboxMessageStatus.sent,
                },
            })

            const updatedConversation = await tx.inboxConversation.update({
                where: { id: payload.conversationId },
                data: {
                    lastMessagePreview: payload.content,
                    lastMessageSentAt: message.sentAt,
                    unreadCount:
                        payload.senderType === InboxMessageSenderType.customer
                            ? { increment: 1 }
                            : { set: 0 },
                },
                include: conversationInclude,
            })

            return { message, conversation: updatedConversation }
        })

        return {
            success: true,
            data: result,
        }
    })

const markInboxConversationReadSchema = z.object({
    conversationId: z.string().cuid(),
})

export const markInboxConversationReadAction = async (
    input: z.infer<typeof markInboxConversationReadSchema>,
): Promise<BaseActionResponse<{ conversationId: string }>> =>
    handleAction(async () => {
        const payload = markInboxConversationReadSchema.parse(input)
        const { companyId } = await resolveCompanyContext()

        await prisma.inboxConversation.updateMany({
            where: {
                id: payload.conversationId,
                companyId,
            },
            data: { unreadCount: 0 },
        })

        return {
            success: true,
            data: { conversationId: payload.conversationId },
        }
    })

const updateInboxConversationMetadataSchema = z.object({
    conversationId: z.string().cuid(),
    priority: z.nativeEnum(InboxConversationPriority).optional(),
    tags: z.array(z.string()).max(20).optional(),
    satisfactionScore: z.number().int().min(1).max(5).optional(),
    assignedToId: z.number().int().positive().nullable().optional(),
    isArchived: z.boolean().optional(),
})

export const updateInboxConversationMetadataAction = async (
    input: z.infer<typeof updateInboxConversationMetadataSchema>,
): Promise<BaseActionResponse<{ conversation: ConversationWithRelations }>> =>
    handleAction(async () => {
        const payload = updateInboxConversationMetadataSchema.parse(input)
        const { companyId } = await resolveCompanyContext()

        const conversation = await prisma.inboxConversation.findFirst({
            where: { id: payload.conversationId, companyId },
            select: { id: true },
        })

        if (!conversation) {
            return { success: false, error: "Conversation not found" }
        }

        const data: Prisma.InboxConversationUpdateInput = {}

        if (payload.priority) {
            data.priority = payload.priority
        }

        if (payload.tags) {
            data.tags = sanitizeTags(payload.tags)
        }

        if (payload.satisfactionScore != null) {
            data.satisfactionScore = payload.satisfactionScore
        }

        if (payload.assignedToId !== undefined) {
            if (payload.assignedToId === null) {
                data.assignedToId = { set: null }
            } else {
                const assigneeMembership = await prisma.companyMember.findUnique({
                    where: {
                        userId_companyId: {
                            userId: payload.assignedToId,
                            companyId,
                        },
                    },
                    select: { companyMemberStatus: true },
                })

                if (!assigneeMembership || assigneeMembership.companyMemberStatus !== "accepted") {
                    return { success: false, error: "Assignee must belong to the company" }
                }

                data.assignedToId = { set: payload.assignedToId }
            }
        }

        if (payload.isArchived != null) {
            data.isArchived = payload.isArchived
            data.archivedAt = payload.isArchived ? new Date() : null
        }

        const updatedConversation = await prisma.inboxConversation.update({
            where: { id: payload.conversationId },
            data,
            include: conversationInclude,
        })

        return {
            success: true,
            data: { conversation: updatedConversation },
        }
    })

const recordCustomerMessageSchema = z.object({
    conversationId: z.string().cuid(),
    content: z.string().trim().min(1),
    status: z.nativeEnum(InboxMessageStatus).optional(),
})

export const recordCustomerMessageAction = async (
    input: z.infer<typeof recordCustomerMessageSchema>,
): Promise<BaseActionResponse<{ message: Awaited<ReturnType<typeof prisma.inboxMessage.create>> }>> =>
    handleAction(async () => {
        const payload = recordCustomerMessageSchema.parse(input)
        const { companyId } = await resolveCompanyContext()

        const conversation = await prisma.inboxConversation.findFirst({
            where: { id: payload.conversationId, companyId },
            select: { id: true },
        })

        if (!conversation) {
            return { success: false, error: "Conversation not found" }
        }

        const message = await prisma.$transaction(async (tx) => {
            const createdMessage = await tx.inboxMessage.create({
                data: {
                    companyId,
                    conversationId: payload.conversationId,
                    senderType: InboxMessageSenderType.customer,
                    content: payload.content,
                    status: payload.status ?? InboxMessageStatus.delivered,
                },
            })

            await tx.inboxConversation.update({
                where: { id: payload.conversationId },
                data: {
                    lastMessagePreview: payload.content,
                    lastMessageSentAt: createdMessage.sentAt,
                    unreadCount: { increment: 1 },
                },
            })

            return createdMessage
        })

        return {
            success: true,
            data: { message },
        }
    })

const getSuggestedResponsesSchema = z.object({
    conversationId: z.string().cuid().optional(),
    customerMessage: z.string().trim().optional(),
})

export const getSuggestedResponsesAction = async (
    input?: z.infer<typeof getSuggestedResponsesSchema>,
): Promise<
    BaseActionResponse<
        Array<{
            id: string
            text: string
            category: string
        }>
    >
> =>
    handleAction(async () => {
        const payload = getSuggestedResponsesSchema.parse(input ?? {})
        const { companyId } = await resolveCompanyContext()

        let lastCustomerMessage = payload.customerMessage?.toLowerCase() ?? ""

        if (!lastCustomerMessage && payload.conversationId) {
            const lastMessage = await prisma.inboxMessage.findFirst({
                where: {
                    conversationId: payload.conversationId,
                    companyId,
                    senderType: InboxMessageSenderType.customer,
                },
                orderBy: { sentAt: "desc" },
                select: { content: true },
            })

            lastCustomerMessage = lastMessage?.content.toLowerCase() ?? ""
        }

        const suggestions: Array<{ id: string; text: string; category: string }> = []

        const pushSuggestion = (id: string, text: string, category: string) => {
            suggestions.push({ id, text, category })
        }

        if (!lastCustomerMessage) {
            pushSuggestion("general-1", "Como posso ajudar você hoje?", "General")
            pushSuggestion("general-2", "Obrigado por entrar em contato! Estou aqui para ajudar.", "General")
        } else if (lastCustomerMessage.includes("horário") || lastCustomerMessage.includes("horario")) {
            pushSuggestion(
                "hours-1",
                "Funcionamos de segunda a sexta das 9h às 18h, e sábado das 10h às 16h.",
                "Hours",
            )
            pushSuggestion(
                "hours-2",
                "Nosso horário de atendimento é de segunda a sexta, das 9h às 18h.",
                "Hours",
            )
        } else if (
            lastCustomerMessage.includes("preço") ||
            lastCustomerMessage.includes("preco") ||
            lastCustomerMessage.includes("valor")
        ) {
            pushSuggestion(
                "price-1",
                "Posso ajudar você com informações sobre preços. Qual produto você está interessado?",
                "Pricing",
            )
            pushSuggestion(
                "price-2",
                "Temos promoções especiais esta semana! Posso enviar nosso catálogo com preços.",
                "Pricing",
            )
        } else if (lastCustomerMessage.includes("entrega") || lastCustomerMessage.includes("delivery")) {
            pushSuggestion(
                "delivery-1",
                "Fazemos entrega gratuita para pedidos acima de R$ 50. O prazo é de 2-3 dias úteis.",
                "Delivery",
            )
            pushSuggestion(
                "delivery-2",
                "Sim! Oferecemos entrega em toda a região metropolitana.",
                "Delivery",
            )
        } else {
            pushSuggestion("general-1", "Como posso ajudar você hoje?", "General")
            pushSuggestion("general-2", "Obrigado por entrar em contato! Estou aqui para ajudar.", "General")
        }

        return {
            success: true,
            data: suggestions,
        }
    })
