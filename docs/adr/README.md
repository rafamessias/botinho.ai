# Architecture Decision Records (ADR)

This folder holds short records of significant architectural decisions for botinho.ai.

## When to write an ADR

Write an ADR when a decision:

- Changes how modules interact (e.g. new external service, new auth pattern)
- Is hard to reverse
- Has trade-offs worth preserving for future contributors

Do **not** write ADRs for routine feature work — update the relevant spec file instead.

## Template

Create a new file: `NNNN-short-title.md` (incrementing number).

```markdown
# NNNN. Title

Date: YYYY-MM-DD
Status: proposed | accepted | deprecated | superseded

## Context

What is the issue or forcing function?

## Decision

What was decided?

## Consequences

What becomes easier or harder as a result?
```

## Index

| ADR | Title | Status |
|-----|-------|--------|
| [0001](0001-firebase-google-stack.md) | Adopt Firebase + Gemini; messaging TBD | accepted |
