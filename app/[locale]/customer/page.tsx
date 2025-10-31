import * as React from "react"
import { useTranslations } from "next-intl"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import CustomerPage from "@/components/customer/customer-page"

const CustomerRoute = () => {
    const t = useTranslations("Customer")

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
                    <div className="@container/main mx-auto flex w-full max-w-7xl flex-1 flex-col gap-2">
                        <div className="space-y-6 px-4 py-6 md:px-6 md:space-y-8 lg:px-8">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground sm:text-base">{t("description")}</p>
                            </div>
                            <CustomerPage />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default CustomerRoute

