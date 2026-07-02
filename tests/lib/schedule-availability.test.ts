import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  DEFAULT_BUSINESS_HOURS,
  filterAvailableSlots,
  generateDaySlots,
  intervalsOverlap,
  reservationBlocksSlot,
} from "@/lib/schedule/availability"

describe("schedule availability", () => {
  it("detects overlapping intervals", () => {
    const a = { start: new Date("2026-07-02T10:00:00"), end: new Date("2026-07-02T11:00:00") }
    const b = { start: new Date("2026-07-02T10:30:00"), end: new Date("2026-07-02T11:30:00") }
    assert.equal(intervalsOverlap(a, b), true)
  })

  it("applies reservation buffers when checking slot conflicts", () => {
    const reservation = {
      start: new Date("2026-07-02T10:00:00"),
      end: new Date("2026-07-02T10:30:00"),
      bufferBeforeMs: 0,
      bufferAfterMs: 15 * 60_000,
    }
    const slot = {
      start: new Date("2026-07-02T10:35:00"),
      end: new Date("2026-07-02T11:05:00"),
    }
    assert.equal(reservationBlocksSlot(reservation, slot, 15), true)
  })

  it("generates slots within business hours", () => {
    const date = new Date("2026-07-02T00:00:00")
    const now = new Date("2026-07-01T08:00:00")
    const slots = generateDaySlots({
      date,
      durationMinutes: 30,
      slotIntervalMinutes: 30,
      businessHours: DEFAULT_BUSINESS_HOURS(),
      now,
      minAdvanceBookingMinutes: 60,
      maxAdvanceBookingDays: 30,
    })
    assert.ok(slots.length > 0)
    assert.equal(slots[0]?.start.getHours(), 9)
  })

  it("filters blocked slots and reservations", () => {
    const candidates = [
      { start: new Date("2026-07-02T10:00:00"), end: new Date("2026-07-02T10:30:00") },
      { start: new Date("2026-07-02T11:00:00"), end: new Date("2026-07-02T11:30:00") },
    ]
    const reservations = [
      {
        start: new Date("2026-07-02T10:00:00"),
        end: new Date("2026-07-02T10:30:00"),
        bufferBeforeMs: 0,
        bufferAfterMs: 0,
      },
    ]
    const blocks = [{ start: new Date("2026-07-02T11:00:00"), end: new Date("2026-07-02T11:30:00") }]
    const available = filterAvailableSlots({
      candidateSlots: candidates,
      reservations,
      blocks,
      defaultBufferMinutes: 15,
    })
    assert.equal(available.length, 0)
  })
})
