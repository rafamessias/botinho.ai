"use server"

import { revalidatePath } from "next/cache"
import { getPrismaWrapper, getCurrentTeamId } from "@/lib/prisma-wrapper"
import { prisma } from "@/prisma/lib/prisma"
import { SurveyStatus, QuestionFormat, UsageMetricType } from "@/lib/generated/prisma"
import { z } from "zod"
import { getTranslations } from "next-intl/server"
import {
    incrementActiveSurveysInTransaction,
    decrementActiveSurveysInTransaction,
    getCurrentUsage
} from "@/lib/services/usage-tracking"

// Helper function to get and cache team ID for better performance
const getTeamIdCached = async (): Promise<number | null> => {
    return await getCurrentTeamId()
}

// Database survey type
interface DatabaseSurvey {
    id: string
    name: string
    description: string | null
    status: SurveyStatus
    enabled: boolean
    allowMultipleResponses: boolean
    totalResponses: number
    responseRate: number
    totalOpenSurveys: number
    createdAt: Date
    updatedAt: Date
    type: {
        id: string
        name: string
    } | null
    _count: {
        responses: number
    }
}

// Validation schemas
const questionSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Question title is required"),
    description: z.string().optional(),
    format: z.nativeEnum(QuestionFormat),
    required: z.boolean().default(false),
    order: z.number().min(0),
    yesLabel: z.string().optional(),
    noLabel: z.string().optional(),
    buttonLabel: z.string().optional(),
    options: z.array(z.object({
        id: z.string().optional(),
        text: z.string().min(1, "Option text is required"),
        order: z.number().min(0),
        isOther: z.boolean().default(false)
    })).optional().default([])
})

const surveyStyleSchema = z.object({
    backgroundColor: z.string().default("transparent"),
    textColor: z.string().default("#222222"),
    buttonBackgroundColor: z.string().default("#222222"),
    buttonTextColor: z.string().default("#ffffff"),
    margin: z.string().default("16px 0px"),
    padding: z.string().default("16px"),
    border: z.string().default("1px solid #222222"),
    borderRadius: z.string().default("6px"),
    titleFontSize: z.string().default("18px"),
    bodyFontSize: z.string().default("16px"),
    fontFamily: z.string().default("Inter"),
    styleMode: z.enum(["basic", "advanced"]).default("basic"),
    basicCSS: z.string().optional(),
    advancedCSS: z.string().optional()
})

const createSurveySchema = z.object({
    name: z.string().min(1, "Survey name is required"),
    description: z.string().optional(),
    typeId: z.string().optional(),
    status: z.nativeEnum(SurveyStatus).default(SurveyStatus.draft),
    allowMultipleResponses: z.boolean().default(true),
    questions: z.array(questionSchema).min(1, "At least one question is required"),
    style: surveyStyleSchema
})

const updateSurveySchema = createSurveySchema.partial().extend({
    id: z.string(),
    status: z.nativeEnum(SurveyStatus).optional()
})

// Create a new survey
export const createSurvey = async (formData: FormData) => {
    try {
        const wrapper = getPrismaWrapper()

        // Parse form data
        const rawData = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            typeId: formData.get("typeId") as string === "null" ? undefined : formData.get("typeId") as string,
            status: formData.get("status") as SurveyStatus,
            allowMultipleResponses: formData.get("allowMultipleResponses") === "true",
            questions: JSON.parse(formData.get("questions") as string),
            style: JSON.parse(formData.get("style") as string)
        }

        // Validate data
        const validatedData = createSurveySchema.parse(rawData)

        // Get team ID once before transaction
        const teamId = await getTeamIdCached()
        if (!teamId) {
            return {
                success: false,
                error: "Team not found"
            }
        }

        // Get team subscription for usage tracking
        const activeSubscription = await prisma.customerSubscription.findFirst({
            where: {
                teamId: teamId,
                status: { in: ['active', 'trialing'] }
            },
            select: { id: true }
        })

        const subscriptionId = activeSubscription?.id

        // Validate credits before publishing survey
        if (validatedData.status === SurveyStatus.published) {
            const usageInfo = await getCurrentUsage(teamId, UsageMetricType.ACTIVE_SURVEYS)

            if (usageInfo.isOverLimit || usageInfo.remaining <= 0) {
                const t = await getTranslations("CreateSurvey.messages")
                return {
                    success: false,
                    error: t("activeSurveysLimitReached", { limit: usageInfo.limit }),
                    upgrade: true,
                    currentLimit: usageInfo.limit
                }
            }
        }

        // Generate public token if survey is being published
        const publicToken = validatedData.status === SurveyStatus.published
            ? crypto.randomUUID()
            : null

        // Create survey with questions and style in a transaction with optimized operations
        const result = await prisma.$transaction(async (tx) => {
            // Create survey using direct Prisma call for better performance
            const survey = await tx.survey.create({
                data: {
                    name: validatedData.name,
                    description: validatedData.description,
                    typeId: validatedData.typeId ? validatedData.typeId : null,
                    status: validatedData.status,
                    allowMultipleResponses: validatedData.allowMultipleResponses,
                    publicToken: publicToken,
                    teamId: teamId
                }
            })

            // Update team survey counts
            await tx.team.update({
                where: { id: teamId },
                data: {
                    totalSurveys: { increment: 1 },
                    ...(validatedData.status === SurveyStatus.published && {
                        totalActiveSurveys: { increment: 1 }
                    })
                }
            })

            // Update usage tracking if survey is published and subscription exists
            if (validatedData.status === SurveyStatus.published && subscriptionId) {
                await incrementActiveSurveysInTransaction(tx, teamId, subscriptionId)
            }

            // Create survey style using direct Prisma call
            await tx.surveyStyle.create({
                data: {
                    surveyId: survey.id,
                    teamId: teamId,
                    ...validatedData.style
                }
            })

            // Batch create questions for better performance
            const questionsToCreate = validatedData.questions.map(questionData => ({
                surveyId: survey.id,
                teamId: teamId,
                title: questionData.title,
                description: questionData.description,
                format: questionData.format,
                required: questionData.required,
                order: questionData.order,
                yesLabel: questionData.yesLabel,
                noLabel: questionData.noLabel,
                buttonLabel: questionData.buttonLabel
            }))

            const createdQuestions = await tx.question.createMany({
                data: questionsToCreate,
                skipDuplicates: true
            })

            // Get created questions with their IDs for options
            const questionsWithIds = await tx.question.findMany({
                where: {
                    surveyId: survey.id,
                    teamId: teamId
                },
                select: { id: true, order: true }
            })

            // Create question options in batches
            const allOptions = validatedData.questions.flatMap((questionData, questionIndex) => {
                if (!questionData.options || questionData.options.length === 0) return []

                const question = questionsWithIds.find(q => q.order === questionData.order)
                if (!question) return []

                return questionData.options.map(optionData => ({
                    questionId: question.id,
                    teamId: teamId,
                    text: optionData.text,
                    order: optionData.order,
                    isOther: optionData.isOther
                }))
            })

            if (allOptions.length > 0) {
                await tx.questionOption.createMany({
                    data: allOptions,
                    skipDuplicates: true
                })
            }

            return survey
        }, {
            timeout: 5000 // Reduced timeout due to optimized operations
        })

        revalidatePath("/survey")
        return { success: true, surveyId: result.id }
    } catch (error) {
        console.error("Error creating survey:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create survey"
        }
    }
}

// Update an existing survey
export const updateSurvey = async (formData: FormData) => {
    try {
        const wrapper = getPrismaWrapper()

        // Parse form data
        const rawData = {
            id: formData.get("id") as string,
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            typeId: formData.get("typeId") as string,
            status: formData.get("status") as SurveyStatus,
            allowMultipleResponses: formData.get("allowMultipleResponses") === "true",
            questions: JSON.parse(formData.get("questions") as string),
            style: JSON.parse(formData.get("style") as string)
        }

        // Validate data
        const validatedData = updateSurveySchema.parse(rawData)

        // Get team ID once before transaction
        const teamId = await getTeamIdCached()
        if (!teamId) {
            return {
                success: false,
                error: "Team not found"
            }
        }

        // Get team subscription for usage tracking
        const activeSubscription = await prisma.customerSubscription.findFirst({
            where: {
                teamId: teamId,
                status: { in: ['active', 'trialing'] }
            },
            select: { id: true }
        })

        const subscriptionId = activeSubscription?.id

        // Get current survey to check status changes and existing questions
        const currentSurvey = await prisma.survey.findUnique({
            where: {
                id: validatedData.id,
                teamId: teamId // Add team validation
            },
            select: {
                status: true,
                questions: {
                    include: {
                        options: true
                    }
                }
            }
        })

        if (!currentSurvey) {
            return {
                success: false,
                error: "Survey not found"
            }
        }

        // Validate credits before publishing survey (if changing status to published)
        const isChangingToPublished = currentSurvey.status !== SurveyStatus.published &&
            validatedData.status === SurveyStatus.published

        if (isChangingToPublished) {
            const usageInfo = await getCurrentUsage(teamId, UsageMetricType.ACTIVE_SURVEYS)

            if (usageInfo.isOverLimit || usageInfo.remaining <= 0) {
                const t = await getTranslations("CreateSurvey.messages")
                return {
                    success: false,
                    error: t("activeSurveysLimitReached", { limit: usageInfo.limit }),
                    upgrade: true,
                    currentLimit: usageInfo.limit
                }
            }
        }

        // Generate public token if changing to published
        const publicToken = isChangingToPublished ? crypto.randomUUID() : undefined

        // Update survey with questions and style in optimized transaction
        const result = await prisma.$transaction(async (tx) => {
            // Update survey using direct Prisma call
            const survey = await tx.survey.update({
                where: { id: validatedData.id },
                data: {
                    name: validatedData.name,
                    description: validatedData.description,
                    typeId: validatedData.typeId ? validatedData.typeId : null,
                    status: validatedData.status,
                    allowMultipleResponses: validatedData.allowMultipleResponses,
                    ...(publicToken && { publicToken })
                }
            })

            // Update team survey counts based on status changes
            const oldStatus = currentSurvey.status
            const newStatus = validatedData.status

            if (oldStatus !== newStatus) {
                const updateData: any = {}

                // Handle active surveys count changes
                if (oldStatus === SurveyStatus.published && newStatus !== SurveyStatus.published) {
                    // Moving from published to draft/archived - decrement active
                    updateData.totalActiveSurveys = { decrement: 1 }
                } else if (oldStatus !== SurveyStatus.published && newStatus === SurveyStatus.published) {
                    // Moving to published - increment active
                    updateData.totalActiveSurveys = { increment: 1 }
                }

                if (Object.keys(updateData).length > 0) {
                    await tx.team.update({
                        where: { id: teamId },
                        data: updateData
                    })
                }

                // Update usage tracking based on status changes
                if (subscriptionId) {
                    if (oldStatus === SurveyStatus.published && newStatus !== SurveyStatus.published) {
                        // Moving from published to draft/archived - decrement usage
                        await decrementActiveSurveysInTransaction(tx, teamId, subscriptionId)
                    } else if (oldStatus !== SurveyStatus.published && newStatus === SurveyStatus.published) {
                        // Moving to published - increment usage
                        await incrementActiveSurveysInTransaction(tx, teamId, subscriptionId)
                    }
                }
            }

            // Update survey style using direct Prisma call
            if (validatedData.style) {
                await tx.surveyStyle.upsert({
                    where: { surveyId: survey.id },
                    create: {
                        surveyId: survey.id,
                        teamId: teamId,
                        ...validatedData.style
                    },
                    update: validatedData.style
                })
            }

            // Smart update strategy: Only update questions if they actually changed
            if (validatedData.questions) {
                // Compare existing vs new questions to determine if update is needed
                const existingQuestions = currentSurvey.questions
                const questionsChanged = JSON.stringify(existingQuestions.map(q => ({
                    title: q.title,
                    description: q.description,
                    format: q.format,
                    required: q.required,
                    order: q.order,
                    yesLabel: q.yesLabel,
                    noLabel: q.noLabel,
                    buttonLabel: q.buttonLabel,
                    options: q.options.map(opt => ({
                        text: opt.text,
                        order: opt.order,
                        isOther: opt.isOther
                    }))
                }))) !== JSON.stringify(validatedData.questions.map(q => ({
                    title: q.title,
                    description: q.description,
                    format: q.format,
                    required: q.required,
                    order: q.order,
                    yesLabel: q.yesLabel,
                    noLabel: q.noLabel,
                    buttonLabel: q.buttonLabel,
                    options: q.options || []
                })))

                if (questionsChanged) {
                    // Delete existing questions and options in batch
                    await tx.questionOption.deleteMany({
                        where: {
                            question: { surveyId: survey.id },
                            teamId: teamId
                        }
                    })
                    await tx.question.deleteMany({
                        where: {
                            surveyId: survey.id,
                            teamId: teamId
                        }
                    })

                    // Batch create new questions
                    const questionsToCreate = validatedData.questions.map(questionData => ({
                        surveyId: survey.id,
                        teamId: teamId,
                        title: questionData.title,
                        description: questionData.description,
                        format: questionData.format,
                        required: questionData.required,
                        order: questionData.order,
                        yesLabel: questionData.yesLabel,
                        noLabel: questionData.noLabel,
                        buttonLabel: questionData.buttonLabel
                    }))

                    await tx.question.createMany({
                        data: questionsToCreate,
                        skipDuplicates: true
                    })

                    // Get created questions with their IDs for options
                    const questionsWithIds = await tx.question.findMany({
                        where: {
                            surveyId: survey.id,
                            teamId: teamId
                        },
                        select: { id: true, order: true }
                    })

                    // Batch create question options
                    const allOptions = validatedData.questions.flatMap((questionData, questionIndex) => {
                        if (!questionData.options || questionData.options.length === 0) return []

                        const question = questionsWithIds.find(q => q.order === questionData.order)
                        if (!question) return []

                        return questionData.options.map(optionData => ({
                            questionId: question.id,
                            teamId: teamId,
                            text: optionData.text,
                            order: optionData.order,
                            isOther: optionData.isOther
                        }))
                    })

                    if (allOptions.length > 0) {
                        await tx.questionOption.createMany({
                            data: allOptions,
                            skipDuplicates: true
                        })
                    }
                }
            }

            return survey
        }, {
            timeout: 5000 // Reduced timeout due to optimized operations
        })

        revalidatePath("/survey")
        return { success: true, surveyId: result.id }
    } catch (error) {
        console.error("Error updating survey:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update survey"
        }
    }
}

// Get all surveys for the current team
export const getSurveys = async () => {
    try {
        const wrapper = getPrismaWrapper()

        const surveys = await wrapper.findMany(prisma.survey, {
            include: {
                type: {
                    select: {
                        name: true
                    }
                },
                _count: {
                    select: {
                        responses: true
                    }
                }
            },
            orderBy: { updatedAt: 'desc' }
        })

        return { success: true, surveys }
    } catch (error) {
        console.error("Error fetching surveys:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch surveys"
        }
    }
}

// Pagination and filter parameters schema
const surveyFiltersSchema = z.object({
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(10),
    search: z.string().optional(),
    status: z.nativeEnum(SurveyStatus).optional(),
    sortBy: z.enum(['name', 'status', 'createdAt', 'updatedAt', 'responses']).default('updatedAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
})

export type SurveyFilters = z.infer<typeof surveyFiltersSchema>

export interface PaginatedSurveysResult {
    surveys: DatabaseSurvey[]
    totalCount: number
    totalPages: number
    currentPage: number
    pageSize: number
    hasNextPage: boolean
    hasPreviousPage: boolean
}

// Get surveys with pagination and filtering
export const getSurveysWithPagination = async (filters: Partial<SurveyFilters> = {}) => {
    try {
        const wrapper = getPrismaWrapper()

        // Validate and set default filters
        const validatedFilters = surveyFiltersSchema.parse(filters)

        // Build where clause for filtering
        const whereClause: any = {}

        if (validatedFilters.search) {
            whereClause.OR = [
                { name: { contains: validatedFilters.search, mode: 'insensitive' } },
                { description: { contains: validatedFilters.search, mode: 'insensitive' } }
            ]
        }

        if (validatedFilters.status) {
            whereClause.status = validatedFilters.status
        }

        // Build orderBy clause
        const orderBy: any = {}
        if (validatedFilters.sortBy === 'responses') {
            // Use totalResponses column for sorting
            orderBy.totalResponses = validatedFilters.sortOrder
        } else {
            orderBy[validatedFilters.sortBy] = validatedFilters.sortOrder
        }

        // Calculate pagination
        const skip = (validatedFilters.page - 1) * validatedFilters.pageSize
        const take = validatedFilters.pageSize

        // Execute queries in parallel
        const [surveys, totalCount] = await Promise.all([
            wrapper.findMany(prisma.survey, {
                where: whereClause,
                select: {
                    id: true,
                    name: true,
                    description: true,
                    status: true,
                    allowMultipleResponses: true,
                    totalResponses: true,
                    responseRate: true,
                    totalOpenSurveys: true,
                    createdAt: true,
                    updatedAt: true,
                    type: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    _count: {
                        select: {
                            responses: true
                        }
                    }
                },
                orderBy,
                skip,
                take
            }),
            wrapper.count(prisma.survey, {
                where: whereClause
            })
        ])

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCount / validatedFilters.pageSize)
        const hasNextPage = validatedFilters.page < totalPages
        const hasPreviousPage = validatedFilters.page > 1

        const result: PaginatedSurveysResult = {
            surveys: surveys as DatabaseSurvey[],
            totalCount,
            totalPages,
            currentPage: validatedFilters.page,
            pageSize: validatedFilters.pageSize,
            hasNextPage,
            hasPreviousPage
        }

        return { success: true, data: result }
    } catch (error) {
        console.error("Error fetching surveys with pagination:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch surveys"
        }
    }
}

// Get a single survey by ID
export const getSurvey = async (id: string) => {
    try {
        const wrapper = getPrismaWrapper()

        const survey = await wrapper.findUnique(prisma.survey, {
            where: { id },
            include: {
                type: true,
                style: true,
                questions: {
                    include: {
                        options: {
                            orderBy: { order: 'asc' }
                        }
                    },
                    orderBy: { order: 'asc' }
                },
                _count: {
                    select: {
                        responses: true
                    }
                }
            }
        })

        if (!survey) {
            return { success: false, error: "Survey not found" }
        }

        return { success: true, survey }
    } catch (error) {
        console.error("Error fetching survey:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch survey"
        }
    }
}

// Delete a survey
export const deleteSurvey = async (id: string) => {
    try {
        const wrapper = getPrismaWrapper()
        const teamId = await getTeamIdCached()

        if (!teamId) {
            return {
                success: false,
                error: "Team not found"
            }
        }

        // Get team subscription for usage tracking
        const activeSubscription = await prisma.customerSubscription.findFirst({
            where: {
                teamId: teamId,
                status: { in: ['active', 'trialing'] }
            },
            select: { id: true }
        })

        const subscriptionId = activeSubscription?.id

        // Get survey details before deletion to update team counts using direct Prisma call
        const survey = await prisma.survey.findUnique({
            where: {
                id,
                teamId: teamId // Add team validation
            },
            select: { status: true, teamId: true }
        })

        if (!survey) {
            return {
                success: false,
                error: "Survey not found"
            }
        }

        // Delete survey and update team counts in optimized transaction
        await prisma.$transaction(async (tx) => {
            // Delete the survey using direct Prisma call
            await tx.survey.delete({ where: { id } })

            // Update team survey counts
            const updateData: any = {
                totalSurveys: { decrement: 1 }
            }

            // Decrement active surveys if the deleted survey was published
            if (survey.status === SurveyStatus.published) {
                updateData.totalActiveSurveys = { decrement: 1 }
            }

            await tx.team.update({
                where: { id: survey.teamId },
                data: updateData
            })

            // Update usage tracking if deleted survey was published
            if (survey.status === SurveyStatus.published && subscriptionId) {
                await decrementActiveSurveysInTransaction(tx, teamId, subscriptionId)
            }
        }, {
            timeout: 3000 // Reduced timeout for delete operation
        })

        revalidatePath("/survey")
        return { success: true }
    } catch (error) {
        console.error("Error deleting survey:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete survey"
        }
    }
}

// Duplicate a survey
export const duplicateSurvey = async (id: string) => {
    try {
        const wrapper = getPrismaWrapper()

        // Get the original survey
        const originalSurvey = await wrapper.findUnique(prisma.survey, {
            where: { id },
            include: {
                type: true,
                style: true,
                questions: {
                    include: {
                        options: {
                            orderBy: { order: 'asc' }
                        }
                    },
                    orderBy: { order: 'asc' }
                }
            }
        })

        if (!originalSurvey) {
            return { success: false, error: "Survey not found" }
        }

        // Get team ID once before transaction
        const teamId = await getTeamIdCached()
        if (!teamId) {
            return {
                success: false,
                error: "Team not found"
            }
        }

        // Create duplicate in optimized transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create new survey using direct Prisma call
            const newSurvey = await tx.survey.create({
                data: {
                    name: `${originalSurvey.name} (Copy)`,
                    description: originalSurvey.description,
                    typeId: originalSurvey.typeId ? originalSurvey.typeId : null,
                    status: SurveyStatus.draft,
                    allowMultipleResponses: originalSurvey.allowMultipleResponses,
                    teamId: teamId
                }
            })

            // Duplicate survey style using direct Prisma call
            if (originalSurvey.style) {
                await tx.surveyStyle.create({
                    data: {
                        surveyId: newSurvey.id,
                        teamId: teamId,
                        backgroundColor: originalSurvey.style.backgroundColor,
                        textColor: originalSurvey.style.textColor,
                        buttonBackgroundColor: originalSurvey.style.buttonBackgroundColor,
                        buttonTextColor: originalSurvey.style.buttonTextColor,
                        margin: originalSurvey.style.margin,
                        padding: originalSurvey.style.padding,
                        border: originalSurvey.style.border,
                        borderRadius: originalSurvey.style.borderRadius,
                        titleFontSize: originalSurvey.style.titleFontSize,
                        bodyFontSize: originalSurvey.style.bodyFontSize,
                        fontFamily: originalSurvey.style.fontFamily,
                        styleMode: originalSurvey.style.styleMode,
                        basicCSS: originalSurvey.style.basicCSS,
                        advancedCSS: originalSurvey.style.advancedCSS
                    }
                })
            }

            // Batch create questions for better performance
            const questionsToCreate = originalSurvey.questions.map((question: any) => ({
                surveyId: newSurvey.id,
                teamId: teamId,
                title: question.title,
                description: question.description,
                format: question.format,
                required: question.required,
                order: question.order,
                yesLabel: question.yesLabel,
                noLabel: question.noLabel,
                buttonLabel: question.buttonLabel
            }))

            await tx.question.createMany({
                data: questionsToCreate,
                skipDuplicates: true
            })

            // Get created questions with their IDs for options
            const questionsWithIds = await tx.question.findMany({
                where: {
                    surveyId: newSurvey.id,
                    teamId: teamId
                },
                select: { id: true, order: true }
            })

            // Batch create question options
            const allOptions = originalSurvey.questions.flatMap((question: any) => {
                if (!question.options || question.options.length === 0) return []

                const newQuestion = questionsWithIds.find(q => q.order === question.order)
                if (!newQuestion) return []

                return question.options.map((option: any) => ({
                    questionId: newQuestion.id,
                    teamId: teamId,
                    text: option.text,
                    order: option.order,
                    isOther: option.isOther
                }))
            })

            if (allOptions.length > 0) {
                await tx.questionOption.createMany({
                    data: allOptions,
                    skipDuplicates: true
                })
            }

            // Update team survey counts for the duplicated survey
            await tx.team.update({
                where: { id: teamId },
                data: {
                    totalSurveys: { increment: 1 }
                    // Note: Duplicated surveys are always created as draft, so no active count increment
                }
            })

            return newSurvey
        }, {
            timeout: 5000 // Reduced timeout due to optimized operations
        })

        revalidatePath("/survey")
        return { success: true, surveyId: result.id }
    } catch (error) {
        console.error("Error duplicating survey:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to duplicate survey"
        }
    }
}

// Update survey status
export const updateSurveyStatus = async (id: string, status: SurveyStatus) => {
    try {
        const wrapper = getPrismaWrapper()
        const teamId = await getTeamIdCached()

        if (!teamId) {
            return {
                success: false,
                error: "Team not found"
            }
        }

        // Get team subscription for usage tracking
        const activeSubscription = await prisma.customerSubscription.findFirst({
            where: {
                teamId: teamId,
                status: { in: ['active', 'trialing'] }
            },
            select: { id: true }
        })

        const subscriptionId = activeSubscription?.id

        // Get current survey status and team ID using direct Prisma call
        const currentSurvey = await prisma.survey.findUnique({
            where: {
                id,
                teamId: teamId // Add team validation
            },
            select: { status: true, teamId: true }
        })

        if (!currentSurvey) {
            return {
                success: false,
                error: "Survey not found"
            }
        }

        // Validate credits before publishing survey (if changing status to published)
        const isChangingToPublished = currentSurvey.status !== SurveyStatus.published &&
            status === SurveyStatus.published

        if (isChangingToPublished) {
            const usageInfo = await getCurrentUsage(teamId, UsageMetricType.ACTIVE_SURVEYS)

            if (usageInfo.isOverLimit || usageInfo.remaining <= 0) {
                const t = await getTranslations("CreateSurvey.messages")
                return {
                    success: false,
                    error: t("activeSurveysLimitReached", { limit: usageInfo.limit }),
                    upgrade: true,
                    currentLimit: usageInfo.limit
                }
            }
        }

        // Generate public token if changing to published
        const publicToken = isChangingToPublished ? crypto.randomUUID() : undefined

        // Update survey status and team counts in optimized transaction
        await prisma.$transaction(async (tx) => {
            // Update survey status using direct Prisma call
            await tx.survey.update({
                where: { id },
                data: {
                    status,
                    ...(publicToken && { publicToken })
                }
            })

            // Update team survey counts based on status changes
            const oldStatus = currentSurvey.status
            const newStatus = status

            if (oldStatus !== newStatus) {
                const updateData: any = {}

                // Handle active surveys count changes
                if (oldStatus === SurveyStatus.published && newStatus !== SurveyStatus.published) {
                    // Moving from published to draft/archived - decrement active
                    updateData.totalActiveSurveys = { decrement: 1 }
                } else if (oldStatus !== SurveyStatus.published && newStatus === SurveyStatus.published) {
                    // Moving to published - increment active
                    updateData.totalActiveSurveys = { increment: 1 }
                }

                if (Object.keys(updateData).length > 0) {
                    await tx.team.update({
                        where: { id: currentSurvey.teamId },
                        data: updateData
                    })
                }

                // Update usage tracking based on status changes
                if (subscriptionId) {
                    if (oldStatus === SurveyStatus.published && newStatus !== SurveyStatus.published) {
                        // Moving from published to draft/archived - decrement usage
                        await decrementActiveSurveysInTransaction(tx, teamId, subscriptionId)
                    } else if (oldStatus !== SurveyStatus.published && newStatus === SurveyStatus.published) {
                        // Moving to published - increment usage
                        await incrementActiveSurveysInTransaction(tx, teamId, subscriptionId)
                    }
                }
            }
        }, {
            timeout: 3000 // Reduced timeout for simple status update
        })

        revalidatePath("/survey")
        return { success: true }
    } catch (error) {
        console.error("Error updating survey status:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update survey status"
        }
    }
}

// Get survey statistics
export const getSurveyStats = async () => {
    try {
        const wrapper = getPrismaWrapper()

        const [
            totalSurveys,
            activeSurveys,
            totalResponses,
            responseRate
        ] = await Promise.all([
            wrapper.count(prisma.survey),
            wrapper.count(prisma.survey, {
                where: { status: SurveyStatus.published }
            }),
            wrapper.count(prisma.surveyResponse),
            // Calculate response rate (simplified - you might want to implement more sophisticated logic)
            wrapper.count(prisma.surveyResponse, {
                where: { status: "completed" }
            })
        ])

        return {
            success: true,
            stats: {
                totalSurveys,
                activeSurveys,
                totalResponses,
                responseRate: totalResponses > 0 ? Math.round((responseRate / totalResponses) * 100) : 0
            }
        }
    } catch (error) {
        console.error("Error fetching survey stats:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch survey statistics"
        }
    }
}

// Get published and archived surveys for results page
export const getPublishedAndArchivedSurveys = async () => {
    try {
        const wrapper = getPrismaWrapper()

        const surveys = await wrapper.findMany(prisma.survey, {
            where: {
                status: {
                    in: [SurveyStatus.published, SurveyStatus.archived]
                }
            },
            orderBy: { updatedAt: 'desc' }
        })

        return { success: true, surveys }
    } catch (error) {
        console.error("Error fetching published and archived surveys:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch surveys"
        }
    }
}

// Get survey response summary data for dashboard charts
export const getSurveyResponseSummary = async (surveyId: string) => {
    try {
        const wrapper = getPrismaWrapper()

        const summaryData = await wrapper.findMany(prisma.surveyResponseSummary, {
            where: {
                surveyId: surveyId
            },
            orderBy: [
                { questionTitle: 'asc' },
                { textValue: 'asc' }
            ]
        })

        return { success: true, summaryData }
    } catch (error) {
        console.error("Error fetching survey response summary:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch survey response summary"
        }
    }
}

// Get question responses for raw data table
export const getQuestionResponses = async (surveyId: string) => {
    try {
        const wrapper = getPrismaWrapper()

        const responses = await wrapper.findMany(prisma.questionResponse, {
            where: {
                response: {
                    surveyId: surveyId
                }
            },
            include: {
                response: {
                    select: {
                        userIp: true,
                        userId: true,
                        extraInfo: true,
                        createdAt: true,
                    }
                }
            },
            orderBy: [
                { response: { createdAt: 'desc' } },
                { question: { order: 'asc' } }
            ]
        })

        return { success: true, responses }
    } catch (error) {
        console.error("Error fetching question responses:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch question responses"
        }
    }
}

// Get question responses for raw data table
export const getQuestionResponsesforRoute = async (surveyId: string) => {
    try {

        const responses = await prisma.questionResponse.findMany({
            where: {
                response: {
                    surveyId: surveyId
                }
            },
            include: {
                response: {
                    select: {
                        userIp: true,
                        userId: true,
                        extraInfo: true,
                        createdAt: true,
                    }
                }
            },
            orderBy: [
                { response: { createdAt: 'desc' } },
                { question: { order: 'asc' } }
            ]
        })

        return { success: true, responses }
    } catch (error) {
        console.error("Error fetching question responses:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch question responses"
        }
    }
}

// Regenerate survey public token
export const regenerateSurveyPublicToken = async (surveyId: string) => {
    try {
        const wrapper = getPrismaWrapper()
        const teamId = await getTeamIdCached()

        if (!teamId) {
            return {
                success: false,
                error: "No team found"
            }
        }

        // Check if user has permission to update this survey
        const survey = await prisma.survey.findFirst({
            where: {
                id: surveyId,
                teamId: teamId
            },
            select: {
                id: true,
                status: true
            }
        })

        if (!survey) {
            return {
                success: false,
                error: "Survey not found"
            }
        }

        // Generate new public token
        const crypto = await import("crypto")
        const newPublicToken = crypto.randomUUID()

        // Update survey with new token
        const updatedSurvey = await prisma.survey.update({
            where: { id: surveyId },
            data: { publicToken: newPublicToken }
        })

        return {
            success: true,
            publicToken: updatedSurvey.publicToken
        }
    } catch (error) {
        console.error("Error regenerating public token:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to regenerate public token"
        }
    }
}

// AI Survey Generation
interface GeneratedQuestion {
    title: string
    description: string
    format: string
    required: boolean
    options?: { text: string; order: number }[]
    yesLabel?: string
    noLabel?: string
}

interface GeneratedQuestionResult {
    id: string
    title: string
    description: string
    format: QuestionFormat
    required: boolean
    order: number
    yesLabel?: string
    noLabel?: string
    options: Array<{
        id?: string
        text: string
        order: number
        isOther?: boolean
    }>
}

interface AIGeneratedSurvey {
    surveyName: string
    surveyDescription: string
    suggestedType: string
    questions: GeneratedQuestion[]
}

export const generateSurveyWithAI = async (prompt: string, surveyTypes: { id: string; name: string }[] = []): Promise<{
    success: boolean
    surveyName?: string
    surveyDescription?: string
    typeId?: string
    questions?: GeneratedQuestionResult[]
    error?: string
}> => {
    try {
        // Verify authentication
        const teamId = await getTeamIdCached()
        if (!teamId) {
            return {
                success: false,
                error: 'Unauthorized'
            }
        }

        if (!prompt || typeof prompt !== 'string') {
            return {
                success: false,
                error: 'Invalid prompt'
            }
        }

        // Check if OpenAI API key is configured
        const openAIKey = process.env.OPENAI_API_KEY
        if (!openAIKey) {
            return {
                success: false,
                error: 'OpenAI API key not configured'
            }
        }

        // Prepare survey types context for AI
        const surveyTypesContext = surveyTypes.length > 0
            ? `Available survey types (MUST choose one of these): ${surveyTypes.map(t => t.name).join(', ')}\nImportant: Use the EXACT name of one of these types for the "suggestedType" field.`
            : 'No existing survey types available.'

        // Call OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openAIKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `You are a professional survey designer. Generate a complete survey based on the user's context.
Return ONLY a valid JSON object without any markdown formatting or code blocks.

The JSON object must have this structure:
{
  "surveyName": "string (concise survey title, max 60 characters)",
  "surveyDescription": "string (brief description of the survey purpose, max 200 characters)",
  "suggestedType": "string (MUST be the exact name from the available survey types list, or a relevant category if none provided)",
  "questions": [array of question objects]
}

Each question object should have:
- title (string): The question text
- description (string): Optional additional context or empty string
- format (string): MUST BE one of these exact values: "YES_NO", "STAR_RATING", "LONG_TEXT", "STATEMENT", "SINGLE_CHOICE", "MULTIPLE_CHOICE"
- required (boolean): Whether the question is required
- options (array, optional): For MULTIPLE_CHOICE, SINGLE_CHOICE and STAR_RATING, array of objects with "text" and "order" properties
- yesLabel (string, optional): For YES_NO questions, custom label for yes option (default: "Yes")
- noLabel (string, optional): For YES_NO questions, custom label for no option (default: "No")

Format descriptions:
- YES_NO: Binary yes/no questions with customizable labels
- STAR_RATING: Rating scale questions using 5 stars
- LONG_TEXT: Open-ended text questions for detailed responses
- STATEMENT: Information display (no user input required)
- SINGLE_CHOICE: Radio button selection (only one answer allowed)
- MULTIPLE_CHOICE: Checkbox selection (multiple answers allowed)

Guidelines:
- Create 2-6 relevant questions
- Mix different question types appropriately
- For SINGLE_CHOICE and MULTIPLE_CHOICE, include 3-6 options
- For LONG_TEXT, don't include options
- For STATEMENT, set required to false and don't include options
- Make questions clear and concise
- Ensure questions flow logically
- Use the exact format values provided

${surveyTypesContext}`
                    },
                    {
                        role: 'user',
                        content: `Create a survey for: ${prompt}`
                    }
                ],
                temperature: 0.7,
                max_tokens: 2500,
            }),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error('OpenAI API error:', errorData)
            return {
                success: false,
                error: 'Failed to generate questions from OpenAI'
            }
        }

        const data = await response.json()
        const content = data.choices[0]?.message?.content

        if (!content) {
            return {
                success: false,
                error: 'No content received from OpenAI'
            }
        }

        // Parse the response - handle potential markdown code blocks
        let aiResponse: AIGeneratedSurvey
        try {
            // Remove markdown code blocks if present
            const cleanContent = content
                .replace(/```json\s*/g, '')
                .replace(/```\s*/g, '')
                .trim()

            aiResponse = JSON.parse(cleanContent)

            // Validate the response structure
            if (!aiResponse.surveyName || !aiResponse.questions || !Array.isArray(aiResponse.questions)) {
                throw new Error('Invalid response structure from AI')
            }
        } catch (parseError) {
            console.error('Failed to parse OpenAI response:', content)
            return {
                success: false,
                error: 'Invalid response format from OpenAI'
            }
        }

        // Match suggested type to existing types or use first available
        let matchedTypeId: string | undefined
        if (surveyTypes.length > 0) {
            if (aiResponse.suggestedType) {
                // Try to match the AI-suggested type to an existing type
                const matchedType = surveyTypes.find(t =>
                    t.name.toLowerCase() === aiResponse.suggestedType.toLowerCase() ||
                    t.name.toLowerCase().includes(aiResponse.suggestedType.toLowerCase()) ||
                    aiResponse.suggestedType.toLowerCase().includes(t.name.toLowerCase())
                )
                matchedTypeId = matchedType?.id
            }

            // If no match found, use the first available survey type
            if (!matchedTypeId) {
                matchedTypeId = surveyTypes[0].id
            }
        }

        // Validate and format questions
        const formattedQuestions: GeneratedQuestionResult[] = aiResponse.questions.map((q, index) => {
            // Map AI-generated formats to Prisma QuestionFormat enum
            // AI should return the correct format names, but we'll validate them
            const validFormats: QuestionFormat[] = [
                QuestionFormat.YES_NO,
                QuestionFormat.STAR_RATING,
                QuestionFormat.LONG_TEXT,
                QuestionFormat.STATEMENT,
                QuestionFormat.SINGLE_CHOICE,
                QuestionFormat.MULTIPLE_CHOICE
            ]

            // Check if the format is valid, otherwise default to LONG_TEXT
            const format = validFormats.includes(q.format as QuestionFormat)
                ? (q.format as QuestionFormat)
                : QuestionFormat.LONG_TEXT

            // Base question structure matching CreateSurveyQuestion interface
            const question: GeneratedQuestionResult = {
                id: `ai-generated-${Date.now()}-${index}`,
                title: q.title || `Question ${index + 1}`,
                description: q.description || '',
                format: format,
                required: format === QuestionFormat.STATEMENT ? false : (q.required !== false),
                order: index,
                yesLabel: undefined,
                noLabel: undefined,
                options: []
            }

            // Add format-specific properties
            if (format === QuestionFormat.YES_NO) {
                // YES_NO requires yesLabel and noLabel
                question.yesLabel = q.yesLabel || 'Yes'
                question.noLabel = q.noLabel || 'No'
                question.options = [] // YES_NO doesn't use options
            } else if (format === QuestionFormat.MULTIPLE_CHOICE || format === QuestionFormat.SINGLE_CHOICE) {
                // MULTIPLE_CHOICE and SINGLE_CHOICE require options
                if (q.options && q.options.length > 0) {
                    question.options = q.options.map((opt, optIndex) => ({
                        id: `opt-${Date.now()}-${index}-${optIndex}`,
                        text: opt.text,
                        order: optIndex,
                        isOther: false
                    }))
                } else {
                    // Provide default options if none specified
                    question.options = [
                        { id: `opt-${Date.now()}-${index}-0`, text: 'Option 1', order: 0, isOther: false },
                        { id: `opt-${Date.now()}-${index}-1`, text: 'Option 2', order: 1, isOther: false },
                        { id: `opt-${Date.now()}-${index}-2`, text: 'Option 3', order: 2, isOther: false }
                    ]
                }
            } else if (format === QuestionFormat.STAR_RATING) {
                // STAR_RATING requires options (rating scale)
                if (q.options && q.options.length > 0) {
                    question.options = q.options.map((opt, optIndex) => ({
                        id: `opt-${Date.now()}-${index}-${optIndex}`,
                        text: opt.text,
                        order: optIndex,
                        isOther: false
                    }))
                } else {
                    // Default 5-star rating
                    question.options = Array.from({ length: 5 }, (_, i) => ({
                        id: `opt-${Date.now()}-${index}-${i}`,
                        text: `${i + 1}`,
                        order: i,
                        isOther: false
                    }))
                }
            } else if (format === QuestionFormat.LONG_TEXT || format === QuestionFormat.STATEMENT) {
                // LONG_TEXT and STATEMENT don't need options
                question.options = []
            }

            return question
        })

        return {
            success: true,
            surveyName: aiResponse.surveyName,
            surveyDescription: aiResponse.surveyDescription || '',
            typeId: matchedTypeId,
            questions: formattedQuestions
        }

    } catch (error) {
        console.error('Error generating survey:', error)
        return {
            success: false,
            error: 'Internal server error'
        }
    }
}