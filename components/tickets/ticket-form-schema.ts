import { z } from "zod"
import type { Ticket, TicketPriority, TicketStatus, TicketType } from "@/lib/types/ticket"

export const ticketTypes = [
  "customer_request",
  "order",
  "support",
  "complaint",
  "other",
] as const satisfies TicketType[]

export const ticketStatuses = [
  "open",
  "in_progress",
  "waiting",
  "resolved",
  "closed",
] as const satisfies TicketStatus[]

export const ticketPriorities = ["low", "medium", "high"] as const satisfies TicketPriority[]

export const createTicketSchema = (messages: {
  titleRequired: string
  descriptionRequired: string
}) =>
  z.object({
    title: z.string().trim().min(1, messages.titleRequired),
    description: z.string().trim().min(1, messages.descriptionRequired).max(5000),
    type: z.enum(ticketTypes),
    priority: z.enum(ticketPriorities),
    status: z.enum(ticketStatuses),
    customerId: z.string().optional(),
    customerName: z.string().optional(),
    orderReference: z.string().trim().max(200).optional(),
  })

export type TicketFormValues = z.infer<ReturnType<typeof createTicketSchema>>

export const defaultTicketFormValues: TicketFormValues = {
  title: "",
  description: "",
  type: "customer_request",
  priority: "medium",
  status: "open",
  customerId: undefined,
  customerName: undefined,
  orderReference: "",
}

export const mapTicketToFormValues = (ticket: Ticket): TicketFormValues => ({
  title: ticket.title,
  description: ticket.description,
  type: ticket.type,
  priority: ticket.priority,
  status: ticket.status,
  customerId: ticket.customerId,
  customerName: ticket.customerName,
  orderReference: ticket.orderReference ?? "",
})
