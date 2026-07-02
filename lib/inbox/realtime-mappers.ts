import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore"
import type { ConversationEntity, MessageEntity } from "@/components/inbox/inbox-mappers"
import type {
  FirestoreInboxConversation,
  FirestoreInboxMessage,
} from "@/lib/firebase/types"

const timestampToIso = (value: unknown): string | null => {
  if (!value || typeof value !== "object") {
    return null
  }

  if ("toDate" in value && typeof (value as { toDate: () => Date }).toDate === "function") {
    const date = (value as { toDate: () => Date }).toDate()
    return Number.isNaN(date.getTime()) ? null : date.toISOString()
  }

  return null
}

export const mapRealtimeConversationDoc = (
  doc: QueryDocumentSnapshot<DocumentData>,
): ConversationEntity => {
  const data = doc.data() as FirestoreInboxConversation
  const hasCustomer = Boolean(data.customerName?.trim() || data.customerPhone)

  return {
    id: doc.id,
    lastMessagePreview: data.lastMessagePreview ?? null,
    lastMessageSentAt:
      timestampToIso(data.lastMessageSentAt) ??
      timestampToIso(data.updatedAt) ??
      timestampToIso(data.createdAt),
    unreadCount: data.unreadCount ?? 0,
    priority: data.priority ?? "medium",
    satisfactionScore: data.satisfactionScore ?? null,
    isBookmarked: data.isBookmarked ?? false,
    tags: data.tags ?? [],
    assignedToId: data.assignedToId ?? null,
    activeSurveyResponseId: data.activeSurveyResponseId ?? null,
    assignedTo: data.assignedToId
      ? {
          id: data.assignedToId,
          name: data.assignedToName?.trim() || data.assignedToId,
        }
      : null,
    createdAt: timestampToIso(data.createdAt) ?? new Date().toISOString(),
    updatedAt: timestampToIso(data.updatedAt) ?? new Date().toISOString(),
    customer: hasCustomer
      ? {
          id: data.customerId,
          name: data.customerName ?? "",
          phone: data.customerPhone ?? undefined,
          email: data.customerEmail ?? undefined,
          company: data.customerCompany ?? undefined,
        }
      : {
          id: data.customerId,
          name: "",
          phone: undefined,
        },
  }
}

export const mapRealtimeMessageDoc = (
  doc: QueryDocumentSnapshot<DocumentData>,
): MessageEntity => {
  const data = doc.data() as FirestoreInboxMessage

  return {
    id: doc.id,
    content: data.content,
    senderType: data.senderType,
    sentBy: data.sentBy,
    status: data.status,
    sentAt: timestampToIso(data.sentAt) ?? timestampToIso(data.createdAt),
    createdAt: timestampToIso(data.createdAt),
    externalMessageId: data.externalMessageId ?? null,
    replyToMessageId: data.replyToMessageId ?? null,
    replyToExternalMessageId: data.replyToExternalMessageId ?? null,
    quotedMessage: data.quotedMessage ?? null,
  }
}
