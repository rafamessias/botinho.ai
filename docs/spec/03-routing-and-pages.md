# 03 — Routing and Pages

## Purpose

Document all application routes, layout hierarchy, and middleware protection rules.

## Status

`implemented`

## Source of truth

- [middleware.ts](../../middleware.ts)
- [app/layout.tsx](../../app/layout.tsx)
- [app/[locale]/layout.tsx](../../app/[locale]/layout.tsx)
- [i18n/routing.ts](../../i18n/routing.ts)

## Locale strategy

- Supported locales: `en`, `pt-BR` (default: `en`)
- URLs are prefixed: `/en/dashboard`, `/pt-BR/inbox`
- Paths without a locale prefix are redirected to `/{defaultLocale}{path}`

Non-localized routes: none (WhatsApp QR page removed).

## Layout hierarchy

```
app/layout.tsx                    # Root: fonts, ThemeProvider, SessionProvider, UserProvider, Analytics
└── app/[locale]/layout.tsx       # next-intl provider
    ├── Public pages (no sidebar)
    └── Authenticated pages       # AppSidebar + SiteHeader shell
```

Root layout providers: [`app/layout.tsx`](../../app/layout.tsx)

## Route catalog

### Public routes (no auth required)

| Path | Page file | Description |
|------|-----------|-------------|
| `/[locale]/` | `app/[locale]/page.tsx` | Marketing landing |
| `/[locale]/sign-in` | `app/[locale]/sign-in/page.tsx` | Sign in |
| `/[locale]/sign-up` | `app/[locale]/sign-up/page.tsx` | Sign up |
| `/[locale]/sign-up/check-email` | `app/[locale]/sign-up/check-email/page.tsx` | Post-registration email notice |
| `/[locale]/sign-up/confirm` | `app/[locale]/sign-up/confirm/page.tsx` | Email/invite token confirmation |
| `/[locale]/sign-up/otp` | `app/[locale]/sign-up/otp/page.tsx` | OTP verification |
| `/[locale]/reset-password` | `app/[locale]/reset-password/page.tsx` | Request reset |
| `/[locale]/reset-password/confirm` | `app/[locale]/reset-password/confirm/page.tsx` | Set new password |

### Protected routes (auth required)

| Path | Page file | Feature component |
|------|-----------|-------------------|
| `/[locale]/dashboard` | `app/[locale]/dashboard/page.tsx` | `components/dashboard/dashboard-page.tsx` |
| `/[locale]/inbox` | `app/[locale]/inbox/page.tsx` | `components/inbox/inbox-page.tsx` |
| `/[locale]/customer` | `app/[locale]/customer/page.tsx` | `components/customer/customer-page.tsx` |
| `/[locale]/ai-training` | `app/[locale]/ai-training/page.tsx` | `components/ai-training/ai-training-page.tsx` |
| `/[locale]/company` | `app/[locale]/company/page.tsx` | `components/company/company-dashboard.tsx` |
| `/[locale]/settings` | `app/[locale]/settings/page.tsx` | `components/settings/settings-page.tsx` |
| `/[locale]/account` | `app/[locale]/account/page.tsx` | `components/account/profile-form.tsx` |
| `/[locale]/subscription` | `app/[locale]/subscription/page.tsx` | `components/subscription/subscription-page.tsx` |
| `/[locale]/support` | `app/[locale]/support/page.tsx` | `components/support/contact-section.tsx` |

### Special routes

| Path | Auth | Notes |
|------|------|-------|
| `/[locale]/auth/post-login` | Session | OAuth redirect handler |
| `/[locale]/auth/error` | Public | Auth error page |
| `/[locale]/[...rest]` | — | Catch-all → `notFound()` |
| `/api/*` | Per-route | Bypasses page middleware |

## Middleware behavior

File: [`middleware.ts`](../../middleware.ts)

### Skipped paths (no auth/locale processing beyond passthrough)

- `/api/*`
- `/_next/*`
- Static assets (favicon, manifest, images, fonts, etc.)
- WebSocket upgrade requests

### Auth detection

Session cookie names checked:

- `next-auth.session-token` (development)
- `__Secure-next-auth.session-token` (production)

### Redirect rules

| Condition | Action |
|-----------|--------|
| No locale in path | Redirect to `/{defaultLocale}{path}` |
| Unauthenticated + protected route | Redirect to `/{locale}/sign-in?redirect={path}` |
| Authenticated + auth page (except landing) | Redirect to `/{userLocale}/dashboard` |
| Authenticated + `?redirect=` or `oauth_redirect` cookie | Redirect to target with locale normalization |
| Authenticated + wrong locale vs `user-language` cookie | Redirect to preferred locale |

### Public route list

Built from locales × paths: sign-in, sign-up, reset-password, confirm, check-email, otp, landing roots.

**Note:** `/sign-up/confirm` always passes through (allows token confirmation while logged out).

## Middleware matcher

```typescript
['/(en|pt-BR)/:path*', '/', '/sign-in', '/sign-up', ...]
```

## Known routing issues

| Issue | Status |
|-------|--------|
| Landing links to `/register` | Route does not exist; use `/sign-up` |
| `middleware.ts` lists `/reset-password/new` | No matching page in repo |
| `middleware.ts` lists `/auth/google/callback` | OAuth handled by NextAuth default paths |

## Edge cases

- Locale root (`/en`, `/pt-BR`) is public even when authenticated (landing accessible).
- Sign-up confirm path bypasses authenticated-user redirect logic.

## Open questions

None for as-is documentation.
