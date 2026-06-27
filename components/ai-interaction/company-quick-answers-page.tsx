"use client"

import { useCallback, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { useToast } from "@/hooks/use-toast"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QuickAnswersSection } from "@/components/ai-training/sections/quick-answers-section"
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
  const { toast } = useToast()

  const [items, setItems] = useState<QuickAnswerView[]>(initialItems)
  const [isFetching, setIsFetching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(initialLoadError)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<QuickAnswerView | null>(null)
  const [content, setContent] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

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

  const handleDelete = async (id: string) => {
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
      toast({ title: t("success.deleted"), description: t("success.deletedDescription") })
    } finally {
      setDeletingId(null)
    }
  }

  if (!hasCompanyAccess) {
    return (
      <Card className="elegant-card">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="heading-secondary text-xl">{t("noCompany.title")}</CardTitle>
          <CardDescription>{t("noCompany.description")}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <QuickAnswersSection
      t={t}
      items={displayedItems}
      isFetching={isFetching}
      loadError={loadError}
      onRetry={() => void loadItems()}
      onEdit={(item) => {
        setEditingItem(item)
        setContent(item.content)
        setIsDialogOpen(true)
      }}
      onDelete={(id) => void handleDelete(id)}
      isDeletingId={deletingId}
      dialog={{
        isOpen: isDialogOpen,
        onOpenChange: (open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        },
        onTriggerClick: () => {
          resetForm()
          setIsDialogOpen(true)
        },
        editingQuickAnswer: editingItem,
        content,
        onContentChange: setContent,
        isSubmitting,
        onCancel: () => {
          setIsDialogOpen(false)
          resetForm()
        },
        onSubmit: () => void handleSubmit(),
      }}
    />
  )
}
