import { getTranslations } from "next-intl/server"
import { AppShell } from "@/components/app-shell"
import SchedulePage from "@/components/schedule/schedule-page"
import {
  getScheduleSettingsAction,
  listAgendaProfilesAction,
  listReservationsAction,
  listScheduleServicesAction,
} from "@/components/server-actions/schedule"
import { resolveCompanyContext } from "@/lib/botinho-auth"
import { enforceAppAccess } from "@/lib/onboarding/enforce-app-access"
import type { AgendaProfile, ScheduleReservation, ScheduleService, ScheduleSettings } from "@/lib/types/schedule"

export const dynamic = "force-dynamic"

export default async function ScheduleRoute() {
  await enforceAppAccess()
  const t = await getTranslations("Schedule")

  let hasAgendaAccess = false
  let initialReservations: ScheduleReservation[] = []
  let initialServices: ScheduleService[] = []
  let initialProfiles: AgendaProfile[] = []
  let initialSettings: ScheduleSettings | null = null
  let initialLoadError: string | null = null

  try {
    await resolveCompanyContext({ requireCanManageAgenda: true })
    hasAgendaAccess = true

    const [reservationsResult, servicesResult, profilesResult, settingsResult] = await Promise.all([
      listReservationsAction(),
      listScheduleServicesAction(),
      listAgendaProfilesAction(),
      getScheduleSettingsAction(),
    ])

    if (!reservationsResult.success || !reservationsResult.data) {
      initialLoadError = reservationsResult.error || t("messages.loadFailed")
    } else {
      initialReservations = reservationsResult.data.reservations
    }

    if (servicesResult.success && servicesResult.data) {
      initialServices = servicesResult.data.services
    }
    if (profilesResult.success && profilesResult.data) {
      initialProfiles = profilesResult.data.profiles
    }
    if (settingsResult.success && settingsResult.data) {
      initialSettings = settingsResult.data.settings
    }
  } catch {
    hasAgendaAccess = false
  }

  return (
    <AppShell title={t("title")} description={t("description")}>
      <SchedulePage
        initialReservations={initialReservations}
        initialServices={initialServices}
        initialProfiles={initialProfiles}
        initialSettings={initialSettings}
        initialLoadError={initialLoadError}
        hasAgendaAccess={hasAgendaAccess}
      />
    </AppShell>
  )
}
