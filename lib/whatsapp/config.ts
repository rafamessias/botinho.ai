export type WhatsAppConfig = {
  redisUrl: string
  workerInternalToken: string
  maxSessionsPerWorker: number
  scalerMode: "local" | "docker" | "gke"
  workerBaseUrl: string
  webhookSecret: string
  appUrl: string
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

  return {
    redisUrl,
    workerInternalToken,
    maxSessionsPerWorker: parseIntEnv(process.env.MAX_SESSIONS_PER_WORKER, 25),
    scalerMode,
    workerBaseUrl: process.env.WORKER_BASE_URL?.trim() ?? "http://localhost",
    webhookSecret: process.env.WHATSAPP_WEBHOOK_SECRET?.trim() ?? workerInternalToken,
    appUrl: process.env.NEXT_PUBLIC_APP_URL?.trim() ?? "http://localhost:3000",
  }
}

export const isWhatsAppConfigured = () => getWhatsAppConfig() !== null
