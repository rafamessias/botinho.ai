import {
  buildAgentActorId,
  type TicketToolContext,
} from "@/lib/firebase/ai/ticket-tools"
import {
  cancelReservationForAgent,
  createReservation,
  findAvailableSlots,
  listReservationsForAgent,
  ScheduleConflictError,
  searchServicesForAgent,
} from "@/lib/firebase/services/schedule-service"

export type ScheduleToolContext = TicketToolContext

const parseIsoDate = (value: unknown): Date | undefined => {
  if (typeof value !== "string" || !value.trim()) return undefined
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

export const executeCheckAvailabilityTool = async (
  context: ScheduleToolContext,
  args: Record<string, unknown>,
) => {
  const services = await searchServicesForAgent({
    companyId: context.companyId,
    query: typeof args.serviceName === "string" ? args.serviceName : undefined,
  })

  let service = services[0]
  if (typeof args.serviceId === "string" && args.serviceId.trim()) {
    service = services.find((entry) => entry.id === args.serviceId) ?? service
  }

  if (!service) {
    return { slots: [], message: "No matching service found" }
  }

  const date =
    parseIsoDate(args.date) ??
    (() => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      return tomorrow
    })()

  const slots = await findAvailableSlots({
    companyId: context.companyId,
    serviceId: service.id,
    date,
    assigneeId: typeof args.assigneeId === "string" ? args.assigneeId : undefined,
  })

  return {
    serviceId: service.id,
    serviceName: service.name,
    date: date.toISOString().slice(0, 10),
    slots: slots.slice(0, 12).map((slot) => ({
      startAt: slot.startAt.toISOString(),
      endAt: slot.endAt.toISOString(),
      assigneeId: slot.assigneeId,
      assigneeName: slot.assigneeName,
    })),
  }
}

export const executeBookAppointmentTool = async (
  context: ScheduleToolContext,
  args: Record<string, unknown>,
) => {
  const serviceId = typeof args.serviceId === "string" ? args.serviceId.trim() : ""
  const startAt = parseIsoDate(args.startAt)
  const assigneeId = typeof args.assigneeId === "string" ? args.assigneeId.trim() : ""

  if (!serviceId || !startAt || !assigneeId) {
    throw new Error("serviceId, startAt, and assigneeId are required to book an appointment")
  }

  try {
    const reservation = await createReservation({
      companyId: context.companyId,
      serviceId,
      assigneeId,
      startAt,
      customerId: context.customerId,
      customerName: context.customerName,
      conversationId: context.conversationId,
      notes: typeof args.notes === "string" ? args.notes : undefined,
      source: "bot",
      createdById: buildAgentActorId(context.agentId),
    })

    return {
      reservationNumber: reservation.reservationNumber,
      serviceName: reservation.serviceName,
      assigneeName: reservation.assigneeName,
      startAt: reservation.startAt.toISOString(),
      endAt: reservation.endAt.toISOString(),
      status: reservation.status,
    }
  } catch (error) {
    if (error instanceof ScheduleConflictError) {
      const alternatives = await findAvailableSlots({
        companyId: context.companyId,
        serviceId,
        date: startAt,
        assigneeId,
      })
      return {
        error: "SLOT_UNAVAILABLE",
        alternatives: alternatives.slice(0, 5).map((slot) => ({
          startAt: slot.startAt.toISOString(),
          assigneeName: slot.assigneeName,
        })),
      }
    }
    throw error
  }
}

export const executeCancelAppointmentTool = async (
  context: ScheduleToolContext,
  args: Record<string, unknown>,
) => {
  const reservation = await cancelReservationForAgent({
    companyId: context.companyId,
    reservationNumber:
      typeof args.reservationNumber === "string" ? args.reservationNumber : undefined,
    customerId: context.customerId,
    conversationId: context.conversationId,
    reason: typeof args.reason === "string" ? args.reason : undefined,
  })

  return {
    cancelled: true,
    reservationNumber: reservation.reservationNumber,
    status: reservation.status,
  }
}

export const executeListAppointmentsTool = async (
  context: ScheduleToolContext,
  args: Record<string, unknown>,
) => {
  const reservations = await listReservationsForAgent({
    companyId: context.companyId,
    customerId: context.customerId,
    conversationId: context.conversationId,
    dateFrom: parseIsoDate(args.dateFrom),
    dateTo: parseIsoDate(args.dateTo),
    limit: typeof args.limit === "number" ? args.limit : 10,
  })

  return { reservations }
}

export const executeScheduleTool = async (
  context: ScheduleToolContext,
  name: string,
  args: Record<string, unknown>,
) => {
  switch (name) {
    case "check_availability":
      return executeCheckAvailabilityTool(context, args)
    case "book_appointment":
      return executeBookAppointmentTool(context, args)
    case "cancel_appointment":
      return executeCancelAppointmentTool(context, args)
    case "list_appointments":
      return executeListAppointmentsTool(context, args)
    default:
      throw new Error(`Unknown schedule tool: ${name}`)
  }
}

export const scheduleToolDeclarations = [
  {
    name: "check_availability",
    description:
      "Check available appointment slots for a service on a given date. Always scoped to the current company.",
    parametersJsonSchema: {
      type: "object",
      properties: {
        serviceName: { type: "string", description: "Service name to search for." },
        serviceId: { type: "string", description: "Exact service ID if known." },
        date: { type: "string", description: "ISO date (YYYY-MM-DD) to check availability." },
        assigneeId: { type: "string", description: "Optional specific staff member ID." },
      },
    },
  },
  {
    name: "book_appointment",
    description:
      "Book an appointment after the customer confirms date, time, and service.",
    parametersJsonSchema: {
      type: "object",
      properties: {
        serviceId: { type: "string", description: "Service ID from check_availability." },
        startAt: { type: "string", description: "ISO datetime for the slot start." },
        assigneeId: { type: "string", description: "Staff member ID from check_availability." },
        notes: { type: "string", description: "Optional booking notes." },
      },
      required: ["serviceId", "startAt", "assigneeId"],
    },
  },
  {
    name: "cancel_appointment",
    description: "Cancel an appointment for the current customer/conversation.",
    parametersJsonSchema: {
      type: "object",
      properties: {
        reservationNumber: { type: "string", description: "Reservation number e.g. SCH-00042." },
        reason: { type: "string", description: "Optional cancellation reason." },
      },
    },
  },
  {
    name: "list_appointments",
    description: "List upcoming or recent appointments for the current customer.",
    parametersJsonSchema: {
      type: "object",
      properties: {
        dateFrom: { type: "string", description: "Optional ISO datetime filter start." },
        dateTo: { type: "string", description: "Optional ISO datetime filter end." },
        limit: { type: "integer", description: "Max results (default 10)." },
      },
    },
  },
] as const

export const buildScheduleToolsInstruction = (language: "en" | "pt-BR") =>
  language === "pt-BR"
    ? [
        "## Agendamentos",
        "Você tem ferramentas check_availability, book_appointment, cancel_appointment e list_appointments.",
        "Confirme serviço, data e horário com o cliente antes de chamar book_appointment.",
        "Use check_availability para horários reais — nunca invente disponibilidade.",
        "Se o horário não estiver disponível, ofereça alternativas retornadas pela ferramenta.",
        "Após agendar, informe o número SCH ao cliente.",
      ].join("\n")
    : [
        "## Scheduling",
        "You have check_availability, book_appointment, cancel_appointment, and list_appointments tools.",
        "Confirm service, date, and time with the customer before calling book_appointment.",
        "Use check_availability for real slots — never invent availability.",
        "If a slot is unavailable, offer alternatives returned by the tool.",
        "After booking, share the SCH reservation number with the customer.",
      ].join("\n")
