"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
    Brain,
    Plus,
    FileText,
    LinkIcon,
    Trash2,
    Edit,
    Save,
    CheckCircle2,
    MessageCircle,
    MessageSquare,
    Copy,
    Tag,
    X,
    MousePointerClick,
    Sparkles,
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface KnowledgeItem {
    id: string
    type: "text" | "url"
    title: string
    content: string
    createdAt: string
}

interface QuickAnswerItem {
    id: string
    title: string
    content: string
    createdAt: string
}

interface TemplateOption {
    id: string
    label: string
    value: string
}

interface Template {
    id: string
    name: string
    content: string
    category: string
    options?: TemplateOption[]
    createdAt: string
}

type MainTab = "knowledge" | "templates" | "quickAnswers"

export default function AITrainingPage() {
    const t = useTranslations("AiTraining")
    const { toast } = useToast()

    const [mainTab, setMainTab] = useState<MainTab>("knowledge")

    const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeItem[]>([
        {
            id: "1",
            type: "text",
            title: "Business Hours",
            content: "We are open Monday to Friday from 9 AM to 6 PM, and Saturday from 10 AM to 4 PM. Closed on Sundays.",
            createdAt: "2024-01-15",
        },
        {
            id: "2",
            type: "text",
            title: "Delivery Policy",
            content: "We offer free delivery for orders over $50. Standard delivery takes 2-3 business days.",
            createdAt: "2024-01-14",
        },
        {
            id: "3",
            type: "url",
            title: "Product Catalog",
            content: "https://example.com/products",
            createdAt: "2024-01-13",
        },
    ])

    const [quickAnswers, setQuickAnswers] = useState<QuickAnswerItem[]>([
        {
            id: "qa-1",
            title: "Shipping Time",
            content: "Most orders ship within 24 hours and arrive within 3-5 business days.",
            createdAt: "2024-01-12",
        },
        {
            id: "qa-2",
            title: "Return Policy",
            content: "You can request a return within 30 days of delivery as long as the item is unused.",
            createdAt: "2024-01-11",
        },
        {
            id: "qa-3",
            title: "Contact Support",
            content: "Reach our support team at support@example.com or call (555) 123-4567.",
            createdAt: "2024-01-10",
        },
    ])

    const [templates, setTemplates] = useState<Template[]>([
        {
            id: "1",
            name: "Welcome Message",
            content: "Hi! 👋 Welcome to [Business Name]. How can I help you today?",
            category: "greeting",
            options: [
                { id: "1", label: "View Products", value: "products" },
                { id: "2", label: "Check Order Status", value: "order_status" },
                { id: "3", label: "Contact Support", value: "support" },
            ],
            createdAt: "2024-01-15",
        },
        {
            id: "2",
            name: "Order Status",
            content: "Your order #[ORDER_ID] is currently [STATUS]. Expected delivery: [DATE].",
            category: "orders",
            options: [
                { id: "1", label: "Track Package", value: "track" },
                { id: "2", label: "Cancel Order", value: "cancel" },
                { id: "3", label: "Contact Support", value: "support" },
            ],
            createdAt: "2024-01-14",
        },
        {
            id: "3",
            name: "Out of Stock",
            content:
                "I'm sorry, but [PRODUCT_NAME] is currently out of stock. Would you like me to notify you when it's available again?",
            category: "products",
            options: [
                { id: "1", label: "Yes, notify me", value: "notify_yes" },
                { id: "2", label: "Show similar products", value: "similar" },
                { id: "3", label: "No, thanks", value: "notify_no" },
            ],
            createdAt: "2024-01-13",
        },
        {
            id: "4",
            name: "Thank You",
            content: "Thank you for contacting us! If you have any other questions, feel free to ask. Have a great day! 😊",
            category: "closing",
            createdAt: "2024-01-12",
        },
    ])

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null)
    const [newTitle, setNewTitle] = useState("")
    const [newContent, setNewContent] = useState("")
    const [activeTab, setActiveTab] = useState<"text" | "url">("text")

    const [isQuickAnswerDialogOpen, setIsQuickAnswerDialogOpen] = useState(false)
    const [editingQuickAnswer, setEditingQuickAnswer] = useState<QuickAnswerItem | null>(null)
    const [quickAnswerTitle, setQuickAnswerTitle] = useState("")
    const [quickAnswerContent, setQuickAnswerContent] = useState("")

    const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
    const [newTemplateName, setNewTemplateName] = useState("")
    const [newTemplateContent, setNewTemplateContent] = useState("")
    const [newTemplateCategory, setNewTemplateCategory] = useState("greeting")
    const [newTemplateOptions, setNewTemplateOptions] = useState<TemplateOption[]>([])

    const handleAddKnowledge = () => {
        if (!newTitle || !newContent) {
            toast({
                title: t("errors.fillAllFields"),
                description: t("errors.fillAllFieldsDescription"),
                variant: "destructive",
            })
            return
        }

        const newItem: KnowledgeItem = {
            id: Date.now().toString(),
            type: activeTab,
            title: newTitle,
            content: newContent,
            createdAt: new Date().toISOString().split("T")[0],
        }

        setKnowledgeBase([newItem, ...knowledgeBase])
        setNewTitle("")
        setNewContent("")
        setIsDialogOpen(false)

        toast({
            title: t("success.knowledgeAdded"),
            description: t("success.knowledgeAddedDescription"),
        })
    }

    const handleDeleteItem = (id: string) => {
        setKnowledgeBase(knowledgeBase.filter((item) => item.id !== id))
        toast({
            title: t("success.deleted"),
            description: t("success.knowledgeDeleted"),
        })
    }

    const handleEditItem = (item: KnowledgeItem) => {
        setEditingItem(item)
        setNewTitle(item.title)
        setNewContent(item.content)
        setActiveTab(item.type)
        setIsDialogOpen(true)
    }

    const handleUpdateItem = () => {
        if (!editingItem || !newTitle || !newContent) return

        setKnowledgeBase(
            knowledgeBase.map((item) =>
                item.id === editingItem.id ? { ...item, title: newTitle, content: newContent } : item,
            ),
        )

        setEditingItem(null)
        setNewTitle("")
        setNewContent("")
        setIsDialogOpen(false)

        toast({
            title: t("success.updated"),
            description: t("success.knowledgeUpdated"),
        })
    }

    const resetQuickAnswerForm = () => {
        setEditingQuickAnswer(null)
        setQuickAnswerTitle("")
        setQuickAnswerContent("")
    }

    const handleCloseQuickAnswerDialog = () => {
        resetQuickAnswerForm()
        setIsQuickAnswerDialogOpen(false)
    }

    const handleAddQuickAnswer = () => {
        if (!quickAnswerTitle.trim() || !quickAnswerContent.trim()) {
            toast({
                title: t("errors.fillAllFields"),
                description: t("errors.fillAllFieldsDescription"),
                variant: "destructive",
            })
            return
        }

        const newQuickAnswer: QuickAnswerItem = {
            id: Date.now().toString(),
            title: quickAnswerTitle.trim(),
            content: quickAnswerContent.trim(),
            createdAt: new Date().toISOString().split("T")[0],
        }

        setQuickAnswers([newQuickAnswer, ...quickAnswers])
        handleCloseQuickAnswerDialog()

        toast({
            title: t("success.quickAnswerCreated"),
            description: t("success.quickAnswerCreatedDescription"),
        })
    }

    const handleEditQuickAnswer = (item: QuickAnswerItem) => {
        setEditingQuickAnswer(item)
        setQuickAnswerTitle(item.title)
        setQuickAnswerContent(item.content)
        setIsQuickAnswerDialogOpen(true)
    }

    const handleUpdateQuickAnswer = () => {
        if (!editingQuickAnswer || !quickAnswerTitle.trim() || !quickAnswerContent.trim()) {
            toast({
                title: t("errors.fillAllFields"),
                description: t("errors.fillAllFieldsDescription"),
                variant: "destructive",
            })
            return
        }

        setQuickAnswers(
            quickAnswers.map((item) =>
                item.id === editingQuickAnswer.id
                    ? { ...item, title: quickAnswerTitle.trim(), content: quickAnswerContent.trim() }
                    : item,
            ),
        )

        handleCloseQuickAnswerDialog()

        toast({
            title: t("success.updated"),
            description: t("success.quickAnswerUpdated"),
        })
    }

    const handleDeleteQuickAnswer = (id: string) => {
        setQuickAnswers(quickAnswers.filter((item) => item.id !== id))

        toast({
            title: t("success.deleted"),
            description: t("success.quickAnswerDeleted"),
        })
    }

    const handleAddOption = () => {
        const newOption: TemplateOption = {
            id: Date.now().toString(),
            label: "",
            value: "",
        }
        setNewTemplateOptions([...newTemplateOptions, newOption])
    }

    const handleUpdateOption = (id: string, field: "label" | "value", value: string) => {
        setNewTemplateOptions(newTemplateOptions.map((opt) => (opt.id === id ? { ...opt, [field]: value } : opt)))
    }

    const handleRemoveOption = (id: string) => {
        setNewTemplateOptions(newTemplateOptions.filter((opt) => opt.id !== id))
    }

    const handleAddTemplate = () => {
        if (!newTemplateName || !newTemplateContent) {
            toast({
                title: t("errors.fillAllFields"),
                description: t("errors.fillAllFieldsDescription"),
                variant: "destructive",
            })
            return
        }

        const validOptions = newTemplateOptions.filter((opt) => opt.label.trim() && opt.value.trim())

        const newTemplate: Template = {
            id: Date.now().toString(),
            name: newTemplateName,
            content: newTemplateContent,
            category: newTemplateCategory,
            options: validOptions.length > 0 ? validOptions : undefined,
            createdAt: new Date().toISOString().split("T")[0],
        }

        setTemplates([newTemplate, ...templates])
        setNewTemplateName("")
        setNewTemplateContent("")
        setNewTemplateCategory("greeting")
        setNewTemplateOptions([])
        setIsTemplateDialogOpen(false)

        toast({
            title: t("success.templateCreated"),
            description: t("success.templateCreatedDescription"),
        })
    }

    const handleEditTemplate = (template: Template) => {
        setEditingTemplate(template)
        setNewTemplateName(template.name)
        setNewTemplateContent(template.content)
        setNewTemplateCategory(template.category)
        setNewTemplateOptions(template.options || [])
        setIsTemplateDialogOpen(true)
    }

    const handleUpdateTemplate = () => {
        if (!editingTemplate || !newTemplateName || !newTemplateContent) return

        const validOptions = newTemplateOptions.filter((opt) => opt.label.trim() && opt.value.trim())

        setTemplates(
            templates.map((template) =>
                template.id === editingTemplate.id
                    ? {
                        ...template,
                        name: newTemplateName,
                        content: newTemplateContent,
                        category: newTemplateCategory,
                        options: validOptions.length > 0 ? validOptions : undefined,
                    }
                    : template,
            ),
        )

        setEditingTemplate(null)
        setNewTemplateName("")
        setNewTemplateContent("")
        setNewTemplateCategory("greeting")
        setNewTemplateOptions([])
        setIsTemplateDialogOpen(false)

        toast({
            title: t("success.updated"),
            description: t("success.templateUpdated"),
        })
    }

    const handleDeleteTemplate = (id: string) => {
        setTemplates(templates.filter((template) => template.id !== id))
        toast({
            title: t("success.deleted"),
            description: t("success.templateDeleted"),
        })
    }

    const handleCopyTemplate = (content: string) => {
        navigator.clipboard.writeText(content)
        toast({
            title: t("success.copied"),
            description: t("success.templateCopied"),
        })
    }

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            greeting: "bg-primary/10 text-primary",
            orders: "accent-blue",
            products: "accent-purple",
            closing: "accent-orange",
            support: "accent-red",
        }
        return colors[category] || "bg-muted text-muted-foreground"
    }

    return (
        <div className=" space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                {mainTab === "knowledge" && (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                onClick={() => {
                                    setEditingItem(null)
                                    setNewTitle("")
                                    setNewContent("")
                                }}
                            >
                                <Plus className="w-4 h-4 mr-2" />
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
                            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "text" | "url")} className="mt-4">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="text">
                                        <FileText className="w-4 h-4 mr-2" />
                                        {t("tabs.textContent")}
                                    </TabsTrigger>
                                    <TabsTrigger value="url">
                                        <LinkIcon className="w-4 h-4 mr-2" />
                                        {t("tabs.websiteUrl")}
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="text" className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">{t("form.title")}</Label>
                                        <Input
                                            id="title"
                                            placeholder={t("form.titlePlaceholder")}
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="content">{t("form.content")}</Label>
                                        <Textarea
                                            id="content"
                                            placeholder={t("form.contentPlaceholder")}
                                            value={newContent}
                                            onChange={(e) => setNewContent(e.target.value)}
                                            rows={6}
                                        />
                                    </div>
                                </TabsContent>
                                <TabsContent value="url" className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="url-title">{t("form.title")}</Label>
                                        <Input
                                            id="url-title"
                                            placeholder={t("form.urlTitlePlaceholder")}
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="url">{t("form.websiteUrl")}</Label>
                                        <Input
                                            id="url"
                                            type="url"
                                            placeholder={t("form.urlPlaceholder")}
                                            value={newContent}
                                            onChange={(e) => setNewContent(e.target.value)}
                                        />
                                        <p className="text-xs text-muted-foreground">{t("form.urlDescription")}</p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                            <div className="flex justify-end gap-3 mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsDialogOpen(false)
                                        setEditingItem(null)
                                        setNewTitle("")
                                        setNewContent("")
                                    }}
                                >
                                    {t("buttons.cancel")}
                                </Button>
                                <Button
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                    onClick={editingItem ? handleUpdateItem : handleAddKnowledge}
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {editingItem ? t("buttons.update") : t("buttons.addKnowledge")}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}

                {mainTab === "templates" && (
                    <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                onClick={() => {
                                    setEditingTemplate(null)
                                    setNewTemplateName("")
                                    setNewTemplateContent("")
                                    setNewTemplateCategory("greeting")
                                    setNewTemplateOptions([])
                                }}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                {t("buttons.createTemplate")}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editingTemplate ? t("dialog.editTemplate") : t("dialog.createTemplate")}</DialogTitle>
                                <DialogDescription>
                                    {editingTemplate ? t("dialog.editTemplateDescription") : t("dialog.createTemplateDescription")}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="template-name">{t("form.templateName")}</Label>
                                    <Input
                                        id="template-name"
                                        placeholder={t("form.templateNamePlaceholder")}
                                        value={newTemplateName}
                                        onChange={(e) => setNewTemplateName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="template-category">{t("form.category")}</Label>
                                    <Select value={newTemplateCategory} onValueChange={setNewTemplateCategory}>
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
                                        onChange={(e) => setNewTemplateContent(e.target.value)}
                                        rows={6}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {t("form.messageContentTip")}
                                    </p>
                                </div>

                                <div className="space-y-3 pt-4 border-t">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label className="text-base">{t("form.quickReplyOptions")}</Label>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {t("form.quickReplyOptionsDescription")}
                                            </p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleAddOption}
                                            className="text-primary border-primary/20 hover:bg-primary/10 bg-transparent"
                                        >
                                            <Plus className="w-4 h-4 mr-1" />
                                            {t("buttons.addOption")}
                                        </Button>
                                    </div>

                                    {newTemplateOptions.length > 0 && (
                                        <div className="space-y-3">
                                            {newTemplateOptions.map((option, index) => (
                                                <div key={option.id} className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <MousePointerClick className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                                            <span className="text-xs font-medium text-muted-foreground">{t("form.option")} {index + 1}</span>
                                                        </div>
                                                        <Input
                                                            placeholder={t("form.buttonLabelPlaceholder")}
                                                            value={option.label}
                                                            onChange={(e) => handleUpdateOption(option.id, "label", e.target.value)}
                                                            className="bg-background"
                                                        />
                                                        <Input
                                                            placeholder={t("form.buttonValuePlaceholder")}
                                                            value={option.value}
                                                            onChange={(e) => handleUpdateOption(option.id, "value", e.target.value)}
                                                            className="bg-background"
                                                        />
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemoveOption(option.id)}
                                                        className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 mt-6"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {newTemplateOptions.length === 0 && (
                                        <div className="text-center py-6 bg-muted/20 rounded-lg border-2 border-dashed border-border">
                                            <MousePointerClick className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                            <p className="text-sm text-muted-foreground">{t("form.noOptionsAdded")}</p>
                                            <p className="text-xs text-muted-foreground/70 mt-1">{t("form.noOptionsAddedDescription")}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsTemplateDialogOpen(false)
                                        setEditingTemplate(null)
                                        setNewTemplateName("")
                                        setNewTemplateContent("")
                                        setNewTemplateCategory("greeting")
                                        setNewTemplateOptions([])
                                    }}
                                >
                                    {t("buttons.cancel")}
                                </Button>
                                <Button
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                    onClick={editingTemplate ? handleUpdateTemplate : handleAddTemplate}
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {editingTemplate ? t("buttons.update") : t("buttons.createTemplate")}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}

                {mainTab === "quickAnswers" && (
                    <Dialog
                        open={isQuickAnswerDialogOpen}
                        onOpenChange={(open) => {
                            if (open) {
                                setIsQuickAnswerDialogOpen(true)
                                return
                            }
                            handleCloseQuickAnswerDialog()
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                onClick={() => {
                                    resetQuickAnswerForm()
                                    setIsQuickAnswerDialogOpen(true)
                                }}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                {t("buttons.addQuickAnswer")}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingQuickAnswer ? t("dialog.editQuickAnswer") : t("dialog.createQuickAnswer")}
                                </DialogTitle>
                                <DialogDescription>
                                    {editingQuickAnswer
                                        ? t("dialog.editQuickAnswerDescription")
                                        : t("dialog.createQuickAnswerDescription")}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="quick-answer-title">{t("form.title")}</Label>
                                    <Input
                                        id="quick-answer-title"
                                        placeholder={t("form.titlePlaceholder")}
                                        value={quickAnswerTitle}
                                        onChange={(e) => setQuickAnswerTitle(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="quick-answer-content">{t("form.content")}</Label>
                                    <Textarea
                                        id="quick-answer-content"
                                        placeholder={t("form.contentPlaceholder")}
                                        value={quickAnswerContent}
                                        onChange={(e) => setQuickAnswerContent(e.target.value)}
                                        rows={6}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <Button variant="outline" onClick={handleCloseQuickAnswerDialog}>
                                    {t("buttons.cancel")}
                                </Button>
                                <Button
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                    onClick={editingQuickAnswer ? handleUpdateQuickAnswer : handleAddQuickAnswer}
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {editingQuickAnswer ? t("buttons.update") : t("buttons.addQuickAnswer")}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <Card className="elegant-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="caption-text">{t("stats.knowledgeItems")}</CardTitle>
                        <Brain className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{knowledgeBase.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">{t("stats.knowledgeItemsDescription")}</p>
                    </CardContent>
                </Card>

                <Card className="elegant-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="caption-text">{t("stats.templates")}</CardTitle>
                        <MessageSquare className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{templates.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">{t("stats.templatesDescription")}</p>
                    </CardContent>
                </Card>

                <Card className="elegant-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="caption-text">{t("stats.quickAnswers")}</CardTitle>
                        <Sparkles className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{quickAnswers.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">{t("stats.quickAnswersDescription")}</p>
                    </CardContent>
                </Card>

                <Card className="elegant-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="caption-text">{t("stats.trainingStatus")}</CardTitle>
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-primary">{t("stats.active")}</div>
                        <p className="text-xs text-muted-foreground mt-1">{t("stats.trainingStatusDescription")}</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs value={mainTab} onValueChange={(v) => setMainTab(v as MainTab)}>
                <TabsList className="grid w-full max-w-2xl grid-cols-3">
                    <TabsTrigger value="knowledge">
                        <Brain className="w-4 h-4 mr-2" />
                        {t("tabs.knowledgeBase")}
                    </TabsTrigger>
                    <TabsTrigger value="quickAnswers">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {t("tabs.quickAnswers")}
                    </TabsTrigger>
                    <TabsTrigger value="templates">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        {t("tabs.templates")}
                    </TabsTrigger>
                </TabsList>

                {/* Knowledge Base Tab */}
                <TabsContent value="knowledge" className="mt-6">
                    <Card className="elegant-card">
                        <CardHeader>
                            <CardTitle className="heading-secondary">{t("knowledge.title")}</CardTitle>
                            <CardDescription className="body-secondary">{t("knowledge.description")}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {knowledgeBase.length === 0 ? (
                                <div className="text-center py-12">
                                    <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="heading-secondary text-lg mb-2">{t("knowledge.empty.title")}</h3>
                                    <p className="body-secondary mb-4">{t("knowledge.empty.description")}</p>
                                    <Button
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                        onClick={() => setIsDialogOpen(true)}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        {t("knowledge.empty.button")}
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {knowledgeBase.map((item) => (
                                        <div
                                            key={item.id}
                                            className="refined-card p-4 rounded-xl border border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                                        >
                                            <div
                                                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${item.type === "text" ? "accent-blue" : "accent-purple"
                                                    }`}
                                            >
                                                {item.type === "text" ? (
                                                    <FileText className="w-5 h-5 text-primary" />
                                                ) : (
                                                    <LinkIcon className="w-5 h-5 text-primary" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 mt-2">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1">
                                                        <h4 className="heading-secondary">{item.title}</h4>
                                                        <p className="body-secondary text-sm mt-1 line-clamp-2">{item.content}</p>
                                                        <div className="flex items-center gap-3 mt-2">
                                                            <Badge variant="secondary" className="text-xs">
                                                                {item.type === "text" ? t("knowledge.type.text") : t("knowledge.type.url")}
                                                            </Badge>
                                                            <span className="text-xs text-muted-foreground">{t("knowledge.added")} {item.createdAt}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button variant="ghost" size="sm" onClick={() => handleEditItem(item)}>
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteItem(item.id)}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
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
                </TabsContent>

                <TabsContent value="quickAnswers" className="mt-6">
                    <Card className="elegant-card">
                        <CardHeader>
                            <CardTitle className="heading-secondary">{t("quickAnswers.title")}</CardTitle>
                            <CardDescription className="body-secondary">{t("quickAnswers.description")}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {quickAnswers.length === 0 ? (
                                <div className="text-center py-12">
                                    <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="heading-secondary text-lg mb-2">{t("quickAnswers.empty.title")}</h3>
                                    <p className="body-secondary mb-4">{t("quickAnswers.empty.description")}</p>
                                    <Button
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                        onClick={() => {
                                            resetQuickAnswerForm()
                                            setIsQuickAnswerDialogOpen(true)
                                        }}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        {t("quickAnswers.empty.button")}
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {quickAnswers.map((item) => (
                                        <div
                                            key={item.id}
                                            className="refined-card p-4 rounded-xl border border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                                        >
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 accent-orange">
                                                <MessageCircle className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0 mt-2">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1">
                                                        <h4 className="heading-secondary">{item.title}</h4>
                                                        <p className="body-secondary text-sm mt-1 line-clamp-2">{item.content}</p>
                                                        <div className="flex items-center gap-3 mt-2">
                                                            <Badge variant="secondary" className="text-xs">
                                                                {t("quickAnswers.label")}
                                                            </Badge>
                                                            <span className="text-xs text-muted-foreground">{t("quickAnswers.added")} {item.createdAt}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button variant="ghost" size="sm" onClick={() => handleEditQuickAnswer(item)}>
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteQuickAnswer(item.id)}
                                                            className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
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
                </TabsContent>

                <TabsContent value="templates" className="mt-6">
                    <Card className="elegant-card">
                        <CardHeader>
                            <CardTitle className="heading-secondary">{t("templates.title")}</CardTitle>
                            <CardDescription className="body-secondary">{t("templates.description")}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {templates.length === 0 ? (
                                <div className="text-center py-12">
                                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="heading-secondary text-lg mb-2">{t("templates.empty.title")}</h3>
                                    <p className="body-secondary mb-4">{t("templates.empty.description")}</p>
                                    <Button
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                        onClick={() => setIsTemplateDialogOpen(true)}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        {t("templates.empty.button")}
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {templates.map((template) => (
                                        <div
                                            key={template.id}
                                            className="refined-card p-4 rounded-xl border border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1">
                                                        <h4 className="heading-secondary">{template.name}</h4>
                                                        <p className="body-secondary text-sm mt-1 line-clamp-2">{template.content}</p>

                                                        {template.options && template.options.length > 0 && (
                                                            <div className="mt-3 space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <MousePointerClick className="w-3 h-3 text-muted-foreground" />
                                                                    <span className="text-xs font-medium text-muted-foreground">{t("templates.quickReplyOptions")}:</span>
                                                                </div>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {template.options.map((option) => (
                                                                        <Badge
                                                                            key={option.id}
                                                                            variant="outline"
                                                                            className="bg-card border-primary/20 text-primary"
                                                                        >
                                                                            {option.label}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="flex items-center gap-3 mt-3">
                                                            <Badge className={`text-xs ${getCategoryColor(template.category)}`}>
                                                                <Tag className="w-3 h-3 mr-1" />
                                                                {t(`categories.${template.category}`)}
                                                            </Badge>
                                                            <span className="text-xs text-muted-foreground">{t("templates.created")} {template.createdAt}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleCopyTemplate(template.content)}
                                                            className="text-primary hover:text-primary/80 hover:bg-primary/10"
                                                        >
                                                            <Copy className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={() => handleEditTemplate(template)}>
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteTemplate(template.id)}
                                                            className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
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
                </TabsContent>
            </Tabs>
        </div>
    )
}
