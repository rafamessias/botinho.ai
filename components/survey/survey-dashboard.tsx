"use client"

import { useTranslations } from "next-intl"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { SurveyTable } from "@/components/survey/survey-table"

// Dummy data for survey statistics
const surveyStats = {
    totalSurveys: 24,
    activeSurveys: 8,
    totalResponses: 1247,
    responseRate: 68.5
}

export const SurveyDashboard = () => {
    const t = useTranslations("Survey")

    return (
        <div className="px-4 lg:px-6 space-y-6">
            {/* Statistics Cards */}
            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>{t("stats.totalSurveys.title")}</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {surveyStats.totalSurveys}
                        </CardTitle>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            {t("stats.totalSurveys.description")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {t("stats.totalSurveys.subtitle")}
                        </div>
                    </CardFooter>
                </Card>

                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>{t("stats.activeSurveys.title")}</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {surveyStats.activeSurveys}
                        </CardTitle>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            {t("stats.activeSurveys.description")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {t("stats.activeSurveys.subtitle")}
                        </div>
                    </CardFooter>
                </Card>

                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>{t("stats.totalResponses.title")}</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {surveyStats.totalResponses.toLocaleString()}
                        </CardTitle>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            {t("stats.totalResponses.description")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {t("stats.totalResponses.subtitle")}
                        </div>
                    </CardFooter>
                </Card>

                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>{t("stats.responseRate.title")}</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {surveyStats.responseRate}%
                        </CardTitle>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            {t("stats.responseRate.description")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {t("stats.responseRate.subtitle")}
                        </div>
                    </CardFooter>
                </Card>
            </div>

            {/* Survey Table */}
            <SurveyTable />
        </div>
    )
}
