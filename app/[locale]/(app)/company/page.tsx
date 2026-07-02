import { getServerAuthSession } from "@/lib/auth/server-session"
import { getTranslations } from "next-intl/server"
import { getUserCompaniesAction } from "@/components/server-actions/company"
import { CompanyDashboard } from "@/components/company/company-dashboard"
import { AppShell } from "@/components/app-shell"
import { enforceAppAccess } from "@/lib/onboarding/enforce-app-access"

export default async function CompanyPage() {
  await enforceAppAccess()
  const t = await getTranslations("Company")
  const session = await getServerAuthSession()

  if (!session?.uid) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold">Authentication Required</h1>
          <p className="text-muted-foreground">Please sign in to view companies.</p>
        </div>
      </div>
    )
  }

  const companiesResult = await getUserCompaniesAction()
  const companies = companiesResult.success && companiesResult.companies ? companiesResult.companies : []

  return (
    <AppShell title={t("title")} description={t("description")}>
      <CompanyDashboard initialCompanies={companies as any} currentUserId={session.uid} />
    </AppShell>
  )
}
