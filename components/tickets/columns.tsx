"use client"

import { useMemo } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Pencil } from "lucide-react"
import { useTranslations } from "next-intl"

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Ticket, TicketPriority, TicketStatus, TicketType } from "@/lib/types/ticket"

const statusBadgeVariant: Record<TicketStatus, "default" | "secondary" | "outline" | "destructive"> = {
  open: "default",
  in_progress: "secondary",
  waiting: "outline",
  resolved: "outline",
  closed: "outline",
}

const priorityBadgeVariant: Record<TicketPriority, "default" | "secondary" | "outline" | "destructive"> = {
  low: "outline",
  medium: "secondary",
  high: "destructive",
}

const statusSortOrder: Record<TicketStatus, number> = {
  open: 0,
  in_progress: 1,
  waiting: 2,
  resolved: 3,
  closed: 4,
}

const prioritySortOrder: Record<TicketPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
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

type TicketColumnOptions = {
  onEdit: (ticket: Ticket) => void
}

export const useTicketColumns = ({ onEdit }: TicketColumnOptions) => {
  const t = useTranslations("Tickets")

  const statusLabels = useMemo(
    () => ({
      open: t("table.badges.status.open"),
      in_progress: t("table.badges.status.in_progress"),
      waiting: t("table.badges.status.waiting"),
      resolved: t("table.badges.status.resolved"),
      closed: t("table.badges.status.closed"),
    }),
    [t],
  )

  const priorityLabels = useMemo(
    () => ({
      low: t("table.badges.priority.low"),
      medium: t("table.badges.priority.medium"),
      high: t("table.badges.priority.high"),
    }),
    [t],
  )

  const typeLabels = useMemo(
    () => ({
      customer_request: t("table.badges.type.customer_request"),
      order: t("table.badges.type.order"),
      support: t("table.badges.type.support"),
      complaint: t("table.badges.type.complaint"),
      other: t("table.badges.type.other"),
    }),
    [t],
  )

  return useMemo<ColumnDef<Ticket>[]>(
    () => [
      {
        accessorKey: "ticketNumber",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("table.columns.ticketNumber")} />
        ),
        cell: ({ row }) => (
          <span className="font-mono text-sm font-medium">{row.original.ticketNumber}</span>
        ),
      },
      {
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("table.columns.title")} />
        ),
        cell: ({ row }) => (
          <div className="max-w-[240px]">
            <p className="truncate font-medium">{row.original.title}</p>
            {row.original.customerName && (
              <p className="truncate text-xs text-muted-foreground">{row.original.customerName}</p>
            )}
          </div>
        ),
      },
      {
        accessorKey: "type",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("table.columns.type")} />
        ),
        cell: ({ row }) => (
          <Badge variant="outline">{typeLabels[row.original.type as TicketType]}</Badge>
        ),
        filterFn: (row, _columnId, value) => row.original.type === value,
      },
      {
        accessorKey: "priority",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("table.columns.priority")} />
        ),
        cell: ({ row }) => (
          <Badge variant={priorityBadgeVariant[row.original.priority]}>
            {priorityLabels[row.original.priority]}
          </Badge>
        ),
        filterFn: (row, _columnId, value) => row.original.priority === value,
        sortingFn: (rowA, rowB) =>
          prioritySortOrder[rowA.original.priority] - prioritySortOrder[rowB.original.priority],
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
        accessorKey: "orderReference",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("table.columns.orderReference")} />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.orderReference ?? "—"}</span>
        ),
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
        header: () => <span className="sr-only">{t("table.columns.actions")}</span>,
        cell: ({ row }) => {
          const ticket = row.original

          return (
            <div className="flex items-center justify-end gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => onEdit(ticket)}
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
    [onEdit, priorityLabels, statusLabels, t, typeLabels],
  )
}

export const useTicketColumnLabels = () => {
  const t = useTranslations("Tickets")

  return useMemo(
    () => ({
      ticketNumber: t("table.columns.ticketNumber"),
      title: t("table.columns.title"),
      type: t("table.columns.type"),
      priority: t("table.columns.priority"),
      status: t("table.columns.status"),
      orderReference: t("table.columns.orderReference"),
      createdAt: t("table.columns.createdAt"),
    }),
    [t],
  )
}
