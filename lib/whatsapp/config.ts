export type WhatsAppConfig = {
  redisUrl: string
  workerInternalToken: string
  maxSessionsPerWorker: number
  scalerMode: "local" | "docker" | "gke"
  workerBaseUrl: string
  /** Host port mapped to the worker container (local dev). */
  workerPort: number
  webhookSecret: string
  /** Public app URL (browser-facing). */
  appUrl: string
  /** URL workers use to POST inbound webhooks (may differ in Docker, e.g. host.docker.internal). */
  webhookAppUrl: string
}

const parseIntEnv = (value: string | undefined, fallback: number) => {
  const parsed = Number.parseInt(value ?? "", 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const getWhatsAppConfig = (): WhatsAppConfig | null => {
  const redisUrl = process.env.REDIS_URL?.trim()
  const workerInternalToken = process.env.WORKER_INTERNAL_TOKEN?.trim()

  if (!redisUrl || !workerInternalToken) {
    return null
  }

  const scalerMode = (process.env.SCALER_MODE?.trim() ?? "local") as WhatsAppConfig["scalerMode"]

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() ?? "http://localhost:3000"
  const webhookAppUrl = process.env.WEBHOOK_APP_URL?.trim() ?? appUrl

  return {
    redisUrl,
    workerInternalToken,
    maxSessionsPerWorker: parseIntEnv(process.env.MAX_SESSIONS_PER_WORKER, 25),
    scalerMode,
    workerBaseUrl: process.env.WORKER_BASE_URL?.trim() ?? "http://localhost",
    workerPort: parseIntEnv(process.env.WHATSAPP_WORKER_PORT, 8082),
    webhookSecret: process.env.WHATSAPP_WEBHOOK_SECRET?.trim() ?? workerInternalToken,
    appUrl,
    webhookAppUrl,
  }
}

export const isWhatsAppConfigured = () => getWhatsAppConfig() !== null
