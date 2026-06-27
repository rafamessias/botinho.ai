"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Link, useRouter } from "@/i18n/navigation"
import { format, formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
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
    Bookmark,
    MessageCircle,
    MessageSquarePlus,
    Contact,
    Sparkles,
    MessageSquare,
    Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatStoredPhoneForDisplay } from "@/lib/phone-utils"
import { useUser } from "@/components/user-provider"
import {
    createInboxConversationAction,
    getInboxConnectionsAction,
    getInboxConversationsAction,
    getInboxConversationDetailAction,
    getSuggestedResponsesAction,
    markInboxConversationReadAction,
    sendInboxMessageAction,
    updateInboxConversationMetadataAction,
    type InboxConnectionView,
} from "../server-actions/inbox"
import { getAiTrainingDataAction } from "@/components/server-actions/ai-training"
import type { QuickAnswerView, TemplateView } from "@/components/ai-training/types"
import { NewConversationDialog } from "@/components/inbox/new-conversation-dialog"
import {
    ConversationListPanel,
    type ConversationFilter,
} from "@/components/inbox/conversation-list-panel"
import { InboxMessageCache } from "@/components/inbox/inbox-message-cache"
import { useInboxRealtime } from "@/hooks/use-inbox-realtime"

type InboxConversationPriority = "low" | "medium" | "high"
type InboxMessageSenderType = "customer" | "agent" | "bot" | "system"
type InboxMessageSentBy = "customer" | "user" | "robot" | "system"
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
    isBookmarked?: boolean | null
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
    sentBy?: InboxMessageSentBy
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
    isBookmarked: boolean
    tags: string[]
}

type InboxMessage = {
    id: string
    content: string
    senderType: InboxMessageSenderType
    sentBy: InboxMessageSentBy
    sentAt: string | Date
    sentAtLabel: string
    status?: InboxMessageStatus
}

const resolveSentByFromMessage = (
    senderType: InboxMessageSenderType,
    sentBy?: InboxMessageSentBy,
): InboxMessageSentBy => {
    if (sentBy) return sentBy
    if (senderType === "bot") return "robot"
    if (senderType === "agent") return "user"
    if (senderType === "system") return "system"
    return "customer"
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

const isTransientServerActionError = (error: unknown) =>
    error instanceof Error && error.message.includes("unexpected response was received")

const withServerActionRetry = async <T,>(action: () => Promise<T>, retries = 1): Promise<T> => {
    let lastError: unknown

    for (let attempt = 0; attempt <= retries; attempt += 1) {
        try {
            return await action()
        } catch (error) {
            lastError = error
            if (!isTransientServerActionError(error) || attempt === retries) {
                throw error
            }

            await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)))
        }
    }

    throw lastError
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
        isBookmarked: conversation.isBookmarked ?? false,
        tags: conversation.tags?.filter((tag) => !!tag?.trim()) || [],
    }
}

const mapMessage = (message: MessageEntity): InboxMessage => {
    const sentAt = message.sentAt || message.createdAt || new Date().toISOString()

    return {
        id: message.id,
        content: message.content,
        senderType: message.senderType,
        sentBy: resolveSentByFromMessage(message.senderType, message.sentBy),
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

    return [...items].sort((a, b) => {
        if (a.isBookmarked !== b.isBookmarked) {
            return a.isBookmarked ? -1 : 1
        }

        return getTimeValue(b.lastMessageAt) - getTimeValue(a.lastMessageAt)
    })
}

export default function InboxPage() {
    const [conversations, setConversations] = useState<InboxConversationSummary[]>([])
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
    const [connections, setConnections] = useState<InboxConnectionView[]>([])
    const [selectedConnectionIds, setSelectedConnectionIds] = useState<string[]>([])
    const [showNewConversationDialog, setShowNewConversationDialog] = useState(false)
    const [prefilledCustomer, setPrefilledCustomer] = useState<{
        name?: string
        phone?: string
        email?: string
    } | null>(null)
    const [messages, setMessages] = useState<InboxMessage[]>([])
    const [suggestedResponses, setSuggestedResponses] = useState<SuggestedResponse[]>([])
    const [quickAnswers, setQuickAnswers] = useState<QuickAnswerView[]>([])
    const [templates, setTemplates] = useState<TemplateView[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [conversationFilter, setConversationFilter] = useState<ConversationFilter>("all")
    const [unreadTotal, setUnreadTotal] = useState(0)
    const [isTogglingBookmark, setIsTogglingBookmark] = useState(false)
    const [messageInput, setMessageInput] = useState("")
    const [showContextPanel, setShowContextPanel] = useState(false)
    const [showDesktopConversations, setShowDesktopConversations] = useState(false)
    const [showConversationsList, setShowConversationsList] = useState(false)
    const [isLoadingConversations, setIsLoadingConversations] = useState(true)
    const [isLoadingMessages, setIsLoadingMessages] = useState(false)
    const [isSendingMessage, setIsSendingMessage] = useState(false)
    const [isConnectionsLoaded, setIsConnectionsLoaded] = useState(false)
    const messageInputRef = useRef<HTMLTextAreaElement>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const initialLoadRef = useRef(false)
    const selectedConversationIdRef = useRef<string | null>(null)
    const searchQueryRef = useRef("")
    const selectedConnectionIdsRef = useRef<string[]>([])
    const loadConversationsRef = useRef<
        (page?: number, searchValue?: string, options?: { silent?: boolean }) => Promise<void>
    >(async () => {})
    const fetchConversationDetailRef = useRef<
        (conversationId: string, options?: { silent?: boolean; force?: boolean }) => Promise<void>
    >(async () => {})
    const messageCacheRef = useRef(new InboxMessageCache())
    const conversationsRef = useRef<InboxConversationSummary[]>([])
    const previousCompanyIdRef = useRef<string | null>(null)
    const isFirstSearchEffectRef = useRef(true)
    const conversationsRefreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const messagesRefreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const isFetchingConversationsRef = useRef(false)
    const inFlightConversationDetailRef = useRef<string | null>(null)
    const skipNextMessagesRefreshRef = useRef(false)
    const notifiedFailedMessageIdsRef = useRef<Set<string>>(new Set())
    const startConversationProcessedRef = useRef(false)

    const isDesktop = useMediaQuery("(min-width: 768px)")
    const t = useTranslations("Inbox")
    const tTemplates = useTranslations("Templates")
    const router = useRouter()
    const { user } = useUser()
    const searchParams = useSearchParams()

    const companyId = user?.defaultCompanyId != null ? String(user.defaultCompanyId) : null

    selectedConversationIdRef.current = selectedConversationId
    searchQueryRef.current = searchQuery
    selectedConnectionIdsRef.current = selectedConnectionIds
    conversationsRef.current = conversations

    const selectedConversation = useMemo(
        () => conversations.find((conversation) => conversation.id === selectedConversationId) ?? null,
        [conversations, selectedConversationId],
    )

    const filteredConversations = useMemo(() => {
        if (conversationFilter === "unread") {
            return conversations.filter((conversation) => conversation.unreadCount > 0)
        }

        if (conversationFilter === "favorites") {
            return conversations.filter((conversation) => conversation.isBookmarked)
        }

        return conversations
    }, [conversationFilter, conversations])

    const isConversationListFiltered =
        conversationFilter !== "all" || searchQuery.trim().length > 0

    const tRef = useRef(t)
    tRef.current = t

    const buildConversationSummary = useCallback(
        (conversation: ConversationEntity) =>
            mapConversationSummary(conversation, tRef.current("labels.customerFallback")),
        [],
    )

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

    useEffect(() => {
        for (const message of messages) {
            if (
                message.sentBy === "user" &&
                message.status === "failed" &&
                !notifiedFailedMessageIdsRef.current.has(message.id)
            ) {
                notifiedFailedMessageIdsRef.current.add(message.id)
                toast.warning(t("messages.whatsappDeliveryFailed"))
            }
        }
    }, [messages, t])

    const loadSuggestedResponses = useCallback(async (conversationId: string) => {
        const cached = messageCacheRef.current.get(conversationId)
        if (cached?.suggestedResponses.length) {
            setSuggestedResponses(cached.suggestedResponses)
            return cached.suggestedResponses
        }

        try {
            const result = await getSuggestedResponsesAction({ conversationId })
            if (result.success && result.data) {
                setSuggestedResponses(result.data)

                const existingCache = messageCacheRef.current.get(conversationId)
                if (existingCache) {
                    messageCacheRef.current.set(conversationId, {
                        ...existingCache,
                        suggestedResponses: result.data,
                    })
                }

                return result.data
            }

            setSuggestedResponses([])
            return []
        } catch (error) {
            console.error("Failed to load suggested responses", error)
            setSuggestedResponses([])
            return []
        }
    }, [])

    const applyCachedConversation = useCallback((conversationId: string) => {
        const cached = messageCacheRef.current.get(conversationId)
        if (!cached) {
            return false
        }

        setMessages(cached.messages)
        setSuggestedResponses(cached.suggestedResponses)
        return true
    }, [])

    const fetchConversationDetail = useCallback(
        async (conversationId: string, options?: { silent?: boolean; force?: boolean }) => {
            const conversationSummary = conversationsRef.current.find(
                (conversation) => conversation.id === conversationId,
            )
            const lastMessageAt =
                conversationSummary?.lastMessageAt ??
                messageCacheRef.current.get(conversationId)?.messages.at(-1)?.sentAt

            if (
                !options?.force &&
                messageCacheRef.current.isFresh(conversationId, lastMessageAt)
            ) {
                applyCachedConversation(conversationId)
                return
            }

            if (
                inFlightConversationDetailRef.current === conversationId &&
                !options?.force
            ) {
                return
            }

            inFlightConversationDetailRef.current = conversationId
            if (!options?.silent) {
                setIsLoadingMessages(true)
            }
            try {
                const result = await withServerActionRetry(() =>
                    getInboxConversationDetailAction({ conversationId }),
                )
                if (!result.success || !result.data) {
                    throw new Error(result.error || "Unable to load conversation")
                }

                const summaryBase = buildConversationSummary(result.data as ConversationEntity)
                const summary = { ...summaryBase, unreadCount: 0 }
                const mappedMessages = (result.data.messages as MessageEntity[]).map(mapMessage)
                const cachedSuggestions =
                    messageCacheRef.current.get(conversationId)?.suggestedResponses ?? []

                messageCacheRef.current.set(
                    conversationId,
                    messageCacheRef.current.createEntry(
                        mappedMessages,
                        cachedSuggestions,
                        summary.lastMessageAt,
                    ),
                )

                setConversations((previous) => {
                    const index = previous.findIndex((item) => item.id === summary.id)
                    if (index === -1) {
                        return sortConversations([...previous, summary])
                    }

                    const updated = [...previous]
                    updated[index] = summary
                    return sortConversations(updated)
                })

                if (selectedConversationIdRef.current === conversationId) {
                    setMessages(mappedMessages)
                    if (cachedSuggestions.length > 0) {
                        setSuggestedResponses(cachedSuggestions)
                    }
                }

                void loadSuggestedResponses(conversationId)
            } catch (error) {
                console.error("Failed to fetch conversation detail", error)
                if (selectedConversationIdRef.current === conversationId) {
                    if (!applyCachedConversation(conversationId)) {
                        setMessages([])
                        setSuggestedResponses([])
                    }
                }
            } finally {
                if (inFlightConversationDetailRef.current === conversationId) {
                    inFlightConversationDetailRef.current = null
                }
                if (!options?.silent) {
                    setIsLoadingMessages(false)
                }
            }
        },
        [applyCachedConversation, buildConversationSummary, loadSuggestedResponses],
    )

    const loadConversations = useCallback(
        async (page = 1, searchValue = "", options?: { silent?: boolean }) => {
            if (isFetchingConversationsRef.current) {
                return
            }

            isFetchingConversationsRef.current = true
            if (!options?.silent) {
                setIsLoadingConversations(true)
            }
            try {
                const selectedSessionIds = selectedConnectionIdsRef.current
                const result = await getInboxConversationsAction({
                    page,
                    search: searchValue.trim() ? searchValue.trim() : undefined,
                    sessionIds: selectedSessionIds.length > 0 ? selectedSessionIds : undefined,
                    includeCounts: true,
                })

                if (!result.success || !result.data) {
                    throw new Error(result.error || "Unable to load conversations")
                }

                const mapped = sortConversations(
                    (result.data.conversations as ConversationEntity[]).map(buildConversationSummary),
                )

                if (result.data.metrics?.unreadTotal != null) {
                    setUnreadTotal(result.data.metrics.unreadTotal)
                }

                const currentSelectedId = selectedConversationIdRef.current

                setConversations((previous) => {
                    if (!currentSelectedId || mapped.some((conversation) => conversation.id === currentSelectedId)) {
                        return mapped
                    }

                    const selectedSummary = previous.find((conversation) => conversation.id === currentSelectedId)
                    if (!selectedSummary) {
                        return mapped
                    }

                    return sortConversations([...mapped, selectedSummary])
                })

                if (mapped.length === 0) {
                    if (!currentSelectedId) {
                        setSelectedConversationId(null)
                        setMessages([])
                        setSuggestedResponses([])
                    }
                    return
                }

                const hasSelected = currentSelectedId
                    ? mapped.some((conversation) => conversation.id === currentSelectedId)
                    : false

                if (!hasSelected && !currentSelectedId) {
                    const nextConversationId = mapped[0].id
                    const nextConversation = mapped[0]
                    selectedConversationIdRef.current = nextConversationId
                    setSelectedConversationId(nextConversationId)
                    await fetchConversationDetail(nextConversationId, options)
                    if (nextConversation.unreadCount > 0) {
                        markInboxConversationReadAction({ conversationId: nextConversationId }).catch((error) => {
                            console.error("Failed to mark conversation as read", error)
                        })
                    }
                }
            } catch (error) {
                console.error("Failed to load conversations", error)
                setConversations([])
                setMessages([])
                setSuggestedResponses([])
                selectedConversationIdRef.current = null
                setSelectedConversationId(null)
            } finally {
                isFetchingConversationsRef.current = false
                if (!options?.silent) {
                    setIsLoadingConversations(false)
                }
            }
        },
        [buildConversationSummary, fetchConversationDetail],
    )

    loadConversationsRef.current = loadConversations
    fetchConversationDetailRef.current = fetchConversationDetail

    useEffect(() => {
        if (!companyId) {
            initialLoadRef.current = false
            previousCompanyIdRef.current = null
            isFirstSearchEffectRef.current = true
            setConversations([])
            setMessages([])
            setSuggestedResponses([])
            setQuickAnswers([])
            setTemplates([])
            selectedConversationIdRef.current = null
            setSelectedConversationId(null)
            setSearchQuery("")
            setMessageInput("")
            return
        }

        const companyChanged = previousCompanyIdRef.current !== companyId
        previousCompanyIdRef.current = companyId

        if (companyChanged) {
            initialLoadRef.current = false
            isFirstSearchEffectRef.current = true
            messageCacheRef.current.clear()
            setConversations([])
            setMessages([])
            setSuggestedResponses([])
            setQuickAnswers([])
            setTemplates([])
            selectedConversationIdRef.current = null
            setSelectedConversationId(null)
            setSelectedConnectionIds([])
            selectedConnectionIdsRef.current = []
            setConnections([])
            setIsConnectionsLoaded(false)
            startConversationProcessedRef.current = false
            setSearchQuery("")
            setMessageInput("")
        }

        if (initialLoadRef.current) {
            return
        }

        initialLoadRef.current = true
        void loadConversationsRef.current(1, "")
    }, [companyId])

    useEffect(() => {
        if (!companyId) {
            setIsConnectionsLoaded(false)
            return
        }

        let isMounted = true
        setIsConnectionsLoaded(false)

        const loadConnections = async () => {
            try {
                const result = await getInboxConnectionsAction()
                if (!isMounted) {
                    return
                }

                if (result.success && result.data?.configured) {
                    setConnections(result.data.connections)
                } else {
                    setConnections([])
                }
            } catch (error) {
                console.error("Failed to load inbox connections", error)
                if (isMounted) {
                    setConnections([])
                }
            } finally {
                if (isMounted) {
                    setIsConnectionsLoaded(true)
                }
            }
        }

        void loadConnections()

        return () => {
            isMounted = false
        }
    }, [companyId])

    useEffect(() => {
        if (!companyId) {
            return
        }

        let isMounted = true

        const loadReplyResources = async () => {
            try {
                const result = await getAiTrainingDataAction()
                if (!isMounted || !result.success || !result.data) {
                    return
                }

                setQuickAnswers(
                    result.data.quickAnswers
                        .filter((item) => item.content.trim().length > 0)
                        .map((item) => ({
                            id: item.id,
                            content: item.content,
                            createdAt: "",
                            updatedAt: "",
                        })),
                )
                setTemplates(
                    result.data.templates.map((item) => ({
                        id: item.id,
                        name: item.name,
                        content: item.content,
                        category: item.category,
                        createdAt: "",
                        updatedAt: "",
                        options: item.options?.map((option) => ({
                            id: option.id,
                            label: option.label,
                            value: option.value,
                        })),
                    })),
                )
            } catch (error) {
                console.error("Failed to load inbox reply resources", error)
                if (isMounted) {
                    setQuickAnswers([])
                    setTemplates([])
                }
            }
        }

        void loadReplyResources()

        return () => {
            isMounted = false
        }
    }, [companyId])

    useEffect(() => {
        if (!initialLoadRef.current) {
            return
        }

        void loadConversationsRef.current(1, searchQueryRef.current)
    }, [selectedConnectionIds])

    useEffect(() => {
        if (!initialLoadRef.current || isFirstSearchEffectRef.current) {
            isFirstSearchEffectRef.current = false
            return
        }

        const handler = setTimeout(() => {
            void loadConversationsRef.current(1, searchQuery)
        }, 400)

        return () => clearTimeout(handler)
    }, [searchQuery])

    useEffect(() => {
        return () => {
            if (conversationsRefreshTimeoutRef.current) {
                clearTimeout(conversationsRefreshTimeoutRef.current)
            }
            if (messagesRefreshTimeoutRef.current) {
                clearTimeout(messagesRefreshTimeoutRef.current)
            }
        }
    }, [])

    const scheduleRealtimeConversationsRefresh = useCallback(() => {
        if (conversationsRefreshTimeoutRef.current) {
            clearTimeout(conversationsRefreshTimeoutRef.current)
        }

        conversationsRefreshTimeoutRef.current = setTimeout(() => {
            void loadConversationsRef.current(1, searchQueryRef.current, { silent: true })
        }, 300)
    }, [])

    const scheduleRealtimeMessagesRefresh = useCallback(() => {
        if (skipNextMessagesRefreshRef.current) {
            skipNextMessagesRefreshRef.current = false
            return
        }

        const conversationId = selectedConversationIdRef.current
        if (!conversationId) {
            return
        }

        if (messagesRefreshTimeoutRef.current) {
            clearTimeout(messagesRefreshTimeoutRef.current)
        }

        messagesRefreshTimeoutRef.current = setTimeout(() => {
            void fetchConversationDetailRef.current(conversationId, { silent: true, force: true })
        }, 300)
    }, [])

    const handleRealtimeConversationsChange = useCallback(() => {
        scheduleRealtimeConversationsRefresh()
    }, [scheduleRealtimeConversationsRefresh])

    const handleRealtimeMessagesChange = useCallback(() => {
        scheduleRealtimeMessagesRefresh()
    }, [scheduleRealtimeMessagesRefresh])

    const handleRealtimeListenerError = useCallback(() => {
        scheduleRealtimeConversationsRefresh()
        scheduleRealtimeMessagesRefresh()
    }, [scheduleRealtimeConversationsRefresh, scheduleRealtimeMessagesRefresh])

    useInboxRealtime({
        companyId,
        conversationId: selectedConversationId,
        onConversationsChange: handleRealtimeConversationsChange,
        onMessagesChange: handleRealtimeMessagesChange,
        onListenerError: handleRealtimeListenerError,
    })

    useEffect(() => {
        if (!companyId) {
            return
        }

        const interval = setInterval(() => {
            void loadConversationsRef.current(1, searchQueryRef.current, { silent: true })
            const conversationId = selectedConversationIdRef.current
            if (conversationId) {
                void fetchConversationDetailRef.current(conversationId, { silent: true, force: true })
            }
        }, 12_000)

        return () => clearInterval(interval)
    }, [companyId])

    const handleSelectConversation = useCallback(
        async (conversationId: string) => {
            if (conversationId === selectedConversationId) {
                setShowConversationsList(false)
                return
            }

            setSelectedConversationId(conversationId)
            selectedConversationIdRef.current = conversationId
            setShowConversationsList(false)

            const hasCachedMessages = applyCachedConversation(conversationId)
            if (!hasCachedMessages) {
                setMessages([])
                setSuggestedResponses([])
            }

            setConversations((previous) =>
                previous.map((conversation) =>
                    conversation.id === conversationId
                        ? { ...conversation, unreadCount: 0 }
                        : conversation,
                ),
            )

            const selectedConversationItem = conversations.find((conversation) => conversation.id === conversationId)
            if (selectedConversationItem && selectedConversationItem.unreadCount > 0) {
                void markInboxConversationReadAction({ conversationId }).catch((error) => {
                    console.error("Failed to mark conversation as read", error)
                })
            }

            await fetchConversationDetail(conversationId, { silent: hasCachedMessages })
        },
        [applyCachedConversation, conversations, fetchConversationDetail, selectedConversationId],
    )

    const handleSendMessage = useCallback(async () => {
        if (!messageInput.trim() || !selectedConversationId) {
            return
        }

        const content = messageInput.trim()
        const conversationId = selectedConversationId
        const optimisticId = `optimistic-${Date.now()}`
        const optimisticMessage: InboxMessage = {
            id: optimisticId,
            content,
            senderType: "agent",
            sentBy: "user",
            sentAt: new Date(),
            sentAtLabel: formatMessageTimestamp(new Date()),
            status: "pending",
        }

        setMessages((previous) => {
            const nextMessages = [...previous, optimisticMessage]
            messageCacheRef.current.updateMessages(conversationId, nextMessages, new Date())
            return nextMessages
        })
        setMessageInput("")
        messageInputRef.current?.focus()
        setIsSendingMessage(true)
        skipNextMessagesRefreshRef.current = true

        try {
            const result = await sendInboxMessageAction({
                conversationId,
                content,
                senderType: "agent",
            })

            if (!result.success || !result.data) {
                throw new Error(result.error || "Unable to send message")
            }

            const mappedMessage = mapMessage(result.data.message as MessageEntity)
            const summary = buildConversationSummary(result.data.conversation as ConversationEntity)

            setMessages((previous) => {
                const nextMessages = previous.map((message) =>
                    message.id === optimisticId ? mappedMessage : message,
                )
                messageCacheRef.current.set(
                    conversationId,
                    messageCacheRef.current.createEntry(
                        nextMessages,
                        messageCacheRef.current.get(conversationId)?.suggestedResponses ?? [],
                        summary.lastMessageAt,
                    ),
                )
                return nextMessages
            })
            setConversations((previous) => {
                const index = previous.findIndex((item) => item.id === summary.id)
                if (index === -1) {
                    return sortConversations([...previous, summary])
                }

                const updated = [...previous]
                updated[index] = summary
                return sortConversations(updated)
            })

            void loadSuggestedResponses(summary.id)
            requestAnimationFrame(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
            })
        } catch (error) {
            skipNextMessagesRefreshRef.current = false
            setMessages((previous) => {
                const nextMessages = previous.filter((message) => message.id !== optimisticId)
                const cached = messageCacheRef.current.get(conversationId)
                if (cached) {
                    messageCacheRef.current.updateMessages(conversationId, nextMessages)
                }
                return nextMessages
            })
            setMessageInput(content)
            messageInputRef.current?.focus()
            console.error("Failed to send message", error)
            const message = error instanceof Error ? error.message : t("messages.sendFailed")
            toast.error(message || t("messages.sendFailed"))
        } finally {
            setIsSendingMessage(false)
        }
    }, [buildConversationSummary, loadSuggestedResponses, messageInput, selectedConversationId, t])

    const handleUseSuggestedResponse = useCallback((text: string) => {
        setMessageInput(text)
        messageInputRef.current?.focus()
    }, [])

    const getConnectionLabel = useCallback(
        (connection: InboxConnectionView) =>
            connection.label ?? connection.phoneNumber ?? connection.sessionId,
        [],
    )

    const handleConversationCreated = useCallback(
        async (conversationId: string) => {
            selectedConversationIdRef.current = conversationId
            setSelectedConversationId(conversationId)
            setShowConversationsList(false)
            await fetchConversationDetailRef.current(conversationId, { force: true })
            await loadConversationsRef.current(1, searchQueryRef.current, { silent: true })
        },
        [],
    )

    useEffect(() => {
        if (searchParams.get("startConversation") !== "1") {
            startConversationProcessedRef.current = false
            return
        }

        if (!initialLoadRef.current || !isConnectionsLoaded || startConversationProcessedRef.current) {
            return
        }

        const name = searchParams.get("name")?.trim()
        const phone = searchParams.get("phone")?.trim()
        const email = searchParams.get("email")?.trim()

        if (!name) {
            toast.error(t("newConversation.errors.nameRequired"))
            router.replace("/inbox")
            return
        }

        if (!phone) {
            toast.error(t("newConversation.errors.phoneRequired"))
            router.replace("/inbox")
            return
        }

        const resolveSessionId = (): string | undefined => {
            if (selectedConnectionIdsRef.current.length === 1) {
                return selectedConnectionIdsRef.current[0]
            }

            if (connections.length === 1) {
                return connections[0]!.sessionId
            }

            if (connections.length > 1) {
                return connections[0]!.sessionId
            }

            return undefined
        }

        startConversationProcessedRef.current = true
        router.replace("/inbox")

        const startConversation = async () => {
            try {
                const sessionId = resolveSessionId()

                const result = await createInboxConversationAction({
                    customer: {
                        name,
                        phone,
                        ...(email ? { email } : {}),
                    },
                    ...(sessionId ? { sessionId } : {}),
                })

                if (!result.success || !result.data) {
                    throw new Error(result.error || t("newConversation.errors.createFailed"))
                }

                toast.success(
                    result.data.existing
                        ? t("newConversation.messages.existingConversation")
                        : t("newConversation.messages.created"),
                )

                await handleConversationCreated(result.data.conversation.id)
            } catch (error) {
                console.error("Failed to start conversation from customer", error)
                const message =
                    error instanceof Error ? error.message : t("newConversation.errors.createFailed")
                toast.error(message)
            }
        }

        void startConversation()
    }, [
        connections,
        handleConversationCreated,
        isConnectionsLoaded,
        router,
        searchParams,
        t,
    ])

    const handleConnectionChange = useCallback((connectionIds: string[]) => {
        selectedConnectionIdsRef.current = connectionIds
        setSelectedConnectionIds(connectionIds)
        selectedConversationIdRef.current = null
        setSelectedConversationId(null)
        messageCacheRef.current.clear()
        setMessages([])
        setSuggestedResponses([])
    }, [])

    const handleOpenNewConversation = useCallback(() => {
        setPrefilledCustomer(null)
        setShowNewConversationDialog(true)
    }, [])

    const handleToggleBookmark = useCallback(async () => {
        if (!selectedConversationId || !selectedConversation || isTogglingBookmark) {
            return
        }

        const nextIsBookmarked = !selectedConversation.isBookmarked
        setIsTogglingBookmark(true)

        setConversations((previous) =>
            sortConversations(
                previous.map((conversation) =>
                    conversation.id === selectedConversationId
                        ? { ...conversation, isBookmarked: nextIsBookmarked }
                        : conversation,
                ),
            ),
        )

        try {
            const result = await updateInboxConversationMetadataAction({
                conversationId: selectedConversationId,
                isBookmarked: nextIsBookmarked,
            })

            if (!result.success || !result.data) {
                throw new Error(result.error || "Unable to update bookmark")
            }

            const summary = buildConversationSummary(result.data.conversation as ConversationEntity)
            setConversations((previous) => {
                const index = previous.findIndex((item) => item.id === summary.id)
                if (index === -1) {
                    return sortConversations([...previous, summary])
                }

                const updated = [...previous]
                updated[index] = summary
                return sortConversations(updated)
            })
        } catch (error) {
            setConversations((previous) =>
                sortConversations(
                    previous.map((conversation) =>
                        conversation.id === selectedConversationId
                            ? { ...conversation, isBookmarked: !nextIsBookmarked }
                            : conversation,
                    ),
                ),
            )
            console.error("Failed to toggle bookmark", error)
            toast.error(t("actions.bookmarkFailed"))
        } finally {
            setIsTogglingBookmark(false)
        }
    }, [
        buildConversationSummary,
        isTogglingBookmark,
        selectedConversation,
        selectedConversationId,
        t,
    ])

    const conversationListPanelProps = {
        conversations: filteredConversations,
        selectedConversationId,
        searchQuery,
        onSearchChange: setSearchQuery,
        conversationFilter,
        onFilterChange: setConversationFilter,
        unreadTotal,
        isLoading: isLoadingConversations,
        isFiltered: isConversationListFiltered,
        onSelectConversation: handleSelectConversation,
        onNewConversation: handleOpenNewConversation,
        connections,
        selectedConnectionIds,
        onConnectionChange: handleConnectionChange,
        getConnectionLabel,
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
                                    <span>{formatStoredPhoneForDisplay(selectedConversation.customerPhone)}</span>
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
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t("context.quickReplies.title")}</CardTitle>
                            <Link
                                href="/quick-answers"
                                className="text-[11px] font-medium text-primary hover:underline"
                            >
                                {t("context.quickReplies.manage")}
                            </Link>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {quickAnswers.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 bg-muted/40 px-4 py-6 text-center">
                                    <Zap className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-foreground">
                                            {t("context.quickReplies.empty.title")}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground">
                                            {t("context.quickReplies.empty.description")}
                                        </p>
                                    </div>
                                    <Button variant="outline" size="sm" className="mt-1 h-7 text-xs" asChild>
                                        <Link href="/quick-answers">{t("context.quickReplies.empty.action")}</Link>
                                    </Button>
                                </div>
                            ) : (
                                quickAnswers.map((quickAnswer) => (
                                    <Button
                                        key={quickAnswer.id}
                                        variant="outline"
                                        className="w-full justify-start items-start text-left text-xs h-auto py-2 px-3 whitespace-normal break-words"
                                        onClick={() => {
                                            handleUseSuggestedResponse(quickAnswer.content)
                                        }}
                                    >
                                        {quickAnswer.content}
                                    </Button>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card className="shadow-none">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t("context.templates.title")}</CardTitle>
                            <Link
                                href="/templates"
                                className="text-[11px] font-medium text-primary hover:underline"
                            >
                                {t("context.templates.manage")}
                            </Link>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {templates.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 bg-muted/40 px-4 py-6 text-center">
                                    <MessageSquare className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-foreground">
                                            {t("context.templates.empty.title")}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground">
                                            {t("context.templates.empty.description")}
                                        </p>
                                    </div>
                                    <Button variant="outline" size="sm" className="mt-1 h-7 text-xs" asChild>
                                        <Link href="/templates">{t("context.templates.empty.action")}</Link>
                                    </Button>
                                </div>
                            ) : (
                                templates.map((template) => (
                                    <div
                                        key={template.id}
                                        className="rounded-lg border border-border/60 bg-background p-3 space-y-2"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-xs font-medium text-foreground">{template.name}</p>
                                            <Badge variant="secondary" className="shrink-0 text-[10px]">
                                                {tTemplates(`categories.${template.category}`)}
                                            </Badge>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start items-start text-left text-xs h-auto py-2 px-3 whitespace-normal break-words"
                                            onClick={() => {
                                                handleUseSuggestedResponse(template.content)
                                            }}
                                        >
                                            {template.content}
                                        </Button>
                                        {template.options && template.options.length > 0 ? (
                                            <div className="flex flex-wrap gap-1.5">
                                                {template.options.map((option) => (
                                                    <Button
                                                        key={option.id}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 px-2 text-[10px]"
                                                        onClick={() => {
                                                            handleUseSuggestedResponse(option.value || option.label)
                                                        }}
                                                    >
                                                        {option.label}
                                                    </Button>
                                                ))}
                                            </div>
                                        ) : null}
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">{t("context.aiSuggestions.title")}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {suggestedResponses.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 bg-muted/40 px-4 py-6 text-center">
                                    <Sparkles className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-foreground">
                                            {t("context.aiSuggestions.empty.title")}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground">
                                            {t("context.aiSuggestions.empty.description")}
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
                    const sentBy = message.sentBy
                    const isCustomer = sentBy === "customer"
                    const isBot = sentBy === "robot"
                    const isAgent = sentBy === "user"
                    const isSystem = sentBy === "system"
                    const isOutbound = !isCustomer
                    const shouldShowStatus =
                        isOutbound &&
                        message.status &&
                        (message.status === "delivered" || message.status === "read")

                    const avatarFallbackClass = cn(
                        "text-xs font-semibold",
                        isCustomer && "bg-muted text-muted-foreground",
                        isAgent && "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                        isBot && "bg-primary/10 text-primary",
                        isSystem && "bg-muted text-muted-foreground",
                    )

                    const bubbleClass = cn(
                        "max-w-[80%] md:max-w-[70%] rounded-lg px-3 py-2 text-sm",
                        isCustomer && "bg-card border border-border text-foreground",
                        isAgent && "bg-blue-500/10 border border-blue-500/20 text-foreground",
                        isBot && "bg-primary/5 border border-primary/20 text-foreground",
                        isSystem && "bg-muted/60 border border-border/60 text-muted-foreground italic",
                    )

                    const metaClass = cn(
                        "flex items-center gap-1.5 mt-2 text-[11px]",
                        isCustomer && "text-muted-foreground",
                        isAgent && "text-blue-600/70 dark:text-blue-400/70",
                        isBot && "text-primary/60",
                        isSystem && "text-muted-foreground",
                    )

                    return (
                        <div
                            key={message.id}
                            className={cn("flex items-end gap-2", isOutbound && "flex-row-reverse")}
                        >
                            <Avatar className="w-8 h-8 flex-shrink-0 border border-border/70">
                                <AvatarFallback className={avatarFallbackClass}>
                                    {isBot ? (
                                        <Bot className="w-4 h-4" aria-hidden="true" />
                                    ) : (
                                        <User className="w-4 h-4" aria-hidden="true" />
                                    )}
                                </AvatarFallback>
                            </Avatar>
                            <div className={bubbleClass}>
                                <p>{message.content}</p>
                                <div className={metaClass}>
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
        <div className="flex h-[calc(100vh-48px)] flex-col overflow-hidden bg-background">
            <div className="flex min-h-0 flex-1 overflow-hidden bg-background">
                {showDesktopConversations && (
                    <div className="hidden w-[350px] shrink-0 overflow-hidden border-r border-border/60 md:flex">
                        <ConversationListPanel {...conversationListPanelProps} className="w-full" />
                    </div>
                )}

                <Sheet open={showConversationsList} onOpenChange={setShowConversationsList}>
                    <SheetContent side="left" className="flex w-full flex-col p-0 sm:w-[350px]">
                        <ConversationListPanel {...conversationListPanelProps} className="w-full" />
                    </SheetContent>
                </Sheet>

                <div className="flex min-h-0 min-w-0 flex-1 flex-col">
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
                                    {selectedConversation?.customerPhone
                                        ? formatStoredPhoneForDisplay(selectedConversation.customerPhone)
                                        : ""}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => void handleToggleBookmark()}
                                disabled={!selectedConversationId || isTogglingBookmark}
                                className="hover:bg-muted"
                                title={
                                    selectedConversation?.isBookmarked
                                        ? t("actions.removeBookmark")
                                        : t("actions.addBookmark")
                                }
                                aria-label={
                                    selectedConversation?.isBookmarked
                                        ? t("actions.removeBookmark")
                                        : t("actions.addBookmark")
                                }
                                aria-pressed={selectedConversation?.isBookmarked ?? false}
                            >
                                <Bookmark
                                    className={cn(
                                        "w-4 h-4",
                                        selectedConversation?.isBookmarked
                                            ? "fill-primary text-primary"
                                            : "text-muted-foreground",
                                    )}
                                    aria-hidden="true"
                                />
                            </Button>
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

            <NewConversationDialog
                open={showNewConversationDialog}
                onOpenChange={setShowNewConversationDialog}
                connections={connections}
                selectedConnectionIds={selectedConnectionIds}
                prefilledCustomer={prefilledCustomer}
                onConversationCreated={handleConversationCreated}
            />
        </div>
    )
}
