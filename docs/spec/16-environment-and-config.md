# 16 — Environment and Config

## Purpose

Document all environment variables, config files, and discrepancies between `.env.example` and actual code usage.

## Status

`implemented`

## Source of truth

- [.env.example](../../.env.example)
- Code references via `process.env.*`
- [next.config.mjs](../../next.config.mjs)
- [components.json](../../components.json)
- [tsconfig.json](../../tsconfig.json)

## Environment variables

### Core application

| Variable | Required | Purpose |
|----------|----------|---------|
| `NODE_ENV` | Yes | development / production |
| `NEXT_PUBLIC_APP_URL` | Yes | Public app URL, Stripe redirects, email links |
| `HOST` | No | Fallback base URL |
| `SUPPORT_EMAIL` | No | Contact form destination (default `hello@botinho.ai`) |
| `OTP_ENABLED` | No | `"TRUE"` enables OTP sign-up (default in example) |

### Firebase (client — public)

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | Firebase client + AI Logic |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes | Auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes | Project id |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes | Storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes | FCM sender id |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes | App id |

### Firebase (server)

| Variable | Required | Purpose |
|----------|----------|---------|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Yes | Admin SDK credentials (JSON string, one line) |

### Auth (NextAuth + Google OAuth)

| Variable | Required | Purpose |
|----------|----------|---------|
| `AUTH_SECRET` | Yes | NextAuth JWT secret |
| `AUTH_GOOGLE_ID` | For Google | OAuth client id |
| `AUTH_GOOGLE_SECRET` | For Google | OAuth client secret |

### Stripe

| Variable | Required | Purpose |
|----------|----------|---------|
| `STRIPE_SECRET_KEY` | Yes | Stripe server SDK |
| `STRIPE_WEBHOOK_SECRET` | Yes | Webhook signature |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe client-side |
| `STRIPE_PUBLISHABLE_KEY` | **No** | Legacy name in .env.example — use `NEXT_PUBLIC_` prefix |
| `STRIPE_PRODUCT_*`, `STRIPE_PRICE_*` | Optional | Plan price IDs — see STRIPE_SETUP.md |

### Scheduled jobs (Google Cloud Scheduler)

| Variable | Required | Purpose |
|----------|----------|---------|
| `CRON_SECRET` | Prod | Bearer token for `/api/cron/*` — see [22-scheduled-jobs.md](22-scheduled-jobs.md) |

In development, cron routes allow unauthenticated access when `CRON_SECRET` is unset.

### WhatsApp worker

| Variable | Required | Purpose |
|----------|----------|---------|
| `REDIS_URL` | Yes | Session orchestration queue |
| `WORKER_INTERNAL_TOKEN` | Yes | Worker ↔ app auth |
| `WHATSAPP_WEBHOOK_SECRET` | Yes | Inbound webhook verification |
| `WEBHOOK_APP_URL` | Local Docker | URL worker uses to POST inbound events |
| `MAX_SESSIONS_PER_WORKER` | No | Session capacity per worker |
| `SCALER_MODE` | No | `local` or cloud scaler mode |
| `WORKER_BASE_URL` | No | Worker HTTP base URL |
| `FIRESTORE_PROJECT_ID` | Prod | Worker Firestore project (optional locally) |

### Removed variables (no longer used)

| Variable | Was used for |
|----------|--------------|
| `DATABASE_URL` | Prisma / PostgreSQL |
| `RESEND_API_KEY`, `FROM_EMAIL` | Resend email |
| `OPENAI_API_KEY` | Unused placeholder |
| `WHATSAPP_CONTROLLER_URL`, `CONTROLLER_TOKEN` | Custom WhatsApp controller |
| `WS_BACKEND`, `NEXT_PUBLIC_WS_*` | WebSocket backend |
| `WHATSAPP_CONNECTION_WEBHOOK_TOKEN` | Connection status webhook |
| `ZAVUDEV_*` | Zavu messaging (removed) |

## Config files

### next.config.mjs

| Setting | Value |
|---------|-------|
| Plugins | next-intl |
| eslint.ignoreDuringBuilds | true |
| typescript.ignoreBuildErrors | true |
| images.unoptimized | true |

### tsconfig.json

- Strict mode, `@/*` → project root
- Target ESNext, moduleResolution bundler

### postcss.config.mjs

- Plugin: `@tailwindcss/postcss` (Tailwind v4)

### components.json

- shadcn new-york style, neutral base, lucide icons

## npm scripts

| Script | Command | Status |
|--------|---------|--------|
| dev | next dev --turbopack | OK |
| build | next build | OK |
| start | next start | OK |
| lint | next lint | OK (may prompt for ESLint config) |
| type-check | tsc --noEmit | OK |
| check | lint + type-check | OK |

Removed scripts: `email`, `ws:dev`, `seed:subscription-plans`.

## Edge cases

- Production session cookie may use `__Secure-next-auth.session-token` (middleware checks both).
- Build succeeds even with TypeScript and ESLint errors due to next.config overrides.
- Firebase service account JSON must be escaped as a single-line env var.
- Gemini requires Firebase AI Logic enabled in Firebase console.

## Open questions

- Email provider env vars TBD — see [future/03-messaging-and-email.md](future/03-messaging-and-email.md).
- Cloud Scheduler job IDs and regions per Firebase App Hosting backend.
