"use client"

import * as React from "react"
import { ArrowDownRight, ArrowUpRight, Clock, MessageSquare, TrendingUp, Users, Zap } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useTranslations } from "next-intl"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"

export const description = "A simple area chart"


export default function DashboardPage() {
    const t = useTranslations("Dashboard")

    const chartConfig = React.useMemo<ChartConfig>(() => ({
        desktop: {
            label: t("charts.performance.series.desktop"),
            color: "var(--chart-1)",
        },
    }), [t])

    const chartData = React.useMemo(
        () => [
            { key: "january", value: 186 },
            { key: "february", value: 305 },
            { key: "march", value: 237 },
            { key: "april", value: 73 },
            { key: "may", value: 209 },
            { key: "june", value: 214 },
        ].map(({ key, value }) => ({
            label: t(`months.${key}.full`),
            shortLabel: t(`months.${key}.short`),
            desktop: value,
        })),
        [t],
    )

    return (
        <div className="section-spacing">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card className="elegant-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="caption-text uppercase tracking-wide">{t("stats.messagesHandled.title")}</CardTitle>
                        <div className="bg-primary/10 p-2.5 rounded-lg">
                            <MessageSquare className="w-5 h-5 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t("stats.messagesHandled.value")}</div>
                        <div className="flex items-center gap-2 text-sm">
                            <ArrowUpRight className="w-4 h-4 text-primary" />
                            <span className="text-primary font-semibold">{t("stats.messagesHandled.change")}</span>
                            <span className="text-muted-foreground">{t("stats.messagesHandled.changeLabel")}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="elegant-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="caption-text uppercase tracking-wide">{t("stats.avgResponseTime.title")}</CardTitle>
                        <div className="accent-blue p-2.5 rounded-lg">
                            <Clock className="w-5 h-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t("stats.avgResponseTime.value")}</div>
                        <div className="flex items-center gap-2 text-sm">
                            <ArrowDownRight className="w-4 h-4 text-primary" />
                            <span className="text-primary font-semibold">{t("stats.avgResponseTime.change")}</span>
                            <span className="text-muted-foreground">{t("stats.avgResponseTime.changeLabel")}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="elegant-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="caption-text uppercase tracking-wide">{t("stats.satisfactionRate.title")}</CardTitle>
                        <div className="accent-purple p-2.5 rounded-lg">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t("stats.satisfactionRate.value")}</div>
                        <div className="flex items-center gap-2 text-sm">
                            <ArrowUpRight className="w-4 h-4 text-primary" />
                            <span className="text-primary font-semibold">{t("stats.satisfactionRate.change")}</span>
                            <span className="text-muted-foreground">{t("stats.satisfactionRate.changeLabel")}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="elegant-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="caption-text uppercase tracking-wide">{t("stats.activeCustomers.title")}</CardTitle>
                        <div className="accent-orange p-2.5 rounded-lg">
                            <Users className="w-5 h-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t("stats.activeCustomers.value")}</div>
                        <div className="flex items-center gap-2 text-sm">
                            <ArrowUpRight className="w-4 h-4 text-primary" />
                            <span className="text-primary font-semibold">{t("stats.activeCustomers.change")}</span>
                            <span className="text-muted-foreground">{t("stats.activeCustomers.changeLabel")}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts and Activity */}
            <div className="mb-6 w-full">
                {/* Chart */}
                <Card className="elegant-card w-full">
                    <CardHeader>
                        <CardTitle>{t("charts.performance.title")}</CardTitle>
                        <CardDescription>
                            {t("charts.performance.description")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[320px] w-full aspect-auto">
                            <AreaChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="shortLabel"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="line" labelKey="label" />}
                                />
                                <Area
                                    dataKey="desktop"
                                    type="natural"
                                    fill="var(--color-desktop)"
                                    fillOpacity={0.4}
                                    stroke="var(--color-desktop)"
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter>
                        <div className="flex w-full items-start gap-2 text-sm">
                            <div className="grid gap-2">
                                <div className="flex items-center gap-2 leading-none font-medium">
                                    {t("charts.performance.trend")} <TrendingUp className="h-4 w-4" />
                                </div>
                                <div className="text-muted-foreground flex items-center gap-2 leading-none">
                                    {t("charts.performance.period")}
                                </div>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card className="elegant-gradient border-primary/20 elegant-card">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2 text-center md:text-left">
                            <h3 className="text-xl font-semibold text-foreground flex items-center gap-3 justify-center md:justify-start">
                                <Zap className="w-6 h-6 text-primary" />
                                {t("quickActions.title")}
                            </h3>
                            <p className="text-muted-foreground">{t("quickActions.description")}</p>
                        </div>
                        <Button asChild className="professional-button bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3">
                            <Link href="/ai-training" className="flex items-center gap-2">
                                <Zap className="w-4 h-4" />
                                {t("quickActions.startTraining")}
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
