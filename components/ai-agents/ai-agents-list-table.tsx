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
import { Bot, CheckCircle2, Circle, Loader2, Phone, Plus, Search, Trash2 } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import type { WhatsAppSessionOption } from "@/components/server-actions/ai-agents"
import type { AgentListItem } from "@/components/ai-agents/map-agent-views"
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
import { usePersistedTableSorting } from "@/hooks/use-persisted-table-sorting"
import { cn } from "@/lib/utils"

type AgentStatusFilter = "all" | "ready" | "setup"

type AiAgentsListTableProps = {
  agents: AgentListItem[]
  sessions: WhatsAppSessionOption[]
  canDelete: boolean
  deletingId: string | null
  onCreate: () => void
  onDelete: (agent: AgentListItem) => void
}

const formatSessionLabel = (session: WhatsAppSessionOption) =>
  session.label ?? session.phoneNumber ?? session.sessionId

const getSetupSteps = (agent: AgentListItem) => [
  { id: "name", done: agent.name.trim().length > 0 },
  { id: "prompt", done: agent.systemPrompt.trim().length > 0 },
  { id: "phone", done: agent.sessionIds.length > 0 },
  { id: "live", done: agent.sessionIds.length > 0 && agent.autoReply },
]

const getAgentReadyState = (agent: AgentListItem) => {
  const steps = getSetupSteps(agent)
  const completedCount = steps.filter((step) => step.done).length
  return {
    steps,
    completedCount,
    isReady: completedCount === steps.length,
  }
}

const getAssignedNumbersLabel = (
  sessionIds: string[],
  sessions: WhatsAppSessionOption[],
  t: (key: string, values?: Record<string, string | number>) => string,
) => {
  if (sessionIds.length === 0) {
    return t("list.noNumber")
  }

  if (sessionIds.length > 2) {
    return t("list.numbersAssigned", { count: sessionIds.length })
  }

  return sessionIds
    .map((sessionId) => {
      const session = sessions.find((item) => item.sessionId === sessionId)
      return session ? formatSessionLabel(session) : sessionId
    })
    .join(" · ")
}

export const AiAgentsListTable = ({
  agents,
  sessions,
  canDelete,
  deletingId,
  onCreate,
  onDelete,
}: AiAgentsListTableProps) => {
  const t = useTranslations("AiAgents")

  const [sorting, setSorting] = usePersistedTableSorting("ai-agents", [{ id: "name", desc: false }])
  const [globalFilter, setGlobalFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState<AgentStatusFilter>("all")
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const filteredAgents = useMemo(
    () =>
      agents.filter((agent) => {
        if (statusFilter === "all") {
          return true
        }

        const { isReady } = getAgentReadyState(agent)
        return statusFilter === "ready" ? isReady : !isReady
      }),
    [agents, statusFilter],
  )

  const columnFilters = useMemo<ColumnFiltersState>(() => [], [])

  const columns = useMemo<ColumnDef<AgentListItem>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("table.name")} />
        ),
        cell: ({ row }) => {
          const { isReady } = getAgentReadyState(row.original)

          return (
            <Link
              href={`/ai-agents/${row.original.id}`}
              className="font-medium transition-colors hover:text-primary"
            >
              {row.original.name}
              {!isReady && (
                <span className="sr-only"> — {t("list.statusSetup")}</span>
              )}
            </Link>
          )
        },
      },
      {
        id: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("table.status")} />
        ),
        cell: ({ row }) => {
          const { isReady } = getAgentReadyState(row.original)

          return (
            <Badge variant={isReady ? "default" : "secondary"}>
              {isReady ? t("list.statusReady") : t("list.statusSetup")}
            </Badge>
          )
        },
        sortingFn: (rowA, rowB) => {
          const readyA = getAgentReadyState(rowA.original).isReady ? 0 : 1
          const readyB = getAgentReadyState(rowB.original).isReady ? 0 : 1
          return readyA - readyB
        },
      },
      {
        id: "setupProgress",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("table.setup")}
            className="justify-center"
          />
        ),
        cell: ({ row }) => {
          const { completedCount, steps } = getAgentReadyState(row.original)

          return (
            <span className="block text-center tabular-nums text-muted-foreground">
              {completedCount}/{steps.length}
            </span>
          )
        },
        sortingFn: (rowA, rowB) =>
          getAgentReadyState(rowA.original).completedCount -
          getAgentReadyState(rowB.original).completedCount,
      },
      {
        id: "phones",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("table.phones")} />
        ),
        cell: ({ row }) => (
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Phone className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">
              {getAssignedNumbersLabel(row.original.sessionIds, sessions, t)}
            </span>
          </span>
        ),
        sortingFn: (rowA, rowB) =>
          rowA.original.sessionIds.length - rowB.original.sessionIds.length,
      },
      {
        accessorKey: "autoReply",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("table.autoReply")} />
        ),
        cell: ({ row }) => {
          const isActive = row.original.autoReply && row.original.sessionIds.length > 0

          return (
            <Badge variant={isActive ? "outline" : "secondary"} className={cn(isActive && "border-primary/30 text-primary")}>
              {isActive ? t("list.autoReplyOn") : t("list.autoReplyOff")}
            </Badge>
          )
        },
        sortingFn: (rowA, rowB) => {
          const activeA = rowA.original.autoReply && rowA.original.sessionIds.length > 0 ? 1 : 0
          const activeB = rowB.original.autoReply && rowB.original.sessionIds.length > 0 ? 1 : 0
          return activeA - activeB
        },
      },
      {
        id: "actions",
        enableSorting: false,
        header: () => <span className="sr-only">{t("table.actions")}</span>,
        cell: ({ row }) => {
          const agent = row.original
          const { isReady } = getAgentReadyState(agent)

          return (
            <div className="flex items-center justify-end gap-1">
              {canDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/15"
                  disabled={deletingId === agent.id}
                  onClick={() => onDelete(agent)}
                  aria-label={t("list.delete.confirm")}
                >
                  {deletingId === agent.id ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Trash2 className="size-4" aria-hidden="true" />
                  )}
                </Button>
              )}
              <Button asChild size="sm">
                <Link href={`/ai-agents/${agent.id}`}>
                  {isReady ? t("buttons.manageAgent") : t("setup.continueSetup")}
                </Link>
              </Button>
            </div>
          )
        },
      },
    ],
    [canDelete, deletingId, onDelete, sessions, t],
  )

  const table = useReactTable({
    data: filteredAgents,
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
      if (!query) {
        return true
      }

      const agent = row.original
      const phoneLabel = getAssignedNumbersLabel(agent.sessionIds, sessions, t).toLowerCase()

      return agent.name.toLowerCase().includes(query) || phoneLabel.includes(query)
    },
  })

  useEffect(() => {
    setPagination((previous) => ({ ...previous, pageIndex: 0 }))
  }, [globalFilter, statusFilter])

  const rows = table.getRowModel().rows
  const hasAgents = agents.length > 0
  const hasResults = hasAgents && table.getFilteredRowModel().rows.length > 0

  const toolbar = (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
      <label className="relative flex flex-1 sm:max-w-sm" htmlFor="ai-agent-search">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          id="ai-agent-search"
          placeholder={t("toolbar.searchPlaceholder")}
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="pl-9"
          aria-label={t("toolbar.searchPlaceholder")}
          disabled={!hasAgents}
        />
      </label>
      <Select
        value={statusFilter}
        onValueChange={(value) => setStatusFilter(value as AgentStatusFilter)}
        disabled={!hasAgents}
      >
        <SelectTrigger className="w-full sm:w-[180px]" aria-label={t("toolbar.statusFilter")}>
          <SelectValue placeholder={t("toolbar.statusFilter")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("toolbar.statusAll")}</SelectItem>
          <SelectItem value="ready">{t("list.statusReady")}</SelectItem>
          <SelectItem value="setup">{t("list.statusSetup")}</SelectItem>
        </SelectContent>
      </Select>
      <Button
        type="button"
        onClick={onCreate}
        className="w-full shrink-0 sm:ml-auto sm:w-auto"
        aria-label={t("toolbar.addBotinho")}
      >
        <Plus className="mr-2 size-4" aria-hidden="true" />
        {t("toolbar.addBotinho")}
      </Button>
    </div>
  )

  if (!hasAgents) {
    return (
      <div className="space-y-4">
        {toolbar}
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/20 px-6 py-12 text-center">
          <Bot className="size-10 text-muted-foreground" aria-hidden="true" />
          <p className="text-base font-medium">{t("table.empty.title")}</p>
          <p className="max-w-md text-sm text-muted-foreground">{t("table.empty.description")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {toolbar}

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
              const agent = row.original
              const { steps, completedCount, isReady } = getAgentReadyState(agent)

              return (
                <Card key={agent.id} className="gap-0 py-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2 min-w-0">
                        <Link
                          href={`/ai-agents/${agent.id}`}
                          className="text-base font-semibold text-foreground hover:text-primary"
                        >
                          {agent.name}
                        </Link>
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          {steps.map((step) => (
                            <span
                              key={step.id}
                              className={cn(
                                "flex items-center gap-1 text-xs",
                                step.done ? "text-primary" : "text-muted-foreground",
                              )}
                            >
                              {step.done ? (
                                <CheckCircle2 className="size-3.5" aria-hidden="true" />
                              ) : (
                                <Circle className="size-3.5" aria-hidden="true" />
                              )}
                              {t(`setup.checklist.${step.id}` as "setup.checklist.name")}
                            </span>
                          ))}
                        </div>
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Phone className="size-3 shrink-0" aria-hidden="true" />
                          <span className="truncate">
                            {getAssignedNumbersLabel(agent.sessionIds, sessions, t)}
                          </span>
                        </p>
                      </div>
                      <Badge variant={isReady ? "default" : "secondary"}>
                        {isReady ? t("list.statusReady") : t("list.statusSetup")}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {t("table.setup")}: {completedCount}/{steps.length}
                    </p>
                  </CardContent>
                  <CardFooter className="flex items-center justify-end gap-1 px-4 pb-4 pt-0">
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:text-destructive"
                        disabled={deletingId === agent.id}
                        onClick={() => onDelete(agent)}
                        aria-label={t("list.delete.confirm")}
                      >
                        {deletingId === agent.id ? (
                          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                        ) : (
                          <Trash2 className="size-4" aria-hidden="true" />
                        )}
                      </Button>
                    )}
                    <Button asChild size="sm">
                      <Link href={`/ai-agents/${agent.id}`}>
                        {isReady ? t("buttons.manageAgent") : t("setup.continueSetup")}
                      </Link>
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
