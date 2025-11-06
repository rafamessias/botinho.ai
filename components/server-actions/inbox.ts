"use server"

import { prisma } from "@/prisma/lib/prisma"
import { InboxConversationPriority, InboxMessageSenderType, InboxMessageStatus, Prisma } from "@/lib/generated/prisma"
import { z } from "zod"
import { BaseActionResponse, handleAction, resolveCompanyContext } from "./utils"

// WhatsApp Controller URL
const WHATSAPP_CONTROLLER_URL = process.env.WHATSAPP_CONTROLLER_URL || process.env.NEXT_PUBLIC_WHATSAPP_CONTROLLER_URL || "http://localhost:8080"

// Normalize phone number (remove +, spaces, dashes, etc.)
const normalizePhoneNumber = (phone: string): string => {
    return phone.replace(/[^\d]/g, "")
}

// Find WhatsApp number for a conversation (by customer phone)
const findWhatsAppNumberForConversation = async (
    companyId: number,
    conversationId: string,
): Promise<{ whatsappNumber: { id: string; phoneNumber: string; tenantId: string | null; sessionId: string | null } | null; customerPhone: string | null }> => {
    const conversation = await prisma.inboxConversation.findFirst({
        where: {
            id: conversationId,
            companyId,
        },
        include: {
            customer: {
                select: {
                    phone: true,
                },
            },
        },
    })

    if (!conversation || !conversation.customer.phone) {
        return { whatsappNumber: null, customerPhone: null }
    }

    const normalizedCustomerPhone = normalizePhoneNumber(conversation.customer.phone)

    // Find WhatsApp number that matches the customer's phone or is connected
    const whatsappNumber = await prisma.companyWhatsappNumber.findFirst({
        where: {
            companyId,
            isConnected: true,
            OR: [
                { phoneNumber: normalizedCustomerPhone },
                { phoneNumber: conversation.customer.phone },
            ],
        },
        select: {
            id: true,
            phoneNumber: true,
            tenantId: true,
            remoteAuthKey: true,
        },
    })

    if (!whatsappNumber) {
        // If no exact match, try to find any connected WhatsApp number for this company
        // This allows sending to any number if the company has a WhatsApp number configured
        const fallbackWhatsappNumber = await prisma.companyWhatsappNumber.findFirst({
            where: {
                companyId,
                isConnected: true,
            },
            select: {
                id: true,
                phoneNumber: true,
                tenantId: true,
                remoteAuthKey: true,
            },
        })

        return {
            whatsappNumber: fallbackWhatsappNumber
                ? {
                    id: fallbackWhatsappNumber.id,
                    phoneNumber: fallbackWhatsappNumber.phoneNumber,
                    tenantId: fallbackWhatsappNumber.tenantId,
                    sessionId: fallbackWhatsappNumber.remoteAuthKey,
                }
                : null,
            customerPhone: conversation.customer.phone,
        }
    }

    return {
        whatsappNumber: {
            id: whatsappNumber.id,
            phoneNumber: whatsappNumber.phoneNumber,
            tenantId: whatsappNumber.tenantId,
            sessionId: whatsappNumber.remoteAuthKey,
        },
        customerPhone: conversation.customer.phone,
    }
}

// Send message via WhatsApp Controller API
const sendWhatsAppMessage = async (
    tenantId: string,
    sessionId: string,
    to: string,
    content: string,
): Promise<{ success: boolean; error?: string }> => {
    try {
        const controllerResponse = await fetch(`${WHATSAPP_CONTROLLER_URL}/sessions/${sessionId}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tenantId,
                to,
                message: {
                    body: content,
                    type: "text",
                },
            }),
        })

        if (!controllerResponse.ok) {
            const errorText = await controllerResponse.text().catch(() => "Unknown error")
            console.error("Failed to send WhatsApp message:", controllerResponse.status, errorText)
            return { success: false, error: `Failed to send WhatsApp message: ${controllerResponse.status} ${errorText}` }
        }

        return { success: true }
    } catch (error) {
        console.error("Error sending WhatsApp message:", error)
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
}

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

        const where: Prisma.InboxConversationWhereInput = {
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
            ? { unreadTotal: unreadAggregate._sum?.unreadCount ?? 0 }
            : undefined

        return {
            success: true,
            data: {
                conversations: conversations as ConversationWithRelations[],
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

        // If message is from agent, try to send via WhatsApp
        if (payload.senderType === InboxMessageSenderType.agent) {
            try {
                const { whatsappNumber, customerPhone } = await findWhatsAppNumberForConversation(
                    companyId,
                    payload.conversationId,
                )

                if (whatsappNumber && customerPhone && whatsappNumber.sessionId && whatsappNumber.tenantId) {
                    const normalizedCustomerPhone = normalizePhoneNumber(customerPhone)
                    const whatsappResult = await sendWhatsAppMessage(
                        whatsappNumber.tenantId,
                        whatsappNumber.sessionId,
                        normalizedCustomerPhone,
                        payload.content,
                    )

                    if (whatsappResult.success) {
                        // Update message count for WhatsApp number
                        await prisma.companyWhatsappNumber.update({
                            where: { id: whatsappNumber.id },
                            data: {
                                messagesThisMonth: { increment: 1 },
                                lastSyncedAt: new Date(),
                            },
                        })

                        // Notify WebSocket server about sent message
                        await notifyWebSocketServer(
                            companyId,
                            "inbox.message",
                            {
                                conversationId: payload.conversationId,
                                conversation: result.conversation,
                                message: result.message,
                            },
                        )
                    } else {
                        console.warn("Failed to send WhatsApp message, but inbox message was saved:", whatsappResult.error)
                    }
                }
            } catch (error) {
                // Log error but don't fail the action - the message is already saved in inbox
                console.error("Error sending WhatsApp message:", error)
            }
        } else {
            // Even if not sending via WhatsApp, notify WebSocket for real-time updates
            try {
                await notifyWebSocketServer(
                    companyId,
                    "inbox.message",
                    {
                        conversationId: payload.conversationId,
                        conversation: result.conversation,
                        message: result.message,
                    },
                )
            } catch (error) {
                console.error("Failed to notify WebSocket server:", error)
            }
        }

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

const getInboxWhatsappWsUrlSchema = z.object({
    companyId: z.number().int().positive().optional(),
})

export const getInboxWhatsappWsUrlAction = async (
    input?: z.infer<typeof getInboxWhatsappWsUrlSchema>,
): Promise<
    BaseActionResponse<{
        wsUrl: string | null
    }>
> =>
    handleAction(async () => {
        const payload = getInboxWhatsappWsUrlSchema.parse(input ?? {})
        const { companyId } = await resolveCompanyContext({ companyId: payload.companyId })

        // Find the first connected WhatsApp number for this company
        const whatsappNumber = await prisma.companyWhatsappNumber.findFirst({
            where: {
                companyId,
                isConnected: true,
            },
            select: {
                wsUrl: true,
            },
            orderBy: {
                lastSyncedAt: "desc",
            },
        })

        return {
            success: true,
            data: {
                wsUrl: whatsappNumber?.wsUrl ?? null,
            },
        }
    })

// WhatsApp Webhook Handling
export interface WhatsAppWebhookPayload {
    event: string
    tenantId?: string
    sessionId?: string
    data?: {
        from?: string
        to?: string
        message?: {
            body?: string
            type?: string
        }
        phoneNumber?: string
        displayName?: string
        status?: string
    }
}

const processWhatsAppWebhookSchema = z.object({
    event: z.string(),
    tenantId: z.string().optional(),
    sessionId: z.string().optional(),
    data: z
        .object({
            from: z.string().optional(),
            to: z.string().optional(),
            message: z
                .object({
                    body: z.string().optional(),
                    type: z.string().optional(),
                })
                .optional(),
            phoneNumber: z.string().optional(),
            displayName: z.string().optional(),
            status: z.string().optional(),
        })
        .optional(),
})

export const processWhatsAppWebhookAction = async (
    input: WhatsAppWebhookPayload,
): Promise<
    BaseActionResponse<{
        conversationId?: string
        messageId?: string
        companyId?: number
        conversation?: ConversationWithRelations
        message?: InboxMessageEntity
    }>
> =>
    handleAction(async () => {
        const payload = processWhatsAppWebhookSchema.parse(input)

        // Handle message events
        if (payload.event === "message" && payload.data) {
            const { from, to, message } = payload.data

            if (!from || !to || !message?.body) {
                return { success: false, error: "Missing required fields: from, to, or message.body" }
            }

            const tenantId = payload.tenantId
            if (!tenantId) {
                return { success: false, error: "Missing tenantId" }
            }

            // Extract company ID from tenant ID (format: "company-{id}")
            if (!tenantId.startsWith("company-")) {
                return { success: false, error: "Invalid tenantId format" }
            }

            const companyId = parseInt(tenantId.replace("company-", ""), 10)
            if (isNaN(companyId)) {
                return { success: false, error: "Invalid company ID in tenantId" }
            }

            // Find the WhatsApp number that received this message
            const normalizedTo = normalizePhoneNumber(to)
            const whatsappNumber = await prisma.companyWhatsappNumber.findFirst({
                where: {
                    companyId,
                    isConnected: true,
                    OR: [{ phoneNumber: normalizedTo }, { phoneNumber: to }],
                },
            })

            if (!whatsappNumber) {
                return { success: false, error: "WhatsApp number not found for company" }
            }

            // Normalize the sender's phone number
            const normalizedFromPhone = normalizePhoneNumber(from)

            // Find or create customer
            let customer = await prisma.inboxCustomer.findFirst({
                where: {
                    companyId,
                    phone: normalizedFromPhone,
                },
            })

            if (!customer) {
                customer = await prisma.inboxCustomer.create({
                    data: {
                        companyId,
                        name: from,
                        phone: normalizedFromPhone,
                    },
                })
            }

            // Find or create conversation
            let conversation = await prisma.inboxConversation.findFirst({
                where: {
                    companyId,
                    customerId: customer.id,
                    isArchived: false,
                },
                include: conversationInclude,
                orderBy: { lastMessageSentAt: "desc" },
            })

            if (!conversation) {
                conversation = await prisma.inboxConversation.create({
                    data: {
                        companyId,
                        customerId: customer.id,
                        priority: InboxConversationPriority.medium,
                        tags: ["whatsapp"],
                    },
                    include: conversationInclude,
                })
            } else {
                // Ensure conversation has whatsapp tag
                if (!conversation.tags.includes("whatsapp")) {
                    conversation = await prisma.inboxConversation.update({
                        where: { id: conversation.id },
                        data: {
                            tags: [...conversation.tags, "whatsapp"],
                        },
                        include: conversationInclude,
                    })
                }
            }

            // Record the customer message
            const messageResult = await recordCustomerMessageAction({
                conversationId: conversation.id,
                content: message.body,
                status: InboxMessageStatus.delivered,
            })

            if (!messageResult.success || !messageResult.data) {
                return { success: false, error: messageResult.error || "Failed to record message" }
            }

            // Increment message count for WhatsApp number
            await prisma.companyWhatsappNumber.update({
                where: { id: whatsappNumber.id },
                data: {
                    messagesThisMonth: { increment: 1 },
                    lastSyncedAt: new Date(),
                },
            })

            // Fetch updated conversation with relations
            const updatedConversation = await prisma.inboxConversation.findUnique({
                where: { id: conversation.id },
                include: conversationInclude,
            })

            return {
                success: true,
                data: {
                    conversationId: conversation.id,
                    messageId: messageResult.data.message.id,
                    companyId,
                    conversation: updatedConversation || conversation,
                    message: messageResult.data.message,
                },
            }
        }

        // Handle status events (message delivered, read, etc.)
        if (payload.event === "message.status" && payload.data) {
            // Optional: Update message status in inbox
            // This can be implemented later if needed
            return {
                success: true,
                data: {
                    conversationId: undefined,
                    messageId: undefined,
                    companyId: undefined,
                },
            }
        }

        // Handle other events (connection status, etc.)
        return {
            success: true,
            data: {
                conversationId: undefined,
                messageId: undefined,
                companyId: undefined,
            },
        }
    })

// Helper function to notify WebSocket server about inbox events
const notifyWebSocketServer = async (
    companyId: number,
    eventType: "inbox.message" | "inbox.conversation",
    data: {
        conversation?: ConversationWithRelations
        message?: InboxMessageEntity
        conversationId?: string
    },
): Promise<void> => {
    try {
        const wsBackendUrl = process.env.NEXT_PUBLIC_WS_BACKEND || process.env.WS_BACKEND
        if (!wsBackendUrl) {
            // WebSocket server URL not configured, skip notification
            return
        }

        // Convert HTTP URL to WebSocket-compatible URL for HTTP API
        const httpUrl = wsBackendUrl.replace(/^ws:\/\//, "http://").replace(/^wss:\/\//, "https://")
        const apiUrl = `${httpUrl}/api/inbox/notify`

        await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                companyId,
                event: eventType,
                channel: "inbox",
                data,
            }),
        })
    } catch (error) {
        // Log but don't fail - WebSocket notification is optional
        console.error("Failed to notify WebSocket server:", error)
    }
}
