"use client"

import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { SurveyTable } from "@/components/survey/survey-table"
import { type PaginatedSurveysResult } from "@/components/server-actions/survey"
import { useUser } from "@/components/user-provider"
import { getTeamById } from "../server-actions/team"

interface SurveyStats {
    totalSurveys: number
    activeSurveys: number
    totalResponses: number
    responseRate: number
}

interface CurrentTeam {
    id: number
    name: string
    totalSurveys: number
    totalActiveSurveys: number
    totalResponses: number
    ResponseRate: number
}

export const SurveyDashboard = ({ initialData, currentTeam }: { initialData?: PaginatedSurveysResult, currentTeam?: CurrentTeam }) => {
    const t = useTranslations("Survey")
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useUser()


    const [surveyStats, setSurveyStats] = useState<SurveyStats>({
        totalSurveys: currentTeam?.totalSurveys || 0,
        activeSurveys: currentTeam?.totalActiveSurveys || 0,
        totalResponses: currentTeam?.totalResponses || 0,
        responseRate: currentTeam?.ResponseRate || 0,
    })

    useEffect(() => {

        async function getCurrentTeam() {
            const currentTeam = await getTeamById(user?.defaultTeamId || 0)
            if (currentTeam.success) {
                setSurveyStats({
                    totalSurveys: currentTeam.team?.totalSurveys || 0,
                    activeSurveys: currentTeam.team?.totalActiveSurveys || 0,
                    totalResponses: currentTeam.team?.totalResponses || 0,
                    responseRate: currentTeam.team?.ResponseRate || 0,
                })
            }

        }
        if (user?.defaultTeamId && user?.defaultTeamId !== currentTeam?.id) getCurrentTeam()
    }, [user?.defaultTeamId])


    if (isLoading) {
        return (
            <div className="px-4 lg:px-6 space-y-6">
                <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="@container/card">
                            <CardHeader>
                                <CardDescription>Loading...</CardDescription>
                                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                    --
                                </CardTitle>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
                <SurveyTable initialData={initialData} />
            </div>
        )
    }

    return (
        <div className="px-4 lg:px-6 space-y-6">
            {/* Statistics Cards */}
            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-3 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs sm:grid-cols-2 @xl/main:grid-cols-4 @5xl/main:grid-cols-4">
                <Card className="@container/card">
                    <CardHeader className="pb-2 sm:pb-6">
                        <CardDescription className="text-xs sm:text-sm">{t("stats.totalSurveys.title")}</CardDescription>
                        <CardTitle className="text-lg font-semibold tabular-nums sm:text-2xl @[250px]/card:text-3xl">
                            {surveyStats.totalSurveys}
                        </CardTitle>
                    </CardHeader>
                    <CardFooter className="hidden sm:flex flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            {t("stats.totalSurveys.description")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {t("stats.totalSurveys.subtitle")}
                        </div>
                    </CardFooter>
                </Card>

                <Card className="@container/card">
                    <CardHeader className="pb-2 sm:pb-6">
                        <CardDescription className="text-xs sm:text-sm">{t("stats.activeSurveys.title")}</CardDescription>
                        <CardTitle className="text-lg font-semibold tabular-nums sm:text-2xl @[250px]/card:text-3xl">
                            {surveyStats.activeSurveys}
                        </CardTitle>
                    </CardHeader>
                    <CardFooter className="hidden sm:flex flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            {t("stats.activeSurveys.description")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {t("stats.activeSurveys.subtitle")}
                        </div>
                    </CardFooter>
                </Card>

                <Card className="@container/card">
                    <CardHeader className="pb-2 sm:pb-6">
                        <CardDescription className="text-xs sm:text-sm">{t("stats.totalResponses.title")}</CardDescription>
                        <CardTitle className="text-lg font-semibold tabular-nums sm:text-2xl @[250px]/card:text-3xl">
                            {surveyStats.totalResponses}
                        </CardTitle>
                    </CardHeader>
                    <CardFooter className="hidden sm:flex flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            {t("stats.totalResponses.description")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {t("stats.totalResponses.subtitle")}
                        </div>
                    </CardFooter>
                </Card>
                <Card className="@container/card">
                    <CardHeader className="pb-2 sm:pb-6">
                        <CardDescription className="text-xs sm:text-sm">{t("stats.responseRate.title")}</CardDescription>
                        <CardTitle className="text-lg font-semibold tabular-nums sm:text-2xl @[250px]/card:text-3xl">
                            {surveyStats.responseRate}
                        </CardTitle>
                    </CardHeader>
                    <CardFooter className="hidden sm:flex flex-col items-start gap-1.5 text-sm">
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
            <SurveyTable initialData={initialData} teamId={currentTeam?.id || 0} />
        </div>
    )
}
