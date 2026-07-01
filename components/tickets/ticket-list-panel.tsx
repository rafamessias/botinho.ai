"use client"

import { useEffect, useMemo, useRef } from "react"
import { useTranslations } from "next-intl"
import { ChevronDown, Loader2, Search, TicketPlus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ALL_TICKET_STATUSES } from "@/lib/tickets/ticket-status-filters"
import { cn } from "@/lib/utils"
import type { Ticket, TicketStatus, TicketType } from "@/lib/types/ticket"

export type TicketTypeFilter = TicketType | "all"

type TicketListPanelProps = {
  tickets: Ticket[]
  selectedTicketId: string | null
  searchQuery: string
  onSearchChange: (value: string) => void
  statusFilters: TicketStatus[]
  onStatusFiltersChange: (value: TicketStatus[]) => void
  typeFilter: TicketTypeFilter
  onTypeFilterChange: (value: TicketTypeFilter) => void
  onSelectTicket: (ticketId: string) => void
  onNewTicket: () => void
  isLoading?: boolean
  isLoadingMore?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  className?: string
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

const formatListTimestamp = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const now = new Date()
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()

  if (isToday) {
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(date)
}

const formatStatusFilterLabel = (
  statusFilters: TicketStatus[],
  t: (key: string, values?: Record<string, string | number>) => string,
) => {
  if (statusFilters.length === 0 || statusFilters.length === ALL_TICKET_STATUSES.length) {
    return t("toolbar.statusAll")
  }

  if (statusFilters.length === 1) {
    return t(`table.badges.status.${statusFilters[0]}`)
  }

  if (statusFilters.length === 2) {
    return statusFilters.map((status) => t(`table.badges.status.${status}`)).join(", ")
  }

  return t("toolbar.statusCount", { count: statusFilters.length })
}

export const TicketListPanel = ({
  tickets,
  selectedTicketId,
  searchQuery,
  onSearchChange,
  statusFilters,
  onStatusFiltersChange,
  typeFilter,
  onTypeFilterChange,
  onSelectTicket,
  onNewTicket,
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
  className,
}: TicketListPanelProps) => {
  const t = useTranslations("Tickets")
  const loadMoreSentinelRef = useRef<HTMLDivElement>(null)

  const sortedTickets = useMemo(
    () =>
      [...tickets].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ),
    [tickets],
  )

  const statusFilterLabel = useMemo(
    () => formatStatusFilterLabel(statusFilters, t),
    [statusFilters, t],
  )

  useEffect(() => {
    if (!hasMore || isLoading || isLoadingMore || !onLoadMore) {
      return
    }

    const sentinel = loadMoreSentinelRef.current
    if (!sentinel) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onLoadMore()
        }
      },
      { root: sentinel.parentElement, rootMargin: "120px" },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, isLoading, isLoadingMore, onLoadMore, sortedTickets.length])

  const handleToggleStatus = (status: TicketStatus, checked: boolean) => {
    if (checked) {
      onStatusFiltersChange([...new Set([...statusFilters, status])])
      return
    }

    const next = statusFilters.filter((item) => item !== status)
    onStatusFiltersChange(next)
  }

  return (
    <div className={cn("flex h-full flex-col bg-background", className)}>
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border/60 px-4">
        <h2 className="shrink-0 text-sm font-semibold text-foreground">{t("list.title")}</h2>
        <Button size="sm" onClick={onNewTicket} aria-label={t("toolbar.addTicket")}>
          <TicketPlus className="size-4" aria-hidden="true" />
          {t("toolbar.addTicket")}
        </Button>
      </header>

      <div className="shrink-0 space-y-2 border-b border-border/60 p-3">
        <label className="relative block" htmlFor="ticket-list-search">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="ticket-list-search"
            placeholder={t("toolbar.searchPlaceholder")}
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-9 pl-9"
            aria-label={t("toolbar.searchPlaceholder")}
          />
        </label>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-8 flex-1 justify-between px-3 text-xs font-normal"
                aria-label={t("toolbar.statusFilter")}
              >
                <span className="truncate">{statusFilterLabel}</span>
                <ChevronDown className="size-4 shrink-0 opacity-50" aria-hidden="true" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-56 p-2">
              <div className="space-y-1">
                {ALL_TICKET_STATUSES.map((status) => {
                  const checked = statusFilters.includes(status)
                  const checkboxId = `ticket-status-filter-${status}`

                  return (
                    <label
                      key={status}
                      htmlFor={checkboxId}
                      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                    >
                      <Checkbox
                        id={checkboxId}
                        checked={checked}
                        onCheckedChange={(value) => handleToggleStatus(status, value === true)}
                      />
                      <span>{t(`table.badges.status.${status}`)}</span>
                    </label>
                  )
                })}
              </div>
              <div className="mt-2 flex gap-2 border-t border-border/60 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 flex-1 text-xs"
                  onClick={() => onStatusFiltersChange([...ALL_TICKET_STATUSES])}
                >
                  {t("toolbar.statusSelectAll")}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 flex-1 text-xs"
                  onClick={() => onStatusFiltersChange([])}
                >
                  {t("toolbar.statusClear")}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Select
            value={typeFilter}
            onValueChange={(value) => onTypeFilterChange(value as TicketTypeFilter)}
          >
            <SelectTrigger className="h-8 flex-1 text-xs" aria-label={t("toolbar.typeFilter")}>
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
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 px-4 py-12 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            {t("messages.loading")}
          </div>
        ) : tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
            <p className="text-sm font-medium">{t("table.empty.title")}</p>
            <p className="text-xs text-muted-foreground">{t("table.empty.description")}</p>
          </div>
        ) : sortedTickets.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            {t("table.messages.noResults")}
          </p>
        ) : (
          <ul className="divide-y divide-border/60">
            {sortedTickets.map((ticket) => {
              const isSelected = ticket.id === selectedTicketId

              return (
                <li key={ticket.id}>
                  <button
                    type="button"
                    onClick={() => onSelectTicket(ticket.id)}
                    className={cn(
                      "flex w-full flex-col gap-1.5 px-4 py-3 text-left transition-colors hover:bg-muted/50",
                      isSelected && "bg-muted",
                    )}
                    aria-current={isSelected ? "true" : undefined}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        {ticket.ticketNumber}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatListTimestamp(ticket.updatedAt)}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-sm font-medium text-foreground">{ticket.title}</p>
                    {ticket.customerName && (
                      <p className="truncate text-xs text-muted-foreground">{ticket.customerName}</p>
                    )}
                    <div className="flex flex-wrap gap-1">
                      <Badge variant={statusBadgeVariant[ticket.status]} className="text-[10px]">
                        {t(`table.badges.status.${ticket.status}`)}
                      </Badge>
                      <Badge variant={priorityBadgeVariant[ticket.priority]} className="text-[10px]">
                        {t(`table.badges.priority.${ticket.priority}`)}
                      </Badge>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
        {isLoadingMore && (
          <div className="flex items-center justify-center gap-2 px-4 py-4 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            {t("messages.loadingMore")}
          </div>
        )}
        {hasMore && <div ref={loadMoreSentinelRef} className="h-1 w-full" aria-hidden="true" />}
      </div>
    </div>
  )
}
