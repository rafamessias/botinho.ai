"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { CheckboxVisual } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { upsertScheduleServiceAction } from "@/components/server-actions/schedule"
import type { AgendaProfile, ScheduleService } from "@/lib/types/schedule"

type ServiceModalProps = {
  open: boolean
  mode: "create" | "edit"
  service?: ScheduleService | null
  profiles: AgendaProfile[]
  defaultBufferMinutes: number
  onClose: () => void
  onSaved: () => void
}

type ServiceDraft = {
  name: string
  description: string
  durationMinutes: number
  bufferBeforeMinutes: number
  bufferAfterMinutes: number
  assigneeIds: string[]
  active: boolean
}

const emptyDraft = (profiles: AgendaProfile[], defaultBufferMinutes: number): ServiceDraft => ({
  name: "",
  description: "",
  durationMinutes: 30,
  bufferBeforeMinutes: 0,
  bufferAfterMinutes: defaultBufferMinutes,
  assigneeIds: profiles.filter((profile) => profile.enabled).map((profile) => profile.memberUid),
  active: true,
})

export const ServiceModal = ({
  open,
  mode,
  service,
  profiles,
  defaultBufferMinutes,
  onClose,
  onSaved,
}: ServiceModalProps) => {
  const t = useTranslations("Schedule")
  const [draft, setDraft] = useState<ServiceDraft>(() => emptyDraft(profiles, defaultBufferMinutes))
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!open) return

    if (mode === "edit" && service) {
      setDraft({
        name: service.name,
        description: service.description ?? "",
        durationMinutes: service.durationMinutes,
        bufferBeforeMinutes: service.bufferBeforeMinutes ?? 0,
        bufferAfterMinutes: service.bufferAfterMinutes ?? defaultBufferMinutes,
        assigneeIds: service.assigneeIds,
        active: service.active,
      })
      return
    }

    setDraft(emptyDraft(profiles, defaultBufferMinutes))
  }, [defaultBufferMinutes, mode, open, profiles, service])

  const toggleAssignee = (memberUid: string) => {
    setDraft((prev) => ({
      ...prev,
      assigneeIds: prev.assigneeIds.includes(memberUid)
        ? prev.assigneeIds.filter((id) => id !== memberUid)
        : [...prev.assigneeIds, memberUid],
    }))
  }

  const handleSave = async () => {
    if (!draft.name.trim()) {
      toast.error(t("messages.requiredFields"))
      return
    }

    if (draft.assigneeIds.length === 0) {
      toast.error(t("services.errors.assigneeRequired"))
      return
    }

    setIsSaving(true)
    try {
      const result = await upsertScheduleServiceAction({
        id: mode === "edit" ? service?.id : undefined,
        name: draft.name.trim(),
        description: draft.description.trim() || undefined,
        durationMinutes: draft.durationMinutes,
        bufferBeforeMinutes: draft.bufferBeforeMinutes,
        bufferAfterMinutes: draft.bufferAfterMinutes,
        assigneeIds: draft.assigneeIds,
        active: draft.active,
      })

      if (!result.success) {
        throw new Error(result.error || t("messages.saveFailed"))
      }

      toast.success(t("messages.serviceSaved"))
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
            {mode === "create" ? t("services.modal.createTitle") : t("services.modal.editTitle")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="service-name">{t("services.name")}</Label>
            <Input
              id="service-name"
              value={draft.name}
              onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
              placeholder={t("services.modal.namePlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service-description">{t("services.descriptionLabel")}</Label>
            <Textarea
              id="service-description"
              value={draft.description}
              onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))}
              placeholder={t("services.modal.descriptionPlaceholder")}
              rows={2}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="service-duration">{t("services.duration")}</Label>
              <Input
                id="service-duration"
                type="number"
                min={5}
                step={5}
                value={draft.durationMinutes}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, durationMinutes: Number(event.target.value) }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-buffer-before">{t("services.bufferBefore")}</Label>
              <Input
                id="service-buffer-before"
                type="number"
                min={0}
                step={5}
                value={draft.bufferBeforeMinutes}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, bufferBeforeMinutes: Number(event.target.value) }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-buffer-after">{t("services.bufferAfter")}</Label>
              <Input
                id="service-buffer-after"
                type="number"
                min={0}
                step={5}
                value={draft.bufferAfterMinutes}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, bufferAfterMinutes: Number(event.target.value) }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("services.assignees")}</Label>
            <div className="max-h-36 space-y-2 overflow-y-auto rounded-md border p-3">
              {profiles.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("services.noAssignees")}</p>
              ) : (
                profiles.map((profile) => {
                  const checked = draft.assigneeIds.includes(profile.memberUid)
                  const label = profile.displayName ?? profile.memberUid

                  return (
                    <button
                      key={profile.memberUid}
                      type="button"
                      className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                      onClick={() => toggleAssignee(profile.memberUid)}
                    >
                      <CheckboxVisual checked={checked} />
                      <span>{label}</span>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-md border px-3 py-2">
            <div>
              <Label htmlFor="service-active">{t("services.active")}</Label>
              <p className="text-xs text-muted-foreground">{t("services.activeHint")}</p>
            </div>
            <Switch
              id="service-active"
              checked={draft.active}
              onCheckedChange={(checked) => setDraft((prev) => ({ ...prev, active: checked }))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            {t("actions.close")}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("actions.saving")}
              </>
            ) : (
              t("actions.save")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
