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
  FirestoreUser,
  InboxConversationPriority,
  InboxMessageSenderType,
  InboxMessageSentBy,
  InboxMessageStatus,
} from "@/lib/firebase/types"
import { getUserProfile } from "@/lib/firebase/services/user-service"
import { normalizeStoredPhone } from "@/lib/phone-utils"

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

export const resolveMessageSentBy = (senderType: InboxMessageSenderType): InboxMessageSentBy => {
  switch (senderType) {
    case "bot":
      return "robot"
    case "agent":
      return "user"
    case "system":
      return "system"
    default:
      return "customer"
  }
}

const mapCustomer = (id: string, data: FirestoreInboxCustomer) => ({
  id,
  name: data.name,
  phone: data.phone ? normalizeStoredPhone(data.phone) || data.phone : null,
  email: data.email ?? null,
  address: data.address ?? null,
  company: data.company ?? null,
})

export type InboxCustomerRecord = {
  id: string
  name: string
  phone: string
  email: string | null
  company: string | null
  tags: string[]
  status: "active" | "inactive" | "prospect"
  address: string | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export const mapInboxCustomerRecord = (id: string, data: FirestoreInboxCustomer): InboxCustomerRecord => ({
  id,
  name: data.name,
  phone: data.phone ? normalizeStoredPhone(data.phone) || data.phone : "",
  email: data.email ?? null,
  company: data.company ?? null,
  tags: data.tags ?? [],
  status: data.status ?? "active",
  address: data.address ?? null,
  notes: data.notes ?? null,
  createdAt: toIso(data.createdAt) ?? new Date(),
  updatedAt: toIso(data.updatedAt) ?? new Date(),
})

const capitalizeSearchTerm = (value: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : value

const buildSearchKeywords = (params: {
  name: string
  email?: string | null
  phone?: string | null
  company?: string | null
}) => {
  const keywords = new Set<string>()

  const addToken = (token: string) => {
    const normalized = token.trim().toLowerCase()
    if (normalized.length >= 2) {
      keywords.add(normalized)
    }
  }

  const nameLower = params.name.trim().toLowerCase()
  addToken(nameLower)
  for (const word of nameLower.split(/\s+/)) {
    addToken(word)
  }

  if (params.email) {
    const localPart = params.email.split("@")[0]
    if (localPart) {
      addToken(localPart)
    }
  }

  const digits = params.phone?.replace(/\D/g, "") ?? ""
  if (digits.length >= 3) {
    keywords.add(digits)
  }

  if (params.company) {
    const companyLower = params.company.trim().toLowerCase()
    addToken(companyLower)
    for (const word of companyLower.split(/\s+/)) {
      addToken(word)
    }
  }

  return Array.from(keywords).slice(0, 30)
}

const buildCustomerSearchFields = (params: {
  name: string
  email?: string | null
  phone?: string | null
  company?: string | null
}) => {
  const nameLower = params.name.trim().toLowerCase()
  const emailLower = params.email?.trim().toLowerCase() ?? null

  return {
    nameLower,
    emailLower,
    searchKeywords: buildSearchKeywords(params),
  }
}

const matchesCustomerSearch = (customer: InboxCustomerRecord, term: string) => {
  const query = term.toLowerCase()
  const digitsOnly = term.replace(/\D/g, "")

  return (
    customer.name.toLowerCase().includes(query) ||
    customer.email?.toLowerCase().includes(query) ||
    (digitsOnly.length >= 3 && customer.phone.includes(digitsOnly)) ||
    customer.company?.toLowerCase().includes(query)
  )
}

const findCustomerByField = async (params: {
  companyId: string
  field: "phone" | "email"
  value: string
  excludeCustomerId?: string
}) => {
  const snap = await customersRef(params.companyId)
    .where(params.field, "==", params.value)
    .limit(1)
    .get()

  if (snap.empty) {
    return null
  }

  const doc = snap.docs[0]!
  if (params.excludeCustomerId && doc.id === params.excludeCustomerId) {
    return null
  }

  return doc
}

export const createInboxCustomer = async (params: {
  companyId: string
  name: string
  phone: string
  email?: string
  company?: string
  tags?: string[]
  status?: "active" | "inactive" | "prospect"
  address?: string
  notes?: string
}) => {
  const phone = normalizeStoredPhone(params.phone)
  if (!phone) {
    throw new Error("Invalid phone number")
  }
  const email = params.email?.trim()

  const existingByPhone = await findCustomerByField({
    companyId: params.companyId,
    field: "phone",
    value: phone,
  })
  if (existingByPhone) {
    throw new Error("Customer with this phone already exists")
  }

  if (email) {
    const existingByEmail = await findCustomerByField({
      companyId: params.companyId,
      field: "email",
      value: email,
    })
    if (existingByEmail) {
      throw new Error("Customer with this email already exists")
    }
  }

  const now = FieldValue.serverTimestamp()
  const customerRef = customersRef(params.companyId).doc()

  const trimmedName = params.name.trim()
  const normalizedTags = sanitizeTags(params.tags)

  await customerRef.set({
    name: trimmedName,
    ...buildCustomerSearchFields({
      name: trimmedName,
      email,
      phone,
      company: params.company?.trim() ?? null,
    }),
    phone,
    email: email ?? null,
    company: params.company?.trim() ?? null,
    tags: normalizedTags,
    status: params.status ?? "active",
    address: params.address?.trim() ?? null,
    notes: params.notes?.trim() ?? null,
    createdAt: now,
    updatedAt: now,
  })

  const snapshot = await customerRef.get()
  return mapInboxCustomerRecord(customerRef.id, snapshot.data() as FirestoreInboxCustomer)
}

export const updateInboxCustomer = async (params: {
  companyId: string
  customerId: string
  name: string
  phone: string
  email?: string
  company?: string
  tags?: string[]
  status?: "active" | "inactive" | "prospect"
  address?: string
  notes?: string
}) => {
  const customerRef = customersRef(params.companyId).doc(params.customerId)
  const existingSnap = await customerRef.get()

  if (!existingSnap.exists) {
    throw new Error("Customer not found")
  }

  const phone = normalizeStoredPhone(params.phone)
  if (!phone) {
    throw new Error("Invalid phone number")
  }
  const email = params.email?.trim()

  const existingByPhone = await findCustomerByField({
    companyId: params.companyId,
    field: "phone",
    value: phone,
    excludeCustomerId: params.customerId,
  })
  if (existingByPhone) {
    throw new Error("Customer with this phone already exists")
  }

  if (email) {
    const existingByEmail = await findCustomerByField({
      companyId: params.companyId,
      field: "email",
      value: email,
      excludeCustomerId: params.customerId,
    })
    if (existingByEmail) {
      throw new Error("Customer with this email already exists")
    }
  }

  const trimmedName = params.name.trim()
  const normalizedTags = sanitizeTags(params.tags)

  await customerRef.update({
    name: trimmedName,
    ...buildCustomerSearchFields({
      name: trimmedName,
      email,
      phone,
      company: params.company?.trim() ?? null,
    }),
    phone,
    email: email ?? null,
    company: params.company?.trim() ?? null,
    tags: normalizedTags,
    status: params.status ?? "active",
    address: params.address?.trim() ?? null,
    notes: params.notes?.trim() ?? null,
    updatedAt: FieldValue.serverTimestamp(),
  })

  const snapshot = await customerRef.get()
  const updatedCustomer = mapInboxCustomerRecord(customerRef.id, snapshot.data() as FirestoreInboxCustomer)

  await syncConversationCustomerSnapshots({
    companyId: params.companyId,
    customerId: params.customerId,
    snapshot: buildConversationCustomerSnapshot({
      name: updatedCustomer.name,
      phone: updatedCustomer.phone,
      email: updatedCustomer.email,
      company: updatedCustomer.company,
    }),
  })

  return updatedCustomer
}

export const bulkCreateInboxCustomers = async (params: {
  companyId: string
  customers: Array<{
    name: string
    phone: string
    email?: string
    company?: string
    tags?: string[]
    status?: "active" | "inactive" | "prospect"
  }>
}) => {
  const created: InboxCustomerRecord[] = []
  const errors: string[] = []

  for (const [index, customer] of params.customers.entries()) {
    try {
      const record = await createInboxCustomer({
        companyId: params.companyId,
        ...customer,
      })
      created.push(record)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      errors.push(`Row ${index + 1}: ${message}`)
    }
  }

  return { created, errors }
}

const mapAssignedToFromProfile = (uid: string, profile: FirestoreUser | null | undefined) => {
  if (!profile) {
    return {
      id: uid,
      name: uid,
    }
  }

  const name =
    [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim() || profile.email

  return {
    id: uid,
    name,
    firstName: profile.firstName,
    lastName: profile.lastName ?? null,
    email: profile.email,
    avatarUrl: profile.avatarUrl ?? null,
  }
}

const mapAssignedTo = async (uid: string | null | undefined) => {
  if (!uid) return null
  const profile = await getUserProfile(uid)
  return mapAssignedToFromProfile(uid, profile)
}

const chunkDocumentIds = <T,>(items: T[], size: number): T[][] => {
  const chunks: T[][] = []
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size))
  }
  return chunks
}

const batchGetDocumentSnapshots = async (
  refs: FirebaseFirestore.DocumentReference[],
): Promise<Map<string, FirebaseFirestore.DocumentSnapshot>> => {
  const snapshots = new Map<string, FirebaseFirestore.DocumentSnapshot>()

  const chunks = chunkDocumentIds(refs, 300)
  const chunkResults = await Promise.all(
    chunks.map((chunk) => (chunk.length > 0 ? adminDb.getAll(...chunk) : Promise.resolve([]))),
  )

  for (const docs of chunkResults) {
    for (const doc of docs) {
      snapshots.set(doc.id, doc)
    }
  }

  return snapshots
}

const buildConversationCustomerSnapshot = (customer: {
  name: string
  phone?: string | null
  email?: string | null
  company?: string | null
}) => ({
  customerName: customer.name.trim(),
  customerPhone: customer.phone ?? null,
  customerEmail: customer.email ?? null,
  customerCompany: customer.company?.trim() ?? null,
})

const hasDenormalizedCustomer = (data: FirestoreInboxConversation) =>
  Boolean(data.customerName?.trim() || data.customerPhone)

const customerFromDenormalizedFields = (
  customerId: string,
  data: FirestoreInboxConversation,
): ReturnType<typeof mapCustomer> | null => {
  if (!hasDenormalizedCustomer(data)) {
    return null
  }

  return mapCustomer(customerId, {
    name: data.customerName ?? "",
    phone: data.customerPhone ?? undefined,
    email: data.customerEmail ?? undefined,
    company: data.customerCompany ?? undefined,
  } as FirestoreInboxCustomer)
}

const assignedToFromDenormalizedFields = (
  data: FirestoreInboxConversation,
): ReturnType<typeof mapAssignedToFromProfile> | null | undefined => {
  if (!data.assignedToId) {
    return null
  }

  if (data.assignedToName?.trim()) {
    return {
      id: data.assignedToId,
      name: data.assignedToName.trim(),
    }
  }

  return undefined
}

const syncConversationCustomerSnapshots = async (params: {
  companyId: string
  customerId: string
  snapshot: ReturnType<typeof buildConversationCustomerSnapshot>
}) => {
  const conversationSnap = await conversationsRef(params.companyId)
    .where("customerId", "==", params.customerId)
    .get()

  if (conversationSnap.empty) {
    return
  }

  for (const chunk of chunkDocumentIds(conversationSnap.docs, 400)) {
    const batch = adminDb.batch()
    for (const doc of chunk) {
      batch.update(doc.ref, {
        ...params.snapshot,
        updatedAt: FieldValue.serverTimestamp(),
      })
    }
    await batch.commit()
  }
}

const buildConversationRecord = (
  companyId: string,
  conversationId: string,
  data: FirestoreInboxConversation,
  customer: ReturnType<typeof mapCustomer> | null,
  assignedTo: ReturnType<typeof mapAssignedToFromProfile> | null,
) => ({
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
  activeSurveyResponseId: data.activeSurveyResponseId ?? null,
  activeCampaignId: data.activeCampaignId ?? null,
  activeCampaignDeliveryId: data.activeCampaignDeliveryId ?? null,
  isArchived: data.isArchived ?? false,
  isBookmarked: data.isBookmarked ?? false,
  archivedAt: toIso(data.archivedAt ?? null),
  createdAt: toIso(data.createdAt) ?? new Date(),
  updatedAt: toIso(data.updatedAt) ?? new Date(),
  customer,
  assignedTo,
})

export const mapConversation = async (
  companyId: string,
  conversationId: string,
  data: FirestoreInboxConversation,
) => {
  const customerSnap = await customersRef(companyId).doc(data.customerId).get()
  const customerData = customerSnap.data() as FirestoreInboxCustomer | undefined

  return buildConversationRecord(
    companyId,
    conversationId,
    data,
    customerData ? mapCustomer(data.customerId, customerData) : null,
    await mapAssignedTo(data.assignedToId),
  )
}

export const mapMessage = (id: string, data: FirestoreInboxMessage) => ({
  id,
  content: data.content,
  senderType: data.senderType,
  sentBy: data.sentBy ?? resolveMessageSentBy(data.senderType),
  senderUserId: data.senderUserId ?? null,
  status: data.status,
  sentAt: toIso(data.sentAt) ?? new Date(),
  createdAt: toIso(data.createdAt) ?? new Date(),
  updatedAt: toIso(data.updatedAt) ?? new Date(),
  externalMessageId: data.externalMessageId ?? null,
  externalParticipantJid: data.externalParticipantJid ?? null,
  replyToMessageId: data.replyToMessageId ?? null,
  replyToExternalMessageId: data.replyToExternalMessageId ?? null,
  quotedMessage: data.quotedMessage ?? null,
})

export const listInboxCustomers = async (params: {
  companyId: string
  search?: string
  page?: number
  pageSize?: number
  orderBy?: "name" | "createdAt"
}) => {
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 50
  const searchTerm = params.search?.trim() ?? ""
  const orderByField = params.orderBy ?? "name"

  if (!searchTerm) {
    const query =
      orderByField === "createdAt"
        ? customersRef(params.companyId).orderBy("createdAt", "desc")
        : customersRef(params.companyId).orderBy("name")

    const snapshot = await query.limit(pageSize).get()
    const customers = snapshot.docs.map((doc) =>
      mapInboxCustomerRecord(doc.id, doc.data() as FirestoreInboxCustomer),
    )

    return {
      customers,
      pagination: { page: 1, pageSize, total: customers.length, totalPages: 1 },
    }
  }

  const term = searchTerm.toLowerCase()
  const capitalizedTerm = capitalizeSearchTerm(term)
  const digitsOnly = searchTerm.replace(/\D/g, "")
  const normalizedPhone = normalizeStoredPhone(searchTerm)
  const seen = new Map<string, InboxCustomerRecord>()

  const addDocs = (docs: FirebaseFirestore.QueryDocumentSnapshot[]) => {
    for (const doc of docs) {
      if (!seen.has(doc.id)) {
        seen.set(doc.id, mapInboxCustomerRecord(doc.id, doc.data() as FirestoreInboxCustomer))
      }
    }
  }

  const queries: Array<Promise<FirebaseFirestore.QuerySnapshot>> = [
    customersRef(params.companyId)
      .orderBy("nameLower")
      .startAt(term)
      .endAt(`${term}\uf8ff`)
      .limit(pageSize)
      .get(),
    customersRef(params.companyId)
      .orderBy("name")
      .startAt(capitalizedTerm)
      .endAt(`${capitalizedTerm}\uf8ff`)
      .limit(pageSize)
      .get(),
  ]

  if (term.length >= 2) {
    queries.push(
      customersRef(params.companyId)
        .where("searchKeywords", "array-contains", term)
        .limit(pageSize)
        .get(),
    )
  }

  if (term.includes("@")) {
    queries.push(
      customersRef(params.companyId)
        .orderBy("emailLower")
        .startAt(term)
        .endAt(`${term}\uf8ff`)
        .limit(pageSize)
        .get(),
      customersRef(params.companyId)
        .orderBy("email")
        .startAt(searchTerm)
        .endAt(`${searchTerm}\uf8ff`)
        .limit(pageSize)
        .get(),
    )
  }

  if (digitsOnly.length >= 3) {
    queries.push(
      customersRef(params.companyId)
        .orderBy("phone")
        .startAt(digitsOnly)
        .endAt(`${digitsOnly}\uf8ff`)
        .limit(pageSize)
        .get(),
    )
  }

  if (normalizedPhone) {
    queries.push(
      customersRef(params.companyId).where("phone", "==", normalizedPhone).limit(1).get(),
    )
  }

  const snapshots = await Promise.allSettled(queries)
  for (const result of snapshots) {
    if (result.status === "fulfilled") {
      addDocs(result.value.docs)
    }
  }

  if (seen.size === 0) {
    const recentSnapshot = await customersRef(params.companyId)
      .orderBy("createdAt", "desc")
      .limit(100)
      .get()

    for (const doc of recentSnapshot.docs) {
      const customer = mapInboxCustomerRecord(doc.id, doc.data() as FirestoreInboxCustomer)
      if (matchesCustomerSearch(customer, term)) {
        seen.set(doc.id, customer)
      }
    }
  }

  const customers = Array.from(seen.values()).sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  )

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
  sessionIds?: string[]
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

  const conversationDocs = snapshot.docs

  const customerIdsToFetch = new Set<string>()
  const assignedToIdsToFetch = new Set<string>()

  for (const doc of conversationDocs) {
    const data = doc.data() as FirestoreInboxConversation
    if (!hasDenormalizedCustomer(data)) {
      customerIdsToFetch.add(data.customerId)
    }
    if (data.assignedToId && !data.assignedToName?.trim()) {
      assignedToIdsToFetch.add(data.assignedToId)
    }
  }

  const [customerSnapshots, assignedToSnapshots] = await Promise.all([
    customerIdsToFetch.size > 0
      ? batchGetDocumentSnapshots(
          [...customerIdsToFetch].map((customerId) => customersRef(params.companyId).doc(customerId)),
        )
      : Promise.resolve(new Map<string, FirebaseFirestore.DocumentSnapshot>()),
    assignedToIdsToFetch.size > 0
      ? batchGetDocumentSnapshots(
          [...assignedToIdsToFetch].map((userId) => adminDb.collection(collections.users).doc(userId)),
        )
      : Promise.resolve(new Map<string, FirebaseFirestore.DocumentSnapshot>()),
  ])

  let conversations = conversationDocs.map((doc) => {
    const data = doc.data() as FirestoreInboxConversation
    const denormalizedCustomer = customerFromDenormalizedFields(data.customerId, data)
    const customerSnap = customerSnapshots.get(data.customerId)
    const customerData = customerSnap?.data() as FirestoreInboxCustomer | undefined
    const customer =
      denormalizedCustomer ??
      (customerData ? mapCustomer(data.customerId, customerData) : null)

    const denormalizedAssignedTo = assignedToFromDenormalizedFields(data)
    const assignedToId = data.assignedToId ?? null
    const assignedTo =
      denormalizedAssignedTo === undefined
        ? assignedToId
          ? mapAssignedToFromProfile(
              assignedToId,
              assignedToSnapshots.get(assignedToId)?.data() as FirestoreUser | undefined,
            )
          : null
        : denormalizedAssignedTo

    return buildConversationRecord(params.companyId, doc.id, data, customer, assignedTo)
  })

  if (!params.includeArchived) {
    conversations = conversations.filter((conversation) => !conversation.isArchived)
  }

  if (params.sessionIds?.length) {
    const allowedSessionIds = new Set(params.sessionIds)
    conversations = conversations.filter(
      (conversation) => conversation.sessionId != null && allowedSessionIds.has(conversation.sessionId),
    )
  } else if (params.sessionId) {
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

export const getInboxConversationForSend = async (params: {
  companyId: string
  conversationId: string
}) => {
  const conversationSnap = await conversationsRef(params.companyId)
    .doc(params.conversationId)
    .get()

  if (!conversationSnap.exists) {
    return null
  }

  const data = conversationSnap.data() as FirestoreInboxConversation
  const customerSnap = await customersRef(params.companyId).doc(data.customerId).get()
  const customerData = customerSnap.data() as FirestoreInboxCustomer | undefined

  return {
    id: conversationSnap.id,
    companyId: params.companyId,
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
    isBookmarked: data.isBookmarked ?? false,
    archivedAt: toIso(data.archivedAt ?? null),
    createdAt: toIso(data.createdAt) ?? new Date(),
    updatedAt: toIso(data.updatedAt) ?? new Date(),
    customer: customerData ? mapCustomer(data.customerId, customerData) : null,
  }
}

export const updateInboxMessageStatus = async (params: {
  companyId: string
  conversationId: string
  messageId: string
  status: InboxMessageStatus
  failureReason?: string
  channelPhoneNumber?: string
  externalMessageId?: string
  externalParticipantJid?: string
}) => {
  await messagesRef(params.companyId, params.conversationId).doc(params.messageId).update({
    status: params.status,
    ...(params.failureReason ? { failureReason: params.failureReason } : {}),
    ...(params.channelPhoneNumber ? { channelPhoneNumber: params.channelPhoneNumber } : {}),
    ...(params.externalMessageId ? { externalMessageId: params.externalMessageId } : {}),
    ...(params.externalParticipantJid ? { externalParticipantJid: params.externalParticipantJid } : {}),
    updatedAt: FieldValue.serverTimestamp(),
  })
}

export const getInboxMessage = async (params: {
  companyId: string
  conversationId: string
  messageId: string
}) => {
  const snap = await messagesRef(params.companyId, params.conversationId).doc(params.messageId).get()
  if (!snap.exists) return null
  return mapMessage(snap.id, snap.data() as FirestoreInboxMessage)
}

export const findInboxMessageByExternalId = async (params: {
  companyId: string
  conversationId: string
  externalMessageId: string
}) => {
  const snap = await messagesRef(params.companyId, params.conversationId)
    .where("externalMessageId", "==", params.externalMessageId)
    .limit(1)
    .get()

  const doc = snap.docs[0]
  if (!doc) return null
  return mapMessage(doc.id, doc.data() as FirestoreInboxMessage)
}

export const markMessageMetricsSent = async (params: {
  companyId: string
  conversationId: string
  messageId: string
  channelPhoneNumber?: string
}) => {
  const ref = messagesRef(params.companyId, params.conversationId).doc(params.messageId)
  let applied = false

  await adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(ref)
    if (!snap.exists) return
    if (snap.data()?.metricsSentCounted === true) return
    tx.update(ref, {
      metricsSentCounted: true,
      ...(params.channelPhoneNumber ? { channelPhoneNumber: params.channelPhoneNumber } : {}),
      updatedAt: FieldValue.serverTimestamp(),
    })
    applied = true
  })

  return applied
}

export const listPendingOutboundMessages = async (params: { companyId: string; limit?: number }) => {
  const limit = params.limit ?? 50
  const conversationsSnap = await conversationsRef(params.companyId).limit(100).get()
  const pending: Array<{
    conversationId: string
    messageId: string
    content: string
    senderType: InboxMessageSenderType
    sessionId: string | null
    customerPhone: string | null
  }> = []

  for (const conversationDoc of conversationsSnap.docs) {
    const conversation = conversationDoc.data() as FirestoreInboxConversation
    const messagesSnap = await messagesRef(params.companyId, conversationDoc.id)
      .where("status", "in", ["pending", "failed"])
      .where("direction", "==", "outbound")
      .limit(10)
      .get()

    for (const messageDoc of messagesSnap.docs) {
      const message = messageDoc.data() as FirestoreInboxMessage
      if (message.senderType !== "agent" && message.senderType !== "bot") continue

      const customerSnap = await customersRef(params.companyId).doc(conversation.customerId).get()
      const customerPhone = customerSnap.data()?.phone ?? null

      pending.push({
        conversationId: conversationDoc.id,
        messageId: messageDoc.id,
        content: message.content,
        senderType: message.senderType,
        sessionId: conversation.sessionId ?? null,
        customerPhone,
      })

      if (pending.length >= limit) {
        return pending
      }
    }
  }

  return pending
}

export const upsertCustomerByPhone = async (params: {
  companyId: string
  phone: string
  name?: string
  email?: string
}) => {
  const phone = normalizeStoredPhone(params.phone)
  if (!phone) {
    throw new Error("Invalid phone number")
  }

  const existingSnap = await customersRef(params.companyId)
    .where("phone", "==", phone)
    .limit(1)
    .get()

  const now = FieldValue.serverTimestamp()

  if (!existingSnap.empty) {
    const doc = existingSnap.docs[0]!
    const existingData = doc.data() as FirestoreInboxCustomer
    const resolvedName = params.name ?? existingData.name ?? phone
    const resolvedEmail = params.email ?? existingData.email ?? null

    await doc.ref.set(
      {
        name: resolvedName,
        ...buildCustomerSearchFields({
          name: resolvedName,
          email: resolvedEmail,
          phone,
          company: existingData.company ?? null,
        }),
        ...(params.email ? { email: params.email } : {}),
        updatedAt: now,
      },
      { merge: true },
    )

    await syncConversationCustomerSnapshots({
      companyId: params.companyId,
      customerId: doc.id,
      snapshot: buildConversationCustomerSnapshot({
        name: resolvedName,
        phone,
        email: resolvedEmail,
        company: existingData.company ?? null,
      }),
    })

    return { customerId: doc.id, created: false as const }
  }

  const customerRef = customersRef(params.companyId).doc()
  const resolvedName = params.name ?? phone
  const resolvedEmail = params.email ?? null

  await customerRef.set({
    name: resolvedName,
    ...buildCustomerSearchFields({
      name: resolvedName,
      email: resolvedEmail,
      phone,
    }),
    phone,
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
  channel?: FirestoreInboxMessage["channel"]
  direction?: FirestoreInboxMessage["direction"]
  externalMessageId?: string
  externalParticipantJid?: string
  channelPhoneNumber?: string
  replyToMessageId?: string
  replyToExternalMessageId?: string
  quotedMessage?: FirestoreInboxMessage["quotedMessage"]
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
      sentBy: resolveMessageSentBy(params.senderType),
      ...(params.senderUserId ? { senderUserId: params.senderUserId } : {}),
      content: params.content,
      status: params.status ?? "sent",
      ...(params.channel ? { channel: params.channel } : {}),
      ...(params.direction ? { direction: params.direction } : {}),
      ...(params.externalMessageId ? { externalMessageId: params.externalMessageId } : {}),
      ...(params.externalParticipantJid ? { externalParticipantJid: params.externalParticipantJid } : {}),
      ...(params.channelPhoneNumber ? { channelPhoneNumber: params.channelPhoneNumber } : {}),
      ...(params.replyToMessageId ? { replyToMessageId: params.replyToMessageId } : {}),
      ...(params.replyToExternalMessageId ? { replyToExternalMessageId: params.replyToExternalMessageId } : {}),
      ...(params.quotedMessage ? { quotedMessage: params.quotedMessage } : {}),
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
  const normalizedPhone = params.customer.phone
    ? normalizeStoredPhone(params.customer.phone)
    : undefined

  let existingCustomerId: string | null = null
  const identifierFilters: Array<{ field: "email" | "phone"; value: string }> = []
  if (params.customer.email) identifierFilters.push({ field: "email", value: params.customer.email.trim() })
  if (normalizedPhone) identifierFilters.push({ field: "phone", value: normalizedPhone })

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
    const trimmedName = params.customer.name.trim()
    const trimmedEmail = params.customer.email?.trim() ?? null

    tx.set(
      customerRef,
      {
        name: trimmedName,
        ...buildCustomerSearchFields({
          name: trimmedName,
          email: trimmedEmail,
          phone: normalizedPhone ?? null,
        }),
        phone: normalizedPhone ?? null,
        email: trimmedEmail,
        address: params.customer.address ?? null,
        notes: params.customer.notes ?? null,
        ...(existingCustomerId ? { updatedAt: now } : { createdAt: now, updatedAt: now }),
      },
      { merge: true },
    )

    tx.set(conversationRef, {
      customerId: customerRef.id,
      ...buildConversationCustomerSnapshot({
        name: trimmedName,
        phone: normalizedPhone ?? null,
        email: trimmedEmail,
      }),
      sessionId: params.sessionId ?? null,
      subject: params.subject ?? null,
      priority: params.priority ?? "medium",
      tags: normalizedTags,
      satisfactionScore: params.satisfactionScore ?? null,
      unreadCount: 0,
      isArchived: false,
      isBookmarked: false,
      archivedAt: null,
      lastMessageSentAt: now,
      createdAt: now,
      updatedAt: now,
      ...(params.initialMessage
        ? {
            lastMessagePreview: params.initialMessage.content,
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

export const rebindConversationSession = async (params: {
  companyId: string
  conversationId: string
  sessionId: string | null
}) => {
  await conversationsRef(params.companyId).doc(params.conversationId).update({
    ...(params.sessionId ? { sessionId: params.sessionId } : { sessionId: FieldValue.delete() }),
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
  isBookmarked?: boolean
}) => {
  const update: Record<string, unknown> = {
    updatedAt: FieldValue.serverTimestamp(),
  }

  if (params.assignedToId !== undefined) {
    update.assignedToId = params.assignedToId
    if (params.assignedToId) {
      const profile = await getUserProfile(params.assignedToId)
      update.assignedToName = mapAssignedToFromProfile(params.assignedToId, profile).name
    } else {
      update.assignedToName = null
    }
  }
  if (params.priority) update.priority = params.priority
  if (params.tags) update.tags = sanitizeTags(params.tags)
  if (params.satisfactionScore != null) update.satisfactionScore = params.satisfactionScore
  if (params.isBookmarked != null) update.isBookmarked = params.isBookmarked
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
    const customerSnap = await customersRef(params.companyId).doc(customerId).get()
    const customerData = customerSnap.data() as FirestoreInboxCustomer | undefined
    const conversationRef = conversationsRef(params.companyId).doc()
    const now = FieldValue.serverTimestamp()
    await conversationRef.set({
      customerId,
      ...(customerData
        ? buildConversationCustomerSnapshot({
            name: customerData.name,
            phone: customerData.phone ?? null,
            email: customerData.email ?? null,
            company: customerData.company ?? null,
          })
        : {}),
      sessionId: params.sessionId ?? null,
      priority: "medium",
      tags: [],
      unreadCount: 0,
      isArchived: false,
      isBookmarked: false,
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
