import type { CSSProperties } from "react"
import { getTranslations } from "next-intl/server"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import SurveysPage from "@/components/customer-interaction/surveys-page"
import {
  listSurveysAction,
  type SurveySummaryView,
} from "@/components/server-actions/surveys"
import { getBotinhoSession } from "@/lib/botinho-auth"

export const dynamic = "force-dynamic"

export default async function SurveysRoutePage() {
  const t = await getTranslations("Surveys")
  const session = await getBotinhoSession()
  const hasCompanyAccess = session.ok && Boolean(session.companyId)

  let initialSurveys: SurveySummaryView[] = []
  let initialLoadError: string | null = null

  if (hasCompanyAccess) {
    const result = await listSurveysAction()
    if (!result.success || !result.data) {
      initialLoadError = result.error || t("errors.loadFailed")
    } else {
      initialSurveys = result.data.surveys.filter((survey) => survey.status !== "archived")
    }
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title={t("title")} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main mx-auto flex w-full max-w-7xl flex-1 flex-col gap-2">
            <div className="space-y-6 px-4 py-6 md:space-y-8 md:px-6 lg:px-8">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground sm:text-base">{t("description")}</p>
              </div>
              <SurveysPage
                hasCompanyAccess={hasCompanyAccess}
                initialSurveys={initialSurveys}
                initialLoadError={initialLoadError}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
