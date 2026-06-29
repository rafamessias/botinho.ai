import assert from "node:assert/strict"
import test from "node:test"
import {
  inboxSessionCache,
  resolveInboxBootstrap,
} from "../../lib/inbox/inbox-session-cache"

test("resolveInboxBootstrap returns empty when no company or cache", () => {
  inboxSessionCache.clear()

  assert.deepEqual(resolveInboxBootstrap(null), {
    source: "empty",
    snapshot: null,
  })
  assert.deepEqual(resolveInboxBootstrap("company-1"), {
    source: "empty",
    snapshot: null,
  })
})

test("session cache persists and restores inbox snapshot", () => {
  inboxSessionCache.clear()

  inboxSessionCache.save({
    companyId: "company-1",
    conversations: [
      {
        id: "conv-1",
        customerName: "Alice",
        lastMessage: "Hello",
        unreadCount: 0,
      },
    ],
    unreadTotal: 0,
    selectedConversationId: "conv-1",
    messages: [
      {
        id: "msg-1",
        content: "Hello",
        senderType: "customer",
        sentBy: "customer",
        sentAt: "2026-01-01T00:00:00.000Z",
        sentAtLabel: "Jan 1",
      },
    ],
    connections: [],
    whatsappConfigured: true,
    whatsappAvailable: true,
    whatsappNeedsRepair: false,
    quickAnswers: [],
    templates: [],
    selectedConnectionIds: [],
    searchQuery: "alice",
    conversationFilter: "all",
  })

  const bootstrap = resolveInboxBootstrap("company-1")
  assert.equal(bootstrap.source, "session")
  assert.equal(bootstrap.snapshot?.selectedConversationId, "conv-1")
  assert.equal(bootstrap.snapshot?.searchQuery, "alice")
  assert.equal(inboxSessionCache.isFresh("company-1"), true)
})

test("session cache clears per company", () => {
  inboxSessionCache.clear()

  inboxSessionCache.save({
    companyId: "company-1",
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
    selectedConnectionIds: [],
    searchQuery: "",
    conversationFilter: "all",
  })

  inboxSessionCache.save({
    companyId: "company-2",
    conversations: [],
    unreadTotal: 1,
    selectedConversationId: null,
    messages: [],
    connections: [],
    whatsappConfigured: false,
    whatsappAvailable: true,
    whatsappNeedsRepair: false,
    quickAnswers: [],
    templates: [],
    selectedConnectionIds: [],
    searchQuery: "",
    conversationFilter: "all",
  })

  inboxSessionCache.clear("company-1")
  assert.equal(inboxSessionCache.getSnapshot("company-1"), null)
  assert.equal(inboxSessionCache.getSnapshot("company-2")?.unreadTotal, 1)
})
