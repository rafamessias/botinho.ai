import { Suspense } from "react"
import { getTranslations } from "next-intl/server"
import { AppShell } from "@/components/app-shell"
import TicketsPage from "@/components/tickets/tickets-page"
import { listTicketsAction } from "@/components/server-actions/tickets"
import { getBotinhoSession } from "@/lib/botinho-auth"
import type { TicketListItem } from "@/lib/types/ticket"
import { enforceAppAccess } from "@/lib/onboarding/enforce-app-access"
import { DEFAULT_TICKET_STATUS_FILTERS } from "@/lib/tickets/ticket-status-filters"

export const dynamic = "force-dynamic"

export default async function TicketsRoute() {
  await enforceAppAccess()
  const [t, session] = await Promise.all([getTranslations("Tickets"), getBotinhoSession()])
  const hasCompanyAccess = session.ok && Boolean(session.companyId)

  let initialTickets: TicketListItem[] = []
  let initialHasMore = false
  let initialNextCursor: string | null = null
  let initialLoadError: string | null = null

  if (hasCompanyAccess) {
    const result = await listTicketsAction({
      pageSize: 20,
      statuses: DEFAULT_TICKET_STATUS_FILTERS,
    })
    if (!result.success || !result.data) {
      initialLoadError = result.error || t("messages.loadFailed")
    } else {
      initialTickets = result.data.tickets
      initialHasMore = result.data.pagination.hasMore
      initialNextCursor = result.data.pagination.nextCursor
    }
  }

  return (
    <AppShell title={t("title")} variant="fullBleed">
      <Suspense fallback={null}>
        <TicketsPage
          initialTickets={initialTickets}
          initialHasMore={initialHasMore}
          initialNextCursor={initialNextCursor}
          initialLoadError={initialLoadError}
          hasCompanyAccess={hasCompanyAccess}
          initialCompanyId={session.companyId ?? null}
        />
      </Suspense>
    </AppShell>
  )
}
