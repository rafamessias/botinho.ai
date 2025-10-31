"use server"

import { prisma } from "@/prisma/lib/prisma"
import { AiTemplateCategory, KnowledgeItemType } from "@/lib/generated/prisma"
import { z } from "zod"
import { BaseActionResponse, handleAction, resolveCompanyContext } from "./utils"

export const getAiTrainingDataAction = async (): Promise<
    BaseActionResponse<{
        knowledgeBase: Array<{
            id: string
            type: KnowledgeItemType
            title: string
            content: string
            createdAt: Date
            updatedAt: Date
        }>
        quickAnswers: Array<{
            id: string
            title: string
            content: string
            createdAt: Date
            updatedAt: Date
        }>
        templates: Array<{
            id: string
            name: string
            content: string
            category: AiTemplateCategory
            createdAt: Date
            updatedAt: Date
            options: Array<{
                id: string
                label: string
                value: string
            }>
        }>
    }>
> => handleAction(async () => {
    const { companyId } = await resolveCompanyContext()

    const [knowledgeBase, quickAnswers, templates] = await prisma.$transaction([
        prisma.knowledgeItem.findMany({
            where: { companyId },
            orderBy: { createdAt: "desc" },
        }),
        prisma.quickAnswer.findMany({
            where: { companyId },
            orderBy: { createdAt: "desc" },
        }),
        prisma.aiTemplate.findMany({
            where: { companyId },
            orderBy: { createdAt: "desc" },
            include: { options: { orderBy: { createdAt: "asc" } } },
        }),
    ])

    return {
        success: true,
        data: {
            knowledgeBase,
            quickAnswers,
            templates,
        },
    }
})

const knowledgeItemBaseSchema = z.object({
    title: z.string().trim().min(1),
    content: z.string().trim().min(1),
    type: z.nativeEnum(KnowledgeItemType),
})

export const createKnowledgeItemAction = async (input: z.infer<typeof knowledgeItemBaseSchema>): Promise<
    BaseActionResponse<{ knowledgeItem: Awaited<ReturnType<typeof prisma.knowledgeItem.create>> }>
> => handleAction(async () => {
    const payload = knowledgeItemBaseSchema.parse(input)
    const { companyId, userId } = await resolveCompanyContext({ requireCanPost: true })

    const knowledgeItem = await prisma.knowledgeItem.create({
        data: {
            companyId,
            title: payload.title,
            content: payload.content,
            type: payload.type,
            createdById: userId,
        },
    })

    return {
        success: true,
        data: { knowledgeItem },
        message: "Knowledge item created",
    }
})

const updateKnowledgeItemSchema = knowledgeItemBaseSchema.extend({
    id: z.string().cuid(),
})

export const updateKnowledgeItemAction = async (input: z.infer<typeof updateKnowledgeItemSchema>): Promise<
    BaseActionResponse<{ knowledgeItem: Awaited<ReturnType<typeof prisma.knowledgeItem.update>> }>
> => handleAction(async () => {
    const payload = updateKnowledgeItemSchema.parse(input)
    const { companyId } = await resolveCompanyContext({ requireCanPost: true })

    const existing = await prisma.knowledgeItem.findUnique({
        where: { id: payload.id },
        select: { companyId: true },
    })

    if (!existing || existing.companyId !== companyId) {
        return { success: false, error: "Knowledge item not found" }
    }

    const knowledgeItem = await prisma.knowledgeItem.update({
        where: { id: payload.id },
        data: {
            title: payload.title,
            content: payload.content,
            type: payload.type,
        },
    })

    return {
        success: true,
        data: { knowledgeItem },
        message: "Knowledge item updated",
    }
})

const deleteKnowledgeItemSchema = z.object({
    id: z.string().cuid(),
})

export const deleteKnowledgeItemAction = async (input: z.infer<typeof deleteKnowledgeItemSchema>): Promise<BaseActionResponse> =>
    handleAction(async () => {
        const payload = deleteKnowledgeItemSchema.parse(input)
        const { companyId } = await resolveCompanyContext({ requireCanPost: true })

        const existing = await prisma.knowledgeItem.findUnique({
            where: { id: payload.id },
            select: { companyId: true },
        })

        if (!existing || existing.companyId !== companyId) {
            return { success: false, error: "Knowledge item not found" }
        }

        await prisma.knowledgeItem.delete({ where: { id: payload.id } })

        return { success: true, message: "Knowledge item deleted" }
    })

const quickAnswerBaseSchema = z.object({
    content: z.string().trim().min(1),
})

export const createQuickAnswerAction = async (input: z.infer<typeof quickAnswerBaseSchema>): Promise<
    BaseActionResponse<{ quickAnswer: Awaited<ReturnType<typeof prisma.quickAnswer.create>> }>
> => handleAction(async () => {
    const payload = quickAnswerBaseSchema.parse(input)
    const { companyId, userId } = await resolveCompanyContext({ requireCanPost: true })

    const quickAnswer = await prisma.quickAnswer.create({
        data: {
            companyId,
            title: payload.content,
            content: payload.content,
            createdById: userId,
        },
    })

    return {
        success: true,
        data: { quickAnswer },
        message: "Quick answer created",
    }
})

const updateQuickAnswerSchema = quickAnswerBaseSchema.extend({
    id: z.string().cuid(),
})

export const updateQuickAnswerAction = async (input: z.infer<typeof updateQuickAnswerSchema>): Promise<
    BaseActionResponse<{ quickAnswer: Awaited<ReturnType<typeof prisma.quickAnswer.update>> }>
> => handleAction(async () => {
    const payload = updateQuickAnswerSchema.parse(input)
    const { companyId } = await resolveCompanyContext({ requireCanPost: true })

    const existing = await prisma.quickAnswer.findUnique({
        where: { id: payload.id },
        select: { companyId: true },
    })

    if (!existing || existing.companyId !== companyId) {
        return { success: false, error: "Quick answer not found" }
    }

    const quickAnswer = await prisma.quickAnswer.update({
        where: { id: payload.id },
        data: {
            title: payload.content,
            content: payload.content,
        },
    })

    return {
        success: true,
        data: { quickAnswer },
        message: "Quick answer updated",
    }
})

const deleteQuickAnswerSchema = z.object({
    id: z.string().cuid(),
})

export const deleteQuickAnswerAction = async (input: z.infer<typeof deleteQuickAnswerSchema>): Promise<BaseActionResponse> =>
    handleAction(async () => {
        const payload = deleteQuickAnswerSchema.parse(input)
        const { companyId } = await resolveCompanyContext({ requireCanPost: true })

        const existing = await prisma.quickAnswer.findUnique({
            where: { id: payload.id },
            select: { companyId: true },
        })

        if (!existing || existing.companyId !== companyId) {
            return { success: false, error: "Quick answer not found" }
        }

        await prisma.quickAnswer.delete({ where: { id: payload.id } })

        return { success: true, message: "Quick answer deleted" }
    })

const templateOptionSchema = z.object({
    label: z.string().trim().min(1),
    value: z.string().trim().min(1),
})

const templateBaseSchema = z.object({
    name: z.string().trim().min(1),
    content: z.string().trim().min(1),
    category: z.nativeEnum(AiTemplateCategory),
    options: z.array(templateOptionSchema).max(10).optional(),
})

export const createAiTemplateAction = async (input: z.infer<typeof templateBaseSchema>): Promise<
    BaseActionResponse<{
        template: NonNullable<Awaited<ReturnType<typeof prisma.aiTemplate.findUnique>>>
    }>
> => handleAction(async () => {
    const payload = templateBaseSchema.parse(input)
    const { companyId, userId } = await resolveCompanyContext({ requireCanPost: true })

    const template = await prisma.$transaction(async (tx) => {
        const createdTemplate = await tx.aiTemplate.create({
            data: {
                companyId,
                name: payload.name,
                content: payload.content,
                category: payload.category,
                createdById: userId,
            },
        })

        if (payload.options && payload.options.length > 0) {
            await tx.aiTemplateOption.createMany({
                data: payload.options.map((option) => ({
                    templateId: createdTemplate.id,
                    label: option.label,
                    value: option.value,
                })),
            })
        }

        return tx.aiTemplate.findUnique({
            where: { id: createdTemplate.id },
            include: { options: { orderBy: { createdAt: "asc" } } },
        })
    })

    if (!template) {
        throw new Error("Failed to create template")
    }

    return {
        success: true,
        data: { template },
        message: "Template created",
    }
})

const updateAiTemplateSchema = templateBaseSchema.extend({
    id: z.string().cuid(),
})

export const updateAiTemplateAction = async (input: z.infer<typeof updateAiTemplateSchema>): Promise<
    BaseActionResponse<{
        template: NonNullable<Awaited<ReturnType<typeof prisma.aiTemplate.findUnique>>>
    }>
> => handleAction(async () => {
    const payload = updateAiTemplateSchema.parse(input)
    const { companyId } = await resolveCompanyContext({ requireCanPost: true })

    const existing = await prisma.aiTemplate.findUnique({
        where: { id: payload.id },
        select: { companyId: true },
    })

    if (!existing || existing.companyId !== companyId) {
        return { success: false, error: "Template not found" }
    }

    const template = await prisma.$transaction(async (tx) => {
        await tx.aiTemplate.update({
            where: { id: payload.id },
            data: {
                name: payload.name,
                content: payload.content,
                category: payload.category,
            },
        })

        await tx.aiTemplateOption.deleteMany({ where: { templateId: payload.id } })

        if (payload.options && payload.options.length > 0) {
            await tx.aiTemplateOption.createMany({
                data: payload.options.map((option) => ({
                    templateId: payload.id,
                    label: option.label,
                    value: option.value,
                })),
            })
        }

        return tx.aiTemplate.findUnique({
            where: { id: payload.id },
            include: { options: { orderBy: { createdAt: "asc" } } },
        })
    })

    if (!template) {
        throw new Error("Failed to load template")
    }

    return {
        success: true,
        data: { template },
        message: "Template updated",
    }
})

const deleteAiTemplateSchema = z.object({
    id: z.string().cuid(),
})

export const deleteAiTemplateAction = async (input: z.infer<typeof deleteAiTemplateSchema>): Promise<BaseActionResponse> =>
    handleAction(async () => {
        const payload = deleteAiTemplateSchema.parse(input)
        const { companyId } = await resolveCompanyContext({ requireCanPost: true })

        const existing = await prisma.aiTemplate.findUnique({
            where: { id: payload.id },
            select: { companyId: true },
        })

        if (!existing || existing.companyId !== companyId) {
            return { success: false, error: "Template not found" }
        }

        await prisma.aiTemplate.delete({ where: { id: payload.id } })

        return { success: true, message: "Template deleted" }
    })


