"use client"

import { useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { updateScheduleSettingsAction } from "@/components/server-actions/schedule"
import type { ScheduleSettings } from "@/lib/types/schedule"

const TIMEZONE_OPTIONS = [
  "America/Sao_Paulo",
  "America/Manaus",
  "America/Fortaleza",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/Lisbon",
  "Europe/London",
  "Europe/Madrid",
  "UTC",
] as const

type ScheduleSettingsPanelProps = {
  settings: ScheduleSettings
  onSaved: () => void
}

export const ScheduleSettingsPanel = ({ settings: initialSettings, onSaved }: ScheduleSettingsPanelProps) => {
  const t = useTranslations("Schedule")
  const [settings, setSettings] = useState(initialSettings)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setSettings(initialSettings)
  }, [initialSettings])

  const timezoneOptions = useMemo(() => {
    if (initialSettings.timezone && !TIMEZONE_OPTIONS.includes(initialSettings.timezone as (typeof TIMEZONE_OPTIONS)[number])) {
      return [initialSettings.timezone, ...TIMEZONE_OPTIONS]
    }
    return TIMEZONE_OPTIONS
  }, [initialSettings.timezone])

  const isDirty = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(initialSettings),
    [initialSettings, settings],
  )

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const result = await updateScheduleSettingsAction({
        timezone: settings.timezone,
        defaultBufferMinutes: settings.defaultBufferMinutes,
        minAdvanceBookingMinutes: settings.minAdvanceBookingMinutes,
        maxAdvanceBookingDays: settings.maxAdvanceBookingDays,
        slotIntervalMinutes: settings.slotIntervalMinutes,
      })

      if (!result.success) {
        throw new Error(result.error || t("messages.saveFailed"))
      }

      toast.success(t("messages.settingsSaved"))
      onSaved()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("messages.saveFailed"))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>{t("settings.title")}</CardTitle>
          <CardDescription>{t("settings.description")}</CardDescription>
        </div>
        <Button onClick={handleSave} disabled={!isDirty || isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("actions.saving")}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {t("actions.saveSettings")}
            </>
          )}
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">{t("settings.sections.general")}</h3>
            <p className="text-sm text-muted-foreground">{t("settings.sections.generalHint")}</p>
          </div>
          <div className="grid gap-4 sm:max-w-md">
            <div className="space-y-2">
              <Label htmlFor="schedule-timezone">{t("settings.timezone")}</Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) => setSettings((prev) => ({ ...prev, timezone: value }))}
              >
                <SelectTrigger id="schedule-timezone">
                  <SelectValue placeholder={t("settings.timezonePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {timezoneOptions.map((timezone) => (
                    <SelectItem key={timezone} value={timezone}>
                      {timezone.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">{t("settings.sections.slots")}</h3>
            <p className="text-sm text-muted-foreground">{t("settings.sections.slotsHint")}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:max-w-2xl">
            <div className="space-y-2">
              <Label htmlFor="schedule-default-buffer">{t("settings.defaultBuffer")}</Label>
              <Input
                id="schedule-default-buffer"
                type="number"
                min={0}
                step={5}
                value={settings.defaultBufferMinutes}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    defaultBufferMinutes: Number(event.target.value),
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule-slot-interval">{t("settings.slotInterval")}</Label>
              <Input
                id="schedule-slot-interval"
                type="number"
                min={5}
                step={5}
                value={settings.slotIntervalMinutes}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    slotIntervalMinutes: Number(event.target.value),
                  }))
                }
              />
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">{t("settings.sections.booking")}</h3>
            <p className="text-sm text-muted-foreground">{t("settings.sections.bookingHint")}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:max-w-2xl">
            <div className="space-y-2">
              <Label htmlFor="schedule-min-advance">{t("settings.minAdvance")}</Label>
              <Input
                id="schedule-min-advance"
                type="number"
                min={0}
                step={15}
                value={settings.minAdvanceBookingMinutes}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    minAdvanceBookingMinutes: Number(event.target.value),
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule-max-advance">{t("settings.maxAdvanceDays")}</Label>
              <Input
                id="schedule-max-advance"
                type="number"
                min={1}
                step={1}
                value={settings.maxAdvanceBookingDays}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    maxAdvanceBookingDays: Number(event.target.value),
                  }))
                }
              />
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  )
}
