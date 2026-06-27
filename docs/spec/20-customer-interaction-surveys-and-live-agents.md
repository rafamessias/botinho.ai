# 20 — Customer Interaction, Surveys & Live Agents

## Purpose

Document the Customer Interaction sidebar section, company-level surveys (inline WhatsApp + hosted page), AI agent survey configuration, and live-agent tooling in the inbox context panel.

## Status

`partial` — Core CRUD, hosted collection, agent config, and live-agent context panel implemented. Inline WhatsApp delivery depends on messaging provider; dashboard KPI widgets are phase 2.

## Source of truth

- [components/app-sidebar.tsx](../../components/app-sidebar.tsx)
- [components/customer-interaction/](../../components/customer-interaction/)
- [components/inbox/context-panel.tsx](../../components/inbox/context-panel.tsx)
- [components/server-actions/surveys.ts](../../components/server-actions/surveys.ts)
- [lib/firebase/services/survey-service.ts](../../lib/firebase/services/survey-service.ts)
- [lib/survey/inline-survey-flow.ts](../../lib/survey/inline-survey-flow.ts)
- [lib/firebase/services/ai-agent-service.ts](../../lib/firebase/services/ai-agent-service.ts)
- [lib/firebase/ai/prompt-context.ts](../../lib/firebase/ai/prompt-context.ts)

---

## 1. Sidebar: Customer Interaction

Renamed from "AI Interaction" (`AppSidebar.sections.customerInteraction`).

| Item | Route |
|------|-------|
| AI Agents | `/ai-agents` |
| Quick Answers | `/quick-answers` |
| Templates | `/templates` |
| Surveys | `/surveys` |
| Campaigns | `/campaigns` |

---

## 2. Surveys

### Data model

**`companies/{companyId}/surveys/{surveyId}`**

| Field | Type |
|-------|------|
| name, slug | string |
| description | string? |
| deliveryMode | `inline` \| `hosted` \| `both` |
| status | `draft` \| `active` \| `archived` |
| questions | embedded array |
| introMessage, thankYouMessage | string? |
| metricsConfig | `{ showAverage, showNps, showDistribution }` |
| createdById | string |
| createdAt, updatedAt | Timestamp |

**Question types:** `rating`, `nps`, `single_choice`, `multi_choice`, `text`, `scale`

**`companies/{companyId}/surveyResponses/{responseId}`**

Tracks send/completion with `accessToken` for hosted URLs, `answers[]`, `sentByType`, `deliveryMode`, `status`.

**Conversation extension:** `activeSurveyResponseId` — inline state machine; suppresses bot auto-reply while set.

### Management UI

Route: `/[locale]/surveys` — list, builder, metrics tabs.

### Hosted public page

Route: `/[locale]/s/[token]` — public, token-scoped. Middleware allows unauthenticated access.

### Inline WhatsApp flow

1. Agent or bot calls `sendSurveyAction` with `deliveryMode: inline`
2. Conversation gets `activeSurveyResponseId`
3. Intro + Q1 sent as system/agent messages
4. Customer reply parsed by `processInlineSurveyReply`
5. On completion: thank-you message, clear active response, update `satisfactionScore` from rating/NPS

Auto-reply skipped when `activeSurveyResponseId` or `assignedToId` is set.

---

## 3. Agent survey configuration

**Agent fields:** `surveyIds: string[]`, `surveyTriggers: { onConversationClose, onEscalation, proactiveOffer, closeKeywords }`

**UI:** Third setup step "Surveys" on agent detail page with multi-select and trigger toggles.

**Prompt:** Enabled surveys and trigger rules injected via `loadCompanyAiContext` → `buildSystemPrompt`.

---

## 4. Live agent context panel

Extracted to [context-panel.tsx](../../components/inbox/context-panel.tsx).

| Section | Behavior |
|---------|----------|
| Assignment | Take over / Release via `assignedToId` |
| Customer | Existing profile fields |
| Quick replies / Templates | Insert into composer |
| Surveys | Send active surveys; in-progress chip |
| AI suggestions | Secondary when assigned to current user; hidden for other assignee |

---

## 5. Authorization

| Action | Requirement |
|--------|-------------|
| Survey CRUD | `canPost` |
| Send survey | `canPost` |
| Hosted submit | Valid `accessToken` |
| Metrics | Accepted member |

---

## 6. Implementation phases

| Phase | Status |
|-------|--------|
| A — Sidebar rename + nav | `implemented` |
| B — Firestore + CRUD + builder | `implemented` |
| C — Hosted page + metrics | `implemented` |
| D — Inline flow + parser | `implemented` (inbox-only without provider) |
| E — Agent config + prompt | `implemented` |
| F — Context panel + assignment | `implemented` |
| G — Dashboard KPIs | `open` |

---

## Related specs

- [06-data-model.md](06-data-model.md) — survey collections
- [03-routing-and-pages.md](03-routing-and-pages.md) — `/surveys`, `/s/[token]`
- [10-ai-training.md](10-ai-training.md) — agent prompt context
- [11-inbox-and-messaging.md](11-inbox-and-messaging.md) — context panel, assignment
