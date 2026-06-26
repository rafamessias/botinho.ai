# botinho.ai — WhatsApp AI Automation Platform

<div align="center">
  <img src="public/bot-green.svg" alt="botinho.ai Logo" width="120" height="120" />

  <h3>Your friendly WhatsApp assistant — powered by AI</h3>

  <p>Automate customer support and never miss a message. Built for restaurants, shops, and service businesses.</p>

  [![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.2.0-blue)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
  [![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28)](https://firebase.google.com/)
  [![Stripe](https://img.shields.io/badge/Stripe-18.5.0-635BFF)](https://stripe.com/)
</div>

## Overview

**botinho.ai** helps businesses automate WhatsApp customer support with AI-powered conversations trained on business-specific knowledge.

### Key features

- AI-powered responses via Gemini (Firebase AI Logic)
- Knowledge base, quick answers, and message templates
- Unified inbox with Firestore real-time updates
- Company/team collaboration with role-based access
- Stripe subscription billing with AI usage limits

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn/ui |
| Auth | Firebase Authentication + NextAuth JWT bridge |
| Database | Cloud Firestore |
| AI | Gemini via Firebase AI Logic |
| Billing | Stripe |
| WhatsApp | whatsmeow worker in `services/whatsapp-worker/` + orchestration in `lib/whatsapp/` |
| i18n | next-intl (English, Brazilian Portuguese) |

**Partial:** Production transactional email (dev console stub).

## Documentation

Spec-driven development — see [`docs/spec/00-index.md`](docs/spec/00-index.md).

| Resource | Description |
|----------|-------------|
| [docs/spec/00-index.md](docs/spec/00-index.md) | As-is spec index |
| [docs/spec/future/00-roadmap.md](docs/spec/future/00-roadmap.md) | Remaining roadmap |
| [STRIPE_SETUP.md](STRIPE_SETUP.md) | Stripe integration |
| [docs/adr/](docs/adr/) | Architecture decision records |

## Getting started

### Prerequisites

- Node.js 18+
- Firebase project (Auth, Firestore, AI Logic enabled)
- Stripe account (for paid plans)

### Installation

```bash
git clone https://github.com/your-username/botinho.ai.git
cd botinho.ai
npm install
cp .env.example .env.local
```

Configure `.env.local` — see `.env.example` for required variables:

- Firebase client + admin service account JSON
- `AUTH_SECRET`, Google OAuth credentials
- Stripe keys (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, etc.)
- `NEXT_PUBLIC_APP_URL`
- WhatsApp: `REDIS_URL`, `WORKER_INTERNAL_TOKEN`, `WHATSAPP_WEBHOOK_SECRET`

### Run the app

```bash
# Optional — Redis + WhatsApp worker (required for Settings → WhatsApp pairing)
npm run dev:infra

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev          # Development (Turbopack)
npm run dev:infra    # Docker: Redis + WhatsApp worker
npm run dev:worker   # Run Go worker on host (needs Redis)
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run type-check   # TypeScript
npm run check        # Lint + type-check
```

## Project structure

```
botinho.ai/
├── app/                        # Next.js App Router (pages, API routes)
├── components/                 # React components + server actions
├── lib/
│   ├── whatsapp/               # Session orchestrator (replaces Go Manager)
│   └── firebase/               # Firestore, auth, AI
├── services/whatsapp-worker/   # Go whatsmeow worker
├── i18n/messages/              # Translations (en, pt-BR)
├── docs/spec/                  # Product specification
└── public/                     # Static assets
```

## Deployment

**Primary:** Vercel — connect repo, set env vars, deploy on push to `main`.

Multi-region config in [`vercel.json`](vercel.json).

## Support

- Email: hello@botinho.ai
- Website: [botinho.ai](https://botinho.ai)

---

Built by Rafael Messias
