"use client"

import { useCallback, useState } from "react"
import { useTranslations } from "next-intl"
import { useToast } from "@/hooks/use-toast"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TemplatesSection } from "@/components/ai-training/sections/templates-section"
import {
  createAiTemplateAction,
  deleteAiTemplateAction,
  getAiTrainingDataAction,
  updateAiTemplateAction,
} from "@/components/server-actions/ai-training"
import { mapTemplateToView, mapTemplatesToView } from "@/components/ai-training/map-template-views"
import { AiTemplateCategory } from "@/lib/types/enums"
import type { TemplateView } from "@/components/ai-training/types"
import { copyToClipboard } from "@/lib/copy-to-clipboard"

type CompanyTemplatesPageProps = {
  initialItems: TemplateView[]
  initialLoadError?: string | null
  hasCompanyAccess: boolean
}

export default function CompanyTemplatesPage({
  initialItems,
  initialLoadError = null,
  hasCompanyAccess,
}: CompanyTemplatesPageProps) {
  const t = useTranslations("Templates")
  const { toast } = useToast()

  const [items, setItems] = useState<TemplateView[]>(initialItems)
  const [isFetching, setIsFetching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(initialLoadError)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<TemplateView | null>(null)
  const [name, setName] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState<AiTemplateCategory>(AiTemplateCategory.greeting)
  const [deletingId, setDeletingId] = useState<string | null>(null)

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
      setItems(mapTemplatesToView(result.data.templates))
    } catch (error) {
      console.error("Load templates error", error)
      setLoadError(t("errors.loadFailed"))
    } finally {
      setIsFetching(false)
    }
  }, [hasCompanyAccess, t])

  const resetForm = () => {
    setEditingItem(null)
    setName("")
    setContent("")
    setCategory(AiTemplateCategory.greeting)
  }

  const preserveTemplateOptions = (template: TemplateView) =>
    template.options
      ?.map((option) => ({ label: option.label.trim(), value: option.value.trim() }))
      .filter((option) => option.label && option.value)

  const handleSubmit = async () => {
    if (!name.trim() || !content.trim()) {
      toast({
        title: t("errors.fillAllFields"),
        description: t("errors.fillAllFieldsDescription"),
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        name: name.trim(),
        content: content.trim(),
        category,
        ...(editingItem
          ? (() => {
              const preservedOptions = preserveTemplateOptions(editingItem)
              return preservedOptions?.length ? { options: preservedOptions } : {}
            })()
          : {}),
      }

      const result = editingItem
        ? await updateAiTemplateAction({ ...payload, id: editingItem.id })
        : await createAiTemplateAction(payload)

      if (!result.success || !result.data?.template) {
        toast({
          title: t("errors.saveFailed"),
          description: result.error || t("errors.tryAgain"),
          variant: "destructive",
        })
        return
      }

      const mapped = mapTemplateToView(result.data.template)

      setItems((prev) =>
        editingItem ? prev.map((item) => (item.id === mapped.id ? mapped : item)) : [mapped, ...prev],
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
      const result = await deleteAiTemplateAction({ id })
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
    <TemplatesSection
      t={t}
      items={items}
      isFetching={isFetching}
      loadError={loadError}
      onRetry={() => void loadItems()}
      onCopy={async (text) => {
        try {
          await copyToClipboard(text)
          toast({ title: t("success.copied"), description: t("success.copiedDescription") })
        } catch (error) {
          console.error("Copy template error", error)
          toast({
            title: t("errors.copyFailed"),
            description: t("errors.tryAgain"),
            variant: "destructive",
          })
        }
      }}
      onEdit={(item) => {
        setEditingItem(item)
        setName(item.name)
        setContent(item.content)
        setCategory(item.category)
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
        editingTemplate: editingItem,
        isSubmitting,
        newTemplateName: name,
        onNameChange: setName,
        newTemplateContent: content,
        onContentChange: setContent,
        newTemplateCategory: category,
        onCategoryChange: setCategory,
        onCancel: () => {
          setIsDialogOpen(false)
          resetForm()
        },
        onSubmit: () => void handleSubmit(),
      }}
    />
  )
}
