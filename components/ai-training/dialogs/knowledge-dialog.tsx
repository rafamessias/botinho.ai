"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { isPdfFile, MAX_KNOWLEDGE_PDF_SIZE_BYTES, MAX_KNOWLEDGE_PDF_SIZE_MB } from "@/lib/knowledge/pdf-constants"
import { FileText, FileUp, LinkIcon, Plus, Save, Upload, X } from "lucide-react"
import type { KnowledgeItemView, KnowledgeTab, TranslationFn } from "../types"

type KnowledgeDialogProps = {
    t: TranslationFn
    isOpen: boolean
    onOpenChange: (open: boolean) => void
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
    onTriggerClick: () => void
}

const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
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
    pdfFile,
    onPdfFileChange,
    pdfError,
    onPdfErrorChange,
    isSubmitting,
    onCancel,
    onSubmit,
    onTriggerClick,
}: KnowledgeDialogProps) => {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0]
            if (!file) return

            if (!isPdfFile(file)) {
                onPdfErrorChange(t("form.pdfInvalidFileType"))
                onPdfFileChange(null)
                return
            }

            if (file.size > MAX_KNOWLEDGE_PDF_SIZE_BYTES) {
                onPdfErrorChange(t("form.pdfFileTooLarge", { maxMb: MAX_KNOWLEDGE_PDF_SIZE_MB }))
                onPdfFileChange(null)
                return
            }

            onPdfErrorChange(null)
            onPdfFileChange(file)

            if (!newTitle.trim()) {
                const titleFromFile = file.name.replace(/\.pdf$/i, "").trim()
                if (titleFromFile) {
                    onTitleChange(titleFromFile)
                }
            }
        },
        [newTitle, onPdfErrorChange, onPdfFileChange, onTitleChange, t],
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "application/pdf": [".pdf"] },
        multiple: false,
        disabled: isSubmitting,
    })

    return (
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
                <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as KnowledgeTab)} className="mt-4">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="text">
                            <FileText className="mr-2 h-4 w-4" />
                            {t("tabs.textContent")}
                        </TabsTrigger>
                        <TabsTrigger value="url">
                            <LinkIcon className="mr-2 h-4 w-4" />
                            {t("tabs.websiteUrl")}
                        </TabsTrigger>
                        <TabsTrigger value="pdf">
                            <FileUp className="mr-2 h-4 w-4" />
                            {t("tabs.pdfFile")}
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
                    <TabsContent value="pdf" className="mt-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="knowledge-pdf-title">{t("form.title")}</Label>
                            <Input
                                id="knowledge-pdf-title"
                                placeholder={t("form.pdfTitlePlaceholder")}
                                value={newTitle}
                                onChange={(event) => onTitleChange(event.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t("form.pdfUploadLabel")}</Label>
                            <p className="text-xs text-muted-foreground">{t("form.pdfUploadDescription", { maxMb: MAX_KNOWLEDGE_PDF_SIZE_MB })}</p>
                            {pdfFile ? (
                                <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-4">
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium">{pdfFile.name}</p>
                                        <p className="text-xs text-muted-foreground">{formatFileSize(pdfFile.size)}</p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            onPdfFileChange(null)
                                            onPdfErrorChange(null)
                                        }}
                                        disabled={isSubmitting}
                                        aria-label={t("form.pdfRemoveFile")}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div
                                    {...getRootProps()}
                                    className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                                        isDragActive
                                            ? "border-primary bg-primary/5"
                                            : "border-muted-foreground/25 hover:border-primary/50"
                                    }`}
                                >
                                    <input {...getInputProps()} />
                                    <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                                    {isDragActive ? (
                                        <p className="text-sm font-medium">{t("form.pdfDropHere")}</p>
                                    ) : (
                                        <div>
                                            <p className="mb-1 text-sm font-medium">{t("form.pdfClickOrDrag")}</p>
                                            <p className="text-xs text-muted-foreground">{t("form.pdfSupportedFormats")}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                            {pdfError && <p className="text-xs text-destructive">{pdfError}</p>}
                            {editingItem?.type === "pdf" && !pdfFile && (
                                <p className="text-xs text-muted-foreground">{t("form.pdfReplaceHint")}</p>
                            )}
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
}
