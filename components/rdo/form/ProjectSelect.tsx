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
import { Project } from "@/components/types/strapi";
import { useTranslations } from 'next-intl';
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { PopoverClose } from "@radix-ui/react-popover";

export function ProjectSelect({ value, onChange, projects }: {
    value: Project,
    onChange: (v: Project) => void,
    projects: Project[]
}) {
    const [open, setOpen] = React.useState(false);
    const t = useTranslations('form.project');

    return (
        <div>
            <label className="block text-sm font-medium mb-1">{t('label')}</label>
            <span className="block text-xs text-muted-foreground mb-2">{t('hint')}</span>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between bg-white"
                    >
                        {`${value?.id} - ${value?.name}` || t('placeholder')}
                        <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder={t('searchPlaceholder')} className="h-9" />
                        <CommandList>
                            <CommandEmpty>{t('noResults')}</CommandEmpty>
                            <CommandGroup className="max-h-[300px] overflow-y-auto">

                                {projects.map((project) => (
                                    <CommandItem
                                        key={project.id}
                                        value={`${project.id}__${project.name}`}
                                        onSelect={(currentValue) => {

                                            const [id, _name] = currentValue.split('__');
                                            const selected = projects.find(p => String(p.id) === id);
                                            if (selected) {
                                                onChange(selected);
                                                setOpen(false);
                                            }
                                        }}

                                        className={cn(
                                            "cursor-pointer",
                                            value?.id === project.id && "bg-accent"
                                        )}
                                    >
                                        {project.id} - {project.name}

                                        <Check
                                            className={cn(
                                                "ml-auto w-4 h-4",
                                                value?.id === project.id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
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