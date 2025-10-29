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
            <SidebarInset className="!pb-0 flex flex-col overflow-hidden">
                <SiteHeader title={t("title")} />
                <div className="flex-1 overflow-hidden">
                    <Inbox />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
