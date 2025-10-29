import * as React from "react"
import { useTranslations } from "next-intl"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import Inbox from "@/components/inbox/inbox-page"

export default function InboxPage() {
    const t = useTranslations("Inbox")

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
                            <Inbox />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
