# 08 — API Routes

## Purpose

Document all HTTP route handlers: methods, authentication, payloads, responses, and side effects.

## Status

`implemented`

## Source of truth

- [app/api/](../../app/api/)
- [docs/spec/22-scheduled-jobs.md](22-scheduled-jobs.md) — cron scheduling on Google Cloud

## Route summary

| Method | Path | Auth | File |
|--------|------|------|------|
| GET, POST | `/api/auth/[...nextauth]` | NextAuth | [route.ts](../../app/api/auth/[...nextauth]/route.ts) |
| POST | `/api/stripe/webhook` | Stripe signature | [route.ts](../../app/api/stripe/webhook/route.ts) |
| POST | `/api/webhooks/whatsapp/inbound` | Webhook secret | [route.ts](../../app/api/webhooks/whatsapp/inbound/route.ts) |
| GET | `/api/cron/process-inbound-events` | `CRON_SECRET` | [route.ts](../../app/api/cron/process-inbound-events/route.ts) |
| GET | `/api/cron/process-outbound-pending` | `CRON_SECRET` | [route.ts](../../app/api/cron/process-outbound-pending/route.ts) |
| GET | `/api/cron/process-campaigns` | `CRON_SECRET` | [route.ts](../../app/api/cron/process-campaigns/route.ts) |

All `/api/*` routes bypass page middleware ([middleware.ts](../../middleware.ts)).

Removed routes (legacy):

| Path | Reason removed |
|------|----------------|
| `/api/whatsapp/connection-status` | WhatsApp controller stack removed |
| `/api/webhooks/zavu` | Zavu integration removed |
| `/api/cron/monthly-usage-tracking` | Deprecated Prisma-era usage cron removed |
| `/api/survey/v0` | Opineeo survey product removed |

---

## `/api/auth/[...nextauth]`

Delegates to NextAuth handlers from [app/auth.ts](../../app/auth.ts).

- Handles OAuth callbacks, session creation, sign-out
- See [04-authentication.md](04-authentication.md)

---

## `/api/stripe/webhook`

**Method:** POST  
**Auth:** Stripe webhook signature via `STRIPE_WEBHOOK_SECRET`

Uses Firestore via [subscription-service.ts](../../lib/firebase/services/subscription-service.ts).

### Handled event types

| Event | Behavior |
|-------|----------|
| `checkout.session.completed` | Activate subscription; link Stripe customer/subscription IDs |
| `customer.subscription.updated` | Update status, plan, billing interval |
| `customer.subscription.deleted` | Mark canceled |
| `invoice.payment_succeeded` | Renew period |
| `invoice.payment_failed` | Set `past_due` status |

### Status mapping

Stripe status → `SubscriptionStatus` enum.

### Error responses

| Status | Condition |
|--------|-----------|
| 400 | Invalid Stripe signature |
| 500 | Processing error |

---

## `/api/webhooks/whatsapp/inbound`

**Method:** POST  
**Auth:** `WHATSAPP_WEBHOOK_SECRET` (see [09-whatsapp-integration.md](09-whatsapp-integration.md))

Receives inbound messages from the WhatsApp worker; upserts inbound events and processes auto-reply.

---

## `/api/cron/*`

**Method:** GET  
**Auth:** `CRON_SECRET` via `Authorization: Bearer` or `x-cron-secret` header

Invoked by **Google Cloud Scheduler** in production (Firebase App Hosting). See [22-scheduled-jobs.md](22-scheduled-jobs.md).

| Path | Schedule | Purpose |
|------|----------|---------|
| `/api/cron/process-inbound-events` | Every 2 min | Retry inbound event queue |
| `/api/cron/process-outbound-pending` | Every 5 min | Retry outbound WhatsApp delivery |
| `/api/cron/process-campaigns` | Every 2 min | Campaign throttled delivery + scheduled start |

---

## Edge cases

- Stripe webhook reads/writes Firestore subscription docs keyed by `companyId` in checkout metadata.
- Cron routes allow unauthenticated access in development when `CRON_SECRET` is unset.
- WhatsApp inbound webhook requires worker + `WEBHOOK_APP_URL` in local Docker setups.

## Open questions

- Production email webhook when provider is chosen.
