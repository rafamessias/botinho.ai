# 10 — AI Training

## Purpose

Document the AI knowledge base, quick answers, message templates, and Gemini inference integration.

## Status

`implemented` — Firestore CRUD and Gemini inference are wired. Auto-reply send depends on messaging provider (see [09-whatsapp-integration.md](09-whatsapp-integration.md)).

## Source of truth

- [components/server-actions/ai-training.ts](../../components/server-actions/ai-training.ts)
- [components/ai-training/](../../components/ai-training/)
- [lib/firebase/services/ai-training-service.ts](../../lib/firebase/services/ai-training-service.ts)
- [lib/firebase/ai/generate.ts](../../lib/firebase/ai/generate.ts)
- [lib/firebase/ai/prompt-context.ts](../../lib/firebase/ai/prompt-context.ts)
- [lib/firebase/ai/server-ai.ts](../../lib/firebase/ai/server-ai.ts)

## UI structure

Page: `/[locale]/ai-training` → [`ai-training-page.tsx`](../../components/ai-training/ai-training-page.tsx)

Tabs:

| Tab | Section component | Data |
|-----|-------------------|------|
| Knowledge | `knowledge-section.tsx` | KnowledgeItem |
| Quick answers | `quick-answers-section.tsx` | QuickAnswer |
| Templates | `templates-section.tsx` | AiTemplate + options |

## Knowledge items

### Schema (Firestore)

| Field | Type |
|-------|------|
| type | `TEXT` \| `URL` |
| title | string |
| content | string |
| urlSummary | string? (Gemini-generated for URL type) |
| createdById | string? |

### Actions

- `createKnowledgeItemAction` — URL type triggers `summarizeUrlContent` via Gemini flash on create
- `updateKnowledgeItemAction` — re-summarizes URL on content change
- `deleteKnowledgeItemAction`

## Quick answers

Canned responses with `title` + `content`. Full CRUD via server actions.

Injected into Gemini system prompt via [`loadCompanyAiContext`](../../lib/firebase/ai/prompt-context.ts).

## AI templates

| Field | Type |
|-------|------|
| name, content | string |
| category | greeting \| orders \| products \| support \| closing |
| options | embedded array (label + value) |

Full CRUD with nested options.

## Aggregated fetch

`getAiTrainingDataAction` returns knowledge, quick answers, and templates for the active company.

## Gemini integration

### Models ([server-ai.ts](../../lib/firebase/ai/server-ai.ts))

| Use case | Model |
|----------|-------|
| Inbox suggestions | `gemini-2.0-flash` |
| Auto-reply text | `gemini-2.0-pro` |
| URL summarization | `gemini-2.0-flash` |

Configured via Firebase AI Logic (`firebase/ai` SDK). Requires `NEXT_PUBLIC_FIREBASE_*` env vars.

### Prompt context assembly

[`loadCompanyAiContext`](../../lib/firebase/ai/prompt-context.ts) builds:

| Source | Context use |
|--------|-------------|
| Company name/description | System prompt header |
| KnowledgeItem (TEXT) | Injected as bullet list |
| KnowledgeItem (URL) | Uses stored `urlSummary` |
| QuickAnswer | Few-shot Q/A lines |
| AiTemplate | Category-labeled templates |
| Recent messages | Last 12 messages in conversation |

Language detection heuristics choose `en` vs `pt-BR` for responses.

### Inbox suggestions

`getSuggestedResponsesAction` → `generateSuggestedResponses`:

- Returns 3 structured suggestions `{ id, text, category }`
- Uses Gemini structured JSON output with Zod validation
- Falls back to hardcoded strings if AI not configured or on error
- Increments `AI_RESPONSES` usage counter

### Auto-reply text generation

`generateAutoReplyText` produces a concise WhatsApp-style reply. Sending is blocked until messaging provider exists ([auto-reply.ts](../../lib/firebase/ai/auto-reply.ts)).

## Usage limits

[`ai-usage-service.ts`](../../lib/firebase/services/ai-usage-service.ts):

| Plan | AI responses / month |
|------|---------------------|
| FREE | 50 |
| STARTER | 500 |
| PRO | 2,000 |
| BUSINESS | 10,000 |
| ENTERPRISE | 100,000 |

Stored at `companies/{id}/usage/{YYYY-MM}.AI_RESPONSES`.

## Edge cases

- All operations require accepted company membership via `resolveCompanyContext`.
- Deletes are hard deletes (no soft delete).
- URL summarization runs synchronously on create/update (may add latency).
- When usage limit exceeded, `assertAiUsageAllowed` throws and suggestions fall back.

## Open questions

None for as-is documentation.
