import { randomBytes } from "crypto"
import { FieldValue, Timestamp } from "firebase-admin/firestore"
import { adminDb } from "@/lib/firebase/admin"
import { collections, companySubcollections } from "@/lib/firebase/collections"
import type {
  SurveyAnswer,
  SurveyDeliveryMode,
  SurveyMetricsConfig,
  SurveyQuestion,
  SurveyQuestionType,
  SurveyResponseDeliveryMode,
  SurveyResponseStatus,
  SurveySentByType,
  SurveyStatus,
} from "@/lib/types/survey"

const companyRef = (companyId: string) => adminDb.collection(collections.companies).doc(companyId)
const toDate = (value: Timestamp) => value.toDate()

const surveysRef = (companyId: string) => companyRef(companyId).collection(companySubcollections.surveys)
const surveyResponsesRef = (companyId: string) =>
  companyRef(companyId).collection(companySubcollections.surveyResponses)

export type SurveyRecord = {
  id: string
  name: string
  slug: string
  description?: string
  deliveryMode: SurveyDeliveryMode
  status: SurveyStatus
  questions: SurveyQuestion[]
  introMessage?: string
  thankYouMessage?: string
  metricsConfig: SurveyMetricsConfig
  createdById: string
  createdAt: Date
  updatedAt: Date
}

export type SurveyResponseRecord = {
  id: string
  surveyId: string
  customerId?: string
  conversationId?: string
  sentByType: SurveySentByType
  sentByUserId?: string
  agentId?: string
  deliveryMode: SurveyResponseDeliveryMode
  status: SurveyResponseStatus
  accessToken: string
  answers: SurveyAnswer[]
  currentQuestionIndex: number
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export type SurveySummary = {
  id: string
  name: string
  slug: string
  deliveryMode: SurveyDeliveryMode
  status: SurveyStatus
  questionCount: number
  responseCount: number
  updatedAt: Date
}

export type SurveyMetrics = {
  totalSent: number
  totalCompleted: number
  responseRate: number
  averageRating?: number
  npsScore?: number
  distribution: Record<string, number>
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "survey"

const generateAccessToken = () => randomBytes(24).toString("hex")

const defaultMetricsConfig = (): SurveyMetricsConfig => ({
  showAverage: true,
  showNps: true,
  showDistribution: true,
})

const mapSurvey = (id: string, data: FirebaseFirestore.DocumentData): SurveyRecord => ({
  id,
  name: data.name as string,
  slug: data.slug as string,
  description: data.description as string | undefined,
  deliveryMode: data.deliveryMode as SurveyDeliveryMode,
  status: data.status as SurveyStatus,
  questions: (data.questions as SurveyQuestion[]) ?? [],
  introMessage: data.introMessage as string | undefined,
  thankYouMessage: data.thankYouMessage as string | undefined,
  metricsConfig: (data.metricsConfig as SurveyMetricsConfig) ?? defaultMetricsConfig(),
  createdById: data.createdById as string,
  createdAt: toDate(data.createdAt as Timestamp),
  updatedAt: toDate(data.updatedAt as Timestamp),
})

const mapSurveyResponse = (id: string, data: FirebaseFirestore.DocumentData): SurveyResponseRecord => ({
  id,
  surveyId: data.surveyId as string,
  customerId: data.customerId as string | undefined,
  conversationId: data.conversationId as string | undefined,
  sentByType: data.sentByType as SurveySentByType,
  sentByUserId: data.sentByUserId as string | undefined,
  agentId: data.agentId as string | undefined,
  deliveryMode: data.deliveryMode as SurveyResponseDeliveryMode,
  status: data.status as SurveyResponseStatus,
  accessToken: data.accessToken as string,
  answers: (data.answers as SurveyAnswer[]) ?? [],
  currentQuestionIndex: (data.currentQuestionIndex as number) ?? 0,
  completedAt: data.completedAt ? toDate(data.completedAt as Timestamp) : undefined,
  createdAt: toDate(data.createdAt as Timestamp),
  updatedAt: toDate(data.updatedAt as Timestamp),
})

const ensureUniqueSlug = async (companyId: string, baseSlug: string, excludeId?: string) => {
  let slug = baseSlug
  let counter = 1

  while (true) {
    const snap = await surveysRef(companyId).where("slug", "==", slug).limit(2).get()
    const conflict = snap.docs.find((doc) => doc.id !== excludeId)
    if (!conflict) return slug
    slug = `${baseSlug}-${counter}`
    counter += 1
  }
}

export const listSurveys = async (companyId: string): Promise<SurveySummary[]> => {
  const snap = await surveysRef(companyId).orderBy("updatedAt", "desc").get()

  const summaries = await Promise.all(
    snap.docs.map(async (doc) => {
      const data = doc.data()
      const responseCount = (
        await surveyResponsesRef(companyId).where("surveyId", "==", doc.id).count().get()
      ).data().count

      return {
        id: doc.id,
        name: data.name as string,
        slug: data.slug as string,
        deliveryMode: data.deliveryMode as SurveyDeliveryMode,
        status: data.status as SurveyStatus,
        questionCount: ((data.questions as SurveyQuestion[]) ?? []).length,
        responseCount,
        updatedAt: toDate(data.updatedAt as Timestamp),
      }
    }),
  )

  return summaries
}

export const listActiveSurveys = async (companyId: string): Promise<SurveyRecord[]> => {
  const snap = await surveysRef(companyId).where("status", "==", "active").get()
  return snap.docs
    .map((doc) => mapSurvey(doc.id, doc.data()))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export const getSurvey = async (companyId: string, surveyId: string): Promise<SurveyRecord | null> => {
  const snap = await surveysRef(companyId).doc(surveyId).get()
  if (!snap.exists) return null
  return mapSurvey(snap.id, snap.data()!)
}

export const createSurvey = async (
  companyId: string,
  userId: string,
  input: {
    name: string
    description?: string
    deliveryMode: SurveyDeliveryMode
    status?: SurveyStatus
    questions?: SurveyQuestion[]
    introMessage?: string
    thankYouMessage?: string
    metricsConfig?: SurveyMetricsConfig
  },
): Promise<SurveyRecord> => {
  const ref = surveysRef(companyId).doc()
  const slug = await ensureUniqueSlug(companyId, slugify(input.name))
  const now = FieldValue.serverTimestamp()

  await ref.set({
    name: input.name.trim(),
    slug,
    description: input.description?.trim() || null,
    deliveryMode: input.deliveryMode,
    status: input.status ?? "draft",
    questions: input.questions ?? [],
    introMessage: input.introMessage?.trim() || null,
    thankYouMessage: input.thankYouMessage?.trim() || null,
    metricsConfig: input.metricsConfig ?? defaultMetricsConfig(),
    createdById: userId,
    createdAt: now,
    updatedAt: now,
  })

  return mapSurvey(ref.id, (await ref.get()).data()!)
}

export const updateSurvey = async (
  companyId: string,
  surveyId: string,
  input: {
    name?: string
    description?: string
    deliveryMode?: SurveyDeliveryMode
    status?: SurveyStatus
    questions?: SurveyQuestion[]
    introMessage?: string
    thankYouMessage?: string
    metricsConfig?: SurveyMetricsConfig
  },
): Promise<SurveyRecord> => {
  const ref = surveysRef(companyId).doc(surveyId)
  const existing = await ref.get()
  if (!existing.exists) {
    throw new Error("Survey not found")
  }

  const update: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() }

  if (input.name !== undefined) {
    update.name = input.name.trim()
    if (input.name.trim() !== existing.data()!.name) {
      update.slug = await ensureUniqueSlug(companyId, slugify(input.name), surveyId)
    }
  }
  if (input.description !== undefined) update.description = input.description.trim() || null
  if (input.deliveryMode !== undefined) update.deliveryMode = input.deliveryMode
  if (input.status !== undefined) update.status = input.status
  if (input.questions !== undefined) update.questions = input.questions
  if (input.introMessage !== undefined) update.introMessage = input.introMessage.trim() || null
  if (input.thankYouMessage !== undefined) update.thankYouMessage = input.thankYouMessage.trim() || null
  if (input.metricsConfig !== undefined) update.metricsConfig = input.metricsConfig

  await ref.update(update)
  return mapSurvey(surveyId, (await ref.get()).data()!)
}

export const archiveSurvey = async (companyId: string, surveyId: string) => {
  await updateSurvey(companyId, surveyId, { status: "archived" })
}

export const duplicateSurvey = async (
  companyId: string,
  userId: string,
  surveyId: string,
): Promise<SurveyRecord> => {
  const original = await getSurvey(companyId, surveyId)
  if (!original) throw new Error("Survey not found")

  return createSurvey(companyId, userId, {
    name: `${original.name} (copy)`,
    description: original.description,
    deliveryMode: original.deliveryMode,
    status: "draft",
    questions: original.questions,
    introMessage: original.introMessage,
    thankYouMessage: original.thankYouMessage,
    metricsConfig: original.metricsConfig,
  })
}

export const getSurveyResponse = async (
  companyId: string,
  responseId: string,
): Promise<SurveyResponseRecord | null> => {
  const snap = await surveyResponsesRef(companyId).doc(responseId).get()
  if (!snap.exists) return null
  return mapSurveyResponse(snap.id, snap.data()!)
}

export const findSurveyResponseByToken = async (
  accessToken: string,
): Promise<{ companyId: string; response: SurveyResponseRecord } | null> => {
  const companiesSnap = await adminDb.collection(collections.companies).select().get()

  for (const companyDoc of companiesSnap.docs) {
    const snap = await surveyResponsesRef(companyDoc.id)
      .where("accessToken", "==", accessToken)
      .limit(1)
      .get()

    if (!snap.empty) {
      const doc = snap.docs[0]!
      return {
        companyId: companyDoc.id,
        response: mapSurveyResponse(doc.id, doc.data()),
      }
    }
  }

  return null
}

export const createSurveyResponse = async (
  companyId: string,
  input: {
    surveyId: string
    customerId?: string
    conversationId?: string
    sentByType: SurveySentByType
    sentByUserId?: string
    agentId?: string
    deliveryMode: SurveyResponseDeliveryMode
  },
): Promise<SurveyResponseRecord> => {
  const ref = surveyResponsesRef(companyId).doc()
  const now = FieldValue.serverTimestamp()

  await ref.set({
    surveyId: input.surveyId,
    customerId: input.customerId ?? null,
    conversationId: input.conversationId ?? null,
    sentByType: input.sentByType,
    sentByUserId: input.sentByUserId ?? null,
    agentId: input.agentId ?? null,
    deliveryMode: input.deliveryMode,
    status: "sent",
    accessToken: generateAccessToken(),
    answers: [],
    currentQuestionIndex: 0,
    createdAt: now,
    updatedAt: now,
  })

  return mapSurveyResponse(ref.id, (await ref.get()).data()!)
}

export const updateSurveyResponse = async (
  companyId: string,
  responseId: string,
  input: Partial<{
    status: SurveyResponseStatus
    answers: SurveyAnswer[]
    currentQuestionIndex: number
    completedAt: Date
  }>,
): Promise<SurveyResponseRecord> => {
  const ref = surveyResponsesRef(companyId).doc(responseId)
  const update: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() }

  if (input.status !== undefined) update.status = input.status
  if (input.answers !== undefined) update.answers = input.answers
  if (input.currentQuestionIndex !== undefined) update.currentQuestionIndex = input.currentQuestionIndex
  if (input.completedAt !== undefined) update.completedAt = input.completedAt

  await ref.update(update)
  return mapSurveyResponse(responseId, (await ref.get()).data()!)
}

export const listSurveyResponses = async (
  companyId: string,
  surveyId: string,
  limit = 50,
): Promise<SurveyResponseRecord[]> => {
  const snap = await surveyResponsesRef(companyId)
    .where("surveyId", "==", surveyId)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get()

  return snap.docs.map((doc) => mapSurveyResponse(doc.id, doc.data()))
}

export const getSurveyMetrics = async (companyId: string, surveyId: string): Promise<SurveyMetrics> => {
  const survey = await getSurvey(companyId, surveyId)
  if (!survey) throw new Error("Survey not found")

  const responses = await listSurveyResponses(companyId, surveyId, 500)
  const completed = responses.filter((r) => r.status === "completed")
  const totalSent = responses.length
  const totalCompleted = completed.length

  const distribution: Record<string, number> = {}
  let ratingSum = 0
  let ratingCount = 0
  let promoters = 0
  let detractors = 0
  let npsCount = 0

  for (const response of completed) {
    for (const answer of response.answers) {
      const question = survey.questions.find((q) => q.id === answer.questionId)
      if (!question) continue

      const key = String(answer.value)
      distribution[key] = (distribution[key] ?? 0) + 1

      if (question.type === "rating" || question.type === "scale") {
        const num = Number(answer.value)
        if (!Number.isNaN(num)) {
          ratingSum += num
          ratingCount += 1
        }
      }

      if (question.type === "nps") {
        const num = Number(answer.value)
        if (!Number.isNaN(num)) {
          npsCount += 1
          if (num >= 9) promoters += 1
          else if (num <= 6) detractors += 1
        }
      }
    }
  }

  return {
    totalSent,
    totalCompleted,
    responseRate: totalSent > 0 ? Math.round((totalCompleted / totalSent) * 100) : 0,
    averageRating: ratingCount > 0 ? Math.round((ratingSum / ratingCount) * 10) / 10 : undefined,
    npsScore:
      npsCount > 0 ? Math.round(((promoters - detractors) / npsCount) * 100) : undefined,
    distribution,
  }
}

export const extractSatisfactionScore = (
  survey: SurveyRecord,
  answers: SurveyAnswer[],
): number | undefined => {
  for (const answer of answers) {
    const question = survey.questions.find((q) => q.id === answer.questionId)
    if (!question) continue

    if (question.type === "rating") {
      const num = Number(answer.value)
      if (!Number.isNaN(num)) return Math.min(5, Math.max(1, Math.round(num)))
    }

    if (question.type === "nps") {
      const num = Number(answer.value)
      if (!Number.isNaN(num)) {
        if (num >= 9) return 5
        if (num >= 7) return 4
        if (num >= 5) return 3
        if (num >= 3) return 2
        return 1
      }
    }
  }
  return undefined
}

export const formatQuestionMessage = (question: SurveyQuestion, index: number, total: number): string => {
  const prefix = total > 1 ? `(${index + 1}/${total}) ` : ""
  let body = `${prefix}${question.prompt}`

  if (question.type === "single_choice" && question.options?.length) {
    const options = question.options.map((opt, i) => `${i + 1}. ${opt.label}`).join("\n")
    body += `\n\n${options}`
  }

  if (question.type === "rating" || question.type === "scale") {
    const min = question.scaleMin ?? 1
    const max = question.scaleMax ?? 5
    body += `\n\nReply with a number from ${min} to ${max}.`
  }

  if (question.type === "nps") {
    body += `\n\nReply with a number from 0 to 10.`
  }

  return body
}

export const buildInlineSurveyMessages = (survey: SurveyRecord): string[] => {
  const messages: string[] = []
  if (survey.introMessage?.trim()) {
    messages.push(survey.introMessage.trim())
  }
  if (survey.questions.length > 0) {
    messages.push(formatQuestionMessage(survey.questions[0]!, 0, survey.questions.length))
  }
  return messages
}

export const buildHostedSurveyUrl = (locale: string, accessToken: string): string => {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  return `${base}/${locale}/s/${accessToken}`
}

export type CreateQuestionInput = {
  type: SurveyQuestionType
  prompt: string
  required?: boolean
  options?: { label: string; value: string }[]
  scaleMin?: number
  scaleMax?: number
}

export const createQuestionId = () => randomBytes(8).toString("hex")

export const normalizeQuestions = (questions: CreateQuestionInput[]): SurveyQuestion[] =>
  questions.map((q) => ({
    id: createQuestionId(),
    type: q.type,
    prompt: q.prompt.trim(),
    required: q.required ?? true,
    options: q.options,
    scaleMin: q.scaleMin,
    scaleMax: q.scaleMax,
  }))
