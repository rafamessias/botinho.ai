"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/components/user-provider"
import { StatsOverview } from "./components/stats-overview"
import { StatsSkeleton } from "./components/stats-skeleton"
import { KnowledgeSection } from "./sections/knowledge-section"
import { QuickAnswersSection } from "./sections/quick-answers-section"
import { TemplatesSection } from "./sections/templates-section"
import { Brain, MessageCircle, MessageSquare } from "lucide-react"
import {
    createAiTemplateAction,
    createKnowledgeItemAction,
    createQuickAnswerAction,
    deleteAiTemplateAction,
    deleteKnowledgeItemAction,
    deleteQuickAnswerAction,
    getAiTrainingDataAction,
    updateAiTemplateAction,
    updateKnowledgeItemAction,
    updateQuickAnswerAction,
} from "@/components/server-actions/ai-training"
import { AiTemplateCategory, KnowledgeItemType } from "@/lib/generated/prisma"
import type {
    KnowledgeItemView,
    MainTab,
    QuickAnswerView,
    TemplateOptionView,
    TemplateView,
} from "./types"
type TemplateRecord = {
    id: string
    name: string
    content: string
    category: AiTemplateCategory
    createdAt: Date | string
    updatedAt: Date | string
    options?: Array<{ id: string; label: string; value: string }>
}

const knowledgeTypeToView = (type: KnowledgeItemType): "text" | "url" =>
    type === KnowledgeItemType.TEXT ? "text" : "url"

const knowledgeTypeFromView = (value: "text" | "url"): KnowledgeItemType =>
    value === "text" ? KnowledgeItemType.TEXT : KnowledgeItemType.URL

const formatDateValue = (value: Date | string) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
        return ""
    }
    return date.toISOString().split("T")[0]
}

export default function AITrainingPage() {
    const t = useTranslations("AiTraining")
    const { toast } = useToast()
    const { user } = useUser()

    const [mainTab, setMainTab] = useState<MainTab>("knowledge")
    const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeItemView[]>([])
    const [quickAnswers, setQuickAnswers] = useState<QuickAnswerView[]>([])
    const [templates, setTemplates] = useState<TemplateView[]>([])
    const [isFetching, setIsFetching] = useState(false)
    const [isKnowledgeSubmitting, setIsKnowledgeSubmitting] = useState(false)
    const [isQuickAnswerSubmitting, setIsQuickAnswerSubmitting] = useState(false)
    const [isTemplateSubmitting, setIsTemplateSubmitting] = useState(false)
    const [loadError, setLoadError] = useState<string | null>(null)
    const [hasLoadedData, setHasLoadedData] = useState(false)
    const activeCompanyId = user?.defaultCompanyId ?? null
    const hasCompanyAccess = Boolean(activeCompanyId)

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

    const mapQuickAnswer = useCallback(
        (item: {
            id: string
            content: string
            createdAt: Date | string
            updatedAt: Date | string
        }): QuickAnswerView => ({
            id: item.id,
            content: item.content,
            createdAt: formatDateValue(item.createdAt),
            updatedAt: formatDateValue(item.updatedAt),
        }),
        [],
    )

    const mapTemplate = useCallback(
        (item: {
            id: string
            name: string
            content: string
            category: AiTemplateCategory
            createdAt: Date | string
            updatedAt: Date | string
            options: Array<{ id: string; label: string; value: string }>
        }): TemplateView => ({
            id: item.id,
            name: item.name,
            content: item.content,
            category: item.category,
            createdAt: formatDateValue(item.createdAt),
            updatedAt: formatDateValue(item.updatedAt),
            options: item.options?.map((option) => ({
                id: option.id,
                label: option.label,
                value: option.value,
            })),
        }),
        [],
    )

    const loadAiTrainingData = useCallback(
        async (getIsCancelled?: () => boolean) => {
            if (!hasCompanyAccess) {
                setKnowledgeBase([])
                setQuickAnswers([])
                setTemplates([])
                setLoadError(null)
                setHasLoadedData(false)
                return
            }

            const isCancelled = () => (getIsCancelled ? getIsCancelled() : false)

            setIsFetching(true)
            setLoadError(null)

            try {
                const result = await getAiTrainingDataAction()

                if (isCancelled()) {
                    return
                }

                if (!result.success || !result.data) {
                    setLoadError(result.error || "Unable to load AI training data")
                    toast({
                        title: "Unable to load AI training data",
                        description: result.error || "Please try again.",
                        variant: "destructive",
                    })
                    return
                }

                setKnowledgeBase(result.data.knowledgeBase.map(mapKnowledgeItem))
                setQuickAnswers(result.data.quickAnswers.map(mapQuickAnswer))
                setTemplates(result.data.templates.map(mapTemplate))
                setHasLoadedData(true)
            } catch (error) {
                if (isCancelled()) {
                    return
                }
                console.error("Failed to load AI training data", error)
                setLoadError(error instanceof Error ? error.message : "Unable to load AI training data")
                toast({
                    title: "Unable to load AI training data",
                    description: error instanceof Error ? error.message : "Please try again.",
                    variant: "destructive",
                })
            } finally {
                if (!isCancelled()) {
                    setIsFetching(false)
                }
            }
        },
        [hasCompanyAccess, mapKnowledgeItem, mapQuickAnswer, mapTemplate, toast],
    )

    const displayedQuickAnswers = useMemo(
        () => quickAnswers.filter((item) => item.content.trim().length > 0),
        [quickAnswers],
    )

    useEffect(() => {
        let cancelled = false

        loadAiTrainingData(() => cancelled)

        return () => {
            cancelled = true
        }
    }, [loadAiTrainingData])

    const handleRetryLoad = useCallback(() => {
        void loadAiTrainingData()
    }, [loadAiTrainingData])

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<KnowledgeItemView | null>(null)
    const [newTitle, setNewTitle] = useState("")
    const [newContent, setNewContent] = useState("")
    const [activeTab, setActiveTab] = useState<"text" | "url">("text")

    const [isQuickAnswerDialogOpen, setIsQuickAnswerDialogOpen] = useState(false)
    const [editingQuickAnswer, setEditingQuickAnswer] = useState<QuickAnswerView | null>(null)
    const [quickAnswerContent, setQuickAnswerContent] = useState("")

    const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
    const [editingTemplate, setEditingTemplate] = useState<TemplateView | null>(null)
    const [newTemplateName, setNewTemplateName] = useState("")
    const [newTemplateContent, setNewTemplateContent] = useState("")
    const [newTemplateCategory, setNewTemplateCategory] = useState<AiTemplateCategory>(AiTemplateCategory.greeting)
    const [newTemplateOptions, setNewTemplateOptions] = useState<TemplateOptionView[]>([])

    const [knowledgeBeingDeleted, setKnowledgeBeingDeleted] = useState<string | null>(null)
    const [quickAnswerBeingDeleted, setQuickAnswerBeingDeleted] = useState<string | null>(null)
    const [templateBeingDeleted, setTemplateBeingDeleted] = useState<string | null>(null)

    const ensureCompanyAccess = useCallback(() => {
        if (hasCompanyAccess) {
            return true
        }

        toast({
            title: "Company required",
            description: "Please select or create a company to manage AI training.",
            variant: "destructive",
        })
        return false
    }, [hasCompanyAccess, toast])

    const resetKnowledgeForm = () => {
        setEditingItem(null)
        setNewTitle("")
        setNewContent("")
        setActiveTab("text")
    }

    const handleOpenKnowledgeDialog = () => {
        resetKnowledgeForm()
        setIsDialogOpen(true)
    }

    const handleAddKnowledge = async () => {
        if (!newTitle.trim() || !newContent.trim()) {
            toast({
                title: t("errors.fillAllFields"),
                description: t("errors.fillAllFieldsDescription"),
                variant: "destructive",
            })
            return
        }

        if (!ensureCompanyAccess()) {
            return
        }

        try {
            setIsKnowledgeSubmitting(true)
            const result = await createKnowledgeItemAction({
                title: newTitle.trim(),
                content: newContent.trim(),
                type: knowledgeTypeFromView(activeTab),
            })

            if (!result.success || !result.data) {
                toast({
                    title: "Unable to save knowledge",
                    description: result.error || "Please try again.",
                    variant: "destructive",
                })
                return
            }

            const created = mapKnowledgeItem({
                id: result.data.knowledgeItem.id,
                type: result.data.knowledgeItem.type,
                title: result.data.knowledgeItem.title,
                content: result.data.knowledgeItem.content,
                createdAt: result.data.knowledgeItem.createdAt,
                updatedAt: result.data.knowledgeItem.updatedAt,
            })

            setKnowledgeBase((prev) => [created, ...prev])
            resetKnowledgeForm()
            setIsDialogOpen(false)

            toast({
                title: t("success.knowledgeAdded"),
                description: t("success.knowledgeAddedDescription"),
            })
        } catch (error) {
            console.error("Create knowledge item error", error)
            toast({
                title: "Unable to save knowledge",
                description: "Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsKnowledgeSubmitting(false)
        }
    }

    const handleEditItem = (item: KnowledgeItemView) => {
        setEditingItem(item)
        setNewTitle(item.title)
        setNewContent(item.content)
        setActiveTab(item.type)
        setIsDialogOpen(true)
    }

    const handleUpdateItem = async () => {
        if (!editingItem || !newTitle.trim() || !newContent.trim()) {
            toast({
                title: t("errors.fillAllFields"),
                description: t("errors.fillAllFieldsDescription"),
                variant: "destructive",
            })
            return
        }

        if (!ensureCompanyAccess()) {
            return
        }

        try {
            setIsKnowledgeSubmitting(true)
            const result = await updateKnowledgeItemAction({
                id: editingItem.id,
                title: newTitle.trim(),
                content: newContent.trim(),
                type: knowledgeTypeFromView(activeTab),
            })

            if (!result.success || !result.data) {
                toast({
                    title: "Unable to update knowledge",
                    description: result.error || "Please try again.",
                    variant: "destructive",
                })
                return
            }

            const updated = mapKnowledgeItem({
                id: result.data.knowledgeItem.id,
                type: result.data.knowledgeItem.type,
                title: result.data.knowledgeItem.title,
                content: result.data.knowledgeItem.content,
                createdAt: result.data.knowledgeItem.createdAt,
                updatedAt: result.data.knowledgeItem.updatedAt,
            })

            setKnowledgeBase((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
            resetKnowledgeForm()
            setIsDialogOpen(false)

            toast({
                title: t("success.updated"),
                description: t("success.knowledgeUpdated"),
            })
        } catch (error) {
            console.error("Update knowledge item error", error)
            toast({
                title: "Unable to update knowledge",
                description: "Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsKnowledgeSubmitting(false)
        }
    }

    const handleDeleteItem = async (id: string) => {
        if (!ensureCompanyAccess()) {
            return
        }

        try {
            setKnowledgeBeingDeleted(id)
            const result = await deleteKnowledgeItemAction({
                id,
            })

            if (!result.success) {
                toast({
                    title: "Unable to delete knowledge",
                    description: result.error || "Please try again.",
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
            console.error("Delete knowledge item error", error)
            toast({
                title: "Unable to delete knowledge",
                description: "Please try again.",
                variant: "destructive",
            })
        } finally {
            setKnowledgeBeingDeleted(null)
        }
    }

    const resetQuickAnswerForm = () => {
        setEditingQuickAnswer(null)
        setQuickAnswerContent("")
    }

    const handleCloseQuickAnswerDialog = () => {
        resetQuickAnswerForm()
        setIsQuickAnswerDialogOpen(false)
    }

    const handleOpenQuickAnswerDialog = () => {
        resetQuickAnswerForm()
        setIsQuickAnswerDialogOpen(true)
    }

    const handleAddQuickAnswer = async () => {
        if (!quickAnswerContent.trim()) {
            toast({
                title: t("errors.fillAllFields"),
                description: t("errors.fillAllFieldsDescription"),
                variant: "destructive",
            })
            return
        }

        if (!ensureCompanyAccess()) {
            return
        }

        try {
            setIsQuickAnswerSubmitting(true)
            const result = await createQuickAnswerAction({
                content: quickAnswerContent.trim(),
            })

            if (!result.success || !result.data) {
                toast({
                    title: "Unable to save quick answer",
                    description: result.error || "Please try again.",
                    variant: "destructive",
                })
                return
            }

            const created = mapQuickAnswer({
                id: result.data.quickAnswer.id,
                content: result.data.quickAnswer.content,
                createdAt: result.data.quickAnswer.createdAt,
                updatedAt: result.data.quickAnswer.updatedAt,
            })

            setQuickAnswers((prev) => [created, ...prev])
            handleCloseQuickAnswerDialog()

            toast({
                title: t("success.quickAnswerCreated"),
                description: t("success.quickAnswerCreatedDescription"),
            })
        } catch (error) {
            console.error("Create quick answer error", error)
            toast({
                title: "Unable to save quick answer",
                description: "Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsQuickAnswerSubmitting(false)
        }
    }

    const handleEditQuickAnswer = (item: QuickAnswerView) => {
        setEditingQuickAnswer(item)
        setQuickAnswerContent(item.content)
        setIsQuickAnswerDialogOpen(true)
    }

    const handleUpdateQuickAnswer = async () => {
        if (!editingQuickAnswer || !quickAnswerContent.trim()) {
            toast({
                title: t("errors.fillAllFields"),
                description: t("errors.fillAllFieldsDescription"),
                variant: "destructive",
            })
            return
        }

        if (!ensureCompanyAccess()) {
            return
        }

        try {
            setIsQuickAnswerSubmitting(true)
            const result = await updateQuickAnswerAction({
                id: editingQuickAnswer.id,
                content: quickAnswerContent.trim(),
            })

            if (!result.success || !result.data) {
                toast({
                    title: "Unable to update quick answer",
                    description: result.error || "Please try again.",
                    variant: "destructive",
                })
                return
            }

            const updated = mapQuickAnswer({
                id: result.data.quickAnswer.id,
                content: result.data.quickAnswer.content,
                createdAt: result.data.quickAnswer.createdAt,
                updatedAt: result.data.quickAnswer.updatedAt,
            })

            setQuickAnswers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
            handleCloseQuickAnswerDialog()

            toast({
                title: t("success.updated"),
                description: t("success.quickAnswerUpdated"),
            })
        } catch (error) {
            console.error("Update quick answer error", error)
            toast({
                title: "Unable to update quick answer",
                description: "Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsQuickAnswerSubmitting(false)
        }
    }

    const handleDeleteQuickAnswer = async (id: string) => {
        if (!ensureCompanyAccess()) {
            return
        }

        try {
            setQuickAnswerBeingDeleted(id)
            const result = await deleteQuickAnswerAction({
                id,
            })

            if (!result.success) {
                toast({
                    title: "Unable to delete quick answer",
                    description: result.error || "Please try again.",
                    variant: "destructive",
                })
                return
            }

            setQuickAnswers((prev) => prev.filter((item) => item.id !== id))

            toast({
                title: t("success.deleted"),
                description: t("success.quickAnswerDeleted"),
            })
        } catch (error) {
            console.error("Delete quick answer error", error)
            toast({
                title: "Unable to delete quick answer",
                description: "Please try again.",
                variant: "destructive",
            })
        } finally {
            setQuickAnswerBeingDeleted(null)
        }
    }

    const handleAddOption = () => {
        const optionId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()
        const newOption: TemplateOptionView = {
            id: optionId,
            label: "",
            value: "",
        }
        setNewTemplateOptions((prev) => [...prev, newOption])
    }

    const handleUpdateOption = (id: string, field: "label" | "value", value: string) => {
        setNewTemplateOptions((prev) => prev.map((opt) => (opt.id === id ? { ...opt, [field]: value } : opt)))
    }

    const handleRemoveOption = (id: string) => {
        setNewTemplateOptions((prev) => prev.filter((opt) => opt.id !== id))
    }

    const resetTemplateForm = () => {
        setEditingTemplate(null)
        setNewTemplateName("")
        setNewTemplateContent("")
        setNewTemplateCategory(AiTemplateCategory.greeting)
        setNewTemplateOptions([])
    }

    const handleOpenTemplateDialog = () => {
        resetTemplateForm()
        setIsTemplateDialogOpen(true)
    }

    const sanitizeTemplateOptions = (options: TemplateOptionView[]) =>
        options
            .map((option) => ({
                label: option.label.trim(),
                value: option.value.trim(),
            }))
            .filter((option) => option.label && option.value)

    const handleAddTemplate = async () => {
        if (!newTemplateName.trim() || !newTemplateContent.trim()) {
            toast({
                title: t("errors.fillAllFields"),
                description: t("errors.fillAllFieldsDescription"),
                variant: "destructive",
            })
            return
        }

        if (!ensureCompanyAccess()) {
            return
        }

        try {
            setIsTemplateSubmitting(true)
            const validOptions = sanitizeTemplateOptions(newTemplateOptions)

            const result = await createAiTemplateAction({
                name: newTemplateName.trim(),
                content: newTemplateContent.trim(),
                category: newTemplateCategory,
                options: validOptions.length > 0 ? validOptions : undefined,
            })

            if (!result.success || !result.data || !result.data.template) {
                toast({
                    title: "Unable to save template",
                    description: result.error || "Please try again.",
                    variant: "destructive",
                })
                return
            }

            const templateRecord = result.data.template as TemplateRecord

            const created = mapTemplate({
                id: templateRecord.id,
                name: templateRecord.name,
                content: templateRecord.content,
                category: templateRecord.category,
                createdAt: templateRecord.createdAt,
                updatedAt: templateRecord.updatedAt,
                options: templateRecord.options ?? [],
            })

            setTemplates((prev) => [created, ...prev])
            resetTemplateForm()
            setIsTemplateDialogOpen(false)

            toast({
                title: t("success.templateCreated"),
                description: t("success.templateCreatedDescription"),
            })
        } catch (error) {
            console.error("Create template error", error)
            toast({
                title: "Unable to save template",
                description: "Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsTemplateSubmitting(false)
        }
    }

    const handleEditTemplate = (template: TemplateView) => {
        setEditingTemplate(template)
        setNewTemplateName(template.name)
        setNewTemplateContent(template.content)
        setNewTemplateCategory(template.category)
        setNewTemplateOptions(template.options || [])
        setIsTemplateDialogOpen(true)
    }

    const handleUpdateTemplate = async () => {
        if (!editingTemplate || !newTemplateName.trim() || !newTemplateContent.trim()) {
            toast({
                title: t("errors.fillAllFields"),
                description: t("errors.fillAllFieldsDescription"),
                variant: "destructive",
            })
            return
        }

        if (!ensureCompanyAccess()) {
            return
        }

        try {
            setIsTemplateSubmitting(true)
            const validOptions = sanitizeTemplateOptions(newTemplateOptions)

            const result = await updateAiTemplateAction({
                id: editingTemplate.id,
                name: newTemplateName.trim(),
                content: newTemplateContent.trim(),
                category: newTemplateCategory,
                options: validOptions.length > 0 ? validOptions : undefined,
            })

            if (!result.success || !result.data || !result.data.template) {
                toast({
                    title: "Unable to update template",
                    description: result.error || "Please try again.",
                    variant: "destructive",
                })
                return
            }

            const templateRecord = result.data.template as TemplateRecord

            const updated = mapTemplate({
                id: templateRecord.id,
                name: templateRecord.name,
                content: templateRecord.content,
                category: templateRecord.category,
                createdAt: templateRecord.createdAt,
                updatedAt: templateRecord.updatedAt,
                options: templateRecord.options ?? [],
            })

            setTemplates((prev) => prev.map((template) => (template.id === updated.id ? updated : template)))
            resetTemplateForm()
            setIsTemplateDialogOpen(false)

            toast({
                title: t("success.updated"),
                description: t("success.templateUpdated"),
            })
        } catch (error) {
            console.error("Update template error", error)
            toast({
                title: "Unable to update template",
                description: "Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsTemplateSubmitting(false)
        }
    }

    const handleDeleteTemplate = async (id: string) => {
        if (!ensureCompanyAccess()) {
            return
        }

        try {
            setTemplateBeingDeleted(id)
            const result = await deleteAiTemplateAction({
                id,
            })

            if (!result.success) {
                toast({
                    title: "Unable to delete template",
                    description: result.error || "Please try again.",
                    variant: "destructive",
                })
                return
            }

            setTemplates((prev) => prev.filter((template) => template.id !== id))
            toast({
                title: t("success.deleted"),
                description: t("success.templateDeleted"),
            })
        } catch (error) {
            console.error("Delete template error", error)
            toast({
                title: "Unable to delete template",
                description: "Please try again.",
                variant: "destructive",
            })
        } finally {
            setTemplateBeingDeleted(null)
        }
    }

    const handleCopyTemplate = async (content: string) => {
        try {
            if (typeof navigator !== "undefined" && navigator.clipboard) {
                await navigator.clipboard.writeText(content)
                toast({
                    title: t("success.copied"),
                    description: t("success.templateCopied"),
                })
            }
        } catch (error) {
            console.error("Copy template error", error)
            toast({
                title: "Unable to copy template",
                description: "Please try again.",
                variant: "destructive",
            })
        }
    }

    if (!hasCompanyAccess) {
        return (
            <div className="space-y-8">
                <Card className="elegant-card">
                    <CardHeader className="space-y-2 text-center">
                        <CardTitle className="heading-secondary text-xl">Connect a company to continue</CardTitle>
                        <CardDescription className="body-secondary">
                            Create or select a company to unlock AI training tools tied to your team.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {hasLoadedData ? (
                <StatsOverview
                    t={t}
                    knowledgeCount={knowledgeBase.length}
                    quickAnswersCount={displayedQuickAnswers.length}
                    templatesCount={templates.length}
                />
            ) : (
                <StatsSkeleton />
            )}

            <Tabs value={mainTab} onValueChange={(value) => setMainTab(value as MainTab)}>
                <div className="no-scrollbar overflow-x-auto sm:overflow-visible">
                    <TabsList className="grid w-[36rem] grid-cols-3 sm:w-full">
                        <TabsTrigger value="knowledge">
                            <Brain className="mr-2 h-4 w-4" />
                            {t("tabs.knowledgeBase")}
                        </TabsTrigger>
                        <TabsTrigger value="quickAnswers">
                            <MessageCircle className="mr-2 h-4 w-4" />
                            {t("tabs.quickAnswers")}
                        </TabsTrigger>
                        <TabsTrigger value="templates">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            {t("tabs.templates")}
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="knowledge" className="mt-6">
                    <KnowledgeSection
                        t={t}
                        items={knowledgeBase}
                        isFetching={isFetching}
                        loadError={loadError}
                        onRetry={handleRetryLoad}
                        onEdit={handleEditItem}
                        onDelete={handleDeleteItem}
                        isDeletingId={knowledgeBeingDeleted}
                        dialog={{
                            isOpen: isDialogOpen,
                            onOpenChange: (open) => {
                                setIsDialogOpen(open)
                                if (!open) {
                                    resetKnowledgeForm()
                                }
                            },
                            onTriggerClick: handleOpenKnowledgeDialog,
                            editingItem,
                            activeTab,
                            onTabChange: (value) => setActiveTab(value),
                            newTitle,
                            onTitleChange: (value) => setNewTitle(value),
                            newContent,
                            onContentChange: (value) => setNewContent(value),
                            isSubmitting: isKnowledgeSubmitting,
                            onCancel: () => {
                                setIsDialogOpen(false)
                                resetKnowledgeForm()
                            },
                            onSubmit: editingItem ? handleUpdateItem : handleAddKnowledge,
                        }}
                    />
                </TabsContent>

                <TabsContent value="quickAnswers" className="mt-6">
                    <QuickAnswersSection
                        t={t}
                        items={displayedQuickAnswers}
                        isFetching={isFetching}
                        loadError={loadError}
                        onRetry={handleRetryLoad}
                        onEdit={handleEditQuickAnswer}
                        onDelete={handleDeleteQuickAnswer}
                        isDeletingId={quickAnswerBeingDeleted}
                        dialog={{
                            isOpen: isQuickAnswerDialogOpen,
                            onOpenChange: (open) => {
                                setIsQuickAnswerDialogOpen(open)
                                if (!open) {
                                    handleCloseQuickAnswerDialog()
                                }
                            },
                            onTriggerClick: handleOpenQuickAnswerDialog,
                            editingQuickAnswer,
                            content: quickAnswerContent,
                            onContentChange: (value) => setQuickAnswerContent(value),
                            isSubmitting: isQuickAnswerSubmitting,
                            onCancel: handleCloseQuickAnswerDialog,
                            onSubmit: editingQuickAnswer ? handleUpdateQuickAnswer : handleAddQuickAnswer,
                        }}
                    />
                </TabsContent>

                <TabsContent value="templates" className="mt-6">
                    <TemplatesSection
                        t={t}
                        items={templates}
                        isFetching={isFetching}
                        loadError={loadError}
                        onRetry={handleRetryLoad}
                        onCopy={handleCopyTemplate}
                        onEdit={handleEditTemplate}
                        onDelete={handleDeleteTemplate}
                        isDeletingId={templateBeingDeleted}
                        dialog={{
                            isOpen: isTemplateDialogOpen,
                            onOpenChange: (open) => {
                                setIsTemplateDialogOpen(open)
                                if (!open) {
                                    resetTemplateForm()
                                }
                            },
                            onTriggerClick: handleOpenTemplateDialog,
                            editingTemplate,
                            isSubmitting: isTemplateSubmitting,
                            newTemplateName,
                            onNameChange: (value) => setNewTemplateName(value),
                            newTemplateContent,
                            onContentChange: (value) => setNewTemplateContent(value),
                            newTemplateCategory,
                            onCategoryChange: (value) => setNewTemplateCategory(value),
                            newTemplateOptions,
                            onAddOption: handleAddOption,
                            onUpdateOption: handleUpdateOption,
                            onRemoveOption: handleRemoveOption,
                            onCancel: () => {
                                setIsTemplateDialogOpen(false)
                                resetTemplateForm()
                            },
                            onSubmit: editingTemplate ? handleUpdateTemplate : handleAddTemplate,
                        }}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}
