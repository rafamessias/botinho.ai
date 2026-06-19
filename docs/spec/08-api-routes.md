# 08 — API Routes

## Purpose

Document all HTTP route handlers: methods, authentication, payloads, responses, and side effects.

## Status

`implemented` (2 routes)

## Source of truth

- [app/api/](../../app/api/)

## Route summary

| Method | Path | Auth | File |
|--------|------|------|------|
| GET, POST | `/api/auth/[...nextauth]` | NextAuth | [route.ts](../../app/api/auth/[...nextauth]/route.ts) |
| POST | `/api/stripe/webhook` | Stripe signature | [route.ts](../../app/api/stripe/webhook/route.ts) |

All `/api/*` routes bypass page middleware ([middleware.ts](../../middleware.ts)).

Removed routes (legacy):

| Path | Reason removed |
|------|----------------|
| `/api/whatsapp/connection-status` | WhatsApp controller stack removed |
| `/api/webhooks/zavu` | Zavu integration removed; provider TBD |
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

## Missing routes (planned)

| Expected route | Status |
|----------------|--------|
| Messaging inbound webhook | Provider not chosen — see [future/03-messaging-and-email.md](future/03-messaging-and-email.md) |

## Edge cases

- Stripe webhook reads/writes Firestore subscription docs keyed by `companyId` in checkout metadata.
- No messaging webhook endpoints exist.

## Open questions

- Webhook path and auth will depend on chosen messaging provider.
