import "server-only"
import { PDFParse } from "pdf-parse"
import { MAX_KNOWLEDGE_PDF_SIZE_BYTES } from "@/lib/knowledge/pdf-constants"

export const extractPdfText = async (buffer: Buffer): Promise<string> => {
  if (buffer.length > MAX_KNOWLEDGE_PDF_SIZE_BYTES) {
    throw new Error(`PDF file exceeds the ${MAX_KNOWLEDGE_PDF_SIZE_BYTES / (1024 * 1024)} MB limit`)
  }

  const parser = new PDFParse({ data: buffer })

  try {
    const result = await parser.getText()
    const text = result.text?.trim() ?? ""

    if (!text) {
      throw new Error("No text could be extracted from the PDF")
    }

    return text
  } finally {
    await parser.destroy()
  }
}
