# 07 — Server Actions

## Purpose

Catalog all server actions: inputs, auth requirements, side effects, and external calls.

## Status

`implemented`

## Source of truth

- [components/server-actions/](../../components/server-actions/)
- Shared utilities: [utils.ts](../../components/server-actions/utils.ts)

## Response shape

All actions use `BaseActionResponse<T>`:

```typescript
{ success: boolean; data?: T; message?: string; error?: string }
```

Errors are caught by `handleAction()` which maps `ZodError` and `Error` to `{ success: false, error }`.

## Auth (`auth.ts`)

| Action | Auth | Key behavior |
|--------|------|--------------|
| `signInAction` | Public | NextAuth credentials sign-in via Firebase Auth |
| `signUpAction` | Public | Register via Firebase Admin; pending signup + email/OTP |
| `googleSignInAction` | Public | Redirect to Google OAuth |
| `logoutAction` | Session | Sign out + redirect |
| `confirmEmailAction` | Public | Confirm token; accept company invite |
| `resendConfirmationEmailAction` | Public | Resend confirmation |
| `getCurrentUserAction` | Session | Full profile from Firestore |
| `resetPasswordAction` | Public | Firebase reset link + email stub |
| `confirmPasswordResetAction` | Public | Placeholder — Firebase link handles reset |
| `confirmOTPAction` | Public | Verify OTP → otp-session sign-in |
| `resendOTPAction` | Public | Resend OTP email |
| `createCheckoutSessionAction` | Session | Stripe checkout URL |
| `createDefaultCompanyWithFreePlan` | Internal | Company + subscription bootstrap |
| `validateUserCompanyAndSubscription` | Internal | Post-login subscription check |

## Company (`company.ts`)

| Action | Auth | Key behavior |
|--------|------|--------------|
| `createCompanyAction` | Session | Create company + owner membership |
| `updateCompanyAction` | Admin | Update name/description |
| `inviteMemberAction` | Admin | Invite by email; send invitation email (stub) |
| `updateMemberAction` | Admin | Update role flags |
| `bulkInviteMembersAction` | Admin | Batch invite |
| `removeMemberAction` | Admin | Remove member |
| `deleteCompanyAction` | — | Not allowed (returns error) |
| `getCompanyAction` | Membership | Company detail with members |
| `getUserCompaniesAction` | Session | List user's companies |
| `getUserCompaniesLightAction` | Session | Lightweight company list + subscription |
| `generateCompanyTokenAction` | Admin | Set `Company.tokenApi` |
| `regenerateCompanyTokenAction` | Admin | Replace API token |
| `getCompanyTokenAction` | Admin | Read API token |
| `updateCompanyBrandingAction` | — | No-op stub |

## User (`user.ts`)

| Action | Auth | Key behavior |
|--------|------|--------------|
| `updateUserThemeAction` | Session | Update theme + cookie |
| `updateUserProfileAction` | Session | Profile fields (Zod validated) |
| `updateUserLanguageAction` | Session | Update language + locale cookie |
| `updateUserAvatarAction` | Session | Set avatar URL |
| `getUserPreferencesAction` | Session | Read preferences |
| `updateDefaultCompanyAction` | Session | Switch default company |
| `deleteUserAccountAction` | Session | Delete account |

## Subscription (`subscription.ts`)

| Action | Auth | Key behavior |
|--------|------|--------------|
| `createCheckoutSession` | Session | Stripe checkout for planId + billingCycle |
| `createPortalSession` | Session | Stripe billing portal URL |
| `getSubscriptionStatus` | Session | Active/pending status |
| `getSubscriptionData` | Session | Plan + usage |
| `checkExportPermission` | Session | Validate export feature access |
| `handleCanceledCheckout` | Session | Revert pending subscription on checkout cancel |
| `getAvailablePlans` | Session | List active plans |

## Inbox (`inbox.ts`)

| Action | Auth | External |
|--------|------|----------|
| `getInboxConversationsAction` | Company | Firestore |
| `getInboxConversationDetailAction` | Company | Firestore |
| `createInboxConversationAction` | Company + canPost | Firestore |
| `sendInboxMessageAction` | Company + canPost | Firestore only (no messaging provider) |
| `markInboxConversationReadAction` | Company | Firestore |
| `updateInboxConversationMetadataAction` | Company | Firestore |
| `getSuggestedResponsesAction` | Company | Gemini (with fallback) |

## Settings (`settings.ts`)

| Action | Auth | External |
|--------|------|----------|
| `getSettingsOverviewAction` | Company | Firestore settings |
| `updateCompanySettingsAction` | Admin | Firestore (notifications, autoReply, smsFallback) |

WhatsApp session/number actions from the prior controller stack were **removed**.

## AI training (`ai-training.ts`)

| Action | Auth | Behavior |
|--------|------|----------|
| `getAiTrainingDataAction` | Company | List all training data |
| `createKnowledgeItemAction` | Company + canPost | Create item; URL type triggers Gemini summary |
| `updateKnowledgeItemAction` | Company + canPost | Update item |
| `deleteKnowledgeItemAction` | Company + canPost | Delete item |
| `createQuickAnswerAction` | Company + canPost | Create quick answer |
| `updateQuickAnswerAction` | Company + canPost | Update quick answer |
| `deleteQuickAnswerAction` | Company + canPost | Delete quick answer |
| `createAiTemplateAction` | Company + canPost | Create template + options |
| `updateAiTemplateAction` | Company + canPost | Update template + options |
| `deleteAiTemplateAction` | Company + canPost | Delete template |

## Contact (`contact.ts`)

| Action | Auth | External |
|--------|------|----------|
| `sendContactEmail` | Public | Email stub to support address |

## Session helper (`check-session.ts`)

| Function | Purpose |
|----------|---------|
| `checkSession()` | Returns user email from session |

## Zod validation pattern

- Client forms duplicate schemas in components
- Server actions re-validate with Zod before Firestore operations
- Company scope uses optional `companyId` string

## Edge cases

- `sendInboxMessageAction` stores messages in Firestore but does not deliver via WhatsApp.
- Email actions succeed in dev (console log) even without a provider.
- AI actions fall back to static strings when Gemini is not configured or usage limit exceeded.

## Open questions

None for as-is documentation.
