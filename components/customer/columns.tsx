"use client"

import { useMemo } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { MessageSquarePlus, Pencil } from "lucide-react"
import { useTranslations } from "next-intl"

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Customer, CustomerStatus } from "@/lib/types/customer"

const statusBadgeVariant: Record<CustomerStatus, "default" | "secondary" | "outline"> = {
    active: "default",
    inactive: "outline",
    prospect: "secondary",
}

const statusSortOrder: Record<CustomerStatus, number> = {
    active: 0,
    prospect: 1,
    inactive: 2,
}

const formatDate = (value: string) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
        return value
    }

    return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date)
}

type CustomerColumnOptions = {
    onEdit: (customer: Customer) => void
    onStartConversation?: (customer: Customer) => void
}

export const useCustomerColumns = ({ onEdit, onStartConversation }: CustomerColumnOptions) => {
    const t = useTranslations("Customer")

    const statusLabels = useMemo(
        () => ({
            active: t("table.badges.active"),
            inactive: t("table.badges.inactive"),
            prospect: t("table.badges.prospect"),
        }),
        [t],
    )

    return useMemo<ColumnDef<Customer>[]>(
        () => [
            {
                accessorKey: "name",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title={t("table.columns.name")} />
                ),
                cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
            },
            {
                accessorKey: "phone",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title={t("table.columns.phone")} />
                ),
            },
            {
                accessorKey: "company",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title={t("table.columns.company")} />
                ),
                cell: ({ row }) => (
                    <span className="text-muted-foreground">{row.original.company ?? "—"}</span>
                ),
                sortingFn: (rowA, rowB) =>
                    (rowA.original.company ?? "").localeCompare(rowB.original.company ?? ""),
            },
            {
                accessorKey: "tags",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title={t("table.columns.tags")} />
                ),
                cell: ({ row }) => {
                    const tags = row.original.tags ?? []

                    if (tags.length === 0) {
                        return <span className="text-muted-foreground">—</span>
                    }

                    return (
                        <div className="flex flex-wrap gap-1">
                            {tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )
                },
                sortingFn: (rowA, rowB) =>
                    (rowA.original.tags?.[0] ?? "").localeCompare(rowB.original.tags?.[0] ?? ""),
            },
            {
                accessorKey: "status",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title={t("table.columns.status")} />
                ),
                cell: ({ row }) => (
                    <Badge variant={statusBadgeVariant[row.original.status]}>
                        {statusLabels[row.original.status]}
                    </Badge>
                ),
                filterFn: (row, _columnId, value) => row.original.status === value,
                sortingFn: (rowA, rowB) =>
                    statusSortOrder[rowA.original.status] - statusSortOrder[rowB.original.status],
            },
            {
                accessorKey: "createdAt",
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t("table.columns.createdAt")}
                        className="justify-end"
                    />
                ),
                cell: ({ row }) => (
                    <div className="text-right text-muted-foreground">
                        {formatDate(row.original.createdAt)}
                    </div>
                ),
                sortingFn: (rowA, rowB) =>
                    new Date(rowA.original.createdAt).getTime() - new Date(rowB.original.createdAt).getTime(),
            },
            {
                id: "actions",
                enableSorting: false,
                enableHiding: false,
                header: () => (
                    <span className="sr-only">{t("table.columns.actions")}</span>
                ),
                cell: ({ row }) => {
                    const customer = row.original

                    return (
                        <div className="flex items-center justify-end gap-1">
                            {onStartConversation && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8"
                                            onClick={() => onStartConversation(customer)}
                                            aria-label={t("table.actions.startConversation")}
                                        >
                                            <MessageSquarePlus className="size-4" aria-hidden="true" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>{t("table.actions.startConversation")}</TooltipContent>
                                </Tooltip>
                            )}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8"
                                        onClick={() => onEdit(customer)}
                                        aria-label={t("table.actions.edit")}
                                    >
                                        <Pencil className="size-4" aria-hidden="true" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>{t("table.actions.edit")}</TooltipContent>
                            </Tooltip>
                        </div>
                    )
                },
            },
        ],
        [onEdit, onStartConversation, statusLabels, t],
    )
}

export const useCustomerColumnLabels = () => {
    const t = useTranslations("Customer")

    return useMemo(
        () => ({
            name: t("table.columns.name"),
            phone: t("table.columns.phone"),
            company: t("table.columns.company"),
            tags: t("table.columns.tags"),
            status: t("table.columns.status"),
            createdAt: t("table.columns.createdAt"),
        }),
        [t],
    )
}
