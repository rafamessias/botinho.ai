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
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"
import {
  BarChart3,
  Copy,
  Loader2,
  Megaphone,
  MoreHorizontal,
  Pause,
  Pencil,
  Play,
  Search,
  XCircle,
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { CustomerTagFilter } from "@/components/customer/customer-tag-filter"
import type { CampaignSummaryView } from "@/components/server-actions/campaigns"
import type { CampaignStatus } from "@/lib/types/campaign"

type CampaignStatusFilter = CampaignStatus | "all"

type CampaignListTableProps = {
  campaigns: CampaignSummaryView[]
  onEdit: (campaign: CampaignSummaryView) => void
  onMetrics: (campaign: CampaignSummaryView) => void
  onLaunch: (campaignId: string) => void
  onPause: (campaignId: string) => void
  onResume: (campaignId: string) => void
  onCancel: (campaignId: string) => void
  onDuplicate: (campaignId: string) => void
  launchingCampaignId?: string | null
}

const statusVariant = (status: CampaignSummaryView["status"]) => {
  switch (status) {
    case "running":
      return "default" as const
    case "completed":
      return "secondary" as const
    case "cancelled":
      return "destructive" as const
    default:
      return "outline" as const
  }
}

const campaignMatchesTagFilter = (campaign: CampaignSummaryView, selectedTags: string[]) => {
  if (selectedTags.length === 0) return true
  const campaignTagsLower = new Set(campaign.targetTags.map((tag) => tag.toLowerCase()))
  return selectedTags.some((tag) => campaignTagsLower.has(tag.toLowerCase()))
}

export const CampaignListTable = ({
  campaigns,
  onEdit,
  onMetrics,
  onLaunch,
  onPause,
  onResume,
  onCancel,
  onDuplicate,
  launchingCampaignId = null,
}: CampaignListTableProps) => {
  const t = useTranslations("Campaigns")

  const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: false }])
  const [globalFilter, setGlobalFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState<CampaignStatusFilter>("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>()
    campaigns.forEach((campaign) => {
      campaign.targetTags.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b))
  }, [campaigns])

  const tagFilteredCampaigns = useMemo(
    () => campaigns.filter((campaign) => campaignMatchesTagFilter(campaign, selectedTags)),
    [campaigns, selectedTags],
  )

  const columnFilters = useMemo<ColumnFiltersState>(
    () => (statusFilter === "all" ? [] : [{ id: "status", value: statusFilter }]),
    [statusFilter],
  )

  const columns = useMemo<ColumnDef<CampaignSummaryView>[]>(
    () => [
      {
        accessorKey: "name",
        header: t("table.name"),
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => onEdit(row.original)}
            className="text-left font-medium transition-colors hover:text-primary"
          >
            {row.original.name}
          </button>
        ),
      },
      {
        accessorKey: "status",
        header: t("table.status"),
        cell: ({ row }) => (
          <Badge variant={statusVariant(row.original.status)} className="capitalize">
            {t(`status.${row.original.status}`)}
          </Badge>
        ),
        filterFn: (row, _columnId, filterValue) => row.original.status === filterValue,
      },
      {
        id: "audienceCount",
        header: () => <span className="block text-center">{t("table.contacts")}</span>,
        cell: ({ row }) => (
          <span className="block text-center tabular-nums font-medium">
            {row.original.audienceCount}
          </span>
        ),
        sortingFn: (rowA, rowB) => rowA.original.audienceCount - rowB.original.audienceCount,
      },
      {
        id: "progress",
        header: () => <span className="block text-center">{t("table.progress")}</span>,
        cell: ({ row }) => {
          const { delivered, targeted } = row.original.metrics
          if (targeted === 0) {
            return <span className="block text-center text-muted-foreground">—</span>
          }
          return (
            <span className="block text-center tabular-nums text-muted-foreground">
              {delivered}/{targeted}
            </span>
          )
        },
        sortingFn: (rowA, rowB) =>
          rowA.original.metrics.delivered - rowB.original.metrics.delivered,
      },
      {
        accessorKey: "targetTags",
        header: t("table.tags"),
        cell: ({ row }) => {
          const tags = row.original.targetTags
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
          (rowA.original.targetTags[0] ?? "").localeCompare(rowB.original.targetTags[0] ?? ""),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">{t("table.actions")}</span>,
        cell: ({ row }) => {
          const campaign = row.original
          const canLaunch = ["draft", "scheduled"].includes(campaign.status)
          const canPause = campaign.status === "running"
          const canResume = campaign.status === "paused"
          const canCancel = ["draft", "scheduled", "running", "paused"].includes(campaign.status)
          const isLaunching = launchingCampaignId === campaign.id

          return (
            <div className="flex items-center justify-end gap-1">
              {canLaunch && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      disabled={isLaunching || campaign.audienceCount === 0}
                      onClick={() => onLaunch(campaign.id)}
                      aria-label={t("actions.start")}
                    >
                      {isLaunching ? (
                        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <Play className="size-4" aria-hidden="true" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("actions.start")}</TooltipContent>
                </Tooltip>
              )}
              {canPause && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => onPause(campaign.id)}
                      aria-label={t("actions.pause")}
                    >
                      <Pause className="size-4" aria-hidden="true" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("actions.pause")}</TooltipContent>
                </Tooltip>
              )}
              {canResume && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => onResume(campaign.id)}
                      aria-label={t("actions.resume")}
                    >
                      <Play className="size-4" aria-hidden="true" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("actions.resume")}</TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => onEdit(campaign)}
                    aria-label={t("actions.edit")}
                  >
                    <Pencil className="size-4" aria-hidden="true" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("actions.edit")}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => onMetrics(campaign)}
                    aria-label={t("actions.metrics")}
                  >
                    <BarChart3 className="size-4" aria-hidden="true" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("actions.metrics")}</TooltipContent>
              </Tooltip>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    aria-label={t("table.moreActions")}
                  >
                    <MoreHorizontal className="size-4" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onDuplicate(campaign.id)}>
                    <Copy className="mr-2 size-4" />
                    {t("actions.duplicate")}
                  </DropdownMenuItem>
                  {canCancel && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onCancel(campaign.id)}
                      >
                        <XCircle className="mr-2 size-4" />
                        {t("actions.cancel")}
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        },
      },
    ],
    [launchingCampaignId, onCancel, onDuplicate, onEdit, onLaunch, onMetrics, onPause, onResume, t],
  )

  const table = useReactTable({
    data: tagFilteredCampaigns,
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
      const campaign = row.original
      return (
        campaign.name.toLowerCase().includes(query) ||
        campaign.targetTags.some((tag) => tag.toLowerCase().includes(query))
      )
    },
  })

  useEffect(() => {
    setPagination((previous) => ({ ...previous, pageIndex: 0 }))
  }, [globalFilter, statusFilter, selectedTags])

  const rows = table.getRowModel().rows
  const hasCampaigns = campaigns.length > 0
  const hasResults = table.getFilteredRowModel().rows.length > 0

  if (!hasCampaigns) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/20 px-6 py-12 text-center">
        <Megaphone className="size-10 text-muted-foreground" aria-hidden="true" />
        <p className="text-base font-medium">{t("table.empty.title")}</p>
        <p className="max-w-md text-sm text-muted-foreground">{t("table.empty.description")}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
        <label className="relative flex flex-1 sm:max-w-sm" htmlFor="campaign-search">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="campaign-search"
            placeholder={t("toolbar.searchPlaceholder")}
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-9"
            aria-label={t("toolbar.searchPlaceholder")}
          />
        </label>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as CampaignStatusFilter)}
        >
          <SelectTrigger className="w-full sm:w-[160px]" aria-label={t("toolbar.statusFilter")}>
            <SelectValue placeholder={t("toolbar.statusFilter")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("toolbar.statusAll")}</SelectItem>
            <SelectItem value="draft">{t("status.draft")}</SelectItem>
            <SelectItem value="scheduled">{t("status.scheduled")}</SelectItem>
            <SelectItem value="running">{t("status.running")}</SelectItem>
            <SelectItem value="paused">{t("status.paused")}</SelectItem>
            <SelectItem value="completed">{t("status.completed")}</SelectItem>
          </SelectContent>
        </Select>
        {availableTags.length > 0 ? (
          <CustomerTagFilter
            availableTags={availableTags}
            selectedTags={selectedTags}
            onChange={setSelectedTags}
          />
        ) : null}
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
              const campaign = row.original
              const canLaunch = ["draft", "scheduled"].includes(campaign.status)
              const canPause = campaign.status === "running"
              const canResume = campaign.status === "paused"
              const isLaunching = launchingCampaignId === campaign.id

              return (
                <Card key={campaign.id} className="gap-0 py-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <button
                          type="button"
                          onClick={() => onEdit(campaign)}
                          className="text-base font-semibold text-foreground hover:text-primary"
                        >
                          {campaign.name}
                        </button>
                        <p className="text-sm text-muted-foreground">
                          {t("table.contacts")}: {campaign.audienceCount}
                          {campaign.metrics.targeted > 0 && (
                            <>
                              {" "}
                              · {campaign.metrics.delivered}/{campaign.metrics.targeted}{" "}
                              {t("list.delivered")}
                            </>
                          )}
                        </p>
                        {campaign.targetTags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {campaign.targetTags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <Badge variant={statusVariant(campaign.status)}>
                        {t(`status.${campaign.status}`)}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-end gap-1 px-4 pb-4 pt-0">
                    {canLaunch && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        disabled={isLaunching || campaign.audienceCount === 0}
                        onClick={() => onLaunch(campaign.id)}
                        aria-label={t("actions.start")}
                      >
                        {isLaunching ? (
                          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                        ) : (
                          <Play className="size-4" aria-hidden="true" />
                        )}
                      </Button>
                    )}
                    {canPause && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => onPause(campaign.id)}
                        aria-label={t("actions.pause")}
                      >
                        <Pause className="size-4" aria-hidden="true" />
                      </Button>
                    )}
                    {canResume && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => onResume(campaign.id)}
                        aria-label={t("actions.resume")}
                      >
                        <Play className="size-4" aria-hidden="true" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => onEdit(campaign)}
                      aria-label={t("actions.edit")}
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => onMetrics(campaign)}
                      aria-label={t("actions.metrics")}
                    >
                      <BarChart3 className="size-4" aria-hidden="true" />
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
