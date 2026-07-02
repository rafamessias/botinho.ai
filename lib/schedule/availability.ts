import type { ScheduleDayHours } from "@/lib/types/schedule"

export type TimeInterval = {
  start: Date
  end: Date
}

export type ReservationInterval = TimeInterval & {
  bufferBeforeMs: number
  bufferAfterMs: number
}

export const DEFAULT_BUSINESS_HOURS = (): ScheduleDayHours[] => [
  { day: 0, enabled: false, start: "09:00", end: "18:00" },
  { day: 1, enabled: true, start: "09:00", end: "18:00" },
  { day: 2, enabled: true, start: "09:00", end: "18:00" },
  { day: 3, enabled: true, start: "09:00", end: "18:00" },
  { day: 4, enabled: true, start: "09:00", end: "18:00" },
  { day: 5, enabled: true, start: "09:00", end: "18:00" },
  { day: 6, enabled: false, start: "09:00", end: "18:00" },
]

export const parseTimeOnDate = (date: Date, time: string): Date => {
  const [hours, minutes] = time.split(":").map(Number)
  const result = new Date(date)
  result.setHours(hours, minutes, 0, 0)
  return result
}

export const intervalsOverlap = (a: TimeInterval, b: TimeInterval): boolean =>
  a.start < b.end && b.start < a.end

export const reservationBlocksSlot = (
  reservation: ReservationInterval,
  slot: TimeInterval,
  defaultBufferMinutes: number,
): boolean => {
  const blockedStart = new Date(
    reservation.start.getTime() - reservation.bufferBeforeMs,
  )
  const blockedEnd = new Date(
    reservation.end.getTime() +
      Math.max(reservation.bufferAfterMs, defaultBufferMinutes * 60_000),
  )
  return intervalsOverlap({ start: blockedStart, end: blockedEnd }, slot)
}

export const getDayHoursForDate = (
  date: Date,
  businessHours: ScheduleDayHours[],
): ScheduleDayHours | undefined => {
  const day = date.getDay()
  return businessHours.find((entry) => entry.day === day)
}

export const generateDaySlots = (params: {
  date: Date
  durationMinutes: number
  slotIntervalMinutes: number
  businessHours: ScheduleDayHours[]
  now: Date
  minAdvanceBookingMinutes: number
  maxAdvanceBookingDays: number
}): TimeInterval[] => {
  const dayConfig = getDayHoursForDate(params.date, params.businessHours)
  if (!dayConfig?.enabled) return []

  const dayStart = parseTimeOnDate(params.date, dayConfig.start)
  const dayEnd = parseTimeOnDate(params.date, dayConfig.end)
  const durationMs = params.durationMinutes * 60_000
  const intervalMs = params.slotIntervalMinutes * 60_000
  const minStart = new Date(params.now.getTime() + params.minAdvanceBookingMinutes * 60_000)
  const maxStart = new Date(params.now.getTime() + params.maxAdvanceBookingDays * 24 * 60 * 60_000)

  const slots: TimeInterval[] = []
  for (let cursor = dayStart.getTime(); cursor + durationMs <= dayEnd.getTime(); cursor += intervalMs) {
    const start = new Date(cursor)
    const end = new Date(cursor + durationMs)
    if (start < minStart) continue
    if (start > maxStart) continue
    slots.push({ start, end })
  }
  return slots
}

export const filterAvailableSlots = (params: {
  candidateSlots: TimeInterval[]
  reservations: ReservationInterval[]
  blocks: TimeInterval[]
  defaultBufferMinutes: number
}): TimeInterval[] =>
  params.candidateSlots.filter((slot) => {
    const blockedByReservation = params.reservations.some((reservation) =>
      reservationBlocksSlot(reservation, slot, params.defaultBufferMinutes),
    )
    if (blockedByReservation) return false
    return !params.blocks.some((block) => intervalsOverlap(block, slot))
  })

export const computeAvailableSlotsForAssignee = (params: {
  date: Date
  durationMinutes: number
  slotIntervalMinutes: number
  businessHours: ScheduleDayHours[]
  now: Date
  minAdvanceBookingMinutes: number
  maxAdvanceBookingDays: number
  defaultBufferMinutes: number
  reservations: ReservationInterval[]
  blocks: TimeInterval[]
}): TimeInterval[] => {
  const candidates = generateDaySlots({
    date: params.date,
    durationMinutes: params.durationMinutes,
    slotIntervalMinutes: params.slotIntervalMinutes,
    businessHours: params.businessHours,
    now: params.now,
    minAdvanceBookingMinutes: params.minAdvanceBookingMinutes,
    maxAdvanceBookingDays: params.maxAdvanceBookingDays,
  })

  return filterAvailableSlots({
    candidateSlots: candidates,
    reservations: params.reservations,
    blocks: params.blocks,
    defaultBufferMinutes: params.defaultBufferMinutes,
  })
}
