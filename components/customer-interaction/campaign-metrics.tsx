"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  getCampaignMetricsAction,
  type CampaignMetricsView,
} from "@/components/server-actions/campaigns"
import type { CampaignMetrics } from "@/lib/types/campaign"

type CampaignMetricsPanelProps = {
  campaignId: string
  initialSummary?: CampaignMetrics
}

export const CampaignMetricsPanel = ({
  campaignId,
  initialSummary,
}: CampaignMetricsPanelProps) => {
  const t = useTranslations("Campaigns.metrics")
  const tToolbar = useTranslations("Campaigns.toolbar")
  const tErrors = useTranslations("Campaigns.errors")
  const [metrics, setMetrics] = useState<CampaignMetricsView | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    const loadMetrics = async () => {
      setIsLoading(true)
      setLoadError(null)
      try {
        const result = await getCampaignMetricsAction({ campaignId })
        if (cancelled) return
        if (result.success && result.data?.metrics) {
          setMetrics(result.data.metrics)
        } else {
          setLoadError(result.error ?? t("empty"))
        }
      } catch {
        if (!cancelled) setLoadError(tErrors("loadFailed"))
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void loadMetrics()
    return () => {
      cancelled = true
    }
  }, [campaignId, reloadKey])

  const summary = metrics ?? initialSummary

  if (isLoading && !summary) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        {t("loading")}
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">{loadError ?? t("empty")}</p>
        {loadError && (
          <Button variant="outline" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            {tToolbar("retry")}
          </Button>
        )}
      </div>
    )
  }

  const progress =
    summary.targeted > 0
      ? Math.round(((summary.delivered + summary.failed + summary.skipped) / summary.targeted) * 100)
      : 0

  const deliveries = metrics?.deliveries ?? []

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("loading")}
        </div>
      )}

      {loadError && !isLoading && (
        <div className="flex flex-wrap items-center gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          <span>{loadError}</span>
          <Button variant="outline" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            {tToolbar("retry")}
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label={t("targeted")} value={String(summary.targeted)} />
        <MetricCard label={t("delivered")} value={String(summary.delivered)} />
        <MetricCard label={t("failed")} value={String(summary.failed)} />
        <MetricCard label={t("responses")} value={String(summary.responses)} />
        <MetricCard
          label={t("responseRate")}
          value={`${Math.round(summary.responseRate * 100)}%`}
        />
        <MetricCard label={t("botReplies")} value={String(summary.botReplies)} />
        <MetricCard label={t("skipped")} value={String(summary.skipped)} />
        <MetricCard label={t("progress")} value={`${progress}%`} />
      </div>

      {deliveries.length > 0 && (
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
                {deliveries.map((delivery) => (
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
