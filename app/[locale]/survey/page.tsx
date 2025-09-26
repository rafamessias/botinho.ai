import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SurveyDashboard } from "@/components/survey/survey-dashboard"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/app/auth"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { getSurveysWithPagination } from "@/components/server-actions/survey"

export default async function SurveyPage() {
    const t = await getTranslations("Survey")

    const session = await auth()
    const defaultTeam = session?.user?.defaultTeamId;

    // Fetch paginated surveys data on the server
    const surveysResult = await getSurveysWithPagination({ page: 1, pageSize: 10 })
    const paginatedData = surveysResult.success ? surveysResult.data : undefined

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
                <SiteHeader title="Surveys" />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 max-w-6xl w-full mx-auto">
                            {defaultTeam ? (
                                <SurveyDashboard initialData={paginatedData} />
                            ) : (
                                <div className="flex flex-col items-center justify-center">
                                    <Card className="flex flex-col max-w-md items-center justify-center py-12 px-6 text-center border-none shadow-none bg-transparent">
                                        <CardContent className="space-y-4">
                                            <CardTitle className="text-2xl font-semibold">
                                                {t("emptyState.title")}
                                            </CardTitle>
                                            <CardDescription className="text-lg">
                                                {t("emptyState.description")}
                                            </CardDescription>
                                            <Button asChild size="lg" className="mt-4">
                                                <Link href="/team">
                                                    {t("emptyState.createTeamButton")}
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
