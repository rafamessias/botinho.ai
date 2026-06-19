# Future State — Gemini AI (Firebase AI Logic)

## Status

`completed` — implemented in current codebase (2026-06)

> **As-is reference:** [10-ai-training.md](../10-ai-training.md), [11-inbox-and-messaging.md](../11-inbox-and-messaging.md)

## What was implemented

| Planned | Actual |
|---------|--------|
| Gemini via Firebase AI Logic | ✅ [server-ai.ts](../../lib/firebase/ai/server-ai.ts) |
| `gemini-2.0-flash` for suggestions | ✅ |
| `gemini-2.0-pro` for auto-reply text | ✅ |
| Structured JSON suggestions | ✅ Zod + response schema |
| Knowledge base in prompts | ✅ [prompt-context.ts](../../lib/firebase/ai/prompt-context.ts) |
| URL summarization on write | ✅ [generate.ts](../../lib/firebase/ai/generate.ts) |
| Server-only inference | ✅ All calls from server actions |
| AI usage limits per plan | ✅ [ai-usage-service.ts](../../lib/firebase/services/ai-usage-service.ts) |
| Auto-reply on inbound webhook | ⚠️ Text generated; send blocked (no messaging provider) |
| Fallback when AI unavailable | ✅ Hardcoded suggestion strings |

## Remaining gap

Auto-reply **delivery** depends on messaging provider integration — see [03-messaging-and-email.md](03-messaging-and-email.md).

---

## Purpose (original)

Specify how botinho.ai uses **Google Gemini** via **Firebase AI Logic** for intelligent replies.

## Stack (implemented)

| Layer | Technology |
|-------|------------|
| Model access | Firebase AI Logic |
| SDK | `firebase/ai` |
| Models | gemini-2.0-flash, gemini-2.0-pro |

## Capabilities (original spec → status)

| Capability | Status |
|------------|--------|
| Suggested replies (inbox) | ✅ Implemented |
| Auto-reply bot text generation | ✅ Implemented |
| Auto-reply send on inbound | ❌ Blocked — no messaging provider |
| AI training → prompt context | ✅ Implemented |
| URL knowledge summarization | ✅ Implemented |
| Embeddings / RAG v2 | ❌ Not started |

## Open items

- [ ] Wire auto-reply send when messaging provider is chosen
- [ ] Optional: vector search for large knowledge bases
