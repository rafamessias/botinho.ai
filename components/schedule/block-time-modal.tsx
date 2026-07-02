"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createScheduleBlockAction } from "@/components/server-actions/schedule"
import type { AgendaProfile, ScheduleBlock } from "@/lib/types/schedule"

type BlockTimeModalProps = {
  open: boolean
  profiles: AgendaProfile[]
  defaultAssigneeId?: string
  defaultStartAt?: string
  onClose: () => void
  onSaved: () => void
}

const parseDate = (value?: string) => (value ? new Date(value) : undefined)

export const BlockTimeModal = ({
  open,
  profiles,
  defaultAssigneeId,
  defaultStartAt,
  onClose,
  onSaved,
}: BlockTimeModalProps) => {
  const t = useTranslations("Schedule")
  const [assigneeId, setAssigneeId] = useState(defaultAssigneeId ?? profiles[0]?.memberUid ?? "")
  const [type, setType] = useState<ScheduleBlock["type"]>("blocked")
  const [startAt, setStartAt] = useState<Date | undefined>(parseDate(defaultStartAt))
  const [endAt, setEndAt] = useState<Date | undefined>()
  const [reason, setReason] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setAssigneeId(defaultAssigneeId ?? profiles[0]?.memberUid ?? "")
    setType("blocked")
    setStartAt(parseDate(defaultStartAt))
    if (defaultStartAt) {
      const end = new Date(defaultStartAt)
      end.setHours(end.getHours() + 1)
      setEndAt(end)
    } else {
      setEndAt(undefined)
    }
    setReason("")
  }, [defaultAssigneeId, defaultStartAt, open, profiles])

  const handleSave = async () => {
    if (!assigneeId || !startAt || !endAt) {
      toast.error(t("messages.requiredFields"))
      return
    }

    setIsSaving(true)
    try {
      const result = await createScheduleBlockAction({
        assigneeId,
        type,
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
        reason: reason || undefined,
      })
      if (!result.success) throw new Error(result.error)
      toast.success(t("messages.blockCreated"))
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
          <DialogTitle>{t("blockModal.title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t("blockModal.assignee")}</Label>
            <Select value={assigneeId} onValueChange={setAssigneeId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {profiles.map((profile) => (
                  <SelectItem key={profile.memberUid} value={profile.memberUid}>
                    {profile.displayName ?? profile.memberUid}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("blockModal.type")}</Label>
            <Select value={type} onValueChange={(value) => setType(value as ScheduleBlock["type"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["blocked", "break", "unavailable"] as const).map((value) => (
                  <SelectItem key={value} value={value}>
                    {t(`blockType.${value}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("blockModal.start")}</Label>
              <DateTimePicker
                value={startAt}
                onChange={setStartAt}
                placeholder={t("blockModal.selectDateTime")}
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("blockModal.end")}</Label>
              <DateTimePicker
                value={endAt}
                onChange={setEndAt}
                placeholder={t("blockModal.selectDateTime")}
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("blockModal.reason")}</Label>
            <Textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={2} />
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
