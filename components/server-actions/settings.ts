"use server"

import { prisma } from "@/prisma/lib/prisma"
import { z } from "zod"
import { BaseActionResponse, handleAction, resolveCompanyContext } from "./utils"

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
): Promise<BaseActionResponse> =>
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

        await prisma.companyWhatsappNumber.delete({ where: { id: payload.id } })

        return {
            success: true,
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


