# WhatsApp Worker

Go service that hosts [whatsmeow](https://github.com/tulir/whatsmeow) sessions. Session orchestration, QR pairing UI, and inbound webhooks live in the **Next.js app** at the monorepo root (`lib/whatsapp/`).

## Architecture

```
botinho.ai (Next.js)          services/whatsapp-worker (Go)
├── lib/whatsapp/             ├── cmd/worker/
│   orchestrator              ├── internal/wa/ (whatsmeow pool)
│   Redis registry            └── Redis heartbeat + Firestore checkpoints
├── Settings → QR pairing
└── /api/webhooks/whatsapp/inbound
```

## Session store persistence (Phase 1)

whatsmeow credentials are snapshotted to durable storage on pair/connect/shutdown. See [docs/spec/24-whatsapp-session-store-persistence.md](../../docs/spec/24-whatsapp-session-store-persistence.md).

| Env | Purpose |
|-----|---------|
| `SESSION_STORE_DIR` | Live SQLite per session |
| `WA_STORE_BACKEND` | `local` or `gcs` |
| `WA_STORE_LOCAL_DIR` | Local snapshot directory |
| `WA_STORE_BUCKET` | GCS bucket when `backend=gcs` |

Firestore `waStores/{sessionId}` holds snapshot metadata; worker restores only sessions assigned via Firestore `sessions.workerId`.


## Local development

From monorepo root:

```bash
# Terminal 1 — Redis + worker
docker compose -f docker-compose.dev.yml up --build

# Terminal 2 — Next.js (uses same REDIS_URL / WORKER_INTERNAL_TOKEN from .env.local)
npm run dev
```

Open **Settings → WhatsApp** to pair a number.

### Run worker on host (without Docker)

```bash
docker run --rm -p 6379:6379 redis:7-alpine

cd services/whatsapp-worker
export REDIS_URL=redis://localhost:6379
export WORKER_URL=http://localhost:8081
export WORKER_INTERNAL_TOKEN=dev-worker-token
make run-worker
```

The worker loads env from `services/whatsapp-worker/.env`, or from the monorepo root `.env.local` / `.env`.

## Commands

| Command | Description |
|---------|-------------|
| `make run-worker` | Run worker locally |
| `make build` | Build `bin/worker` |
| `make test` | Go tests |
| `make docker-up` | Worker + Redis via local compose file |

## Internal API

All routes require `Authorization: Bearer $WORKER_INTERNAL_TOKEN`.

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Health + session count |
| POST | `/internal/sessions` | Start session |
| POST | `/internal/sessions/{id}/connect` | Begin QR pairing |
| GET | `/internal/sessions/{id}/status` | Live session status |
| POST | `/internal/sessions/{id}/send` | Send text message |
| DELETE | `/internal/sessions/{id}` | Stop session |

## Production

See [docs/GCP_DEPLOYMENT.md](docs/GCP_DEPLOYMENT.md).
