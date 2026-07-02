import { getTranslations } from "next-intl/server"
import { AppShell } from "@/components/app-shell"
import CompanyQuickAnswersPage from "@/components/ai-interaction/company-quick-answers-page"
import { getAiTrainingDataAction } from "@/components/server-actions/ai-training"
import { mapQuickAnswersToView } from "@/components/ai-training/map-quick-answer-views"
import { getBotinhoSession } from "@/lib/botinho-auth"
import { enforceAppAccess } from "@/lib/onboarding/enforce-app-access"

export const dynamic = "force-dynamic"

export default async function QuickAnswersPage() {
  await enforceAppAccess()
  const t = await getTranslations("QuickAnswers")
  const session = await getBotinhoSession()
  const hasCompanyAccess = session.ok && Boolean(session.companyId)

  let initialItems = mapQuickAnswersToView([])
  let initialLoadError: string | null = null

  if (hasCompanyAccess) {
    const result = await getAiTrainingDataAction()
    if (!result.success || !result.data) {
      initialLoadError = result.error || t("errors.loadFailed")
    } else {
      initialItems = mapQuickAnswersToView(result.data.quickAnswers)
    }
  }

  return (
    <AppShell title={t("title")} description={t("description")}>
      <CompanyQuickAnswersPage
        initialItems={initialItems}
        initialLoadError={initialLoadError}
        hasCompanyAccess={hasCompanyAccess}
      />
    </AppShell>
  )
}
