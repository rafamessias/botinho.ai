import { getWhatsAppConfig, isWhatsAppConfigured } from "@/lib/whatsapp/config"
import { WhatsAppOrchestrator } from "@/lib/whatsapp/orchestrator"
import { WhatsAppRegistry } from "@/lib/whatsapp/registry"
import { WhatsAppScaler } from "@/lib/whatsapp/scaler"
import { WhatsAppSessionRepository } from "@/lib/whatsapp/session-repository"
import { WhatsAppWorkerClient } from "@/lib/whatsapp/worker-client"

type GlobalOrchestrator = typeof globalThis & {
  __whatsappOrchestrator?: Promise<WhatsAppOrchestrator>
}

export const getWhatsAppOrchestrator = async (): Promise<WhatsAppOrchestrator> => {
  const config = getWhatsAppConfig()
  if (!config) {
    throw new Error("WhatsApp is not configured. Set REDIS_URL and WORKER_INTERNAL_TOKEN.")
  }

  const globalStore = globalThis as GlobalOrchestrator
  if (!globalStore.__whatsappOrchestrator) {
    globalStore.__whatsappOrchestrator = (async () => {
      const registry = await WhatsAppRegistry.connect(config.redisUrl)
      const repository = new WhatsAppSessionRepository()
      const scaler = new WhatsAppScaler(
        config.scalerMode,
        config.workerBaseUrl,
        registry,
        config.maxSessionsPerWorker,
      )
      const workerClient = new WhatsAppWorkerClient(config.workerInternalToken)
      return new WhatsAppOrchestrator(registry, repository, scaler, workerClient, config)
    })()
  }

  return globalStore.__whatsappOrchestrator
}

export { isWhatsAppConfigured }
