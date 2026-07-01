import { FieldValue, Timestamp, type Query } from "firebase-admin/firestore"
import { adminDb } from "@/lib/firebase/admin"
import { collections, companySubcollections, ticketSubcollections } from "@/lib/firebase/collections"
import {
  TICKETS_DEFAULT_PAGE_SIZE,
  TICKETS_MAX_PAGE_SIZE,
  TICKETS_MAX_SEARCH_SCAN_BATCHES,
  TICKETS_SEARCH_SCAN_BATCH,
  type TicketListCursor,
} from "@/lib/tickets/ticket-list-pagination"
import type {
  FirestoreTicket,
  FirestoreTicketActivity,
  FirestoreTicketComment,
  TicketActivityAction,
  TicketPriority,
  TicketStatus,
  TicketType,
} from "@/lib/firebase/types"

const companyRef = (companyId: string) => adminDb.collection(collections.companies).doc(companyId)

const ticketsRef = (companyId: string) =>
  companyRef(companyId).collection(companySubcollections.tickets)

const ticketCountersRef = (companyId: string) =>
  companyRef(companyId).collection(companySubcollections.ticketCounters)

const ticketCommentsRef = (companyId: string, ticketId: string) =>
  ticketsRef(companyId).doc(ticketId).collection(ticketSubcollections.comments)

const ticketActivitiesRef = (companyId: string, ticketId: string) =>
  ticketsRef(companyId).doc(ticketId).collection(ticketSubcollections.activities)

const toDate = (value: Timestamp) => value.toDate()

type ActorContext = {
  userId: string
  userName?: string
}

export type TicketRecord = {
  id: string
  ticketNumber: string
  ticketSequence: number
  ticketScopeCode: string
  title: string
  description: string
  type: TicketType
  status: TicketStatus
  priority: TicketPriority
  customerId: string | null
  customerName: string | null
  orderReference: string | null
  conversationId: string | null
  assignedToId: string | null
  assignedToName: string | null
  createdById: string
  createdByName: string | null
  createdAt: Date
  updatedAt: Date
}

export type TicketCommentRecord = {
  id: string
  ticketId: string
  content: string
  authorId: string
  authorName: string | null
  createdAt: Date
}

export type TicketActivityRecord = {
  id: string
  ticketId: string
  action: TicketActivityAction
  actorId: string
  actorName: string | null
  field: string | null
  previousValue: string | null
  newValue: string | null
  createdAt: Date
}

const mapTicket = (id: string, data: FirestoreTicket): TicketRecord => ({
  id,
  ticketNumber: data.ticketNumber,
  ticketSequence: data.ticketSequence ?? 0,
  ticketScopeCode: data.ticketScopeCode ?? "COMPANY",
  title: data.title,
  description: data.description,
  type: data.type,
  status: data.status,
  priority: data.priority,
  customerId: data.customerId ?? null,
  customerName: data.customerName ?? null,
  orderReference: data.orderReference ?? null,
  conversationId: data.conversationId ?? null,
  assignedToId: data.assignedToId ?? null,
  assignedToName: data.assignedToName ?? null,
  createdById: data.createdById,
  createdByName: data.createdByName ?? null,
  createdAt: toDate(data.createdAt),
  updatedAt: toDate(data.updatedAt),
})

const mapComment = (ticketId: string, id: string, data: FirestoreTicketComment): TicketCommentRecord => ({
  id,
  ticketId,
  content: data.content,
  authorId: data.authorId,
  authorName: data.authorName ?? null,
  createdAt: toDate(data.createdAt),
})

const mapActivity = (ticketId: string, id: string, data: FirestoreTicketActivity): TicketActivityRecord => ({
  id,
  ticketId,
  action: data.action,
  actorId: data.actorId,
  actorName: data.actorName ?? null,
  field: data.field ?? null,
  previousValue: data.previousValue ?? null,
  newValue: data.newValue ?? null,
  createdAt: toDate(data.createdAt),
})

const formatActivityValue = (value: unknown): string | null => {
  if (value === null || value === undefined) return null
  const normalized = String(value).trim()
  return normalized.length > 0 ? normalized : null
}

const logTicketActivity = async (params: {
  companyId: string
  ticketId: string
  action: TicketActivityAction
  actor: ActorContext
  field?: string
  previousValue?: string | null
  newValue?: string | null
}) => {
  const ref = ticketActivitiesRef(params.companyId, params.ticketId).doc()
  await ref.set({
    action: params.action,
    actorId: params.actor.userId,
    actorName: params.actor.userName?.trim() ?? null,
    field: params.field ?? null,
    previousValue: params.previousValue ?? null,
    newValue: params.newValue ?? null,
    createdAt: FieldValue.serverTimestamp(),
  })
}

const COMPANY_TICKET_COUNTER_ID = "_company"

const allocateTicketNumber = async (companyId: string) =>
  adminDb.runTransaction(async (transaction) => {
    const counterRef = ticketCountersRef(companyId).doc(COMPANY_TICKET_COUNTER_ID)
    const counterSnap = await transaction.get(counterRef)
    const nextSequence = ((counterSnap.data()?.nextSequence as number | undefined) ?? 0) + 1
    const ticketNumber = `TKT-${String(nextSequence).padStart(5, "0")}`

    transaction.set(
      counterRef,
      {
        nextSequence,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    )

    return {
      ticketNumber,
      ticketSequence: nextSequence,
      ticketScopeCode: "COMPANY",
    }
  })

export type AgentTicketSummary = {
  id: string
  ticketNumber: string
  title: string
  description: string
  type: TicketType
  status: TicketStatus
  priority: TicketPriority
  customerName: string | null
  orderReference: string | null
  createdAt: string
  updatedAt: string
}

const mapTicketForAgent = (ticket: TicketRecord): AgentTicketSummary => ({
  id: ticket.id,
  ticketNumber: ticket.ticketNumber,
  title: ticket.title,
  description: truncateForAgent(ticket.description),
  type: ticket.type,
  status: ticket.status,
  priority: ticket.priority,
  customerName: ticket.customerName,
  orderReference: ticket.orderReference,
  createdAt: ticket.createdAt.toISOString(),
  updatedAt: ticket.updatedAt.toISOString(),
})

const truncateForAgent = (value: string, max = 500) =>
  value.length <= max ? value : `${value.slice(0, max)}…`

export const getTicketByNumber = async (
  companyId: string,
  ticketNumber: string,
): Promise<TicketRecord | null> => {
  const normalized = ticketNumber.trim()
  if (!normalized) return null

  const snap = await ticketsRef(companyId)
    .where("ticketNumber", "==", normalized)
    .limit(1)
    .get()

  const doc = snap.docs[0]
  if (!doc) return null
  return mapTicket(doc.id, doc.data() as FirestoreTicket)
}

export const searchTicketsForAgent = async (params: {
  companyId: string
  query?: string
  customerId?: string
  status?: TicketStatus
  ticketNumber?: string
  limit?: number
}): Promise<AgentTicketSummary[]> => {
  const limit = Math.min(params.limit ?? 10, 20)

  if (params.ticketNumber?.trim()) {
    const ticket = await getTicketByNumber(params.companyId, params.ticketNumber)
    return ticket ? [mapTicketForAgent(ticket)] : []
  }

  if (params.customerId) {
    const snap = await ticketsRef(params.companyId)
      .where("customerId", "==", params.customerId)
      .orderBy("createdAt", "desc")
      .limit(50)
      .get()

    let tickets = snap.docs.map((doc) => mapTicket(doc.id, doc.data() as FirestoreTicket))

    if (params.status) {
      tickets = tickets.filter((ticket) => ticket.status === params.status)
    }

    if (params.query?.trim()) {
      const queryLower = params.query.trim().toLowerCase()
      tickets = tickets.filter((ticket) => {
        const values = [ticket.ticketNumber, ticket.title, ticket.description, ticket.orderReference]
        return values.some((value) => value?.toLowerCase().includes(queryLower))
      })
    }

    return tickets.slice(0, limit).map(mapTicketForAgent)
  }

  const result = await listTickets({
    companyId: params.companyId,
    search: params.query,
    status: params.status,
    pageSize: limit,
  })

  return result.tickets.map(mapTicketForAgent)
}

const ticketMatchesSearch = (ticket: TicketRecord, search: string) => {
  const queryLower = search.trim().toLowerCase()
  if (!queryLower) {
    return true
  }

  const values = [
    ticket.ticketNumber,
    ticket.title,
    ticket.description,
    ticket.customerName,
    ticket.orderReference,
  ]

  return values.some((value) => value?.toLowerCase().includes(queryLower))
}

const toTicketListCursor = (ticketId: string, updatedAt: Date): TicketListCursor => ({
  id: ticketId,
  updatedAt: updatedAt.toISOString(),
})

const buildTicketsListQuery = (
  companyId: string,
  params: { statuses?: TicketStatus[]; type?: TicketType },
) => {
  let query = ticketsRef(companyId).orderBy("updatedAt", "desc")

  if (params.statuses && params.statuses.length > 0) {
    if (params.statuses.length === 1) {
      query = query.where("status", "==", params.statuses[0]) as typeof query
    } else {
      query = query.where("status", "in", params.statuses.slice(0, 10)) as typeof query
    }
  }

  if (params.type) {
    query = query.where("type", "==", params.type) as typeof query
  }

  return query
}

const applyTicketListCursor = async (
  query: Query,
  companyId: string,
  cursor: TicketListCursor | null,
) => {
  if (!cursor) {
    return query
  }

  const cursorSnap = await ticketsRef(companyId).doc(cursor.id).get()
  if (!cursorSnap.exists) {
    return query
  }

  return query.startAfter(cursorSnap)
}

const listTicketsDirect = async (params: {
  companyId: string
  statuses?: TicketStatus[]
  type?: TicketType
  pageSize: number
  cursor?: TicketListCursor | null
}) => {
  let query = buildTicketsListQuery(params.companyId, {
    statuses: params.statuses,
    type: params.type,
  })
  query = await applyTicketListCursor(query, params.companyId, params.cursor ?? null)

  const snapshot = await query.limit(params.pageSize + 1).get()
  const hasMore = snapshot.docs.length > params.pageSize
  const pageDocs = hasMore ? snapshot.docs.slice(0, params.pageSize) : snapshot.docs
  const tickets = pageDocs.map((doc) => mapTicket(doc.id, doc.data() as FirestoreTicket))
  const lastDoc = pageDocs.at(-1)
  const nextCursor = lastDoc
    ? toTicketListCursor(lastDoc.id, toDate((lastDoc.data() as FirestoreTicket).updatedAt))
    : null

  return {
    tickets,
    pagination: {
      pageSize: params.pageSize,
      hasMore,
      nextCursor: hasMore ? nextCursor : null,
    },
  }
}

const listTicketsScanned = async (params: {
  companyId: string
  statuses?: TicketStatus[]
  type?: TicketType
  search: string
  pageSize: number
  cursor?: TicketListCursor | null
}) => {
  const matched: TicketRecord[] = []
  let cursor = params.cursor ?? null
  let batchHasMore = false
  let nextCursor: TicketListCursor | null = null
  let scannedBatches = 0

  while (matched.length < params.pageSize && scannedBatches < TICKETS_MAX_SEARCH_SCAN_BATCHES) {
    scannedBatches += 1

    let query = buildTicketsListQuery(params.companyId, {
      statuses: params.statuses,
      type: params.type,
    })
    query = await applyTicketListCursor(query, params.companyId, cursor)

    const snapshot = await query.limit(TICKETS_SEARCH_SCAN_BATCH + 1).get()
    if (snapshot.empty) {
      batchHasMore = false
      break
    }

    batchHasMore = snapshot.docs.length > TICKETS_SEARCH_SCAN_BATCH
    const pageDocs = batchHasMore ? snapshot.docs.slice(0, TICKETS_SEARCH_SCAN_BATCH) : snapshot.docs
    const tickets = pageDocs.map((doc) => mapTicket(doc.id, doc.data() as FirestoreTicket))

    for (const ticket of tickets) {
      if (!ticketMatchesSearch(ticket, params.search)) {
        continue
      }

      matched.push(ticket)
      if (matched.length >= params.pageSize) {
        break
      }
    }

    const lastFetchedDoc = pageDocs.at(-1)
    nextCursor = lastFetchedDoc
      ? toTicketListCursor(
          lastFetchedDoc.id,
          toDate((lastFetchedDoc.data() as FirestoreTicket).updatedAt),
        )
      : null
    cursor = nextCursor

    if (!batchHasMore) {
      break
    }
  }

  const hasMore = batchHasMore || matched.length > params.pageSize

  return {
    tickets: matched.slice(0, params.pageSize),
    pagination: {
      pageSize: params.pageSize,
      hasMore,
      nextCursor: hasMore ? nextCursor : null,
    },
  }
}

export const listTickets = async (params: {
  companyId: string
  status?: TicketStatus
  statuses?: TicketStatus[]
  type?: TicketType
  search?: string
  page?: number
  pageSize?: number
  cursor?: TicketListCursor | null
}): Promise<{
  tickets: TicketRecord[]
  pagination: { pageSize: number; hasMore: boolean; nextCursor: TicketListCursor | null }
}> => {
  const pageSize = Math.min(params.pageSize ?? TICKETS_DEFAULT_PAGE_SIZE, TICKETS_MAX_PAGE_SIZE)
  const statuses =
    params.statuses && params.statuses.length > 0
      ? params.statuses
      : params.status
        ? [params.status]
        : undefined
  const search = params.search?.trim()

  if (search) {
    return listTicketsScanned({
      companyId: params.companyId,
      statuses,
      type: params.type,
      search,
      pageSize,
      cursor: params.cursor ?? null,
    })
  }

  return listTicketsDirect({
    companyId: params.companyId,
    statuses,
    type: params.type,
    pageSize,
    cursor: params.cursor ?? null,
  })
}

export const getTicket = async (companyId: string, ticketId: string): Promise<TicketRecord | null> => {
  const snap = await ticketsRef(companyId).doc(ticketId).get()
  if (!snap.exists) return null
  return mapTicket(snap.id, snap.data() as FirestoreTicket)
}

export const listTicketComments = async (
  companyId: string,
  ticketId: string,
): Promise<TicketCommentRecord[]> => {
  const snap = await ticketCommentsRef(companyId, ticketId).orderBy("createdAt", "asc").get()
  return snap.docs.map((doc) => mapComment(ticketId, doc.id, doc.data() as FirestoreTicketComment))
}

export const listTicketActivities = async (
  companyId: string,
  ticketId: string,
): Promise<TicketActivityRecord[]> => {
  const snap = await ticketActivitiesRef(companyId, ticketId).orderBy("createdAt", "desc").get()
  return snap.docs.map((doc) => mapActivity(ticketId, doc.id, doc.data() as FirestoreTicketActivity))
}

const formatInitialTicketJournalContent = (title: string, description: string): string => {
  const trimmedTitle = title.trim()
  const trimmedDescription = description.trim()

  if (!trimmedTitle) return trimmedDescription
  if (!trimmedDescription || trimmedTitle === trimmedDescription) return trimmedTitle

  const divider = "─".repeat(Math.min(Math.max(trimmedTitle.length, 12), 48))

  return `${trimmedTitle}\n${divider}\n\n${trimmedDescription}`
}

export const addTicketComment = async (params: {
  companyId: string
  ticketId: string
  actor: ActorContext
  content: string
}): Promise<TicketCommentRecord> => {
  const ticket = await getTicket(params.companyId, params.ticketId)
  if (!ticket) {
    throw new Error("Ticket not found")
  }

  const ref = ticketCommentsRef(params.companyId, params.ticketId).doc()
  const now = FieldValue.serverTimestamp()

  await ref.set({
    content: params.content.trim(),
    authorId: params.actor.userId,
    authorName: params.actor.userName?.trim() ?? null,
    createdAt: now,
  })

  await ticketsRef(params.companyId).doc(params.ticketId).update({
    updatedAt: now,
  })

  await logTicketActivity({
    companyId: params.companyId,
    ticketId: params.ticketId,
    action: "comment_added",
    actor: params.actor,
  })

  const created = await ref.get()
  return mapComment(params.ticketId, created.id, created.data() as FirestoreTicketComment)
}

export const createTicket = async (params: {
  companyId: string
  userId: string
  userName?: string
  title: string
  description: string
  type: TicketType
  priority?: TicketPriority
  customerId?: string
  customerName?: string
  orderReference?: string
  conversationId?: string
}): Promise<TicketRecord> => {
  const ref = ticketsRef(params.companyId).doc()
  const numbering = await allocateTicketNumber(params.companyId)
  const now = FieldValue.serverTimestamp()
  const actor = { userId: params.userId, userName: params.userName }

  const payload: Omit<FirestoreTicket, "createdAt" | "updatedAt"> & {
    createdAt: FieldValue
    updatedAt: FieldValue
  } = {
    ticketNumber: numbering.ticketNumber,
    ticketSequence: numbering.ticketSequence,
    ticketScopeCode: numbering.ticketScopeCode,
    title: params.title.trim(),
    description: params.description.trim(),
    type: params.type,
    status: "open",
    priority: params.priority ?? "medium",
    customerId: params.customerId ?? null,
    customerName: params.customerName?.trim() ?? null,
    orderReference: params.orderReference?.trim() ?? null,
    conversationId: params.conversationId ?? null,
    assignedToId: null,
    assignedToName: null,
    createdById: params.userId,
    createdByName: params.userName?.trim() ?? null,
    createdAt: now,
    updatedAt: now,
  }

  await ref.set(payload)

  await logTicketActivity({
    companyId: params.companyId,
    ticketId: ref.id,
    action: "created",
    actor,
    newValue: numbering.ticketNumber,
  })

  await addTicketComment({
    companyId: params.companyId,
    ticketId: ref.id,
    actor,
    content: formatInitialTicketJournalContent(params.title, params.description),
  })

  const created = await ref.get()
  return mapTicket(created.id, created.data() as FirestoreTicket)
}

export const updateTicket = async (params: {
  companyId: string
  ticketId: string
  actor: ActorContext
  title?: string
  description?: string
  type?: TicketType
  status?: TicketStatus
  priority?: TicketPriority
  customerId?: string | null
  customerName?: string | null
  orderReference?: string | null
  conversationId?: string | null
  assignedToId?: string | null
  assignedToName?: string | null
}): Promise<TicketRecord> => {
  const ref = ticketsRef(params.companyId).doc(params.ticketId)
  const snap = await ref.get()

  if (!snap.exists) {
    throw new Error("Ticket not found")
  }

  const existing = mapTicket(snap.id, snap.data() as FirestoreTicket)
  const updates: Record<string, unknown> = {
    updatedAt: FieldValue.serverTimestamp(),
  }

  const changes: Array<{
    action: TicketActivityAction
    field: string
    previousValue: string | null
    newValue: string | null
  }> = []

  const trackChange = (
    action: TicketActivityAction,
    field: string,
    previous: unknown,
    next: unknown,
  ) => {
    const previousValue = formatActivityValue(previous)
    const newValue = formatActivityValue(next)
    if (previousValue === newValue) return
    changes.push({ action, field, previousValue, newValue })
  }

  if (params.title !== undefined) {
    const next = params.title.trim()
    trackChange("title_changed", "title", existing.title, next)
    updates.title = next
  }

  if (params.description !== undefined) {
    const next = params.description.trim()
    trackChange("description_changed", "description", existing.description, next)
    updates.description = next
  }

  if (params.type !== undefined) {
    trackChange("type_changed", "type", existing.type, params.type)
    updates.type = params.type
  }

  if (params.status !== undefined) {
    trackChange("status_changed", "status", existing.status, params.status)
    updates.status = params.status
  }

  if (params.priority !== undefined) {
    trackChange("priority_changed", "priority", existing.priority, params.priority)
    updates.priority = params.priority
  }

  if (params.customerId !== undefined || params.customerName !== undefined) {
    const nextCustomerId = params.customerId !== undefined ? params.customerId : existing.customerId
    const nextCustomerName =
      params.customerName !== undefined ? params.customerName?.trim() ?? null : existing.customerName
    trackChange(
      "customer_changed",
      "customer",
      existing.customerName,
      nextCustomerName,
    )
    if (params.customerId !== undefined) updates.customerId = params.customerId
    if (params.customerName !== undefined) updates.customerName = nextCustomerName
  }

  if (params.orderReference !== undefined) {
    const next = params.orderReference?.trim() ?? null
    trackChange("order_reference_changed", "orderReference", existing.orderReference, next)
    updates.orderReference = next
  }

  if (params.conversationId !== undefined) {
    updates.conversationId = params.conversationId
  }

  if (params.assignedToId !== undefined || params.assignedToName !== undefined) {
    const nextAssignedId =
      params.assignedToId !== undefined ? params.assignedToId : existing.assignedToId
    const nextAssignedName =
      params.assignedToName !== undefined
        ? params.assignedToName?.trim() ?? null
        : existing.assignedToName

    if (!existing.assignedToId && nextAssignedId) {
      trackChange("assigned", "assignedTo", null, nextAssignedName ?? nextAssignedId)
    } else if (existing.assignedToId && !nextAssignedId) {
      trackChange("unassigned", "assignedTo", existing.assignedToName ?? existing.assignedToId, null)
    } else if (existing.assignedToId !== nextAssignedId) {
      trackChange(
        "assigned",
        "assignedTo",
        existing.assignedToName ?? existing.assignedToId,
        nextAssignedName ?? nextAssignedId,
      )
    }

    if (params.assignedToId !== undefined) updates.assignedToId = params.assignedToId
    if (params.assignedToName !== undefined) updates.assignedToName = nextAssignedName
  }

  await ref.update(updates)

  await Promise.all(
    changes.map((change) =>
      logTicketActivity({
        companyId: params.companyId,
        ticketId: params.ticketId,
        action: change.action,
        actor: params.actor,
        field: change.field,
        previousValue: change.previousValue,
        newValue: change.newValue,
      }),
    ),
  )

  const updated = await ref.get()
  return mapTicket(updated.id, updated.data() as FirestoreTicket)
}
