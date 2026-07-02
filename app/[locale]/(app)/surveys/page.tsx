import { getTranslations } from "next-intl/server"
import { AppShell } from "@/components/app-shell"
import SurveysPage from "@/components/customer-interaction/surveys-page"
import { listSurveysAction, type SurveySummaryView } from "@/components/server-actions/surveys"
import { getBotinhoSession } from "@/lib/botinho-auth"
import { enforceAppAccess } from "@/lib/onboarding/enforce-app-access"

export const dynamic = "force-dynamic"

export default async function SurveysRoutePage() {
  await enforceAppAccess()
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
    <AppShell title={t("title")} description={t("description")}>
      <SurveysPage
        hasCompanyAccess={hasCompanyAccess}
        initialSurveys={initialSurveys}
        initialLoadError={initialLoadError}
      />
    </AppShell>
  )
}
