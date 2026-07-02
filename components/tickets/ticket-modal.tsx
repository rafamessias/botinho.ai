"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { TicketDetailsForm } from "@/components/tickets/ticket-details-form"
import {
  createTicketSchema,
  defaultTicketFormValues,
  type TicketFormValues,
} from "@/components/tickets/ticket-form-schema"

export type { TicketFormValues }

type TicketModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: TicketFormValues) => Promise<void> | void
  isSubmitting?: boolean
}

export const TicketModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: TicketModalProps) => {
  const t = useTranslations("Tickets")

  const schema = createTicketSchema({
    titleRequired: t("form.validation.titleRequired"),
    descriptionRequired: t("form.validation.descriptionRequired"),
  })

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultTicketFormValues,
  })

  useEffect(() => {
    if (!isOpen) {
      form.reset(defaultTicketFormValues)
    }
  }, [form, isOpen])

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values)
  })

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("form.title.create")}</DialogTitle>
          <DialogDescription>{t("form.description.create")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TicketDetailsForm form={form} isSubmitting={isSubmitting} isActive={isOpen} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                {t("form.buttons.cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                {t("form.buttons.create")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
