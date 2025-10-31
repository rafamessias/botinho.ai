# Botinho WebSocket Pairing Server

Standalone Node.js service that powers QR-based WhatsApp pairing. It exposes a WebSocket endpoint consumed by the dashboard (admin) and the mobile pairing page. The service persists paired numbers directly through Prisma so it stays in sync with the main Next.js app.

## Prerequisites

- Node.js 22.x (or >= 20.18)
- PostgreSQL database configured in the root `.env` (reuses the main Prisma client)
- Install root dependencies once: `npm install`

## Environment Variables

The server reads the existing root `.env`. Add the following keys if you need to customise behaviour:

```
# Optional – defaults shown below
WS_SERVER_PORT=3100
PAIRING_BASE_URL=http://localhost:3000
```

- `WS_SERVER_PORT`: TCP port for the WebSocket HTTP server.
- `PAIRING_BASE_URL`: Public origin used to build the QR deep-link (`/whatsapp/qr?token=...`). Point this to your Next.js app domain.

## Running Locally

```bash
# from repository root
npm run ws:dev
```

The first run (and whenever the Prisma schema changes) execute:

```bash
cd ws-server
npm run prisma:generate
```

This copies the root Prisma schema and generates a local client. After that, `npm run ws:dev` starts the WebSocket server. Launch the Next.js app in a separate terminal (`npm run dev`) and point the dashboard at the server via `NEXT_PUBLIC_WS_SERVER_URL`.

## Behaviour Overview

- Admin connects → `type:"server"`, `step:0`, `companyId` → service replies with signed token + pairing URL.
- Mobile scans QR, connects with `type:"client"`, `step:0`, `token` → service associates sockets, notifies admin.
- Mobile submits details `step:1` with `displayName` / `phoneNumber` → service upserts `CompanyWhatsappNumber`, notifies admin with the saved record, and closes the session.

Connections are automatically cleaned on disconnect or after a short timeout.

> The service shares the Prisma client from `../prisma/lib/prisma`, so migrations and models stay in one place.

