import { FieldValue, Timestamp } from "firebase-admin/firestore"
import { adminDb } from "@/lib/firebase/admin"
import {
  collections,
  companySubcollections,
  conversationSubcollections,
  settingsDocIds,
} from "@/lib/firebase/collections"
import type {
  FirestoreInboxConversation,
  FirestoreInboxCustomer,
  FirestoreInboxMessage,
  InboxConversationPriority,
  InboxMessageSenderType,
  InboxMessageStatus,
} from "@/lib/firebase/types"
import { getUserProfile } from "@/lib/firebase/services/user-service"

const companyRef = (companyId: string) =>
  adminDb.collection(collections.companies).doc(companyId)

const customersRef = (companyId: string) =>
  companyRef(companyId).collection(companySubcollections.customers)

const conversationsRef = (companyId: string) =>
  companyRef(companyId).collection(companySubcollections.conversations)

const messagesRef = (companyId: string, conversationId: string) =>
  conversationsRef(companyId).doc(conversationId).collection(conversationSubcollections.messages)

const toIso = (value: Timestamp | Date | undefined | null): Date | null => {
  if (!value) return null
  if (value instanceof Date) return value
  if (value instanceof Timestamp) return value.toDate()
  return null
}

export const sanitizeTags = (tags?: string[]) => {
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

const mapCustomer = (id: string, data: FirestoreInboxCustomer) => ({
  id,
  name: data.name,
  phone: data.phone ?? null,
  email: data.email ?? null,
  address: data.address ?? null,
})

const mapAssignedTo = async (uid: string | null | undefined) => {
  if (!uid) return null
  const profile = await getUserProfile(uid)
  if (!profile) return null
  return {
    id: uid,
    firstName: profile.firstName,
    lastName: profile.lastName ?? null,
    email: profile.email,
    avatarUrl: profile.avatarUrl ?? null,
  }
}

export const mapConversation = async (
  companyId: string,
  conversationId: string,
  data: FirestoreInboxConversation,
) => {
  const customerSnap = await customersRef(companyId).doc(data.customerId).get()
  const customerData = customerSnap.data() as FirestoreInboxCustomer | undefined

  return {
    id: conversationId,
    companyId,
    customerId: data.customerId,
    sessionId: data.sessionId ?? null,
    subject: data.subject ?? null,
    lastMessagePreview: data.lastMessagePreview ?? null,
    lastMessageSentAt: toIso(data.lastMessageSentAt),
    unreadCount: data.unreadCount ?? 0,
    priority: data.priority,
    satisfactionScore: data.satisfactionScore ?? null,
    tags: data.tags ?? [],
    assignedToId: data.assignedToId ?? null,
    isArchived: data.isArchived ?? false,
    archivedAt: toIso(data.archivedAt ?? null),
    createdAt: toIso(data.createdAt) ?? new Date(),
    updatedAt: toIso(data.updatedAt) ?? new Date(),
    customer: customerData ? mapCustomer(data.customerId, customerData) : null,
    assignedTo: await mapAssignedTo(data.assignedToId),
  }
}

export const mapMessage = (id: string, data: FirestoreInboxMessage) => ({
  id,
  content: data.content,
  senderType: data.senderType,
  senderUserId: data.senderUserId ?? null,
  status: data.status,
  sentAt: toIso(data.sentAt) ?? new Date(),
  createdAt: toIso(data.createdAt) ?? new Date(),
  updatedAt: toIso(data.updatedAt) ?? new Date(),
})

export const listInboxCustomers = async (params: {
  companyId: string
  search?: string
  page?: number
  pageSize?: number
}) => {
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 50
  const searchTerm = params.search?.trim().toLowerCase() ?? ""

  const snapshot = await customersRef(params.companyId).get()

  let customers = snapshot.docs.map((doc) => {
    const data = doc.data() as FirestoreInboxCustomer
    return {
      id: doc.id,
      name: data.name,
      phone: data.phone ?? null,
      email: data.email ?? null,
      address: data.address ?? null,
      updatedAt: toIso(data.updatedAt) ?? new Date(),
    }
  })

  if (searchTerm) {
    customers = customers.filter((customer) => {
      return (
        customer.name?.toLowerCase().includes(searchTerm) ||
        customer.email?.toLowerCase().includes(searchTerm) ||
        customer.phone?.includes(searchTerm)
      )
    })
  }

  customers.sort((a, b) => a.name.localeCompare(b.name))

  const total = customers.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize

  return {
    customers: customers.slice(start, start + pageSize),
    pagination: { page, pageSize, total, totalPages },
  }
}

export const listInboxConversations = async (params: {
  companyId: string
  search?: string
  sessionId?: string
  page?: number
  pageSize?: number
  includeArchived?: boolean
}) => {
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 20
  const searchTerm = params.search?.trim().toLowerCase() ?? ""

  const snapshot = await conversationsRef(params.companyId)
    .orderBy("lastMessageSentAt", "desc")
    .get()

  let conversations = await Promise.all(
    snapshot.docs.map(async (doc) =>
      mapConversation(params.companyId, doc.id, doc.data() as FirestoreInboxConversation),
    ),
  )

  if (!params.includeArchived) {
    conversations = conversations.filter((conversation) => !conversation.isArchived)
  }

  if (params.sessionId) {
    conversations = conversations.filter((conversation) => conversation.sessionId === params.sessionId)
  }

  if (searchTerm) {
    conversations = conversations.filter((conversation) => {
      const customer = conversation.customer
      return (
        customer?.name?.toLowerCase().includes(searchTerm) ||
        customer?.email?.toLowerCase().includes(searchTerm) ||
        customer?.phone?.includes(searchTerm) ||
        conversation.lastMessagePreview?.toLowerCase().includes(searchTerm) ||
        conversation.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
      )
    })
  }

  const total = conversations.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize

  return {
    conversations: conversations.slice(start, start + pageSize),
    pagination: { page, pageSize, total, totalPages },
    metrics: {
      unreadTotal: conversations.reduce((sum, item) => sum + item.unreadCount, 0),
    },
  }
}

export const getInboxConversationDetail = async (params: {
  companyId: string
  conversationId: string
}) => {
  const conversationSnap = await conversationsRef(params.companyId)
    .doc(params.conversationId)
    .get()

  if (!conversationSnap.exists) {
    return null
  }

  const conversation = await mapConversation(
    params.companyId,
    conversationSnap.id,
    conversationSnap.data() as FirestoreInboxConversation,
  )

  const messagesSnap = await messagesRef(params.companyId, params.conversationId)
    .orderBy("sentAt", "asc")
    .get()

  const messages = messagesSnap.docs.map((doc) =>
    mapMessage(doc.id, doc.data() as FirestoreInboxMessage),
  )

  return { ...conversation, messages }
}

export const upsertCustomerByPhone = async (params: {
  companyId: string
  phone: string
  name?: string
  email?: string
}) => {
  const existingSnap = await customersRef(params.companyId)
    .where("phone", "==", params.phone)
    .limit(1)
    .get()

  const now = FieldValue.serverTimestamp()

  if (!existingSnap.empty) {
    const doc = existingSnap.docs[0]!
    await doc.ref.set(
      {
        name: params.name ?? doc.data()?.name ?? params.phone,
        ...(params.email ? { email: params.email } : {}),
        updatedAt: now,
      },
      { merge: true },
    )
    return { customerId: doc.id, created: false as const }
  }

  const customerRef = customersRef(params.companyId).doc()
  await customerRef.set({
    name: params.name ?? params.phone,
    phone: params.phone,
    ...(params.email ? { email: params.email } : {}),
    createdAt: now,
    updatedAt: now,
  })

  return { customerId: customerRef.id, created: true as const }
}

export const findOpenConversationForCustomer = async (params: {
  companyId: string
  customerId: string
  sessionId?: string | null
}) => {
  const snap = await conversationsRef(params.companyId)
    .where("customerId", "==", params.customerId)
    .limit(20)
    .get()

  const openConversations = snap.docs
    .filter((doc) => doc.data().isArchived !== true)
    .sort((a, b) => {
      const getMillis = (value: unknown) => {
        if (!value) return 0
        if (typeof value === "object" && value !== null && "toMillis" in value) {
          return (value as { toMillis: () => number }).toMillis()
        }
        if (value instanceof Date) return value.getTime()
        return 0
      }

      return getMillis(b.data().updatedAt) - getMillis(a.data().updatedAt)
    })

  if (openConversations.length === 0) {
    return null
  }

  if (params.sessionId) {
    const matched = openConversations.find((doc) => doc.data().sessionId === params.sessionId)
    return matched ?? null
  }

  return openConversations[0]!
}

export const createInboxMessage = async (params: {
  companyId: string
  conversationId: string
  content: string
  senderType: InboxMessageSenderType
  senderUserId?: string
  status?: InboxMessageStatus
  incrementUnread?: boolean
}) => {
  const now = FieldValue.serverTimestamp()
  const messageRef = messagesRef(params.companyId, params.conversationId).doc()

  await adminDb.runTransaction(async (tx) => {
    const conversationRef = conversationsRef(params.companyId).doc(params.conversationId)
    const conversationSnap = await tx.get(conversationRef)

    if (!conversationSnap.exists) {
      throw new Error("Conversation not found")
    }

    tx.set(messageRef, {
      senderType: params.senderType,
      ...(params.senderUserId ? { senderUserId: params.senderUserId } : {}),
      content: params.content,
      status: params.status ?? "sent",
      sentAt: now,
      createdAt: now,
      updatedAt: now,
    })

    const currentUnread = (conversationSnap.data()?.unreadCount as number | undefined) ?? 0
    tx.update(conversationRef, {
      lastMessagePreview: params.content,
      lastMessageSentAt: now,
      unreadCount: params.incrementUnread ? currentUnread + 1 : 0,
      updatedAt: now,
    })
  })

  const messageSnap = await messageRef.get()
  return mapMessage(messageRef.id, messageSnap.data() as FirestoreInboxMessage)
}

export const createInboxConversation = async (params: {
  companyId: string
  customer: {
    name: string
    phone?: string
    email?: string
    address?: string
    notes?: string
  }
  sessionId?: string | null
  priority?: InboxConversationPriority
  tags?: string[]
  satisfactionScore?: number
  subject?: string
  initialMessage?: {
    content: string
    senderType: InboxMessageSenderType
    senderUserId?: string
    status?: InboxMessageStatus
  }
}) => {
  const now = FieldValue.serverTimestamp()
  const normalizedTags = sanitizeTags(params.tags)

  let existingCustomerId: string | null = null
  const identifierFilters: Array<{ field: "email" | "phone"; value: string }> = []
  if (params.customer.email) identifierFilters.push({ field: "email", value: params.customer.email })
  if (params.customer.phone) identifierFilters.push({ field: "phone", value: params.customer.phone })

  for (const filter of identifierFilters) {
    const snap = await customersRef(params.companyId)
      .where(filter.field, "==", filter.value)
      .limit(1)
      .get()
    if (!snap.empty) {
      existingCustomerId = snap.docs[0]!.id
      break
    }
  }

  const customerRef = existingCustomerId
    ? customersRef(params.companyId).doc(existingCustomerId)
    : customersRef(params.companyId).doc()

  const resolvedCustomerId = customerRef.id
  const existingConversation = existingCustomerId
    ? await findOpenConversationForCustomer({
        companyId: params.companyId,
        customerId: resolvedCustomerId,
        sessionId: params.sessionId,
      })
    : null

  if (existingConversation) {
    if (params.initialMessage) {
      await createInboxMessage({
        companyId: params.companyId,
        conversationId: existingConversation.id,
        content: params.initialMessage.content,
        senderType: params.initialMessage.senderType,
        senderUserId: params.initialMessage.senderUserId,
        status: params.initialMessage.status,
        incrementUnread: params.initialMessage.senderType === "customer",
      })
    }

    const conversation = await mapConversation(
      params.companyId,
      existingConversation.id,
      existingConversation.data() as FirestoreInboxConversation,
    )

    return { conversation, existing: true as const }
  }

  const conversationRef = conversationsRef(params.companyId).doc()

  await adminDb.runTransaction(async (tx) => {
    tx.set(
      customerRef,
      {
        name: params.customer.name,
        phone: params.customer.phone ?? null,
        email: params.customer.email ?? null,
        address: params.customer.address ?? null,
        notes: params.customer.notes ?? null,
        ...(existingCustomerId ? { updatedAt: now } : { createdAt: now, updatedAt: now }),
      },
      { merge: true },
    )

    tx.set(conversationRef, {
      customerId: customerRef.id,
      sessionId: params.sessionId ?? null,
      subject: params.subject ?? null,
      priority: params.priority ?? "medium",
      tags: normalizedTags,
      satisfactionScore: params.satisfactionScore ?? null,
      unreadCount: 0,
      isArchived: false,
      archivedAt: null,
      createdAt: now,
      updatedAt: now,
      ...(params.initialMessage
        ? {
            lastMessagePreview: params.initialMessage.content,
            lastMessageSentAt: now,
          }
        : {}),
    })
  })

  if (params.initialMessage) {
    await createInboxMessage({
      companyId: params.companyId,
      conversationId: conversationRef.id,
      content: params.initialMessage.content,
      senderType: params.initialMessage.senderType,
      senderUserId: params.initialMessage.senderUserId,
      status: params.initialMessage.status,
      incrementUnread: params.initialMessage.senderType === "customer",
    })
  }

  const conversation = await mapConversation(
    params.companyId,
    conversationRef.id,
    (await conversationRef.get()).data() as FirestoreInboxConversation,
  )

  return { conversation, existing: false as const }
}

export const markConversationRead = async (params: {
  companyId: string
  conversationId: string
}) => {
  const conversationRef = conversationsRef(params.companyId).doc(params.conversationId)
  const snapshot = await conversationRef.get()

  if (!snapshot.exists) {
    return
  }

  const unreadCount = snapshot.data()?.unreadCount ?? 0
  if (unreadCount <= 0) {
    return
  }

  await conversationRef.update({
    unreadCount: 0,
    updatedAt: FieldValue.serverTimestamp(),
  })
}

export const updateConversationMetadata = async (params: {
  companyId: string
  conversationId: string
  priority?: InboxConversationPriority
  tags?: string[]
  satisfactionScore?: number
  assignedToId?: string | null
  isArchived?: boolean
}) => {
  const update: Record<string, unknown> = {
    updatedAt: FieldValue.serverTimestamp(),
  }

  if (params.priority) update.priority = params.priority
  if (params.tags) update.tags = sanitizeTags(params.tags)
  if (params.satisfactionScore != null) update.satisfactionScore = params.satisfactionScore
  if (params.assignedToId !== undefined) update.assignedToId = params.assignedToId
  if (params.isArchived != null) {
    update.isArchived = params.isArchived
    update.archivedAt = params.isArchived ? FieldValue.serverTimestamp() : null
  }

  await conversationsRef(params.companyId).doc(params.conversationId).update(update)
  const snap = await conversationsRef(params.companyId).doc(params.conversationId).get()
  return mapConversation(
    params.companyId,
    params.conversationId,
    snap.data() as FirestoreInboxConversation,
  )
}

export const getCompanyAutoReplyEnabled = async (companyId: string): Promise<boolean> => {
  const snap = await companyRef(companyId)
    .collection(companySubcollections.settings)
    .doc(settingsDocIds.default)
    .get()

  return snap.data()?.autoReply !== false
}

export const recordInboundMessage = async (params: {
  companyId: string
  from: string
  text: string
  contactName?: string
  sessionId?: string
}) => {
  const { customerId } = await upsertCustomerByPhone({
    companyId: params.companyId,
    phone: params.from,
    name: params.contactName,
  })

  let conversationId: string
  const existingConversation = await findOpenConversationForCustomer({
    companyId: params.companyId,
    customerId,
    sessionId: params.sessionId,
  })

  if (existingConversation) {
    conversationId = existingConversation.id
  } else {
    const conversationRef = conversationsRef(params.companyId).doc()
    const now = FieldValue.serverTimestamp()
    await conversationRef.set({
      customerId,
      sessionId: params.sessionId ?? null,
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

  const message = await createInboxMessage({
    companyId: params.companyId,
    conversationId,
    content: params.text,
    senderType: "customer",
    status: "delivered",
    incrementUnread: true,
  })

  const conversation = await mapConversation(
    params.companyId,
    conversationId,
    (await conversationsRef(params.companyId).doc(conversationId).get()).data() as FirestoreInboxConversation,
  )

  return { conversation, message, conversationId }
}

export const getLastCustomerMessage = async (params: {
  companyId: string
  conversationId: string
}) => {
  const snap = await messagesRef(params.companyId, params.conversationId)
    .where("senderType", "==", "customer")
    .orderBy("sentAt", "desc")
    .limit(1)
    .get()

  if (snap.empty) return null
  const doc = snap.docs[0]!
  return mapMessage(doc.id, doc.data() as FirestoreInboxMessage)
}

export const getRecentConversationMessages = async (params: {
  companyId: string
  conversationId: string
  limit?: number
}) => {
  const limit = params.limit ?? 10
  const snap = await messagesRef(params.companyId, params.conversationId)
    .orderBy("sentAt", "desc")
    .limit(limit)
    .get()

  return snap.docs
    .reverse()
    .map((doc) => mapMessage(doc.id, doc.data() as FirestoreInboxMessage))
}
