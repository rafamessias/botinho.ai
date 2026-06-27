"use client"

import { useCallback, useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/components/user-provider"
import { KnowledgeSection } from "@/components/ai-training/sections/knowledge-section"
import {
  createAgentKnowledgeItemAction,
  deleteAgentKnowledgeItemAction,
  getAgentTrainingDataAction,
  updateAgentKnowledgeItemAction,
} from "@/components/server-actions/ai-agents"
import { KnowledgeItemType } from "@/lib/types/enums"
import type { KnowledgeItemView } from "@/components/ai-training/types"

type AgentKnowledgeEditorProps = {
  agentId: string
}

const knowledgeTypeToView = (type: KnowledgeItemType): "text" | "url" =>
  type === KnowledgeItemType.TEXT ? "text" : "url"

const knowledgeTypeFromView = (value: "text" | "url"): KnowledgeItemType =>
  value === "text" ? KnowledgeItemType.TEXT : KnowledgeItemType.URL

const formatDateValue = (value: Date | string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return date.toISOString().split("T")[0]
}

export const AgentKnowledgeEditor = ({ agentId }: AgentKnowledgeEditorProps) => {
  const t = useTranslations("AiAgents")
  const { toast } = useToast()
  const { user } = useUser()

  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeItemView[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<KnowledgeItemView | null>(null)
  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")
  const [activeTab, setActiveTab] = useState<"text" | "url">("text")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const hasCompanyAccess = Boolean(user?.defaultCompanyId)

  const mapKnowledgeItem = useCallback(
    (item: {
      id: string
      type: KnowledgeItemType
      title: string
      content: string
      createdAt: Date | string
      updatedAt: Date | string
    }): KnowledgeItemView => ({
      id: item.id,
      type: knowledgeTypeToView(item.type),
      title: item.title,
      content: item.content,
      createdAt: formatDateValue(item.createdAt),
      updatedAt: formatDateValue(item.updatedAt),
    }),
    [],
  )

  const loadKnowledge = useCallback(async () => {
    if (!hasCompanyAccess) {
      setKnowledgeBase([])
      return
    }

    setIsFetching(true)
    setLoadError(null)

    try {
      const result = await getAgentTrainingDataAction({ agentId })
      if (!result.success || !result.data) {
        setLoadError(result.error || t("errors.loadFailed"))
        return
      }
      setKnowledgeBase(result.data.knowledgeBase.map(mapKnowledgeItem))
    } catch (error) {
      console.error("Load agent knowledge error", error)
      setLoadError(error instanceof Error ? error.message : t("errors.loadFailed"))
    } finally {
      setIsFetching(false)
    }
  }, [agentId, hasCompanyAccess, mapKnowledgeItem, t])

  useEffect(() => {
    void loadKnowledge()
  }, [loadKnowledge])

  const resetForm = () => {
    setEditingItem(null)
    setNewTitle("")
    setNewContent("")
    setActiveTab("text")
  }

  const handleSubmit = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
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
        agentId,
        title: newTitle.trim(),
        content: newContent.trim(),
        type: knowledgeTypeFromView(activeTab),
      }

      const result = editingItem
        ? await updateAgentKnowledgeItemAction({ ...payload, id: editingItem.id })
        : await createAgentKnowledgeItemAction(payload)

      if (!result.success || !result.data) {
        toast({
          title: t("errors.saveKnowledgeFailed"),
          description: result.error || t("errors.tryAgain"),
          variant: "destructive",
        })
        return
      }

      const item = mapKnowledgeItem(result.data.knowledgeItem)
      setKnowledgeBase((prev) =>
        editingItem ? prev.map((entry) => (entry.id === item.id ? item : entry)) : [item, ...prev],
      )
      resetForm()
      setIsDialogOpen(false)

      toast({
        title: editingItem ? t("success.updated") : t("success.knowledgeAdded"),
        description: editingItem
          ? t("success.knowledgeUpdated")
          : t("success.knowledgeAddedDescription"),
      })
    } catch (error) {
      console.error("Save knowledge error", error)
      toast({
        title: t("errors.saveKnowledgeFailed"),
        description: t("errors.tryAgain"),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const result = await deleteAgentKnowledgeItemAction({ agentId, id })
      if (!result.success) {
        toast({
          title: t("errors.deleteKnowledgeFailed"),
          description: result.error || t("errors.tryAgain"),
          variant: "destructive",
        })
        return
      }
      setKnowledgeBase((prev) => prev.filter((item) => item.id !== id))
      toast({
        title: t("success.deleted"),
        description: t("success.knowledgeDeleted"),
      })
    } catch (error) {
      console.error("Delete knowledge error", error)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <KnowledgeSection
      t={t}
      items={knowledgeBase}
      isFetching={isFetching}
      loadError={loadError}
      onRetry={() => void loadKnowledge()}
      onEdit={(item) => {
        setEditingItem(item)
        setNewTitle(item.title)
        setNewContent(item.content)
        setActiveTab(item.type)
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
        editingItem,
        activeTab,
        onTabChange: setActiveTab,
        newTitle,
        onTitleChange: setNewTitle,
        newContent,
        onContentChange: setNewContent,
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
