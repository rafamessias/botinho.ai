"use client"

import { useMemo, useState, type ReactNode } from "react"
import { format, isToday, isYesterday } from "date-fns"
import { useTranslations } from "next-intl"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ConnectionSelectDialog } from "@/components/inbox/connection-select-dialog"
import { IconBrandWhatsapp } from "@tabler/icons-react"
import { Inbox, Bookmark, Bot, Mail, MessageSquarePlus, Search, User, UserCheck, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { InboxConnectionView } from "@/components/server-actions/inbox"
import type { AssignedAgentView } from "@/components/inbox/inbox-mappers"

export type ConversationFilter = "all" | "unread" | "favorites" | "human" | "bot"

export type ConversationListItem = {
    id: string
    customerName: string
    hasCustomerName?: boolean
    lastMessage: string
    lastMessageAt?: string | Date
    unreadCount: number
    isBookmarked?: boolean
    assignedToId?: string | null
    assignedTo?: AssignedAgentView
}

type ConversationListPanelProps = {
    conversations: ConversationListItem[]
    selectedConversationId: string | null
    searchQuery: string
    onSearchChange: (value: string) => void
    conversationFilter: ConversationFilter
    onFilterChange: (filter: ConversationFilter) => void
    unreadTotal: number
    isLoading: boolean
    isFiltered: boolean
    onSelectConversation: (id: string) => void
    onNewConversation: () => void
    connections?: InboxConnectionView[]
    selectedConnectionIds?: string[]
    onConnectionChange?: (sessionIds: string[]) => void
    getConnectionLabel?: (connection: InboxConnectionView) => string
    className?: string
}

export const formatListTimestamp = (
    value: string | Date | null | undefined,
    yesterdayLabel = "Yesterday",
) => {
    if (!value) return ""

    const date = typeof value === "string" ? new Date(value) : value
    if (Number.isNaN(date.getTime())) {
        return ""
    }

    if (isToday(date)) {
        return format(date, "HH:mm")
    }

    if (isYesterday(date)) {
        return yesterdayLabel
    }

    return format(date, "dd/MM/yy")
}

const getInitials = (name: string) =>
    name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)

type FilterIconButtonProps = {
    active: boolean
    label: string
    onClick: () => void
    children: ReactNode
    badge?: number
}

const FilterIconButton = ({ active, label, onClick, children, badge }: FilterIconButtonProps) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <button
                type="button"
                onClick={onClick}
                aria-label={label}
                aria-pressed={active}
                className={cn(
                    "relative flex size-8 items-center justify-center rounded-lg transition-colors",
                    active
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
            >
                {children}
                {badge != null && badge > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium leading-none text-primary-foreground">
                        {badge > 99 ? "99+" : badge}
                    </span>
                )}
            </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
)

export const ConversationListPanel = ({
    conversations,
    selectedConversationId,
    searchQuery,
    onSearchChange,
    conversationFilter,
    onFilterChange,
    unreadTotal,
    isLoading,
    isFiltered,
    onSelectConversation,
    onNewConversation,
    connections = [],
    selectedConnectionIds = [],
    onConnectionChange,
    getConnectionLabel,
    className,
}: ConversationListPanelProps) => {
    const t = useTranslations("Inbox")
    const [isConnectionDialogOpen, setIsConnectionDialogOpen] = useState(false)

    const selectedConnectionLabel = useMemo(() => {
        if (selectedConnectionIds.length === 0) {
            return t("toolbar.allConnections")
        }

        if (selectedConnectionIds.length === 1) {
            const connection = connections.find((item) => item.sessionId === selectedConnectionIds[0])
            if (connection && getConnectionLabel) {
                return getConnectionLabel(connection)
            }
        }

        return t("toolbar.viewingMultiple", { count: selectedConnectionIds.length })
    }, [connections, getConnectionLabel, selectedConnectionIds, t])

    const showConnectionControls =
        connections.length > 0 && onConnectionChange && getConnectionLabel

    const renderItems = () => {
        if (isLoading) {
            return (
                <div className="space-y-1 px-1">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div
                            key={`conversation-skeleton-${index}`}
                            className="mx-2 h-[72px] rounded-lg bg-muted/60 animate-pulse"
                        />
                    ))}
                </div>
            )
        }

        if (!conversations.length) {
            return (
                <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3 px-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                        <Inbox className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-foreground">
                            {isFiltered
                                ? t("conversations.filteredEmpty.title")
                                : t("conversations.empty.title")}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            {isFiltered
                                ? t("conversations.filteredEmpty.description")
                                : t("conversations.empty.description")}
                        </p>
                    </div>
                </div>
            )
        }

        return conversations.map((conversation) => {
            const hasUnread = conversation.unreadCount > 0
            const isSelected = selectedConversationId === conversation.id
            const isHumanHandled = Boolean(conversation.assignedToId)

            return (
                <button
                    key={conversation.id}
                    type="button"
                    onClick={() => onSelectConversation(conversation.id)}
                    className={cn(
                        "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                        isSelected ? "bg-muted/80" : "hover:bg-muted/50",
                    )}
                    aria-label={t("conversations.selectConversationAria", { name: conversation.customerName })}
                >
                    <Avatar className="size-[49px] shrink-0 border border-border/50">
                        <AvatarFallback className="bg-muted text-sm font-medium text-muted-foreground">
                            {conversation.hasCustomerName ? (
                                getInitials(conversation.customerName)
                            ) : (
                                <User className="size-5" aria-hidden="true" />
                            )}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <div className="flex items-baseline justify-between gap-2">
                            <span className="flex min-w-0 items-center gap-1 truncate text-[15px] font-normal text-foreground">
                                {conversation.isBookmarked && (
                                    <Bookmark
                                        className="size-3.5 shrink-0 fill-primary text-primary"
                                        aria-hidden="true"
                                    />
                                )}
                                {isHumanHandled ? (
                                    <span
                                        title={
                                            conversation.assignedTo?.name
                                                ? t("conversations.handledByHuman", {
                                                      name: conversation.assignedTo.name,
                                                  })
                                                : t("conversations.handledByHumanShort")
                                        }
                                    >
                                        <UserCheck
                                            className="size-3.5 shrink-0 text-primary"
                                            aria-hidden="true"
                                        />
                                    </span>
                                ) : (
                                    <span title={t("conversations.handledByBot")}>
                                        <Bot
                                            className="size-3.5 shrink-0 text-muted-foreground"
                                            aria-hidden="true"
                                        />
                                    </span>
                                )}
                                <span className="truncate">{conversation.customerName}</span>
                            </span>
                            <span
                                className={cn(
                                    "shrink-0 text-xs",
                                    hasUnread ? "font-medium text-primary" : "text-muted-foreground",
                                )}
                            >
                                {formatListTimestamp(conversation.lastMessageAt, t("conversations.yesterday"))}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                            <p className="min-w-0 truncate text-sm text-muted-foreground">
                                {conversation.lastMessage || t("conversations.noMessage")}
                            </p>
                            {hasUnread && (
                                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-medium leading-none text-primary-foreground">
                                    {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
                                </span>
                            )}
                        </div>
                    </div>
                </button>
            )
        })
    }

    return (
        <div className={cn("flex h-full flex-col bg-background", className)}>
            <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border/60 px-4">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                    <h2 className="shrink-0 text-sm font-semibold text-foreground">
                        {t("conversations.title")}
                    </h2>
                    {showConnectionControls && (
                        <span className="truncate text-xs text-muted-foreground">
                            · {selectedConnectionLabel}
                        </span>
                    )}
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onNewConversation}
                        className="size-10 text-muted-foreground hover:bg-muted hover:text-foreground"
                        title={t("actions.newConversation")}
                        aria-label={t("actions.newConversation")}
                    >
                        <MessageSquarePlus className="size-5" aria-hidden="true" />
                    </Button>
                    {showConnectionControls && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsConnectionDialogOpen(true)}
                                className="size-10 text-muted-foreground hover:bg-muted hover:text-foreground"
                                title={t("toolbar.connectionButtonTitle", {
                                    connection: selectedConnectionLabel,
                                })}
                                aria-label={t("toolbar.connectionButtonTitle", {
                                    connection: selectedConnectionLabel,
                                })}
                            >
                                <IconBrandWhatsapp className="size-5" aria-hidden="true" />
                            </Button>
                            <ConnectionSelectDialog
                                open={isConnectionDialogOpen}
                                onOpenChange={setIsConnectionDialogOpen}
                                connections={connections}
                                selectedConnectionIds={selectedConnectionIds}
                                onConnectionChange={onConnectionChange}
                                getConnectionLabel={getConnectionLabel}
                            />
                        </>
                    )}
                </div>
            </header>

            <div className="shrink-0 px-3 pt-3 pb-2">
                <div className="relative">
                    <Search
                        className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden="true"
                    />
                    <Input
                        placeholder={t("searchOrStartChat")}
                        value={searchQuery}
                        onChange={(event) => onSearchChange(event.target.value)}
                        className="h-9 rounded-lg border-0 bg-muted/60 pl-9 pr-10 text-sm focus-visible:ring-1 focus-visible:ring-primary"
                        aria-label={t("searchOrStartChat")}
                    />
                    {searchQuery && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 size-7 -translate-y-1/2 text-muted-foreground hover:bg-muted hover:text-foreground"
                            onClick={() => onSearchChange("")}
                            aria-label={t("clearSearch")}
                        >
                            <X className="size-4" aria-hidden="true" />
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid shrink-0 grid-cols-5 gap-1 px-3 pb-2">
                <FilterIconButton
                    active={conversationFilter === "all"}
                    label={t("filters.all")}
                    onClick={() => onFilterChange("all")}
                >
                    <Inbox className="size-4" aria-hidden="true" />
                </FilterIconButton>
                <FilterIconButton
                    active={conversationFilter === "unread"}
                    label={t("filters.unread")}
                    onClick={() => onFilterChange("unread")}
                    badge={unreadTotal}
                >
                    <Mail className="size-4" aria-hidden="true" />
                </FilterIconButton>
                <FilterIconButton
                    active={conversationFilter === "favorites"}
                    label={t("filters.favorites")}
                    onClick={() => onFilterChange("favorites")}
                >
                    <Bookmark className="size-4" aria-hidden="true" />
                </FilterIconButton>
                <FilterIconButton
                    active={conversationFilter === "human"}
                    label={t("filters.human")}
                    onClick={() => onFilterChange("human")}
                >
                    <UserCheck className="size-4" aria-hidden="true" />
                </FilterIconButton>
                <FilterIconButton
                    active={conversationFilter === "bot"}
                    label={t("filters.bot")}
                    onClick={() => onFilterChange("bot")}
                >
                    <Bot className="size-4" aria-hidden="true" />
                </FilterIconButton>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">{renderItems()}</div>
        </div>
    )
}
