"use client"

import { forwardRef, useImperativeHandle, useMemo } from "react"
import { useForm, useFormState } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"

import { Form } from "@/components/ui/form"
import { TicketDetailsForm } from "@/components/tickets/ticket-details-form"
import {
  createTicketSchema,
  mapTicketToFormValues,
  type TicketFormValues,
} from "@/components/tickets/ticket-form-schema"
import type { Ticket } from "@/lib/types/ticket"

export type TicketRecordFormHandle = {
  isDirty: () => boolean
  submit: () => void
}

type TicketRecordFormProps = {
  ticket: Ticket
  isSubmitting?: boolean
  showStatus?: boolean
  isActive?: boolean
  compact?: boolean
  onSubmit: (values: TicketFormValues) => Promise<void> | void
}

export const TicketRecordForm = forwardRef<TicketRecordFormHandle, TicketRecordFormProps>(
  (
    { ticket, isSubmitting = false, showStatus = false, isActive = true, compact = false, onSubmit },
    ref,
  ) => {
    const t = useTranslations("Tickets")

    const schema = useMemo(
      () =>
        createTicketSchema({
          titleRequired: t("form.validation.titleRequired"),
          descriptionRequired: t("form.validation.descriptionRequired"),
        }),
      [t],
    )

    const form = useForm<TicketFormValues>({
      resolver: zodResolver(schema),
      defaultValues: mapTicketToFormValues(ticket),
    })

    const { isDirty } = useFormState({ control: form.control })

    const handleSubmit = form.handleSubmit(async (values) => {
      await onSubmit(values)
      form.reset(values)
    })

    useImperativeHandle(
      ref,
      () => ({
        isDirty: () => isDirty,
        submit: () => {
          void handleSubmit()
        },
      }),
      [handleSubmit, isDirty],
    )

    return (
      <Form {...form}>
        <TicketDetailsForm
          form={form}
          ticketId={ticket.id}
          ticketCustomerName={ticket.customerName}
          isSubmitting={isSubmitting}
          showStatus={showStatus}
          isActive={isActive}
          compact={compact}
        />
      </Form>
    )
  },
)

TicketRecordForm.displayName = "TicketRecordForm"
