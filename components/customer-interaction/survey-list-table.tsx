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
import {
  Archive,
  BarChart3,
  ClipboardList,
  Copy,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import type { SurveySummaryView } from "@/components/server-actions/surveys"
import { usePersistedTableSorting } from "@/hooks/use-persisted-table-sorting"

type SurveyStatusFilter = SurveySummaryView["status"] | "all"

type SurveyListTableProps = {
  surveys: SurveySummaryView[]
  onEdit: (survey: SurveySummaryView) => void
  onMetrics: (survey: SurveySummaryView) => void
  onDuplicate: (surveyId: string) => void
  onDelete: (surveyId: string) => void
  onArchive: (surveyId: string) => void
  deletingSurveyId?: string | null
}

const statusVariant = (status: SurveySummaryView["status"]) => {
  if (status === "active") return "default" as const
  if (status === "draft") return "secondary" as const
  return "outline" as const
}

const canDeleteSurvey = (survey: SurveySummaryView) => survey.responseCount === 0

type SurveyRowActionsProps = {
  survey: SurveySummaryView
  onEdit: (survey: SurveySummaryView) => void
  onMetrics: (survey: SurveySummaryView) => void
  onDuplicate: (surveyId: string) => void
  onDelete: (surveyId: string) => void
  onArchive: (surveyId: string) => void
  isDeleting?: boolean
  t: ReturnType<typeof useTranslations<"Surveys">>
}

const SurveyRowActions = ({
  survey,
  onEdit,
  onMetrics,
  onDuplicate,
  onDelete,
  onArchive,
  isDeleting = false,
  t,
}: SurveyRowActionsProps) => {
  const deletable = canDeleteSurvey(survey)

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => onEdit(survey)}
        aria-label={t("actions.edit")}
      >
        <Pencil className="size-4" aria-hidden="true" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => onMetrics(survey)}
        disabled={survey.responseCount === 0}
        aria-label={t("actions.viewMetrics")}
      >
        <BarChart3 className="size-4" aria-hidden="true" />
      </Button>
      {deletable ? (
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-destructive hover:text-destructive"
          onClick={() => onDelete(survey.id)}
          disabled={isDeleting}
          aria-label={t("actions.delete")}
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => onArchive(survey.id)}
          aria-label={t("actions.archive")}
        >
          <Archive className="size-4" aria-hidden="true" />
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" aria-label={t("table.moreActions")}>
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onDuplicate(survey.id)}>
            <Copy className="mr-2 size-4" />
            {t("actions.duplicate")}
          </DropdownMenuItem>
          {!deletable && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onArchive(survey.id)}
              >
                <Archive className="mr-2 size-4" />
                {t("actions.archive")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export const SurveyListTable = ({
  surveys,
  onEdit,
  onMetrics,
  onDuplicate,
  onDelete,
  onArchive,
  deletingSurveyId = null,
}: SurveyListTableProps) => {
  const t = useTranslations("Surveys")

  const [sorting, setSorting] = usePersistedTableSorting("surveys", [{ id: "name", desc: false }])
  const [globalFilter, setGlobalFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState<SurveyStatusFilter>("all")
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const columnFilters = useMemo<ColumnFiltersState>(
    () => (statusFilter === "all" ? [] : [{ id: "status", value: statusFilter }]),
    [statusFilter],
  )

  const columns = useMemo<ColumnDef<SurveySummaryView>[]>(
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
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("table.status")} />
        ),
        cell: ({ row }) => (
          <Badge variant={statusVariant(row.original.status)} className="capitalize">
            {t(`status.${row.original.status}`)}
          </Badge>
        ),
        filterFn: (row, _columnId, filterValue) => row.original.status === filterValue,
      },
      {
        accessorKey: "deliveryMode",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("table.delivery")} />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">{t(`deliveryMode.${row.original.deliveryMode}`)}</span>
        ),
      },
      {
        accessorKey: "questionCount",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("table.questions")}
            className="justify-center"
          />
        ),
        cell: ({ row }) => (
          <span className="block text-center tabular-nums text-muted-foreground">
            {row.original.questionCount}
          </span>
        ),
      },
      {
        accessorKey: "responseCount",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("table.responses")}
            className="justify-center"
          />
        ),
        cell: ({ row }) =>
          row.original.responseCount > 0 ? (
            <button
              type="button"
              onClick={() => onMetrics(row.original)}
              className="block w-full text-center font-medium tabular-nums text-primary hover:underline"
            >
              {row.original.responseCount}
            </button>
          ) : (
            <span className="block text-center tabular-nums text-muted-foreground">0</span>
          ),
      },
      {
        id: "actions",
        enableSorting: false,
        header: () => <span className="sr-only">{t("table.actions")}</span>,
        cell: ({ row }) => {
          const survey = row.original
          return (
            <SurveyRowActions
              survey={survey}
              onEdit={onEdit}
              onMetrics={onMetrics}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
              onArchive={onArchive}
              isDeleting={deletingSurveyId === survey.id}
              t={t}
            />
          )
        },
      },
    ],
    [deletingSurveyId, onArchive, onDelete, onDuplicate, onEdit, onMetrics, t],
  )

  const table = useReactTable({
    data: surveys,
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
      return row.original.name.toLowerCase().includes(query)
    },
  })

  useEffect(() => {
    setPagination((previous) => ({ ...previous, pageIndex: 0 }))
  }, [globalFilter, statusFilter])

  const rows = table.getRowModel().rows
  const hasSurveys = surveys.length > 0
  const hasResults = table.getFilteredRowModel().rows.length > 0

  if (!hasSurveys) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/20 px-6 py-12 text-center">
        <ClipboardList className="size-10 text-muted-foreground" aria-hidden="true" />
        <p className="text-base font-medium">{t("table.empty.title")}</p>
        <p className="max-w-md text-sm text-muted-foreground">{t("table.empty.description")}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
        <label className="relative flex flex-1 sm:max-w-sm" htmlFor="survey-search">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="survey-search"
            placeholder={t("toolbar.searchPlaceholder")}
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-9"
            aria-label={t("toolbar.searchPlaceholder")}
          />
        </label>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as SurveyStatusFilter)}>
          <SelectTrigger className="w-full sm:w-[160px]" aria-label={t("toolbar.statusFilter")}>
            <SelectValue placeholder={t("toolbar.statusFilter")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("toolbar.statusAll")}</SelectItem>
            <SelectItem value="active">{t("status.active")}</SelectItem>
            <SelectItem value="draft">{t("status.draft")}</SelectItem>
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
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
              const survey = row.original
              return (
                <Card key={survey.id} className="gap-0 py-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <button
                          type="button"
                          onClick={() => onEdit(survey)}
                          className="text-base font-semibold text-foreground hover:text-primary"
                        >
                          {survey.name}
                        </button>
                        <p className="text-sm text-muted-foreground">
                          {t(`deliveryMode.${survey.deliveryMode}`)} · {survey.questionCount}{" "}
                          {t("table.questions").toLowerCase()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {survey.responseCount} {t("list.responses")}
                        </p>
                      </div>
                      <Badge variant={statusVariant(survey.status)}>{t(`status.${survey.status}`)}</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-end gap-1 px-4 pb-4 pt-0">
                    <SurveyRowActions
                      survey={survey}
                      onEdit={onEdit}
                      onMetrics={onMetrics}
                      onDuplicate={onDuplicate}
                      onDelete={onDelete}
                      onArchive={onArchive}
                      isDeleting={deletingSurveyId === survey.id}
                      t={t}
                    />
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
