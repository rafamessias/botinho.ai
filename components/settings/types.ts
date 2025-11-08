export type SettingsState = {
    emailNotifications: boolean
    newMessageAlerts: boolean
    dailyReports: boolean
    autoReply: boolean
}

export type RemoteAuthMetadata = {
    wsUrl: string | null
    remoteAuthKey: string | null
    tenantId: string | null
}

export type WhatsAppNumber = {
    id: string
    sessionId: string
    displayName: string
    phoneNumber: string
    isConnected: boolean
    messagesThisMonth: number
    status: string | null
    createdAt: string
    updatedAt: string
    lastSyncedAt: string | null
    wsUrl: string | null
    workerId: string | null
    remoteAuthKey: string | null
    remoteAuthNamespace: string | null
    remoteAuthData: RemoteAuthMetadata
}

export type PairingPhase = "idle" | "connecting" | "waiting" | "scanned" | "completed" | "error"

export const defaultSettings: SettingsState = {
    emailNotifications: true,
    newMessageAlerts: true,
    dailyReports: false,
    autoReply: true,
}

