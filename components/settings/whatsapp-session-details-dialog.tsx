"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import {
  updateWhatsAppSessionAcceptGroupMessagesAction,
  type WhatsAppSessionView,
} from "@/components/server-actions/whatsapp"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

type WhatsAppSessionDetailsDialogProps = {
  session: WhatsAppSessionView
  companyId?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated?: () => void
}

const formatDateTime = (value: string | null | undefined) => {
  if (!value) return "—"

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

export const WhatsAppSessionDetailsDialog = ({
  session,
  companyId,
  open,
  onOpenChange,
  onUpdated,
}: WhatsAppSessionDetailsDialogProps) => {
  const t = useTranslations("Settings.page")
  const displayLabel = session.label ?? session.phoneNumber ?? session.sessionId

  const [acceptGroupMessages, setAcceptGroupMessages] = useState(session.acceptGroupMessages)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setAcceptGroupMessages(session.acceptGroupMessages)
    }
  }, [open, session.acceptGroupMessages])

  const statusLabel =
    session.status === "connected"
      ? t("whatsapp.status.connected")
      : session.status === "disconnected"
        ? t("whatsapp.status.disconnected")
        : session.status === "pending"
          ? t("whatsapp.details.status.pending")
          : session.status === "qr_pending"
            ? t("whatsapp.details.status.qrPending")
            : t("whatsapp.details.status.needsQr")

  const rows = [
    { label: t("whatsapp.details.fields.sessionId"), value: session.sessionId, mono: true },
    { label: t("whatsapp.details.fields.label"), value: session.label ?? "—" },
    { label: t("whatsapp.details.fields.phoneNumber"), value: session.phoneNumber ?? "—" },
    { label: t("whatsapp.details.fields.status"), value: statusLabel },
    { label: t("whatsapp.details.fields.pairedAt"), value: formatDateTime(session.createdAt) },
    { label: t("whatsapp.details.fields.lastSeenAt"), value: formatDateTime(session.lastSeenAt) },
    { label: t("whatsapp.details.fields.updatedAt"), value: formatDateTime(session.updatedAt) },
  ]

  const handleAcceptGroupMessagesChange = async (checked: boolean) => {
    if (!companyId) {
      toast.error(t("toasts.selectCompany"))
      return
    }

    const previousValue = acceptGroupMessages
    setAcceptGroupMessages(checked)
    setIsSaving(true)

    try {
      const response = await updateWhatsAppSessionAcceptGroupMessagesAction({
        companyId,
        sessionId: session.sessionId,
        acceptGroupMessages: checked,
      })
      if (!response.success) {
        throw new Error(response.error ?? t("toasts.updateFailed"))
      }
      toast.success(t("toasts.updateSuccessWhatsapp"))
      onUpdated?.()
    } catch (error) {
      console.error("Failed to update group messages setting", error)
      setAcceptGroupMessages(previousValue)
      toast.error(t("toasts.updateFailed"))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("whatsapp.details.title")}</DialogTitle>
          <DialogDescription>{displayLabel}</DialogDescription>
        </DialogHeader>

        <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
          <div className="space-y-1">
            <Label htmlFor={`group-messages-${session.sessionId}`}>{t("whatsapp.groupMessages.label")}</Label>
            <p className="text-sm text-muted-foreground">{t("whatsapp.groupMessages.description")}</p>
          </div>
          <Switch
            id={`group-messages-${session.sessionId}`}
            checked={acceptGroupMessages}
            disabled={!companyId || isSaving}
            onCheckedChange={(checked) => {
              void handleAcceptGroupMessagesChange(checked)
            }}
            aria-label={t("whatsapp.groupMessages.aria")}
          />
        </div>

        <dl className="space-y-3">
          {rows.map(({ label, value, mono }) => (
            <div key={label} className="grid gap-1 sm:grid-cols-[140px_1fr] sm:gap-3">
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd className={`text-sm font-medium ${mono ? "font-mono break-all" : ""}`}>{value}</dd>
            </div>
          ))}
        </dl>
      </DialogContent>
    </Dialog>
  )
}
