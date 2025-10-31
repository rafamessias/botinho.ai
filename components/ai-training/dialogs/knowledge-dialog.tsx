"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { FileText, LinkIcon, Plus, Save } from "lucide-react"
import type { KnowledgeItemView, TranslationFn } from "../types"

type KnowledgeDialogProps = {
    t: TranslationFn
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    editingItem: KnowledgeItemView | null
    activeTab: "text" | "url"
    onTabChange: (value: "text" | "url") => void
    newTitle: string
    onTitleChange: (value: string) => void
    newContent: string
    onContentChange: (value: string) => void
    isSubmitting: boolean
    onCancel: () => void
    onSubmit: () => void
    onTriggerClick: () => void
}

export const KnowledgeDialog = ({
    t,
    isOpen,
    onOpenChange,
    editingItem,
    activeTab,
    onTabChange,
    newTitle,
    onTitleChange,
    newContent,
    onContentChange,
    isSubmitting,
    onCancel,
    onSubmit,
    onTriggerClick,
}: KnowledgeDialogProps) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={onTriggerClick}>
                <Plus className="mr-2 h-4 w-4" />
                {t("buttons.addKnowledge")}
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle>{editingItem ? t("dialog.editKnowledge") : t("dialog.addKnowledge")}</DialogTitle>
                <DialogDescription>
                    {editingItem ? t("dialog.editKnowledgeDescription") : t("dialog.addKnowledgeDescription")}
                </DialogDescription>
            </DialogHeader>
            <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as "text" | "url")} className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text">
                        <FileText className="mr-2 h-4 w-4" />
                        {t("tabs.textContent")}
                    </TabsTrigger>
                    <TabsTrigger value="url">
                        <LinkIcon className="mr-2 h-4 w-4" />
                        {t("tabs.websiteUrl")}
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="mt-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="knowledge-title">{t("form.title")}</Label>
                        <Input
                            id="knowledge-title"
                            placeholder={t("form.titlePlaceholder")}
                            value={newTitle}
                            onChange={(event) => onTitleChange(event.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="knowledge-content">{t("form.content")}</Label>
                        <Textarea
                            id="knowledge-content"
                            placeholder={t("form.contentPlaceholder")}
                            value={newContent}
                            onChange={(event) => onContentChange(event.target.value)}
                            rows={6}
                        />
                    </div>
                </TabsContent>
                <TabsContent value="url" className="mt-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="knowledge-url-title">{t("form.title")}</Label>
                        <Input
                            id="knowledge-url-title"
                            placeholder={t("form.urlTitlePlaceholder")}
                            value={newTitle}
                            onChange={(event) => onTitleChange(event.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="knowledge-url">{t("form.websiteUrl")}</Label>
                        <Input
                            id="knowledge-url"
                            type="url"
                            placeholder={t("form.urlPlaceholder")}
                            value={newContent}
                            onChange={(event) => onContentChange(event.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">{t("form.urlDescription")}</p>
                    </div>
                </TabsContent>
            </Tabs>
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
                    {isSubmitting ? "Saving..." : editingItem ? t("buttons.update") : t("buttons.addKnowledge")}
                </Button>
            </div>
        </DialogContent>
    </Dialog>
)


