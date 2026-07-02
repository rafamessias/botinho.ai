"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { getSurveyMetricsAction } from "@/components/server-actions/surveys"

type SurveyMetricsPanelProps = {
  surveyId: string
  onLoadMetrics: typeof getSurveyMetricsAction
}

export const SurveyMetricsPanel = ({ surveyId, onLoadMetrics }: SurveyMetricsPanelProps) => {
  const t = useTranslations("Surveys.metrics")
  const [metrics, setMetrics] = useState<Awaited<
    ReturnType<typeof getSurveyMetricsAction>
  >["data"] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    void (async () => {
      setIsLoading(true)
      const result = await onLoadMetrics({ surveyId })
      if (result.success && result.data) {
        setMetrics(result.data)
      }
      setIsLoading(false)
    })()
  }, [surveyId, onLoadMetrics])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        {t("loading")}
      </div>
    )
  }

  if (!metrics) {
    return <p className="text-sm text-muted-foreground">{t("empty")}</p>
  }

  const { metrics: data } = metrics

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard label={t("sent")} value={String(data.totalSent)} />
      <MetricCard label={t("completed")} value={String(data.totalCompleted)} />
      <MetricCard label={t("responseRate")} value={`${data.responseRate}%`} />
      {data.averageRating != null && (
        <MetricCard label={t("averageRating")} value={String(data.averageRating)} />
      )}
      {data.npsScore != null && <MetricCard label={t("nps")} value={String(data.npsScore)} />}

      {Object.keys(data.distribution).length > 0 && (
        <Card className="sm:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base">{t("distribution")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(data.distribution).map(([key, count]) => (
              <div key={key} className="flex items-center justify-between text-sm">
                <span>{key}</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

const MetricCard = ({ label, value }: { label: string; value: string }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-semibold">{value}</p>
    </CardContent>
  </Card>
)
