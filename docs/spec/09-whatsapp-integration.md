# 09 — WhatsApp Integration

## Purpose

Document WhatsApp connectivity, session management, and message delivery.

## Status

`stub` — No messaging provider is connected. Settings UI shows a placeholder; inbox stores messages in Firestore only.

## Source of truth

- [components/settings/settings-page.tsx](../../components/settings/settings-page.tsx)
- [components/server-actions/inbox.ts](../../components/server-actions/inbox.ts)
- [lib/firebase/ai/auto-reply.ts](../../lib/firebase/ai/auto-reply.ts)

## Current state

| Capability | Status |
|------------|--------|
| WhatsApp Business connection | Not implemented |
| QR pairing | Removed |
| External controller / WebSocket | Removed |
| Outbound message delivery | Not implemented |
| Inbound message webhooks | Not implemented |
| Auto-reply delivery | Generates text via Gemini but does not send |

## Settings UI

The WhatsApp tab in Settings shows:

- Placeholder card: "WhatsApp integration is not configured yet"
- Auto-reply toggle (stored in Firestore `settings/default`)
- SMS fallback toggle (stored but inactive — no provider)

Previously integrated providers (custom WhatsApp controller, Zavu) have been removed.

## Inbox behavior (without WhatsApp)

- Agents can create conversations and send messages — stored in Firestore
- Messages do **not** reach customers on WhatsApp
- Real-time UI updates via Firestore `onSnapshot` listeners ([hooks/use-inbox-realtime.ts](../../hooks/use-inbox-realtime.ts))

## Auto-reply (partial)

When `CompanySettings.autoReply === true` and an inbound message would arrive:

1. [`generateAutoReplyText`](../../lib/firebase/ai/generate.ts) builds a Gemini reply using training context
2. [`sendAutoReplyForInboundMessage`](../../lib/firebase/ai/auto-reply.ts) currently returns `{ sent: false, reason: "messaging provider not configured" }`

Auto-reply will send once a messaging provider is integrated.

## Removed components

The following were removed from the codebase:

| Component | Was |
|-----------|-----|
| `WHATSAPP_CONTROLLER_URL`, `CONTROLLER_TOKEN` | Custom HTTP controller |
| `WS_BACKEND`, WebSocket pairing | Real-time + QR flow |
| `app/whatsapp/qr/page.tsx` | QR pairing page |
| `SessionAssignment`, `Worker` models | DB session tracking |
| `/api/whatsapp/connection-status` | Connection webhook |
| Zavu SDK + `/api/webhooks/zavu` | Unified messaging (evaluated, removed) |

## Target integration (TBD)

See [future/03-messaging-and-email.md](future/03-messaging-and-email.md) for requirements when selecting a provider.

Expected capabilities:

- WhatsApp Business onboarding (Meta embedded signup or equivalent)
- Outbound message send from `sendInboxMessageAction`
- Inbound webhook → `recordInboundMessage` + optional auto-reply
- Delivery status updates on `InboxMessage.status`
- Optional SMS fallback per company setting

## Edge cases

- Inbox works as an internal CRM/thread tool without WhatsApp connected.
- `smsFallbackEnabled` setting is persisted but has no effect.

## Open questions

- Which messaging API will be adopted? (Twilio, Meta Cloud API, MessageBird, etc.)
