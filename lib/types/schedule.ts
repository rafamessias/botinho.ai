export type ScheduleBlockType = "blocked" | "break" | "unavailable"

export type ScheduleReservationStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show"

export type ScheduleReservationSource = "bot" | "manual"

export type ScheduleDayHours = {
  day: number
  enabled: boolean
  start: string
  end: string
}

export type ScheduleSettings = {
  timezone: string
  defaultBufferMinutes: number
  minAdvanceBookingMinutes: number
  maxAdvanceBookingDays: number
  slotIntervalMinutes: number
  businessHours: ScheduleDayHours[]
  updatedAt: string
}

export type ScheduleService = {
  id: string
  name: string
  description?: string
  durationMinutes: number
  bufferBeforeMinutes?: number
  bufferAfterMinutes?: number
  assigneeIds: string[]
  color?: string
  active: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export type AgendaProfile = {
  memberUid: string
  displayName?: string
  enabled: boolean
  timezone?: string
  workingHours?: ScheduleDayHours[]
  createdAt: string
  updatedAt: string
}

export type ScheduleBlock = {
  id: string
  assigneeId: string
  type: ScheduleBlockType
  startAt: string
  endAt: string
  reason?: string
  createdById: string
  createdAt: string
  updatedAt: string
}

export type ScheduleReservation = {
  id: string
  reservationNumber: string
  serviceId: string
  serviceName: string
  assigneeId: string
  assigneeName: string
  customerId?: string
  customerName?: string
  customerPhone?: string
  conversationId?: string
  startAt: string
  endAt: string
  status: ScheduleReservationStatus
  notes?: string
  source: ScheduleReservationSource
  createdById: string
  cancelledAt?: string
  cancellationReason?: string
  createdAt: string
  updatedAt: string
}

export type AvailableSlot = {
  startAt: string
  endAt: string
  assigneeId: string
  assigneeName: string
}
