"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Loader2, MessageCircle, Trash2 } from "lucide-react"
import { EmptyState } from "../components/empty-state"
import { ErrorState } from "../components/error-state"
import { QuickAnswerDialog } from "../dialogs/quick-answer-dialog"
import type { QuickAnswerView, TranslationFn } from "../types"

type QuickAnswersSectionProps = {
    t: TranslationFn
    items: QuickAnswerView[]
    isFetching: boolean
    loadError: string | null
    onRetry: () => void
    onEdit: (item: QuickAnswerView) => void
    onDelete: (id: string) => void
    isDeletingId: string | null
    dialog: {
        isOpen: boolean
        onOpenChange: (open: boolean) => void
        onTriggerClick: () => void
        editingQuickAnswer: QuickAnswerView | null
        content: string
        onContentChange: (value: string) => void
        isSubmitting: boolean
        onCancel: () => void
        onSubmit: () => void
    }
}

export const QuickAnswersSection = ({
    t,
    items,
    isFetching,
    loadError,
    onRetry,
    onEdit,
    onDelete,
    isDeletingId,
    dialog,
}: QuickAnswersSectionProps) => (
    <Card className="elegant-card">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <CardTitle className="heading-secondary">{t("quickAnswers.title")}</CardTitle>
                <CardDescription className="body-secondary">{t("quickAnswers.description")}</CardDescription>
            </div>
            <QuickAnswerDialog
                t={t}
                isOpen={dialog.isOpen}
                onOpenChange={dialog.onOpenChange}
                onTriggerClick={dialog.onTriggerClick}
                editingQuickAnswer={dialog.editingQuickAnswer}
                content={dialog.content}
                onContentChange={dialog.onContentChange}
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
                    icon={MessageCircle}
                    title="Unable to load quick answers"
                    description={loadError}
                    retryLabel="Retry"
                    onRetry={onRetry}
                />
            ) : items.length === 0 ? (
                <EmptyState
                    icon={MessageCircle}
                    title={t("quickAnswers.empty.title")}
                    description={t("quickAnswers.empty.description")}
                    actionLabel={t("quickAnswers.empty.button")}
                    onAction={dialog.onTriggerClick}
                />
            ) : (
                <div className="space-y-3">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="refined-card rounded-xl border border-primary/10 p-4 transition-all duration-200 hover:border-primary/30 hover:bg-primary/5"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <p className="body-secondary whitespace-pre-wrap text-sm leading-relaxed">{item.content}</p>
                                        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                                            <Badge variant="secondary">{t("quickAnswers.label")}</Badge>
                                            <span>
                                                {t("quickAnswers.added")} {item.createdAt}
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
                                            className="text-destructive hover:bg-destructive/10 hover:text-destructive/80"
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
                    ))}
                </div>
            )}
        </CardContent>
    </Card>
)


