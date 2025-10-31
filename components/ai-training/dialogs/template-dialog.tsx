"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AiTemplateCategory } from "@/lib/generated/prisma"
import { MousePointerClick, Plus, Save, X } from "lucide-react"
import type { TemplateOptionView, TemplateView, TranslationFn } from "../types"

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
    newTemplateOptions: TemplateOptionView[]
    onAddOption: () => void
    onUpdateOption: (id: string, field: "label" | "value", value: string) => void
    onRemoveOption: (id: string) => void
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
    newTemplateOptions,
    onAddOption,
    onUpdateOption,
    onRemoveOption,
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
                        rows={6}
                    />
                    <p className="text-xs text-muted-foreground">{t("form.messageContentTip")}</p>
                </div>

                <div className="space-y-3 border-t pt-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-base">{t("form.quickReplyOptions")}</Label>
                            <p className="mt-1 text-xs text-muted-foreground">{t("form.quickReplyOptionsDescription")}</p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="bg-transparent text-primary hover:bg-primary/10"
                            onClick={onAddOption}
                        >
                            <Plus className="mr-1 h-4 w-4" />
                            {t("buttons.addOption")}
                        </Button>
                    </div>

                    {newTemplateOptions.length > 0 ? (
                        <div className="space-y-3">
                            {newTemplateOptions.map((option, index) => (
                                <div key={option.id} className="flex items-start gap-2 rounded-lg bg-muted/30 p-3">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-xs font-medium text-muted-foreground">
                                                {t("form.option")} {index + 1}
                                            </span>
                                        </div>
                                        <Input
                                            placeholder={t("form.buttonLabelPlaceholder")}
                                            value={option.label}
                                            onChange={(event) => onUpdateOption(option.id, "label", event.target.value)}
                                            className="bg-background"
                                        />
                                        <Input
                                            placeholder={t("form.buttonValuePlaceholder")}
                                            value={option.value}
                                            onChange={(event) => onUpdateOption(option.id, "value", event.target.value)}
                                            className="bg-background"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="mt-6 text-destructive hover:bg-destructive/10 hover:text-destructive/80"
                                        onClick={() => onRemoveOption(option.id)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg border-2 border-dashed border-border bg-muted/20 py-6 text-center">
                            <MousePointerClick className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">{t("form.noOptionsAdded")}</p>
                            <p className="mt-1 text-xs text-muted-foreground/70">{t("form.noOptionsAddedDescription")}</p>
                        </div>
                    )}
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


