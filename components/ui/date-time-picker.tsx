"use client"

import { format } from "date-fns"
import { enUS, ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useLocale } from "next-intl"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type DateTimePickerProps = {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

const toTimeInputValue = (date: Date) => format(date, "HH:mm")

const setTimeOnDate = (date: Date, timeValue: string) => {
  const [hours, minutes] = timeValue.split(":").map(Number)
  const next = new Date(date)
  next.setHours(hours, minutes, 0, 0)
  return next
}

export const DateTimePicker = ({
  value,
  onChange,
  placeholder,
  disabled,
  className,
}: DateTimePickerProps) => {
  const locale = useLocale()
  const dateLocale = locale === "pt-BR" ? ptBR : enUS

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onChange?.(undefined)
      return
    }

    if (value) {
      onChange?.(setTimeOnDate(date, toTimeInputValue(value)))
      return
    }

    const now = new Date()
    onChange?.(setTimeOnDate(date, toTimeInputValue(now)))
  }

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = event.target.value
    if (!timeValue) return

    const base = value ?? new Date()
    onChange?.(setTimeOnDate(base, timeValue))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP p", { locale: dateLocale }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={value} onSelect={handleDateSelect} initialFocus />
        <div className="border-t border-border p-3">
          <Input
            type="time"
            value={value ? toTimeInputValue(value) : ""}
            onChange={handleTimeChange}
            className="w-full"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
