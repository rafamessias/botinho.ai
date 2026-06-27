import { FieldValue } from "firebase-admin/firestore"
import { adminDb } from "@/lib/firebase/admin"
import { collections, companySubcollections } from "@/lib/firebase/collections"
import { createInboxMessage } from "@/lib/firebase/services/inbox-service"
import {
  extractSatisfactionScore,
  formatQuestionMessage,
  getSurvey,
  getSurveyResponse,
  updateSurveyResponse,
  type SurveyRecord,
  type SurveyResponseRecord,
} from "@/lib/firebase/services/survey-service"
import {
  getInvalidAnswerMessage,
  mergeAnswer,
  parseSurveyAnswer,
} from "@/lib/survey/inline-survey-flow"
import type { SurveyAnswer } from "@/lib/types/survey"

const conversationsRef = (companyId: string) =>
  adminDb.collection(collections.companies).doc(companyId).collection(companySubcollections.conversations)

export type ProcessInlineReplyResult = {
  handled: boolean
  completed?: boolean
}

export const processInlineSurveyReply = async (params: {
  companyId: string
  conversationId: string
  customerMessage: string
  locale?: "en" | "pt-BR"
}): Promise<ProcessInlineReplyResult> => {
  const locale = params.locale ?? "en"
  const convSnap = await conversationsRef(params.companyId).doc(params.conversationId).get()
  if (!convSnap.exists) return { handled: false }

  const convData = convSnap.data()!
  const responseId = convData.activeSurveyResponseId as string | undefined
  if (!responseId) return { handled: false }

  const response = await getSurveyResponse(params.companyId, responseId)
  if (!response || response.status === "completed" || response.status === "expired") {
    await conversationsRef(params.companyId).doc(params.conversationId).update({
      activeSurveyResponseId: null,
      updatedAt: FieldValue.serverTimestamp(),
    })
    return { handled: false }
  }

  const survey = await getSurvey(params.companyId, response.surveyId)
  if (!survey || survey.questions.length === 0) {
    return { handled: false }
  }

  const currentQuestion = survey.questions[response.currentQuestionIndex]
  if (!currentQuestion) {
    return { handled: false }
  }

  const parsed = parseSurveyAnswer(currentQuestion, params.customerMessage)
  if (!parsed.ok) {
    await createInboxMessage({
      companyId: params.companyId,
      conversationId: params.conversationId,
      content: getInvalidAnswerMessage(currentQuestion, parsed.error, locale),
      senderType: "system",
      status: "sent",
      incrementUnread: false,
    })
    return { handled: true, completed: false }
  }

  const answers = mergeAnswer(response.answers, {
    questionId: currentQuestion.id,
    value: parsed.value,
  })

  const nextIndex = response.currentQuestionIndex + 1
  const isComplete = nextIndex >= survey.questions.length

  if (isComplete) {
    await completeInlineSurvey({
      companyId: params.companyId,
      conversationId: params.conversationId,
      survey,
      response,
      answers,
    })
    return { handled: true, completed: true }
  }

  await updateSurveyResponse(params.companyId, responseId, {
    status: "in_progress",
    answers,
    currentQuestionIndex: nextIndex,
  })

  const nextQuestion = survey.questions[nextIndex]!
  await createInboxMessage({
    companyId: params.companyId,
    conversationId: params.conversationId,
    content: formatQuestionMessage(nextQuestion, nextIndex, survey.questions.length),
    senderType: "system",
    status: "sent",
    incrementUnread: false,
  })

  return { handled: true, completed: false }
}

const completeInlineSurvey = async (params: {
  companyId: string
  conversationId: string
  survey: SurveyRecord
  response: SurveyResponseRecord
  answers: SurveyAnswer[]
}) => {
  const now = new Date()
  await updateSurveyResponse(params.companyId, params.response.id, {
    status: "completed",
    answers: params.answers,
    currentQuestionIndex: params.survey.questions.length,
    completedAt: now,
  })

  const satisfactionScore = extractSatisfactionScore(params.survey, params.answers)

  const convUpdate: Record<string, unknown> = {
    activeSurveyResponseId: null,
    updatedAt: FieldValue.serverTimestamp(),
  }
  if (satisfactionScore != null) {
    convUpdate.satisfactionScore = satisfactionScore
  }

  await conversationsRef(params.companyId).doc(params.conversationId).update(convUpdate)

  if (params.survey.thankYouMessage?.trim()) {
    await createInboxMessage({
      companyId: params.companyId,
      conversationId: params.conversationId,
      content: params.survey.thankYouMessage.trim(),
      senderType: "system",
      status: "sent",
      incrementUnread: false,
    })
  }
}

export const startInlineSurvey = async (params: {
  companyId: string
  conversationId: string
  surveyId: string
  customerId?: string
  sentByType: "agent" | "bot" | "system"
  sentByUserId?: string
  agentId?: string
}): Promise<{ responseId: string; messages: string[] }> => {
  const survey = await getSurvey(params.companyId, params.surveyId)
  if (!survey) throw new Error("Survey not found")
  if (survey.status !== "active") throw new Error("Survey is not active")
  if (!["inline", "both"].includes(survey.deliveryMode)) {
    throw new Error("Survey does not support inline delivery")
  }
  if (survey.questions.length === 0) throw new Error("Survey has no questions")

  const { createSurveyResponse, buildInlineSurveyMessages } = await import(
    "@/lib/firebase/services/survey-service"
  )

  const response = await createSurveyResponse(params.companyId, {
    surveyId: params.surveyId,
    customerId: params.customerId,
    conversationId: params.conversationId,
    sentByType: params.sentByType,
    sentByUserId: params.sentByUserId,
    agentId: params.agentId,
    deliveryMode: "inline",
  })

  await updateSurveyResponse(params.companyId, response.id, { status: "in_progress" })

  await conversationsRef(params.companyId).doc(params.conversationId).update({
    activeSurveyResponseId: response.id,
    updatedAt: FieldValue.serverTimestamp(),
  })

  const messages = buildInlineSurveyMessages(survey)
  const senderType = params.sentByType === "bot" ? "bot" : params.sentByType === "agent" ? "agent" : "system"

  for (const content of messages) {
    await createInboxMessage({
      companyId: params.companyId,
      conversationId: params.conversationId,
      content,
      senderType,
      senderUserId: params.sentByUserId,
      status: "sent",
      incrementUnread: false,
    })
  }

  return { responseId: response.id, messages }
}

export const startHostedSurvey = async (params: {
  companyId: string
  conversationId?: string
  surveyId: string
  customerId?: string
  sentByType: "agent" | "bot" | "system"
  sentByUserId?: string
  agentId?: string
  locale: string
}): Promise<{ responseId: string; url: string; message: string }> => {
  const { getSurvey, createSurveyResponse, buildHostedSurveyUrl } = await import(
    "@/lib/firebase/services/survey-service"
  )

  const survey = await getSurvey(params.companyId, params.surveyId)
  if (!survey) throw new Error("Survey not found")
  if (survey.status !== "active") throw new Error("Survey is not active")
  if (!["hosted", "both"].includes(survey.deliveryMode)) {
    throw new Error("Survey does not support hosted delivery")
  }

  const response = await createSurveyResponse(params.companyId, {
    surveyId: params.surveyId,
    customerId: params.customerId,
    conversationId: params.conversationId,
    sentByType: params.sentByType,
    sentByUserId: params.sentByUserId,
    agentId: params.agentId,
    deliveryMode: "hosted",
  })

  const url = buildHostedSurveyUrl(params.locale, response.accessToken)
  const intro = survey.introMessage?.trim()
  const message = intro
    ? `${intro}\n\n${url}`
    : url

  return { responseId: response.id, url, message }
}

export const submitHostedSurveyAnswers = async (params: {
  accessToken: string
  answers: SurveyAnswer[]
}): Promise<{ completed: boolean; thankYouMessage?: string }> => {
  const { findSurveyResponseByToken, getSurvey, updateSurveyResponse, extractSatisfactionScore } =
    await import("@/lib/firebase/services/survey-service")
  const { validateHostedAnswers } = await import("@/lib/survey/inline-survey-flow")

  const found = await findSurveyResponseByToken(params.accessToken)
  if (!found) throw new Error("Survey response not found")
  if (found.response.status === "completed") throw new Error("Survey already completed")
  if (found.response.status === "expired") throw new Error("Survey expired")

  const survey = await getSurvey(found.companyId, found.response.surveyId)
  if (!survey) throw new Error("Survey not found")

  const validation = validateHostedAnswers(survey.questions, params.answers)
  if (!validation.ok) throw new Error("Please answer all required questions")

  const now = new Date()
  await updateSurveyResponse(found.companyId, found.response.id, {
    status: "completed",
    answers: params.answers,
    currentQuestionIndex: survey.questions.length,
    completedAt: now,
  })

  if (found.response.conversationId) {
    const satisfactionScore = extractSatisfactionScore(survey, params.answers)
    const convUpdate: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() }
    if (satisfactionScore != null) convUpdate.satisfactionScore = satisfactionScore
    await conversationsRef(found.companyId).doc(found.response.conversationId).update(convUpdate)
  }

  return {
    completed: true,
    thankYouMessage: survey.thankYouMessage?.trim(),
  }
}
