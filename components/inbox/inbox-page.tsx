"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { format, formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
    Search,
    Send,
    Bot,
    User,
    Clock,
    CheckCheck,
    Info,
    Phone,
    Mail,
    MapPin,
    X,
    PanelRight,
    PanelRightClose,
    ArrowLeft,
    PanelLeft,
    PanelLeftClose,
    Inbox,
    MessageCircle,
    MessageSquarePlus,
    Contact,
    Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "../ui/sidebar"
import {
    getInboxConversationsAction,
    getInboxConversationDetailAction,
    getSuggestedResponsesAction,
    markInboxConversationReadAction,
    sendInboxMessageAction,
} from "../server-actions/inbox"

type InboxConversationPriority = "low" | "medium" | "high"
type InboxMessageSenderType = "customer" | "agent" | "bot" | "system"
type InboxMessageStatus = "pending" | "sent" | "delivered" | "read" | "failed"

type SuggestedResponse = {
    id: string
    text: string
    category: string
}

type ConversationEntity = {
    id: string
    lastMessagePreview?: string | null
    lastMessageSentAt?: string | Date | null
    unreadCount: number
    priority?: InboxConversationPriority | null
    satisfactionScore?: number | null
    tags?: string[] | null
    createdAt: string | Date
    updatedAt: string | Date
    customer?: {
        id: string
        name?: string | null
        phone?: string | null
        email?: string | null
        address?: string | null
    } | null
}

type MessageEntity = {
    id: string
    content: string
    senderType: InboxMessageSenderType
    status?: InboxMessageStatus | null
    sentAt?: string | Date | null
    createdAt?: string | Date | null
}

type InboxConversationSummary = {
    id: string
    customerName: string
    customerPhone?: string
    customerEmail?: string
    customerAddress?: string
    lastMessage: string
    lastMessageAt?: string | Date
    timestampLabel: string
    unreadCount: number
    priority: InboxConversationPriority
    satisfactionScore?: number
    tags: string[]
}

type InboxMessage = {
    id: string
    content: string
    senderType: InboxMessageSenderType
    sentAt: string | Date
    sentAtLabel: string
    status?: InboxMessageStatus
}

const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        if (typeof window === "undefined") return

        const mediaQueryList = window.matchMedia(query)
        const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
            setMatches(event.matches)
        }

        handleChange(mediaQueryList)

        const listener = (event: MediaQueryListEvent) => handleChange(event)
        mediaQueryList.addEventListener("change", listener)

        return () => {
            mediaQueryList.removeEventListener("change", listener)
        }
    }, [query])

    return matches
}

const formatRelativeTimestamp = (value?: string | Date | null) => {
    if (!value) return ""

    const date = typeof value === "string" ? new Date(value) : value
    if (Number.isNaN(date.getTime())) {
        return ""
    }

    return formatDistanceToNow(date, { addSuffix: true })
}

const formatMessageTimestamp = (value?: string | Date | null) => {
    if (!value) return ""

    const date = typeof value === "string" ? new Date(value) : value
    if (Number.isNaN(date.getTime())) {
        return ""
    }

    return format(date, "HH:mm")
}

const mapConversationSummary = (
    conversation: ConversationEntity,
    fallbackName: string,
): InboxConversationSummary => {
    const lastMessageAt = conversation.lastMessageSentAt || conversation.updatedAt || conversation.createdAt

    return {
        id: conversation.id,
        customerName: conversation.customer?.name?.trim() || fallbackName,
        customerPhone: conversation.customer?.phone || undefined,
        customerEmail: conversation.customer?.email || undefined,
        customerAddress: conversation.customer?.address || undefined,
        lastMessage: conversation.lastMessagePreview?.trim() || "",
        lastMessageAt,
        timestampLabel: formatRelativeTimestamp(lastMessageAt),
        unreadCount: conversation.unreadCount ?? 0,
        priority: conversation.priority ?? "medium",
        satisfactionScore: conversation.satisfactionScore ?? undefined,
        tags: conversation.tags?.filter((tag) => !!tag?.trim()) || [],
    }
}

const mapMessage = (message: MessageEntity): InboxMessage => {
    const sentAt = message.sentAt || message.createdAt || new Date().toISOString()

    return {
        id: message.id,
        content: message.content,
        senderType: message.senderType,
        sentAt,
        sentAtLabel: formatMessageTimestamp(sentAt),
        status: message.status ?? undefined,
    }
}

const sortConversations = (items: InboxConversationSummary[]) => {
    const getTimeValue = (value?: string | Date) => {
        if (!value) return 0
        const date = typeof value === "string" ? new Date(value) : value
        const time = date.getTime()
        return Number.isNaN(time) ? 0 : time
    }

    return [...items].sort((a, b) => getTimeValue(b.lastMessageAt) - getTimeValue(a.lastMessageAt))
}

export default function InboxPage() {
    const [conversations, setConversations] = useState<InboxConversationSummary[]>([])
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
    const [messages, setMessages] = useState<InboxMessage[]>([])
    const [suggestedResponses, setSuggestedResponses] = useState<SuggestedResponse[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [messageInput, setMessageInput] = useState("")
    const [showContextPanel, setShowContextPanel] = useState(false)
    const [showDesktopConversations, setShowDesktopConversations] = useState(false)
    const [showConversationsList, setShowConversationsList] = useState(false)
    const [isLoadingConversations, setIsLoadingConversations] = useState(true)
    const [isLoadingMessages, setIsLoadingMessages] = useState(false)
    const [isSendingMessage, setIsSendingMessage] = useState(false)
    const messageInputRef = useRef<HTMLTextAreaElement>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const initialLoadRef = useRef(false)

    const isDesktop = useMediaQuery("(min-width: 768px)")
    const { setOpen } = useSidebar()
    const t = useTranslations("Inbox")

    const selectedConversation = useMemo(
        () => conversations.find((conversation) => conversation.id === selectedConversationId) ?? null,
        [conversations, selectedConversationId],
    )

    const hasClosedSidebarRef = useRef(false)

    const buildConversationSummary = useCallback(
        (conversation: ConversationEntity) => mapConversationSummary(conversation, t("labels.customerFallback")),
        [t],
    )

    const getPriorityLabel = useCallback(
        (priority?: InboxConversationPriority | null) => {
            if (priority === "high") {
                return t("priority.high")
            }

            if (priority === "low") {
                return t("priority.low")
            }

            return t("priority.medium")
        },
        [t],
    )

    useEffect(() => {
        if (hasClosedSidebarRef.current) {
            return
        }

        setOpen(false)
        hasClosedSidebarRef.current = true
    }, [setOpen])

    useEffect(() => {
        if (!isDesktop) {
            setShowContextPanel(false)
            setShowDesktopConversations(false)
            return
        }

        setShowContextPanel(true)
        setShowDesktopConversations(true)
    }, [isDesktop])

    useEffect(() => {
        if (!selectedConversationId) {
            return
        }

        requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        })
    }, [messages.length, selectedConversationId])

    useEffect(() => {
        if (!isLoadingMessages && selectedConversationId) {
            messageInputRef.current?.focus()
        }
    }, [isLoadingMessages, selectedConversationId])

    const loadSuggestedResponses = useCallback(async (conversationId: string) => {
        try {
            const result = await getSuggestedResponsesAction({ conversationId })
            if (result.success && result.data) {
                setSuggestedResponses(result.data)
            } else {
                setSuggestedResponses([])
            }
        } catch (error) {
            console.error("Failed to load suggested responses", error)
            setSuggestedResponses([])
        }
    }, [])

    const fetchConversationDetail = useCallback(
        async (conversationId: string) => {
            setIsLoadingMessages(true)
            try {
                const result = await getInboxConversationDetailAction({ conversationId })
                if (!result.success || !result.data) {
                    throw new Error(result.error || "Unable to load conversation")
                }

                const summaryBase = buildConversationSummary(result.data as ConversationEntity)
                const summary = { ...summaryBase, unreadCount: 0 }
                const mappedMessages = (result.data.messages as MessageEntity[]).map(mapMessage)

                setConversations((previous) => {
                    const index = previous.findIndex((item) => item.id === summary.id)
                    if (index === -1) {
                        return sortConversations([...previous, summary])
                    }

                    const updated = [...previous]
                    updated[index] = summary
                    return sortConversations(updated)
                })

                setMessages(mappedMessages)
                await loadSuggestedResponses(conversationId)
            } catch (error) {
                console.error("Failed to fetch conversation detail", error)
                setMessages([])
                setSuggestedResponses([])
            } finally {
                setIsLoadingMessages(false)
            }
        },
        [buildConversationSummary, loadSuggestedResponses],
    )

    const loadConversations = useCallback(
        async (page = 1, searchValue = "") => {
            setIsLoadingConversations(true)
            try {
                const result = await getInboxConversationsAction({
                    page,
                    search: searchValue.trim() ? searchValue.trim() : undefined,
                    includeCounts: true,
                })

                if (!result.success || !result.data) {
                    throw new Error(result.error || "Unable to load conversations")
                }

                const mapped = sortConversations(
                    (result.data.conversations as ConversationEntity[]).map(buildConversationSummary),
                )

                setConversations(mapped)

                if (mapped.length === 0) {
                    setSelectedConversationId(null)
                    setMessages([])
                    setSuggestedResponses([])
                    return
                }

                const hasSelected = selectedConversationId
                    ? mapped.some((conversation) => conversation.id === selectedConversationId)
                    : false

                if (!hasSelected) {
                    const nextConversationId = mapped[0].id
                    setSelectedConversationId(nextConversationId)
                    await fetchConversationDetail(nextConversationId)
                    markInboxConversationReadAction({ conversationId: nextConversationId }).catch((error) => {
                        console.error("Failed to mark conversation as read", error)
                    })
                }
            } catch (error) {
                console.error("Failed to load conversations", error)
                setConversations([])
                setMessages([])
                setSuggestedResponses([])
                setSelectedConversationId(null)
            } finally {
                setIsLoadingConversations(false)
            }
        },
        [buildConversationSummary, fetchConversationDetail, selectedConversationId],
    )

    useEffect(() => {
        if (!initialLoadRef.current) {
            initialLoadRef.current = true
            void loadConversations(1, "")
        }
    }, [loadConversations])

    useEffect(() => {
        if (!initialLoadRef.current) {
            return
        }

        const handler = setTimeout(() => {
            void loadConversations(1, searchQuery)
        }, 400)

        return () => clearTimeout(handler)
    }, [loadConversations, searchQuery])

    const handleSelectConversation = useCallback(
        async (conversationId: string) => {
            if (conversationId === selectedConversationId) {
                setShowConversationsList(false)
                return
            }

            setSelectedConversationId(conversationId)
            setShowConversationsList(false)
            setMessages([])
            setSuggestedResponses([])

            setConversations((previous) =>
                previous.map((conversation) =>
                    conversation.id === conversationId
                        ? { ...conversation, unreadCount: 0 }
                        : conversation,
                ),
            )

            void markInboxConversationReadAction({ conversationId }).catch((error) => {
                console.error("Failed to mark conversation as read", error)
            })

            await fetchConversationDetail(conversationId)
        },
        [fetchConversationDetail, selectedConversationId],
    )

    const handleSendMessage = useCallback(async () => {
        if (!messageInput.trim() || !selectedConversationId) {
            return
        }

        setIsSendingMessage(true)
        try {
            const result = await sendInboxMessageAction({
                conversationId: selectedConversationId,
                content: messageInput.trim(),
                senderType: "agent",
            })

            if (!result.success || !result.data) {
                throw new Error(result.error || "Unable to send message")
            }

            const mappedMessage = mapMessage(result.data.message as MessageEntity)
            const summary = buildConversationSummary(result.data.conversation as ConversationEntity)

            setMessages((previous) => [...previous, mappedMessage])
            setConversations((previous) => {
                const index = previous.findIndex((conversation) => conversation.id === summary.id)
                if (index === -1) {
                    return sortConversations([...previous, summary])
                }

                const updated = [...previous]
                updated[index] = summary
                return sortConversations(updated)
            })

            setMessageInput("")
            messageInputRef.current?.focus()
            await loadSuggestedResponses(summary.id)
            requestAnimationFrame(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
            })
        } catch (error) {
            console.error("Failed to send message", error)
        } finally {
            setIsSendingMessage(false)
        }
    }, [buildConversationSummary, loadSuggestedResponses, messageInput, selectedConversationId])

    const handleUseSuggestedResponse = useCallback((text: string) => {
        setMessageInput(text)
        messageInputRef.current?.focus()
    }, [])

    const getPriorityColor = (priority?: InboxConversationPriority | null) => {
        switch (priority) {
            case "high":
                return "bg-red-500/10 text-red-600 border-red-500/20"
            case "medium":
                return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
            default:
                return "bg-muted/50 text-muted-foreground"
        }
    }

    const renderConversationItems = () => {
        if (isLoadingConversations) {
            return (
                <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={`conversation-skeleton-${index}`} className="h-14 rounded-lg bg-muted animate-pulse" />
                    ))}
                </div>
            )
        }

        if (!conversations.length) {
            return (
                <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                        <Inbox className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-foreground">{t("conversations.empty.title")}</h3>
                        <p className="text-xs text-muted-foreground">{t("conversations.empty.description")}</p>
                    </div>
                </div>
            )
        }

        return conversations.map((conversation) => (
            <button
                key={conversation.id}
                onClick={() => {
                    void handleSelectConversation(conversation.id)
                }}
                className={cn(
                    "w-full rounded-lg px-3 py-2 flex items-start gap-3 text-left transition-colors",
                    selectedConversationId === conversation.id
                        ? "bg-primary/10 border border-primary/30"
                        : "hover:bg-muted",
                )}
                aria-label={t("conversations.selectConversationAria", { name: conversation.customerName })}
            >
                <Avatar className="w-10 h-10 flex-shrink-0 border border-border/70">
                    <AvatarFallback className="bg-muted text-xs font-semibold text-muted-foreground">
                        {conversation.customerName
                            .split(" ")
                            .map((namePart) => namePart[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <h4 className="font-semibold text-sm text-foreground truncate">
                            {conversation.customerName}
                        </h4>
                        <span className="text-[11px] text-muted-foreground flex-shrink-0">
                            {conversation.timestampLabel}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-1">
                        {conversation.lastMessage || t("conversations.noMessage")}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        {conversation.priority && (
                            <Badge
                                variant="outline"
                                className={cn(
                                    "text-[11px] px-1.5 py-0.5 border capitalize",
                                    getPriorityColor(conversation.priority),
                                )}
                            >
                                {getPriorityLabel(conversation.priority)}
                            </Badge>
                        )}
                        {conversation.tags.slice(0, 1).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-[11px] px-1.5 py-0.5">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
                {conversation.unreadCount > 0 && (
                    <Badge className="bg-primary text-primary-foreground flex-shrink-0 h-5 min-w-5 items-center justify-center text-[11px] font-semibold">
                        {conversation.unreadCount}
                    </Badge>
                )}
            </button>
        ))
    }

    const ContextPanelContent = () => {
        if (!selectedConversation) {
            return (
                <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                        <Contact className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-foreground">{t("context.empty.title")}</h3>
                        <p className="text-xs text-muted-foreground">{t("context.empty.description")}</p>
                    </div>
                </div>
            )
        }

        return (
            <div className="h-full overflow-y-auto">
                <div className="p-4 space-y-4 pb-6">
                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">{t("context.customer.title")}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-xs text-muted-foreground">
                            {selectedConversation.customerPhone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                                    <span>{selectedConversation.customerPhone}</span>
                                </div>
                            )}
                            {selectedConversation.customerEmail && (
                                <div className="flex items-center gap-2">
                                    <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                                    <span className="truncate">{selectedConversation.customerEmail}</span>
                                </div>
                            )}
                            {selectedConversation.customerAddress && (
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-3.5 h-3.5 mt-0.5" aria-hidden="true" />
                                    <span>{selectedConversation.customerAddress}</span>
                                </div>
                            )}
                            {selectedConversation.satisfactionScore != null && (
                                <div className="flex items-center gap-2">
                                    <Info className="w-3.5 h-3.5" aria-hidden="true" />
                                    <span>
                                        {t("context.customer.satisfaction", {
                                            score: selectedConversation.satisfactionScore,
                                        })}
                                    </span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">{t("context.quickReplies.title")}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {suggestedResponses.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 bg-muted/40 px-4 py-6 text-center">
                                    <Sparkles className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-foreground">
                                            {t("context.quickReplies.empty.title")}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground">
                                            {t("context.quickReplies.empty.description")}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                suggestedResponses.map((suggestion) => (
                                    <Button
                                        key={suggestion.id}
                                        variant="outline"
                                        className="w-full justify-start items-start text-left text-xs h-auto py-2 px-3 whitespace-normal break-words"
                                        onClick={() => {
                                            handleUseSuggestedResponse(suggestion.text)
                                        }}
                                    >
                                        {suggestion.text}
                                    </Button>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    const renderMessages = () => {
        if (!selectedConversationId) {
            return (
                <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                        <MessageSquarePlus className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-foreground">{t("messages.empty.title")}</h3>
                        <p className="text-xs text-muted-foreground">{t("messages.empty.description")}</p>
                    </div>
                </div>
            )
        }

        if (isLoadingMessages) {
            return (
                <div className="px-4 py-5 space-y-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={`message-skeleton-${index}`} className="flex gap-2">
                            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 rounded bg-muted animate-pulse" />
                                <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            )
        }

        if (!messages.length) {
            return (
                <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                        <MessageCircle className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-foreground">{t("messages.noMessages.title")}</h3>
                        <p className="text-xs text-muted-foreground">{t("messages.noMessages.description")}</p>
                    </div>
                </div>
            )
        }

        return (
            <div className="px-4 py-5 space-y-3">
                {messages.map((message) => {
                    const isCustomer = message.senderType === "customer"
                    const shouldShowStatus = message.senderType !== "customer" && message.status && message.status !== "failed"

                    return (
                        <div
                            key={message.id}
                            className={cn("flex items-end gap-2", !isCustomer && "flex-row-reverse")}
                        >
                            <Avatar className="w-8 h-8 flex-shrink-0 border border-border/70">
                                <AvatarFallback
                                    className={cn(
                                        "text-xs font-semibold",
                                        isCustomer ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary",
                                    )}
                                >
                                    {isCustomer ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </AvatarFallback>
                            </Avatar>
                            <div
                                className={cn(
                                    "max-w-[80%] md:max-w-[70%] rounded-lg px-3 py-2 text-sm",
                                    isCustomer
                                        ? "bg-card border border-border text-foreground"
                                        : "bg-primary/5 border border-primary/20 text-foreground",
                                )}
                            >
                                <p>{message.content}</p>
                                <div
                                    className={cn(
                                        "flex items-center gap-1.5 mt-2 text-[11px]",
                                        isCustomer ? "text-muted-foreground" : "text-primary/60",
                                    )}
                                >
                                    <Clock className="w-3 h-3" aria-hidden="true" />
                                    <span>{message.sentAtLabel}</span>
                                    {shouldShowStatus && <CheckCheck className="w-3.5 h-3.5" aria-hidden="true" />}
                                </div>
                            </div>
                        </div>
                    )
                })}
                <div ref={messagesEndRef} />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-[calc(100vh-48px)] overflow-hidden bg-background">
            <div className="flex-1 min-h-0 flex overflow-hidden bg-background">
                {showDesktopConversations && (
                    <div className="hidden md:flex w-64 border-r border-border/60 flex-col bg-background flex-shrink-0 overflow-hidden">
                        <div className="h-14 px-4 flex items-center border-b border-border/60">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                                <Input
                                    placeholder={t("searchPlaceholder")}
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    className="h-9 pl-9 text-sm bg-background border-border focus-visible:ring-1 focus-visible:ring-primary"
                                    aria-label={t("searchPlaceholder")}
                                />
                            </div>
                        </div>
                        <div className="flex-1 min-h-0 overflow-y-auto">
                            <div className="p-2 pb-4 space-y-1 h-full">{renderConversationItems()}</div>
                        </div>
                    </div>
                )}

                <Sheet open={showConversationsList} onOpenChange={setShowConversationsList}>
                    <SheetContent side="left" className="w-full sm:w-72 p-0 flex flex-col">
                        <SheetHeader className="px-4 py-4 border-b border-border/60">
                            <SheetTitle className="text-left">{t("conversations.title")}</SheetTitle>
                        </SheetHeader>
                        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                            <div className="px-4 py-3 border-b border-border/60">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                                    <Input
                                        placeholder={t("searchPlaceholder")}
                                        value={searchQuery}
                                        onChange={(event) => setSearchQuery(event.target.value)}
                                        className="h-9 pl-9 text-sm bg-background border-border focus-visible:ring-1 focus-visible:ring-primary"
                                        aria-label={t("searchPlaceholder")}
                                    />
                                </div>
                            </div>
                            <div className="flex-1 min-h-0 overflow-y-auto">
                                <div className="p-2 pb-4 space-y-1 h-full">{renderConversationItems()}</div>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>

                <div className="flex-1 min-h-0 flex flex-col min-w-0">
                    <div className="h-14 px-4 flex items-center justify-between border-b border-border/60 flex-shrink-0">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowConversationsList(true)}
                                className="md:hidden"
                                title={t("actions.openConversations")}
                                aria-label={t("actions.openConversations")}
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowDesktopConversations(!showDesktopConversations)}
                                className="hidden md:inline-flex hover:bg-muted"
                                title={
                                    showDesktopConversations ? t("actions.hideConversations") : t("actions.showConversations")
                                }
                                aria-label={
                                    showDesktopConversations ? t("actions.hideConversations") : t("actions.showConversations")
                                }
                            >
                                {showDesktopConversations ? (
                                    <PanelLeftClose className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                    <PanelLeft className="w-4 h-4 text-muted-foreground" />
                                )}
                            </Button>
                            <Avatar className="w-9 h-9 flex-shrink-0 border border-border/70">
                                <AvatarFallback className="bg-muted text-xs font-semibold text-muted-foreground">
                                    {selectedConversation?.customerName
                                        ?.split(" ")
                                        .map((namePart) => namePart[0])
                                        .join("")
                                        .toUpperCase()
                                        .slice(0, 2) || "--"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <h3 className="font-semibold text-sm text-foreground truncate">
                                    {selectedConversation?.customerName || t("messages.empty.title")}
                                </h3>
                                <p className="text-xs text-muted-foreground truncate">
                                    {selectedConversation?.customerPhone || ""}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowContextPanel(!showContextPanel)}
                                className="hover:bg-muted"
                                title={showContextPanel ? t("actions.hideContext") : t("actions.showContext")}
                                aria-label={showContextPanel ? t("actions.hideContext") : t("actions.showContext")}
                            >
                                {showContextPanel ? (
                                    <PanelRightClose className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                    <PanelRight className="w-4 h-4 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 overflow-y-auto bg-secondary">{renderMessages()}</div>

                    <div className="border-t border-border/60 px-4 py-3 flex-shrink-0">
                        <div className="flex items-end gap-3">
                            <div className="flex-1 relative">
                                <Textarea
                                    ref={messageInputRef}
                                    placeholder={
                                        selectedConversation
                                            ? t("typeMessagePlaceholder")
                                            : t("messages.inputPlaceholderNoSelection")
                                    }
                                    value={messageInput}
                                    onChange={(event) => setMessageInput(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" && !event.shiftKey) {
                                            event.preventDefault()
                                            void handleSendMessage()
                                        }
                                    }}
                                    className="flex-1 min-h-[48px] max-h-[120px] resize-none text-sm bg-background border-border focus-visible:ring-1 focus-visible:ring-primary pr-9"
                                    rows={2}
                                    disabled={!selectedConversationId}
                                    aria-label={
                                        selectedConversation
                                            ? t("typeMessagePlaceholder")
                                            : t("messages.inputPlaceholderNoSelection")
                                    }
                                />
                                {messageInput.trim() && (
                                    <div className="absolute bottom-2 right-2 text-[11px] text-muted-foreground">
                                        {messageInput.length}
                                    </div>
                                )}
                            </div>
                            <Button
                                onClick={() => void handleSendMessage()}
                                disabled={!messageInput.trim() || !selectedConversationId || isSendingMessage}
                                size="icon"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground h-[48px] w-[48px] flex-shrink-0 disabled:opacity-50"
                                aria-label={t("actions.send")}
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {showContextPanel && (
                    <div className="hidden md:flex w-72 border-l border-border/60 flex-col bg-background flex-shrink-0 overflow-hidden">
                        <div className="h-14 px-4 flex items-center justify-between border-b border-border/60">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <Info className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                                {t("context.title")}
                            </h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowContextPanel(false)}
                                className="hover:bg-muted"
                                title={t("context.close")}
                                aria-label={t("context.close")}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex-1 min-h-0">
                            <ContextPanelContent />
                        </div>
                    </div>
                )}

                <Sheet open={showContextPanel && !isDesktop} onOpenChange={setShowContextPanel}>
                    <SheetContent side="right" className="w-full sm:w-72 md:hidden p-0 flex flex-col overflow-hidden">
                        <SheetHeader className="px-4 py-4 border-b border-border/60 flex-shrink-0">
                            <SheetTitle className="text-left flex items-center gap-2">
                                <Info className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                                {t("context.title")}
                            </SheetTitle>
                        </SheetHeader>
                        <div className="flex-1 min-h-0">
                            <ContextPanelContent />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}
