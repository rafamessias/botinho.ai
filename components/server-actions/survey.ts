"use server"

import { revalidatePath } from "next/cache"
import { getPrismaWrapper, getCurrentTeamId } from "@/lib/prisma-wrapper"
import { prisma } from "@/prisma/lib/prisma"
import { SurveyStatus, QuestionFormat } from "@/lib/generated/prisma"
import { z } from "zod"

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
    ResponseRate: number
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
                include: {
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

        // Update survey status and team counts in optimized transaction
        await prisma.$transaction(async (tx) => {
            // Update survey status using direct Prisma call
            await tx.survey.update({
                where: { id },
                data: { status }
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
