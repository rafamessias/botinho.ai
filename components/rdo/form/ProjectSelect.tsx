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
import { Project } from "@/components/types/prisma";
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
    const t = useTranslations('formRDO.project');

    return (
        <div>
            <label className="block text-sm font-medium mb-1">
                {t('label')}
            </label>
            <p className="text-sm text-muted-foreground mb-2">
                {t('hint')}
            </p>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {value ? value.name : t('placeholder')}
                        <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder={t('searchPlaceholder')} />
                        <CommandList>
                            <CommandEmpty>{t('noResults')}</CommandEmpty>
                            <CommandGroup>
                                {projects.map((project) => (
                                    <PopoverClose key={project.id} asChild>
                                        <CommandItem
                                            value={project.name}
                                            onSelect={() => {
                                                onChange(project);
                                                setOpen(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    value?.id === project.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {project.name}
                                        </CommandItem>
                                    </PopoverClose>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
} 