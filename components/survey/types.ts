import { QuestionFormat } from "@/lib/generated/prisma"

export interface SurveyData {
    id: string
    title: string
    description: string
    createdAt: string
    totalResponses: number
    questions: Question[]
    responses?: SurveyResponse[]
}

export interface Question {
    id: string
    text: string
    type: string
    options?: Option[]
    responses?: string[]
}

export interface Option {
    value: string
    label: string
    count: number
}

export interface SurveyResponse {
    id: string
    submittedAt: string
    answers: ResponseAnswer[]
}

export interface ResponseAnswer {
    questionId: string
    questionText: string
    answer: string
}

// Question interface for creating/editing surveys
export interface CreateSurveyQuestion {
    id: string
    title: string
    description: string
    format: QuestionFormat
    required: boolean
    order: number
    yesLabel?: string
    noLabel?: string
    buttonLabel?: string
    options: Array<{
        id?: string
        text: string
        order: number
        isOther?: boolean
    }>
}
