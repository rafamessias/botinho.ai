"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  PanelLeft,
  PanelLeftClose,
  TicketIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ErrorState } from "@/components/ai-training/components/error-state"
import {
  createTicketAction,
  listTicketsAction,
  updateTicketAction,
} from "@/components/server-actions/tickets"
import {
  TicketDetailPanel,
  type TicketDetailPanelHandle,
} from "@/components/tickets/ticket-detail-panel"
import {
  TicketListPanel,
  type TicketTypeFilter,
} from "@/components/tickets/ticket-list-panel"
import { TicketModal, type TicketFormValues } from "@/components/tickets/ticket-modal"
import { useUser } from "@/components/user-provider"
import {
  resolveTicketsBootstrap,
  ticketSessionCache,
} from "@/lib/tickets/ticket-session-cache"
import { DEFAULT_TICKET_STATUS_FILTERS, ticketMatchesStatusFilters } from "@/lib/tickets/ticket-status-filters"
import type { Ticket, TicketStatus } from "@/lib/types/ticket"

const SEARCH_DEBOUNCE_MS = 300

type TicketsPageProps = {
  initialTickets: Ticket[]
  initialHasMore?: boolean
  initialNextCursor?: string | null
  initialLoadError?: string | null
  hasCompanyAccess: boolean
  initialCompanyId?: string | null
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

  const mountBootstrap = getTicketsMountBootstrap(companyId)
  const bootstrapSnapshot = mountBootstrap.snapshot
  const hasBootstrap = mountBootstrap.hasBootstrap
  const isFreshSession = mountBootstrap.isFreshSession

  const [tickets, setTickets] = useState<Ticket[]>(
    bootstrapSnapshot?.tickets ?? initialTickets,
  )
  const [isLoadingList, setIsLoadingList] = useState(
    hasCompanyAccess && !hasBootstrap && initialTickets.length === 0,
  )
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [loadError, setLoadError] = useState<string | null>(
    hasBootstrap ? null : initialLoadError,
  )
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(() => {
    if (bootstrapSnapshot?.selectedTicketId) {
      return bootstrapSnapshot.selectedTicketId
    }
    return searchParams.get("ticket")
  })
  const [searchQuery, setSearchQuery] = useState(bootstrapSnapshot?.searchQuery ?? "")
  const [statusFilters, setStatusFilters] = useState<TicketStatus[]>(
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

  const ticketsRef = useRef<Ticket[]>(bootstrapSnapshot?.tickets ?? initialTickets)
  const selectedTicketIdRef = useRef<string | null>(selectedTicketId)
  const searchQueryRef = useRef(searchQuery)
  const statusFiltersRef = useRef(statusFilters)
  const nextCursorRef = useRef<string | null>(initialNextCursor)
  const isFetchingTicketsRef = useRef(false)
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFirstFiltersEffectRef = useRef(true)
  const typeFilterRef = useRef(typeFilter)
  const showDesktopListRef = useRef(showDesktopList)
  const previousCompanyIdRef = useRef<string | null>(companyId)
  const hasSeededSessionRef = useRef(hasBootstrap)

  ticketsRef.current = tickets
  selectedTicketIdRef.current = selectedTicketId
  searchQueryRef.current = searchQuery
  statusFiltersRef.current = statusFilters
  typeFilterRef.current = typeFilter
  showDesktopListRef.current = showDesktopList

  const selectedTicket = useMemo(
    () => tickets.find((ticket) => ticket.id === selectedTicketId) ?? null,
    [tickets, selectedTicketId],
  )

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
    })
  }, [companyId])

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

  const selectTicket = useCallback(
    (ticketId: string) => {
      setSelectedTicketId(ticketId)
      syncTicketParam(ticketId)
      setShowTicketsList(false)
    },
    [syncTicketParam],
  )

  const clearSelection = useCallback(() => {
    setSelectedTicketId(null)
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
        setTickets((previous) => {
          const next = previous.map((item) =>
            item.id === selectedTicket.id ? updatedTicket : item,
          )

          if (!ticketMatchesStatusFilters(updatedTicket.status, statusFiltersRef.current)) {
            return next.filter((item) => item.id !== selectedTicket.id)
          }

          return next
        })
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
        setTickets((previous) =>
          ticketMatchesStatusFilters(newTicket.status, statusFiltersRef.current)
            ? [newTicket, ...previous]
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
    if (!companyId || hasSeededSessionRef.current) {
      return
    }

    const ticketFromUrl =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("ticket")
        : null

    ticketSessionCache.seedFromInitialData(companyId, {
      tickets: initialTickets,
      selectedTicketId: ticketFromUrl,
      searchQuery: "",
      statusFilters: DEFAULT_TICKET_STATUS_FILTERS,
      typeFilter: "all",
      showDesktopList: true,
    })
    hasSeededSessionRef.current = true
  }, [companyId, initialTickets])

  useEffect(() => {
    if (previousCompanyIdRef.current === companyId) {
      return
    }

    const previousCompanyId = previousCompanyIdRef.current
    previousCompanyIdRef.current = companyId

    if (previousCompanyId) {
      ticketSessionCache.clear(previousCompanyId)
    }

    if (!companyId) {
      setTickets([])
      setSelectedTicketId(null)
      setSearchQuery("")
      setStatusFilters(DEFAULT_TICKET_STATUS_FILTERS)
      setTypeFilter("all")
      setShowDesktopList(true)
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
      setLoadError(null)
      hasSeededSessionRef.current = true
      return
    }

    setTickets(initialTickets)
    setSelectedTicketId(
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("ticket")
        : null,
    )
    setSearchQuery("")
    setStatusFilters(DEFAULT_TICKET_STATUS_FILTERS)
    setTypeFilter("all")
    setShowDesktopList(true)
    setLoadError(initialLoadError)
    hasSeededSessionRef.current = false
  }, [companyId, initialLoadError, initialTickets])

  useEffect(() => {
    if (!hasCompanyAccess || hasBootstrap) {
      return
    }

    void fetchTicketsPage({ reset: true, silent: initialTickets.length > 0 })
  }, [fetchTicketsPage, hasBootstrap, hasCompanyAccess, initialTickets.length])

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

  const listPanelProps = {
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
  }

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
            <TicketListPanel {...listPanelProps} className="w-full" />
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

          <div className="min-h-0 flex-1">
            <TicketDetailPanel
              ref={detailPanelRef}
              ticket={selectedTicket}
              isSubmitting={isSaving}
              onSubmit={handleSaveTicket}
              onBack={showMobileDetail ? handleMobileBack : undefined}
            />
          </div>
        </div>

        {!showMobileDetail && (
          <div className="flex min-h-0 min-w-0 flex-1 basis-0 flex-col md:hidden">
            <TicketListPanel {...listPanelProps} className="w-full" />
          </div>
        )}
      </div>

      <TicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTicket}
        isSubmitting={isSaving}
      />

      <AlertDialog
        open={showUnsavedDialog}
        onOpenChange={(open) => {
          setShowUnsavedDialog(open)
          if (!open) {
            setPendingTicketId(null)
            setPendingBack(false)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("detail.unsavedChangesTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("detail.unsavedChanges")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("form.buttons.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDiscard}>
              {t("detail.discardChanges")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default TicketsPage
