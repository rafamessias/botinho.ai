# GCP Deployment — WhatsApp Worker

Session orchestration runs in the **botinho.ai Next.js app** (`lib/whatsapp/`). This service is the whatsmeow worker only.

## Recommended stack

- **Firebase App Hosting** — Next.js app (orchestrator)
- **GKE** — WhatsApp Worker Deployment (HPA)
- **Memorystore (Redis)** — worker registry
- **Cloud Firestore** — sessions, messages, waStores checkpoints
- **Secret Manager** — API keys and service account
- **Artifact Registry** — container images

## Environment variables

### Next.js (botinho.ai root)

- `REDIS_URL` — Memorystore connection string
- `WORKER_INTERNAL_TOKEN`
- `WHATSAPP_WEBHOOK_SECRET`
- `FIRESTORE_PROJECT_ID` / Firebase admin credentials
- `NEXT_PUBLIC_APP_URL`

### Worker (this service)

- `FIRESTORE_PROJECT_ID`
- `REDIS_URL`
- `WORKER_URL` — internal cluster URL (e.g. `http://botinho-whatsapp-worker:8081`)
- `WORKER_INTERNAL_TOKEN`
- `MAX_SESSIONS_PER_WORKER=25`

## Scaling

Workers scale up when no pod has available capacity (orchestrator in Next.js triggers scale-up in local mode). Workers scale down when idle after draining sessions.

Before terminating a worker pod, sessions must be drained and store checkpoints flushed to Firestore.

## Firestore indexes

Create composite indexes for:

- `messages`: `sessionId ASC, timestamp DESC`
- `messages`: `phoneNumber ASC, timestamp DESC`
- `sessions`: `companyId ASC`

Apply manifests from `deploy/k8s/` after building and pushing images to Artifact Registry.

Build from monorepo root:

```bash
docker build -f services/whatsapp-worker/deploy/docker/Dockerfile.worker -t whatsapp-worker services/whatsapp-worker
```
