# 15 — UI and Design System

## Purpose

Document the component library, styling system, app shell, state management, and form patterns.

## Status

`implemented`

## Source of truth

- [components.json](../../components.json)
- [app/globals.css](../../app/globals.css)
- [components/ui/](../../components/ui/)
- [components/app-sidebar.tsx](../../components/app-sidebar.tsx)
- [components/user-provider.tsx](../../components/user-provider.tsx)

## Design system

| Layer | Choice |
|-------|--------|
| Component library | shadcn/ui (style: **new-york**, base: **neutral**) |
| CSS | Tailwind CSS v4 via `@tailwindcss/postcss` |
| Primitives | Radix UI |
| Icons | Lucide React, Tabler Icons |
| Fonts | Geist Sans, Geist Mono |
| Charts | Recharts + shadcn chart wrapper |
| Toasts | Sonner |
| Motion | Framer Motion (available, selective use) |
| Utilities | `clsx`, `tailwind-merge`, `cva` via [lib/utils.ts](../../lib/utils.ts) |

Config: [components.json](../../components.json) — CSS variables in `app/globals.css`, RSC enabled.

## Theme

WhatsApp-inspired green palette defined in [app/globals.css](../../app/globals.css) with light/dark CSS variables.

- Provider: [components/theme-provider.tsx](../../components/theme-provider.tsx) (next-themes)
- Selector: [components/theme-selector.tsx](../../components/theme-selector.tsx)
- User preference synced from profile via `UserProvider`
- Interaction patterns: [lib/theme.ts](../../lib/theme.ts)

### Semantic color tokens

All feature UI must use these tokens — never hardcode Tailwind palette colors (`green-500`, `amber-600`, etc.).

| Token | Use |
|-------|-----|
| `primary` / `primary-foreground` | Brand actions, bot messages, links |
| `destructive` / `destructive-foreground` | Errors, delete actions, limit exceeded |
| `success` / `success-foreground` | Success states, active badges, checkmarks |
| `warning` / `warning-foreground` | Warnings, usage alerts (80–99%), offline banners |
| `info` / `info-foreground` | Informational alerts, trial badges, loading states |
| `critical` / `critical-foreground` | Critical usage alerts (100%+) |
| `agent` / `agent-foreground` | Human agent message bubbles in inbox |
| `rating` | Star ratings on landing page |
| `muted` / `muted-foreground` | Secondary surfaces and text |
| `background` / `foreground` / `card` / `border` | Layout surfaces |

Opacity modifiers (`/10`, `/15`, `/25`) are allowed on semantic tokens for tinted backgrounds.

### Component variants

| Component | Variants | File |
|-----------|----------|------|
| Alert | `default`, `destructive`, `success`, `warning`, `info` | [alert.tsx](../../components/ui/alert.tsx) |
| Badge | `default`, `secondary`, `destructive`, `outline`, `success`, `warning`, `info` | [badge.tsx](../../components/ui/badge.tsx) |
| StatusCallout | `warning`, `info`, `success`, `destructive` | [status-callout.tsx](../../components/ui/status-callout.tsx) |
| UsageBanner | auto level from `usagePercentage` | [usage-banner.tsx](../../components/ui/usage-banner.tsx) |

### Hover and interaction rules

Use helpers from `lib/theme.ts` instead of ad-hoc classes:

| Pattern | Class constant | When |
|---------|----------------|------|
| Muted row hover | `themeInteraction.mutedHover` | List items, inbox sidebar buttons |
| Ghost icon hover | `themeInteraction.ghostIconHover` | Icon buttons that should not fill |
| Destructive action hover | `themeInteraction.destructiveHover` | Delete buttons in menus |
| Form errors | `themeInteraction.formError` | Validation messages (`text-destructive`) |
| Form error border | `themeInteraction.formErrorBorder` | Invalid inputs (`border-destructive`) |

Button hover states are defined in [button.tsx](../../components/ui/button.tsx) variants — do not override with raw colors.

### Dark mode

- Toggle applies `.dark` class on `<html>` via next-themes
- All semantic tokens have light (`:root`) and dark (`.dark`) values in globals.css
- Do not add manual `dark:` overrides for colors already covered by semantic tokens
- Exception: `dark:hover:bg-muted/50` is the standard muted-hover dark variant (see `themeInteraction.mutedHover`)

## App shell (authenticated)

```
AppSidebar (collapsible)
├── Nav: Dashboard, Inbox, Customer, AI Training, Company, Settings, Support
├── Usage warning banner
└── NavUser: Account, Subscription, Logout

SiteHeader
├── Sidebar toggle
├── Page title
├── Theme selector
└── Language selector
```

Files:

- [components/app-sidebar.tsx](../../components/app-sidebar.tsx)
- [components/site-header.tsx](../../components/site-header.tsx)
- [components/nav-main.tsx](../../components/nav-main.tsx)
- [components/nav-user.tsx](../../components/nav-user.tsx)
- [components/ui/sidebar.tsx](../../components/ui/sidebar.tsx)

## UI components (50)

Located in [components/ui/](../../components/ui/):

accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input, input-otp, label, menubar, navigation-menu, pagination, phone-input, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toast, toaster, toggle, toggle-group, tooltip, use-mobile

Custom: [phone-input.tsx](../../components/ui/phone-input.tsx) for international phone entry.

## Feature components

| Area | Key files |
|------|-----------|
| Dashboard | `components/dashboard/dashboard-page.tsx`, `chart-area-interactive.tsx` |
| Inbox | `components/inbox/inbox-page.tsx` |
| Customer | `components/customer/customer-page.tsx`, `customer-table.tsx`, `customer-modal.tsx` |
| AI Training | `components/ai-training/` (sections, dialogs) |
| Company | `components/company/` |
| Settings | `components/settings/settings-page.tsx`, `whatsapp-pairing-dialog.tsx` |
| Subscription | `components/subscription/subscription-page.tsx`, `upgrade-modal-plans.tsx` |
| Auth | `components/sign-in/`, `components/sign-up/`, `components/reset-password/` |

## State management

No Redux/Zustand/Jotai.

| Layer | Mechanism |
|-------|-----------|
| Auth session | NextAuth JWT + SessionProvider |
| User profile | UserProvider context (`useUser()`) |
| Feature state | Local useState/useMemo in page components |
| Server data | Server Components prefetch + server actions |
| Theme | next-themes |
| Toasts | Sonner |

### UserProvider

[components/user-provider.tsx](../../components/user-provider.tsx):

- Loads user via `getCurrentUserAction`
- Exposes: `user`, `loading`, `refreshUser()`, `hasPermission()`, `usagePercentage`
- Shows full-screen loader until ready
- Auto-redirects pending subscriptions to Stripe

## Forms

Stack: **react-hook-form** + **@hookform/resolvers/zod** + shadcn Form primitives.

Client Zod schemas in form components; server actions re-validate.

Example files:

- [sign-in-form.tsx](../../components/sign-in/sign-in-form.tsx)
- [sign-up-form.tsx](../../components/sign-up/sign-up-form.tsx)
- [profile-form.tsx](../../components/account/profile-form.tsx)

## Tables

[TanStack Table](https://tanstack.com/table) via [components/data-table.tsx](../../components/data-table.tsx) and [customer-table.tsx](../../components/customer/customer-table.tsx).

## Drag and drop

@dnd-kit available in dependencies (used where reordering needed in AI training UI).

## Accessibility

Radix primitives provide keyboard navigation and ARIA roles. shadcn components follow Radix patterns.

## Edge cases

- [company-switcher.tsx](../../components/company-switcher.tsx) exists but is not wired into main sidebar (template remnant).
- Customer page uses entirely local mock state (no loading/error states for API).

## Open questions

None for as-is documentation.
