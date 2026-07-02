import { FieldValue, Timestamp } from "firebase-admin/firestore"
import { adminDb } from "@/lib/firebase/admin"
import { collections, companySubcollections, settingsDocIds } from "@/lib/firebase/collections"
import {
  computeAvailableSlotsForAssignee,
  DEFAULT_BUSINESS_HOURS,
  type ReservationInterval,
  type TimeInterval,
} from "@/lib/schedule/availability"
import type {
  FirestoreAgendaProfile,
  FirestoreScheduleBlock,
  FirestoreScheduleReservation,
  FirestoreScheduleService,
  FirestoreScheduleSettings,
  ScheduleReservationSource,
  ScheduleReservationStatus,
} from "@/lib/firebase/types"
import type { ScheduleDayHours } from "@/lib/types/schedule"

const companyRef = (companyId: string) => adminDb.collection(collections.companies).doc(companyId)

const scheduleSettingsRef = (companyId: string) =>
  companyRef(companyId).collection(companySubcollections.settings).doc(settingsDocIds.schedule)

const scheduleServicesRef = (companyId: string) =>
  companyRef(companyId).collection(companySubcollections.scheduleServices)

const agendaProfilesRef = (companyId: string) =>
  companyRef(companyId).collection(companySubcollections.agendaProfiles)

const scheduleBlocksRef = (companyId: string) =>
  companyRef(companyId).collection(companySubcollections.scheduleBlocks)

const scheduleReservationsRef = (companyId: string) =>
  companyRef(companyId).collection(companySubcollections.scheduleReservations)

const scheduleCountersRef = (companyId: string) =>
  companyRef(companyId).collection(companySubcollections.scheduleCounters)

const membersRef = (companyId: string) =>
  companyRef(companyId).collection(companySubcollections.members)

const toDate = (value: Timestamp) => value.toDate()

const COMPANY_SCHEDULE_COUNTER_ID = "_company"

export class ScheduleConflictError extends Error {
  constructor(message = "SLOT_UNAVAILABLE") {
    super(message)
    this.name = "ScheduleConflictError"
  }
}

export type ScheduleSettingsRecord = {
  timezone: string
  defaultBufferMinutes: number
  minAdvanceBookingMinutes: number
  maxAdvanceBookingDays: number
  slotIntervalMinutes: number
  businessHours: ScheduleDayHours[]
  updatedAt: Date
}

export type ScheduleServiceRecord = {
  id: string
  name: string
  description: string | null
  durationMinutes: number
  bufferBeforeMinutes: number | null
  bufferAfterMinutes: number | null
  assigneeIds: string[]
  color: string | null
  active: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

export type AgendaProfileRecord = {
  memberUid: string
  displayName: string | null
  enabled: boolean
  timezone: string | null
  workingHours: ScheduleDayHours[] | null
  createdAt: Date
  updatedAt: Date
}

export type ScheduleBlockRecord = {
  id: string
  assigneeId: string
  type: FirestoreScheduleBlock["type"]
  startAt: Date
  endAt: Date
  reason: string | null
  createdById: string
  createdAt: Date
  updatedAt: Date
}

export type ScheduleReservationRecord = {
  id: string
  reservationNumber: string
  serviceId: string
  serviceName: string
  assigneeId: string
  assigneeName: string
  customerId: string | null
  customerName: string | null
  customerPhone: string | null
  conversationId: string | null
  startAt: Date
  endAt: Date
  status: ScheduleReservationStatus
  notes: string | null
  source: ScheduleReservationSource
  createdById: string
  cancelledAt: Date | null
  cancellationReason: string | null
  createdAt: Date
  updatedAt: Date
}

export type AvailableSlotRecord = {
  startAt: Date
  endAt: Date
  assigneeId: string
  assigneeName: string
}

export type AgentReservationSummary = {
  id: string
  reservationNumber: string
  serviceName: string
  assigneeName: string
  startAt: string
  endAt: string
  status: ScheduleReservationStatus
}

const mapSettings = (data: FirestoreScheduleSettings): ScheduleSettingsRecord => ({
  timezone: data.timezone,
  defaultBufferMinutes: data.defaultBufferMinutes,
  minAdvanceBookingMinutes: data.minAdvanceBookingMinutes,
  maxAdvanceBookingDays: data.maxAdvanceBookingDays,
  slotIntervalMinutes: data.slotIntervalMinutes,
  businessHours: data.businessHours,
  updatedAt: toDate(data.updatedAt),
})

const mapService = (id: string, data: FirestoreScheduleService): ScheduleServiceRecord => ({
  id,
  name: data.name,
  description: data.description ?? null,
  durationMinutes: data.durationMinutes,
  bufferBeforeMinutes: data.bufferBeforeMinutes ?? null,
  bufferAfterMinutes: data.bufferAfterMinutes ?? null,
  assigneeIds: data.assigneeIds ?? [],
  color: data.color ?? null,
  active: data.active,
  sortOrder: data.sortOrder ?? 0,
  createdAt: toDate(data.createdAt),
  updatedAt: toDate(data.updatedAt),
})

const mapProfile = (memberUid: string, data: FirestoreAgendaProfile): AgendaProfileRecord => ({
  memberUid,
  displayName: data.displayName ?? null,
  enabled: data.enabled,
  timezone: data.timezone ?? null,
  workingHours: data.workingHours ?? null,
  createdAt: toDate(data.createdAt),
  updatedAt: toDate(data.updatedAt),
})

const mapBlock = (id: string, data: FirestoreScheduleBlock): ScheduleBlockRecord => ({
  id,
  assigneeId: data.assigneeId,
  type: data.type,
  startAt: toDate(data.startAt),
  endAt: toDate(data.endAt),
  reason: data.reason ?? null,
  createdById: data.createdById,
  createdAt: toDate(data.createdAt),
  updatedAt: toDate(data.updatedAt),
})

const mapReservation = (id: string, data: FirestoreScheduleReservation): ScheduleReservationRecord => ({
  id,
  reservationNumber: data.reservationNumber,
  serviceId: data.serviceId,
  serviceName: data.serviceName,
  assigneeId: data.assigneeId,
  assigneeName: data.assigneeName,
  customerId: data.customerId ?? null,
  customerName: data.customerName ?? null,
  customerPhone: data.customerPhone ?? null,
  conversationId: data.conversationId ?? null,
  startAt: toDate(data.startAt),
  endAt: toDate(data.endAt),
  status: data.status,
  notes: data.notes ?? null,
  source: data.source,
  createdById: data.createdById,
  cancelledAt: data.cancelledAt ? toDate(data.cancelledAt) : null,
  cancellationReason: data.cancellationReason ?? null,
  createdAt: toDate(data.createdAt),
  updatedAt: toDate(data.updatedAt),
})

export const getDefaultScheduleSettings = (): Omit<ScheduleSettingsRecord, "updatedAt"> => ({
  timezone: "America/Sao_Paulo",
  defaultBufferMinutes: 15,
  minAdvanceBookingMinutes: 60,
  maxAdvanceBookingDays: 60,
  slotIntervalMinutes: 15,
  businessHours: DEFAULT_BUSINESS_HOURS(),
})

export const getScheduleSettings = async (companyId: string): Promise<ScheduleSettingsRecord> => {
  const snap = await scheduleSettingsRef(companyId).get()
  if (!snap.exists) {
    const defaults = getDefaultScheduleSettings()
    return { ...defaults, updatedAt: new Date() }
  }
  return mapSettings(snap.data() as FirestoreScheduleSettings)
}

export const updateScheduleSettings = async (
  companyId: string,
  input: Partial<Omit<ScheduleSettingsRecord, "updatedAt">>,
) => {
  const current = await getScheduleSettings(companyId)
  await scheduleSettingsRef(companyId).set(
    {
      timezone: input.timezone ?? current.timezone,
      defaultBufferMinutes: input.defaultBufferMinutes ?? current.defaultBufferMinutes,
      minAdvanceBookingMinutes: input.minAdvanceBookingMinutes ?? current.minAdvanceBookingMinutes,
      maxAdvanceBookingDays: input.maxAdvanceBookingDays ?? current.maxAdvanceBookingDays,
      slotIntervalMinutes: input.slotIntervalMinutes ?? current.slotIntervalMinutes,
      businessHours: input.businessHours ?? current.businessHours,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  )
}

export const listScheduleServices = async (companyId: string, activeOnly = false) => {
  const snap = await scheduleServicesRef(companyId).orderBy("sortOrder", "asc").get()
  const services = snap.docs.map((doc) => mapService(doc.id, doc.data() as FirestoreScheduleService))
  return activeOnly ? services.filter((service) => service.active) : services
}

export const getScheduleService = async (companyId: string, serviceId: string) => {
  const snap = await scheduleServicesRef(companyId).doc(serviceId).get()
  if (!snap.exists) return null
  return mapService(snap.id, snap.data() as FirestoreScheduleService)
}

export const upsertScheduleService = async (
  companyId: string,
  input: {
    id?: string
    name: string
    description?: string
    durationMinutes: number
    bufferBeforeMinutes?: number
    bufferAfterMinutes?: number
    assigneeIds: string[]
    color?: string
    active?: boolean
    sortOrder?: number
  },
) => {
  const ref = input.id
    ? scheduleServicesRef(companyId).doc(input.id)
    : scheduleServicesRef(companyId).doc()

  const payload = {
    name: input.name.trim(),
    description: input.description?.trim() ?? null,
    durationMinutes: input.durationMinutes,
    bufferBeforeMinutes: input.bufferBeforeMinutes ?? null,
    bufferAfterMinutes: input.bufferAfterMinutes ?? null,
    assigneeIds: input.assigneeIds,
    color: input.color ?? null,
    active: input.active ?? true,
    sortOrder: input.sortOrder ?? 0,
    updatedAt: FieldValue.serverTimestamp(),
    ...(input.id ? {} : { createdAt: FieldValue.serverTimestamp() }),
  }

  await ref.set(payload, { merge: true })
  const saved = await ref.get()
  return mapService(saved.id, saved.data() as FirestoreScheduleService)
}

export const deleteScheduleService = async (companyId: string, serviceId: string) => {
  await scheduleServicesRef(companyId).doc(serviceId).delete()
}

export const listAgendaProfiles = async (companyId: string) => {
  const snap = await agendaProfilesRef(companyId).get()
  return snap.docs.map((doc) => mapProfile(doc.id, doc.data() as FirestoreAgendaProfile))
}

export const getAgendaProfile = async (companyId: string, memberUid: string) => {
  const snap = await agendaProfilesRef(companyId).doc(memberUid).get()
  if (!snap.exists) return null
  return mapProfile(snap.id, snap.data() as FirestoreAgendaProfile)
}

export const upsertAgendaProfile = async (
  companyId: string,
  input: {
    memberUid: string
    displayName?: string
    enabled?: boolean
    timezone?: string
    workingHours?: ScheduleDayHours[]
  },
) => {
  const ref = agendaProfilesRef(companyId).doc(input.memberUid)
  const existing = await ref.get()
  await ref.set(
    {
      memberUid: input.memberUid,
      displayName: input.displayName?.trim() ?? null,
      enabled: input.enabled ?? true,
      timezone: input.timezone ?? null,
      workingHours: input.workingHours ?? null,
      updatedAt: FieldValue.serverTimestamp(),
      ...(existing.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
    },
    { merge: true },
  )
  const saved = await ref.get()
  return mapProfile(saved.id, saved.data() as FirestoreAgendaProfile)
}

const getAssigneeName = async (companyId: string, assigneeId: string, profile?: AgendaProfileRecord | null) => {
  if (profile?.displayName) return profile.displayName
  const memberSnap = await membersRef(companyId).doc(assigneeId).get()
  const email = memberSnap.data()?.email as string | undefined
  if (email) return email.split("@")[0]
  return assigneeId
}

const loadReservationsForAssignee = async (
  companyId: string,
  assigneeId: string,
  dateFrom: Date,
  dateTo: Date,
  settings: ScheduleSettingsRecord,
): Promise<ReservationInterval[]> => {
  const snap = await scheduleReservationsRef(companyId)
    .where("assigneeId", "==", assigneeId)
    .where("startAt", ">=", Timestamp.fromDate(dateFrom))
    .where("startAt", "<=", Timestamp.fromDate(dateTo))
    .get()

  const activeStatuses: ScheduleReservationStatus[] = ["pending", "confirmed"]
  const serviceCache = new Map<string, ScheduleServiceRecord | null>()

  const filtered = snap.docs
    .map((doc) => mapReservation(doc.id, doc.data() as FirestoreScheduleReservation))
    .filter((reservation) => activeStatuses.includes(reservation.status))

  return Promise.all(
    filtered.map(async (reservation) => {
      if (!serviceCache.has(reservation.serviceId)) {
        serviceCache.set(
          reservation.serviceId,
          await getScheduleService(companyId, reservation.serviceId),
        )
      }
      const svc = serviceCache.get(reservation.serviceId)
      return {
        start: reservation.startAt,
        end: reservation.endAt,
        bufferBeforeMs: (svc?.bufferBeforeMinutes ?? 0) * 60_000,
        bufferAfterMs: (svc?.bufferAfterMinutes ?? settings.defaultBufferMinutes) * 60_000,
      }
    }),
  )
}

const loadBlocksForAssignee = async (
  companyId: string,
  assigneeId: string,
  dateFrom: Date,
  dateTo: Date,
): Promise<TimeInterval[]> => {
  const snap = await scheduleBlocksRef(companyId)
    .where("assigneeId", "==", assigneeId)
    .where("startAt", ">=", Timestamp.fromDate(dateFrom))
    .where("startAt", "<=", Timestamp.fromDate(dateTo))
    .get()

  return snap.docs.map((doc) => {
    const block = mapBlock(doc.id, doc.data() as FirestoreScheduleBlock)
    return { start: block.startAt, end: block.endAt }
  })
}

export const findAvailableSlots = async (params: {
  companyId: string
  serviceId: string
  date: Date
  assigneeId?: string
}): Promise<AvailableSlotRecord[]> => {
  const [settings, service] = await Promise.all([
    getScheduleSettings(params.companyId),
    getScheduleService(params.companyId, params.serviceId),
  ])

  if (!service || !service.active) return []

  const dayStart = new Date(params.date)
  dayStart.setHours(0, 0, 0, 0)
  const dayEnd = new Date(params.date)
  dayEnd.setHours(23, 59, 59, 999)

  const assigneeIds = params.assigneeId
    ? [params.assigneeId]
    : service.assigneeIds

  const now = new Date()
  const slots: AvailableSlotRecord[] = []

  for (const assigneeId of assigneeIds) {
    const profile = await getAgendaProfile(params.companyId, assigneeId)
    if (profile && !profile.enabled) continue

    const memberSnap = await membersRef(params.companyId).doc(assigneeId).get()
    const member = memberSnap.data()
    if (!member || member.status !== "accepted") continue
    if (!(member.isOwner || member.isAdmin || Boolean(member.canManageAgenda))) continue

    const businessHours = profile?.workingHours ?? settings.businessHours

    const reservations = await loadReservationsForAssignee(
      params.companyId,
      assigneeId,
      dayStart,
      dayEnd,
      settings,
    )

    const blocks = await loadBlocksForAssignee(params.companyId, assigneeId, dayStart, dayEnd)
    const assigneeName = await getAssigneeName(params.companyId, assigneeId, profile)

    const daySlots = computeAvailableSlotsForAssignee({
      date: params.date,
      durationMinutes: service.durationMinutes,
      slotIntervalMinutes: settings.slotIntervalMinutes,
      businessHours,
      now,
      minAdvanceBookingMinutes: settings.minAdvanceBookingMinutes,
      maxAdvanceBookingDays: settings.maxAdvanceBookingDays,
      defaultBufferMinutes: settings.defaultBufferMinutes,
      reservations,
      blocks,
    })

    for (const slot of daySlots) {
      slots.push({
        startAt: slot.start,
        endAt: slot.end,
        assigneeId,
        assigneeName,
      })
    }
  }

  return slots.sort((a, b) => a.startAt.getTime() - b.startAt.getTime())
}

const isSlotStillAvailable = async (params: {
  companyId: string
  serviceId: string
  assigneeId: string
  startAt: Date
}) => {
  const date = new Date(params.startAt)
  date.setHours(0, 0, 0, 0)
  const slots = await findAvailableSlots({
    companyId: params.companyId,
    serviceId: params.serviceId,
    date,
    assigneeId: params.assigneeId,
  })
  return slots.some(
    (slot) =>
      slot.assigneeId === params.assigneeId &&
      slot.startAt.getTime() === params.startAt.getTime(),
  )
}

const allocateReservationNumber = async (companyId: string) =>
  adminDb.runTransaction(async (transaction) => {
    const counterRef = scheduleCountersRef(companyId).doc(COMPANY_SCHEDULE_COUNTER_ID)
    const counterSnap = await transaction.get(counterRef)
    const nextSequence = ((counterSnap.data()?.nextSequence as number | undefined) ?? 0) + 1
    const reservationNumber = `SCH-${String(nextSequence).padStart(5, "0")}`

    transaction.set(
      counterRef,
      {
        nextSequence,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    )

    return { reservationNumber, reservationSequence: nextSequence }
  })

export const createReservation = async (params: {
  companyId: string
  serviceId: string
  assigneeId: string
  startAt: Date
  customerId?: string
  customerName?: string
  customerPhone?: string
  conversationId?: string
  notes?: string
  source: ScheduleReservationSource
  createdById: string
  status?: ScheduleReservationStatus
}) => {
  const service = await getScheduleService(params.companyId, params.serviceId)
  if (!service || !service.active) {
    throw new Error("Service not found or inactive")
  }

  if (!service.assigneeIds.includes(params.assigneeId)) {
    throw new Error("Assignee is not eligible for this service")
  }

  const endAt = new Date(params.startAt.getTime() + service.durationMinutes * 60_000)
  const available = await isSlotStillAvailable({
    companyId: params.companyId,
    serviceId: params.serviceId,
    assigneeId: params.assigneeId,
    startAt: params.startAt,
  })

  if (!available) {
    throw new ScheduleConflictError()
  }

  const profile = await getAgendaProfile(params.companyId, params.assigneeId)
  const assigneeName = await getAssigneeName(params.companyId, params.assigneeId, profile)
  const { reservationNumber } = await allocateReservationNumber(params.companyId)

  const ref = scheduleReservationsRef(params.companyId).doc()
  const payload: FirestoreScheduleReservation = {
    reservationNumber,
    serviceId: params.serviceId,
    serviceName: service.name,
    assigneeId: params.assigneeId,
    assigneeName,
    customerId: params.customerId ?? null,
    customerName: params.customerName ?? null,
    customerPhone: params.customerPhone ?? null,
    conversationId: params.conversationId ?? null,
    startAt: Timestamp.fromDate(params.startAt),
    endAt: Timestamp.fromDate(endAt),
    status: params.status ?? "confirmed",
    notes: params.notes ?? null,
    source: params.source,
    createdById: params.createdById,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }

  await ref.set(payload)
  return mapReservation(ref.id, payload)
}

export const listReservations = async (params: {
  companyId: string
  assigneeId?: string
  status?: ScheduleReservationStatus
  dateFrom?: Date
  dateTo?: Date
  customerId?: string
  limit?: number
}) => {
  const snap = await scheduleReservationsRef(params.companyId)
    .orderBy("startAt", "desc")
    .limit(params.limit ?? 500)
    .get()

  let records = reservationsToRecords(snap)

  if (params.assigneeId) {
    records = records.filter((record) => record.assigneeId === params.assigneeId)
  }
  if (params.status) {
    records = records.filter((record) => record.status === params.status)
  }
  if (params.customerId) {
    records = records.filter((record) => record.customerId === params.customerId)
  }
  if (params.dateFrom) {
    records = records.filter((record) => record.startAt >= params.dateFrom!)
  }
  if (params.dateTo) {
    records = records.filter((record) => record.startAt <= params.dateTo!)
  }

  return records.slice(0, params.limit ?? 200)
}

const reservationsToRecords = (snap: FirebaseFirestore.QuerySnapshot) =>
  snap.docs.map((doc) => mapReservation(doc.id, doc.data() as FirestoreScheduleReservation))

export const getReservationByNumber = async (companyId: string, reservationNumber: string) => {
  const normalized = reservationNumber.trim()
  if (!normalized) return null
  const snap = await scheduleReservationsRef(companyId)
    .where("reservationNumber", "==", normalized)
    .limit(1)
    .get()
  const doc = snap.docs[0]
  if (!doc) return null
  return mapReservation(doc.id, doc.data() as FirestoreScheduleReservation)
}

export const updateReservation = async (
  companyId: string,
  reservationId: string,
  patch: {
    status?: ScheduleReservationStatus
    notes?: string
    startAt?: Date
    assigneeId?: string
  },
) => {
  const ref = scheduleReservationsRef(companyId).doc(reservationId)
  const snap = await ref.get()
  if (!snap.exists) throw new Error("Reservation not found")

  const current = mapReservation(snap.id, snap.data() as FirestoreScheduleReservation)
  const update: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() }

  if (patch.status) update.status = patch.status
  if (patch.notes !== undefined) update.notes = patch.notes?.trim() ?? null

  if (patch.startAt && patch.assigneeId) {
    const service = await getScheduleService(companyId, current.serviceId)
    if (!service) throw new Error("Service not found")

    const available = await isSlotStillAvailable({
      companyId,
      serviceId: current.serviceId,
      assigneeId: patch.assigneeId,
      startAt: patch.startAt,
    })
    if (!available) throw new ScheduleConflictError()

    const profile = await getAgendaProfile(companyId, patch.assigneeId)
    update.startAt = Timestamp.fromDate(patch.startAt)
    update.endAt = Timestamp.fromDate(
      new Date(patch.startAt.getTime() + service.durationMinutes * 60_000),
    )
    update.assigneeId = patch.assigneeId
    update.assigneeName = await getAssigneeName(companyId, patch.assigneeId, profile)
  }

  await ref.update(update)
  const saved = await ref.get()
  return mapReservation(saved.id, saved.data() as FirestoreScheduleReservation)
}

export const cancelReservation = async (
  companyId: string,
  reservationId: string,
  reason?: string,
) => {
  const ref = scheduleReservationsRef(companyId).doc(reservationId)
  const snap = await ref.get()
  if (!snap.exists) throw new Error("Reservation not found")

  await ref.update({
    status: "cancelled",
    cancelledAt: FieldValue.serverTimestamp(),
    cancellationReason: reason?.trim() ?? null,
    updatedAt: FieldValue.serverTimestamp(),
  })

  const saved = await ref.get()
  return mapReservation(saved.id, saved.data() as FirestoreScheduleReservation)
}

export const listScheduleBlocks = async (params: {
  companyId: string
  assigneeId?: string
  dateFrom?: Date
  dateTo?: Date
}) => {
  let query = scheduleBlocksRef(params.companyId).orderBy("startAt", "asc") as FirebaseFirestore.Query
  if (params.assigneeId) {
    query = query.where("assigneeId", "==", params.assigneeId)
  }
  if (params.dateFrom) {
    query = query.where("startAt", ">=", Timestamp.fromDate(params.dateFrom))
  }
  if (params.dateTo) {
    query = query.where("startAt", "<=", Timestamp.fromDate(params.dateTo))
  }
  const snap = await query.get()
  return snap.docs.map((doc) => mapBlock(doc.id, doc.data() as FirestoreScheduleBlock))
}

export const createScheduleBlock = async (params: {
  companyId: string
  assigneeId: string
  type: FirestoreScheduleBlock["type"]
  startAt: Date
  endAt: Date
  reason?: string
  createdById: string
}) => {
  if (params.endAt <= params.startAt) {
    throw new Error("End time must be after start time")
  }

  const ref = scheduleBlocksRef(params.companyId).doc()
  const payload: FirestoreScheduleBlock = {
    assigneeId: params.assigneeId,
    type: params.type,
    startAt: Timestamp.fromDate(params.startAt),
    endAt: Timestamp.fromDate(params.endAt),
    reason: params.reason?.trim() ?? null,
    createdById: params.createdById,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }
  await ref.set(payload)
  return mapBlock(ref.id, payload)
}

export const deleteScheduleBlock = async (companyId: string, blockId: string) => {
  await scheduleBlocksRef(companyId).doc(blockId).delete()
}

export const searchServicesForAgent = async (params: {
  companyId: string
  query?: string
}) => {
  const services = await listScheduleServices(params.companyId, true)
  const normalized = params.query?.trim().toLowerCase()
  if (!normalized) return services
  return services.filter((service) => service.name.toLowerCase().includes(normalized))
}

export const listReservationsForAgent = async (params: {
  companyId: string
  customerId?: string
  conversationId?: string
  dateFrom?: Date
  dateTo?: Date
  limit?: number
}): Promise<AgentReservationSummary[]> => {
  let query = scheduleReservationsRef(params.companyId).orderBy("startAt", "desc") as FirebaseFirestore.Query

  if (params.customerId) {
    query = query.where("customerId", "==", params.customerId)
  }

  const snap = await query.limit(params.limit ?? 20).get()
  let records = reservationsToRecords(snap)

  if (params.conversationId) {
    records = records.filter(
      (record) => record.conversationId === params.conversationId || record.customerId === params.customerId,
    )
  }

  if (params.dateFrom) {
    records = records.filter((record) => record.startAt >= params.dateFrom!)
  }
  if (params.dateTo) {
    records = records.filter((record) => record.startAt <= params.dateTo!)
  }

  return records.map((record) => ({
    id: record.id,
    reservationNumber: record.reservationNumber,
    serviceName: record.serviceName,
    assigneeName: record.assigneeName,
    startAt: record.startAt.toISOString(),
    endAt: record.endAt.toISOString(),
    status: record.status,
  }))
}

export const cancelReservationForAgent = async (params: {
  companyId: string
  reservationNumber?: string
  reservationId?: string
  customerId?: string
  conversationId?: string
  reason?: string
}) => {
  let reservation: ScheduleReservationRecord | null = null

  if (params.reservationNumber) {
    reservation = await getReservationByNumber(params.companyId, params.reservationNumber)
  } else if (params.reservationId) {
    const snap = await scheduleReservationsRef(params.companyId).doc(params.reservationId).get()
    if (snap.exists) {
      reservation = mapReservation(snap.id, snap.data() as FirestoreScheduleReservation)
    }
  }

  if (!reservation) {
    throw new Error("Reservation not found")
  }

  if (reservation.status === "cancelled") {
    return reservation
  }

  if (params.customerId && reservation.customerId && reservation.customerId !== params.customerId) {
    throw new Error("Not authorized to cancel this reservation")
  }

  if (
    params.conversationId &&
    reservation.conversationId &&
    reservation.conversationId !== params.conversationId
  ) {
    throw new Error("Not authorized to cancel this reservation")
  }

  return cancelReservation(params.companyId, reservation.id, params.reason)
}
