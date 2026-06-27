"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AiTemplateCategory } from "@/lib/types/enums"
import { Plus, Save } from "lucide-react"
import { MessageTemplatePicker } from "../message-template-picker"
import type { TemplateView, TranslationFn } from "../types"

type TemplateDialogProps = {
    t: TranslationFn
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onTriggerClick: () => void
    editingTemplate: TemplateView | null
    isSubmitting: boolean
    newTemplateName: string
    onNameChange: (value: string) => void
    newTemplateContent: string
    onContentChange: (value: string) => void
    newTemplateCategory: AiTemplateCategory
    onCategoryChange: (value: AiTemplateCategory) => void
    onCancel: () => void
    onSubmit: () => void
}

export const TemplateDialog = ({
    t,
    isOpen,
    onOpenChange,
    onTriggerClick,
    editingTemplate,
    isSubmitting,
    newTemplateName,
    onNameChange,
    newTemplateContent,
    onContentChange,
    newTemplateCategory,
    onCategoryChange,
    onCancel,
    onSubmit,
}: TemplateDialogProps) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={onTriggerClick}>
                <Plus className="mr-2 h-4 w-4" />
                {t("buttons.createTemplate")}
            </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
            <DialogHeader>
                <DialogTitle>
                    {editingTemplate ? t("dialog.editTemplate") : t("dialog.createTemplate")}
                </DialogTitle>
                <DialogDescription>
                    {editingTemplate ? t("dialog.editTemplateDescription") : t("dialog.createTemplateDescription")}
                </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
                <MessageTemplatePicker
                    t={t}
                    onSelect={({ name, content, category }) => {
                        onNameChange(name)
                        onContentChange(content)
                        onCategoryChange(category)
                    }}
                />
                <div className="space-y-2">
                    <Label htmlFor="template-name">{t("form.templateName")}</Label>
                    <Input
                        id="template-name"
                        placeholder={t("form.templateNamePlaceholder")}
                        value={newTemplateName}
                        onChange={(event) => onNameChange(event.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="template-category">{t("form.category")}</Label>
                    <Select value={newTemplateCategory} onValueChange={(value) => onCategoryChange(value as AiTemplateCategory)}>
                        <SelectTrigger>
                            <SelectValue placeholder={t("form.selectCategory")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="greeting">{t("categories.greeting")}</SelectItem>
                            <SelectItem value="orders">{t("categories.orders")}</SelectItem>
                            <SelectItem value="products">{t("categories.products")}</SelectItem>
                            <SelectItem value="support">{t("categories.support")}</SelectItem>
                            <SelectItem value="closing">{t("categories.closing")}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="template-content">{t("form.messageContent")}</Label>
                    <Textarea
                        id="template-content"
                        placeholder={t("form.messageContentPlaceholder")}
                        value={newTemplateContent}
                        onChange={(event) => onContentChange(event.target.value)}
                        className="min-h-[260px] h-[260px] [field-sizing:fixed] resize-y"
                    />
                    <p className="text-xs text-muted-foreground">{t("form.messageContentTip")}</p>
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
                    {isSubmitting ? "Saving..." : editingTemplate ? t("buttons.update") : t("buttons.createTemplate")}
                </Button>
            </div>
        </DialogContent>
    </Dialog>
)
