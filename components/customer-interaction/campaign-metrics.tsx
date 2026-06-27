"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { getCampaignMetricsAction } from "@/components/server-actions/campaigns"

type CampaignMetricsPanelProps = {
  campaignId: string
  onLoadMetrics: typeof getCampaignMetricsAction
}

export const CampaignMetricsPanel = ({ campaignId, onLoadMetrics }: CampaignMetricsPanelProps) => {
  const t = useTranslations("Campaigns.metrics")
  const [metrics, setMetrics] = useState<Awaited<
    ReturnType<typeof getCampaignMetricsAction>
  >["data"] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    void (async () => {
      setIsLoading(true)
      const result = await onLoadMetrics({ campaignId })
      if (result.success && result.data) {
        setMetrics(result.data)
      }
      setIsLoading(false)
    })()
  }, [campaignId, onLoadMetrics])

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
  const progress =
    data.targeted > 0
      ? Math.round(((data.delivered + data.failed + data.skipped) / data.targeted) * 100)
      : 0

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label={t("targeted")} value={String(data.targeted)} />
        <MetricCard label={t("delivered")} value={String(data.delivered)} />
        <MetricCard label={t("failed")} value={String(data.failed)} />
        <MetricCard label={t("responses")} value={String(data.responses)} />
        <MetricCard label={t("responseRate")} value={`${Math.round(data.responseRate * 100)}%`} />
        <MetricCard label={t("botReplies")} value={String(data.botReplies)} />
        <MetricCard label={t("skipped")} value={String(data.skipped)} />
        <MetricCard label={t("progress")} value={`${progress}%`} />
      </div>

      {data.deliveries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("deliveries")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("customer")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead>{t("sentAt")}</TableHead>
                  <TableHead>{t("failureReason")}</TableHead>
                  <TableHead>{t("responded")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.deliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell>{delivery.customerName}</TableCell>
                    <TableCell>{delivery.status}</TableCell>
                    <TableCell>
                      {delivery.sentAt ? new Date(delivery.sentAt).toLocaleString() : "—"}
                    </TableCell>
                    <TableCell>{delivery.failureReason ?? "—"}</TableCell>
                    <TableCell>{delivery.respondedAt ? t("yes") : t("no")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
