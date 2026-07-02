"use client"

import { useCallback, useState } from "react"
import { useTranslations } from "next-intl"
import { ArrowLeft, ClipboardList, Loader2, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ErrorState } from "@/components/ai-training/components/error-state"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import {
  archiveSurveyAction,
  createSurveyAction,
  deleteSurveyAction,
  duplicateSurveyAction,
  getSurveyAction,
  getSurveyMetricsAction,
  listSurveysAction,
  updateSurveyAction,
  type SurveySummaryView,
  type SurveyView,
} from "@/components/server-actions/surveys"
import type { SurveyDeliveryMode } from "@/lib/types/survey"
import { SurveyEditorForm, emptyQuestion } from "./survey-editor-form"
import { SurveyListTable } from "./survey-list-table"
import { SurveyMetricsPanel } from "./survey-metrics"

type SurveysPageProps = {
  hasCompanyAccess: boolean
  initialSurveys?: SurveySummaryView[]
  initialLoadError?: string | null
}

type PageView = "list" | "edit" | "metrics"

export default function SurveysPage({
  hasCompanyAccess,
  initialSurveys = [],
  initialLoadError = null,
}: SurveysPageProps) {
  const t = useTranslations("Surveys")
  const commonT = useTranslations("Common")
  const { toast } = useToast()

  const [view, setView] = useState<PageView>("list")
  const [surveys, setSurveys] = useState<SurveySummaryView[]>(initialSurveys)
  const [selectedSurvey, setSelectedSurvey] = useState<SurveySummaryView | null>(null)
  const [editor, setEditor] = useState<Partial<SurveyView> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingEditor, setIsLoadingEditor] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(initialLoadError)
  const [surveyToDelete, setSurveyToDelete] = useState<SurveySummaryView | null>(null)
  const [surveyToArchive, setSurveyToArchive] = useState<SurveySummaryView | null>(null)
  const [deletingSurveyId, setDeletingSurveyId] = useState<string | null>(null)
  const [isArchiving, setIsArchiving] = useState(false)

  const loadSurveys = useCallback(async () => {
    if (!hasCompanyAccess) {
      setSurveys([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setLoadError(null)
    try {
      const result = await listSurveysAction()
      if (!result.success || !result.data) {
        setLoadError(result.error || t("errors.loadFailed"))
        return
      }
      setSurveys(result.data.surveys.filter((s) => s.status !== "archived"))
    } catch {
      setLoadError(t("errors.loadFailed"))
    } finally {
      setIsLoading(false)
    }
  }, [hasCompanyAccess, t])

  const goToList = () => {
    setView("list")
    setSelectedSurvey(null)
    setEditor(null)
  }

  const openCreate = () => {
    setSelectedSurvey(null)
    setEditor({
      name: "",
      description: "",
      deliveryMode: "both",
      status: "draft",
      questions: [emptyQuestion()],
      introMessage: "",
      thankYouMessage: t("defaults.thankYou"),
      metricsConfig: { showAverage: true, showNps: true, showDistribution: true },
    })
    setView("edit")
  }

  const openEdit = async (survey: SurveySummaryView) => {
    setSelectedSurvey(survey)
    setView("edit")
    setIsLoadingEditor(true)
    setEditor({
      id: survey.id,
      name: survey.name,
      slug: survey.slug,
      deliveryMode: survey.deliveryMode,
      status: survey.status,
      questions: [],
      metricsConfig: { showAverage: true, showNps: true, showDistribution: true },
      createdById: "",
      createdAt: survey.updatedAt,
      updatedAt: survey.updatedAt,
    })

    try {
      const result = await getSurveyAction({ surveyId: survey.id })
      if (result.success && result.data) {
        setEditor(result.data.survey)
      }
    } finally {
      setIsLoadingEditor(false)
    }
  }

  const openMetrics = (survey: SurveySummaryView) => {
    setSelectedSurvey(survey)
    setView("metrics")
  }

  const handleSave = async () => {
    if (!editor?.name?.trim()) {
      toast({ title: t("errors.nameRequired"), variant: "destructive" })
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        name: editor.name,
        description: editor.description,
        deliveryMode: editor.deliveryMode as SurveyDeliveryMode,
        status: editor.status,
        questions: editor.questions ?? [],
        introMessage: editor.introMessage,
        thankYouMessage: editor.thankYouMessage,
      }

      const result = selectedSurvey
        ? await updateSurveyAction({ surveyId: selectedSurvey.id, ...payload })
        : await createSurveyAction(payload)

      if (!result.success || !result.data) {
        toast({ title: result.error || t("errors.saveFailed"), variant: "destructive" })
        return
      }

      toast({ title: t("messages.saved") })
      await loadSurveys()
      goToList()
    } finally {
      setIsSaving(false)
    }
  }

  const handleArchive = async (surveyId: string) => {
    setIsArchiving(true)
    try {
      const result = await archiveSurveyAction({ surveyId })
      if (!result.success) {
        toast({ title: result.error || t("errors.archiveFailed"), variant: "destructive" })
        return
      }
      if (selectedSurvey?.id === surveyId) goToList()
      await loadSurveys()
      toast({ title: t("messages.archived") })
      setSurveyToArchive(null)
    } finally {
      setIsArchiving(false)
    }
  }

  const handleDelete = async () => {
    if (!surveyToDelete) return

    setDeletingSurveyId(surveyToDelete.id)
    try {
      const result = await deleteSurveyAction({ surveyId: surveyToDelete.id })
      if (!result.success) {
        toast({ title: result.error || t("errors.deleteFailed"), variant: "destructive" })
        return
      }
      if (selectedSurvey?.id === surveyToDelete.id) goToList()
      await loadSurveys()
      toast({ title: t("messages.deleted") })
      setSurveyToDelete(null)
    } finally {
      setDeletingSurveyId(null)
    }
  }

  const handleDuplicate = async (surveyId: string) => {
    const result = await duplicateSurveyAction({ surveyId })
    if (!result.success || !result.data) {
      toast({ title: result.error || t("errors.duplicateFailed"), variant: "destructive" })
      return
    }
    await loadSurveys()
    toast({ title: t("messages.duplicated") })
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
            <CardTitle>{selectedSurvey ? t("view.editSurvey") : t("view.newSurvey")}</CardTitle>
            <CardDescription>{t("editor.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingEditor ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {t("loading")}
              </div>
            ) : editor ? (
              <SurveyEditorForm
                editor={editor}
                isSaving={isSaving}
                onChange={setEditor}
                onSave={() => void handleSave()}
              />
            ) : null}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (view === "metrics" && selectedSurvey) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" className="-ml-2" onClick={goToList}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("view.backToList")}
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{t("view.metricsFor", { name: selectedSurvey.name })}</CardTitle>
            <CardDescription>
              {selectedSurvey.responseCount} {t("list.responses")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SurveyMetricsPanel surveyId={selectedSurvey.id} onLoadMetrics={getSurveyMetricsAction} />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="section-spacing space-y-6">
      <div className="flex justify-end">
        <Button onClick={openCreate} className="sm:w-auto" aria-label={t("toolbar.addSurvey")}>
          <Plus className="mr-2 size-4" aria-hidden="true" />
          {t("toolbar.addSurvey")}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          {t("loading")}
        </div>
      ) : loadError ? (
        <ErrorState
          icon={ClipboardList}
          title={t("errors.loadFailed")}
          description={loadError}
          retryLabel={t("toolbar.retry")}
          onRetry={() => void loadSurveys()}
        />
      ) : (
        <SurveyListTable
          surveys={surveys}
          onEdit={(survey) => void openEdit(survey)}
          onMetrics={openMetrics}
          onDuplicate={(id) => void handleDuplicate(id)}
          onDelete={(id) => {
            const survey = surveys.find((entry) => entry.id === id)
            if (survey) setSurveyToDelete(survey)
          }}
          onArchive={(id) => {
            const survey = surveys.find((entry) => entry.id === id)
            if (survey) setSurveyToArchive(survey)
          }}
          deletingSurveyId={deletingSurveyId}
        />
      )}

      <DeleteConfirmDialog
        open={surveyToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deletingSurveyId) setSurveyToDelete(null)
        }}
        title={t("deleteConfirm.title")}
        description={t("deleteConfirm.description")}
        onConfirm={() => void handleDelete()}
        isDeleting={Boolean(deletingSurveyId)}
        confirmLabel={commonT("delete")}
        cancelLabel={commonT("cancel")}
        deletingLabel={commonT("deleting")}
      />

      <DeleteConfirmDialog
        open={surveyToArchive !== null}
        onOpenChange={(open) => {
          if (!open && !isArchiving) setSurveyToArchive(null)
        }}
        title={t("archiveConfirm.title")}
        description={t("archiveConfirm.description")}
        onConfirm={() => {
          if (surveyToArchive) void handleArchive(surveyToArchive.id)
        }}
        isDeleting={isArchiving}
        confirmLabel={t("actions.archive")}
        cancelLabel={commonT("cancel")}
        deletingLabel={commonT("loading")}
      />
    </div>
  )
}
