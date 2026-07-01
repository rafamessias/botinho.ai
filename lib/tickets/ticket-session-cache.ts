import type { TicketTypeFilter } from "@/components/tickets/ticket-list-panel"
import { TicketDetailCache } from "@/lib/tickets/ticket-detail-cache"
import { DEFAULT_TICKET_STATUS_FILTERS } from "@/lib/tickets/ticket-status-filters"
import type { Ticket, TicketStatus } from "@/lib/types/ticket"

export type TicketSessionSnapshot = {
  companyId: string
  tickets: Ticket[]
  selectedTicketId: string | null
  searchQuery: string
  statusFilters: TicketStatus[]
  typeFilter: TicketTypeFilter
  showDesktopList: boolean
  updatedAt: number
}

export const TICKET_SESSION_STALE_MS = 5 * 60_000

const cloneSnapshot = (snapshot: TicketSessionSnapshot): TicketSessionSnapshot => ({
  ...snapshot,
  tickets: snapshot.tickets.map((ticket) => ({ ...ticket })),
})

class TicketSessionCacheStore {
  private snapshot: TicketSessionSnapshot | null = null
  readonly detailCache = new TicketDetailCache()

  getSnapshot(companyId: string): TicketSessionSnapshot | null {
    if (this.snapshot?.companyId !== companyId) {
      return null
    }

    return cloneSnapshot(this.snapshot)
  }

  isFresh(companyId: string, maxAgeMs = TICKET_SESSION_STALE_MS): boolean {
    if (this.snapshot?.companyId !== companyId) {
      return false
    }

    return Date.now() - this.snapshot.updatedAt < maxAgeMs
  }

  save(snapshot: Omit<TicketSessionSnapshot, "updatedAt">) {
    this.snapshot = {
      ...snapshot,
      tickets: snapshot.tickets.map((ticket) => ({ ...ticket })),
      updatedAt: Date.now(),
    }
  }

  seedFromInitialData(
    companyId: string,
    data: {
      tickets: Ticket[]
      selectedTicketId?: string | null
      searchQuery?: string
      statusFilters?: TicketStatus[]
      typeFilter?: TicketTypeFilter
      showDesktopList?: boolean
    },
  ) {
    this.save({
      companyId,
      tickets: data.tickets,
      selectedTicketId: data.selectedTicketId ?? null,
      searchQuery: data.searchQuery ?? "",
      statusFilters: data.statusFilters ?? DEFAULT_TICKET_STATUS_FILTERS,
      typeFilter: data.typeFilter ?? "all",
      showDesktopList: data.showDesktopList ?? true,
    })
  }

  clear(companyId?: string) {
    if (companyId && this.snapshot?.companyId !== companyId) {
      return
    }

    this.snapshot = null
    this.detailCache.clear()
  }
}

export const ticketSessionCache = new TicketSessionCacheStore()

export const resolveTicketsBootstrap = (
  companyId: string | null,
): {
  source: "session" | "empty"
  snapshot: TicketSessionSnapshot | null
} => {
  if (!companyId) {
    return { source: "empty", snapshot: null }
  }

  const normalizedCompanyId = String(companyId)
  const sessionSnapshot = ticketSessionCache.getSnapshot(normalizedCompanyId)
  if (sessionSnapshot) {
    return { source: "session", snapshot: sessionSnapshot }
  }

  return { source: "empty", snapshot: null }
}
