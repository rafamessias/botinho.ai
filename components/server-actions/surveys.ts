"use server"

import { z } from "zod"
import { BaseActionResponse, handleAction, resolveCompanyContext } from "./utils"
import {
  archiveSurvey,
  createSurvey,
  deleteSurvey,
  duplicateSurvey,
  getSurvey,
  getSurveyMetrics,
  listActiveSurveys,
  listSurveyResponses,
  listSurveys,
  normalizeQuestions,
  updateSurvey,
  type SurveyRecord,
  type SurveySummary,
} from "@/lib/firebase/services/survey-service"
import {
  startHostedSurvey,
  startInlineSurvey,
  submitHostedSurveyAnswers,
} from "@/lib/survey/survey-delivery"
import { sendOutbound } from "@/lib/messaging/messaging-service"
import { getInboxConversationDetail } from "@/lib/firebase/services/inbox-service"
import type { SurveyAnswer, SurveyDeliveryMode, SurveyQuestionType } from "@/lib/types/survey"

const questionSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["rating", "nps", "single_choice", "multi_choice", "text", "scale"]),
  prompt: z.string().trim().min(1).max(500),
  required: z.boolean().optional(),
  options: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  scaleMin: z.number().optional(),
  scaleMax: z.number().optional(),
})

const surveyInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional(),
  deliveryMode: z.enum(["inline", "hosted", "both"]),
  status: z.enum(["draft", "active", "archived"]).optional(),
  questions: z.array(questionSchema).max(20).optional(),
  introMessage: z.string().trim().max(1000).optional(),
  thankYouMessage: z.string().trim().max(1000).optional(),
})

export type SurveyView = SurveyRecord
export type SurveySummaryView = SurveySummary

export const listSurveysAction = async (): Promise<
  BaseActionResponse<{ surveys: SurveySummaryView[] }>
> =>
  handleAction(async () => {
    const { companyId } = await resolveCompanyContext()
    const surveys = await listSurveys(companyId)
    return { success: true, data: { surveys } }
  })

export const listActiveSurveysAction = async (): Promise<
  BaseActionResponse<{ surveys: SurveyView[] }>
> =>
  handleAction(async () => {
    const { companyId } = await resolveCompanyContext()
    const surveys = await listActiveSurveys(companyId)
    return { success: true, data: { surveys } }
  })

export const getSurveyAction = async (input: {
  surveyId: string
}): Promise<BaseActionResponse<{ survey: SurveyView }>> =>
  handleAction(async () => {
    const payload = z.object({ surveyId: z.string().min(1) }).parse(input)
    const { companyId } = await resolveCompanyContext()
    const survey = await getSurvey(companyId, payload.surveyId)
    if (!survey) throw new Error("Survey not found")
    return { success: true, data: { survey } }
  })

const mapQuestionsForSave = (
  questions: z.infer<typeof questionSchema>[],
): ReturnType<typeof normalizeQuestions> => {
  const withIds = questions.map((q) => ({
    type: q.type as SurveyQuestionType,
    prompt: q.prompt,
    required: q.required,
    options: q.options,
    scaleMin: q.scaleMin,
    scaleMax: q.scaleMax,
  }))
  return normalizeQuestions(withIds).map((created, index) => ({
    ...created,
    id: questions[index]?.id ?? created.id,
  }))
}

export const createSurveyAction = async (
  input: z.infer<typeof surveyInputSchema>,
): Promise<BaseActionResponse<{ survey: SurveyView }>> =>
  handleAction(async () => {
    const payload = surveyInputSchema.parse(input)
    const { companyId, userId } = await resolveCompanyContext({ requireCanPost: true })
    const survey = await createSurvey(companyId, userId, {
      ...payload,
      deliveryMode: payload.deliveryMode as SurveyDeliveryMode,
      questions: payload.questions ? mapQuestionsForSave(payload.questions) : [],
    })
    return { success: true, data: { survey }, message: "Survey created" }
  })

export const updateSurveyAction = async (
  input: z.infer<typeof surveyInputSchema> & { surveyId: string },
): Promise<BaseActionResponse<{ survey: SurveyView }>> =>
  handleAction(async () => {
    const payload = z
      .object({ surveyId: z.string().min(1) })
      .merge(surveyInputSchema.partial())
      .parse(input)
    const { companyId } = await resolveCompanyContext({ requireCanPost: true })
    const { surveyId, ...rest } = payload
    const survey = await updateSurvey(companyId, surveyId, {
      ...rest,
      deliveryMode: rest.deliveryMode as SurveyDeliveryMode | undefined,
      questions: rest.questions ? mapQuestionsForSave(rest.questions) : undefined,
    })
    return { success: true, data: { survey }, message: "Survey updated" }
  })

export const archiveSurveyAction = async (input: {
  surveyId: string
}): Promise<BaseActionResponse> =>
  handleAction(async () => {
    const payload = z.object({ surveyId: z.string().min(1) }).parse(input)
    const { companyId } = await resolveCompanyContext({ requireCanPost: true })
    await archiveSurvey(companyId, payload.surveyId)
    return { success: true, message: "Survey archived" }
  })

export const deleteSurveyAction = async (input: {
  surveyId: string
}): Promise<BaseActionResponse> =>
  handleAction(async () => {
    const payload = z.object({ surveyId: z.string().min(1) }).parse(input)
    const { companyId } = await resolveCompanyContext({ requireCanPost: true })
    await deleteSurvey(companyId, payload.surveyId)
    return { success: true, message: "Survey deleted" }
  })

export const duplicateSurveyAction = async (input: {
  surveyId: string
}): Promise<BaseActionResponse<{ survey: SurveyView }>> =>
  handleAction(async () => {
    const payload = z.object({ surveyId: z.string().min(1) }).parse(input)
    const { companyId, userId } = await resolveCompanyContext({ requireCanPost: true })
    const survey = await duplicateSurvey(companyId, userId, payload.surveyId)
    return { success: true, data: { survey }, message: "Survey duplicated" }
  })

export const getSurveyMetricsAction = async (input: {
  surveyId: string
}): Promise<BaseActionResponse<{ metrics: Awaited<ReturnType<typeof getSurveyMetrics>> }>> =>
  handleAction(async () => {
    const payload = z.object({ surveyId: z.string().min(1) }).parse(input)
    const { companyId } = await resolveCompanyContext()
    const metrics = await getSurveyMetrics(companyId, payload.surveyId)
    return { success: true, data: { metrics } }
  })

export const listSurveyResponsesAction = async (input: {
  surveyId: string
}): Promise<
  BaseActionResponse<{ responses: Awaited<ReturnType<typeof listSurveyResponses>> }>
> =>
  handleAction(async () => {
    const payload = z.object({ surveyId: z.string().min(1) }).parse(input)
    const { companyId } = await resolveCompanyContext()
    const responses = await listSurveyResponses(companyId, payload.surveyId)
    return { success: true, data: { responses } }
  })

const sendSurveySchema = z.object({
  surveyId: z.string().min(1),
  conversationId: z.string().min(1),
  deliveryMode: z.enum(["inline", "hosted"]).optional(),
  locale: z.string().optional(),
})

type SendSurveyResult = { responseId: string; url?: string }

export const sendSurveyAction = async (
  input: z.infer<typeof sendSurveySchema>,
): Promise<BaseActionResponse<SendSurveyResult>> =>
  handleAction(async (): Promise<BaseActionResponse<SendSurveyResult>> => {
    const payload = sendSurveySchema.parse(input)
    const { companyId, userId } = await resolveCompanyContext({ requireCanPost: true })

    const conversation = await getInboxConversationDetail({
      companyId,
      conversationId: payload.conversationId,
    })
    if (!conversation) throw new Error("Conversation not found")

    const survey = await getSurvey(companyId, payload.surveyId)
    if (!survey) throw new Error("Survey not found")

    const preferredMode =
      payload.deliveryMode ??
      (survey.deliveryMode === "both" ? "hosted" : survey.deliveryMode === "inline" ? "inline" : "hosted")

    const locale = payload.locale ?? "en"
    const customerPhone = conversation.customer?.phone ?? undefined

    if (preferredMode === "inline") {
      const result = await startInlineSurvey({
        companyId,
        conversationId: payload.conversationId,
        surveyId: payload.surveyId,
        customerId: conversation.customerId,
        sentByType: "agent",
        sentByUserId: userId,
      })

      if (customerPhone) {
        for (const content of result.messages) {
          await sendOutbound({
            companyId,
            conversationId: payload.conversationId,
            content,
            senderType: "agent",
            senderUserId: userId,
            customerPhone,
            sessionId: conversation.sessionId,
            incrementUnread: false,
          })
        }
      }

      return { success: true, data: { responseId: result.responseId } }
    }

    const hosted = await startHostedSurvey({
      companyId,
      conversationId: payload.conversationId,
      surveyId: payload.surveyId,
      customerId: conversation.customerId,
      sentByType: "agent",
      sentByUserId: userId,
      locale,
    })

    await sendOutbound({
      companyId,
      conversationId: payload.conversationId,
      content: hosted.message,
      senderType: "agent",
      senderUserId: userId,
      customerPhone,
      sessionId: conversation.sessionId,
      incrementUnread: false,
    })

    return {
      success: true,
      data: { responseId: hosted.responseId, url: hosted.url },
    }
  })

export const getPublicSurveyAction = async (input: {
  accessToken: string
}): Promise<
  BaseActionResponse<{
    surveyName: string
    questions: SurveyView["questions"]
    thankYouMessage?: string
    status: string
  }>
> =>
  handleAction(async () => {
    const payload = z.object({ accessToken: z.string().min(1) }).parse(input)
    const { findSurveyResponseByToken, getSurvey } = await import(
      "@/lib/firebase/services/survey-service"
    )

    const found = await findSurveyResponseByToken(payload.accessToken)
    if (!found) throw new Error("Survey not found")

    const survey = await getSurvey(found.companyId, found.response.surveyId)
    if (!survey) throw new Error("Survey not found")

    return {
      success: true,
      data: {
        surveyName: survey.name,
        questions: survey.questions,
        thankYouMessage: survey.thankYouMessage,
        status: found.response.status,
      },
    }
  })

export const submitPublicSurveyAction = async (input: {
  accessToken: string
  answers: SurveyAnswer[]
}): Promise<BaseActionResponse<{ thankYouMessage?: string }>> =>
  handleAction(async () => {
    const payload = z
      .object({
        accessToken: z.string().min(1),
        answers: z.array(
          z.object({
            questionId: z.string(),
            value: z.union([z.string(), z.number()]),
          }),
        ),
      })
      .parse(input)

    const result = await submitHostedSurveyAnswers({
      accessToken: payload.accessToken,
      answers: payload.answers,
    })

    return {
      success: true,
      data: { thankYouMessage: result.thankYouMessage },
      message: "Survey submitted",
    }
  })
