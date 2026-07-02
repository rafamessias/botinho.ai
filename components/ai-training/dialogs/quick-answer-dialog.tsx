"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Save } from "lucide-react"
import { QuickAnswerExamplesPicker } from "../quick-answer-examples-picker"
import type { QuickAnswerView, TranslationFn } from "../types"

type QuickAnswerDialogProps = {
    t: TranslationFn
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onTriggerClick: () => void
    hideTrigger?: boolean
    content: string
    onContentChange: (value: string) => void
    isSubmitting: boolean
    editingQuickAnswer: QuickAnswerView | null
    onCancel: () => void
    onSubmit: () => void
}

export const QuickAnswerDialog = ({
    t,
    isOpen,
    onOpenChange,
    onTriggerClick,
    content,
    onContentChange,
    isSubmitting,
    editingQuickAnswer,
    onCancel,
    onSubmit,
    hideTrigger = false,
}: QuickAnswerDialogProps) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        {!hideTrigger ? (
            <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={onTriggerClick}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t("buttons.addQuickAnswer")}
                </Button>
            </DialogTrigger>
        ) : null}
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle>
                    {editingQuickAnswer ? t("dialog.editQuickAnswer") : t("dialog.createQuickAnswer")}
                </DialogTitle>
                <DialogDescription>
                    {editingQuickAnswer ? t("dialog.editQuickAnswerDescription") : t("dialog.createQuickAnswerDescription")}
                </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
                {!editingQuickAnswer && (
                    <QuickAnswerExamplesPicker t={t} onSelect={onContentChange} />
                )}
                <div className="space-y-2">
                    <Label htmlFor="quick-answer-content">{t("form.content")}</Label>
                    <Textarea
                        id="quick-answer-content"
                        placeholder={t("form.quickAnswerContentPlaceholder")}
                        value={content}
                        onChange={(event) => onContentChange(event.target.value)}
                        rows={6}
                    />
                    <p className="text-xs text-muted-foreground">{t("form.quickAnswerContentTip")}</p>
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={onCancel}>
                    {t("buttons.cancel")}
                </Button>
                <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={onSubmit}
                    disabled={isSubmitting}
                >
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Saving..." : editingQuickAnswer ? t("buttons.update") : t("buttons.addQuickAnswer")}
                </Button>
            </div>
        </DialogContent>
    </Dialog>
)


