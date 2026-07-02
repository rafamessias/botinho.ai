"use client"

import { memo, useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { Search } from "lucide-react"
import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type VisibilityState,
  useReactTable,
} from "@tanstack/react-table"

import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { useTicketColumnLabels, useTicketColumns } from "@/components/tickets/columns"
import { usePersistedTableSorting } from "@/hooks/use-persisted-table-sorting"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Ticket, TicketStatus, TicketType } from "@/lib/types/ticket"

export type TicketStatusFilter = TicketStatus | "all"
export type TicketTypeFilter = TicketType | "all"

type TicketTableProps = {
  tickets: Ticket[]
  onEdit: (ticket: Ticket) => void
}

const statusBadgeVariant: Record<TicketStatus, "default" | "secondary" | "outline" | "destructive"> = {
  open: "default",
  in_progress: "secondary",
  waiting: "outline",
  resolved: "outline",
  closed: "outline",
}

const priorityBadgeVariant: Record<Ticket["priority"], "default" | "secondary" | "outline" | "destructive"> = {
  low: "outline",
  medium: "secondary",
  high: "destructive",
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

const TicketTableComponent = ({ tickets, onEdit }: TicketTableProps) => {
  const t = useTranslations("Tickets")
  const columns = useTicketColumns({ onEdit })
  const columnLabels = useTicketColumnLabels()

  const [sorting, setSorting] = usePersistedTableSorting("tickets", [
    { id: "createdAt", desc: true },
  ])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState<TicketStatusFilter>("all")
  const [typeFilter, setTypeFilter] = useState<TicketTypeFilter>("all")
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const columnFilters = useMemo<ColumnFiltersState>(() => {
    const filters: ColumnFiltersState = []
    if (statusFilter !== "all") filters.push({ id: "status", value: statusFilter })
    if (typeFilter !== "all") filters.push({ id: "type", value: typeFilter })
    return filters
  }, [statusFilter, typeFilter])

  const table = useReactTable({
    data: tickets,
    columns,
    state: {
      sorting,
      columnVisibility,
      globalFilter,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const query = String(filterValue).trim().toLowerCase()
      if (!query) return true

      const ticket = row.original
      const values = [
        ticket.ticketNumber,
        ticket.title,
        ticket.description,
        ticket.customerName,
        ticket.orderReference,
      ]

      return values.some((value) => value?.toLowerCase().includes(query))
    },
  })

  useEffect(() => {
    setPagination((previous) => ({ ...previous, pageIndex: 0 }))
  }, [globalFilter, statusFilter, typeFilter])

  const rows = table.getRowModel().rows
  const hasTickets = tickets.length > 0
  const hasResults = table.getFilteredRowModel().rows.length > 0

  if (!hasTickets) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/20 px-6 py-12 text-center">
        <p className="text-base font-medium">{t("table.empty.title")}</p>
        <p className="max-w-md text-sm text-muted-foreground">{t("table.empty.description")}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
        <label className="relative flex flex-1 sm:max-w-sm" htmlFor="ticket-search">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="ticket-search"
            placeholder={t("toolbar.searchPlaceholder")}
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-9"
            aria-label={t("toolbar.searchPlaceholder")}
          />
        </label>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as TicketStatusFilter)}
        >
          <SelectTrigger className="w-full sm:w-[160px]" aria-label={t("toolbar.statusFilter")}>
            <SelectValue placeholder={t("toolbar.statusFilter")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("toolbar.statusAll")}</SelectItem>
            {(["open", "in_progress", "waiting", "resolved", "closed"] as const).map((status) => (
              <SelectItem key={status} value={status}>
                {t(`table.badges.status.${status}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={typeFilter}
          onValueChange={(value) => setTypeFilter(value as TicketTypeFilter)}
        >
          <SelectTrigger className="w-full sm:w-[180px]" aria-label={t("toolbar.typeFilter")}>
            <SelectValue placeholder={t("toolbar.typeFilter")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("toolbar.typeAll")}</SelectItem>
            {(["customer_request", "order", "support", "complaint", "other"] as const).map((type) => (
              <SelectItem key={type} value={type}>
                {t(`table.badges.type.${type}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DataTableViewOptions table={table} columnLabels={columnLabels} />
      </div>

      {!hasResults ? (
        <div className="overflow-hidden rounded-md border bg-card">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t("table.messages.noResults")}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : (
        <>
          <div className="grid gap-3 md:hidden">
            {rows.map((row) => {
              const ticket = row.original

              return (
                <Card key={ticket.id} className="gap-0 py-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="font-mono text-xs text-muted-foreground">{ticket.ticketNumber}</p>
                        <h3 className="text-base font-semibold text-foreground">{ticket.title}</h3>
                        {ticket.customerName && (
                          <p className="text-sm text-muted-foreground">{ticket.customerName}</p>
                        )}
                        <div className="flex flex-wrap gap-1 pt-1">
                          <Badge variant="outline">{t(`table.badges.type.${ticket.type}`)}</Badge>
                          <Badge variant={priorityBadgeVariant[ticket.priority]}>
                            {t(`table.badges.priority.${ticket.priority}`)}
                          </Badge>
                        </div>
                      </div>
                      <Badge variant={statusBadgeVariant[ticket.status]}>
                        {t(`table.badges.status.${ticket.status}`)}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between px-4 pb-4 pt-0 text-xs text-muted-foreground">
                    <span>{formatDate(ticket.createdAt)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(ticket)}
                      aria-label={t("table.actions.edit")}
                    >
                      {t("table.actions.edit")}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>

          <div className="hidden md:block">
            <div className="overflow-hidden rounded-md border bg-card">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <DataTablePagination table={table} pageSizeOptions={[5, 10, 20, 50]} />
        </>
      )}
    </div>
  )
}

export const TicketTable = memo(TicketTableComponent)
