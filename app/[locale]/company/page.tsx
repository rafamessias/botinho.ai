import * as React from "react"
import { getTranslations } from "next-intl/server"
import { auth } from "@/app/auth"
import { getUserCompaniesAction } from "@/components/server-actions/company"
import { CompanyDashboard } from "@/components/company/company-dashboard"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"

export default async function CompanyPage() {
    const t = await getTranslations("Company")

    // Get current user session
    const session = await auth()
    if (!session?.user?.email) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
                    <p className="text-muted-foreground">Please sign in to view companies.</p>
                </div>
            </div>
        )
    }

    // Get companies data server-side
    const companiesResult = await getUserCompaniesAction()
    const companies = companiesResult.success && companiesResult.companies ? companiesResult.companies : []
    // Get current user ID from session
    const currentUserId = typeof session.user.id === 'number' ? session.user.id : 0

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader title={t("title")} />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2 max-w-7xl w-full mx-auto">
                        <div className="px-4 md:px-6 py-6 lg:px-8 space-y-6 md:space-y-8">
                            <div className="space-y-2">
                                <p className="text-muted-foreground">{t("description")}</p>
                            </div>
                            <CompanyDashboard initialCompanies={companies as any} currentUserId={currentUserId} />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
