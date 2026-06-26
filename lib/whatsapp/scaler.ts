import type { WhatsAppRegistry } from "@/lib/whatsapp/registry"

type ScaleUpResult = {
  workerId: string
  url: string
}

let localWorkerCounter = 0

export class WhatsAppScaler {
  constructor(
    private readonly mode: "local" | "docker" | "gke",
    private readonly baseUrl: string,
    private readonly registry: WhatsAppRegistry,
    private readonly capacity: number,
  ) {}

  async scaleUp(): Promise<ScaleUpResult> {
    localWorkerCounter += 1
    const workerId = `worker-${localWorkerCounter}`
    const port = 8080 + localWorkerCounter
    const url = `${this.baseUrl}:${port}`

    await this.registry.registerWorker(workerId, url, this.capacity)

    return { workerId, url }
  }
}
