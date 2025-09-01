import * as React from "react"
import { getTranslations } from "next-intl/server"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { CompanyInvitationClient } from "@/components/company/company-invitation-client"

interface CompanyInvitationPageProps {
    params: Promise<{ id: string }>
    searchParams: Promise<{ token?: string }>
}

export default async function CompanyInvitationPage({
    params,
    searchParams
}: CompanyInvitationPageProps) {
    const t = await getTranslations("CompanyInvitation")
    const { id: companyId } = await params
    const { token: membershipId } = await searchParams

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
                <SiteHeader title={t("pageTitle")} />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <div className="px-4 lg:px-6">
                                <CompanyInvitationClient
                                    membershipId={membershipId || null}
                                    companyId={companyId}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
