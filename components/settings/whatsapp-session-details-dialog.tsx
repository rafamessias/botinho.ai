"use client"

import { useTranslations } from "next-intl"
import type { WhatsAppSessionView } from "@/components/server-actions/whatsapp"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type WhatsAppSessionDetailsDialogProps = {
  session: WhatsAppSessionView
  open: boolean
  onOpenChange: (open: boolean) => void
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
  open,
  onOpenChange,
}: WhatsAppSessionDetailsDialogProps) => {
  const t = useTranslations("Settings.page")
  const displayLabel = session.label ?? session.phoneNumber ?? session.sessionId

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("whatsapp.details.title")}</DialogTitle>
          <DialogDescription>{displayLabel}</DialogDescription>
        </DialogHeader>

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
