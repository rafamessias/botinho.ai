"use client"

import dynamic from "next/dynamic"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { PanelLeft, PanelLeftClose, TicketIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { ErrorState } from "@/components/ai-training/components/error-state"
import {
  createTicketAction,
  getTicketAction,
  listTicketsAction,
  updateTicketAction,
} from "@/components/server-actions/tickets"
import type { TicketDetailPanelHandle } from "@/components/tickets/ticket-detail-panel"
import { TicketDetailSkeleton } from "@/components/tickets/ticket-detail-skeleton"
import {
  TicketListPanel,
  type TicketTypeFilter,
} from "@/components/tickets/ticket-list-panel"
import type { TicketFormValues } from "@/components/tickets/ticket-modal"
import { useUser } from "@/components/user-provider"
import {
  resolveTicketsBootstrap,
  ticketSessionCache,
} from "@/lib/tickets/ticket-session-cache"
import { DEFAULT_TICKET_STATUS_FILTERS, ticketMatchesStatusFilters } from "@/lib/tickets/ticket-status-filters"
import { mapTicketToListItem, type Ticket, type TicketListItem } from "@/lib/types/ticket"

const TicketDetailPanel = dynamic(
  () =>
    import("@/components/tickets/ticket-detail-panel").then((module) => module.TicketDetailPanel),
  { loading: () => <TicketDetailSkeleton /> },
)

const TicketModal = dynamic(() =>
  import("@/components/tickets/ticket-modal").then((module) => module.TicketModal),
)

const TicketUnsavedDialog = dynamic(() =>
  import("@/components/tickets/ticket-unsaved-dialog").then((module) => module.TicketUnsavedDialog),
)

const SEARCH_DEBOUNCE_MS = 300

type TicketsPageProps = {
  initialTickets: TicketListItem[]
  initialHasMore?: boolean
  initialNextCursor?: string | null
  initialLoadError?: string | null
  hasCompanyAccess: boolean
  initialCompanyId?: string | null
}

const getInitialTicketId = () => {
  if (typeof window === "undefined") {
    return null
  }

  return new URLSearchParams(window.location.search).get("ticket")
}

const seedTicketsSessionFromProps = (
  companyId: string | null,
  data: {
    tickets: TicketListItem[]
    selectedTicketId: string | null
    hasMore: boolean
    nextCursor: string | null
  },
) => {
  if (!companyId || ticketSessionCache.getSnapshot(String(companyId))) {
    return
  }

  ticketSessionCache.seedFromInitialData(String(companyId), {
    tickets: data.tickets,
    selectedTicketId: data.selectedTicketId,
    searchQuery: "",
    statusFilters: DEFAULT_TICKET_STATUS_FILTERS,
    typeFilter: "all",
    showDesktopList: true,
    hasMore: data.hasMore,
    nextCursor: data.nextCursor,
  })
}

const getTicketsMountBootstrap = (companyId: string | null) => {
  const { source, snapshot } = resolveTicketsBootstrap(companyId)
  const isFreshSession =
    source === "session" &&
    companyId != null &&
    ticketSessionCache.isFresh(String(companyId))

  return {
    snapshot,
    hasBootstrap: Boolean(snapshot),
    isFreshSession,
  }
}

export const TicketsPage = ({
  initialTickets,
  initialHasMore = false,
  initialNextCursor = null,
  initialLoadError = null,
  hasCompanyAccess,
  initialCompanyId = null,
}: TicketsPageProps) => {
  const t = useTranslations("Tickets")
  const searchParams = useSearchParams()
  const { user } = useUser()
  const detailPanelRef = useRef<TicketDetailPanelHandle>(null)

  const companyId =
    user?.defaultCompanyId != null ? String(user.defaultCompanyId) : (initialCompanyId ?? null)

  const initialTicketId = searchParams.get("ticket") ?? getInitialTicketId()

  seedTicketsSessionFromProps(companyId, {
    tickets: initialTickets,
    selectedTicketId: initialTicketId,
    hasMore: initialHasMore,
    nextCursor: initialNextCursor,
  })

  const mountBootstrap = getTicketsMountBootstrap(companyId)
  const bootstrapSnapshot = mountBootstrap.snapshot
  const hasBootstrap = mountBootstrap.hasBootstrap
  const isFreshSession = mountBootstrap.isFreshSession

  const [tickets, setTickets] = useState<TicketListItem[]>(
    bootstrapSnapshot?.tickets ?? initialTickets,
  )
  const [isLoadingList, setIsLoadingList] = useState(
    hasCompanyAccess &&
      !hasBootstrap &&
      initialTickets.length === 0 &&
      !initialLoadError,
  )
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(bootstrapSnapshot?.hasMore ?? initialHasMore)
  const [loadError, setLoadError] = useState<string | null>(
    hasBootstrap ? null : initialLoadError,
  )
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(() => {
    if (bootstrapSnapshot?.selectedTicketId) {
      return bootstrapSnapshot.selectedTicketId
    }
    return initialTicketId
  })
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  const [searchQuery, setSearchQuery] = useState(bootstrapSnapshot?.searchQuery ?? "")
  const [statusFilters, setStatusFilters] = useState(
    bootstrapSnapshot?.statusFilters ?? DEFAULT_TICKET_STATUS_FILTERS,
  )
  const [typeFilter, setTypeFilter] = useState<TicketTypeFilter>(
    bootstrapSnapshot?.typeFilter ?? "all",
  )
  const [showDesktopList, setShowDesktopList] = useState(
    bootstrapSnapshot?.showDesktopList ?? true,
  )
  const [showTicketsList, setShowTicketsList] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [pendingTicketId, setPendingTicketId] = useState<string | null>(null)
  const [pendingBack, setPendingBack] = useState(false)

  const ticketsRef = useRef<TicketListItem[]>(bootstrapSnapshot?.tickets ?? initialTickets)
  const selectedTicketIdRef = useRef<string | null>(selectedTicketId)
  const searchQueryRef = useRef(searchQuery)
  const statusFiltersRef = useRef(statusFilters)
  const nextCursorRef = useRef<string | null>(
    bootstrapSnapshot?.nextCursor ?? initialNextCursor,
  )
  const isFetchingTicketsRef = useRef(false)
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFirstFiltersEffectRef = useRef(true)
  const typeFilterRef = useRef(typeFilter)
  const showDesktopListRef = useRef(showDesktopList)
  const previousCompanyIdRef = useRef<string | null>(companyId)
  const fullTicketCacheRef = useRef<Map<string, Ticket>>(new Map())
  const detailRequestIdRef = useRef(0)

  ticketsRef.current = tickets
  selectedTicketIdRef.current = selectedTicketId
  searchQueryRef.current = searchQuery
  statusFiltersRef.current = statusFilters
  typeFilterRef.current = typeFilter
  showDesktopListRef.current = showDesktopList

  const syncTicketParam = useCallback((ticketId: string | null) => {
    if (typeof window === "undefined") return

    const params = new URLSearchParams(window.location.search)
    if (ticketId) {
      params.set("ticket", ticketId)
    } else {
      params.delete("ticket")
    }

    const query = params.toString()
    const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname
    window.history.replaceState(window.history.state, "", nextUrl)
  }, [])

  const persistTicketsSession = useCallback(() => {
    if (!companyId) {
      return
    }

    ticketSessionCache.save({
      companyId: String(companyId),
      tickets: ticketsRef.current,
      selectedTicketId: selectedTicketIdRef.current,
      searchQuery: searchQueryRef.current,
      statusFilters: statusFiltersRef.current,
      typeFilter: typeFilterRef.current,
      showDesktopList: showDesktopListRef.current,
      hasMore,
      nextCursor: nextCursorRef.current,
    })
  }, [companyId, hasMore])

  const fetchTicketsPage = useCallback(
    async (options?: { reset?: boolean; silent?: boolean }) => {
      if (!hasCompanyAccess) {
        setTickets([])
        setHasMore(false)
        nextCursorRef.current = null
        return
      }

      if (isFetchingTicketsRef.current) {
        return
      }

      const reset = options?.reset ?? false
      if (!reset && !nextCursorRef.current) {
        return
      }

      isFetchingTicketsRef.current = true

      if (reset) {
        if (!options?.silent) {
          setIsLoadingList(true)
        }
        nextCursorRef.current = null
      } else {
        setIsLoadingMore(true)
      }

      setLoadError(null)

      try {
        const result = await listTicketsAction({
          search: searchQueryRef.current.trim() || undefined,
          statuses: statusFiltersRef.current,
          type: typeFilterRef.current === "all" ? undefined : typeFilterRef.current,
          pageSize: 20,
          cursor: reset ? undefined : (nextCursorRef.current ?? undefined),
        })

        if (!result.success || !result.data) {
          setLoadError(result.error || t("messages.loadFailed"))
          return
        }

        const incoming = result.data.tickets
        setTickets((previous) => (reset ? incoming : [...previous, ...incoming]))
        setHasMore(result.data.pagination.hasMore)
        nextCursorRef.current = result.data.pagination.nextCursor
      } catch (error) {
        console.error("Failed to load tickets", error)
        setLoadError(t("messages.loadFailed"))
      } finally {
        isFetchingTicketsRef.current = false
        if (reset) {
          setIsLoadingList(false)
        } else {
          setIsLoadingMore(false)
        }
      }
    },
    [hasCompanyAccess, t],
  )

  const loadTickets = useCallback(async () => {
    await fetchTicketsPage({ reset: true })
  }, [fetchTicketsPage])

  const loadMoreTickets = useCallback(() => {
    void fetchTicketsPage({ reset: false })
  }, [fetchTicketsPage])

  const loadSelectedTicket = useCallback(
    async (ticketId: string) => {
      const cached = fullTicketCacheRef.current.get(ticketId)
      if (cached) {
        setSelectedTicket(cached)
        setIsLoadingDetail(false)
        return
      }

      const requestId = detailRequestIdRef.current + 1
      detailRequestIdRef.current = requestId
      setIsLoadingDetail(true)

      try {
        const result = await getTicketAction({ ticketId })
        if (detailRequestIdRef.current !== requestId) {
          return
        }

        if (!result.success || !result.data) {
          throw new Error(result.error || t("messages.loadFailed"))
        }

        fullTicketCacheRef.current.set(ticketId, result.data.ticket)
        setSelectedTicket(result.data.ticket)
      } catch (error) {
        if (detailRequestIdRef.current !== requestId) {
          return
        }

        console.error("Failed to load ticket detail", error)
        toast.error(t("messages.loadFailed"))
        setSelectedTicket(null)
      } finally {
        if (detailRequestIdRef.current === requestId) {
          setIsLoadingDetail(false)
        }
      }
    },
    [t],
  )

  const selectTicket = useCallback(
    (ticketId: string) => {
      setSelectedTicketId(ticketId)
      syncTicketParam(ticketId)
      setShowTicketsList(false)
      void loadSelectedTicket(ticketId)
    },
    [loadSelectedTicket, syncTicketParam],
  )

  const clearSelection = useCallback(() => {
    detailRequestIdRef.current += 1
    setSelectedTicketId(null)
    setSelectedTicket(null)
    setIsLoadingDetail(false)
    syncTicketParam(null)
  }, [syncTicketParam])

  const handleSelectTicket = useCallback(
    (ticketId: string) => {
      if (ticketId === selectedTicketId) return

      if (detailPanelRef.current?.isDirty()) {
        setPendingTicketId(ticketId)
        setPendingBack(false)
        setShowUnsavedDialog(true)
        return
      }

      selectTicket(ticketId)
    },
    [selectTicket, selectedTicketId],
  )

  const handleMobileBack = useCallback(() => {
    if (detailPanelRef.current?.isDirty()) {
      setPendingTicketId(null)
      setPendingBack(true)
      setShowUnsavedDialog(true)
      return
    }
    clearSelection()
  }, [clearSelection])

  const handleConfirmDiscard = useCallback(() => {
    setShowUnsavedDialog(false)
    if (pendingBack) {
      setPendingBack(false)
      clearSelection()
      return
    }
    if (pendingTicketId) {
      selectTicket(pendingTicketId)
      setPendingTicketId(null)
    }
  }, [clearSelection, pendingBack, pendingTicketId, selectTicket])

  const handleSaveTicket = useCallback(
    async (values: TicketFormValues) => {
      if (!selectedTicket) return

      setIsSaving(true)
      try {
        const result = await updateTicketAction({
          ticketId: selectedTicket.id,
          title: values.title,
          description: values.description,
          type: values.type,
          priority: values.priority,
          status: values.status,
          customerId: values.customerId ?? null,
          customerName: values.customerName ?? null,
          orderReference: values.orderReference,
        })

        if (!result.success || !result.data) {
          throw new Error(result.error || "Unable to update ticket")
        }

        const updatedTicket = result.data.ticket
        const updatedListItem = mapTicketToListItem(updatedTicket)
        fullTicketCacheRef.current.set(updatedTicket.id, updatedTicket)

        setTickets((previous) => {
          const next = previous.map((item) =>
            item.id === selectedTicket.id ? updatedListItem : item,
          )

          if (!ticketMatchesStatusFilters(updatedTicket.status, statusFiltersRef.current)) {
            return next.filter((item) => item.id !== selectedTicket.id)
          }

          return next
        })
        setSelectedTicket(updatedTicket)
        ticketSessionCache.detailCache.delete(selectedTicket.id)
        toast.success(t("messages.ticketUpdated"))
      } catch (error) {
        console.error("Failed to save ticket", error)
        const message = error instanceof Error ? error.message : t("messages.ticketSaveError")
        toast.error(message || t("messages.ticketSaveError"))
      } finally {
        setIsSaving(false)
      }
    },
    [selectedTicket, t],
  )

  const handleCreateTicket = useCallback(
    async (values: TicketFormValues) => {
      setIsSaving(true)
      try {
        const result = await createTicketAction({
          title: values.title,
          description: values.description,
          type: values.type,
          priority: values.priority,
          customerId: values.customerId,
          customerName: values.customerName,
          orderReference: values.orderReference,
        })

        if (!result.success || !result.data) {
          throw new Error(result.error || "Unable to create ticket")
        }

        const newTicket = result.data.ticket
        const newListItem = mapTicketToListItem(newTicket)
        fullTicketCacheRef.current.set(newTicket.id, newTicket)

        setTickets((previous) =>
          ticketMatchesStatusFilters(newTicket.status, statusFiltersRef.current)
            ? [newListItem, ...previous]
            : previous,
        )
        setIsCreateModalOpen(false)
        selectTicket(newTicket.id)
        toast.success(t("messages.ticketCreated"))
      } catch (error) {
        console.error("Failed to create ticket", error)
        const message = error instanceof Error ? error.message : t("messages.ticketSaveError")
        toast.error(message || t("messages.ticketSaveError"))
      } finally {
        setIsSaving(false)
      }
    },
    [selectTicket, t],
  )

  useEffect(() => {
    if (previousCompanyIdRef.current === companyId) {
      return
    }

    const previousCompanyId = previousCompanyIdRef.current
    previousCompanyIdRef.current = companyId

    if (previousCompanyId) {
      ticketSessionCache.clear(previousCompanyId)
      fullTicketCacheRef.current.clear()
    }

    if (!companyId) {
      setTickets([])
      setSelectedTicketId(null)
      setSelectedTicket(null)
      setSearchQuery("")
      setStatusFilters(DEFAULT_TICKET_STATUS_FILTERS)
      setTypeFilter("all")
      setShowDesktopList(true)
      setHasMore(false)
      nextCursorRef.current = null
      setLoadError(null)
      return
    }

    const bootstrap = resolveTicketsBootstrap(companyId)
    if (bootstrap.snapshot) {
      setTickets(bootstrap.snapshot.tickets)
      setSelectedTicketId(bootstrap.snapshot.selectedTicketId)
      setSearchQuery(bootstrap.snapshot.searchQuery)
      setStatusFilters(bootstrap.snapshot.statusFilters)
      setTypeFilter(bootstrap.snapshot.typeFilter)
      setShowDesktopList(bootstrap.snapshot.showDesktopList)
      setHasMore(bootstrap.snapshot.hasMore)
      nextCursorRef.current = bootstrap.snapshot.nextCursor
      setLoadError(null)
      return
    }

    setTickets(initialTickets)
    setSelectedTicketId(initialTicketId)
    setSelectedTicket(null)
    setSearchQuery("")
    setStatusFilters(DEFAULT_TICKET_STATUS_FILTERS)
    setTypeFilter("all")
    setShowDesktopList(true)
    setHasMore(initialHasMore)
    nextCursorRef.current = initialNextCursor
    setLoadError(initialLoadError)
  }, [companyId, initialHasMore, initialLoadError, initialNextCursor, initialTicketId, initialTickets])

  useEffect(() => {
    if (!hasCompanyAccess || hasBootstrap) {
      return
    }

    if (initialTickets.length > 0 || initialLoadError) {
      return
    }

    void fetchTicketsPage({ reset: true })
  }, [fetchTicketsPage, hasBootstrap, hasCompanyAccess, initialLoadError, initialTickets.length])

  useEffect(() => {
    if (!selectedTicketId) {
      setSelectedTicket(null)
      setIsLoadingDetail(false)
      return
    }

    void loadSelectedTicket(selectedTicketId)
  }, [loadSelectedTicket, selectedTicketId])

  useEffect(() => {
    if (isFirstFiltersEffectRef.current) {
      isFirstFiltersEffectRef.current = false
      return
    }

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current)
    }

    searchDebounceRef.current = setTimeout(() => {
      void fetchTicketsPage({ reset: true })
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current)
      }
    }
  }, [fetchTicketsPage, searchQuery, statusFilters, typeFilter])

  useEffect(() => {
    if (!isFreshSession || !hasCompanyAccess || tickets.length > 0) {
      return
    }

    void fetchTicketsPage({ reset: true })
  }, [fetchTicketsPage, hasCompanyAccess, isFreshSession, tickets.length])

  useEffect(() => {
    persistTicketsSession()
  }, [
    tickets,
    selectedTicketId,
    searchQuery,
    statusFilters,
    typeFilter,
    showDesktopList,
    hasMore,
    persistTicketsSession,
  ])

  useEffect(() => {
    return () => {
      persistTicketsSession()
    }
  }, [persistTicketsSession])

  useEffect(() => {
    const handlePopState = () => {
      const ticketParam = new URLSearchParams(window.location.search).get("ticket")
      setSelectedTicketId(ticketParam)
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const listPanelProps = useMemo(
    () => ({
      tickets,
      selectedTicketId,
      searchQuery,
      onSearchChange: setSearchQuery,
      statusFilters,
      onStatusFiltersChange: setStatusFilters,
      typeFilter,
      onTypeFilterChange: setTypeFilter,
      onSelectTicket: handleSelectTicket,
      onNewTicket: () => setIsCreateModalOpen(true),
      isLoading: isLoadingList,
      isLoadingMore,
      hasMore,
      onLoadMore: loadMoreTickets,
    }),
    [
      tickets,
      selectedTicketId,
      searchQuery,
      statusFilters,
      typeFilter,
      handleSelectTicket,
      isLoadingList,
      isLoadingMore,
      hasMore,
      loadMoreTickets,
    ],
  )

  if (loadError && tickets.length === 0) {
    return (
      <div className="flex h-[calc(100vh-48px)] w-full items-center justify-center p-6">
        <ErrorState
          icon={TicketIcon}
          title={t("messages.loadFailed")}
          description={loadError}
          retryLabel="Retry"
          onRetry={() => void loadTickets()}
        />
      </div>
    )
  }

  const showMobileDetail = Boolean(selectedTicketId)

  const detailPanel =
    isLoadingDetail && !selectedTicket ? (
      <TicketDetailSkeleton />
    ) : (
      <TicketDetailPanel
        ref={detailPanelRef}
        ticket={selectedTicket}
        isSubmitting={isSaving}
        onSubmit={handleSaveTicket}
        onBack={showMobileDetail ? handleMobileBack : undefined}
      />
    )

  return (
    <div className="flex h-[calc(100vh-48px)] w-full min-w-0 flex-1 flex-col overflow-hidden bg-background">
      <div className="flex min-h-0 min-w-0 w-full flex-1 overflow-hidden">
        {showDesktopList && (
          <div className="hidden w-[340px] shrink-0 overflow-hidden border-r border-border/60 md:flex">
            <TicketListPanel {...listPanelProps} className="w-full" />
          </div>
        )}

        <Sheet open={showTicketsList} onOpenChange={setShowTicketsList}>
          <SheetContent side="left" className="flex w-full flex-col p-0 sm:w-[340px]">
            {showTicketsList ? <TicketListPanel {...listPanelProps} className="w-full" /> : null}
          </SheetContent>
        </Sheet>

        <div
          className={
            showMobileDetail
              ? "flex min-h-0 min-w-0 flex-1 basis-0 flex-col"
              : "hidden min-h-0 min-w-0 flex-1 basis-0 flex-col md:flex"
          }
        >
          <div className="hidden h-14 shrink-0 items-center gap-2 border-b border-border/60 px-4 md:flex">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDesktopList(!showDesktopList)}
              className="hover:bg-muted hover:text-foreground"
              title={showDesktopList ? t("actions.hideTickets") : t("actions.showTickets")}
              aria-label={showDesktopList ? t("actions.hideTickets") : t("actions.showTickets")}
            >
              {showDesktopList ? (
                <PanelLeftClose className="size-4 text-muted-foreground" aria-hidden="true" />
              ) : (
                <PanelLeft className="size-4 text-muted-foreground" aria-hidden="true" />
              )}
            </Button>
          </div>

          <div className="min-h-0 flex-1">{detailPanel}</div>
        </div>

        {!showMobileDetail && (
          <div className="flex min-h-0 min-w-0 flex-1 basis-0 flex-col md:hidden">
            <TicketListPanel {...listPanelProps} className="w-full" />
          </div>
        )}
      </div>

      {isCreateModalOpen ? (
        <TicketModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTicket}
          isSubmitting={isSaving}
        />
      ) : null}

      {showUnsavedDialog ? (
        <TicketUnsavedDialog
          open={showUnsavedDialog}
          onOpenChange={(open) => {
            setShowUnsavedDialog(open)
            if (!open) {
              setPendingTicketId(null)
              setPendingBack(false)
            }
          }}
          title={t("detail.unsavedChangesTitle")}
          description={t("detail.unsavedChanges")}
          cancelLabel={t("form.buttons.cancel")}
          confirmLabel={t("detail.discardChanges")}
          onConfirm={handleConfirmDiscard}
        />
      ) : null}
    </div>
  )
}

export default TicketsPage
