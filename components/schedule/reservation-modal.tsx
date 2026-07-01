"use client"

import { useEffect, useMemo, useState } from "react"
import { format, parseISO } from "date-fns"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import {
  CustomerPickerField,
  type CustomerPickerValue,
} from "@/components/customer/customer-picker-field"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DatePicker } from "@/components/ui/date-picker"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createCustomerAction } from "@/components/server-actions/customers"
import {
  createReservationAction,
  listAvailableSlotsAction,
  updateReservationAction,
} from "@/components/server-actions/schedule"
import type { AgendaProfile, ScheduleReservation, ScheduleService } from "@/lib/types/schedule"

export type ReservationFormValues = {
  serviceId: string
  assigneeId: string
  startAt: string
  customerId?: string
  customerName?: string
  customerPhone?: string
  notes?: string
  status?: ScheduleReservation["status"]
}

type ReservationModalProps = {
  open: boolean
  mode: "create" | "edit"
  reservation?: ScheduleReservation | null
  services: ScheduleService[]
  profiles: AgendaProfile[]
  defaultStartAt?: string
  onClose: () => void
  onSaved: () => void
}

const toDateKey = (date: Date) => format(date, "yyyy-MM-dd")

export const ReservationModal = ({
  open,
  mode,
  reservation,
  services,
  profiles,
  defaultStartAt,
  onClose,
  onSaved,
}: ReservationModalProps) => {
  const t = useTranslations("Schedule")
  const [serviceId, setServiceId] = useState("")
  const [assigneeId, setAssigneeId] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [slotStartAt, setSlotStartAt] = useState("")
  const [customer, setCustomer] = useState<CustomerPickerValue>({})
  const [notes, setNotes] = useState("")
  const [status, setStatus] = useState<ScheduleReservation["status"]>("confirmed")
  const [slots, setSlots] = useState<Array<{ startAt: string; assigneeName: string; assigneeId: string }>>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const dateKey = useMemo(() => (selectedDate ? toDateKey(selectedDate) : ""), [selectedDate])

  useEffect(() => {
    if (!open) return
    if (mode === "edit" && reservation) {
      setServiceId(reservation.serviceId)
      setAssigneeId(reservation.assigneeId)
      setSelectedDate(parseISO(reservation.startAt.slice(0, 10)))
      setSlotStartAt(reservation.startAt)
      setCustomer({
        customerId: reservation.customerId,
        customerName: reservation.customerName,
        customerPhone: reservation.customerPhone,
      })
      setNotes(reservation.notes ?? "")
      setStatus(reservation.status)
      return
    }
    setServiceId(services[0]?.id ?? "")
    setAssigneeId(profiles[0]?.memberUid ?? "")
    const start = defaultStartAt ? new Date(defaultStartAt) : new Date()
    setSelectedDate(start)
    setSlotStartAt(defaultStartAt ?? "")
    setCustomer({})
    setNotes("")
    setStatus("confirmed")
  }, [defaultStartAt, mode, open, profiles, reservation, services])

  useEffect(() => {
    if (!open || mode === "edit" || !serviceId || !dateKey) return
    const load = async () => {
      setIsLoadingSlots(true)
      try {
        const result = await listAvailableSlotsAction({
          serviceId,
          date: dateKey,
          assigneeId: assigneeId || undefined,
        })
        if (result.success && result.data) {
          setSlots(result.data.slots)
          if (!slotStartAt && result.data.slots[0]) {
            setSlotStartAt(result.data.slots[0].startAt)
            setAssigneeId(result.data.slots[0].assigneeId)
          }
        }
      } finally {
        setIsLoadingSlots(false)
      }
    }
    void load()
  }, [assigneeId, dateKey, mode, open, serviceId, slotStartAt])

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date)
    setSlotStartAt("")
    setSlots([])
  }

  const resolveCustomerPayload = async (): Promise<CustomerPickerValue> => {
    if (customer.customerId) {
      return customer
    }

    const name = customer.customerName?.trim()
    const phone = customer.customerPhone?.trim()
    if (!name) {
      return customer
    }

    if (!phone) {
      return { customerName: name, customerEmail: customer.customerEmail?.trim() || undefined }
    }

    const result = await createCustomerAction({
      name,
      phone,
      email: customer.customerEmail?.trim() || undefined,
      status: "active",
    })

    if (!result.success || !result.data) {
      throw new Error(result.error || t("messages.saveFailed"))
    }

    return {
      customerId: result.data.customer.id,
      customerName: result.data.customer.name,
      customerPhone: result.data.customer.phone ?? undefined,
      customerEmail: result.data.customer.email,
    }
  }

  const handleSave = async () => {
    if (!serviceId || !assigneeId || !slotStartAt) {
      toast.error(t("messages.requiredFields"))
      return
    }

    setIsSaving(true)
    try {
      if (mode === "create") {
        const resolvedCustomer = await resolveCustomerPayload()
        const result = await createReservationAction({
          serviceId,
          assigneeId,
          startAt: slotStartAt,
          customerId: resolvedCustomer.customerId,
          customerName: resolvedCustomer.customerName,
          customerPhone: resolvedCustomer.customerPhone,
          notes: notes || undefined,
        })
        if (!result.success) throw new Error(result.error)
        toast.success(t("messages.created"))
      } else if (reservation) {
        const result = await updateReservationAction({
          reservationId: reservation.id,
          status,
          notes,
        })
        if (!result.success) throw new Error(result.error)
        toast.success(t("messages.updated"))
      }
      onSaved()
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("messages.saveFailed"))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? t("modal.createTitle") : t("modal.editTitle")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t("modal.service")}</Label>
            <Select value={serviceId} onValueChange={setServiceId} disabled={mode === "edit"}>
              <SelectTrigger>
                <SelectValue placeholder={t("modal.selectService")} />
              </SelectTrigger>
              <SelectContent>
                {services.filter((service) => service.active).map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {mode === "create" ? (
            <>
              <div className="space-y-2">
                <Label>{t("modal.date")}</Label>
                <DatePicker
                  value={selectedDate}
                  onChange={handleDateChange}
                  placeholder={t("modal.selectDate")}
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("modal.slot")}</Label>
                {isLoadingSlots ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("modal.loadingSlots")}
                  </div>
                ) : (
                  <Select
                    value={slotStartAt}
                    onValueChange={(value) => {
                      setSlotStartAt(value)
                      const slot = slots.find((entry) => entry.startAt === value)
                      if (slot) setAssigneeId(slot.assigneeId)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("modal.selectSlot")} />
                    </SelectTrigger>
                    <SelectContent>
                      {slots.map((slot) => (
                        <SelectItem key={slot.startAt} value={slot.startAt}>
                          {new Date(slot.startAt).toLocaleString()} — {slot.assigneeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label>{t("modal.status")}</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as ScheduleReservation["status"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["pending", "confirmed", "completed", "no_show", "cancelled"] as const).map((value) => (
                    <SelectItem key={value} value={value}>
                      {t(`status.${value}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {mode === "create" ? (
            <CustomerPickerField value={customer} onChange={setCustomer} disabled={isSaving} />
          ) : (
            customer.customerName && (
              <div className="space-y-2">
                <Label>{t("modal.customer.label")}</Label>
                <p className="text-sm text-muted-foreground">{customer.customerName}</p>
              </div>
            )
          )}

          <div className="space-y-2">
            <Label>{t("modal.notes")}</Label>
            <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("actions.close")}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? t("actions.saving") : t("actions.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
