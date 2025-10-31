"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Save } from "lucide-react"
import type { QuickAnswerView, TranslationFn } from "../types"

type QuickAnswerDialogProps = {
    t: TranslationFn
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onTriggerClick: () => void
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
}: QuickAnswerDialogProps) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={onTriggerClick}>
                <Plus className="mr-2 h-4 w-4" />
                {t("buttons.addQuickAnswer")}
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle>
                    {editingQuickAnswer ? t("dialog.editQuickAnswer") : t("dialog.createQuickAnswer")}
                </DialogTitle>
                <DialogDescription>
                    {editingQuickAnswer ? t("dialog.editQuickAnswerDescription") : t("dialog.createQuickAnswerDescription")}
                </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="quick-answer-content">{t("form.content")}</Label>
                    <Textarea
                        id="quick-answer-content"
                        placeholder={t("form.contentPlaceholder")}
                        value={content}
                        onChange={(event) => onContentChange(event.target.value)}
                        rows={6}
                    />
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


