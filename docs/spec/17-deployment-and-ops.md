# 17 — Deployment and Operations

## Purpose

Document deployment target, monitoring, and operational procedures.

## Status

`partial` — no CI/CD or automated tests; deploy via Firebase App Hosting or self-hosted Node.

## Source of truth

- [readme.md](../../readme.md)
- [app/layout.tsx](../../app/layout.tsx)

## Deployment platform

**Primary: Firebase App Hosting** (per ADR 0001), or any Node.js host running `next start`.

### Not configured

- Docker / docker-compose
- Kubernetes manifests
- GitHub Actions / CI pipelines
- Pre-commit hooks (Husky, lint-staged)
- Firestore security rules deployment in repo

## Build and release

```bash
npm run build   # next build (ignores lint/TS errors)
npm run start   # production server
npm run check   # local quality gate (lint + type-check)
```

No automated gate before deploy in repository.

## External services (runtime dependencies)

| Service | Required for |
|---------|--------------|
| Cloud Firestore | All application data |
| Firebase Authentication | User identity |
| Firebase AI Logic (Gemini) | AI suggestions, auto-reply text, URL summaries |
| Stripe | Billing |
| Email provider | **Not connected** — sign-up/invite emails fail silently in prod |
| Messaging provider | **Not connected** — WhatsApp send/receive |

## Environment setup checklist

1. Copy `.env.example` → `.env`
2. Configure Firebase project + service account JSON
3. Enable Firebase AI Logic in console
4. Configure Stripe keys and webhook endpoint
5. Set `AUTH_SECRET`, Google OAuth credentials
6. Set `SUPPORT_EMAIL` for contact form delivery (when email provider connected)
7. *(Future)* Configure messaging + email provider

## Monitoring

- Server errors logged via `console.error` in server actions and API routes
- No Sentry/Datadog integration in repo

## Edge cases

- Build ignores TypeScript and ESLint errors — run `npm run check` locally before deploy.
- Firebase Admin SDK requires valid `FIREBASE_SERVICE_ACCOUNT_JSON` at runtime.

## Open questions

- App Hosting rollout timeline and environment/secrets setup.
