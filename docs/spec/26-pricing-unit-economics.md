# 26 — Pricing Unit Economics

## Purpose

Document subscription pricing based on **unit COGS** (Firebase + Gemini + WhatsApp infra + Stripe), with two billable dimensions and a **65%+ net margin** target on paid tiers at full included usage.

## Status

`implemented` — catalog, metering, UI, and Stripe dual-currency hooks.

## Source of truth

- [lib/plan-catalog.ts](../../lib/plan-catalog.ts) — plan limits, BRL/USD prices, feature flags
- [lib/plan-limits.ts](../../lib/plan-limits.ts) — derived limits per `PlanType`
- [lib/firebase/services/subscription-service.ts](../../lib/firebase/services/subscription-service.ts) — Firestore plan seed + Stripe price mapping
- [lib/firebase/services/ai-usage-service.ts](../../lib/firebase/services/ai-usage-service.ts) — weighted AI credits
- [lib/firebase/services/synced-numbers-service.ts](../../lib/firebase/services/synced-numbers-service.ts) — WhatsApp seat limits
- [components/pricing/plan-pricing-cards.tsx](../../components/pricing/plan-pricing-cards.tsx) — shared landing + upgrade UI

Cross-link: [12-subscription-and-billing.md](12-subscription-and-billing.md)

## Billable units

### Synced number (monthly seat)

One active WhatsApp session for the company (not `disconnected`). Enforced when creating a new session in [components/server-actions/whatsapp.ts](../../components/server-actions/whatsapp.ts).

### AI credit (weighted)

| Action | Credits |
|--------|---------|
| Botinho auto-reply | 1.0 |
| Inbox suggestion request (3 suggestions) | 0.25 |
| URL knowledge summary | 0 (free) |

Stored in Firestore as **integer tenths** (`AI_CREDITS_TENTHS`). Legacy `AI_RESPONSES` is migrated on read (×10).

## Plan matrix (2026)

| Plan | BRL/mo | USD/mo | Numbers | AI credits/mo |
|------|--------|--------|---------|---------------|
| Free | R$0 | $0 | 1 | 40 |
| Starter | R$79 | $15 | 1 | 400 |
| Pro | R$179 | $29 | 3 | 1,500 |
| Business | R$499 | $79 | 8 | 5,000 |

Yearly = 10× monthly price (~17% discount).

## Margin model

Conservative COGS inputs (see plan brainstorm):

- Synced number: **R$8/mo**
- Auto-reply credit: **R$0.02**
- Stripe BRL: **~4.69% + R$0.39**

At 100% credit usage as auto-replies + full number seats, Starter/Pro/Business target **≥65% net margin**.

## Stripe

- BRL price IDs: `STRIPE_PRICE_{TIER}_MONTHLY|YEARLY`
- USD price IDs: `STRIPE_PRICE_{TIER}_MONTHLY_USD|YEARLY_USD`
- Checkout currency from locale (`pt*` → BRL, else USD) with fallback to the other currency if price ID missing

## UI

- Landing `#pricing`: [components/pricing/landing-pricing-section.tsx](../../components/pricing/landing-pricing-section.tsx)
- Upgrade modal: [components/subscription/upgrade-modal-plans.tsx](../../components/subscription/upgrade-modal-plans.tsx)
- Subscription usage: AI credits + synced numbers meters

## Open questions

- Phase 2: Stripe Billing Meters for overage (extra numbers, credit packs)
- Quarterly COGS review + price rebalance (`PLAN_COGS_VERSION`)
