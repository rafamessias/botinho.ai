# 18 — Known Gaps and Legacy

## Purpose

Consolidated inventory of technical debt, incomplete features, and legacy code from the prior Opineeo survey product.

## Status

Living document — update when new gaps are discovered during development.

## Source of truth

Cross-references throughout `docs/spec/` and codebase exploration.

---

## Legacy: Opineeo survey product

**Status:** `resolved` (2026-06-19) — Opineeo branding, survey subscription copy, stale config, and migration docs cleaned up.

Previously removed remnants:

| Location | Was | Resolution |
|----------|-----|------------|
| readme.md | Prisma, PostgreSQL, Resend references | Rewritten for Firebase stack |
| Contact email | `contact@opineeo.com` | `SUPPORT_EMAIL` env (default `hello@botinho.ai`) |
| Subscription UI | Survey-era feature names | AI responses, API access, export, branding |
| PERIODIC_USAGE_MIGRATION.md | Survey-era usage migration | Archived to `docs/archive/` |
| `/api/cron/monthly-usage-tracking` | Deprecated Prisma cron | Route removed |
| Sign-in/sign-up pages | "Opineeo" branding | Updated to botinho.ai |

Remaining low-priority legacy (non-blocking):

| Location | Issue |
|----------|-------|
| i18n dead namespaces | `Survey`, `CreateSurvey`, `PublicSurvey` keys unused — safe to prune later |
| NavMain i18n | "Criar Pesquisa" / survey strings in pt-BR nav |

No Prisma schema or survey models remain in the codebase.

---

## Incomplete features

| Feature | Status | Detail |
|---------|--------|--------|
| WhatsApp / messaging | `stub` | No provider connected; inbox is Firestore-only |
| Production email | `stub` | Dev console fallback only ([lib/email/](../../lib/email/)) |
| Auto-reply delivery | `partial` | Gemini generates text; send blocked without provider |
| Customer CRM | `stub` | [customer-page.tsx](../../components/customer/customer-page.tsx) uses mock local state |
| Dashboard analytics | `partial` | UI exists; not all KPIs from live data |
| Inbound message webhook | `stub` | `recordInboundMessage` exists but no HTTP route |
| Firestore security rules | `implemented` | Deny-all with inbox read exception for accepted members |
| Company membership guards | `implemented` | Single-company policy — [19-company-and-members.md](19-company-and-members.md) |

---

## Removed stacks (completed migrations)

| Stack | Replaced by | Status |
|-------|-------------|--------|
| Prisma + PostgreSQL | Cloud Firestore | Removed |
| Resend + React Email | Email stub (provider TBD) | Removed |
| Custom WhatsApp controller + WebSocket | Provider TBD | Removed |
| Zavu SDK | Provider TBD | Removed |
| Rule-based inbox suggestions | Gemini | Removed |
| Opineeo survey product remnants | botinho.ai branding + AI usage billing | Removed |

---

## Missing repository artifacts

| Referenced path | Referenced by | Status |
|-----------------|---------------|--------|
| `/register` route | Landing page links (possible) | May not exist |
| ESLint config | npm run lint | No config file |
| tailwind.config.js | — | Tailwind v4 uses postcss only |
| Firestore indexes file | Collection group queries | `firestore.indexes.json` added for `members` collection group |

---

## Configuration drift

| Issue | Detail |
|-------|--------|
| Build quality gates | `ignoreBuildErrors` and `ignoreDuringBuilds` enabled |

---

## Testing and CI

| Area | Status |
|------|--------|
| Unit tests | None |
| E2E tests | None |
| Test runners | Not installed |
| CI/CD | No GitHub Actions or equivalent |
| Pre-commit hooks | None |

---

## Scalability / production risks

| Risk | Detail |
|------|--------|
| Email in production | Sign-up/invite emails silently fail without provider |
| No rate limiting | Not implemented in middleware |
| Firestore client reads | Inbox listeners bypass server action authorization layer |
| AI usage limits | Enforced in server actions only |

---

## Documentation drift

| Doc | Issue |
|-----|-------|
| future/01, future/02 | Marked completed; as-is specs now authoritative |
| future/03-zavu-messaging.md | Deleted — replaced by messaging TBD spec |

---

## Gap registry workflow

When shipping intentional partial behavior:

1. Add entry to this file with status tag
2. Link to relevant spec module
3. Update status in [01-product-overview.md](01-product-overview.md) feature matrix

When fixing a gap:

1. Remove or mark resolved here
2. Update spec status tags to `implemented`

---

## Open questions

- Messaging provider selection — blocking WhatsApp and production email.
