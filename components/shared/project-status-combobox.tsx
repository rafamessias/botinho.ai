"use client";
import * as React from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ProjectStatus } from "@/lib/generated/prisma";
import { useTranslations } from 'next-intl';
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const projectStatuses: ProjectStatus[] = ['active', 'wip', 'finished', 'stopped', 'deactivated'];

export function ProjectStatusCombobox({
    value,
    onChange,
    label,
    hint,
    placeholder,
    required = false
}: {
    value: ProjectStatus;
    onChange: (value: ProjectStatus) => void;
    label?: string;
    hint?: string;
    placeholder?: string;
    required?: boolean;
}) {
    const [open, setOpen] = React.useState(false);
    const t = useTranslations('project.edit.status');

    const getStatusLabel = (status: ProjectStatus) => {
        switch (status) {
            case 'active':
                return t('active');
            case 'wip':
                return t('wip');
            case 'finished':
                return t('finished');
            case 'stopped':
                return t('stopped');
            case 'deactivated':
                return t('deactivated');
            default:
                return status;
        }
    };

    const getStatusVariant = (status: ProjectStatus) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-700';
            case 'wip':
                return 'bg-blue-100 text-blue-700';
            case 'finished':
                return 'bg-purple-100 text-purple-700';
            case 'stopped':
                return 'bg-red-100 text-red-700';
            case 'deactivated':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div>
            {label && (
                <label className="font-semibold text-base">{label}</label>
            )}
            {hint && (
                <div className="text-xs text-muted-foreground mb-2">{hint}</div>
            )}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between bg-white"
                    >
                        <div className="flex items-center gap-2">
                            <span className={cn("w-2 h-2 rounded-full", getStatusVariant(value))} />
                            {getStatusLabel(value) || placeholder || t('placeholder')}
                        </div>
                        <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command className="max-w-[632px] min-w-[278px]">
                        <CommandInput placeholder={t('searchPlaceholder')} className="h-9" />
                        <CommandList>
                            <CommandEmpty>{t('noResults')}</CommandEmpty>
                            <CommandGroup className="max-h-[300px] overflow-y-auto w-full">
                                {projectStatuses.map((status) => (
                                    <CommandItem
                                        key={status}
                                        value={status}
                                        onSelect={(currentValue) => {
                                            onChange(currentValue as ProjectStatus);
                                            setOpen(false);
                                        }}
                                        className={cn(
                                            "cursor-pointer",
                                            value === status && "bg-accent"
                                        )}
                                    >
                                        <div className="flex items-center gap-2 w-full">
                                            <span className={cn("w-2 h-2 rounded-full", getStatusVariant(status))} />
                                            {getStatusLabel(status)}
                                            <Check
                                                className={cn(
                                                    "ml-auto w-4 h-4",
                                                    value === status ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
} 