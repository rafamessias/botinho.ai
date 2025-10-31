"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Edit, Loader2, MessageSquare, MousePointerClick, Tag, Trash2 } from "lucide-react"
import { EmptyState } from "../components/empty-state"
import { ErrorState } from "../components/error-state"
import { TemplateDialog } from "../dialogs/template-dialog"
import type { TemplateOptionView, TemplateView, TranslationFn } from "../types"

type TemplatesSectionProps = {
    t: TranslationFn
    items: TemplateView[]
    isFetching: boolean
    loadError: string | null
    onRetry: () => void
    onCopy: (content: string) => void
    onEdit: (template: TemplateView) => void
    onDelete: (id: string) => void
    isDeletingId: string | null
    dialog: {
        isOpen: boolean
        onOpenChange: (open: boolean) => void
        onTriggerClick: () => void
        editingTemplate: TemplateView | null
        isSubmitting: boolean
        newTemplateName: string
        onNameChange: (value: string) => void
        newTemplateContent: string
        onContentChange: (value: string) => void
        newTemplateCategory: TemplateView["category"]
        onCategoryChange: (value: TemplateView["category"]) => void
        newTemplateOptions: TemplateOptionView[]
        onAddOption: () => void
        onUpdateOption: (id: string, field: "label" | "value", value: string) => void
        onRemoveOption: (id: string) => void
        onCancel: () => void
        onSubmit: () => void
    }
}

const getCategoryColor = (category: TemplateView["category"]): string => {
    const colors: Record<string, string> = {
        greeting: "bg-primary/10 text-primary",
        orders: "accent-blue",
        products: "accent-purple",
        closing: "accent-orange",
        support: "accent-red",
    }

    return colors[category] || "bg-muted text-muted-foreground"
}

export const TemplatesSection = ({
    t,
    items,
    isFetching,
    loadError,
    onRetry,
    onCopy,
    onEdit,
    onDelete,
    isDeletingId,
    dialog,
}: TemplatesSectionProps) => (
    <Card className="elegant-card">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <CardTitle className="heading-secondary">{t("templates.title")}</CardTitle>
                <CardDescription className="body-secondary">{t("templates.description")}</CardDescription>
            </div>
            <TemplateDialog
                t={t}
                isOpen={dialog.isOpen}
                onOpenChange={dialog.onOpenChange}
                onTriggerClick={dialog.onTriggerClick}
                editingTemplate={dialog.editingTemplate}
                isSubmitting={dialog.isSubmitting}
                newTemplateName={dialog.newTemplateName}
                onNameChange={dialog.onNameChange}
                newTemplateContent={dialog.newTemplateContent}
                onContentChange={dialog.onContentChange}
                newTemplateCategory={dialog.newTemplateCategory}
                onCategoryChange={dialog.onCategoryChange}
                newTemplateOptions={dialog.newTemplateOptions}
                onAddOption={dialog.onAddOption}
                onUpdateOption={dialog.onUpdateOption}
                onRemoveOption={dialog.onRemoveOption}
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
                    icon={MessageSquare}
                    title="Unable to load templates"
                    description={loadError}
                    retryLabel="Retry"
                    onRetry={onRetry}
                />
            ) : items.length === 0 ? (
                <EmptyState
                    icon={MessageSquare}
                    title={t("templates.empty.title")}
                    description={t("templates.empty.description")}
                    actionLabel={t("templates.empty.button")}
                    onAction={dialog.onTriggerClick}
                />
            ) : (
                <div className="space-y-3">
                    {items.map((template) => (
                        <div
                            key={template.id}
                            className="refined-card rounded-xl border border-primary/10 p-4 transition-all duration-200 hover:border-primary/30 hover:bg-primary/5"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <h4 className="heading-secondary">{template.name}</h4>
                                        <p className="body-secondary mt-1 line-clamp-2 text-sm">{template.content}</p>

                                        {template.options && template.options.length > 0 ? (
                                            <div className="mt-3 space-y-2">
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <MousePointerClick className="h-3 w-3" />
                                                    <span className="font-medium">{t("templates.quickReplyOptions")}:</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {template.options.map((option) => (
                                                        <Badge key={option.id} variant="outline" className="border-primary/20 bg-card text-primary">
                                                            {option.label}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : null}

                                        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                                            <Badge className={`${getCategoryColor(template.category)} text-xs`}>
                                                <Tag className="mr-1 h-3 w-3" />
                                                {t(`categories.${template.category}`)}
                                            </Badge>
                                            <span>
                                                {t("templates.created")} {template.createdAt}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-primary hover:bg-primary/10 hover:text-primary/80"
                                            onClick={() => onCopy(template.content)}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => onEdit(template)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-destructive hover:bg-destructive/10 hover:text-destructive/80"
                                            onClick={() => onDelete(template.id)}
                                            disabled={isDeletingId === template.id}
                                        >
                                            {isDeletingId === template.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </CardContent>
    </Card>
)


