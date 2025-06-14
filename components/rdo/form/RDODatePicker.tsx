"use client";

import * as React from "react";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslations } from 'next-intl';

function formatDate(date: Date | undefined) {
    if (!date) return "";
    return format(date, "dd/MM/yyyy");
}

function parseDateString(value: string) {
    const parsed = parse(value, "dd/MM/yyyy", new Date());
    return isNaN(parsed.getTime()) ? undefined : parsed;
}

export function RDODatePicker({ value, onChange }: { value: string, onChange: (v: string) => void }) {
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState<Date | undefined>(
        value ? new Date(value) : undefined
    );
    const [month, setMonth] = React.useState<Date | undefined>(date);
    const [inputValue, setInputValue] = React.useState<string>(formatDate(date));
    const t = useTranslations('form.date');

    React.useEffect(() => {
        setInputValue(formatDate(date));
    }, [date]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        const parsed = parseDateString(value);
        if (parsed) {
            setDate(parsed);
            setMonth(parsed);
            onChange(parsed.toISOString().split('T')[0]);
        }
    };

    const handleSelect = (selected: Date | undefined) => {
        setDate(selected);
        if (selected) {
            setInputValue(formatDate(selected));
            setMonth(selected);
            onChange(selected.toISOString().split('T')[0]);
            setOpen(false);
        }
    };

    return (
        <div className="flex flex-col">
            <label className="block text-sm font-medium mb-1">{t('label')}</label>
            <span className="block text-xs text-muted-foreground mb-2">{t('hint')}</span>
            <div className="relative flex gap-2">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>

                        <div className="w-full relative">
                            <Input
                                id="rdo-date"
                                value={inputValue}
                                placeholder={t('placeholder')}
                                className="bg-white pr-10 w-full"
                                readOnly
                                onKeyDown={(e) => {
                                    if (e.key === "ArrowDown") {
                                        e.preventDefault();
                                        setOpen(true);
                                    }
                                }}
                            />
                            <Button
                                id="date-picker"
                                variant="ghost"
                                className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                                tabIndex={-1}
                            >
                                <CalendarIcon className="size-3.5" />
                                <span className="sr-only">{t('selectDate')}</span>
                            </Button>
                        </div>

                    </PopoverTrigger>


                    <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="end"
                        alignOffset={-8}
                        sideOffset={10}
                    >
                        <Calendar
                            mode="single"
                            selected={date}
                            captionLayout="dropdown"
                            month={month}
                            onMonthChange={setMonth}
                            onSelect={handleSelect}
                            locale={ptBR}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
} 