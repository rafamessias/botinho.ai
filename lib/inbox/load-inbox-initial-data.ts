import { getTranslations } from "next-intl/server"
import type { QuickAnswerView, TemplateView } from "@/components/ai-training/types"
import { mapQuickAnswersToView } from "@/components/ai-training/map-quick-answer-views"
import { mapTemplatesToView } from "@/components/ai-training/map-template-views"
import {
  getInboxConnectionsAction,
  getInboxConversationDetailAction,
  getInboxConversationsAction,
  getInboxReplyResourcesAction,
  type InboxConnectionView,
} from "@/components/server-actions/inbox"
import { INBOX_CONVERSATIONS_DEFAULT_PAGE_SIZE } from "@/lib/inbox/conversation-list-pagination"
import { INBOX_MESSAGES_DEFAULT_PAGE_SIZE } from "@/lib/inbox/message-pagination"
import {
  mapConversationSummary,
  mapMessage,
  sortConversations,
  type ConversationEntity,
  type InboxConversationSummary,
  type InboxMessage,
  type MessageEntity,
} from "@/components/inbox/inbox-mappers"

export type InboxInitialData = {
  conversations: InboxConversationSummary[]
  unreadTotal: number
  selectedConversationId: string | null
  messages: InboxMessage[]
  connections: InboxConnectionView[]
  whatsappConfigured: boolean
  whatsappAvailable: boolean
  whatsappNeedsRepair: boolean
  quickAnswers: QuickAnswerView[]
  templates: TemplateView[]
  loadError: string | null
  hasMoreOlderMessages?: boolean
}

const mapInboxQuickAnswers = (items: QuickAnswerView[]): QuickAnswerView[] =>
  items
    .filter((item) => item.content.trim().length > 0)
    .map((item) => ({
      ...item,
      createdAt: "",
      updatedAt: "",
    }))

const mapInboxTemplates = (items: TemplateView[]): TemplateView[] =>
  items.map((item) => ({
    ...item,
    createdAt: "",
    updatedAt: "",
  }))

export const loadInboxInitialData = async (): Promise<InboxInitialData> => {
  const t = await getTranslations("Inbox")
  const fallbackName = t("labels.customerFallback")

  const emptyState: InboxInitialData = {
    conversations: [],
    unreadTotal: 0,
    selectedConversationId: null,
    messages: [],
    connections: [],
    whatsappConfigured: false,
    whatsappAvailable: true,
    whatsappNeedsRepair: false,
    quickAnswers: [],
    templates: [],
    loadError: null,
    hasMoreOlderMessages: false,
  }

  const [conversationsResult, connectionsResult, trainingResult] = await Promise.all([
    getInboxConversationsAction({
      pageSize: INBOX_CONVERSATIONS_DEFAULT_PAGE_SIZE,
      includeCounts: true,
    }),
    getInboxConnectionsAction(),
    getInboxReplyResourcesAction(),
  ])

  if (!conversationsResult.success || !conversationsResult.data) {
    return {
      ...emptyState,
      loadError: conversationsResult.error || "Unable to load conversations",
    }
  }

  let conversations = sortConversations(
    (conversationsResult.data.conversations as ConversationEntity[]).map((conversation) =>
      mapConversationSummary(conversation, fallbackName),
    ),
  )

  const unreadTotal = conversationsResult.data.metrics?.unreadTotal ?? 0

  let selectedConversationId: string | null = null
  let messages: InboxMessage[] = []
  let hasMoreOlderMessages = false

  if (conversations.length > 0) {
    selectedConversationId = conversations[0]!.id
    const detailResult = await getInboxConversationDetailAction({
      conversationId: selectedConversationId,
      messageLimit: INBOX_MESSAGES_DEFAULT_PAGE_SIZE,
    })

    if (detailResult.success && detailResult.data) {
      messages = (detailResult.data.messages as MessageEntity[]).map(mapMessage)
      hasMoreOlderMessages = Boolean(detailResult.data.hasMoreOlderMessages)
      const summary = mapConversationSummary(detailResult.data as ConversationEntity, fallbackName)
      conversations = sortConversations(
        conversations.map((conversation) =>
          conversation.id === summary.id ? { ...summary, unreadCount: 0 } : conversation,
        ),
      )
    }
  }

  const connections =
    connectionsResult.success && connectionsResult.data ? connectionsResult.data.connections : []

  const whatsappConfigured =
    connectionsResult.success && connectionsResult.data ? connectionsResult.data.configured : false

  const whatsappAvailable =
    connectionsResult.success && connectionsResult.data ? connectionsResult.data.available : true

  const whatsappNeedsRepair =
    connectionsResult.success && connectionsResult.data ? connectionsResult.data.needsRepair : false

  let quickAnswers: QuickAnswerView[] = []
  let templates: TemplateView[] = []

  if (trainingResult.success && trainingResult.data) {
    quickAnswers = mapInboxQuickAnswers(mapQuickAnswersToView(trainingResult.data.quickAnswers))
    templates = mapInboxTemplates(mapTemplatesToView(trainingResult.data.templates))
  }

  return {
    conversations,
    unreadTotal,
    selectedConversationId,
    messages,
    connections,
    whatsappConfigured,
    whatsappAvailable,
    whatsappNeedsRepair,
    quickAnswers,
    templates,
    loadError: null,
    hasMoreOlderMessages,
  }
}
