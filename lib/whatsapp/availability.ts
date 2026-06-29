import { getWhatsAppConfig, isWhatsAppConfigured } from "@/lib/whatsapp/config"
import { isWhatsAppRedisInCooldown, WhatsAppRegistry } from "@/lib/whatsapp/registry"
import { WhatsAppWorkerClient } from "@/lib/whatsapp/worker-client"

const AVAILABILITY_TIMEOUT_MS = 3_000

export type WhatsAppAvailability = {
  configured: boolean
  available: boolean
}

export const checkWhatsAppAvailability = async (): Promise<WhatsAppAvailability> => {
  if (!isWhatsAppConfigured()) {
    return { configured: false, available: false }
  }

  const config = getWhatsAppConfig()
  if (!config) {
    return { configured: false, available: false }
  }

  if (isWhatsAppRedisInCooldown()) {
    return { configured: true, available: false }
  }

  try {
    const registry = await Promise.race([
      WhatsAppRegistry.connect(config.redisUrl),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("WhatsApp availability check timed out")), AVAILABILITY_TIMEOUT_MS)
      }),
    ])
    const workers = await registry.listWorkers()
    if (workers.length === 0) {
      return { configured: true, available: false }
    }

    const workerClient = new WhatsAppWorkerClient(config.workerInternalToken)
    const healthyWorkers = await Promise.all(
      workers.map(async (worker) => {
        try {
          await workerClient.assertHealthyWorker(worker.url)
          return true
        } catch {
          return false
        }
      }),
    )

    return { configured: true, available: healthyWorkers.some(Boolean) }
  } catch {
    return { configured: true, available: false }
  }
}
