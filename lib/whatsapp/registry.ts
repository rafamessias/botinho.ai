import { createClient, type RedisClientType } from "redis"
import type { WorkerInfo, WorkerRecord } from "@/lib/whatsapp/types"

const WORKER_KEY_PREFIX = "worker:"
const WORKER_SET_KEY = "workers:active"
const SESSION_KEY_PREFIX = "session:"
const PHONE_KEY_PREFIX = "phone:"
const HEARTBEAT_TTL_SECONDS = 60
const REDIS_CONNECT_TIMEOUT_MS = 3_000
const REDIS_FAILURE_COOLDOWN_MS = 30_000
const REDIS_ERROR_LOG_COOLDOWN_MS = 60_000

type GlobalRedis = typeof globalThis & {
  __whatsappRedis?: RedisClientType
  __whatsappRedisConnect?: Promise<RedisClientType>
  __whatsappRedisUnavailableUntil?: number
  __whatsappRedisLastErrorLogAt?: number
}

const getGlobalStore = (): GlobalRedis => globalThis as GlobalRedis

export const isWhatsAppRedisInCooldown = (): boolean => {
  const unavailableUntil = getGlobalStore().__whatsappRedisUnavailableUntil
  return typeof unavailableUntil === "number" && Date.now() < unavailableUntil
}

const markRedisUnavailable = (cooldownMs = REDIS_FAILURE_COOLDOWN_MS): void => {
  getGlobalStore().__whatsappRedisUnavailableUntil = Date.now() + cooldownMs
}

const clearRedisUnavailable = (): void => {
  getGlobalStore().__whatsappRedisUnavailableUntil = undefined
}

const logRedisError = (error: unknown): void => {
  const globalStore = getGlobalStore()
  const now = Date.now()
  const lastLoggedAt = globalStore.__whatsappRedisLastErrorLogAt ?? 0

  if (now - lastLoggedAt < REDIS_ERROR_LOG_COOLDOWN_MS) {
    return
  }

  globalStore.__whatsappRedisLastErrorLogAt = now
  const message = error instanceof Error ? error.message : String(error)
  console.warn(
    `[whatsapp] Redis unavailable (${message}). WhatsApp messaging is paused until Redis is reachable.`,
  )
}

export const clearWhatsAppRedisClient = (): void => {
  const globalStore = getGlobalStore()
  const client = globalStore.__whatsappRedis
  if (client?.isOpen) {
    void client.disconnect().catch(() => undefined)
  }
  globalStore.__whatsappRedis = undefined
  globalStore.__whatsappRedisConnect = undefined
}

const getRedisClient = async (redisUrl: string): Promise<RedisClientType> => {
  const globalStore = getGlobalStore()

  if (isWhatsAppRedisInCooldown()) {
    throw new Error("Redis unavailable")
  }

  const existing = globalStore.__whatsappRedis
  if (existing?.isOpen) {
    return existing
  }
  if (existing) {
    globalStore.__whatsappRedis = undefined
  }

  if (globalStore.__whatsappRedisConnect) {
    return globalStore.__whatsappRedisConnect
  }

  globalStore.__whatsappRedisConnect = (async () => {
    const client = createClient({
      url: redisUrl,
      socket: {
        connectTimeout: REDIS_CONNECT_TIMEOUT_MS,
        reconnectStrategy: () => false,
      },
    }) as RedisClientType

    client.on("error", (error) => {
      markRedisUnavailable()
      if (globalStore.__whatsappRedis === client) {
        globalStore.__whatsappRedis = undefined
      }
      logRedisError(error)
    })

    try {
      await client.connect()
      clearRedisUnavailable()
      globalStore.__whatsappRedis = client
      return client
    } catch (error) {
      markRedisUnavailable()
      void client.disconnect().catch(() => undefined)
      logRedisError(error)
      throw error
    } finally {
      globalStore.__whatsappRedisConnect = undefined
    }
  })()

  return globalStore.__whatsappRedisConnect
}

const parseWorkerRecord = (raw: string): WorkerRecord => JSON.parse(raw) as WorkerRecord

export class WhatsAppRegistry {
  private constructor(private readonly redisUrl: string) {}

  private client(): Promise<RedisClientType> {
    return getRedisClient(this.redisUrl)
  }

  static async connect(redisUrl: string) {
    const client = await getRedisClient(redisUrl)
    await client.ping()
    return new WhatsAppRegistry(redisUrl)
  }

  async getAvailableWorker(): Promise<WorkerRecord | null> {
    const client = await this.client()
    const ids = await client.sMembers(WORKER_SET_KEY)
    for (const id of ids) {
      const record = await this.getWorker(id)
      if (!record) {
        await client.sRem(WORKER_SET_KEY, id)
        continue
      }
      if (record.currentSessions < record.capacity) {
        return record
      }
    }
    return null
  }

  async getWorker(workerId: string): Promise<WorkerRecord | null> {
    const client = await this.client()
    const raw = await client.get(WORKER_KEY_PREFIX + workerId)
    if (!raw) return null
    return parseWorkerRecord(raw)
  }

  async listWorkers(): Promise<WorkerInfo[]> {
    const client = await this.client()
    const ids = await client.sMembers(WORKER_SET_KEY)
    const workers: WorkerInfo[] = []

    for (const id of ids) {
      const record = await this.getWorker(id)
      if (!record) continue
      workers.push({
        id: record.workerId,
        url: record.url,
        capacity: record.capacity,
        currentSessions: record.currentSessions,
        status: record.status,
        lastHeartbeat: record.lastHeartbeat,
      })
    }

    return workers
  }

  async registerWorker(workerId: string, url: string, capacity: number) {
    const client = await this.client()
    const record: WorkerRecord = {
      workerId,
      url,
      capacity,
      currentSessions: 0,
      lastHeartbeat: Date.now(),
      status: "idle",
    }
    const multi = client.multi()
    multi.set(WORKER_KEY_PREFIX + workerId, JSON.stringify(record), { EX: HEARTBEAT_TTL_SECONDS })
    multi.sAdd(WORKER_SET_KEY, workerId)
    await multi.exec()
  }

  async assignSession(sessionId: string, workerId: string) {
    const client = await this.client()
    const record = await this.getWorker(workerId)
    if (!record) {
      throw new Error(`worker not found: ${workerId}`)
    }

    record.currentSessions += 1
    record.status = record.currentSessions >= record.capacity ? "full" : "active"

    const multi = client.multi()
    multi.set(SESSION_KEY_PREFIX + sessionId, workerId)
    multi.set(WORKER_KEY_PREFIX + workerId, JSON.stringify(record), { EX: HEARTBEAT_TTL_SECONDS })
    await multi.exec()
  }

  async getWorkerForSession(sessionId: string): Promise<string | null> {
    const client = await this.client()
    return client.get(SESSION_KEY_PREFIX + sessionId)
  }

  async removeSession(sessionId: string) {
    const client = await this.client()
    const workerId = await client.get(SESSION_KEY_PREFIX + sessionId)
    if (!workerId) return

    const multi = client.multi()
    multi.del(SESSION_KEY_PREFIX + sessionId)

    const record = await this.getWorker(workerId)
    if (record) {
      record.currentSessions = Math.max(0, record.currentSessions - 1)
      record.status =
        record.currentSessions === 0
          ? "idle"
          : record.currentSessions < record.capacity
            ? "active"
            : record.status
      multi.set(WORKER_KEY_PREFIX + workerId, JSON.stringify(record), { EX: HEARTBEAT_TTL_SECONDS })
    }

    await multi.exec()
  }

  async setPhoneIndex(phoneNumber: string, sessionId: string) {
    const client = await this.client()
    const multi = client.multi()
    multi.set(PHONE_KEY_PREFIX + phoneNumber, sessionId)
    multi.set(SESSION_KEY_PREFIX + "phone:" + sessionId, phoneNumber)
    await multi.exec()
  }

  async getSessionByPhone(phoneNumber: string): Promise<string | null> {
    const client = await this.client()
    return client.get(PHONE_KEY_PREFIX + phoneNumber)
  }
}
