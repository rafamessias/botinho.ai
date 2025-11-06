export type SettingsState = {
    emailNotifications: boolean
    newMessageAlerts: boolean
    dailyReports: boolean
    autoReply: boolean
}

export type WhatsAppNumber = {
    id: string
    displayName: string
    phoneNumber: string
    isConnected: boolean
    messagesThisMonth: number
    createdAt: string
    updatedAt: string
    lastSyncedAt: string | null
    wsUrl: string | null
    workerId: string | null
    remoteAuthKey: string | null
}

export type PairingPhase = "idle" | "connecting" | "waiting" | "scanned" | "completed" | "error"

export const defaultSettings: SettingsState = {
    emailNotifications: true,
    newMessageAlerts: true,
    dailyReports: false,
    autoReply: true,
}

