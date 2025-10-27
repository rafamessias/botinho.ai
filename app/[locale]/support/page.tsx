"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import ContactSection from "@/components/support/contact-section"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"

export default function SupportPage() {
    const t = useTranslations("Support")
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
                    <div className="@container/main flex flex-1 flex-col gap-2 max-w-4xl w-full mx-auto">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <div className="px-4 lg:px-6">
                                <div className="space-y-6">
                                    <div className="grid gap-6">
                                        <ContactSection />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

