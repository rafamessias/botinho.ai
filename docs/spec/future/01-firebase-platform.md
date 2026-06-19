# Future State — Firebase Platform

## Status

`completed` — implemented in current codebase (2026-06)

> **As-is reference:** [02-architecture.md](../02-architecture.md), [06-data-model.md](../06-data-model.md), [04-authentication.md](../04-authentication.md)

This document is retained as the migration record. For current behavior, use the as-is specs.

## What was implemented

| Planned | Actual |
|---------|--------|
| Cloud Firestore for all data | ✅ `lib/firebase/services/*` |
| Firebase Authentication | ✅ Email/password + Google via Admin SDK |
| NextAuth replacement | ⚠️ Hybrid — NextAuth JWT bridge kept for middleware/sessions |
| Company subcollections | ✅ See [collections.ts](../../lib/firebase/collections.ts) |
| Company slugs | ✅ [slug.ts](../../lib/firebase/slug.ts) |
| Pending signup / OTP docs | ✅ `pendingSignups` collection |
| Remove Prisma/PostgreSQL | ✅ No prisma folder |
| Firestore security rules | ⚠️ Not in repo |
| Firebase App Hosting deploy | ⚠️ Still on Vercel |
| Data migration script | N/A — big-bang cutover assumed complete |

## Intentional deviations

| Original plan | Actual |
|---------------|--------|
| Full NextAuth removal | NextAuth v5 kept as JWT session layer over Firebase Auth |
| Firebase `sendEmailVerification` | Custom OTP flow preserved with email stub |
| Zavu sender on company doc | Removed — messaging TBD |

## Source of truth (historical)

Original spec sections on collection map, auth providers, and security rules remain below for reference.

---

## Purpose (original)

Specify the target data layer and authentication stack: **Firebase Authentication** + **Cloud Firestore**, replacing Prisma, PostgreSQL, and NextAuth.

## Firebase services in scope

| Service | Use |
|---------|-----|
| **Firebase Authentication** | Email/password, Google OAuth |
| **Cloud Firestore** | Primary database for all app entities |
| **Firebase App Hosting** | Deploy Next.js 15 app (planned) |
| **Firebase Admin SDK** | Server actions, webhooks, migrations |
| **Firestore Security Rules** | Client-side reads/writes with company RBAC (TODO) |

## Collection map (implemented)

See [06-data-model.md](../06-data-model.md) for the authoritative current schema.

## Authentication (implemented)

- Firebase Auth creates users; Firestore stores profiles
- NextAuth issues JWT cookies for app session
- OTP flow uses `pendingSignups` + bcrypt hashed codes
- Google OAuth provisions user + company on first login

## Open items from original spec

- [ ] Firestore security rules in repo
- [ ] Firebase App Hosting deployment
- [ ] Remove NextAuth bridge (optional future simplification)
