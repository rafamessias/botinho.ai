"use client"

import { useId, useMemo } from "react"
import { useTranslations } from "next-intl"
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Link } from "@/i18n/navigation"
import { Bookmark, GripVertical, MessageSquare, Zap } from "lucide-react"
import { toast } from "sonner"
import type { QuickAnswerView, TemplateView } from "@/components/ai-training/types"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type InboxReplyListModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    kind: "quickAnswers" | "templates"
    quickAnswers?: QuickAnswerView[]
    templates?: TemplateView[]
    pinnedIds: string[]
    onTogglePin: (id: string) => boolean
    onUseText: (text: string) => void
    onReorder: (activeId: string, overId: string) => void
}

type SortableReplyItemProps = {
    id: string
    isPinned: boolean
    pinLabel: string
    unpinLabel: string
    dragLabel: string
    onTogglePin: (event: React.MouseEvent, id: string) => void
    onUseText: (text: string) => void
    children: (helpers: { onUseText: (text: string) => void }) => React.ReactNode
}

const SortableReplyItem = ({
    id,
    isPinned,
    pinLabel,
    unpinLabel,
    dragLabel,
    onTogglePin,
    onUseText,
    children,
}: SortableReplyItemProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

    return (
        <li
            ref={setNodeRef}
            data-dragging={isDragging}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
        >
            <div className="group flex items-start gap-0.5 rounded-md transition-colors hover:bg-muted dark:hover:bg-muted/50">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-1 ml-0.5 h-8 w-8 shrink-0 cursor-grab text-muted-foreground hover:bg-transparent hover:text-foreground active:cursor-grabbing dark:hover:bg-transparent dark:hover:text-foreground"
                    aria-label={dragLabel}
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="h-4 w-4" aria-hidden="true" />
                </Button>
                <div className="min-w-0 flex-1">{children({ onUseText })}</div>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-1 mr-1 h-8 w-8 shrink-0 hover:bg-transparent hover:text-foreground dark:hover:bg-transparent dark:hover:text-foreground"
                    aria-label={isPinned ? unpinLabel : pinLabel}
                    onClick={(event) => onTogglePin(event, id)}
                >
                    <Bookmark
                        className={cn(
                            "h-4 w-4",
                            isPinned ? "fill-primary text-primary" : "text-muted-foreground",
                        )}
                        aria-hidden="true"
                    />
                </Button>
            </div>
        </li>
    )
}

export const InboxReplyListModal = ({
    open,
    onOpenChange,
    kind,
    quickAnswers = [],
    templates = [],
    pinnedIds,
    onTogglePin,
    onUseText,
    onReorder,
}: InboxReplyListModalProps) => {
    const t = useTranslations("Inbox")
    const sortableId = useId()

    const isQuickAnswers = kind === "quickAnswers"
    const items = isQuickAnswers ? quickAnswers : templates
    const manageHref = isQuickAnswers ? "/quick-answers" : "/templates"
    const title = isQuickAnswers ? t("context.quickReplies.title") : t("context.templates.title")
    const description = isQuickAnswers
        ? t("context.quickReplies.modalDescription")
        : t("context.templates.modalDescription")
    const manageLabel = isQuickAnswers ? t("context.quickReplies.manage") : t("context.templates.manage")
    const Icon = isQuickAnswers ? Zap : MessageSquare

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
        useSensor(KeyboardSensor, {}),
    )

    const itemIds = useMemo(() => items.map((item) => item.id), [items])

    const handleTogglePin = (event: React.MouseEvent, id: string) => {
        event.stopPropagation()
        const wasSuccessful = onTogglePin(id)
        if (!wasSuccessful) {
            toast.error(t("context.pinLimit"))
        }
    }

    const handleUseText = (text: string) => {
        onUseText(text)
        onOpenChange(false)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) {
            return
        }

        onReorder(String(active.id), String(over.id))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
                <DialogHeader className="gap-2 border-b px-6 py-4 text-left">
                    <DialogTitle className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                        {title}
                    </DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center">
                            <Icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                            <p className="text-sm font-medium text-foreground">
                                {isQuickAnswers
                                    ? t("context.quickReplies.empty.title")
                                    : t("context.templates.empty.title")}
                            </p>
                            <Button variant="outline" size="sm" className="mt-1" asChild>
                                <Link href={manageHref}>
                                    {isQuickAnswers
                                        ? t("context.quickReplies.empty.action")
                                        : t("context.templates.empty.action")}
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <DndContext
                            id={sortableId}
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            modifiers={[restrictToVerticalAxis]}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                                <ul className="space-y-1">
                                    {items.map((item) => {
                                        const isPinned = pinnedIds.includes(item.id)

                                        if (isQuickAnswers) {
                                            const quickAnswer = item as QuickAnswerView
                                            return (
                                                <SortableReplyItem
                                                    key={quickAnswer.id}
                                                    id={quickAnswer.id}
                                                    isPinned={isPinned}
                                                    pinLabel={t("context.pin")}
                                                    unpinLabel={t("context.unpin")}
                                                    dragLabel={t("context.dragToReorder")}
                                                    onTogglePin={handleTogglePin}
                                                    onUseText={handleUseText}
                                                >
                                                    {({ onUseText: useText }) => (
                                                        <button
                                                            type="button"
                                                            className="w-full rounded-md px-3 py-2.5 text-left text-foreground"
                                                            onClick={() => useText(quickAnswer.content)}
                                                        >
                                                            <span className="text-sm leading-snug text-foreground">
                                                                {quickAnswer.content}
                                                            </span>
                                                        </button>
                                                    )}
                                                </SortableReplyItem>
                                            )
                                        }

                                        const template = item as TemplateView
                                        return (
                                            <SortableReplyItem
                                                key={template.id}
                                                id={template.id}
                                                isPinned={isPinned}
                                                pinLabel={t("context.pin")}
                                                unpinLabel={t("context.unpin")}
                                                dragLabel={t("context.dragToReorder")}
                                                onTogglePin={handleTogglePin}
                                                onUseText={handleUseText}
                                            >
                                                {({ onUseText: useText }) => (
                                                    <div className="rounded-md px-3 py-2.5">
                                                        <button
                                                            type="button"
                                                            className="w-full text-left text-foreground"
                                                            onClick={() => useText(template.content)}
                                                        >
                                                            <span className="block text-sm font-medium text-foreground">
                                                                {template.name}
                                                            </span>
                                                            <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                                                                {template.content}
                                                            </span>
                                                        </button>
                                                        {template.options && template.options.length > 0 ? (
                                                            <div className="mt-2 flex flex-wrap gap-1">
                                                                {template.options.map((option) => (
                                                                    <Button
                                                                        key={option.id}
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="h-6 px-2 text-[11px] font-normal"
                                                                        onClick={() =>
                                                                            useText(option.value || option.label)
                                                                        }
                                                                    >
                                                                        {option.label}
                                                                    </Button>
                                                                ))}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                )}
                                            </SortableReplyItem>
                                        )
                                    })}
                                </ul>
                            </SortableContext>
                        </DndContext>
                    )}
                </div>

                <div className="flex items-center justify-between border-t px-6 py-3">
                    <p className="text-[11px] text-muted-foreground">{t("context.pinHint")}</p>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs hover:bg-muted hover:text-foreground dark:hover:bg-muted/50"
                        asChild
                    >
                        <Link href={manageHref}>{manageLabel}</Link>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
