export type SettingsState = {
    emailNotifications: boolean
    newMessageAlerts: boolean
    dailyReports: boolean
    autoReply: boolean
    smsFallbackEnabled: boolean
}

export const defaultSettings: SettingsState = {
    emailNotifications: true,
    newMessageAlerts: true,
    dailyReports: false,
    autoReply: true,
    smsFallbackEnabled: false,
}
