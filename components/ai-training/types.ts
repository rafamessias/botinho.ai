import { AiTemplateCategory } from "@/lib/generated/prisma"
export type TranslationFn = (...args: any[]) => string

export interface KnowledgeItemView {
    id: string
    type: "text" | "url"
    title: string
    content: string
    createdAt: string
    updatedAt: string
}

export interface QuickAnswerView {
    id: string
    content: string
    createdAt: string
    updatedAt: string
}

export interface TemplateOptionView {
    id: string
    label: string
    value: string
}

export interface TemplateView {
    id: string
    name: string
    content: string
    category: AiTemplateCategory
    createdAt: string
    updatedAt: string
    options?: TemplateOptionView[]
}

export type MainTab = "knowledge" | "templates" | "quickAnswers"


