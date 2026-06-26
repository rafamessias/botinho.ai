import type { SendMessageRequest, WhatsAppMessage, WhatsAppSession } from "@/lib/whatsapp/types"

type WorkerErrorResponse = {
  error?: {
    message?: string
    details?: string
  }
}

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
    return this.get<WhatsAppSession>(`${workerUrl}/internal/sessions/${sessionId}/status`)
  }

  async sendMessage(
    workerUrl: string,
    sessionId: string,
    payload: Pick<SendMessageRequest, "to" | "text">,
  ): Promise<WhatsAppMessage> {
    return this.post<WhatsAppMessage>(`${workerUrl}/internal/sessions/${sessionId}/send`, payload)
  }

  private headers(): HeadersInit {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    }
  }

  private async get<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      method: "GET",
      headers: this.headers(),
    })

    if (!response.ok) {
      await this.throwWorkerError(response)
    }

    return (await response.json()) as T
  }

  private async post<T>(url: string, payload: unknown): Promise<T> {
    const response = await fetch(url, {
      method: "POST",
      headers: this.headers(),
      body: payload === null ? undefined : JSON.stringify(payload),
    })

    if (!response.ok) {
      await this.throwWorkerError(response)
    }

    if (response.status === 204) {
      return undefined as T
    }

    return (await response.json()) as T
  }

  private async throwWorkerError(response: Response): Promise<never> {
    let message = `worker request failed with status ${response.status}`
    try {
      const body = (await response.json()) as WorkerErrorResponse
      if (body.error?.message) {
        message = body.error.message
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(message)
  }
}
