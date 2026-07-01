import type { TicketStatus } from "@/lib/types/ticket"

export const ALL_TICKET_STATUSES = [
  "open",
  "in_progress",
  "waiting",
  "resolved",
  "closed",
] as const satisfies readonly TicketStatus[]

export const DEFAULT_TICKET_STATUS_FILTERS: TicketStatus[] = [
  "open",
  "in_progress",
  "waiting",
]

export const areTicketStatusFiltersEqual = (left: TicketStatus[], right: TicketStatus[]) => {
  if (left.length !== right.length) {
    return false
  }

  const leftSet = new Set(left)
  return right.every((status) => leftSet.has(status))
}

export const ticketMatchesStatusFilters = (
  status: TicketStatus,
  statusFilters: TicketStatus[],
) => {
  if (statusFilters.length === 0) {
    return true
  }

  return statusFilters.includes(status)
}
