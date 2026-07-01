"use client"

import { useCallback, useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { addDays } from "date-fns"
import { CalendarDays, Loader2, Plus, Table2, AlertCircle, ShieldAlert } from "lucide-react"
import type { AgendaProfile, ScheduleBlock, ScheduleReservation, ScheduleService, ScheduleSettings } from "@/lib/types/schedule"
import { toast } from "sonner"

import { BlockTimeModal } from "@/components/schedule/block-time-modal"
import { ReservationModal } from "@/components/schedule/reservation-modal"
import { ReservationTable } from "@/components/schedule/reservation-table"
import { defaultWeekStart, ScheduleCalendar } from "@/components/schedule/schedule-calendar"
import { ScheduleServicesTable } from "@/components/schedule/schedule-services-table"
import { ScheduleSettingsPanel } from "@/components/schedule/schedule-settings-panel"
import { ServiceModal } from "@/components/schedule/service-modal"
import { ErrorState } from "@/components/ai-training/components/error-state"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  cancelReservationAction,
  listAgendaProfilesAction,
  listReservationsAction,
  listScheduleBlocksAction,
  listScheduleServicesAction,
  getScheduleSettingsAction,
} from "@/components/server-actions/schedule"
import { useUser } from "@/components/user-provider"

type SchedulePageProps = {
  initialReservations: ScheduleReservation[]
  initialServices: ScheduleService[]
  initialProfiles: AgendaProfile[]
  initialSettings: ScheduleSettings | null
  initialLoadError?: string | null
  hasAgendaAccess: boolean
}

export const SchedulePage = ({
  initialReservations,
  initialServices,
  initialProfiles,
  initialSettings,
  initialLoadError = null,
  hasAgendaAccess,
}: SchedulePageProps) => {
  const t = useTranslations("Schedule")
  const { hasPermission } = useUser()
  const permissions = hasPermission()
  const isAdmin = permissions.isAdmin

  const [reservations, setReservations] = useState(initialReservations)
  const [services, setServices] = useState(initialServices)
  const [profiles, setProfiles] = useState(initialProfiles)
  const [settings, setSettings] = useState<ScheduleSettings | null>(initialSettings)
  const [blocks, setBlocks] = useState<ScheduleBlock[]>([])
  const [view, setView] = useState<"table" | "calendar">("table")
  const [weekStart, setWeekStart] = useState(defaultWeekStart())
  const [isLoading, setIsLoading] = useState(false)
  const [isWeekLoading, setIsWeekLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(initialLoadError)
  const [reservationModalOpen, setReservationModalOpen] = useState(false)
  const [reservationModalMode, setReservationModalMode] = useState<"create" | "edit">("create")
  const [selectedReservation, setSelectedReservation] = useState<ScheduleReservation | null>(null)
  const [defaultStartAt, setDefaultStartAt] = useState<string | undefined>()
  const [blockModalOpen, setBlockModalOpen] = useState(false)
  const [serviceModalOpen, setServiceModalOpen] = useState(false)
  const [serviceModalMode, setServiceModalMode] = useState<"create" | "edit">("create")
  const [selectedService, setSelectedService] = useState<ScheduleService | null>(null)

  const loadWeekBlocks = useCallback(async (start: Date) => {
    if (!hasAgendaAccess) return
    setIsWeekLoading(true)
    try {
      const weekEnd = addDays(start, 7)
      const blocksResult = await listScheduleBlocksAction({
        dateFrom: start.toISOString(),
        dateTo: weekEnd.toISOString(),
      })
      if (blocksResult.success && blocksResult.data) {
        setBlocks(blocksResult.data.blocks)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsWeekLoading(false)
    }
  }, [hasAgendaAccess])

  const loadData = useCallback(async () => {
    if (!hasAgendaAccess) return
    setIsLoading(true)
    setLoadError(null)
    try {
      const [reservationsResult, servicesResult, profilesResult, settingsResult] =
        await Promise.all([
          listReservationsAction(),
          listScheduleServicesAction(),
          listAgendaProfilesAction(),
          getScheduleSettingsAction(),
        ])

      if (!reservationsResult.success || !reservationsResult.data) {
        throw new Error(reservationsResult.error || t("messages.loadFailed"))
      }

      setReservations(reservationsResult.data.reservations)
      if (servicesResult.success && servicesResult.data) setServices(servicesResult.data.services)
      if (profilesResult.success && profilesResult.data) setProfiles(profilesResult.data.profiles)
      if (settingsResult.success && settingsResult.data) setSettings(settingsResult.data.settings)

      await loadWeekBlocks(weekStart)
    } catch (error) {
      console.error(error)
      setLoadError(error instanceof Error ? error.message : t("messages.loadFailed"))
    } finally {
      setIsLoading(false)
    }
  }, [hasAgendaAccess, loadWeekBlocks, t, weekStart])

  const handleWeekChange = useCallback(
    (next: Date) => {
      setWeekStart(next)
      void loadWeekBlocks(next)
    },
    [loadWeekBlocks],
  )

  useEffect(() => {
    if (view === "calendar") {
      void loadWeekBlocks(weekStart)
    }
    // Only load blocks when switching to calendar view; week changes use handleWeekChange.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view])

  const handleCreateReservation = (startAt?: Date) => {
    setReservationModalMode("create")
    setSelectedReservation(null)
    setDefaultStartAt(startAt?.toISOString())
    setReservationModalOpen(true)
  }

  const handleEditReservation = (reservation: ScheduleReservation) => {
    setReservationModalMode("edit")
    setSelectedReservation(reservation)
    setReservationModalOpen(true)
  }

  const handleCancelReservation = async (reservation: ScheduleReservation) => {
    const result = await cancelReservationAction({ reservationId: reservation.id })
    if (!result.success) {
      toast.error(result.error || t("messages.saveFailed"))
      return
    }
    toast.success(t("messages.cancelled"))
    void loadData()
  }

  const handleCreateService = () => {
    setServiceModalMode("create")
    setSelectedService(null)
    setServiceModalOpen(true)
  }

  const handleEditService = (service: ScheduleService) => {
    setServiceModalMode("edit")
    setSelectedService(service)
    setServiceModalOpen(true)
  }

  if (!hasAgendaAccess) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ShieldAlert className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold">{t("accessDenied.title")}</h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{t("accessDenied.description")}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ToggleGroup
          type="single"
          variant="outline"
          value={view}
          className="pl-4 sm:pl-0"
          onValueChange={(value) => value && setView(value as "table" | "calendar")}
        >
          <ToggleGroupItem value="table" className="px-4" aria-label={t("views.table")}>
            <Table2 className="mr-2 h-4 w-4" />
            {t("views.table")}
          </ToggleGroupItem>
          <ToggleGroupItem value="calendar" className="px-4" aria-label={t("views.calendar")}>
            <CalendarDays className="mr-2 h-4 w-4" />
            {t("views.calendar")}
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setBlockModalOpen(true)}>
            {t("actions.blockTime")}
          </Button>
          <Button onClick={() => handleCreateReservation()}>
            <Plus className="mr-2 h-4 w-4" />
            {t("actions.newReservation")}
          </Button>
        </div>
      </div>

      {loadError ? (
        <ErrorState
          icon={AlertCircle}
          title={t("messages.loadFailed")}
          description={loadError}
          retryLabel={t("actions.retry")}
          onRetry={loadData}
        />
      ) : null}

      {isLoading && reservations.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          {t("messages.loading")}
        </div>
      ) : (
        <Tabs defaultValue="reservations">
          <TabsList>
            <TabsTrigger value="reservations">{t("tabs.reservations")}</TabsTrigger>
            {isAdmin ? <TabsTrigger value="services">{t("tabs.services")}</TabsTrigger> : null}
            {isAdmin ? <TabsTrigger value="settings">{t("tabs.settings")}</TabsTrigger> : null}
          </TabsList>

          <TabsContent value="reservations" className="mt-4">
            {view === "table" ? (
              <ReservationTable
                reservations={reservations}
                onEdit={handleEditReservation}
                onCancel={handleCancelReservation}
              />
            ) : (
              <ScheduleCalendar
                weekStart={weekStart}
                reservations={reservations}
                blocks={blocks}
                slotIntervalMinutes={settings?.slotIntervalMinutes ?? 15}
                isWeekLoading={isWeekLoading}
                onWeekChange={handleWeekChange}
                onSlotClick={(startAt) => handleCreateReservation(startAt)}
                onReservationClick={handleEditReservation}
              />
            )}
          </TabsContent>

          {isAdmin ? (
            <TabsContent value="services" className="mt-4">
              <ScheduleServicesTable
                services={services}
                profiles={profiles}
                defaultBufferMinutes={settings?.defaultBufferMinutes ?? 15}
                onAdd={handleCreateService}
                onEdit={handleEditService}
                onChanged={loadData}
              />
            </TabsContent>
          ) : null}

          {isAdmin && settings ? (
            <TabsContent value="settings" className="mt-4">
              <ScheduleSettingsPanel settings={settings} onSaved={loadData} />
            </TabsContent>
          ) : null}
        </Tabs>
      )}

      <ReservationModal
        open={reservationModalOpen}
        mode={reservationModalMode}
        reservation={selectedReservation}
        services={services}
        profiles={profiles}
        defaultStartAt={defaultStartAt}
        onClose={() => setReservationModalOpen(false)}
        onSaved={loadData}
      />

      <BlockTimeModal
        open={blockModalOpen}
        profiles={profiles}
        onClose={() => setBlockModalOpen(false)}
        onSaved={loadData}
      />

      <ServiceModal
        open={serviceModalOpen}
        mode={serviceModalMode}
        service={selectedService}
        profiles={profiles}
        defaultBufferMinutes={settings?.defaultBufferMinutes ?? 15}
        onClose={() => setServiceModalOpen(false)}
        onSaved={loadData}
      />
    </div>
  )
}

export default SchedulePage
