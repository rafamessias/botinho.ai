import type { InboxInitialData } from "@/lib/inbox/load-inbox-initial-data"
import {
  inboxSessionCache,
  resolveInboxBootstrap,
  type InboxSessionSnapshot,
} from "@/lib/inbox/inbox-session-cache"

const snapshotFromInitialData = (
  companyId: string,
  data: InboxInitialData,
): InboxSessionSnapshot => ({
  companyId,
  conversations: data.conversations,
  unreadTotal: data.unreadTotal,
  selectedConversationId: data.selectedConversationId,
  messages: data.messages,
  connections: data.connections,
  whatsappConfigured: data.whatsappConfigured,
  whatsappAvailable: data.whatsappAvailable,
  whatsappNeedsRepair: data.whatsappNeedsRepair,
  quickAnswers: data.quickAnswers,
  templates: data.templates,
  selectedConnectionIds: [],
  searchQuery: "",
  conversationFilter: "all",
  updatedAt: Date.now(),
})

export type InboxMountState = {
  snapshot: InboxSessionSnapshot | null
  hasBootstrap: boolean
  isFreshSession: boolean
  seededFromServer: boolean
}

export const resolveInboxMountState = (params: {
  initialCompanyId: string | null
  initialData?: InboxInitialData | null
}): InboxMountState => {
  const companyId = params.initialCompanyId ? String(params.initialCompanyId) : null
  const { snapshot: sessionSnapshot } = resolveInboxBootstrap(companyId)

  if (sessionSnapshot) {
    return {
      snapshot: sessionSnapshot,
      hasBootstrap: true,
      isFreshSession: companyId != null && inboxSessionCache.isFresh(companyId),
      seededFromServer: false,
    }
  }

  if (params.initialData && companyId && !params.initialData.loadError) {
    return {
      snapshot: snapshotFromInitialData(companyId, params.initialData),
      hasBootstrap: true,
      isFreshSession: false,
      seededFromServer: true,
    }
  }

  return {
    snapshot: null,
    hasBootstrap: false,
    isFreshSession: false,
    seededFromServer: false,
  }
}
