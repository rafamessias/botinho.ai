import type { TemplateView } from "@/components/ai-training/types"
import { AiTemplateCategory } from "@/lib/types/enums"

const formatDateValue = (value: Date | string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return date.toISOString().split("T")[0]
}

type TemplateSource = {
  id: string
  name: string
  content: string
  category: AiTemplateCategory
  createdAt: Date | string
  updatedAt: Date | string
  options?: { id: string; label: string; value: string }[]
}

export const mapTemplatesToView = (templates: TemplateSource[]): TemplateView[] =>
  templates.map((item) => ({
    id: item.id,
    name: item.name,
    content: item.content,
    category: item.category,
    createdAt: formatDateValue(item.createdAt),
    updatedAt: formatDateValue(item.updatedAt),
    options: item.options?.map((option) => ({
      id: option.id,
      label: option.label,
      value: option.value,
    })),
  }))

export const mapTemplateToView = (item: TemplateSource): TemplateView => mapTemplatesToView([item])[0]
