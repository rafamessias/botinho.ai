import type { TicketActivity, TicketComment } from "@/lib/types/ticket"

export type TicketDetailCacheEntry = {
  comments: TicketComment[]
  activities: TicketActivity[]
  ticketUpdatedAtKey: number
}

const toUpdatedAtKey = (value?: string | Date | null) => {
  if (!value) {
    return 0
  }

  const date = typeof value === "string" ? new Date(value) : value
  const time = date.getTime()
  return Number.isNaN(time) ? 0 : time
}

export class TicketDetailCache {
  private entries = new Map<string, TicketDetailCacheEntry>()

  get(ticketId: string) {
    return this.entries.get(ticketId)
  }

  set(ticketId: string, entry: TicketDetailCacheEntry) {
    this.entries.set(ticketId, {
      comments: [...entry.comments],
      activities: [...entry.activities],
      ticketUpdatedAtKey: entry.ticketUpdatedAtKey,
    })
  }

  delete(ticketId: string) {
    this.entries.delete(ticketId)
  }

  clear() {
    this.entries.clear()
  }

  isFresh(ticketId: string, ticketUpdatedAt?: string | Date | null) {
    const cached = this.entries.get(ticketId)
    if (!cached) {
      return false
    }

    return cached.ticketUpdatedAtKey === toUpdatedAtKey(ticketUpdatedAt)
  }

  getComments(ticketId: string) {
    return this.entries.get(ticketId)?.comments ?? null
  }

  getActivities(ticketId: string) {
    return this.entries.get(ticketId)?.activities ?? null
  }

  setComments(
    ticketId: string,
    comments: TicketComment[],
    ticketUpdatedAt?: string | Date | null,
  ) {
    const existing = this.entries.get(ticketId)
    this.entries.set(ticketId, {
      comments: [...comments],
      activities: existing?.activities ?? [],
      ticketUpdatedAtKey: toUpdatedAtKey(ticketUpdatedAt) || existing?.ticketUpdatedAtKey || 0,
    })
  }

  setActivities(
    ticketId: string,
    activities: TicketActivity[],
    ticketUpdatedAt?: string | Date | null,
  ) {
    const existing = this.entries.get(ticketId)
    this.entries.set(ticketId, {
      comments: existing?.comments ?? [],
      activities: [...activities],
      ticketUpdatedAtKey: toUpdatedAtKey(ticketUpdatedAt) || existing?.ticketUpdatedAtKey || 0,
    })
  }

  appendComment(ticketId: string, comment: TicketComment) {
    const existing = this.entries.get(ticketId)
    const comments = [...(existing?.comments ?? []), comment]
    this.entries.set(ticketId, {
      comments,
      activities: [],
      ticketUpdatedAtKey: Math.max(existing?.ticketUpdatedAtKey ?? 0, Date.now()),
    })
  }

  createEntry(
    comments: TicketComment[],
    activities: TicketActivity[],
    ticketUpdatedAt?: string | Date | null,
  ): TicketDetailCacheEntry {
    return {
      comments: [...comments],
      activities: [...activities],
      ticketUpdatedAtKey: toUpdatedAtKey(ticketUpdatedAt),
    }
  }
}
