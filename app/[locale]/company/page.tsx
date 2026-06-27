import type { CSSProperties } from "react"
import { getServerAuthSession } from "@/lib/auth/server-session"
import { getTranslations } from "next-intl/server"
import { getUserCompaniesAction } from "@/components/server-actions/company"
import { CompanyDashboard } from "@/components/company/company-dashboard"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default async function CompanyPage() {
  const t = await getTranslations("Company")
  const session = await getServerAuthSession()

  if (!session?.uid) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
          <p className="text-muted-foreground">Please sign in to view companies.</p>
        </div>
      </div>
    )
  }

  const companiesResult = await getUserCompaniesAction()
  const companies = companiesResult.success && companiesResult.companies ? companiesResult.companies : []

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
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main mx-auto flex w-full max-w-7xl flex-1 flex-col gap-2">
            <div className="space-y-6 px-4 py-6 md:space-y-8 md:px-6 lg:px-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">{t("title")}</h2>
                <p className="text-muted-foreground">{t("description")}</p>
              </div>
              <CompanyDashboard initialCompanies={companies as any} currentUserId={session.uid} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
