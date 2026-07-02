import { getTranslations } from "next-intl/server"
import { AppShell } from "@/components/app-shell"
import CompanyTemplatesPage from "@/components/ai-interaction/company-templates-page"
import { getAiTrainingDataAction } from "@/components/server-actions/ai-training"
import { mapTemplatesToView } from "@/components/ai-training/map-template-views"
import { getBotinhoSession } from "@/lib/botinho-auth"
import { enforceAppAccess } from "@/lib/onboarding/enforce-app-access"

export const dynamic = "force-dynamic"

export default async function TemplatesPage() {
  await enforceAppAccess()
  const t = await getTranslations("Templates")
  const session = await getBotinhoSession()
  const hasCompanyAccess = session.ok && Boolean(session.companyId)

  let initialItems = mapTemplatesToView([])
  let initialLoadError: string | null = null

  if (hasCompanyAccess) {
    const result = await getAiTrainingDataAction()
    if (!result.success || !result.data) {
      initialLoadError = result.error || t("errors.loadFailed")
    } else {
      initialItems = mapTemplatesToView(result.data.templates)
    }
  }

  return (
    <AppShell title={t("title")} description={t("description")}>
      <CompanyTemplatesPage
        initialItems={initialItems}
        initialLoadError={initialLoadError}
        hasCompanyAccess={hasCompanyAccess}
      />
    </AppShell>
  )
}
