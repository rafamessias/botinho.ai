"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ThemeSelector } from "@/components/theme-selector"
import { LanguageSelector } from "@/components/language-selector"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
    const t = useTranslations("Settings")
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
                                    <div>
                                        <p className="text-muted-foreground">
                                            {t("description")}
                                        </p>
                                    </div>

                                    <div className="grid gap-6">
                                        <Card className="">
                                            <CardHeader>
                                                <CardTitle>{t("appearance.title")}</CardTitle>
                                                <CardDescription>
                                                    {t("appearance.description")}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="">
                                                <ThemeSelector />
                                            </CardContent>
                                        </Card>

                                        <Card className="">
                                            <CardHeader>
                                                <CardTitle>{t("language.title")}</CardTitle>
                                                <CardDescription>
                                                    {t("language.description")}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="">
                                                <LanguageSelector />
                                            </CardContent>
                                        </Card>
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
