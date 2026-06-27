"use client"

import { useMemo } from "react"
import { Tags } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { CheckboxVisual } from "@/components/ui/checkbox"
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

type CustomerTagFilterProps = {
    availableTags: string[]
    selectedTags: string[]
    onChange: (tags: string[]) => void
    className?: string
}

export const CustomerTagFilter = ({
    availableTags,
    selectedTags,
    onChange,
    className,
}: CustomerTagFilterProps) => {
    const t = useTranslations("Customer")

    const selectedLower = useMemo(() => new Set(selectedTags.map((tag) => tag.toLowerCase())), [selectedTags])

    const toggleTag = (tag: string) => {
        const normalized = tag.toLowerCase()
        if (selectedLower.has(normalized)) {
            onChange(selectedTags.filter((item) => item.toLowerCase() !== normalized))
            return
        }

        onChange([...selectedTags, tag])
    }

    const label =
        selectedTags.length === 0
            ? t("toolbar.tagsAll")
            : t("toolbar.tagsSelected", { count: selectedTags.length })

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn("w-full justify-start sm:w-[180px]", className)}
                    aria-label={t("toolbar.tagsFilter")}
                >
                    <Tags className="mr-2 size-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{label}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[240px] p-0" align="start">
                <Command>
                    <CommandInput placeholder={t("toolbar.tagsSearchPlaceholder")} />
                    <CommandList>
                        <CommandEmpty>{t("toolbar.tagsEmpty")}</CommandEmpty>
                        <CommandGroup>
                            {availableTags.map((tag) => {
                                const isSelected = selectedLower.has(tag.toLowerCase())

                                return (
                                    <CommandItem
                                        key={tag}
                                        value={tag}
                                        onSelect={() => toggleTag(tag)}
                                        className="flex items-center gap-2"
                                    >
                                        <CheckboxVisual checked={isSelected} />
                                        <span>{tag}</span>
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>
                    {selectedTags.length > 0 ? (
                        <div className="border-t p-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="w-full"
                                onClick={() => onChange([])}
                            >
                                {t("toolbar.tagsClear")}
                            </Button>
                        </div>
                    ) : null}
                </Command>
            </PopoverContent>
        </Popover>
    )
}
