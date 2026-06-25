# 19 — Company & Members

## Purpose

Product rules and implementation reference for company tenancy and company-user membership, aligned with new-obraguru patterns and adapted for botinho.ai's subcollection model.

## Status

`implemented`

## Source of truth

- [lib/firebase/types.ts](../../lib/firebase/types.ts) — `FirestoreCompanyMember`
- [lib/user-workspace.ts](../../lib/user-workspace.ts) — active workspace resolution
- [lib/sync-user-workspace.ts](../../lib/sync-user-workspace.ts) — `defaultCompanyId` sync
- [lib/company-membership-guards.ts](../../lib/company-membership-guards.ts) — single-company policy
- [lib/botinho-auth.ts](../../lib/botinho-auth.ts) — server authorization
- [lib/session-company-context.ts](../../lib/session-company-context.ts) — client bootstrap
- [components/server-actions/company.ts](../../components/server-actions/company.ts)
- [lib/firebase/services/company-operations.ts](../../lib/firebase/services/company-operations.ts)

Related: [05-authorization.md](05-authorization.md), [06-data-model.md](06-data-model.md)

---

## Data model

Membership path: `companies/{companyId}/members/{uid}`

| Field | Type | Notes |
|-------|------|-------|
| uid | string | Same as doc id |
| email | string? | Set on invite for placeholder users |
| inviteToken | string? | Cleared on accept |
| isOwner | boolean | Creator; cannot be removed |
| isAdmin | boolean | Manage company and members |
| canPost | boolean | Create/send inbox and AI content |
| canApprove | boolean | Approval permission |
| status | `invited` \| `accepted` \| `rejected` | Only `accepted` can access data |

`users/{uid}.defaultCompanyId` is the **active workspace** pointer. It must always reference a valid accepted membership or be `null`.

---

## Business rules

| # | Rule |
|---|------|
| G1 | A user email belongs to **at most one company** (status `invited` or `accepted`) |
| G2 | `defaultCompanyId` must point to a valid accepted membership (or `null` if none) |
| G3 | Invite and confirm flows enforce G1 |
| G4 | Only `isAdmin` or `isOwner` can invite, edit permissions, remove members |
| G5 | Owner cannot be removed; company deletion remains disabled |
| G6 | Localized errors in `en` and `pt-BR` |

### Workspace resolution order

1. `users.defaultCompanyId` if it matches an accepted membership
2. Company where user is `isOwner`
3. First accepted membership

After membership changes (invite accept, member removal), call `syncUserWorkspace(uid)` to recompute `defaultCompanyId`.

---

## Authorization

Server actions use `getBotinhoSession()` and `resolveCompanyContext()` from [lib/botinho-auth.ts](../../lib/botinho-auth.ts).

| Mode | Requires |
|------|----------|
| read | Accepted membership |
| write | `isAdmin` or `canPost` |
| manage | `isOwner` or `isAdmin` |

Client `hasPermission()` in `UserProvider` is UI-only; server re-validates on every mutation.

---

## Invite flow

1. Admin calls `inviteMemberAction`
2. `assertNoMembershipOutsideCompany` rejects users with membership on another company
3. Creates or finds Firebase Auth user + `members/{uid}` with `status: invited`
4. Email link: `/{locale}/sign-up/confirm?token=…&companyId=…`
5. `confirmEmailAction` → `acceptCompanyInvite` → `syncUserWorkspace`

Admins can `resendMemberInviteAction` for members with `status: invited`.

---

## Firestore security

- Default: deny-all client access (Admin SDK only)
- Exception: inbox realtime listeners on `companies/{companyId}/conversations/**` for accepted members

See [firestore.rules](../../firestore.rules) and collection-group indexes in [firestore.indexes.json](../../firestore.indexes.json).

---

## i18n keys

| Key | When |
|-----|------|
| `Company.messages.inviteCompanyUserConflict` | Invite to second company |
| `AuthErrors.inviteCompanyConflict` | Confirm invite with existing other-company membership |
| `Company.messages.inviteResent` | Resend invite success |
| `Company.messages.inviteResendFailed` | Resend invite failure |
| `Company.messages.alreadyHasCompany` | Create company when user already has one |

---

## Out of scope

- Multi-company per user
- Project guest / external user accounts
- Platform admin company management UI
