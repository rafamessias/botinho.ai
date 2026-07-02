import type { SendMessageRequest, WhatsAppMessage, WhatsAppSession } from "@/lib/whatsapp/types"

type WorkerErrorResponse = {
  error?: {
    message?: string
    details?: string
  }
}

type WorkerHealthResponse = {
  status?: string
  apiVersion?: number
  sessions?: number
  details?: unknown[]
}

const DEFAULT_SEND_TIMEOUT_MS = 30_000
const DEFAULT_READ_TIMEOUT_MS = 5_000
const STALE_WORKER_MESSAGE =
  "Stale WhatsApp worker detected (missing health.details). Run: npm run dev:worker:doctor"

export class WhatsAppWorkerClient {
  constructor(private readonly token: string) {}

  async startSession(workerUrl: string, sessionId: string): Promise<WhatsAppSession> {
    return this.post<WhatsAppSession>(`${workerUrl}/internal/sessions`, { sessionId })
  }

  async connectSession(workerUrl: string, sessionId: string): Promise<void> {
    await this.post(`${workerUrl}/internal/sessions/${sessionId}/connect`, null)
  }

  async stopSession(workerUrl: string, sessionId: string): Promise<void> {
    const response = await fetch(`${workerUrl}/internal/sessions/${sessionId}`, {
      method: "DELETE",
      headers: this.headers(),
    })

    if (!response.ok) {
      await this.throwWorkerError(response)
    }
  }

  async sessionStatus(workerUrl: string, sessionId: string): Promise<WhatsAppSession> {
    return this.get<WhatsAppSession>(
      `${workerUrl}/internal/sessions/${sessionId}/status`,
      DEFAULT_READ_TIMEOUT_MS,
    )
  }

  async assertHealthyWorker(workerUrl: string): Promise<void> {
    const response = await this.request(
      `${workerUrl}/health`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      },
      DEFAULT_READ_TIMEOUT_MS,
    )

    if (!response.ok) {
      throw new Error(`WhatsApp worker health check failed with status ${response.status}`)
    }

    const body = (await response.json()) as WorkerHealthResponse
    if (!Array.isArray(body.details)) {
      throw new Error(STALE_WORKER_MESSAGE)
    }
  }

  async sendMessage(
    workerUrl: string,
    sessionId: string,
    payload: Pick<SendMessageRequest, "to" | "text" | "quote">,
    timeoutMs = DEFAULT_SEND_TIMEOUT_MS,
  ): Promise<WhatsAppMessage> {
    return this.post<WhatsAppMessage>(
      `${workerUrl}/internal/sessions/${sessionId}/send`,
      payload,
      timeoutMs,
    )
  }

  private headers(): HeadersInit {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    }
  }

  private async get<T>(url: string, timeoutMs?: number): Promise<T> {
    const response = await this.request(url, { method: "GET" }, timeoutMs)

    if (!response.ok) {
      await this.throwWorkerError(response)
    }

    return (await response.json()) as T
  }

  private async post<T>(url: string, payload: unknown, timeoutMs?: number): Promise<T> {
    const response = await this.request(
      url,
      {
        method: "POST",
        body: payload === null ? undefined : JSON.stringify(payload),
      },
      timeoutMs,
    )

    if (!response.ok) {
      await this.throwWorkerError(response)
    }

    if (response.status === 204) {
      return undefined as T
    }

    return (await response.json()) as T
  }

  private async request(url: string, init: RequestInit, timeoutMs?: number): Promise<Response> {
    const controller = new AbortController()
    const timeoutId =
      timeoutMs != null
        ? setTimeout(() => {
            controller.abort()
          }, timeoutMs)
        : undefined

    try {
      return await fetch(url, {
        ...init,
        headers: this.headers(),
        signal: controller.signal,
      })
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`WhatsApp worker request timed out after ${timeoutMs}ms`)
      }
      throw error
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }

  private async throwWorkerError(response: Response): Promise<never> {
    let message = `worker request failed with status ${response.status}`
    try {
      const body = (await response.json()) as WorkerErrorResponse
      if (body.error?.message) {
        message = body.error.details
          ? `${body.error.message}: ${body.error.details}`
          : body.error.message
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(message)
  }
}
