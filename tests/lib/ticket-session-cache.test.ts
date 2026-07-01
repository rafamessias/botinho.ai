import assert from "node:assert/strict"
import test from "node:test"
import {
  resolveTicketsBootstrap,
  ticketSessionCache,
} from "../../lib/tickets/ticket-session-cache"
import { DEFAULT_TICKET_STATUS_FILTERS } from "../../lib/tickets/ticket-status-filters"

const sampleTicket = {
  id: "ticket-1",
  ticketNumber: "TKT-001",
  ticketSequence: 1,
  ticketScopeCode: "default",
  title: "Printer issue",
  description: "Printer is offline",
  type: "support" as const,
  status: "open" as const,
  priority: "medium" as const,
  createdById: "user-1",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
}

test("resolveTicketsBootstrap returns empty when no company or cache", () => {
  ticketSessionCache.clear()

  assert.deepEqual(resolveTicketsBootstrap(null), {
    source: "empty",
    snapshot: null,
  })
  assert.deepEqual(resolveTicketsBootstrap("company-1"), {
    source: "empty",
    snapshot: null,
  })
})

test("session cache persists and restores tickets snapshot", () => {
  ticketSessionCache.clear()

  ticketSessionCache.save({
    companyId: "company-1",
    tickets: [sampleTicket],
    selectedTicketId: "ticket-1",
    searchQuery: "printer",
    statusFilters: DEFAULT_TICKET_STATUS_FILTERS,
    typeFilter: "support",
    showDesktopList: false,
  })

  const bootstrap = resolveTicketsBootstrap("company-1")
  assert.equal(bootstrap.source, "session")
  assert.equal(bootstrap.snapshot?.selectedTicketId, "ticket-1")
  assert.equal(bootstrap.snapshot?.searchQuery, "printer")
  assert.equal(bootstrap.snapshot?.showDesktopList, false)
  assert.deepEqual(bootstrap.snapshot?.statusFilters, DEFAULT_TICKET_STATUS_FILTERS)
  assert.equal(ticketSessionCache.isFresh("company-1"), true)
})

test("session cache clears per company", () => {
  ticketSessionCache.clear()

  ticketSessionCache.save({
    companyId: "company-1",
    tickets: [],
    selectedTicketId: null,
    searchQuery: "",
    statusFilters: DEFAULT_TICKET_STATUS_FILTERS,
    typeFilter: "all",
    showDesktopList: true,
  })

  ticketSessionCache.save({
    companyId: "company-2",
    tickets: [sampleTicket],
    selectedTicketId: "ticket-1",
    searchQuery: "",
    statusFilters: DEFAULT_TICKET_STATUS_FILTERS,
    typeFilter: "all",
    showDesktopList: true,
  })

  ticketSessionCache.clear("company-1")
  assert.equal(ticketSessionCache.getSnapshot("company-1"), null)
  assert.equal(ticketSessionCache.getSnapshot("company-2")?.tickets.length, 1)
})
