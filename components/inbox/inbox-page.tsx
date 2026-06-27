"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Link, useRouter } from "@/i18n/navigation"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    AlertTriangle,
    Building2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { StatusCallout } from "@/components/ui/status-callout"
import { maskPhoneForDisplay } from "@/lib/phone-utils"
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
import { listActiveSurveysAction, sendSurveyAction, type SurveyView } from "@/components/server-actions/surveys"
import type { QuickAnswerView, TemplateView } from "@/components/ai-training/types"
import { ContextPanel } from "@/components/inbox/context-panel"
import { NewConversationDialog } from "@/components/inbox/new-conversation-dialog"
import { InboxReplyListModal } from "@/components/inbox/inbox-reply-list-modal"
import { ReplyPreviewHoverCard } from "@/components/inbox/reply-preview-hover-card"
import {
    ConversationListPanel,
    type ConversationFilter,
} from "@/components/inbox/conversation-list-panel"
import { InboxMessageCache } from "@/components/inbox/inbox-message-cache"
import {
    mapConversationSummary,
    mapMessage,
    sortConversations,
    formatMessageTimestamp,
    type ConversationEntity,
    type InboxConversationSummary,
    type InboxMessage,
    type MessageEntity,
} from "@/components/inbox/inbox-mappers"
import type { InboxInitialData } from "@/lib/inbox/load-inbox-initial-data"
import { useInboxRealtime } from "@/hooks/use-inbox-realtime"
import { useInboxReplyBookmarks } from "@/hooks/use-inbox-reply-bookmarks"
import { applyItemOrder, mergeItemOrder, resolveSidebarItems } from "@/lib/inbox-reply-bookmarks"

type InboxPageProps = {
    hasCompanyAccess: boolean
    initialCompanyId?: string | null
    initialData?: InboxInitialData | null
}

type SuggestedResponse = {
    id: string
    text: string
    category: string
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

export default function InboxPage({
    hasCompanyAccess,
    initialCompanyId = null,
    initialData = null,
}: InboxPageProps) {
    const hasInitialData = Boolean(initialData && !initialData.loadError)
    const [conversations, setConversations] = useState<InboxConversationSummary[]>(
        initialData?.conversations ?? [],
    )
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
        initialData?.selectedConversationId ?? null,
    )
    const [connections, setConnections] = useState<InboxConnectionView[]>(initialData?.connections ?? [])
    const [whatsappConfigured, setWhatsappConfigured] = useState(initialData?.whatsappConfigured ?? false)
    const [whatsappAvailable, setWhatsappAvailable] = useState(initialData?.whatsappAvailable ?? true)
    const [selectedConnectionIds, setSelectedConnectionIds] = useState<string[]>([])
    const [showNewConversationDialog, setShowNewConversationDialog] = useState(false)
    const [prefilledCustomer, setPrefilledCustomer] = useState<{
        name?: string
        phone?: string
        email?: string
    } | null>(null)
    const [messages, setMessages] = useState<InboxMessage[]>(initialData?.messages ?? [])
    const [suggestedResponses, setSuggestedResponses] = useState<SuggestedResponse[]>([])
    const [quickAnswers, setQuickAnswers] = useState<QuickAnswerView[]>(initialData?.quickAnswers ?? [])
    const [templates, setTemplates] = useState<TemplateView[]>(initialData?.templates ?? [])
    const [surveys, setSurveys] = useState<SurveyView[]>([])
    const [assignedTo, setAssignedTo] = useState<{ id: string; name: string } | null>(null)
    const [activeSurveyResponseId, setActiveSurveyResponseId] = useState<string | null>(null)
    const [isSendingSurvey, setIsSendingSurvey] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [conversationFilter, setConversationFilter] = useState<ConversationFilter>("all")
    const [unreadTotal, setUnreadTotal] = useState(initialData?.unreadTotal ?? 0)
    const [isTogglingBookmark, setIsTogglingBookmark] = useState(false)
    const [messageInput, setMessageInput] = useState("")
    const [showContextPanel, setShowContextPanel] = useState(false)
    const [showQuickRepliesModal, setShowQuickRepliesModal] = useState(false)
    const [showTemplatesModal, setShowTemplatesModal] = useState(false)
    const [showDesktopConversations, setShowDesktopConversations] = useState(false)
    const [showConversationsList, setShowConversationsList] = useState(false)
    const [isLoadingConversations, setIsLoadingConversations] = useState(false)
    const [isLoadingMessages, setIsLoadingMessages] = useState(false)
    const [isSendingMessage, setIsSendingMessage] = useState(false)
    const [isConnectionsLoaded, setIsConnectionsLoaded] = useState(hasInitialData)
    const messageInputRef = useRef<HTMLTextAreaElement>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const initialLoadRef = useRef(hasInitialData && hasCompanyAccess)
    const selectedConversationIdRef = useRef<string | null>(initialData?.selectedConversationId ?? null)
    const searchQueryRef = useRef("")
    const selectedConnectionIdsRef = useRef<string[]>([])
    const loadConversationsRef = useRef<
        (page?: number, searchValue?: string, options?: { silent?: boolean }) => Promise<void>
    >(async () => {})
    const fetchConversationDetailRef = useRef<
        (conversationId: string, options?: { silent?: boolean; force?: boolean }) => Promise<void>
    >(async () => {})
    const messageCacheRef = useRef(new InboxMessageCache())
    const conversationsRef = useRef<InboxConversationSummary[]>(initialData?.conversations ?? [])
    const previousCompanyIdRef = useRef<string | null>(initialCompanyId ?? null)
    const isFirstSearchEffectRef = useRef(true)
    const conversationsRefreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const messagesRefreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const isFetchingConversationsRef = useRef(false)
    const inFlightConversationDetailRef = useRef<string | null>(null)
    const skipNextMessagesRefreshRef = useRef(false)
    const notifiedFailedMessageIdsRef = useRef<Set<string>>(
        new Set(
            (initialData?.messages ?? [])
                .filter((message) => message.sentBy === "user" && message.status === "failed")
                .map((message) => message.id),
        ),
    )
    const skipInitialConnectionsLoadRef = useRef(hasInitialData)
    const skipInitialReplyResourcesLoadRef = useRef(hasInitialData)
    const initialHydrationRef = useRef(hasInitialData)

    const isDesktop = useMediaQuery("(min-width: 768px)")
    const t = useTranslations("Inbox")
    const router = useRouter()
    const { user } = useUser()
    const searchParams = useSearchParams()

    const startConversationProcessedRef = useRef(false)

    const companyId =
        user?.defaultCompanyId != null ? String(user.defaultCompanyId) : (initialCompanyId ?? null)

    const {
        pinnedQuickAnswerIds,
        pinnedTemplateIds,
        quickAnswerOrderIds,
        templateOrderIds,
        toggleQuickAnswerBookmark,
        toggleTemplateBookmark,
        reorderQuickAnswers,
        reorderTemplates,
    } = useInboxReplyBookmarks(companyId, user?.id)

    const orderedQuickAnswers = useMemo(() => {
        const orderIds = mergeItemOrder(
            quickAnswers.map((item) => item.id),
            quickAnswerOrderIds,
        )
        return applyItemOrder(quickAnswers, orderIds)
    }, [quickAnswerOrderIds, quickAnswers])

    const orderedTemplates = useMemo(() => {
        const orderIds = mergeItemOrder(
            templates.map((item) => item.id),
            templateOrderIds,
        )
        return applyItemOrder(templates, orderIds)
    }, [templateOrderIds, templates])

    const visibleQuickAnswers = useMemo(
        () => resolveSidebarItems(orderedQuickAnswers, pinnedQuickAnswerIds, undefined, quickAnswerOrderIds),
        [pinnedQuickAnswerIds, orderedQuickAnswers, quickAnswerOrderIds],
    )

    const visibleTemplates = useMemo(
        () => resolveSidebarItems(orderedTemplates, pinnedTemplateIds, undefined, templateOrderIds),
        [pinnedTemplateIds, orderedTemplates, templateOrderIds],
    )

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

    useEffect(() => {
        if (!hasCompanyAccess) return
        void (async () => {
            const result = await listActiveSurveysAction()
            if (result.success && result.data) {
                setSurveys(result.data.surveys)
            }
        })()
    }, [hasCompanyAccess])

    useEffect(() => {
        if (!initialHydrationRef.current || !initialData || initialData.loadError) {
            return
        }

        initialHydrationRef.current = false

        const conversationId = initialData.selectedConversationId
        if (!conversationId || initialData.messages.length === 0) {
            return
        }

        const conversation = initialData.conversations.find((item) => item.id === conversationId)
        messageCacheRef.current.set(
            conversationId,
            messageCacheRef.current.createEntry(
                initialData.messages,
                [],
                conversation?.lastMessageAt,
            ),
        )

        void markInboxConversationReadAction({ conversationId }).catch((error) => {
            console.error("Failed to mark conversation as read", error)
        })
        void loadSuggestedResponses(conversationId)
    }, [initialData, loadSuggestedResponses])

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

                const detail = result.data as ConversationEntity & {
                    assignedTo?: { id: string; name: string } | null
                    activeSurveyResponseId?: string | null
                }
                setAssignedTo(detail.assignedTo ?? null)
                setActiveSurveyResponseId(detail.activeSurveyResponseId ?? null)

                const summaryBase = buildConversationSummary(result.data as ConversationEntity)
                const summary = { ...summaryBase, unreadCount: 0 }
                const mappedMessages = (result.data.messages as MessageEntity[]).map(mapMessage)
                for (const message of mappedMessages) {
                    if (message.sentBy === "user" && message.status === "failed") {
                        notifiedFailedMessageIdsRef.current.add(message.id)
                    }
                }
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
            setWhatsappConfigured(false)
            setWhatsappAvailable(true)
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
            setWhatsappConfigured(false)
            setWhatsappAvailable(true)
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

        if (skipInitialConnectionsLoadRef.current) {
            skipInitialConnectionsLoadRef.current = false
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

                if (result.success && result.data) {
                    setWhatsappConfigured(result.data.configured)
                    setWhatsappAvailable(result.data.available)
                    setConnections(result.data.connections)
                } else {
                    setWhatsappConfigured(false)
                    setWhatsappAvailable(true)
                    setConnections([])
                }
            } catch (error) {
                console.error("Failed to load inbox connections", error)
                if (isMounted) {
                    setWhatsappAvailable(false)
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

        if (skipInitialReplyResourcesLoadRef.current) {
            skipInitialReplyResourcesLoadRef.current = false
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
            if (mappedMessage.status === "failed") {
                notifiedFailedMessageIdsRef.current.add(mappedMessage.id)
                toast.warning(t("messages.whatsappDeliveryFailed"))
            }
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

    const handleAssignToMe = useCallback(async () => {
        if (!selectedConversationId || !user?.uid) return
        const result = await updateInboxConversationMetadataAction({
            conversationId: selectedConversationId,
            assignedToId: user.uid,
        })
        if (result.success && result.data) {
            const detail = result.data.conversation as ConversationEntity & {
                assignedTo?: { id: string; name: string } | null
            }
            setAssignedTo(detail.assignedTo ?? { id: user.uid, name: user.firstName || user.email || "You" })
            toast.success(t("context.assignment.takenOver"))
        } else {
            toast.error(result.error || t("context.assignment.failed"))
        }
    }, [selectedConversationId, t, user])

    const handleReleaseAssignment = useCallback(async () => {
        if (!selectedConversationId) return
        const result = await updateInboxConversationMetadataAction({
            conversationId: selectedConversationId,
            assignedToId: null,
        })
        if (result.success) {
            setAssignedTo(null)
            toast.success(t("context.assignment.released"))
        } else {
            toast.error(result.error || t("context.assignment.failed"))
        }
    }, [selectedConversationId, t])

    const handleSendSurvey = useCallback(
        async (surveyId: string, deliveryMode?: "inline" | "hosted") => {
            if (!selectedConversationId) return
            setIsSendingSurvey(true)
            try {
                const result = await sendSurveyAction({
                    surveyId,
                    conversationId: selectedConversationId,
                    deliveryMode,
                    locale: user?.language === "pt_BR" ? "pt-BR" : "en",
                })
                if (!result.success) {
                    toast.error(result.error || t("context.surveys.sendFailed"))
                    return
                }
                toast.success(t("context.surveys.sent"))
                if (deliveryMode === "inline") {
                    setActiveSurveyResponseId(result.data?.responseId ?? null)
                }
                void fetchConversationDetail(selectedConversationId, { silent: true, force: true })
            } finally {
                setIsSendingSurvey(false)
            }
        },
        [fetchConversationDetail, selectedConversationId, t, user?.language],
    )

    const contextPanelElement = (
        <ContextPanel
            conversation={selectedConversation}
            quickAnswers={quickAnswers}
            templates={templates}
            surveys={surveys}
            suggestedResponses={suggestedResponses}
            assignedTo={assignedTo}
            activeSurveyResponseId={activeSurveyResponseId}
            currentUserId={user?.uid ?? ""}
            visibleQuickAnswers={visibleQuickAnswers}
            visibleTemplates={visibleTemplates}
            onUseReply={handleUseSuggestedResponse}
            onAssignToMe={() => void handleAssignToMe()}
            onRelease={() => void handleReleaseAssignment()}
            onSendSurvey={(surveyId, mode) => void handleSendSurvey(surveyId, mode)}
            onShowQuickRepliesModal={() => setShowQuickRepliesModal(true)}
            onShowTemplatesModal={() => setShowTemplatesModal(true)}
            isSendingSurvey={isSendingSurvey}
        />
    )

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
                        isAgent && "bg-agent/10 text-agent",
                        isBot && "bg-primary/10 text-primary",
                        isSystem && "bg-muted text-muted-foreground",
                    )

                    const bubbleClass = cn(
                        "max-w-[80%] md:max-w-[70%] rounded-lg px-3 py-2 text-sm",
                        isCustomer && "bg-card border border-border text-foreground",
                        isAgent && "bg-agent/10 border border-agent/20 text-foreground",
                        isBot && "bg-primary/5 border border-primary/20 text-foreground",
                        isSystem && "bg-muted/60 border border-border/60 text-muted-foreground italic",
                    )

                    const metaClass = cn(
                        "flex items-center gap-1.5 mt-2 text-[11px]",
                        isCustomer && "text-muted-foreground",
                        isAgent && "text-agent/70",
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
            {whatsappConfigured && !whatsappAvailable && (
                <StatusCallout
                    variant="warning"
                    className="mx-3 mt-2"
                    message={t("whatsappOffline.message")}
                    linkHref="/settings"
                    linkLabel={t("whatsappOffline.settingsLink")}
                />
            )}
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
                                className="hidden md:inline-flex hover:bg-muted hover:text-foreground"
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
                                    {selectedConversation?.hasCustomerName ? (
                                        selectedConversation.customerName
                                            .split(" ")
                                            .map((namePart) => namePart[0])
                                            .join("")
                                            .toUpperCase()
                                            .slice(0, 2)
                                    ) : (
                                        <User className="w-4 h-4" aria-hidden="true" />
                                    )}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <h3 className="font-semibold text-sm text-foreground truncate">
                                    {selectedConversation?.customerName || t("messages.empty.title")}
                                </h3>
                                <p className="text-xs text-muted-foreground truncate">
                                    {selectedConversation?.customerPhone
                                        ? maskPhoneForDisplay(selectedConversation.customerPhone)
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
                                className="hover:bg-muted hover:text-foreground"
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
                                className="hover:bg-muted hover:text-foreground"
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
                                className="hover:bg-muted hover:text-foreground"
                                title={t("context.close")}
                                aria-label={t("context.close")}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex-1 min-h-0">
                            {contextPanelElement}
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
                            {contextPanelElement}
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

            <InboxReplyListModal
                open={showQuickRepliesModal}
                onOpenChange={setShowQuickRepliesModal}
                kind="quickAnswers"
                quickAnswers={orderedQuickAnswers}
                pinnedIds={pinnedQuickAnswerIds}
                onTogglePin={toggleQuickAnswerBookmark}
                onUseText={handleUseSuggestedResponse}
                onReorder={(activeId, overId) =>
                    reorderQuickAnswers(
                        quickAnswers.map((item) => item.id),
                        activeId,
                        overId,
                    )
                }
            />

            <InboxReplyListModal
                open={showTemplatesModal}
                onOpenChange={setShowTemplatesModal}
                kind="templates"
                templates={orderedTemplates}
                pinnedIds={pinnedTemplateIds}
                onTogglePin={toggleTemplateBookmark}
                onUseText={handleUseSuggestedResponse}
                onReorder={(activeId, overId) =>
                    reorderTemplates(
                        templates.map((item) => item.id),
                        activeId,
                        overId,
                    )
                }
            />
        </div>
    )
}
