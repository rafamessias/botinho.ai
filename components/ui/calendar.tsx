"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { ptBR } from "date-fns/locale"

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
    locale?: any
}

function Calendar({
    className,
    showOutsideDays = true,
    locale = ptBR,
    ...props
}: CalendarProps) {
    return (
        <div className={cn("rounded-xl border border-gray-200 bg-white p-4 shadow-lg", className)}>
            <DayPicker
                showOutsideDays={showOutsideDays}
                locale={locale}

                weekStartsOn={1}
                {...props}
                modifiersClassNames={{
                    selected: "bg-primary text-primary-foreground rounded-md",
                    today: "bg-accent text-accent-foreground",
                }}
                classNames={{

                }}
            />
        </div>
    )
}
Calendar.displayName = "Calendar"

export { Calendar } 