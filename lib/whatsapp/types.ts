export type SessionStatus =
  | "pending"
  | "qr_pending"
  | "connected"
  | "disconnected"
  | "needs_qr"

export type WhatsAppSession = {
  sessionId: string
  companyId: string
  phoneNumber?: string
  workerId?: string
  status: SessionStatus
  qrCode?: string
  qrImage?: string
  expiresAt?: string
  label?: string
  webhookUrl?: string
  createdAt: string
  updatedAt: string
  lastSeenAt?: string
}

export type MessageDirection = "inbound" | "outbound"

export type WhatsAppMessage = {
  id?: string
  sessionId: string
  companyId?: string
  phoneNumber: string
  messageId: string
  chatJid: string
  from: string
  to: string
  direction: MessageDirection
  type: string
  body: string
  mediaUrl?: string
  timestamp: string
}

export type WorkerInfo = {
  id: string
  url: string
  capacity: number
  currentSessions: number
  status: string
  lastHeartbeat: number
}

export type SendMessageRequest = {
  sessionId?: string
  phoneNumber?: string
  to: string
  text: string
}

export type WorkerRecord = {
  workerId: string
  url: string
  capacity: number
  currentSessions: number
  lastHeartbeat: number
  status: string
}
