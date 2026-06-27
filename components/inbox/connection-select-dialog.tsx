"use client"

import { useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { IconBrandWhatsapp } from "@tabler/icons-react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
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
import type { InboxConnectionView } from "@/components/server-actions/inbox"

type ConnectionSelectDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    connections: InboxConnectionView[]
    selectedConnectionIds: string[]
    onConnectionChange: (sessionIds: string[]) => void
    getConnectionLabel: (connection: InboxConnectionView) => string
}

const getConnectionSearchValue = (
    connection: InboxConnectionView,
    getConnectionLabel: (connection: InboxConnectionView) => string,
) => {
    return [getConnectionLabel(connection), connection.phoneNumber, connection.label, connection.sessionId]
        .filter(Boolean)
        .join(" ")
}

export const ConnectionSelectDialog = ({
    open,
    onOpenChange,
    connections,
    selectedConnectionIds,
    onConnectionChange,
    getConnectionLabel,
}: ConnectionSelectDialogProps) => {
    const t = useTranslations("Inbox.toolbar")
    const [draftConnectionIds, setDraftConnectionIds] = useState<string[]>(selectedConnectionIds)

    useEffect(() => {
        if (open) {
            setDraftConnectionIds(selectedConnectionIds)
        }
    }, [open, selectedConnectionIds])

    const allSelected = draftConnectionIds.length === connections.length && connections.length > 0
    const noneSelected = draftConnectionIds.length === 0

    const selectionSummary = useMemo(() => {
        if (noneSelected) {
            return t("allConnections")
        }

        if (allSelected) {
            return t("selectedCount", { selected: connections.length, total: connections.length })
        }

        return t("selectedCount", {
            selected: draftConnectionIds.length,
            total: connections.length,
        })
    }, [allSelected, connections.length, draftConnectionIds.length, noneSelected, t])

    const toggleConnection = (sessionId: string) => {
        setDraftConnectionIds((previous) =>
            previous.includes(sessionId)
                ? previous.filter((id) => id !== sessionId)
                : [...previous, sessionId],
        )
    }

    const handleSelectAll = () => {
        setDraftConnectionIds(connections.map((connection) => connection.sessionId))
    }

    const handleClearSelection = () => {
        setDraftConnectionIds([])
    }

    const handleApply = () => {
        onConnectionChange(draftConnectionIds)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
                <DialogHeader className="gap-2 border-b px-6 py-4 text-left">
                    <DialogTitle className="flex items-center gap-2">
                        <IconBrandWhatsapp className="size-5" aria-hidden="true" />
                        {t("selectConnectionTitle")}
                    </DialogTitle>
                    <DialogDescription>{t("selectConnectionDescription")}</DialogDescription>
                </DialogHeader>

                <div className="flex items-center justify-between gap-2 border-b px-6 py-3">
                    <p className="text-xs text-muted-foreground">{selectionSummary}</p>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs hover:bg-muted hover:text-foreground dark:hover:bg-muted/50"
                            onClick={handleSelectAll}
                            disabled={allSelected}
                        >
                            {t("selectAll")}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs hover:bg-muted hover:text-foreground dark:hover:bg-muted/50"
                            onClick={handleClearSelection}
                            disabled={noneSelected}
                        >
                            {t("clearSelection")}
                        </Button>
                    </div>
                </div>

                <Command className="min-h-0 flex-1 bg-background">
                    <CommandInput placeholder={t("searchConnectionsPlaceholder")} className="h-11" />
                    <CommandList className="max-h-[min(320px,45vh)]">
                        <CommandEmpty>{t("noConnectionsFound")}</CommandEmpty>
                        <CommandGroup>
                            {connections.map((connection) => {
                                const label = getConnectionLabel(connection)
                                const isSelected = draftConnectionIds.includes(connection.sessionId)
                                const searchValue = getConnectionSearchValue(connection, getConnectionLabel)

                                return (
                                    <CommandItem
                                        key={connection.sessionId}
                                        value={searchValue}
                                        onSelect={() => toggleConnection(connection.sessionId)}
                                        className="group flex items-start gap-3 rounded-md px-4 py-3 data-[selected=true]:bg-muted data-[selected=true]:text-foreground dark:data-[selected=true]:bg-muted/50"
                                    >
                                        <CheckboxVisual
                                            checked={isSelected}
                                            className="mt-0.5 bg-transparent shadow-none dark:bg-transparent group-data-[selected=true]:border-border"
                                        />
                                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                            <span className="truncate text-sm font-medium">{label}</span>
                                            {connection.phoneNumber && connection.label && (
                                                <span className="truncate text-xs text-muted-foreground">
                                                    {connection.phoneNumber}
                                                </span>
                                            )}
                                        </div>
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>

                <DialogFooter className="border-t px-6 py-4 sm:justify-end">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        {t("cancelSelection")}
                    </Button>
                    <Button type="button" onClick={handleApply}>
                        {t("applySelection")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
