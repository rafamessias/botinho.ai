"use client"

import { useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Copy, MessageSquare, Pencil, Search, Trash2 } from "lucide-react"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import type { TemplateView } from "@/components/ai-training/types"
import { AiTemplateCategory } from "@/lib/types/enums"
import { usePersistedTableSorting } from "@/hooks/use-persisted-table-sorting"

type CategoryFilter = TemplateView["category"] | "all"

type TemplateListTableProps = {
  templates: TemplateView[]
  onEdit: (template: TemplateView) => void
  onCopy: (content: string) => void
  onDelete: (id: string) => void
  isDeletingId: string | null
}

const getCategoryColor = (category: TemplateView["category"]): string => {
  const colors: Record<string, string> = {
    greeting: "bg-primary/10 text-primary",
    orders: "accent-blue",
    products: "accent-purple",
    closing: "accent-orange",
    support: "accent-red",
  }

  return colors[category] || "bg-muted text-muted-foreground"
}

export const TemplateListTable = ({
  templates,
  onEdit,
  onCopy,
  onDelete,
  isDeletingId,
}: TemplateListTableProps) => {
  const t = useTranslations("Templates")

  const [sorting, setSorting] = usePersistedTableSorting("templates", [{ id: "name", desc: false }])
  const [globalFilter, setGlobalFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all")
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const columnFilters = useMemo<ColumnFiltersState>(
    () => (categoryFilter === "all" ? [] : [{ id: "category", value: categoryFilter }]),
    [categoryFilter],
  )

  const columns = useMemo<ColumnDef<TemplateView>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("table.name")} />
        ),
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => onEdit(row.original)}
            className="font-medium text-left hover:text-primary transition-colors"
          >
            {row.original.name}
          </button>
        ),
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("table.category")} />
        ),
        cell: ({ row }) => (
          <Badge className={`${getCategoryColor(row.original.category)} capitalize`}>
            {t(`categories.${row.original.category}`)}
          </Badge>
        ),
        filterFn: (row, _columnId, filterValue) => row.original.category === filterValue,
      },
      {
        accessorKey: "content",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("table.content")} />
        ),
        cell: ({ row }) => (
          <span className="line-clamp-1 max-w-xs text-muted-foreground">{row.original.content}</span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("table.created")} />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground tabular-nums">{row.original.createdAt}</span>
        ),
      },
      {
        id: "actions",
        enableSorting: false,
        header: () => <span className="sr-only">{t("table.actions")}</span>,
        cell: ({ row }) => {
          const template = row.original
          const isDeleting = isDeletingId === template.id

          return (
            <div className="flex items-center justify-end gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => onCopy(template.content)}
                aria-label={t("buttons.copyTemplate")}
              >
                <Copy className="size-4" aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => onEdit(template)}
                aria-label={t("actions.edit")}
              >
                <Pencil className="size-4" aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-destructive hover:text-destructive"
                onClick={() => onDelete(template.id)}
                disabled={isDeleting}
                aria-label={t("actions.delete")}
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </Button>
            </div>
          )
        },
      },
    ],
    [isDeletingId, onCopy, onDelete, onEdit, t],
  )

  const table = useReactTable({
    data: templates,
    columns,
    state: { sorting, globalFilter, columnFilters, pagination },
    getRowId: (row) => row.id,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const query = String(filterValue).trim().toLowerCase()
      if (!query) return true
      return (
        row.original.name.toLowerCase().includes(query) ||
        row.original.content.toLowerCase().includes(query)
      )
    },
  })

  useEffect(() => {
    setPagination((previous) => ({ ...previous, pageIndex: 0 }))
  }, [globalFilter, categoryFilter])

  const rows = table.getRowModel().rows
  const hasTemplates = templates.length > 0
  const hasResults = table.getFilteredRowModel().rows.length > 0

  if (!hasTemplates) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/20 px-6 py-12 text-center">
        <MessageSquare className="size-10 text-muted-foreground" aria-hidden="true" />
        <p className="text-base font-medium">{t("table.empty.title")}</p>
        <p className="max-w-md text-sm text-muted-foreground">{t("table.empty.description")}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
        <label className="relative flex flex-1 sm:max-w-sm" htmlFor="template-search">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="template-search"
            placeholder={t("toolbar.searchPlaceholder")}
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-9"
            aria-label={t("toolbar.searchPlaceholder")}
          />
        </label>
        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value as CategoryFilter)}
        >
          <SelectTrigger className="w-full sm:w-[160px]" aria-label={t("toolbar.categoryFilter")}>
            <SelectValue placeholder={t("toolbar.categoryFilter")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("toolbar.categoryAll")}</SelectItem>
            {Object.values(AiTemplateCategory).map((category) => (
              <SelectItem key={category} value={category}>
                {t(`categories.${category}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
              const template = row.original
              const isDeleting = isDeletingId === template.id

              return (
                <Card key={template.id} className="gap-0 py-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <button
                          type="button"
                          onClick={() => onEdit(template)}
                          className="text-base font-semibold text-foreground hover:text-primary"
                        >
                          {template.name}
                        </button>
                        <p className="line-clamp-2 text-sm text-muted-foreground">{template.content}</p>
                        <p className="text-sm text-muted-foreground">{template.createdAt}</p>
                      </div>
                      <Badge className={getCategoryColor(template.category)}>
                        {t(`categories.${template.category}`)}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-end gap-1 px-4 pb-4 pt-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => onCopy(template.content)}
                      aria-label={t("buttons.copyTemplate")}
                    >
                      <Copy className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => onEdit(template)}
                      aria-label={t("actions.edit")}
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive hover:text-destructive"
                      onClick={() => onDelete(template.id)}
                      disabled={isDeleting}
                      aria-label={t("actions.delete")}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
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
                    <TableRow key={row.id}>
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
