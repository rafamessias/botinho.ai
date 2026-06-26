"use client"

import { useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { Check, Pencil, X } from "lucide-react"
import { toast } from "sonner"
import {
  updateWhatsAppSessionLabelAction,
  type WhatsAppSessionView,
} from "@/components/server-actions/whatsapp"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type WhatsAppSessionRowProps = {
  session: WhatsAppSessionView
  companyId?: string
  isDisconnecting: boolean
  statusBadgeVariant: (status: WhatsAppSessionView["status"]) => "default" | "secondary" | "outline"
  onUpdated: () => void
  onDisconnect: (sessionId: string) => void
}

export const WhatsAppSessionRow = ({
  session,
  companyId,
  isDisconnecting,
  statusBadgeVariant,
  onUpdated,
  onDisconnect,
}: WhatsAppSessionRowProps) => {
  const t = useTranslations("Settings.page")
  const inputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useState(session.label ?? "")
  const [isSaving, setIsSaving] = useState(false)

  const displayLabel = session.label ?? session.phoneNumber ?? session.sessionId

  useEffect(() => {
    if (!isEditing) {
      setLabel(session.label ?? "")
    }
  }, [isEditing, session.label])

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  const handleStartEdit = () => {
    setLabel(session.label ?? displayLabel)
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setLabel(session.label ?? "")
    setIsEditing(false)
  }

  const handleSaveLabel = async () => {
    if (!companyId) {
      toast.error(t("toasts.selectCompany"))
      return
    }

    const trimmed = label.trim()
    if (!trimmed) {
      toast.error(t("whatsapp.label.required"))
      return
    }

    if (trimmed === (session.label ?? "")) {
      setIsEditing(false)
      return
    }

    setIsSaving(true)
    try {
      const response = await updateWhatsAppSessionLabelAction({
        companyId,
        sessionId: session.sessionId,
        label: trimmed,
      })

      if (!response.success) {
        throw new Error(response.error ?? t("toasts.updateWhatsappFailed"))
      }

      toast.success(t("toasts.updateWhatsappSuccess"))
      setIsEditing(false)
      onUpdated()
    } catch (error) {
      console.error("Failed to update WhatsApp session label", error)
      toast.error(error instanceof Error ? error.message : t("toasts.updateWhatsappFailed"))
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      void handleSaveLabel()
    }

    if (event.key === "Escape") {
      event.preventDefault()
      handleCancelEdit()
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 space-y-1">
        {isEditing ? (
          <div className="flex max-w-md items-center gap-2">
            <Input
              ref={inputRef}
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("whatsapp.label.placeholder")}
              disabled={isSaving}
              aria-label={t("whatsapp.label.editAria")}
              className="h-9"
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => void handleSaveLabel()}
              disabled={isSaving}
              aria-label={t("whatsapp.label.save")}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={handleCancelEdit}
              disabled={isSaving}
              aria-label={t("whatsapp.label.cancel")}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="truncate font-medium">{displayLabel}</p>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 shrink-0"
              onClick={handleStartEdit}
              aria-label={t("whatsapp.actions.editAria", { name: displayLabel })}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          {session.phoneNumber ?? t("whatsapp.pairing.latest.pending")}
        </p>
        <Badge variant={statusBadgeVariant(session.status)}>{session.status}</Badge>
      </div>

      <Button
        type="button"
        variant="outline"
        disabled={isDisconnecting || isSaving}
        onClick={() => onDisconnect(session.sessionId)}
      >
        {t("whatsapp.disconnect")}
      </Button>
    </div>
  )
}
