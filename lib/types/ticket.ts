export type TicketType = "customer_request" | "order" | "support" | "complaint" | "other"

export type TicketStatus = "open" | "in_progress" | "waiting" | "resolved" | "closed"

export type TicketPriority = "low" | "medium" | "high"

export type Ticket = {
  id: string
  ticketNumber: string
  ticketSequence: number
  ticketScopeCode: string
  title: string
  description: string
  type: TicketType
  status: TicketStatus
  priority: TicketPriority
  customerId?: string
  customerName?: string
  orderReference?: string
  conversationId?: string
  assignedToId?: string
  assignedToName?: string
  createdById: string
  createdByName?: string
  createdAt: string
  updatedAt: string
}

export type TicketActivityAction =
  | "created"
  | "status_changed"
  | "priority_changed"
  | "type_changed"
  | "title_changed"
  | "description_changed"
  | "customer_changed"
  | "order_reference_changed"
  | "assigned"
  | "unassigned"
  | "comment_added"

export type TicketComment = {
  id: string
  ticketId: string
  content: string
  authorId: string
  authorName?: string
  createdAt: string
}

export type TicketActivity = {
  id: string
  ticketId: string
  action: TicketActivityAction
  actorId: string
  actorName?: string
  field?: string
  previousValue?: string
  newValue?: string
  createdAt: string
}
