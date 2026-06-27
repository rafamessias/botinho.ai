"use server"

import { z } from "zod"
import { AiTemplateCategory, KnowledgeItemType } from "@/lib/types/enums"
import { BaseActionResponse, handleAction, resolveCompanyContext } from "./utils"
import {
  createAiTemplate,
  createKnowledgeItem,
  createQuickAnswer,
  deleteAiTemplate,
  deleteKnowledgeItem,
  deleteQuickAnswer,
  listAiTrainingData,
  updateAiTemplate,
  updateKnowledgeItem,
  updateQuickAnswer,
} from "@/lib/firebase/services/ai-training-service"
import { summarizeUrlContent } from "@/lib/firebase/ai/generate"
import {
  knowledgeItemInputSchema,
  resolveKnowledgeItemInput,
} from "@/lib/knowledge/resolve-knowledge-input"

export const getAiTrainingDataAction = async (): Promise<
  BaseActionResponse<Awaited<ReturnType<typeof listAiTrainingData>>>
> =>
  handleAction(async () => {
    const { companyId } = await resolveCompanyContext()
    const data = await listAiTrainingData(companyId)
    return { success: true, data }
  })

const updateKnowledgeItemSchema = knowledgeItemInputSchema.and(z.object({ id: z.string().min(1) }))

export const createKnowledgeItemAction = async (
  input: z.infer<typeof knowledgeItemInputSchema>,
): Promise<BaseActionResponse<{ knowledgeItem: Awaited<ReturnType<typeof createKnowledgeItem>> }>> =>
  handleAction(async () => {
    const payload = knowledgeItemInputSchema.parse(input)
    const { companyId, userId } = await resolveCompanyContext({ requireCanPost: true })

    const resolved = await resolveKnowledgeItemInput(payload)

    let urlSummary: string | undefined
    if (resolved.type === KnowledgeItemType.URL) {
      urlSummary = await summarizeUrlContent({ url: resolved.content, title: resolved.title })
    }

    const knowledgeItem = await createKnowledgeItem(companyId, userId, { ...resolved, urlSummary })
    return { success: true, data: { knowledgeItem }, message: "Knowledge item created" }
  })

export const updateKnowledgeItemAction = async (
  input: z.infer<typeof updateKnowledgeItemSchema>,
): Promise<BaseActionResponse<{ knowledgeItem: Awaited<ReturnType<typeof updateKnowledgeItem>> }>> =>
  handleAction(async () => {
    const payload = updateKnowledgeItemSchema.parse(input)
    const { companyId } = await resolveCompanyContext({ requireCanPost: true })

    const { id, ...itemInput } = payload
    const resolved = await resolveKnowledgeItemInput(itemInput)

    let urlSummary: string | undefined
    if (resolved.type === KnowledgeItemType.URL) {
      urlSummary = await summarizeUrlContent({ url: resolved.content, title: resolved.title })
    }

    const knowledgeItem = await updateKnowledgeItem(companyId, id, { ...resolved, urlSummary })
    return { success: true, data: { knowledgeItem }, message: "Knowledge item updated" }
  })

export const deleteKnowledgeItemAction = async (input: { id: string }): Promise<BaseActionResponse> =>
  handleAction(async () => {
    const payload = z.object({ id: z.string().min(1) }).parse(input)
    const { companyId } = await resolveCompanyContext({ requireCanPost: true })
    await deleteKnowledgeItem(companyId, payload.id)
    return { success: true, message: "Knowledge item deleted" }
  })

const quickAnswerBaseSchema = z.object({ content: z.string().trim().min(1) })

export const createQuickAnswerAction = async (
  input: z.infer<typeof quickAnswerBaseSchema>,
): Promise<BaseActionResponse<{ quickAnswer: Awaited<ReturnType<typeof createQuickAnswer>> }>> =>
  handleAction(async () => {
    const payload = quickAnswerBaseSchema.parse(input)
    const { companyId, userId } = await resolveCompanyContext({ requireCanPost: true })
    const quickAnswer = await createQuickAnswer(companyId, userId, payload.content)
    return { success: true, data: { quickAnswer }, message: "Quick answer created" }
  })

export const updateQuickAnswerAction = async (
  input: z.infer<typeof quickAnswerBaseSchema> & { id: string },
): Promise<BaseActionResponse<{ quickAnswer: Awaited<ReturnType<typeof updateQuickAnswer>> }>> =>
  handleAction(async () => {
    const payload = quickAnswerBaseSchema.extend({ id: z.string().min(1) }).parse(input)
    const { companyId } = await resolveCompanyContext({ requireCanPost: true })
    const quickAnswer = await updateQuickAnswer(companyId, payload.id, payload.content)
    return { success: true, data: { quickAnswer }, message: "Quick answer updated" }
  })

export const deleteQuickAnswerAction = async (input: { id: string }): Promise<BaseActionResponse> =>
  handleAction(async () => {
    const payload = z.object({ id: z.string().min(1) }).parse(input)
    const { companyId } = await resolveCompanyContext({ requireCanPost: true })
    await deleteQuickAnswer(companyId, payload.id)
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

export const createAiTemplateAction = async (
  input: z.infer<typeof templateBaseSchema>,
): Promise<BaseActionResponse<{ template: Awaited<ReturnType<typeof createAiTemplate>> }>> =>
  handleAction(async () => {
    const payload = templateBaseSchema.parse(input)
    const { companyId, userId } = await resolveCompanyContext({ requireCanPost: true })
    const template = await createAiTemplate(companyId, userId, payload)
    return { success: true, data: { template }, message: "Template created" }
  })

export const updateAiTemplateAction = async (
  input: z.infer<typeof templateBaseSchema> & { id: string },
): Promise<BaseActionResponse<{ template: Awaited<ReturnType<typeof updateAiTemplate>> }>> =>
  handleAction(async () => {
    const payload = templateBaseSchema.extend({ id: z.string().min(1) }).parse(input)
    const { companyId } = await resolveCompanyContext({ requireCanPost: true })
    const template = await updateAiTemplate(companyId, payload.id, payload)
    return { success: true, data: { template }, message: "Template updated" }
  })

export const deleteAiTemplateAction = async (input: { id: string }): Promise<BaseActionResponse> =>
  handleAction(async () => {
    const payload = z.object({ id: z.string().min(1) }).parse(input)
    const { companyId } = await resolveCompanyContext({ requireCanPost: true })
    await deleteAiTemplate(companyId, payload.id)
    return { success: true, message: "Template deleted" }
  })
