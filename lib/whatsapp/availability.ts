import { getWhatsAppConfig, isWhatsAppConfigured } from "@/lib/whatsapp/config"
import { clearWhatsAppRedisClient, WhatsAppRegistry } from "@/lib/whatsapp/registry"

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

  try {
    const registry = await Promise.race([
      WhatsAppRegistry.connect(config.redisUrl),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("WhatsApp availability check timed out")), AVAILABILITY_TIMEOUT_MS)
      }),
    ])
    const workers = await registry.listWorkers()
    if (workers.length === 0) {
      clearWhatsAppRedisClient()
      return { configured: true, available: false }
    }
    return { configured: true, available: true }
  } catch {
    clearWhatsAppRedisClient()
    return { configured: true, available: false }
  }
}
