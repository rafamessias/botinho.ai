"use server"

import { prisma } from "@/prisma/lib/prisma"
import { z } from "zod"
import { BaseActionResponse, handleAction, resolveCompanyContext } from "./utils"

// WhatsApp Backend Integration
const WHATSAPP_CONTROLLER_URL = process.env.WHATSAPP_CONTROLLER_URL || process.env.NEXT_PUBLIC_WHATSAPP_CONTROLLER_URL || "http://localhost:8080"

const companyScopeSchema = z.object({
    companyId: z.number().int().positive().optional(),
})

const whatsappNumberBaseSchema = z.object({
    displayName: z.string().trim().min(1, "Name is required"),
    phoneNumber: z.string().trim().min(3, "Phone number is required"),
    isConnected: z.boolean().optional(),
})

const whatsappNumberCreateSchema = companyScopeSchema.merge(whatsappNumberBaseSchema)

const whatsappNumberUpdateSchema = companyScopeSchema.merge(
    whatsappNumberBaseSchema.extend({
        id: z.string().cuid(),
        isConnected: z.boolean().optional(),
        messagesThisMonth: z.number().int().min(0).optional(),
    }),
)

const whatsappNumberDeleteSchema = companyScopeSchema.merge(
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

type SettingsOverview = {
    settings: {
        emailNotifications: boolean
        newMessageAlerts: boolean
        dailyReports: boolean
        autoReply: boolean
    }
    whatsappNumbers: Array<{
        id: string
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
    }>
}

export const getSettingsOverviewAction = async (input?: z.input<typeof getSettingsOverviewSchema>): Promise<BaseActionResponse<SettingsOverview>> =>
    handleAction(async () => {
        const parsed = getSettingsOverviewSchema.parse(input ?? {})
        const { companyId } = await resolveCompanyContext({ companyId: parsed.companyId })

        const [settingsRecord, whatsappNumbers] = await prisma.$transaction([
            prisma.companySettings.upsert({
                where: { companyId },
                create: {
                    companyId,
                },
                update: {},
            }),
            prisma.companyWhatsappNumber.findMany({
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
                whatsappNumbers,
            },
        }
    })

export const createWhatsappNumberAction = async (
    input: z.input<typeof whatsappNumberCreateSchema>,
): Promise<
    BaseActionResponse<{
        whatsappNumber: Awaited<ReturnType<typeof prisma.companyWhatsappNumber.create>>
    }>
> =>
    handleAction(async () => {
        const payload = whatsappNumberCreateSchema.parse(input)
        const { companyId } = await resolveCompanyContext({ companyId: payload.companyId, requireAdmin: true })

        const whatsappNumber = await prisma.companyWhatsappNumber.create({
            data: {
                companyId,
                displayName: payload.displayName,
                phoneNumber: payload.phoneNumber,
                ...(payload.isConnected ? { isConnected: true, lastSyncedAt: new Date() } : {}),
            },
        })

        return {
            success: true,
            data: { whatsappNumber },
            message: "WhatsApp number created",
        }
    })

export const updateWhatsappNumberAction = async (
    input: z.input<typeof whatsappNumberUpdateSchema>,
): Promise<
    BaseActionResponse<{
        whatsappNumber: Awaited<ReturnType<typeof prisma.companyWhatsappNumber.update>>
    }>
> =>
    handleAction(async () => {
        const payload = whatsappNumberUpdateSchema.parse(input)
        const { companyId } = await resolveCompanyContext({ companyId: payload.companyId, requireAdmin: true })

        const existing = await prisma.companyWhatsappNumber.findUnique({
            where: { id: payload.id },
            select: { companyId: true },
        })

        if (!existing || existing.companyId !== companyId) {
            return { success: false, error: "WhatsApp number not found" }
        }

        const whatsappNumber = await prisma.companyWhatsappNumber.update({
            where: { id: payload.id },
            data: {
                displayName: payload.displayName,
                phoneNumber: payload.phoneNumber,
                ...(payload.isConnected !== undefined && { isConnected: payload.isConnected }),
                ...(payload.messagesThisMonth !== undefined && { messagesThisMonth: payload.messagesThisMonth }),
                ...(payload.isConnected === true ? { lastSyncedAt: new Date() } : {}),
                ...(payload.isConnected === false ? { lastSyncedAt: null } : {}),
            },
        })

        return {
            success: true,
            data: { whatsappNumber },
            message: "WhatsApp number updated",
        }
    })

export const deleteWhatsappNumberAction = async (
    input: z.input<typeof whatsappNumberDeleteSchema>,
): Promise<
    BaseActionResponse<{
        whatsappNumber: Awaited<ReturnType<typeof prisma.companyWhatsappNumber.delete>>
    }>
> =>
    handleAction(async () => {
        const payload = whatsappNumberDeleteSchema.parse(input)
        const { companyId } = await resolveCompanyContext({ companyId: payload.companyId, requireAdmin: true })

        const existing = await prisma.companyWhatsappNumber.findUnique({
            where: { id: payload.id },
            select: { companyId: true },
        })

        if (!existing || existing.companyId !== companyId) {
            return { success: false, error: "WhatsApp number not found" }
        }

        // Delete the WhatsApp number record
        const whatsappNumber = await prisma.companyWhatsappNumber.delete({
            where: { id: payload.id },
        })

        return {
            success: true,
            data: { whatsappNumber },
            message: "WhatsApp number deleted",
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
        const tenantId = `company-${companyId}`

        console.log("Creating WhatsApp session for tenant:", tenantId, "Controller URL:", WHATSAPP_CONTROLLER_URL)

        // Call Controller API to create session
        const controllerResponse = await fetch(`${WHATSAPP_CONTROLLER_URL}/sessions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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

export const createWhatsappNumberFromSessionAction = async (
    input: z.input<typeof createWhatsappNumberFromSessionSchema>,
): Promise<
    BaseActionResponse<{
        whatsappNumber: Awaited<ReturnType<typeof prisma.companyWhatsappNumber.upsert>>
    }>
> =>
    handleAction(async () => {
        const payload = createWhatsappNumberFromSessionSchema.parse(input)
        const { companyId } = await resolveCompanyContext({ companyId: payload.companyId, requireAdmin: true })

        // Create tenant ID from company ID
        const tenantId = `company-${companyId}`

        // Use upsert to create or update the WhatsApp number record
        const whatsappNumber = await prisma.companyWhatsappNumber.upsert({
            where: {
                companyId_phoneNumber: {
                    companyId,
                    phoneNumber: payload.phoneNumber,
                },
            },
            create: {
                companyId,
                displayName: payload.displayName,
                phoneNumber: payload.phoneNumber,
                isConnected: payload.status === "connected",
                lastSyncedAt: payload.status === "connected" ? new Date() : null,
                remoteAuthKey: payload.sessionId,
                tenantId,
                workerId: payload.workerId,
                wsUrl: payload.wsUrl,
                status: payload.status,
            },
            update: {
                displayName: payload.displayName,
                isConnected: payload.status === "connected",
                lastSyncedAt: payload.status === "connected" ? new Date() : null,
                remoteAuthKey: payload.sessionId,
                tenantId,
                workerId: payload.workerId,
                wsUrl: payload.wsUrl,
                status: payload.status,
            },
        })

        return {
            success: true,
            data: { whatsappNumber },
            message: "WhatsApp number created",
        }
    })

const updateWhatsappSessionStatusSchema = companyScopeSchema.extend({
    whatsappNumberId: z.string().cuid(),
    status: z.enum(["need_scan", "authenticated", "connected", "disconnected", "auth_failure"]),
    displayName: z.string().optional(),
    phoneNumber: z.string().optional(),
})

export const updateWhatsappSessionStatusAction = async (
    input: z.input<typeof updateWhatsappSessionStatusSchema>,
): Promise<
    BaseActionResponse<{
        whatsappNumber: Awaited<ReturnType<typeof prisma.companyWhatsappNumber.update>>
    }>
> =>
    handleAction(async () => {
        const payload = updateWhatsappSessionStatusSchema.parse(input)
        const { companyId } = await resolveCompanyContext({ companyId: payload.companyId, requireAdmin: true })

        // Verify the WhatsApp number belongs to the company
        const existing = await prisma.companyWhatsappNumber.findUnique({
            where: { id: payload.whatsappNumberId },
            select: { companyId: true },
        })

        if (!existing || existing.companyId !== companyId) {
            return { success: false, error: "WhatsApp number not found" }
        }

        // Determine connection status based on status value
        const isConnected = payload.status === "connected"
        const lastSyncedAt = isConnected ? new Date() : null

        // Update the WhatsApp number
        const whatsappNumber = await prisma.companyWhatsappNumber.update({
            where: { id: payload.whatsappNumberId },
            data: {
                isConnected,
                lastSyncedAt,
                status: payload.status,
                ...(payload.displayName && { displayName: payload.displayName }),
                ...(payload.phoneNumber && { phoneNumber: payload.phoneNumber }),
            },
        })

        return {
            success: true,
            data: { whatsappNumber },
            message: "WhatsApp session status updated",
        }
    })


