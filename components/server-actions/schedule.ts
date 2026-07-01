"use server"

import type {
  AgendaProfile,
  AvailableSlot,
  ScheduleBlock,
  ScheduleReservation,
  ScheduleService,
  ScheduleSettings,
} from "@/lib/types/schedule"
import { BaseActionResponse, handleAction, resolveCompanyContext } from "./utils"
import {
  cancelReservation,
  createReservation,
  createScheduleBlock,
  deleteScheduleBlock,
  deleteScheduleService,
  findAvailableSlots,
  getScheduleSettings,
  listAgendaProfiles,
  listReservations,
  listScheduleBlocks,
  listScheduleServices,
  ScheduleConflictError,
  updateReservation,
  updateScheduleSettings,
  upsertAgendaProfile,
  upsertScheduleService,
  type AgendaProfileRecord,
  type ScheduleBlockRecord,
  type ScheduleReservationRecord,
  type ScheduleServiceRecord,
  type ScheduleSettingsRecord,
} from "@/lib/firebase/services/schedule-service"
import { getUserProfile } from "@/lib/firebase/services/user-service"

const mapSettings = (record: ScheduleSettingsRecord): ScheduleSettings => ({
  timezone: record.timezone,
  defaultBufferMinutes: record.defaultBufferMinutes,
  minAdvanceBookingMinutes: record.minAdvanceBookingMinutes,
  maxAdvanceBookingDays: record.maxAdvanceBookingDays,
  slotIntervalMinutes: record.slotIntervalMinutes,
  businessHours: record.businessHours,
  updatedAt: record.updatedAt.toISOString(),
})

const mapService = (record: ScheduleServiceRecord): ScheduleService => ({
  id: record.id,
  name: record.name,
  description: record.description ?? undefined,
  durationMinutes: record.durationMinutes,
  bufferBeforeMinutes: record.bufferBeforeMinutes ?? undefined,
  bufferAfterMinutes: record.bufferAfterMinutes ?? undefined,
  assigneeIds: record.assigneeIds,
  color: record.color ?? undefined,
  active: record.active,
  sortOrder: record.sortOrder,
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
})

const mapProfile = (record: AgendaProfileRecord): AgendaProfile => ({
  memberUid: record.memberUid,
  displayName: record.displayName ?? undefined,
  enabled: record.enabled,
  timezone: record.timezone ?? undefined,
  workingHours: record.workingHours ?? undefined,
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
})

const mapBlock = (record: ScheduleBlockRecord): ScheduleBlock => ({
  id: record.id,
  assigneeId: record.assigneeId,
  type: record.type,
  startAt: record.startAt.toISOString(),
  endAt: record.endAt.toISOString(),
  reason: record.reason ?? undefined,
  createdById: record.createdById,
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
})

const mapReservation = (record: ScheduleReservationRecord): ScheduleReservation => ({
  id: record.id,
  reservationNumber: record.reservationNumber,
  serviceId: record.serviceId,
  serviceName: record.serviceName,
  assigneeId: record.assigneeId,
  assigneeName: record.assigneeName,
  customerId: record.customerId ?? undefined,
  customerName: record.customerName ?? undefined,
  customerPhone: record.customerPhone ?? undefined,
  conversationId: record.conversationId ?? undefined,
  startAt: record.startAt.toISOString(),
  endAt: record.endAt.toISOString(),
  status: record.status,
  notes: record.notes ?? undefined,
  source: record.source,
  createdById: record.createdById,
  cancelledAt: record.cancelledAt?.toISOString(),
  cancellationReason: record.cancellationReason ?? undefined,
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
})

const resolveAgendaContext = () => resolveCompanyContext({ requireCanManageAgenda: true })

const resolveAdminContext = () => resolveCompanyContext({ requireAdmin: true })

const canManageAssignee = (
  membership: Awaited<ReturnType<typeof resolveAgendaContext>>["membership"],
  assigneeId: string,
  userId: string,
) => membership.isAdmin || membership.isOwner || assigneeId === userId

export const listReservationsAction = async (payload?: {
  assigneeId?: string
  status?: ScheduleReservation["status"]
  dateFrom?: string
  dateTo?: string
}): Promise<BaseActionResponse<{ reservations: ScheduleReservation[] }>> =>
  handleAction(async () => {
    const { companyId, userId, membership } = await resolveAgendaContext()

    const records = await listReservations({
      companyId,
      assigneeId:
        membership.isAdmin || membership.isOwner ? payload?.assigneeId : userId,
      status: payload?.status,
      dateFrom: payload?.dateFrom ? new Date(payload.dateFrom) : undefined,
      dateTo: payload?.dateTo ? new Date(payload.dateTo) : undefined,
    })

    return { success: true, data: { reservations: records.map(mapReservation) } }
  })

export const createReservationAction = async (payload: {
  serviceId: string
  assigneeId: string
  startAt: string
  customerId?: string
  customerName?: string
  customerPhone?: string
  notes?: string
}): Promise<BaseActionResponse<{ reservation: ScheduleReservation }>> =>
  handleAction(async () => {
    const { companyId, userId, membership } = await resolveAgendaContext()

    if (!canManageAssignee(membership, payload.assigneeId, userId)) {
      throw new Error("Not authorized to book for this assignee")
    }

    try {
      const record = await createReservation({
        companyId,
        serviceId: payload.serviceId,
        assigneeId: payload.assigneeId,
        startAt: new Date(payload.startAt),
        customerId: payload.customerId,
        customerName: payload.customerName,
        customerPhone: payload.customerPhone,
        notes: payload.notes,
        source: "manual",
        createdById: userId,
      })
      return { success: true, data: { reservation: mapReservation(record) } }
    } catch (error) {
      if (error instanceof ScheduleConflictError) {
        throw new Error("SLOT_UNAVAILABLE")
      }
      throw error
    }
  })

export const updateReservationAction = async (payload: {
  reservationId: string
  status?: ScheduleReservation["status"]
  notes?: string
}): Promise<BaseActionResponse<{ reservation: ScheduleReservation }>> =>
  handleAction(async () => {
    const { companyId } = await resolveAgendaContext()
    const record = await updateReservation(companyId, payload.reservationId, {
      status: payload.status,
      notes: payload.notes,
    })
    return { success: true, data: { reservation: mapReservation(record) } }
  })

export const cancelReservationAction = async (payload: {
  reservationId: string
  reason?: string
}): Promise<BaseActionResponse<{ reservation: ScheduleReservation }>> =>
  handleAction(async () => {
    const { companyId } = await resolveAgendaContext()
    const record = await cancelReservation(companyId, payload.reservationId, payload.reason)
    return { success: true, data: { reservation: mapReservation(record) } }
  })

export const listAvailableSlotsAction = async (payload: {
  serviceId: string
  date: string
  assigneeId?: string
}): Promise<BaseActionResponse<{ slots: AvailableSlot[] }>> =>
  handleAction(async () => {
    const { companyId } = await resolveAgendaContext()
    const slots = await findAvailableSlots({
      companyId,
      serviceId: payload.serviceId,
      date: new Date(payload.date),
      assigneeId: payload.assigneeId,
    })
    return {
      success: true,
      data: {
        slots: slots.map((slot) => ({
          startAt: slot.startAt.toISOString(),
          endAt: slot.endAt.toISOString(),
          assigneeId: slot.assigneeId,
          assigneeName: slot.assigneeName,
        })),
      },
    }
  })

export const createScheduleBlockAction = async (payload: {
  assigneeId: string
  type: ScheduleBlock["type"]
  startAt: string
  endAt: string
  reason?: string
}): Promise<BaseActionResponse<{ block: ScheduleBlock }>> =>
  handleAction(async () => {
    const { companyId, userId, membership } = await resolveAgendaContext()
    if (!canManageAssignee(membership, payload.assigneeId, userId)) {
      throw new Error("Not authorized to block time for this assignee")
    }
    const record = await createScheduleBlock({
      companyId,
      assigneeId: payload.assigneeId,
      type: payload.type,
      startAt: new Date(payload.startAt),
      endAt: new Date(payload.endAt),
      reason: payload.reason,
      createdById: userId,
    })
    return { success: true, data: { block: mapBlock(record) } }
  })

export const deleteScheduleBlockAction = async (payload: {
  blockId: string
}): Promise<BaseActionResponse<{ deleted: boolean }>> =>
  handleAction(async () => {
    const { companyId } = await resolveAgendaContext()
    await deleteScheduleBlock(companyId, payload.blockId)
    return { success: true, data: { deleted: true } }
  })

export const listScheduleBlocksAction = async (payload?: {
  assigneeId?: string
  dateFrom?: string
  dateTo?: string
}): Promise<BaseActionResponse<{ blocks: ScheduleBlock[] }>> =>
  handleAction(async () => {
    const { companyId, userId, membership } = await resolveAgendaContext()
    const records = await listScheduleBlocks({
      companyId,
      assigneeId:
        membership.isAdmin || membership.isOwner ? payload?.assigneeId : userId,
      dateFrom: payload?.dateFrom ? new Date(payload.dateFrom) : undefined,
      dateTo: payload?.dateTo ? new Date(payload.dateTo) : undefined,
    })
    return { success: true, data: { blocks: records.map(mapBlock) } }
  })

export const listScheduleServicesAction = async (): Promise<
  BaseActionResponse<{ services: ScheduleService[] }>
> =>
  handleAction(async () => {
    const { companyId } = await resolveAgendaContext()
    const records = await listScheduleServices(companyId)
    return { success: true, data: { services: records.map(mapService) } }
  })

export const upsertScheduleServiceAction = async (payload: {
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
}): Promise<BaseActionResponse<{ service: ScheduleService }>> =>
  handleAction(async () => {
    const { companyId } = await resolveAdminContext()
    const record = await upsertScheduleService(companyId, payload)
    return { success: true, data: { service: mapService(record) } }
  })

export const deleteScheduleServiceAction = async (payload: {
  serviceId: string
}): Promise<BaseActionResponse<{ deleted: boolean }>> =>
  handleAction(async () => {
    const { companyId } = await resolveAdminContext()
    await deleteScheduleService(companyId, payload.serviceId)
    return { success: true, data: { deleted: true } }
  })

export const getScheduleSettingsAction = async (): Promise<
  BaseActionResponse<{ settings: ScheduleSettings }>
> =>
  handleAction(async () => {
    const { companyId } = await resolveAgendaContext()
    const record = await getScheduleSettings(companyId)
    return { success: true, data: { settings: mapSettings(record) } }
  })

export const updateScheduleSettingsAction = async (payload: {
  timezone?: string
  defaultBufferMinutes?: number
  minAdvanceBookingMinutes?: number
  maxAdvanceBookingDays?: number
  slotIntervalMinutes?: number
  businessHours?: ScheduleSettings["businessHours"]
}): Promise<BaseActionResponse<{ settings: ScheduleSettings }>> =>
  handleAction(async () => {
    const { companyId } = await resolveAdminContext()
    await updateScheduleSettings(companyId, payload)
    const record = await getScheduleSettings(companyId)
    return { success: true, data: { settings: mapSettings(record) } }
  })

export const listAgendaProfilesAction = async (): Promise<
  BaseActionResponse<{ profiles: AgendaProfile[] }>
> =>
  handleAction(async () => {
    const { companyId } = await resolveAgendaContext()
    const records = await listAgendaProfiles(companyId)
    return { success: true, data: { profiles: records.map(mapProfile) } }
  })

export const upsertAgendaProfileAction = async (payload: {
  memberUid: string
  displayName?: string
  enabled?: boolean
  timezone?: string
  workingHours?: AgendaProfile["workingHours"]
}): Promise<BaseActionResponse<{ profile: AgendaProfile }>> =>
  handleAction(async () => {
    const { companyId, userId, membership } = await resolveAgendaContext()
    if (!membership.isAdmin && !membership.isOwner && payload.memberUid !== userId) {
      throw new Error("Not authorized to update this agenda profile")
    }
    const record = await upsertAgendaProfile(companyId, payload)
    return { success: true, data: { profile: mapProfile(record) } }
  })
