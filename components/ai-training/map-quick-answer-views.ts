import type { QuickAnswerView } from "@/components/ai-training/types"

const formatDateValue = (value: Date | string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return date.toISOString().split("T")[0]
}

type QuickAnswerSource = {
  id: string
  content: string
  createdAt: Date | string
  updatedAt: Date | string
}

export const mapQuickAnswersToView = (items: QuickAnswerSource[]): QuickAnswerView[] =>
  items.map((item) => ({
    id: item.id,
    content: item.content,
    createdAt: formatDateValue(item.createdAt),
    updatedAt: formatDateValue(item.updatedAt),
  }))

export const mapQuickAnswerToView = (item: QuickAnswerSource): QuickAnswerView =>
  mapQuickAnswersToView([item])[0]
