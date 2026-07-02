#!/usr/bin/env bash
# Detect and remove stale WhatsApp worker processes left behind by Docker/WSL.
# See docs/spec/25-whatsapp-pairing-lifecycle.md — "Ghost worker on wrong port".
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ -f .env ]]; then
  WHATSAPP_WORKER_PORT="${WHATSAPP_WORKER_PORT:-$(grep -E '^WHATSAPP_WORKER_PORT=' .env | tail -1 | cut -d= -f2- | tr -d '"')}"
fi

WORKER_PORT="${WHATSAPP_WORKER_PORT:-8082}"
STALE_PORT=8081
CONTAINER_NAME="${WHATSAPP_WORKER_CONTAINER:-botinhoai-whatsapp-worker-1}"

health_body() {
  local port=$1
  curl -sf --connect-timeout 2 "http://127.0.0.1:${port}/health" 2>/dev/null || true
}

is_modern_worker_health() {
  local body=$1
  [[ -n "$body" ]] || return 1
  python3 - <<'PY' "$body"
import json, sys
try:
    data = json.loads(sys.argv[1])
except json.JSONDecodeError:
    sys.exit(1)
sys.exit(0 if isinstance(data.get("details"), list) else 1)
PY
}

current_container_scope() {
  docker inspect -f '{{.Id}}' "$CONTAINER_NAME" 2>/dev/null | cut -c1-12 || true
}

kill_stale_processes() {
  local keep_scope="$1"
  echo "Removing stale worker processes (keeping container scope: ${keep_scope:-none})..."

  docker run --rm --pid=host alpine sh -s "$keep_scope" <<'SH'
keep_scope="$1"
for pid in $(pgrep -f '/app/worker' 2>/dev/null || true); do
  cgroup="$(tr -d '\n' < "/proc/$pid/cgroup" 2>/dev/null || true)"
  if [ -n "$keep_scope" ] && echo "$cgroup" | grep -q "$keep_scope"; then
    continue
  fi
  kill -9 "$pid" 2>/dev/null || true
done

for pid in $(pgrep -f 'docker-proxy.*-host-port 8081' 2>/dev/null || true); do
  kill -9 "$pid" 2>/dev/null || true
done
SH
}

echo "WhatsApp worker doctor (expected port: ${WORKER_PORT})"

stale_body="$(health_body "$STALE_PORT")"
if [[ -n "$stale_body" ]] && ! is_modern_worker_health "$stale_body"; then
  echo "WARNING: stale worker still responding on port ${STALE_PORT}."
  keep_scope="$(current_container_scope)"
  kill_stale_processes "$keep_scope"
  sleep 1
  stale_body="$(health_body "$STALE_PORT")"
  if [[ -n "$stale_body" ]] && ! is_modern_worker_health "$stale_body"; then
    echo "ERROR: port ${STALE_PORT} is still serving a stale worker."
    echo "Restart Docker Desktop / the Docker daemon, then run this script again."
    exit 1
  fi
  echo "Stale worker on port ${STALE_PORT} removed."
else
  echo "No stale worker detected on port ${STALE_PORT}."
fi

if ! docker ps --format '{{.Names}}' | grep -qx "$CONTAINER_NAME"; then
  echo "Starting whatsapp-worker via docker compose..."
  docker compose -f docker-compose.dev.yml up -d whatsapp-worker
  sleep 2
fi

worker_body="$(health_body "$WORKER_PORT")"
if ! is_modern_worker_health "$worker_body"; then
  echo "ERROR: worker on port ${WORKER_PORT} is missing or not the current build (health.details absent)."
  echo "Run: npm run dev:infra:down && npm run dev:infra"
  exit 1
fi

echo "OK: worker on port ${WORKER_PORT} is healthy."
echo "$worker_body" | python3 -m json.tool 2>/dev/null || echo "$worker_body"
