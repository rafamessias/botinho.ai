# Future — Messaging and Email Integration

## Purpose

Define requirements and integration points for the **messaging and email provider** that is not yet chosen. Replaces prior Zavu-specific spec.

## Status

`open` — provider selection pending

## Current state

| Capability | Implementation |
|------------|----------------|
| Email send | [lib/email/send-transactional-email.ts](../../lib/email/send-transactional-email.ts) — dev console stub |
| Email templates | [lib/email/email-messages.ts](../../lib/email/email-messages.ts) — plain text builders |
| Inbox outbound | [sendInboxMessageAction](../../components/server-actions/inbox.ts) — Firestore only |
| Inbox inbound | [recordInboundMessage](../../lib/firebase/services/inbox-service.ts) — no webhook |
| Auto-reply | [auto-reply.ts](../../lib/firebase/ai/auto-reply.ts) — generates text, does not send |
| Settings | Placeholder UI in [settings-page.tsx](../../components/settings/settings-page.tsx) |

## Requirements

### WhatsApp

- [ ] Business account onboarding (Meta embedded signup or equivalent)
- [ ] Send text messages from agent replies (`sendInboxMessageAction`)
- [ ] Receive inbound messages via webhook
- [ ] Delivery/read status updates on `InboxMessage.status`
- [ ] Per-company sender identity (multi-tenant)
- [ ] Optional SMS fallback when `CompanySettings.smsFallbackEnabled === true`

### Email

- [ ] OTP sign-up emails (`OTP_ENABLED=TRUE`)
- [ ] Email confirmation links (non-OTP path)
- [ ] Password reset link delivery
- [ ] Company member invitations
- [ ] Welcome email (Google OAuth)
- [ ] Contact form to support address
- [ ] Locale-aware subjects (en / pt-BR)

### Non-functional

- [ ] Webhook signature verification
- [ ] Idempotent inbound message handling (dedupe by provider message id)
- [ ] Server-side only for API keys
- [ ] Store external message id on inbox messages for status correlation

## Integration points (code to wire)

| File | Change needed |
|------|---------------|
| `lib/email/send-transactional-email.ts` | Replace stub with provider SDK/API |
| `components/server-actions/inbox.ts` | Call provider after `createInboxMessage` for agent sends |
| `app/api/webhooks/{provider}/route.ts` | New route for inbound + status events |
| `lib/firebase/services/inbox-service.ts` | Add `externalMessageId` field + lookup helper |
| `lib/firebase/ai/auto-reply.ts` | Send generated reply via provider |
| `components/settings/settings-page.tsx` | Replace placeholder with connection UI |
| `.env.example` | Add provider env vars |

## Evaluated and removed

| Provider | Outcome |
|----------|---------|
| Custom WhatsApp controller + WebSocket | Removed — operational burden |
| Resend + React Email | Removed with Prisma migration |
| Zavu (`@zavudev/sdk`) | Integrated then removed — provider decision reopened |

## Provider evaluation criteria

| Criterion | Weight |
|-----------|--------|
| WhatsApp Business API support (Brazil) | Required |
| Transactional email | Required |
| Multi-tenant / sub-account model | High |
| Webhook reliability + delivery status | High |
| Pricing at SMB scale | Medium |
| SDK quality (TypeScript) | Medium |
| SMS fallback | Nice to have |

## Candidate providers (not decided)

Examples to evaluate — **no decision made**:

- Meta WhatsApp Cloud API + separate email (Resend, SendGrid, SES)
- Twilio (WhatsApp + SMS + SendGrid email)
- MessageBird / Sinch
- Other unified messaging APIs

## Suggested implementation phases

### Phase 1 — Email only

Wire `sendTransactionalEmail` to unblock production sign-up and invites. Lowest risk, unblocks auth flows.

### Phase 2 — WhatsApp outbound

Connect sender; wire `sendInboxMessageAction` and test delivery.

### Phase 3 — WhatsApp inbound + auto-reply

Webhook route → `recordInboundMessage` → optional `sendAutoReplyForInboundMessage`.

### Phase 4 — Settings UI + onboarding

Company admin can connect WhatsApp; store sender credentials in Firestore (encrypted).

## Exit criteria

- [ ] End-to-end WhatsApp conversation (customer → inbox → agent reply → customer)
- [ ] All transactional emails deliver in production
- [ ] Auto-reply sends when enabled
- [ ] Delivery status reflected in inbox UI
- [ ] Provider env vars documented in [16-environment-and-config.md](../16-environment-and-config.md)

## Open questions

- Single provider vs best-of-breed (WhatsApp + email separate)?
- Meta Cloud API direct vs BSP?
- Per-company sender vs platform-level sender with routing?
