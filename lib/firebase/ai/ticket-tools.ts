import {
  createTicket,
  searchTicketsForAgent,
  type AgentTicketSummary,
} from "@/lib/firebase/services/ticket-service"
import type { TicketPriority, TicketStatus, TicketType } from "@/lib/types/ticket"

export type TicketToolContext = {
  companyId: string
  agentId: string
  agentName?: string
  conversationId?: string
  customerId?: string
  customerName?: string
}

const AGENT_USER_PREFIX = "agent:"

export const buildAgentActorId = (agentId: string) => `${AGENT_USER_PREFIX}${agentId}`

const ticketTypeValues: TicketType[] = [
  "customer_request",
  "order",
  "support",
  "complaint",
  "other",
]

const ticketStatusValues: TicketStatus[] = [
  "open",
  "in_progress",
  "waiting",
  "resolved",
  "closed",
]

const ticketPriorityValues: TicketPriority[] = ["low", "medium", "high"]

const parseEnumValue = <T extends string>(value: unknown, allowed: readonly T[]): T | undefined => {
  if (typeof value !== "string") return undefined
  return allowed.includes(value as T) ? (value as T) : undefined
}

export const executeSearchTicketsTool = async (
  context: TicketToolContext,
  args: Record<string, unknown>,
): Promise<{ tickets: AgentTicketSummary[] }> => {
  const customerId =
    typeof args.customerId === "string" && args.customerId.trim()
      ? args.customerId.trim()
      : context.customerId

  const tickets = await searchTicketsForAgent({
    companyId: context.companyId,
    query: typeof args.query === "string" ? args.query : undefined,
    customerId,
    ticketNumber: typeof args.ticketNumber === "string" ? args.ticketNumber : undefined,
    status: parseEnumValue(args.status, ticketStatusValues),
    limit: typeof args.limit === "number" ? args.limit : 10,
  })

  return { tickets }
}

export const executeCreateTicketTool = async (
  context: TicketToolContext,
  args: Record<string, unknown>,
): Promise<{
  ticket: {
    id: string
    ticketNumber: string
    title: string
    status: TicketStatus
    type: TicketType
  }
}> => {
  const title = typeof args.title === "string" ? args.title.trim() : ""
  const description = typeof args.description === "string" ? args.description.trim() : ""

  if (!title || !description) {
    throw new Error("title and description are required to create a ticket")
  }

  const customerId =
    typeof args.customerId === "string" && args.customerId.trim()
      ? args.customerId.trim()
      : context.customerId

  const customerName =
    typeof args.customerName === "string" && args.customerName.trim()
      ? args.customerName.trim()
      : context.customerName

  const ticket = await createTicket({
    companyId: context.companyId,
    userId: buildAgentActorId(context.agentId),
    userName: context.agentName ?? "Botinho AI",
    title,
    description,
    type: parseEnumValue(args.type, ticketTypeValues) ?? "customer_request",
    priority: parseEnumValue(args.priority, ticketPriorityValues) ?? "medium",
    customerId,
    customerName,
    orderReference: typeof args.orderReference === "string" ? args.orderReference : undefined,
    conversationId: context.conversationId,
  })

  return {
    ticket: {
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      title: ticket.title,
      status: ticket.status,
      type: ticket.type,
    },
  }
}

export const executeTicketTool = async (
  context: TicketToolContext,
  name: string,
  args: Record<string, unknown>,
) => {
  switch (name) {
    case "search_tickets":
      return executeSearchTicketsTool(context, args)
    case "create_ticket":
      return executeCreateTicketTool(context, args)
    default:
      throw new Error(`Unknown ticket tool: ${name}`)
  }
}

export const ticketToolDeclarations = [
  {
    name: "search_tickets",
    description:
      "Search support tickets for the current company. Always scoped to this company only. Use to check existing requests before creating duplicates.",
    parametersJsonSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Free-text search across ticket number, title, description, and order reference.",
        },
        ticketNumber: {
          type: "string",
          description: "Exact ticket number lookup, e.g. TKT-00042.",
        },
        customerId: {
          type: "string",
          description: "Filter tickets for a specific customer ID.",
        },
        status: {
          type: "string",
          enum: ticketStatusValues,
          description: "Filter by ticket status.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of tickets to return (default 10, max 20).",
        },
      },
    },
  },
  {
    name: "create_ticket",
    description:
      "Create a new support ticket for the current company. Use when the customer asks to open a case, report an issue, or track an order problem.",
    parametersJsonSchema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Short summary of the issue.",
        },
        description: {
          type: "string",
          description: "Detailed description of the customer request.",
        },
        type: {
          type: "string",
          enum: ticketTypeValues,
          description: "Ticket category.",
        },
        priority: {
          type: "string",
          enum: ticketPriorityValues,
          description: "Ticket priority.",
        },
        orderReference: {
          type: "string",
          description: "Related order ID or reference, if any.",
        },
        customerId: {
          type: "string",
          description: "Customer ID if known. Defaults to the current conversation customer.",
        },
        customerName: {
          type: "string",
          description: "Customer name if known. Defaults to the current conversation customer.",
        },
      },
      required: ["title", "description"],
    },
  },
] as const

export const buildTicketToolsInstruction = (language: "en" | "pt-BR") =>
  language === "pt-BR"
    ? [
        "## Tickets",
        "Você tem ferramentas search_tickets e create_ticket, sempre limitadas à empresa atual.",
        "Use search_tickets quando o cliente perguntar sobre um chamado existente, status de ticket ou número de protocolo.",
        "Use create_ticket quando o cliente pedir para abrir/registrar um chamado, relatar problema de pedido, solicitar suporte ou reclamação que precise de acompanhamento.",
        "Antes de criar, busque tickets do cliente atual para evitar duplicatas.",
        "Depois de criar, informe o número do ticket (ex.: TKT-00042) na resposta ao cliente.",
        "Instruções adicionais do system prompt do Botinho também se aplicam ao uso de tickets.",
      ].join("\n")
    : [
        "## Tickets",
        "You have search_tickets and create_ticket tools, always scoped to the current company only.",
        "Use search_tickets when the customer asks about an existing case, ticket status, or reference number.",
        "Use create_ticket when the customer asks to open/log a case, report an order issue, request support, or file a complaint that needs follow-up.",
        "Before creating, search the current customer's tickets to avoid duplicates.",
        "After creating, share the ticket number (e.g. TKT-00042) with the customer in your reply.",
        "Additional Botinho system prompt instructions also apply to ticket handling.",
      ].join("\n")
