import * as React from "react"
import { getTranslations } from "next-intl/server"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { CompanyClientWrapper } from "@/components/company/company-client-wrapper"
import { CompanyForm } from "@/components/company/company-form"
import {
    getUserCompaniesAction,
    getCompanyAction,
} from "@/components/server-actions/company"

export default async function CompanyPage() {
    const t = await getTranslations("Company")

    // Load initial data on the server
    const companiesResult = await getUserCompaniesAction()
    const companies = companiesResult.success ? companiesResult.companies || [] : []

    // Get the first company's details if available
    let selectedCompany = null
    if (companies.length > 0) {
        const companyDetailsResult = await getCompanyAction(companies[0].id)
        if (companyDetailsResult.success) {
            selectedCompany = companyDetailsResult.company
        }
    }

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
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <div className="px-4 lg:px-6">
                                <div className="space-y-6">
                                    {/* Header */}
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-muted-foreground">{t("description")}</p>
                                        </div>
                                        {companies.length > 0 && (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button>
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        {t("createCompany")}
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[500px]">
                                                    <DialogHeader>
                                                        <DialogTitle>{t("createCompany")}</DialogTitle>
                                                        <DialogDescription>
                                                            {t("createCompanyDescription")}
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <CompanyForm mode="create" />
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </div>

                                    {/* Company Management */}
                                    <CompanyClientWrapper
                                        initialCompanies={companies as any}
                                        initialSelectedCompany={selectedCompany as any}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
