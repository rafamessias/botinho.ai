# 0001. Adopt Firebase and Gemini; messaging provider TBD

Date: 2026-06-18 (updated 2026-06-19)  
Status: accepted

## Context

botinho.ai originally ran on Prisma/PostgreSQL, NextAuth, Resend, and a custom WhatsApp controller with no production LLM integration. The product goal is a WhatsApp AI automation SaaS on a cohesive, production-ready stack.

Three migrations were planned:

1. Replace PostgreSQL/NextAuth with **Firebase** (Firestore + Firebase Auth) — **done**
2. Replace unused OpenAI placeholder with **Google Gemini** via Firebase AI Logic — **done**
3. Replace Resend + custom WhatsApp infrastructure with a unified messaging API — **Zavu was evaluated and removed**; provider selection reopened

## Decision

Adopt the **Google Firebase + Gemini** stack for data, auth, and AI:

- **Firebase Authentication** for user identity (email/password, Google OAuth)
- **Cloud Firestore** for all application data
- **Firebase AI Logic (Gemini)** for suggestions, auto-reply text, and URL summarization
- **NextAuth v5 JWT bridge** retained for session cookies and middleware (hybrid with Firebase Auth)
- **Stripe** retained for subscription billing
- **Messaging and transactional email** — provider not yet chosen; stub in `lib/email/`; inbox is Firestore-only

Zavu was integrated then removed (2026-06-19) pending a new provider evaluation.

### Locked implementation choices

| Area | Choice |
|------|--------|
| Stripe webhook | `/api/stripe/webhook` |
| Firestore | Company-scoped subcollections |
| SMS fallback | Per-company opt-in, default off (inactive until provider exists) |
| OTP sign-up | Email OTP via custom flow; email delivery pending provider |
| Company IDs | Firestore auto-ID internally; unique **slug** for URLs |
| Gemini inference | Server-only; flash for suggestions, pro for auto-reply |
| URL knowledge | Summarize on write via Gemini flash |
| Real-time inbox | Firestore `onSnapshot` listeners |
| Deployment | Vercel (Firebase App Hosting planned) |

## Consequences

### Positive

- Single vendor alignment for auth, database, and AI (Google)
- Removes Prisma, PostgreSQL, custom WS server, and WhatsApp controller maintenance
- Gemini-powered suggestions use actual training data
- Firestore realtime replaces custom WebSocket infrastructure

### Negative

- Messaging and production email are not functional until a provider is chosen
- Hybrid NextAuth + Firebase Auth adds complexity vs pure Firebase sessions
- Firestore security rules not yet in repository
- Sign-up/invite emails fail silently in production without email provider

### Neutral

- As-is specs under `docs/spec/` now reflect current Firebase stack
- Future roadmap tracks remaining messaging/email work

## Supersedes

Original ADR text referenced Zavu as the chosen messaging provider. That portion is superseded by the removal of Zavu and the open provider evaluation documented in [docs/spec/future/03-messaging-and-email.md](../spec/future/03-messaging-and-email.md).
