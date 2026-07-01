# 28 — Schedule Reservations

## Purpose

Document company-scoped appointment scheduling: configurable services, per-member agendas, reservation CRUD, availability rules with buffers, table and calendar UI, and Botinho AI tools for checking availability and booking via WhatsApp.

## Status

`implemented` — Core scheduling, permissions, UI, and Botinho tools.

## Source of truth

- [components/schedule/schedule-page.tsx](../../components/schedule/schedule-page.tsx)
- [components/server-actions/schedule.ts](../../components/server-actions/schedule.ts)
- [lib/firebase/services/schedule-service.ts](../../lib/firebase/services/schedule-service.ts)
- [lib/schedule/availability.ts](../../lib/schedule/availability.ts)
- [lib/firebase/ai/schedule-tools.ts](../../lib/firebase/ai/schedule-tools.ts)
- [app/[locale]/(app)/schedule/page.tsx](../../app/[locale]/(app)/schedule/page.tsx)

---

## 1. Sidebar

| Item | Route |
|------|-------|
| Schedule | `/schedule` |

Under **WORKSPACE** in [app-sidebar.tsx](../../components/app-sidebar.tsx), positioned after Tickets. Visible only to owners, admins, or members with `canManageAgenda`.

---

## 2. Permission: `canManageAgenda`

New boolean on `FirestoreCompanyMember` ([lib/firebase/types.ts](../../lib/firebase/types.ts)).

| Actor | Access |
|-------|--------|
| Owner / Admin | Full schedule management (all agendas, services, company rules) |
| `canManageAgenda` | Own agenda: view meetings, block time, mark unavailable, manage assigned reservations |
| Other accepted members | No access to `/schedule` |
| Botinho (server) | Book/cancel via tools; no UI role required |

**Assignment defaults:**

| Event | `canManageAgenda` |
|-------|-------------------|
| Company owner created | `true` |
| Admin invited/updated | `true` (forced when `isAdmin`) |
| Regular invite | `false` (opt-in checkbox) |
| Agenda-only staff | `true` with `canPost: false` — allowed |

**Backend guard** — [lib/botinho-auth.ts](../../lib/botinho-auth.ts):

```typescript
resolveCompanyContext({ requireCanManageAgenda?: boolean })
```

Access mode `"agenda"` → `isOwner || isAdmin || canManageAgenda`.

---

## 3. Data model

All paths under `companies/{companyId}/`.

### 3.1 tenant settings — `settings/schedule`

| Field | Type | Default |
|-------|------|---------|
| timezone | string | `America/Sao_Paulo` |
| defaultBufferMinutes | number | 15 |
| minAdvanceBookingMinutes | number | 60 |
| maxAdvanceBookingDays | number | 60 |
| slotIntervalMinutes | number | 15 |
| businessHours | `ScheduleDayHours[]` | Mon–Fri 09:00–18:00 |
| updatedAt | Timestamp | |

### 3.2 Services — `scheduleServices/{serviceId}`

| Field | Type |
|-------|------|
| name, description | string |
| durationMinutes | number (min 5) |
| bufferBeforeMinutes | number? |
| bufferAfterMinutes | number? |
| assigneeIds | string[] |
| color | string? |
| active | boolean |
| sortOrder | number |
| createdAt, updatedAt | Timestamp |

### 3.3 Agenda profile — `agendaProfiles/{memberUid}`

| Field | Type |
|-------|------|
| memberUid | string |
| displayName | string? |
| enabled | boolean |
| timezone | string? |
| workingHours | ScheduleDayHours[]? |
| createdAt, updatedAt | Timestamp |

### 3.4 Time blocks — `scheduleBlocks/{blockId}`

| Field | Type |
|-------|------|
| assigneeId | string |
| type | `blocked` \| `break` \| `unavailable` |
| startAt, endAt | Timestamp |
| reason | string? |
| createdById | string |
| createdAt, updatedAt | Timestamp |

### 3.5 Reservations — `scheduleReservations/{reservationId}`

| Field | Type |
|-------|------|
| reservationNumber | string (`SCH-00001`) |
| serviceId, serviceName | string |
| assigneeId, assigneeName | string |
| customerId, customerName, customerPhone | string? |
| conversationId | string? |
| startAt, endAt | Timestamp |
| status | `pending` \| `confirmed` \| `cancelled` \| `completed` \| `no_show` |
| notes | string? |
| source | `bot` \| `manual` |
| createdById | string |
| cancelledAt, cancellationReason | Timestamp?, string? |
| createdAt, updatedAt | Timestamp |

**Counter:** `scheduleCounters/_company` (same pattern as tickets).

---

## 4. Availability rules

Core: `findAvailableSlots()` in [lib/firebase/services/schedule-service.ts](../../lib/firebase/services/schedule-service.ts). Pure logic in [lib/schedule/availability.ts](../../lib/schedule/availability.ts).

A slot is available iff **all** hold:

1. Within assignee `workingHours` (or company `businessHours`).
2. Within advance window (`minAdvanceBookingMinutes` … `maxAdvanceBookingDays`).
3. No overlap with active reservations (`pending` / `confirmed`) including service buffers and company `defaultBufferMinutes`.
4. No overlap with `scheduleBlocks`.
5. Assignee is in `service.assigneeIds`, profile `enabled`, member has `canManageAgenda`.

**Booking:** `createReservation` runs a Firestore transaction; re-checks slot atomically. On conflict → `SLOT_UNAVAILABLE`.

**Cancellation:** Botinho may cancel only reservations linked to current `conversationId` or `customerId`.

---

## 5. UI

Route: `/schedule` — [components/schedule/schedule-page.tsx](../../components/schedule/schedule-page.tsx).

- **View toggle:** Table | Calendar
- **Actions:** New reservation, Block time
- **Tabs:** Reservations | Services (admin) | Settings (admin)

### Table view

TanStack Table: reservation number, date/time, service, assignee, customer, status, source, actions. Filters by date range, status, assignee, service.

### Calendar view

Week grid (date-fns + CSS grid). Reservations colored by service; blocks shown hatched. Click slot → create; click event → detail modal.

---

## 6. Botinho AI

Agent flag: `schedulingEnabled` on `FirestoreAiAgent` (default `true`).

Tools in [lib/firebase/ai/schedule-tools.ts](../../lib/firebase/ai/schedule-tools.ts):

| Tool | Purpose |
|------|---------|
| `check_availability` | List open slots for a service on a date |
| `book_appointment` | Create reservation after customer confirms |
| `cancel_appointment` | Cancel by reservation number |
| `list_appointments` | List customer appointments in date range |

Wired in [lib/firebase/ai/generate.ts](../../lib/firebase/ai/generate.ts) when `schedulingEnabled !== false` (merged with ticket tools when both enabled).

---

## 7. Server actions

[components/server-actions/schedule.ts](../../components/server-actions/schedule.ts)

| Action | Guard |
|--------|-------|
| `listReservationsAction` | agenda+ |
| `createReservationAction` | agenda+ |
| `updateReservationAction` | agenda+ / admin |
| `cancelReservationAction` | agenda+ / admin |
| `listAvailableSlotsAction` | agenda+ |
| `createScheduleBlockAction` | agenda+ (own) / admin |
| `deleteScheduleBlockAction` | creator / admin |
| `listScheduleServicesAction` | agenda+ |
| `upsertScheduleServiceAction` | admin |
| `deleteScheduleServiceAction` | admin |
| `getScheduleSettingsAction` | agenda+ |
| `updateScheduleSettingsAction` | admin |
| `listAgendaProfilesAction` | agenda+ |
| `upsertAgendaProfileAction` | admin or self |

---

## 8. Firestore indexes

[firestore.indexes.json](../../firestore.indexes.json):

- `scheduleReservations`: `(assigneeId, startAt)`, `(status, startAt)`, `(customerId, startAt DESC)`
- `scheduleBlocks`: `(assigneeId, startAt)`
- `scheduleServices`: `(active, sortOrder)`

Client access denied in [firestore.rules](../../firestore.rules); Admin SDK via server actions only.

---

## 9. Test plan

- Unit: [tests/lib/schedule-availability.test.ts](../../tests/lib/schedule-availability.test.ts) — buffers, overlaps, blocks, working hours.
- Manual: Botinho books via WhatsApp → reservation in table + calendar.

---

## Related specs

- [05-authorization.md](05-authorization.md) — `canManageAgenda`
- [06-data-model.md](06-data-model.md) — schedule collections
- [10-ai-training.md](10-ai-training.md) — agent flags
- [11-inbox-and-messaging.md](11-inbox-and-messaging.md) — auto-reply tool loop
