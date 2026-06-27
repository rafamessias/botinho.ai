import { createClient, type RedisClientType } from "redis"
import type { WorkerInfo, WorkerRecord } from "@/lib/whatsapp/types"

const WORKER_KEY_PREFIX = "worker:"
const WORKER_SET_KEY = "workers:active"
const SESSION_KEY_PREFIX = "session:"
const PHONE_KEY_PREFIX = "phone:"
const HEARTBEAT_TTL_SECONDS = 60

type GlobalRedis = typeof globalThis & {
  __whatsappRedis?: RedisClientType
}

const getRedisClient = async (redisUrl: string): Promise<RedisClientType> => {
  const globalStore = globalThis as GlobalRedis

  if (globalStore.__whatsappRedis?.isOpen) {
    return globalStore.__whatsappRedis
  }

  const client = createClient({ url: redisUrl }) as RedisClientType
  client.on("error", (error) => {
    console.error("[whatsapp] redis error:", error)
  })
  await client.connect()
  globalStore.__whatsappRedis = client
  return client
}

const parseWorkerRecord = (raw: string): WorkerRecord => JSON.parse(raw) as WorkerRecord

export class WhatsAppRegistry {
  private constructor(private readonly client: RedisClientType) {}

  static async connect(redisUrl: string) {
    const client = await getRedisClient(redisUrl)
    await client.ping()
    return new WhatsAppRegistry(client)
  }

  async getAvailableWorker(): Promise<WorkerRecord | null> {
    const ids = await this.client.sMembers(WORKER_SET_KEY)
    for (const id of ids) {
      const record = await this.getWorker(id)
      if (!record) {
        await this.client.sRem(WORKER_SET_KEY, id)
        continue
      }
      if (record.currentSessions < record.capacity) {
        return record
      }
    }
    return null
  }

  async getWorker(workerId: string): Promise<WorkerRecord | null> {
    const raw = await this.client.get(WORKER_KEY_PREFIX + workerId)
    if (!raw) return null
    return parseWorkerRecord(raw)
  }

  async listWorkers(): Promise<WorkerInfo[]> {
    const ids = await this.client.sMembers(WORKER_SET_KEY)
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
    const record: WorkerRecord = {
      workerId,
      url,
      capacity,
      currentSessions: 0,
      lastHeartbeat: Date.now(),
      status: "idle",
    }
    const multi = this.client.multi()
    multi.set(WORKER_KEY_PREFIX + workerId, JSON.stringify(record), { EX: HEARTBEAT_TTL_SECONDS })
    multi.sAdd(WORKER_SET_KEY, workerId)
    await multi.exec()
  }

  async assignSession(sessionId: string, workerId: string) {
    const record = await this.getWorker(workerId)
    if (!record) {
      throw new Error(`worker not found: ${workerId}`)
    }

    record.currentSessions += 1
    record.status = record.currentSessions >= record.capacity ? "full" : "active"

    const multi = this.client.multi()
    multi.set(SESSION_KEY_PREFIX + sessionId, workerId)
    multi.set(WORKER_KEY_PREFIX + workerId, JSON.stringify(record), { EX: HEARTBEAT_TTL_SECONDS })
    await multi.exec()
  }

  async getWorkerForSession(sessionId: string): Promise<string | null> {
    return this.client.get(SESSION_KEY_PREFIX + sessionId)
  }

  async removeSession(sessionId: string) {
    const workerId = await this.client.get(SESSION_KEY_PREFIX + sessionId)
    if (!workerId) return

    const multi = this.client.multi()
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
    const multi = this.client.multi()
    multi.set(PHONE_KEY_PREFIX + phoneNumber, sessionId)
    multi.set(SESSION_KEY_PREFIX + "phone:" + sessionId, phoneNumber)
    await multi.exec()
  }

  async getSessionByPhone(phoneNumber: string): Promise<string | null> {
    return this.client.get(PHONE_KEY_PREFIX + phoneNumber)
  }
}
