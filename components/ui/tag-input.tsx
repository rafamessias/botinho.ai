"use client"

import { useMemo, useState } from "react"
import { Plus, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type TagInputProps = {
    value: string[]
    onChange: (tags: string[]) => void
    suggestions?: string[]
    placeholder?: string
    searchPlaceholder?: string
    emptyLabel?: string
    createLabel?: (tag: string) => string
    disabled?: boolean
    maxTags?: number
    className?: string
    id?: string
}

const normalizeTag = (tag: string) => tag.trim().toLowerCase()

export const TagInput = ({
    value,
    onChange,
    suggestions = [],
    placeholder = "Add tags...",
    searchPlaceholder = "Search or create tag...",
    emptyLabel = "No tags found.",
    createLabel = (tag) => `Create "${tag}"`,
    disabled = false,
    maxTags = 20,
    className,
    id,
}: TagInputProps) => {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")

    const selectedLower = useMemo(() => new Set(value.map(normalizeTag)), [value])

    const availableSuggestions = useMemo(
        () => suggestions.filter((tag) => !selectedLower.has(normalizeTag(tag))),
        [selectedLower, suggestions],
    )

    const filteredSuggestions = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase()
        if (!normalizedQuery) {
            return availableSuggestions
        }

        return availableSuggestions.filter((tag) => tag.toLowerCase().includes(normalizedQuery))
    }, [availableSuggestions, query])

    const trimmedQuery = query.trim()
    const canCreateTag =
        trimmedQuery.length > 0 &&
        !selectedLower.has(normalizeTag(trimmedQuery)) &&
        !availableSuggestions.some((tag) => normalizeTag(tag) === normalizeTag(trimmedQuery))

    const addTag = (tag: string) => {
        const trimmed = tag.trim()
        if (!trimmed || value.length >= maxTags) {
            return
        }

        if (selectedLower.has(normalizeTag(trimmed))) {
            return
        }

        onChange([...value, trimmed])
        setQuery("")
    }

    const removeTag = (tag: string) => {
        onChange(value.filter((item) => item !== tag))
    }

    return (
        <div className={cn("space-y-2", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id={id}
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled || value.length >= maxTags}
                        className="h-auto min-h-10 w-full justify-start px-3 py-2 font-normal"
                    >
                        <span className="text-left text-muted-foreground">{placeholder}</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder={searchPlaceholder}
                            value={query}
                            onValueChange={setQuery}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" && canCreateTag) {
                                    event.preventDefault()
                                    addTag(trimmedQuery)
                                }
                            }}
                        />
                        <CommandList>
                            {filteredSuggestions.length === 0 && !canCreateTag ? (
                                <CommandEmpty>{emptyLabel}</CommandEmpty>
                            ) : null}
                            <CommandGroup>
                                {canCreateTag ? (
                                    <CommandItem
                                        value={`create-${trimmedQuery}`}
                                        onSelect={() => addTag(trimmedQuery)}
                                    >
                                        <Plus className="mr-2 size-4" aria-hidden="true" />
                                        {createLabel(trimmedQuery)}
                                    </CommandItem>
                                ) : null}
                                {filteredSuggestions.map((tag) => (
                                    <CommandItem key={tag} value={tag} onSelect={() => addTag(tag)}>
                                        {tag}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {value.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {value.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                            <span>{tag}</span>
                            <button
                                type="button"
                                className="rounded-sm p-0.5 hover:bg-muted"
                                onClick={() => removeTag(tag)}
                                disabled={disabled}
                                aria-label={`Remove ${tag}`}
                            >
                                <X className="size-3" aria-hidden="true" />
                            </button>
                        </Badge>
                    ))}
                </div>
            ) : null}
        </div>
    )
}
