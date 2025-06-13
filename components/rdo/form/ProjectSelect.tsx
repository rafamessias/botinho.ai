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

export function ProjectSelect({ value, onChange, projects }: {
    value: Project,
    onChange: (v: Project) => void,
    projects: Project[]
}) {
    const [open, setOpen] = React.useState(false);

    return (
        <div>
            <label className="block text-sm font-medium mb-1">Projeto</label>
            <span className="block text-xs text-muted-foreground mb-2">Essa RDO ficará vinculada ao projeto</span>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {value
                            ? projects.find((p) => p.id === value.id)?.name
                            : "Selecione o projeto"}
                        <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Buscar projeto..." className="h-9" />
                        <CommandList>
                            <CommandEmpty>Nenhum projeto encontrado.</CommandEmpty>
                            <CommandGroup>
                                {projects.map((project) => (
                                    <CommandItem
                                        key={project.id}
                                        data-value={project.name}
                                        onSelect={() => {
                                            onChange(project);
                                            setOpen(false);
                                        }}
                                    >
                                        {project.name}
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