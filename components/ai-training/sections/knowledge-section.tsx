"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, FileText, FileUp, LinkIcon, Loader2, Trash2 } from "lucide-react"
import { EmptyState } from "../components/empty-state"
import { ErrorState } from "../components/error-state"
import { KnowledgeDialog } from "../dialogs/knowledge-dialog"
import type { KnowledgeItemView, KnowledgeTab, TranslationFn } from "../types"

type KnowledgeSectionProps = {
    t: TranslationFn
    items: KnowledgeItemView[]
    isFetching: boolean
    loadError: string | null
    onRetry: () => void
    onEdit: (item: KnowledgeItemView) => void
    onDelete: (id: string) => void
    isDeletingId: string | null
    dialog: {
        isOpen: boolean
        onOpenChange: (open: boolean) => void
        onTriggerClick: () => void
        editingItem: KnowledgeItemView | null
        activeTab: KnowledgeTab
        onTabChange: (value: KnowledgeTab) => void
        newTitle: string
        onTitleChange: (value: string) => void
        newContent: string
        onContentChange: (value: string) => void
        pdfFile: File | null
        onPdfFileChange: (file: File | null) => void
        pdfError: string | null
        onPdfErrorChange: (error: string | null) => void
        isSubmitting: boolean
        onCancel: () => void
        onSubmit: () => void
    }
}

const knowledgeTypeIcon = (type: KnowledgeItemView["type"]) => {
    if (type === "url") return LinkIcon
    if (type === "pdf") return FileUp
    return FileText
}

const knowledgeTypeAccent = (type: KnowledgeItemView["type"]) => {
    if (type === "url") return "accent-purple"
    if (type === "pdf") return "accent-orange"
    return "accent-blue"
}

export const KnowledgeSection = ({
    t,
    items,
    isFetching,
    loadError,
    onRetry,
    onEdit,
    onDelete,
    isDeletingId,
    dialog,
}: KnowledgeSectionProps) => (
    <Card className="elegant-card">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <CardTitle className="heading-secondary">{t("knowledge.title")}</CardTitle>
                <CardDescription className="body-secondary">{t("knowledge.description")}</CardDescription>
            </div>
            <KnowledgeDialog
                t={t}
                isOpen={dialog.isOpen}
                onOpenChange={dialog.onOpenChange}
                onTriggerClick={dialog.onTriggerClick}
                editingItem={dialog.editingItem}
                activeTab={dialog.activeTab}
                onTabChange={dialog.onTabChange}
                newTitle={dialog.newTitle}
                onTitleChange={dialog.onTitleChange}
                newContent={dialog.newContent}
                onContentChange={dialog.onContentChange}
                pdfFile={dialog.pdfFile}
                onPdfFileChange={dialog.onPdfFileChange}
                pdfError={dialog.pdfError}
                onPdfErrorChange={dialog.onPdfErrorChange}
                isSubmitting={dialog.isSubmitting}
                onCancel={dialog.onCancel}
                onSubmit={dialog.onSubmit}
            />
        </CardHeader>
        <CardContent>
            {isFetching ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            ) : loadError ? (
                <ErrorState
                    icon={FileText}
                    title="Unable to load knowledge items"
                    description={loadError}
                    retryLabel="Retry"
                    onRetry={onRetry}
                />
            ) : items.length === 0 ? (
                <EmptyState
                    icon={FileText}
                    title={t("knowledge.empty.title")}
                    description={t("knowledge.empty.description")}
                    actionLabel={t("knowledge.empty.button")}
                    onAction={dialog.onTriggerClick}
                />
            ) : (
                <div className="space-y-3">
                    {items.map((item) => {
                        const TypeIcon = knowledgeTypeIcon(item.type)
                        return (
                            <div
                                key={item.id}
                                className="refined-card rounded-xl border border-border p-4 transition-colors duration-200 hover:border-primary/40 hover:bg-muted"
                            >
                                <div
                                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${knowledgeTypeAccent(item.type)}`}
                                >
                                    <TypeIcon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="mt-2 flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <h4 className="heading-secondary">{item.title}</h4>
                                            <p className="body-secondary mt-1 line-clamp-2 text-sm">{item.content}</p>
                                            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                                                <Badge variant="secondary">
                                                    {item.type === "text"
                                                        ? t("knowledge.type.text")
                                                        : item.type === "url"
                                                          ? t("knowledge.type.url")
                                                          : t("knowledge.type.pdf")}
                                                </Badge>
                                                <span>
                                                    {t("knowledge.added")} {item.createdAt}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                onClick={() => onDelete(item.id)}
                                                disabled={isDeletingId === item.id}
                                            >
                                                {isDeletingId === item.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </CardContent>
    </Card>
)
