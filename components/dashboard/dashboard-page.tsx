"use client"

import * as React from "react"
import { format } from "date-fns"
import { enUS, ptBR } from "date-fns/locale"
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Clock,
  MessageSquare,
  Minus,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useLocale, useTranslations } from "next-intl"

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
import type {
  DashboardDailyVolume,
  DashboardMetrics,
  DashboardStatChange,
} from "@/lib/firebase/services/dashboard-service"

type DashboardPageProps = {
  metrics: DashboardMetrics | null
  hasCompanyAccess: boolean
  loadError?: string | null
}

const dateLocales = {
  en: enUS,
  "pt-BR": ptBR,
} as const

const formatCount = (value: number, locale: string) =>
  new Intl.NumberFormat(locale === "pt-BR" ? "pt-BR" : "en-US").format(value)

const formatResponseTime = (
  ms: number,
  t: (key: string, values?: Record<string, number>) => string,
) => {
  if (ms < 60_000) {
    return t("stats.avgResponseTime.formats.seconds", {
      value: Math.round((ms / 1000) * 10) / 10,
    })
  }

  const minutes = ms / 60_000
  if (minutes < 60) {
    return t("stats.avgResponseTime.formats.minutes", {
      value: Math.round(minutes * 10) / 10,
    })
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = Math.round(minutes % 60)
  return t("stats.avgResponseTime.formats.hours", { hours, minutes: remainingMinutes })
}

const StatChange = ({
  change,
  label,
  invertDirection = false,
}: {
  change: DashboardStatChange | null
  label: string
  invertDirection?: boolean
}) => {
  if (!change || change.percent === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Minus className="h-4 w-4" aria-hidden="true" />
        <span>{label}</span>
      </div>
    )
  }

  const isPositive = invertDirection ? change.direction === "down" : change.direction === "up"
  const Icon = change.direction === "down" ? ArrowDownRight : ArrowUpRight

  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className={`h-4 w-4 ${isPositive ? "text-primary" : "text-muted-foreground"}`} aria-hidden="true" />
      <span className={`font-semibold ${isPositive ? "text-primary" : "text-muted-foreground"}`}>
        {change.percent}%
      </span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  )
}

const buildChartData = (
  volume: DashboardDailyVolume[],
  locale: string,
  label: string,
) => {
  const dateLocale = locale in dateLocales ? dateLocales[locale as keyof typeof dateLocales] : enUS

  return volume.map((entry) => {
    const date = new Date(`${entry.date}T00:00:00.000Z`)
    return {
      date: entry.date,
      label: format(date, "EEEE", { locale: dateLocale }),
      shortLabel: format(date, "EEE", { locale: dateLocale }),
      messages: entry.messages,
      seriesLabel: label,
    }
  })
}

export default function DashboardPage({
  metrics,
  hasCompanyAccess,
  loadError = null,
}: DashboardPageProps) {
  const t = useTranslations("Dashboard")
  const locale = useLocale()

  const chartConfig = React.useMemo<ChartConfig>(
    () => ({
      messages: {
        label: t("charts.messageVolume.label"),
        color: "var(--chart-1)",
      },
    }),
    [t],
  )

  const chartData = React.useMemo(
    () =>
      buildChartData(
        metrics?.messageVolume ?? [],
        locale,
        t("charts.messageVolume.label"),
      ),
    [locale, metrics?.messageVolume, t],
  )

  const hasChartData = chartData.some((entry) => entry.messages > 0)
  const numberLocale = locale === "pt-BR" ? "pt-BR" : "en-US"

  const messagesHandled = metrics?.messagesHandled ?? 0
  const activeCustomers = metrics?.activeCustomers ?? 0
  const satisfactionRate = metrics?.satisfactionRate
  const avgResponseTimeMs = metrics?.avgResponseTimeMs

  const chartPeriod =
    chartData.length > 0
      ? `${chartData[0]!.shortLabel} - ${chartData[chartData.length - 1]!.shortLabel}`
      : ""

  return (
    <div className="section-spacing">
      {loadError ? (
        <Card className="elegant-card mb-6 border-destructive/30">
          <CardContent className="py-4 text-sm text-destructive">{loadError}</CardContent>
        </Card>
      ) : null}

      {!hasCompanyAccess ? (
        <Card className="elegant-card mb-6">
          <CardContent className="py-4 text-sm text-muted-foreground">{t("noCompanyAccess")}</CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="elegant-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="caption-text uppercase tracking-wide">{t("stats.messagesHandled.title")}</CardTitle>
            <div className="rounded-lg bg-muted p-2.5">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {formatCount(messagesHandled, numberLocale)}
            </div>
            <StatChange
              change={metrics?.messagesHandledChange ?? null}
              label={t("stats.messagesHandled.changeLabel")}
            />
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
            <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {avgResponseTimeMs != null
                ? formatResponseTime(avgResponseTimeMs, t)
                : t("stats.noData")}
            </div>
            <StatChange
              change={metrics?.avgResponseTimeChange ?? null}
              label={t("stats.avgResponseTime.changeLabel")}
              invertDirection
            />
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
            <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {satisfactionRate != null
                ? t("stats.satisfactionRate.formatted", { value: satisfactionRate })
                : t("stats.noData")}
            </div>
            <StatChange
              change={metrics?.satisfactionChange ?? null}
              label={t("stats.satisfactionRate.changeLabel")}
            />
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
            <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {formatCount(activeCustomers, numberLocale)}
            </div>
            <StatChange
              change={metrics?.activeCustomersChange ?? null}
              label={t("stats.activeCustomers.changeLabel")}
            />
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 w-full">
        <Card className="elegant-card w-full">
          <CardHeader>
            <CardTitle>{t("charts.messageVolume.title")}</CardTitle>
            <CardDescription>{t("charts.messageVolume.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            {hasChartData ? (
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
                    content={<ChartTooltipContent indicator="line" labelKey="label" nameKey="seriesLabel" />}
                  />
                  <Area
                    dataKey="messages"
                    type="natural"
                    fill="var(--color-messages)"
                    fillOpacity={0.4}
                    stroke="var(--color-messages)"
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[320px] flex-col items-center justify-center gap-3 px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <BarChart3 className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground">{t("charts.empty.title")}</h3>
                  <p className="text-xs text-muted-foreground">{t("charts.empty.description")}</p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/inbox">{t("charts.empty.action")}</Link>
                </Button>
              </div>
            )}
          </CardContent>
          {hasChartData ? (
            <CardFooter>
              <div className="flex w-full items-start gap-2 text-sm">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 leading-none font-medium">
                    {t("charts.messageVolume.total", {
                      count: formatCount(
                        chartData.reduce((sum, entry) => sum + entry.messages, 0),
                        numberLocale,
                      ),
                    })}{" "}
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 leading-none">
                    {chartPeriod}
                  </div>
                </div>
              </div>
            </CardFooter>
          ) : null}
        </Card>
      </div>

      <Card className="elegant-gradient elegant-card">
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
              <Link href="/ai-agents" className="flex items-center gap-2">
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
