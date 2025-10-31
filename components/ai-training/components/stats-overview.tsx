"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, CheckCircle2, MessageSquare, Sparkles } from "lucide-react"
import type { TranslationFn } from "../types"

type StatsOverviewProps = {
    t: TranslationFn
    knowledgeCount: number
    templatesCount: number
    quickAnswersCount: number
}

export const StatsOverview = ({ t, knowledgeCount, templatesCount, quickAnswersCount }: StatsOverviewProps) => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card className="elegant-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="caption-text">{t("stats.knowledgeItems")}</CardTitle>
                <Brain className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-foreground">{knowledgeCount}</div>
                <p className="mt-1 text-xs text-muted-foreground">{t("stats.knowledgeItemsDescription")}</p>
            </CardContent>
        </Card>

        <Card className="elegant-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="caption-text">{t("stats.templates")}</CardTitle>
                <MessageSquare className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-foreground">{templatesCount}</div>
                <p className="mt-1 text-xs text-muted-foreground">{t("stats.templatesDescription")}</p>
            </CardContent>
        </Card>

        <Card className="elegant-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="caption-text">{t("stats.quickAnswers")}</CardTitle>
                <Sparkles className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-foreground">{quickAnswersCount}</div>
                <p className="mt-1 text-xs text-muted-foreground">{t("stats.quickAnswersDescription")}</p>
            </CardContent>
        </Card>

        <Card className="elegant-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="caption-text">{t("stats.trainingStatus")}</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-primary">{t("stats.active")}</div>
                <p className="mt-1 text-xs text-muted-foreground">{t("stats.trainingStatusDescription")}</p>
            </CardContent>
        </Card>
    </div>
)


