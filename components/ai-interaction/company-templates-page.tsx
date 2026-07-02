"use client"

import { useCallback, useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2, MessageSquare, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { ErrorState } from "@/components/ai-training/components/error-state"
import { TemplateDialog } from "@/components/ai-training/dialogs/template-dialog"
import { TemplateListTable } from "@/components/ai-interaction/template-list-table"
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
  const commonT = useTranslations("Common")
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
  const [itemToDelete, setItemToDelete] = useState<TemplateView | null>(null)

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

  const openCreate = () => {
    resetForm()
    setIsDialogOpen(true)
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

  const handleDelete = async () => {
    if (!itemToDelete) return

    const id = itemToDelete.id
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
        <Button onClick={openCreate} className="sm:w-auto" aria-label={t("toolbar.addTemplate")}>
          <Plus className="mr-2 size-4" aria-hidden="true" />
          {t("toolbar.addTemplate")}
        </Button>
        <TemplateDialog
          t={t}
          hideTrigger
          isOpen={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}
          onTriggerClick={openCreate}
          editingTemplate={editingItem}
          isSubmitting={isSubmitting}
          newTemplateName={name}
          onNameChange={setName}
          newTemplateContent={content}
          onContentChange={setContent}
          newTemplateCategory={category}
          onCategoryChange={setCategory}
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
          icon={MessageSquare}
          title={t("errors.loadFailed")}
          description={loadError}
          retryLabel={t("toolbar.retry")}
          onRetry={() => void loadItems()}
        />
      ) : (
        <TemplateListTable
          templates={items}
          onEdit={(item) => {
            setEditingItem(item)
            setName(item.name)
            setContent(item.content)
            setCategory(item.category)
            setIsDialogOpen(true)
          }}
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
          onDelete={(id) => {
            const template = items.find((item) => item.id === id)
            if (template) setItemToDelete(template)
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
        description={
          itemToDelete
            ? t("deleteConfirm.description", { name: itemToDelete.name })
            : t("deleteConfirm.descriptionGeneric")
        }
        onConfirm={() => void handleDelete()}
        isDeleting={Boolean(deletingId)}
        confirmLabel={commonT("delete")}
        cancelLabel={commonT("cancel")}
        deletingLabel={commonT("deleting")}
      />
    </div>
  )
}
