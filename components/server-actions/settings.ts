"use server"

import { prisma } from "@/prisma/lib/prisma"
import { z } from "zod"
import { BaseActionResponse, handleAction, resolveCompanyContext } from "./utils"

// WhatsApp Backend Integration
const WHATSAPP_CONTROLLER_URL = process.env.WHATSAPP_CONTROLLER_URL || process.env.NEXT_PUBLIC_WHATSAPP_CONTROLLER_URL || "http://localhost:8080"

const companyScopeSchema = z.object({
    companyId: z.number().int().positive().optional(),
})

const sessionAssignmentUpdateSchema = companyScopeSchema.merge(
    z.object({
        id: z.string().cuid(),
        displayName: z.string().trim().min(1, "Name is required"),
    }),
)

const sessionAssignmentDeleteSchema = companyScopeSchema.merge(
    z.object({
        id: z.string().cuid(),
    }),
)

const companySettingsUpdateSchema = companyScopeSchema.merge(
    z.object({
        emailNotifications: z.boolean(),
        newMessageAlerts: z.boolean(),
        dailyReports: z.boolean(),
        autoReply: z.boolean(),
    }),
)

const getSettingsOverviewSchema = companyScopeSchema

type RemoteAuthMetadata = {
    wsUrl: string | null
    remoteAuthKey: string | null
    tenantId: string | null
}

type SettingsOverview = {
    settings: {
        emailNotifications: boolean
        newMessageAlerts: boolean
        dailyReports: boolean
        autoReply: boolean
    }
    sessionAssignments: Array<{
        id: string
        sessionId: string
        displayName: string
        phoneNumber: string
        isConnected: boolean
        messagesThisMonth: number
        lastSyncedAt: Date | null
        createdAt: Date
        updatedAt: Date
        wsUrl: string | null
        workerId: string | null
        remoteAuthKey: string | null
        status: string | null
        remoteAuthNamespace: string | null
        remoteAuthData: RemoteAuthMetadata
    }>
}

const parseRemoteAuthData = (value: unknown): RemoteAuthMetadata => {
    if (!value || typeof value !== "object") {
        return {
            wsUrl: null,
            remoteAuthKey: null,
            tenantId: null,
        }
    }

    const data = value as Record<string, unknown>

    return {
        wsUrl: typeof data.wsUrl === "string" ? data.wsUrl : null,
        remoteAuthKey: typeof data.remoteAuthKey === "string" ? data.remoteAuthKey : null,
        tenantId: typeof data.tenantId === "string" ? data.tenantId : null,
    }
}

export const getSettingsOverviewAction = async (input?: z.input<typeof getSettingsOverviewSchema>): Promise<BaseActionResponse<SettingsOverview>> =>
    handleAction(async () => {
        const parsed = getSettingsOverviewSchema.parse(input ?? {})
        const { companyId } = await resolveCompanyContext({ companyId: parsed.companyId })

        const [settingsRecord, sessionAssignments] = await prisma.$transaction([
            prisma.companySettings.upsert({
                where: { companyId },
                create: {
                    companyId,
                },
                update: {},
            }),
            prisma.sessionAssignment.findMany({
                where: { companyId },
                orderBy: { createdAt: "desc" },
            }),
        ])

        return {
            success: true,
            data: {
                settings: {
                    emailNotifications: settingsRecord.emailNotifications,
                    newMessageAlerts: settingsRecord.newMessageAlerts,
                    dailyReports: settingsRecord.dailyReports,
                    autoReply: settingsRecord.autoReply,
                },
                sessionAssignments: sessionAssignments.map((assignment) => {
                    const remoteAuth = parseRemoteAuthData(assignment.remoteAuthData)
                    return {
                        id: assignment.id,
                        sessionId: assignment.sessionId,
                        displayName: assignment.displayName ?? assignment.phoneNumber ?? assignment.sessionId,
                        phoneNumber: assignment.phoneNumber ?? "",
                        isConnected: assignment.isConnected,
                        messagesThisMonth: 0,
                        lastSyncedAt: assignment.isConnected ? assignment.updatedAt : null,
                        createdAt: assignment.createdAt,
                        updatedAt: assignment.updatedAt,
                        wsUrl: remoteAuth.wsUrl,
                        workerId: assignment.workerId,
                        remoteAuthKey: remoteAuth.remoteAuthKey ?? assignment.sessionId,
                        status: assignment.status ?? null,
                        remoteAuthNamespace: assignment.remoteAuthNamespace ?? null,
                        remoteAuthData: remoteAuth,
                    }
                }),
            },
        }
    })

export const updateWhatsappNumberAction = async (
    input: z.input<typeof sessionAssignmentUpdateSchema>,
): Promise<
    BaseActionResponse<{
        sessionAssignment: Awaited<ReturnType<typeof prisma.sessionAssignment.update>>
    }>
> =>
    handleAction(async () => {
        const payload = sessionAssignmentUpdateSchema.parse(input)
        const { companyId } = await resolveCompanyContext({ companyId: payload.companyId, requireAdmin: true })

        const existing = await prisma.sessionAssignment.findUnique({
            where: { id: payload.id },
            select: { companyId: true },
        })

        if (!existing || existing.companyId !== companyId) {
            return { success: false, error: "WhatsApp number not found" }
        }

        const sessionAssignment = await prisma.sessionAssignment.update({
            where: { id: payload.id },
            data: {
                displayName: payload.displayName,
            },
        })

        return {
            success: true,
            data: { sessionAssignment },
            message: "Session assignment updated",
        }
    })

export const deleteWhatsappNumberAction = async (
    input: z.input<typeof sessionAssignmentDeleteSchema>,
): Promise<
    BaseActionResponse<{
        sessionAssignment: Awaited<ReturnType<typeof prisma.sessionAssignment.delete>>
    }>
> =>
    handleAction(async () => {
        const payload = sessionAssignmentDeleteSchema.parse(input)
        const { companyId } = await resolveCompanyContext({ companyId: payload.companyId, requireAdmin: true })

        const existing = await prisma.sessionAssignment.findUnique({
            where: { id: payload.id },
            select: { companyId: true },
        })

        if (!existing || existing.companyId !== companyId) {
            return { success: false, error: "WhatsApp number not found" }
        }

        const sessionAssignment = await prisma.sessionAssignment.delete({
            where: { id: payload.id },
        })

        return {
            success: true,
            data: { sessionAssignment },
            message: "Session assignment deleted",
        }
    })

export const updateCompanySettingsAction = async (
    input: z.input<typeof companySettingsUpdateSchema>,
): Promise<
    BaseActionResponse<{
        settings: Awaited<ReturnType<typeof prisma.companySettings.update>>
    }>
> =>
    handleAction(async () => {
        const payload = companySettingsUpdateSchema.parse(input)
        const { companyId } = await resolveCompanyContext({ companyId: payload.companyId, requireAdmin: true })

        const settings = await prisma.companySettings.upsert({
            where: { companyId },
            update: {
                emailNotifications: payload.emailNotifications,
                newMessageAlerts: payload.newMessageAlerts,
                dailyReports: payload.dailyReports,
                autoReply: payload.autoReply,
            },
            create: {
                companyId,
                emailNotifications: payload.emailNotifications,
                newMessageAlerts: payload.newMessageAlerts,
                dailyReports: payload.dailyReports,
                autoReply: payload.autoReply,
            },
        })

        return {
            success: true,
            data: { settings },
            message: "Settings updated",
        }
    })

// WhatsApp Backend Integration Actions
const createWhatsappSessionSchema = companyScopeSchema

export const createWhatsappSessionAction = async (
    input: z.input<typeof createWhatsappSessionSchema>,
): Promise<
    BaseActionResponse<{
        sessionId: string
        wsUrl: string
        workerId: string
    }>
> =>
    handleAction(async () => {
        const payload = createWhatsappSessionSchema.parse(input)
        const { companyId } = await resolveCompanyContext({ companyId: payload.companyId, requireAdmin: true })

        // Create tenant ID from company ID
        const tenantId = companyId

        console.log("Creating WhatsApp session for tenant:", tenantId, "Controller URL:", WHATSAPP_CONTROLLER_URL)

        // Call Controller API to create session
        const controllerResponse = await fetch(`${WHATSAPP_CONTROLLER_URL}/sessions`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.CONTROLLER_TOKEN}` },
            body: JSON.stringify({ tenantId }),
        })

        console.log("Controller response status:", controllerResponse.status)

        if (!controllerResponse.ok) {
            const errorText = await controllerResponse.text().catch(() => "Unknown error")
            console.error("Controller API error:", controllerResponse.status, errorText)
            return {
                success: false,
                error: `Failed to create WhatsApp session: ${controllerResponse.status} ${errorText}`,
            }
        }

        const controllerData = await controllerResponse.json()
        console.log("Controller response data:", controllerData)
        const { sessionId, wsUrl, workerId } = controllerData

        if (!sessionId || !wsUrl || !workerId) {
            console.error("Invalid response from Controller API:", { sessionId, wsUrl, workerId })
            return {
                success: false,
                error: "Invalid response from Controller API",
            }
        }

        return {
            success: true,
            data: {
                sessionId,
                wsUrl,
                workerId,
            },
            message: "WhatsApp session created",
        }
    })

const createWhatsappNumberFromSessionSchema = companyScopeSchema.extend({
    sessionId: z.string(),
    workerId: z.string(),
    wsUrl: z.string(),
    phoneNumber: z.string().trim().min(1),
    displayName: z.string().trim().min(1),
    status: z.enum(["need_scan", "authenticated", "connected", "disconnected", "auth_failure"]),
})

const updateWhatsappSessionStatusSchema = companyScopeSchema.extend({
    sessionAssignmentId: z.string().cuid(),
    status: z.enum(["need_scan", "authenticated", "connected", "disconnected", "auth_failure"]),
    displayName: z.string().optional(),
    phoneNumber: z.string().optional(),
})

export const updateWhatsappSessionStatusAction = async (
    input: z.input<typeof updateWhatsappSessionStatusSchema>,
): Promise<
    BaseActionResponse<{
        sessionAssignment: Awaited<ReturnType<typeof prisma.sessionAssignment.update>>
    }>
> =>
    handleAction(async () => {
        const payload = updateWhatsappSessionStatusSchema.parse(input)
        const { companyId } = await resolveCompanyContext({ companyId: payload.companyId, requireAdmin: true })

        const existing = await prisma.sessionAssignment.findUnique({
            where: { id: payload.sessionAssignmentId },
            select: { companyId: true, remoteAuthData: true },
        })

        if (!existing || existing.companyId !== companyId) {
            return { success: false, error: "WhatsApp number not found" }
        }

        const sessionAssignment = await prisma.sessionAssignment.update({
            where: { id: payload.sessionAssignmentId },
            data: {
                isConnected: payload.status === "connected",
                status: payload.status,
                ...(payload.displayName && { displayName: payload.displayName }),
                ...(payload.phoneNumber && { phoneNumber: payload.phoneNumber }),
                remoteAuthData: existing.remoteAuthData ?? undefined,
            },
        })

        return {
            success: true,
            data: { sessionAssignment },
            message: "Session assignment status updated",
        }
    })


