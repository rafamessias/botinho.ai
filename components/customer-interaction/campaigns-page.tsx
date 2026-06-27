"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { ArrowLeft, Loader2, Megaphone, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TagInput } from "@/components/ui/tag-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ErrorState } from "@/components/ai-training/components/error-state"
import { CampaignListTable } from "@/components/customer-interaction/campaign-list-table"
import { CampaignMetricsPanel } from "@/components/customer-interaction/campaign-metrics"
import { CampaignMessageTemplates } from "@/components/customer-interaction/campaign-message-templates"
import { renderCampaignMessage } from "@/lib/campaign/message-variables"
import { CAMPAIGN_VARIABLE_TOKENS } from "@/lib/types/campaign"
import {
  cancelCampaignAction,
  createCampaignAction,
  duplicateCampaignAction,
  getCampaignAction,
  getCampaignMetricsAction,
  launchCampaignAction,
  listAgentsForCampaignAction,
  listCampaignsAction,
  listCompanyTagsAction,
  pauseCampaignAction,
  previewCampaignAudienceAction,
  resumeCampaignAction,
  updateCampaignAction,
  type CampaignSummaryView,
  type CampaignView,
  type CampaignAudiencePreviewView,
} from "@/components/server-actions/campaigns"

type CampaignAgentOption = {
  id: string
  name: string
  sessionIds: string[]
  autoReply: boolean
}

type CampaignsPageProps = {
  hasCompanyAccess: boolean
  initialCampaigns?: CampaignSummaryView[]
  initialAvailableTags?: string[]
  initialAgents?: CampaignAgentOption[]
  initialLoadError?: string | null
}

type ViewMode = "list" | "edit" | "metrics"

const emptyEditor = (): Partial<CampaignView> => ({
  name: "",
  description: "",
  messageTemplate: "",
  targetTags: [],
  targetCustomerStatus: "active",
  agentId: undefined,
  sessionId: undefined,
  schedule: {
    messagesPerInterval: 10,
    intervalMinutes: 5,
  },
})

export default function CampaignsPage({
  hasCompanyAccess,
  initialCampaigns = [],
  initialAvailableTags = [],
  initialAgents = [],
  initialLoadError = null,
}: CampaignsPageProps) {
  const t = useTranslations("Campaigns")
  const { toast } = useToast()

  const [campaigns, setCampaigns] = useState<CampaignSummaryView[]>(initialCampaigns)
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignSummaryView | null>(null)
  const [editor, setEditor] = useState<Partial<CampaignView> | null>(null)
  const [view, setView] = useState<ViewMode>("list")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [launchingCampaignId, setLaunchingCampaignId] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(initialLoadError)
  const [availableTags, setAvailableTags] = useState<string[]>(initialAvailableTags)
  const [agents, setAgents] = useState<CampaignAgentOption[]>(initialAgents)
  const [audiencePreview, setAudiencePreview] = useState<CampaignAudiencePreviewView | null>(null)
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)

  const loadCampaigns = useCallback(async () => {
    if (!hasCompanyAccess) {
      setCampaigns([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setLoadError(null)
    try {
      const [campaignsResult, tagsResult, agentsResult] = await Promise.all([
        listCampaignsAction(),
        listCompanyTagsAction(),
        listAgentsForCampaignAction(),
      ])

      if (!campaignsResult.success || !campaignsResult.data) {
        setLoadError(campaignsResult.error || t("errors.loadFailed"))
        return
      }

      setCampaigns(campaignsResult.data.campaigns.filter((item) => item.status !== "cancelled"))
      if (tagsResult.success && tagsResult.data) setAvailableTags(tagsResult.data.tags)
      if (agentsResult.success && agentsResult.data) setAgents(agentsResult.data.agents)
    } catch {
      setLoadError(t("errors.loadFailed"))
    } finally {
      setIsLoading(false)
    }
  }, [hasCompanyAccess, t])

  const selectedAgent = useMemo(
    () => agents.find((agent) => agent.id === editor?.agentId),
    [agents, editor?.agentId],
  )

  const previewMessage = useMemo(() => {
    if (!editor?.messageTemplate) return ""
    return renderCampaignMessage(editor.messageTemplate, {
      customer: {
        name: "Jane Doe",
        phone: "5511999999999",
        email: "jane@example.com",
        company: "Acme Co",
      },
      company: { name: "Your Company" },
    })
  }, [editor?.messageTemplate])

  const goToList = () => {
    setView("list")
    setSelectedCampaign(null)
    setEditor(null)
    setAudiencePreview(null)
  }

  const openCreate = () => {
    setSelectedCampaign(null)
    setEditor(emptyEditor())
    setView("edit")
  }

  const openEdit = async (campaign: CampaignSummaryView) => {
    setSelectedCampaign(campaign)
    setEditor(emptyEditor())
    setView("edit")

    const result = await getCampaignAction({ campaignId: campaign.id })
    if (result.success && result.data) {
      setEditor(result.data.campaign)
    }
  }

  const openMetrics = (campaign: CampaignSummaryView) => {
    setSelectedCampaign(campaign)
    setView("metrics")
  }

  useEffect(() => {
    setAudiencePreview(null)
  }, [editor?.targetTags, editor?.targetCustomerStatus])

  const handlePreviewAudience = async () => {
    if (!editor?.targetTags?.length) {
      toast({ title: t("errors.tagsRequired"), variant: "destructive" })
      return
    }

    setIsPreviewLoading(true)
    try {
      const result = await previewCampaignAudienceAction({
        targetTags: editor.targetTags,
        targetCustomerStatus: editor.targetCustomerStatus,
      })
      if (!result.success || !result.data) {
        toast({ title: result.error || t("errors.previewFailed"), variant: "destructive" })
        return
      }
      setAudiencePreview(result.data.preview)
    } catch {
      toast({ title: t("errors.previewFailed"), variant: "destructive" })
    } finally {
      setIsPreviewLoading(false)
    }
  }

  const handleSave = async () => {
    if (!editor?.name?.trim()) {
      toast({ title: t("errors.nameRequired"), variant: "destructive" })
      return
    }
    if (!editor.messageTemplate?.trim()) {
      toast({ title: t("errors.messageRequired"), variant: "destructive" })
      return
    }
    if (!editor.targetTags?.length) {
      toast({ title: t("errors.tagsRequired"), variant: "destructive" })
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        name: editor.name,
        description: editor.description,
        messageTemplate: editor.messageTemplate,
        targetTags: editor.targetTags,
        targetCustomerStatus: editor.targetCustomerStatus,
        agentId: editor.agentId ?? null,
        sessionId: editor.sessionId ?? null,
        schedule: editor.schedule
          ? {
              startAt: editor.schedule.startAt?.toISOString(),
              messagesPerInterval: editor.schedule.messagesPerInterval,
              intervalMinutes: editor.schedule.intervalMinutes,
            }
          : undefined,
      }

      const result = selectedCampaign
        ? await updateCampaignAction({ campaignId: selectedCampaign.id, ...payload })
        : await createCampaignAction(payload)

      if (!result.success || !result.data) {
        toast({ title: result.error || t("errors.saveFailed"), variant: "destructive" })
        return
      }

      toast({ title: t("messages.saved") })
      await loadCampaigns()
      goToList()
    } finally {
      setIsSaving(false)
    }
  }

  const handleLaunch = async (campaignId: string) => {
    setLaunchingCampaignId(campaignId)
    try {
      const result = await launchCampaignAction({ campaignId })
      if (!result.success) {
        toast({ title: result.error || t("errors.launchFailed"), variant: "destructive" })
        return
      }
      toast({ title: t("messages.launched") })
      await loadCampaigns()
      if (view !== "list") {
        goToList()
      }
    } finally {
      setLaunchingCampaignId(null)
    }
  }

  const handleLifecycle = async (
    action: "pause" | "resume" | "cancel" | "duplicate",
    campaignId: string,
  ) => {
    const actionMap = {
      pause: pauseCampaignAction,
      resume: resumeCampaignAction,
      cancel: cancelCampaignAction,
      duplicate: duplicateCampaignAction,
    }

    const result = await actionMap[action]({ campaignId })
    if (!result.success) {
      toast({ title: result.error || t("errors.actionFailed"), variant: "destructive" })
      return
    }

    toast({ title: t(`messages.${action}`) })
    await loadCampaigns()
    if (action === "cancel") goToList()
  }

  const insertVariable = (token: string) => {
    setEditor((current) => ({
      ...current,
      messageTemplate: `${current?.messageTemplate ?? ""}{{${token}}}`,
    }))
  }

  if (!hasCompanyAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("noCompany.title")}</CardTitle>
          <CardDescription>{t("noCompany.description")}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (view === "edit") {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" className="-ml-2" onClick={goToList}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("view.backToList")}
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{selectedCampaign ? t("view.editCampaign") : t("view.newCampaign")}</CardTitle>
            <CardDescription>{t("editor.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">{t("editor.name")}</Label>
                <Input
                  id="campaign-name"
                  value={editor?.name ?? ""}
                  onChange={(event) => setEditor((current) => ({ ...current, name: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campaign-status">{t("editor.customerStatus")}</Label>
                <Select
                  value={editor?.targetCustomerStatus ?? "active"}
                  onValueChange={(value) =>
                    setEditor((current) => ({
                      ...current,
                      targetCustomerStatus: value as CampaignView["targetCustomerStatus"],
                    }))
                  }
                >
                  <SelectTrigger id="campaign-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{t("editor.statusActive")}</SelectItem>
                    <SelectItem value="prospect">{t("editor.statusProspect")}</SelectItem>
                    <SelectItem value="inactive">{t("editor.statusInactive")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaign-description">{t("editor.descriptionField")}</Label>
              <Textarea
                id="campaign-description"
                value={editor?.description ?? ""}
                onChange={(event) =>
                  setEditor((current) => ({ ...current, description: event.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaign-message">{t("editor.message")}</Label>
              <CampaignMessageTemplates
                onApply={(template) => {
                  setEditor((current) => ({
                    ...current,
                    name: current?.name?.trim() ? current.name : template.name,
                    messageTemplate: template.message,
                    description: current?.description?.trim()
                      ? current.description
                      : template.description,
                  }))
                  toast({ title: t("editor.templateApplied") })
                }}
              />
              <Textarea
                id="campaign-message"
                rows={5}
                value={editor?.messageTemplate ?? ""}
                onChange={(event) =>
                  setEditor((current) => ({ ...current, messageTemplate: event.target.value }))
                }
              />
              <div className="flex flex-wrap gap-2">
                {CAMPAIGN_VARIABLE_TOKENS.map((token) => (
                  <Button
                    key={token}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertVariable(token)}
                  >
                    {`{{${token}}}`}
                  </Button>
                ))}
              </div>
              {previewMessage && (
                <div className="rounded-md border bg-muted/40 p-3 text-sm">
                  <p className="mb-1 font-medium text-muted-foreground">{t("editor.preview")}</p>
                  <p className="whitespace-pre-wrap">{previewMessage}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t("editor.tags")}</Label>
              <TagInput
                value={editor?.targetTags ?? []}
                onChange={(tags) => setEditor((current) => ({ ...current, targetTags: tags }))}
                suggestions={availableTags}
                placeholder={t("editor.tagsPlaceholder")}
              />
              <p className="text-xs text-muted-foreground">{t("editor.tagsHint")}</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={isPreviewLoading || !(editor?.targetTags?.length ?? 0)}
                  onClick={() => void handlePreviewAudience()}
                >
                  {isPreviewLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("editor.previewAudience")}
                </Button>
              </div>
              {audiencePreview && (
                <div className="rounded-md border bg-muted/30 p-4 space-y-3">
                  <p className="text-sm font-medium">{t("editor.audiencePreviewTitle")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("editor.audienceCounts", {
                      matched: audiencePreview.matchedByTags,
                      eligible: audiencePreview.eligible,
                    })}
                  </p>
                  {audiencePreview.eligible === 0 ? (
                    <p className="text-sm text-muted-foreground">{t("editor.audienceEmpty")}</p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        {t("editor.audienceSample")}
                      </p>
                      <ul className="space-y-1 text-sm">
                        {audiencePreview.sample.map((customer) => (
                          <li key={customer.id} className="flex flex-wrap gap-x-2">
                            <span className="font-medium">{customer.name}</span>
                            <span className="text-muted-foreground">{customer.phone}</span>
                            {customer.tags.length > 0 && (
                              <span className="text-muted-foreground">
                                ({customer.tags.join(", ")})
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="messages-per-interval">{t("editor.messagesPerInterval")}</Label>
                <Input
                  id="messages-per-interval"
                  type="number"
                  min={1}
                  value={editor?.schedule?.messagesPerInterval ?? 10}
                  onChange={(event) =>
                    setEditor((current) => ({
                      ...current,
                      schedule: {
                        ...current?.schedule,
                        messagesPerInterval: Number(event.target.value) || 1,
                        intervalMinutes: current?.schedule?.intervalMinutes ?? 5,
                      },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interval-minutes">{t("editor.intervalMinutes")}</Label>
                <Input
                  id="interval-minutes"
                  type="number"
                  min={1}
                  value={editor?.schedule?.intervalMinutes ?? 5}
                  onChange={(event) =>
                    setEditor((current) => ({
                      ...current,
                      schedule: {
                        ...current?.schedule,
                        messagesPerInterval: current?.schedule?.messagesPerInterval ?? 10,
                        intervalMinutes: Number(event.target.value) || 1,
                      },
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("editor.agent")}</Label>
                <Select
                  value={editor?.agentId ?? "none"}
                  onValueChange={(value) =>
                    setEditor((current) => ({
                      ...current,
                      agentId: value === "none" ? undefined : value,
                      sessionId: undefined,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("editor.agentPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t("editor.noAgent")}</SelectItem>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedAgent && selectedAgent.sessionIds.length > 1 && (
                <div className="space-y-2">
                  <Label>{t("editor.session")}</Label>
                  <Select
                    value={editor?.sessionId ?? selectedAgent.sessionIds[0]}
                    onValueChange={(value) => setEditor((current) => ({ ...current, sessionId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedAgent.sessionIds.map((sessionId) => (
                        <SelectItem key={sessionId} value={sessionId}>
                          {sessionId}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button disabled={isSaving} onClick={() => void handleSave()}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("editor.save")}
              </Button>
              {selectedCampaign && selectedCampaign.status === "draft" && (
                  <Button
                    variant="default"
                    disabled={launchingCampaignId === selectedCampaign.id}
                    onClick={() => void handleLaunch(selectedCampaign.id)}
                  >
                    {launchingCampaignId === selectedCampaign.id && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {t("editor.launch")}
                  </Button>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (view === "metrics" && selectedCampaign) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" className="-ml-2" onClick={goToList}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("view.backToList")}
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{t("view.metricsFor", { name: selectedCampaign.name })}</CardTitle>
            <CardDescription>
              {selectedCampaign.metrics.delivered}/{selectedCampaign.metrics.targeted}{" "}
              {t("list.delivered")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CampaignMetricsPanel
              campaignId={selectedCampaign.id}
              onLoadMetrics={getCampaignMetricsAction}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="section-spacing space-y-6">
      <div className="flex justify-end">
        <Button onClick={openCreate} className="sm:w-auto" aria-label={t("toolbar.addCampaign")}>
          <Plus className="mr-2 size-4" aria-hidden="true" />
          {t("toolbar.addCampaign")}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          {t("loading")}
        </div>
      ) : loadError ? (
        <ErrorState
          icon={Megaphone}
          title={t("errors.loadFailed")}
          description={loadError}
          retryLabel={t("toolbar.retry")}
          onRetry={() => void loadCampaigns()}
        />
      ) : (
        <CampaignListTable
          campaigns={campaigns}
          onEdit={(campaign) => void openEdit(campaign)}
          onMetrics={openMetrics}
          onLaunch={(id) => void handleLaunch(id)}
          onPause={(id) => void handleLifecycle("pause", id)}
          onResume={(id) => void handleLifecycle("resume", id)}
          onCancel={(id) => void handleLifecycle("cancel", id)}
          onDuplicate={(id) => void handleLifecycle("duplicate", id)}
          launchingCampaignId={launchingCampaignId}
        />
      )}
    </div>
  )
}
