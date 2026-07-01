"use client"

import { useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import {
  addDays,
  addMinutes,
  format,
  isSameDay,
  parseISO,
  startOfWeek,
} from "date-fns"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ScheduleBlock, ScheduleReservation } from "@/lib/types/schedule"

type ScheduleCalendarProps = {
  weekStart: Date
  reservations: ScheduleReservation[]
  blocks: ScheduleBlock[]
  slotIntervalMinutes: number
  isWeekLoading?: boolean
  onWeekChange: (weekStart: Date) => void
  onSlotClick: (startAt: Date) => void
  onReservationClick: (reservation: ScheduleReservation) => void
}

const HOUR_START = 8
const HOUR_END = 20
const ROW_HEIGHT = 28

export const ScheduleCalendar = ({
  weekStart,
  reservations,
  blocks,
  slotIntervalMinutes,
  isWeekLoading = false,
  onWeekChange,
  onSlotClick,
  onReservationClick,
}: ScheduleCalendarProps) => {
  const t = useTranslations("Schedule")
  const [mobileDayIndex, setMobileDayIndex] = useState(0)

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)),
    [weekStart],
  )

  const today = useMemo(() => new Date(), [])

  useEffect(() => {
    const todayIndex = weekDays.findIndex((day) => isSameDay(day, today))
    setMobileDayIndex(todayIndex >= 0 ? todayIndex : 0)
  }, [weekDays, today])

  const visibleDays = useMemo(() => {
    return weekDays
  }, [weekDays])

  const timeLabels = useMemo(() => {
    const labels: string[] = []
    for (let hour = HOUR_START; hour < HOUR_END; hour += 1) {
      for (let minute = 0; minute < 60; minute += slotIntervalMinutes) {
        labels.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`)
      }
    }
    return labels
  }, [slotIntervalMinutes])

  const gridHeight = timeLabels.length * ROW_HEIGHT
  const totalMinutes = (HOUR_END - HOUR_START) * 60

  const getTopPercent = (date: Date) => {
    const minutes = date.getHours() * 60 + date.getMinutes() - HOUR_START * 60
    return Math.max(0, Math.min(100, (minutes / totalMinutes) * 100))
  }

  const getHeightPercent = (start: Date, end: Date) => {
    const durationMinutes = (end.getTime() - start.getTime()) / 60_000
    return Math.max(2, (durationMinutes / totalMinutes) * 100)
  }

  const eventsForDay = (day: Date) => {
    const dayKey = format(day, "yyyy-MM-dd")
    const dayReservations = reservations.filter(
      (reservation) => format(parseISO(reservation.startAt), "yyyy-MM-dd") === dayKey,
    )
    const dayBlocks = blocks.filter(
      (block) => format(parseISO(block.startAt), "yyyy-MM-dd") === dayKey,
    )
    return { dayReservations, dayBlocks }
  }

  const renderDayColumn = (day: Date) => {
    const { dayReservations, dayBlocks } = eventsForDay(day)

    return (
      <div
        key={day.toISOString()}
        className="relative min-w-0 border-l"
        style={{ height: gridHeight }}
      >
        {timeLabels.map((_, index) => {
          const slotStart = new Date(day)
          const hour = HOUR_START + Math.floor((index * slotIntervalMinutes) / 60)
          const minute = (index * slotIntervalMinutes) % 60
          slotStart.setHours(hour, minute, 0, 0)
          return (
            <button
              key={`${day.toISOString()}-${index}`}
              type="button"
              className="absolute inset-x-0 border-b border-dashed border-border/40 hover:bg-primary/5"
              style={{ top: index * ROW_HEIGHT, height: ROW_HEIGHT }}
              onClick={() => onSlotClick(slotStart)}
              aria-label={t("calendar.createAt", { time: format(slotStart, "p") })}
            />
          )
        })}

        {dayBlocks.map((block) => {
          const start = parseISO(block.startAt)
          const end = parseISO(block.endAt)
          return (
            <div
              key={block.id}
              className="absolute inset-x-1 rounded border border-dashed bg-muted/80 px-1 py-0.5 text-[10px]"
              style={{
                top: `${getTopPercent(start)}%`,
                height: `${getHeightPercent(start, end)}%`,
              }}
            >
              {t(`blockType.${block.type}`)}
            </div>
          )
        })}

        {dayReservations.map((reservation) => {
          const start = parseISO(reservation.startAt)
          const end = parseISO(reservation.endAt)
          return (
            <button
              key={reservation.id}
              type="button"
              className={cn(
                "absolute inset-x-1 overflow-hidden rounded px-1 py-0.5 text-left text-[10px] text-primary-foreground",
                reservation.status === "cancelled" ? "bg-muted line-through" : "bg-primary",
              )}
              style={{
                top: `${getTopPercent(start)}%`,
                height: `${getHeightPercent(start, end)}%`,
              }}
              onClick={() => onReservationClick(reservation)}
            >
              <div className="truncate font-medium">{reservation.serviceName}</div>
              <div className="truncate opacity-90">
                {reservation.customerName ?? reservation.assigneeName}
              </div>
            </button>
          )
        })}
      </div>
    )
  }

  const desktopDays = visibleDays
  const mobileDay = visibleDays[mobileDayIndex] ?? visibleDays[0]

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between sm:px-0">
        <div className="flex items-center gap-2 px-1 sm:px-2">
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={() => onWeekChange(addDays(weekStart, -7))}
            aria-label={t("calendar.previousWeek")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="min-w-[4.5rem] px-4"
            onClick={() => onWeekChange(startOfWeek(new Date(), { weekStartsOn: 1 }))}
          >
            {t("calendar.today")}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={() => onWeekChange(addDays(weekStart, 7))}
            aria-label={t("calendar.nextWeek")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          {isWeekLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden />
          ) : null}
        </div>
        <p className="px-1 text-sm font-medium sm:px-2">
          {format(weekStart, "MMM d")} – {format(addDays(weekStart, 6), "MMM d, yyyy")}
        </p>
      </div>

      {/* Mobile: day strip */}
      <div className="flex gap-1 overflow-x-auto px-1 pb-1 md:hidden">
        {weekDays.map((day, index) => (
          <button
            key={day.toISOString()}
            type="button"
            onClick={() => setMobileDayIndex(index)}
            className={cn(
              "flex shrink-0 flex-col items-center rounded-md border px-3 py-1.5 text-xs transition-colors",
              mobileDayIndex === index
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:bg-muted",
              isSameDay(day, today) && mobileDayIndex !== index && "border-primary/40",
            )}
          >
            <span className="font-medium">{format(day, "EEE")}</span>
            <span>{format(day, "d")}</span>
          </button>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-lg border">
        {isWeekLoading ? (
          <div className="pointer-events-none absolute inset-0 z-10 bg-background/40" aria-hidden />
        ) : null}

        {/* Mobile: single day, viewport height */}
        <div
          className="overflow-y-auto md:hidden"
          style={{ maxHeight: "min(480px, calc(100dvh - 320px))" }}
        >
          <div className="grid grid-cols-[52px_1fr]">
            <div className="sticky left-0 z-[1] border-r bg-background">
              <div className="border-b bg-muted/40 px-1 py-2 text-center text-xs font-medium">
                {format(mobileDay, "EEE d")}
              </div>
              <div className="relative" style={{ height: gridHeight }}>
                {timeLabels.map((label, index) => (
                  <div
                    key={label}
                    className="absolute right-1 text-[10px] text-muted-foreground"
                    style={{ top: index * ROW_HEIGHT }}
                  >
                    {index % (60 / slotIntervalMinutes) === 0 ? label : ""}
                  </div>
                ))}
              </div>
            </div>
            {mobileDay ? renderDayColumn(mobileDay) : null}
          </div>
        </div>

        {/* Desktop: full week, scrollable body */}
        <div
          className="hidden overflow-auto md:block"
          style={{ maxHeight: "min(640px, calc(100dvh - 280px))" }}
        >
          <div className="min-w-[900px]">
            <div className="sticky top-0 z-[2] grid grid-cols-[64px_repeat(7,1fr)] border-b bg-muted/40">
              <div className="bg-muted/40" />
              {desktopDays.map((day) => (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "border-l px-2 py-2 text-center text-sm",
                    isSameDay(day, today) && "bg-primary/5",
                  )}
                >
                  <div className="font-medium">{format(day, "EEE")}</div>
                  <div className="text-muted-foreground">{format(day, "d")}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-[64px_repeat(7,1fr)]">
              <div className="sticky left-0 z-[1] border-r bg-background">
                <div className="relative" style={{ height: gridHeight }}>
                  {timeLabels.map((label, index) => (
                    <div
                      key={label}
                      className="absolute right-2 text-[10px] text-muted-foreground"
                      style={{ top: index * ROW_HEIGHT }}
                    >
                      {index % (60 / slotIntervalMinutes) === 0 ? label : ""}
                    </div>
                  ))}
                </div>
              </div>
              {desktopDays.map((day) => renderDayColumn(day))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const defaultWeekStart = () => startOfWeek(new Date(), { weekStartsOn: 1 })

export const slotEndFromStart = (start: Date, durationMinutes: number) =>
  addMinutes(start, durationMinutes)
