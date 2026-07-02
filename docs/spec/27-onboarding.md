# 27 — Onboarding

## Purpose

Document the post-signup onboarding wizard for new account owners.

## Status

`implemented`

## Source of truth

- [components/server-actions/onboarding.ts](../../components/server-actions/onboarding.ts)
- [lib/onboarding/](../../lib/onboarding/)
- [app/[locale]/onboarding/](../../app/[locale]/onboarding/)
- [components/onboarding/](../../components/onboarding/)

## Overview

New customers complete a 4-step wizard after signup before using the product. Invited company members are exempt.

| Step | Route | Required | Skippable |
|------|-------|----------|-----------|
| 1 Create company | `/onboarding/company` | Yes | No |
| 2 Sync WhatsApp | `/onboarding/whatsapp` | No | Yes |
| 3 Create Botinho | `/onboarding/bot` | No | Yes |
| 4 Select plan | `/onboarding/plan` | Yes (FREE valid) | No |

## Access control

Users with `onboardingStatus === "pending"` are blocked from all product routes and company-scoped server actions until step 4 completes.

**Exemption:** Users accepting a company invite (`/sign-up/confirm?companyId=…`) are marked `onboardingStatus: "completed"` immediately.

Enforcement layers:

1. `enforceAppAccess()` on protected server pages
2. `OnboardingRedirectGuard` client component (root layout)
3. `resolveCompanyContext()` throws `ONBOARDING_REQUIRED`
4. `resolvePostLoginRedirectPath()` routes to current onboarding step

## Data model

Extended `FirestoreUser`:

- `onboardingStatus`: `"pending" | "completed"`
- `onboardingStep`: `1 | 2 | 3 | 4`
- `onboardingCompletedAt`: Timestamp
- `preferredPlanType`: string (from signup `?plan=` param)

Legacy users with `defaultCompanyId` and no `onboardingStatus` are treated as completed.

## Signup changes

- OTP/Google verify creates user profile only (no auto-company)
- Email confirm path provisions profile with pending onboarding
- Invite accept sets `onboardingStatus: "completed"`

## Plan selection

- **FREE:** marks onboarding complete, redirects to dashboard
- **Paid:** sets subscription `pending`, redirects to Stripe Checkout immediately
- **Stripe success:** `/onboarding/plan?checkout=success` completes onboarding
- **Stripe cancel:** reverts to FREE, stays on plan step

## Migration

Run [lib/onboarding/backfill-onboarding-status.ts](../../lib/onboarding/backfill-onboarding-status.ts) before production deploy.

## Related specs

- [04-authentication.md](04-authentication.md)
- [03-routing-and-pages.md](03-routing-and-pages.md)
- [12-subscription-and-billing.md](12-subscription-and-billing.md)
- [09-whatsapp-integration.md](09-whatsapp-integration.md)
