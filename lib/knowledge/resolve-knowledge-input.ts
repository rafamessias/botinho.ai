import { z } from "zod"
import { extractPdfText } from "@/lib/knowledge/extract-pdf-text"
import { MAX_KNOWLEDGE_PDF_SIZE_BYTES } from "@/lib/knowledge/pdf-constants"
import { KnowledgeItemType } from "@/lib/types/enums"

const textKnowledgeSchema = z.object({
  title: z.string().trim().min(1),
  content: z.string().trim().min(1),
  type: z.literal(KnowledgeItemType.TEXT),
})

const urlKnowledgeSchema = z.object({
  title: z.string().trim().min(1),
  content: z.string().trim().min(1),
  type: z.literal(KnowledgeItemType.URL),
})

const pdfKnowledgeSchema = z
  .object({
    title: z.string().trim().min(1),
    type: z.literal(KnowledgeItemType.PDF),
    pdfBase64: z.string().min(1).optional(),
    fileName: z.string().trim().min(1).max(255).optional(),
    content: z.string().trim().min(1).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.pdfBase64 && !data.fileName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "File name is required when uploading a PDF",
        path: ["fileName"],
      })
    }

    if (!data.pdfBase64 && !data.content) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "PDF file or extracted content is required",
        path: ["pdfBase64"],
      })
    }
  })

export const knowledgeItemInputSchema = z.union([
  textKnowledgeSchema,
  urlKnowledgeSchema,
  pdfKnowledgeSchema,
])

export type KnowledgeItemInput = z.infer<typeof knowledgeItemInputSchema>

export type ResolvedKnowledgeItemInput = {
  title: string
  content: string
  type: KnowledgeItemType
  urlSummary?: string
}

export const resolveKnowledgeItemInput = async (
  input: KnowledgeItemInput,
): Promise<ResolvedKnowledgeItemInput> => {
  if (input.type === KnowledgeItemType.PDF) {
    if (input.content && !input.pdfBase64) {
      return {
        title: input.title,
        content: input.content,
        type: KnowledgeItemType.PDF,
      }
    }

    if (!input.pdfBase64) {
      throw new Error("PDF file is required")
    }

    const buffer = Buffer.from(input.pdfBase64, "base64")

    if (buffer.length > MAX_KNOWLEDGE_PDF_SIZE_BYTES) {
      throw new Error(`PDF file exceeds the ${MAX_KNOWLEDGE_PDF_SIZE_BYTES / (1024 * 1024)} MB limit`)
    }

    const content = await extractPdfText(buffer)
    return {
      title: input.title,
      content,
      type: KnowledgeItemType.PDF,
    }
  }

  return {
    title: input.title,
    content: input.content,
    type: input.type,
  }
}
