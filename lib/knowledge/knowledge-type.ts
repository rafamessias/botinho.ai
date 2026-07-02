import { KnowledgeItemType } from "@/lib/types/enums"
import type { KnowledgeTab } from "@/components/ai-training/types"

export const knowledgeTypeToView = (type: KnowledgeItemType): KnowledgeTab => {
  if (type === KnowledgeItemType.URL) return "url"
  if (type === KnowledgeItemType.PDF) return "pdf"
  return "text"
}

export const knowledgeTypeFromView = (value: KnowledgeTab): KnowledgeItemType => {
  if (value === "url") return KnowledgeItemType.URL
  if (value === "pdf") return KnowledgeItemType.PDF
  return KnowledgeItemType.TEXT
}
