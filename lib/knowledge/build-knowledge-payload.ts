import { fileToBase64 } from "@/lib/knowledge/file-to-base64"
import { knowledgeTypeFromView } from "@/lib/knowledge/knowledge-type"
import type { KnowledgeItemInput } from "@/lib/knowledge/resolve-knowledge-input"
import { KnowledgeItemType } from "@/lib/types/enums"
import type { KnowledgeItemView, KnowledgeTab } from "@/components/ai-training/types"

type BuildKnowledgePayloadParams = {
  title: string
  content: string
  activeTab: KnowledgeTab
  pdfFile: File | null
  editingItem: KnowledgeItemView | null
}

export const buildKnowledgeItemPayload = async ({
  title,
  content,
  activeTab,
  pdfFile,
  editingItem,
}: BuildKnowledgePayloadParams): Promise<KnowledgeItemInput> => {
  const trimmedTitle = title.trim()
  const type = knowledgeTypeFromView(activeTab)

  if (type === KnowledgeItemType.PDF) {
    if (pdfFile) {
      return {
        title: trimmedTitle,
        type: KnowledgeItemType.PDF,
        pdfBase64: await fileToBase64(pdfFile),
        fileName: pdfFile.name,
      }
    }

    if (editingItem?.type === "pdf" && content.trim()) {
      return {
        title: trimmedTitle,
        type: KnowledgeItemType.PDF,
        content: content.trim(),
      }
    }

    throw new Error("PDF file is required")
  }

  return {
    title: trimmedTitle,
    content: content.trim(),
    type,
  }
}

export const isKnowledgeFormValid = ({
  title,
  content,
  activeTab,
  pdfFile,
  editingItem,
}: BuildKnowledgePayloadParams) => {
  if (!title.trim()) return false

  if (activeTab === "pdf") {
    return Boolean(pdfFile) || editingItem?.type === "pdf"
  }

  return Boolean(content.trim())
}
