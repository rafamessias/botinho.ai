"use client"

import { useCallback, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2, MessageCircle, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { ErrorState } from "@/components/ai-training/components/error-state"
import { QuickAnswerDialog } from "@/components/ai-training/dialogs/quick-answer-dialog"
import { QuickAnswerListTable } from "@/components/ai-interaction/quick-answer-list-table"
import {
  createQuickAnswerAction,
  deleteQuickAnswerAction,
  getAiTrainingDataAction,
  updateQuickAnswerAction,
} from "@/components/server-actions/ai-training"
import { mapQuickAnswerToView, mapQuickAnswersToView } from "@/components/ai-training/map-quick-answer-views"
import type { QuickAnswerView } from "@/components/ai-training/types"

type CompanyQuickAnswersPageProps = {
  initialItems: QuickAnswerView[]
  initialLoadError?: string | null
  hasCompanyAccess: boolean
}

export default function CompanyQuickAnswersPage({
  initialItems,
  initialLoadError = null,
  hasCompanyAccess,
}: CompanyQuickAnswersPageProps) {
  const t = useTranslations("QuickAnswers")
  const commonT = useTranslations("Common")
  const { toast } = useToast()

  const [items, setItems] = useState<QuickAnswerView[]>(initialItems)
  const [isFetching, setIsFetching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(initialLoadError)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<QuickAnswerView | null>(null)
  const [content, setContent] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [itemToDelete, setItemToDelete] = useState<QuickAnswerView | null>(null)

  const displayedItems = useMemo(
    () => items.filter((item) => item.content.trim().length > 0),
    [items],
  )

  const loadItems = useCallback(async () => {
    if (!hasCompanyAccess) {
      setItems([])
      return
    }

    setIsFetching(true)
    setLoadError(null)

    try {
      const result = await getAiTrainingDataAction()
      if (!result.success || !result.data) {
        setLoadError(result.error || t("errors.loadFailed"))
        return
      }
      setItems(mapQuickAnswersToView(result.data.quickAnswers))
    } catch (error) {
      console.error("Load quick answers error", error)
      setLoadError(t("errors.loadFailed"))
    } finally {
      setIsFetching(false)
    }
  }, [hasCompanyAccess, t])

  const resetForm = () => {
    setEditingItem(null)
    setContent("")
  }

  const openCreate = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: t("errors.fillAllFields"),
        description: t("errors.fillAllFieldsDescription"),
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const result = editingItem
        ? await updateQuickAnswerAction({ id: editingItem.id, content: content.trim() })
        : await createQuickAnswerAction({ content: content.trim() })

      if (!result.success || !result.data) {
        toast({
          title: t("errors.saveFailed"),
          description: result.error || t("errors.tryAgain"),
          variant: "destructive",
        })
        return
      }

      const saved = mapQuickAnswerToView(result.data.quickAnswer)

      setItems((prev) =>
        editingItem ? prev.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...prev],
      )
      resetForm()
      setIsDialogOpen(false)

      toast({
        title: editingItem ? t("success.updated") : t("success.created"),
        description: editingItem ? t("success.updatedDescription") : t("success.createdDescription"),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!itemToDelete) return

    const id = itemToDelete.id
    setDeletingId(id)
    try {
      const result = await deleteQuickAnswerAction({ id })
      if (!result.success) {
        toast({
          title: t("errors.deleteFailed"),
          description: result.error || t("errors.tryAgain"),
          variant: "destructive",
        })
        return
      }
      setItems((prev) => prev.filter((item) => item.id !== id))
      setItemToDelete(null)
      toast({ title: t("success.deleted"), description: t("success.deletedDescription") })
    } finally {
      setDeletingId(null)
    }
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

  return (
    <div className="section-spacing space-y-6">
      <div className="flex justify-end">
        <Button onClick={openCreate} className="sm:w-auto" aria-label={t("toolbar.addQuickAnswer")}>
          <Plus className="mr-2 size-4" aria-hidden="true" />
          {t("toolbar.addQuickAnswer")}
        </Button>
        <QuickAnswerDialog
          t={t}
          hideTrigger
          isOpen={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}
          onTriggerClick={openCreate}
          editingQuickAnswer={editingItem}
          content={content}
          onContentChange={setContent}
          isSubmitting={isSubmitting}
          onCancel={() => {
            setIsDialogOpen(false)
            resetForm()
          }}
          onSubmit={() => void handleSubmit()}
        />
      </div>

      {isFetching ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          {t("loading")}
        </div>
      ) : loadError ? (
        <ErrorState
          icon={MessageCircle}
          title={t("errors.loadFailed")}
          description={loadError}
          retryLabel={t("toolbar.retry")}
          onRetry={() => void loadItems()}
        />
      ) : (
        <QuickAnswerListTable
          items={displayedItems}
          onEdit={(item) => {
            setEditingItem(item)
            setContent(item.content)
            setIsDialogOpen(true)
          }}
          onDelete={(id) => {
            const item = displayedItems.find((entry) => entry.id === id)
            if (item) setItemToDelete(item)
          }}
          isDeletingId={deletingId}
        />
      )}

      <DeleteConfirmDialog
        open={itemToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deletingId) setItemToDelete(null)
        }}
        title={t("deleteConfirm.title")}
        description={t("deleteConfirm.description")}
        onConfirm={() => void handleDelete()}
        isDeleting={Boolean(deletingId)}
        confirmLabel={commonT("delete")}
        cancelLabel={commonT("cancel")}
        deletingLabel={commonT("deleting")}
      />
    </div>
  )
}
