"use server"

import { z } from "zod"
import { BaseActionResponse, handleAction, resolveCompanyContext } from "./utils"

const companyScopeSchema = z.object({
    companyId: z.string().optional(),
})

const companySettingsUpdateSchema = companyScopeSchema.merge(
    z.object({
        emailNotifications: z.boolean(),
        newMessageAlerts: z.boolean(),
        dailyReports: z.boolean(),
        autoReply: z.boolean(),
        smsFallbackEnabled: z.boolean().optional(),
    }),
)

const getSettingsOverviewSchema = companyScopeSchema

type SettingsOverview = {
    settings: {
        emailNotifications: boolean
        newMessageAlerts: boolean
        dailyReports: boolean
        autoReply: boolean
        smsFallbackEnabled: boolean
    }
}

export const getSettingsOverviewAction = async (
    input?: z.input<typeof getSettingsOverviewSchema>,
): Promise<BaseActionResponse<SettingsOverview>> =>
    handleAction(async () => {
        const parsed = getSettingsOverviewSchema.parse(input ?? {})
        const { companyId } = await resolveCompanyContext({ companyId: parsed.companyId })

        const { adminDb } = await import("@/lib/firebase/admin")
        const { collections, companySubcollections, settingsDocIds } = await import("@/lib/firebase/collections")
        const { FieldValue } = await import("firebase-admin/firestore")

        const settingsRef = adminDb
            .collection(collections.companies)
            .doc(companyId)
            .collection(companySubcollections.settings)
            .doc(settingsDocIds.default)

        const settingsSnap = await settingsRef.get()
        if (!settingsSnap.exists) {
            await settingsRef.set({
                emailNotifications: true,
                newMessageAlerts: true,
                dailyReports: false,
                autoReply: true,
                smsFallbackEnabled: false,
                updatedAt: FieldValue.serverTimestamp(),
            })
        }

        const settingsRecord = (await settingsRef.get()).data()!

        return {
            success: true,
            data: {
                settings: {
                    emailNotifications: settingsRecord.emailNotifications !== false,
                    newMessageAlerts: settingsRecord.newMessageAlerts !== false,
                    dailyReports: settingsRecord.dailyReports === true,
                    autoReply: settingsRecord.autoReply !== false,
                    smsFallbackEnabled: settingsRecord.smsFallbackEnabled === true,
                },
            },
        }
    })

export const updateCompanySettingsAction = async (
    input: z.input<typeof companySettingsUpdateSchema>,
): Promise<BaseActionResponse<{ settings: SettingsOverview["settings"] }>> =>
    handleAction(async () => {
        const payload = companySettingsUpdateSchema.parse(input)
        const { companyId } = await resolveCompanyContext({ companyId: payload.companyId, requireAdmin: true })

        const { adminDb } = await import("@/lib/firebase/admin")
        const { collections, companySubcollections, settingsDocIds } = await import("@/lib/firebase/collections")
        const { FieldValue } = await import("firebase-admin/firestore")

        const settingsRef = adminDb
            .collection(collections.companies)
            .doc(companyId)
            .collection(companySubcollections.settings)
            .doc(settingsDocIds.default)

        const settings = {
            emailNotifications: payload.emailNotifications,
            newMessageAlerts: payload.newMessageAlerts,
            dailyReports: payload.dailyReports,
            autoReply: payload.autoReply,
            smsFallbackEnabled: payload.smsFallbackEnabled ?? false,
            updatedAt: FieldValue.serverTimestamp(),
        }

        await settingsRef.set(settings, { merge: true })

        return {
            success: true,
            data: {
                settings: {
                    emailNotifications: settings.emailNotifications,
                    newMessageAlerts: settings.newMessageAlerts,
                    dailyReports: settings.dailyReports,
                    autoReply: settings.autoReply,
                    smsFallbackEnabled: settings.smsFallbackEnabled,
                },
            },
            message: "Settings updated",
        }
    })
