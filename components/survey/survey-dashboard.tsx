"use client"

import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SurveyTable } from "@/components/survey/survey-table"
import { type PaginatedSurveysResult } from "@/components/server-actions/survey"
import { useUser } from "@/components/user-provider"
import { getTeamById } from "../server-actions/team"
import { Link } from "@/i18n/navigation"
import { Sparkles } from "lucide-react"

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
    responseRate: number
}

export const SurveyDashboard = ({ initialData, currentTeam }: { initialData?: PaginatedSurveysResult, currentTeam?: CurrentTeam }) => {
    const t = useTranslations("Survey")
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useUser()


    const [surveyStats, setSurveyStats] = useState<SurveyStats>({
        totalSurveys: currentTeam?.totalSurveys || 0,
        activeSurveys: currentTeam?.totalActiveSurveys || 0,
        totalResponses: currentTeam?.totalResponses || 0,
        responseRate: Math.trunc(currentTeam?.responseRate || 0),
    })

    useEffect(() => {

        async function getCurrentTeam() {
            const currentTeam = await getTeamById(user?.defaultTeamId || 0)
            if (currentTeam.success) {
                setSurveyStats({
                    totalSurveys: currentTeam.team?.totalSurveys || 0,
                    activeSurveys: currentTeam.team?.totalActiveSurveys || 0,
                    totalResponses: currentTeam.team?.totalResponses || 0,
                    responseRate: Math.trunc(currentTeam.team?.responseRate || 0),
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

    // Empty state when no surveys exist
    if (surveyStats.totalSurveys === 0) {
        return (
            <div className="px-4 lg:px-6 space-y-6">
                <div className="relative min-h-[600px]">
                    {/* Mock Statistics Cards with Opacity and Blur */}
                    <div className="opacity-10 blur-xs pointer-events-none space-y-6">
                        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-3 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs sm:grid-cols-2 @xl/main:grid-cols-4 @5xl/main:grid-cols-4">
                            <Card className="@container/card">
                                <CardHeader className="pb-2 sm:pb-6">
                                    <CardDescription className="text-xs sm:text-sm">Total Surveys</CardDescription>
                                    <CardTitle className="text-lg font-semibold tabular-nums sm:text-2xl @[250px]/card:text-3xl">
                                        42
                                    </CardTitle>
                                </CardHeader>
                                <CardFooter className="hidden sm:flex flex-col items-start gap-1.5 text-sm">
                                    <div className="line-clamp-1 flex gap-2 font-medium">
                                        All surveys created
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Includes drafts and completed
                                    </div>
                                </CardFooter>
                            </Card>

                            <Card className="@container/card">
                                <CardHeader className="pb-2 sm:pb-6">
                                    <CardDescription className="text-xs sm:text-sm">Active Surveys</CardDescription>
                                    <CardTitle className="text-lg font-semibold tabular-nums sm:text-2xl @[250px]/card:text-3xl">
                                        12
                                    </CardTitle>
                                </CardHeader>
                                <CardFooter className="hidden sm:flex flex-col items-start gap-1.5 text-sm">
                                    <div className="line-clamp-1 flex gap-2 font-medium">
                                        Currently collecting responses
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Live and accepting responses
                                    </div>
                                </CardFooter>
                            </Card>

                            <Card className="@container/card">
                                <CardHeader className="pb-2 sm:pb-6">
                                    <CardDescription className="text-xs sm:text-sm">Total Responses</CardDescription>
                                    <CardTitle className="text-lg font-semibold tabular-nums sm:text-2xl @[250px]/card:text-3xl">
                                        1,247
                                    </CardTitle>
                                </CardHeader>
                                <CardFooter className="hidden sm:flex flex-col items-start gap-1.5 text-sm">
                                    <div className="line-clamp-1 flex gap-2 font-medium">
                                        All responses collected
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Across all surveys
                                    </div>
                                </CardFooter>
                            </Card>

                            <Card className="@container/card">
                                <CardHeader className="pb-2 sm:pb-6">
                                    <CardDescription className="text-xs sm:text-sm">Response Rate</CardDescription>
                                    <CardTitle className="text-lg font-semibold tabular-nums sm:text-2xl @[250px]/card:text-3xl">
                                        68%
                                    </CardTitle>
                                </CardHeader>
                                <CardFooter className="hidden sm:flex flex-col items-start gap-1.5 text-sm">
                                    <div className="line-clamp-1 flex gap-2 font-medium">
                                        Average completion rate
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Response quality indicator
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>

                        {/* Mock Table */}
                        <Card className="shadow-none">
                            <CardHeader>
                                <CardTitle className="text-lg">All Surveys</CardTitle>
                                <CardDescription>Manage your surveys and track responses</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="h-12 w-full rounded bg-muted/50" />
                                    <div className="h-12 w-full rounded bg-muted/50" />
                                    <div className="h-12 w-full rounded bg-muted/50" />
                                    <div className="h-12 w-full rounded bg-muted/50" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Overlay Message */}
                    <div className="absolute inset-0 flex items-start justify-center pt-12 sm:pt-24">
                        <Card className="max-w-xl mx-4 shadow-2xl border-2">
                            <CardContent className="pt-6">
                                <div className="text-center flex flex-col items-center gap-4">
                                    <div className="rounded-full bg-gradient-to-br from-primary/20 to-primary/5 p-4">
                                        <Sparkles className="text-primary size-6 sm:size-8" />
                                    </div>
                                    <div className="space-y-3">
                                        <h2 className="text-lg sm:text-xl font-bold">
                                            {t("emptyState.noSurveys.title")}
                                        </h2>
                                        <p className="text-sm sm:text-base text-muted-foreground">
                                            {t("emptyState.noSurveys.subtitle")}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {t("emptyState.noSurveys.description")}
                                        </p>
                                    </div>

                                    <Button asChild size="lg" className="mt-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                                        <Link href="/survey/create">
                                            <Sparkles className="mr-2 h-5 w-5" />
                                            {t("emptyState.noSurveys.button")}
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
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
                            {surveyStats.responseRate}%
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
