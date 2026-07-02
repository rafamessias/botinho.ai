export const TICKETS_DEFAULT_PAGE_SIZE = 20
export const TICKETS_MAX_PAGE_SIZE = 50
export const TICKETS_SEARCH_SCAN_BATCH = 50
export const TICKETS_MAX_SEARCH_SCAN_BATCHES = 10

export type TicketListCursor = {
  updatedAt: string
  id: string
}

export const encodeTicketListCursor = (cursor: TicketListCursor): string =>
  Buffer.from(JSON.stringify(cursor)).toString("base64url")

export const decodeTicketListCursor = (value: string): TicketListCursor | null => {
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as TicketListCursor
    if (typeof parsed?.updatedAt !== "string" || typeof parsed?.id !== "string") {
      return null
    }
    return parsed
  } catch {
    return null
  }
}
