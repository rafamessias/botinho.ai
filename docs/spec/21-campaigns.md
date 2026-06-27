# 21 — Campaigns

## Purpose

Document outbound WhatsApp campaigns: templated messages with variable substitution, tag-based audience (OR + valid phone), throttled delivery, per-campaign metrics, and AI agent binding for replies.

## Status

`implemented` — Core CRUD, audience resolution, cron delivery, metrics, and campaign-bound auto-reply.

## Source of truth

- [components/customer-interaction/campaigns-page.tsx](../../components/customer-interaction/campaigns-page.tsx)
- [components/server-actions/campaigns.ts](../../components/server-actions/campaigns.ts)
- [lib/firebase/services/campaign-service.ts](../../lib/firebase/services/campaign-service.ts)
- [lib/campaign/campaign-delivery.ts](../../lib/campaign/campaign-delivery.ts)
- [lib/campaign/message-variables.ts](../../lib/campaign/message-variables.ts)
- [app/api/cron/process-campaigns/route.ts](../../app/api/cron/process-campaigns/route.ts)

---

## 1. Sidebar

| Item | Route |
|------|-------|
| Campaigns | `/campaigns` |

Under Customer Interaction group in [app-sidebar.tsx](../../components/app-sidebar.tsx).

---

## 2. Audience targeting

**Include:** customers matching **any selected tag (OR)** with a **valid phone number**.

**Exclude at resolution:** missing or invalid phone (`normalizeStoredPhone` + `isValidPhoneLength`, min 10 digits).

Preview shows **matched by tags** vs **eligible (valid phone)**.

**Send-time failures:** `no_session`, `outside_window`, `delivery_failed`.

---

## 3. Data model

**`companies/{companyId}/campaigns/{campaignId}`**

| Field | Type |
|-------|------|
| name, description | string |
| status | `draft` \| `scheduled` \| `running` \| `paused` \| `completed` \| `cancelled` |
| messageTemplate | string with `{{variables}}` |
| targetTags | string[] |
| targetCustomerStatus | `active` \| `prospect` \| `inactive` |
| agentId, sessionId | string? |
| schedule | `{ startAt?, messagesPerInterval, intervalMinutes }` |
| runtime | `{ lastBatchAt?, sentInCurrentInterval }` |
| metrics | denormalized counters |
| createdById | string |
| startedAt, completedAt | Timestamp? |

**`companies/{companyId}/campaignDeliveries/{deliveryId}`**

Per-recipient send tracking with status lifecycle and failure reasons.

**Conversation extension:** `activeCampaignId`, `activeCampaignDeliveryId` — reply routing and response metrics.

---

## 4. Message variables

| Token | Source |
|-------|--------|
| `{{customer.name}}` | customer name |
| `{{customer.firstName}}` | first word of name |
| `{{customer.phone}}` | phone |
| `{{customer.email}}` | email |
| `{{customer.company}}` | company field |
| `{{company.name}}` | company doc |

---

## 5. Delivery

1. `launchCampaignAction` resolves audience → creates delivery docs → **processes first batch immediately**
2. **Google Cloud Scheduler** hits `/api/cron/process-campaigns` every 2 min for throttled batches and scheduled starts (see [22-scheduled-jobs.md](22-scheduled-jobs.md))
3. Throttle: up to `messagesPerInterval` per `intervalMinutes`
4. `sendOutbound` delivers via WhatsApp; sets conversation campaign flags

**Local dev:** Cron does not run automatically — launch/resume trigger immediate send; use manual `curl` for retries (see spec 22).

---

## 6. AI agent binding

When `conversation.activeCampaignId` is set, inbound replies:

1. Increment campaign `responses` metric
2. Auto-reply via `campaign.agentId` (if agent `autoReply` enabled)
3. Increment `botReplies` on successful bot send

Priority: campaign agent → session agent → company default.

---

## 7. Authorization

| Action | Requirement |
|--------|-------------|
| Campaign CRUD / launch | `canPost` |
| Preview / metrics | accepted member |
| Cron | `CRON_SECRET` (Google Cloud Scheduler) |

---

## Related specs

- [06-data-model.md](06-data-model.md) — campaign collections
- [11-inbox-and-messaging.md](11-inbox-and-messaging.md) — sendOutbound
- [20-customer-interaction-surveys-and-live-agents.md](20-customer-interaction-surveys-and-live-agents.md) — sibling module pattern
- [22-scheduled-jobs.md](22-scheduled-jobs.md) — Cloud Scheduler cron setup
