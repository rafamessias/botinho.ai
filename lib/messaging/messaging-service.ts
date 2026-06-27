import { FieldValue } from "firebase-admin/firestore"
import { adminDb } from "@/lib/firebase/admin"
import { collections, companySubcollections } from "@/lib/firebase/collections"
import { generateAutoReplyText } from "@/lib/firebase/ai/generate"
import { isAgentAutoReplyEnabled } from "@/lib/firebase/services/ai-agent-service"
import {
  createInboxMessage,
  findOpenConversationForCustomer,
  getInboxConversationDetail,
  listPendingOutboundMessages,
  upsertCustomerByPhone,
} from "@/lib/firebase/services/inbox-service"
import { normalizeStoredPhone } from "@/lib/phone-utils"
import { deliverMessageViaWhatsApp } from "@/lib/messaging/channel-whatsapp"
import { buildInboundEventId } from "@/lib/messaging/inbound-event-id"
import {
  getInboundEvent,
  listFailedAutoReplyEvents,
  listPendingInboundEvents,
  markInboundEventFailed,
  markInboundEventProcessed,
  markInboundEventProcessing,
  resolveInboundEventId,
  updateInboundEventAutoReply,
  upsertInboundEventFromWebhook,
} from "@/lib/messaging/inbound-events-service"
import { incrementMessageUsage } from "@/lib/messaging/message-usage-service"
import type { ProcessInboundResult, SendOutboundParams, SendOutboundResult } from "@/lib/messaging/types"
import { isWhatsAppConfigured } from "@/lib/whatsapp"

const MAX_INBOUND_ATTEMPTS = 10
const RETRY_DELAY_MS = 60_000

const inboundEventsRef = (companyId: string) =>
  adminDb.collection(collections.companies).doc(companyId).collection(companySubcollections.inboundEvents)

const messageDedupeRef = (companyId: string, channel: string, externalMessageId: string) =>
  adminDb
    .collection(collections.companies)
    .doc(companyId)
    .collection(companySubcollections.messageDedupe)
    .doc(`${channel}_${externalMessageId}`.replace(/[/\\#?]/g, "_"))

const conversationsRef = (companyId: string) =>
  adminDb.collection(collections.companies).doc(companyId).collection(companySubcollections.conversations)

const nextRetryAt = (attempts: number) => new Date(Date.now() + RETRY_DELAY_MS * Math.max(1, attempts))

export const processInboundEvent = async (
  companyId: string,
  eventId: string,
): Promise<ProcessInboundResult> => {
  const event = await getInboundEvent(companyId, eventId)
  if (!event) {
    throw new Error("Inbound event not found")
  }

  if (event.status === "processed" && event.inboxMessageId && event.conversationId) {
    return {
      skipped: true,
      eventId,
      conversationId: event.conversationId,
      inboxMessageId: event.inboxMessageId,
    }
  }

  if (!event.body.trim()) {
    await inboundEventsRef(companyId).doc(eventId).update({
      status: "processed",
      updatedAt: FieldValue.serverTimestamp(),
      processedAt: FieldValue.serverTimestamp(),
    })
    return { skipped: true, eventId }
  }

  try {
    await markInboundEventProcessing(companyId, eventId)
  } catch {
    const latest = await getInboundEvent(companyId, eventId)
    if (latest?.status === "processed") {
      return {
        skipped: true,
        eventId,
        conversationId: latest.conversationId ?? undefined,
        inboxMessageId: latest.inboxMessageId ?? undefined,
      }
    }
    throw new Error("Failed to claim inbound event for processing")
  }

  try {
    const dedupeKey = `${event.channel}_${event.messageId}`
    const dedupeSnap = await messageDedupeRef(companyId, event.channel, event.messageId).get()
    if (dedupeSnap.exists) {
      const existing = dedupeSnap.data()
      await markInboundEventProcessed(companyId, eventId, {
        conversationId: String(existing?.conversationId ?? ""),
        inboxMessageId: String(existing?.inboxMessageId ?? ""),
        metricsReceivedCounted: Boolean(event.metricsReceivedCounted),
      })
      return {
        skipped: true,
        eventId,
        conversationId: String(existing?.conversationId ?? ""),
        inboxMessageId: String(existing?.inboxMessageId ?? ""),
      }
    }

    const { customerId } = await upsertCustomerByPhone({
      companyId,
      phone: event.from,
    })

    let conversationId: string
    const existingConversation = await findOpenConversationForCustomer({
      companyId,
      customerId,
      sessionId: event.sessionId,
    })

    if (existingConversation) {
      conversationId = existingConversation.id
    } else {
      const conversationRef = conversationsRef(companyId).doc()
      const now = FieldValue.serverTimestamp()
      await conversationRef.set({
        customerId,
        sessionId: event.sessionId ?? null,
        priority: "medium",
        tags: [],
        unreadCount: 0,
        isArchived: false,
        archivedAt: null,
        createdAt: now,
        updatedAt: now,
      })
      conversationId = conversationRef.id
    }

    const channelPhoneNumber = event.phoneNumber
      ? normalizeStoredPhone(event.phoneNumber) || event.phoneNumber
      : undefined

    const message = await createInboxMessage({
      companyId,
      conversationId,
      content: event.body,
      senderType: "customer",
      status: "delivered",
      incrementUnread: true,
      channel: event.channel,
      direction: "inbound",
      externalMessageId: event.messageId,
      channelPhoneNumber,
    })

    await messageDedupeRef(companyId, event.channel, event.messageId).set({
      conversationId,
      inboxMessageId: message.id,
      dedupeKey,
      createdAt: FieldValue.serverTimestamp(),
    })

    let metricsReceivedCounted = event.metricsReceivedCounted ?? false
    if (!metricsReceivedCounted && channelPhoneNumber) {
      await incrementMessageUsage(companyId, channelPhoneNumber, "MESSAGES_RECEIVED", 1, event.sessionId)
      metricsReceivedCounted = true
    }

    await markInboundEventProcessed(companyId, eventId, {
      conversationId,
      inboxMessageId: message.id,
      metricsReceivedCounted,
    })

    void maybeAutoReply({
      companyId,
      eventId,
      conversationId,
      customerPhone: event.from,
      customerMessage: event.body,
      sessionId: event.sessionId,
      channelPhoneNumber,
    }).catch((error) => {
      console.error("[messaging] async auto-reply failed:", error)
    })

    return {
      skipped: false,
      eventId,
      conversationId,
      inboxMessageId: message.id,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process inbound event"
    const latest = await getInboundEvent(companyId, eventId)
    await markInboundEventFailed(companyId, eventId, message, nextRetryAt(latest?.attempts ?? 1))
    throw error
  }
}

export const processInboundFromWebhook = async (params: {
  companyId: string
  sessionId: string
  messageId: string
  from: string
  body: string
  eventId?: string
  to?: string
  type?: string
  phoneNumber?: string
}) => {
  const eventId = params.eventId ?? resolveInboundEventId(params.sessionId, params.messageId)

  await upsertInboundEventFromWebhook({
    companyId: params.companyId,
    eventId,
    sessionId: params.sessionId,
    messageId: params.messageId,
    from: params.from,
    body: params.body,
    to: params.to,
    type: params.type,
    phoneNumber: params.phoneNumber,
  })

  return processInboundEvent(params.companyId, eventId)
}

export const maybeAutoReply = async (params: {
  companyId: string
  eventId: string
  conversationId: string
  customerPhone: string
  customerMessage: string
  sessionId: string
  channelPhoneNumber?: string
}) => {
  const autoReplyEnabled = await isAgentAutoReplyEnabled({
    companyId: params.companyId,
    sessionId: params.sessionId,
  })
  if (!autoReplyEnabled) {
    await updateInboundEventAutoReply(params.companyId, params.eventId, {
      autoReplyStatus: "skipped",
      autoReplyReason: "auto_reply_disabled",
    })
    return
  }

  const conversation = await getInboxConversationDetail({
    companyId: params.companyId,
    conversationId: params.conversationId,
  })

  if (!conversation) {
    await updateInboundEventAutoReply(params.companyId, params.eventId, {
      autoReplyStatus: "failed",
      autoReplyReason: "conversation_not_found",
    })
    return
  }

  if (conversation.assignedToId) {
    await updateInboundEventAutoReply(params.companyId, params.eventId, {
      autoReplyStatus: "skipped",
      autoReplyReason: "assigned_to_human",
    })
    return
  }

  if (!isWhatsAppConfigured()) {
    await updateInboundEventAutoReply(params.companyId, params.eventId, {
      autoReplyStatus: "skipped",
      autoReplyReason: "whatsapp_not_configured",
    })
    return
  }

  try {
    const replyText = await generateAutoReplyText({
      companyId: params.companyId,
      conversationId: params.conversationId,
      customerMessage: params.customerMessage,
      sessionId: params.sessionId,
    })

    if (!replyText?.trim()) {
      await updateInboundEventAutoReply(params.companyId, params.eventId, {
        autoReplyStatus: "skipped",
        autoReplyReason: "empty_reply",
      })
      return
    }

    const result = await sendOutbound({
      companyId: params.companyId,
      conversationId: params.conversationId,
      content: replyText,
      senderType: "bot",
      status: "pending",
      incrementUnread: false,
      sessionId: params.sessionId,
      customerPhone: params.customerPhone,
      channelPhoneNumber: params.channelPhoneNumber,
      countAsBotAutoReply: true,
    })

    if (result.delivered) {
      await updateInboundEventAutoReply(params.companyId, params.eventId, {
        autoReplyStatus: "sent",
        autoReplyReason: null,
      })
      return
    }

    await updateInboundEventAutoReply(params.companyId, params.eventId, {
      autoReplyStatus: "failed",
      autoReplyReason: "delivery_failed",
    })
  } catch (error) {
    await updateInboundEventAutoReply(params.companyId, params.eventId, {
      autoReplyStatus: "failed",
      autoReplyReason: error instanceof Error ? error.message : "auto_reply_failed",
    })
    throw error
  }
}

export const sendOutbound = async (params: SendOutboundParams): Promise<SendOutboundResult> => {
  const shouldDeliverViaWhatsApp =
    (params.senderType === "agent" || params.senderType === "bot") &&
    isWhatsAppConfigured() &&
    Boolean(params.customerPhone)

  const message = await createInboxMessage({
    companyId: params.companyId,
    conversationId: params.conversationId,
    content: params.content,
    senderType: params.senderType,
    senderUserId: params.senderUserId,
    status: params.status ?? (shouldDeliverViaWhatsApp ? "pending" : "sent"),
    incrementUnread: params.incrementUnread ?? params.senderType === "customer",
    channel: shouldDeliverViaWhatsApp ? "whatsapp" : "manual",
    direction: "outbound",
    channelPhoneNumber: params.channelPhoneNumber,
  })

  if (!shouldDeliverViaWhatsApp || !params.customerPhone) {
    return { message, delivered: false }
  }

  const delivery = await deliverMessageViaWhatsApp({
    companyId: params.companyId,
    conversationId: params.conversationId,
    messageId: message.id,
    content: params.content,
    sessionId: params.sessionId ?? null,
    customerPhone: params.customerPhone,
    senderType: params.senderType === "bot" ? "bot" : "agent",
    countAsBotAutoReply: params.countAsBotAutoReply,
  })

  return {
    message: {
      ...message,
      status: delivery.delivered ? "delivered" : "failed",
    } as typeof message,
    delivered: delivery.delivered,
  }
}

export const retryPendingInboundEvents = async (params?: { companyId?: string; limit?: number }) => {
  const events = await listPendingInboundEvents({
    companyId: params?.companyId,
    limit: params?.limit ?? 50,
    maxAttempts: MAX_INBOUND_ATTEMPTS,
  })

  const results = []
  for (const event of events) {
    try {
      const result = await processInboundEvent(event.companyId, event.id)
      results.push({ eventId: event.id, success: true, result })
    } catch (error) {
      results.push({
        eventId: event.id,
        success: false,
        error: error instanceof Error ? error.message : "unknown",
      })
    }
  }
  return results
}

export const retryFailedAutoReplies = async (params?: { companyId?: string; limit?: number }) => {
  const events = await listFailedAutoReplyEvents(params ?? {})
  const results = []

  for (const event of events) {
    if (!event.conversationId) continue
    try {
      await maybeAutoReply({
        companyId: event.companyId,
        eventId: event.id,
        conversationId: event.conversationId,
        customerPhone: event.from,
        customerMessage: event.body,
        sessionId: event.sessionId,
        channelPhoneNumber: event.phoneNumber,
      })
      results.push({ eventId: event.id, success: true })
    } catch (error) {
      results.push({
        eventId: event.id,
        success: false,
        error: error instanceof Error ? error.message : "unknown",
      })
    }
  }

  return results
}

export const retryPendingOutboundMessages = async (params: { companyId: string; limit?: number }) => {
  const pending = await listPendingOutboundMessages({
    companyId: params.companyId,
    limit: params.limit ?? 50,
  })

  const results = []
  for (const item of pending) {
    if (!item.customerPhone) continue
    try {
      const delivery = await deliverMessageViaWhatsApp({
        companyId: params.companyId,
        conversationId: item.conversationId,
        messageId: item.messageId,
        content: item.content,
        sessionId: item.sessionId,
        customerPhone: item.customerPhone,
        senderType: item.senderType === "bot" ? "bot" : "agent",
        countAsBotAutoReply: item.senderType === "bot",
      })
      results.push({ messageId: item.messageId, success: delivery.delivered })
    } catch (error) {
      results.push({
        messageId: item.messageId,
        success: false,
        error: error instanceof Error ? error.message : "unknown",
      })
    }
  }

  return results
}

export { buildInboundEventId, resolveInboundEventId }
