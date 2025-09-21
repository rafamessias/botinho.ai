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
