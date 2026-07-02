"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { format, parseISO } from "date-fns"
import { Search } from "lucide-react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  useReactTable,
} from "@tanstack/react-table"

import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ScheduleReservation } from "@/lib/types/schedule"

type ReservationTableProps = {
  reservations: ScheduleReservation[]
  onEdit: (reservation: ScheduleReservation) => void
  onCancel: (reservation: ScheduleReservation) => void
}

const statusVariant = (status: ScheduleReservation["status"]) => {
  switch (status) {
    case "confirmed":
      return "default" as const
    case "pending":
      return "secondary" as const
    case "cancelled":
      return "outline" as const
    case "completed":
      return "default" as const
    case "no_show":
      return "destructive" as const
    default:
      return "secondary" as const
  }
}

export const ReservationTable = ({ reservations, onEdit, onCancel }: ReservationTableProps) => {
  const t = useTranslations("Schedule")
  const [globalFilter, setGlobalFilter] = useState("")

  const columns = useMemo<ColumnDef<ScheduleReservation>[]>(
    () => [
      {
        accessorKey: "reservationNumber",
        header: t("table.number"),
      },
      {
        id: "datetime",
        accessorFn: (row) => row.startAt,
        header: t("table.datetime"),
        cell: ({ row }) => {
          const start = parseISO(row.original.startAt)
          const end = parseISO(row.original.endAt)
          return (
            <div className="whitespace-nowrap">
              <div>{format(start, "PP")}</div>
              <div className="text-xs text-muted-foreground">
                {format(start, "p")} – {format(end, "p")}
              </div>
            </div>
          )
        },
      },
      { accessorKey: "serviceName", header: t("table.service") },
      { accessorKey: "assigneeName", header: t("table.assignee") },
      {
        accessorKey: "customerName",
        header: t("table.customer"),
        cell: ({ row }) => row.original.customerName ?? "—",
      },
      {
        accessorKey: "status",
        header: t("table.status"),
        cell: ({ row }) => (
          <Badge variant={statusVariant(row.original.status)}>
            {t(`status.${row.original.status}`)}
          </Badge>
        ),
      },
      {
        accessorKey: "source",
        header: t("table.source"),
        cell: ({ row }) => t(`source.${row.original.source}`),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const reservation = row.original
          if (reservation.status === "cancelled") return null
          return (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => onEdit(reservation)}>
                {t("actions.edit")}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onCancel(reservation)}>
                {t("actions.cancel")}
              </Button>
            </div>
          )
        },
      },
    ],
    [onCancel, onEdit, t],
  )

  const table = useReactTable({
    data: reservations,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            placeholder={t("table.searchPlaceholder")}
            className="pl-9"
          />
        </div>
        <div className="rounded-md border">
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
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {t("table.empty")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter>
        <DataTablePagination table={table} />
      </CardFooter>
    </Card>
  )
}
