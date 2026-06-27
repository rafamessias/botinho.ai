export const MAX_KNOWLEDGE_PDF_SIZE_BYTES = 5 * 1024 * 1024
export const MAX_KNOWLEDGE_PDF_SIZE_MB = 5

export const isPdfFile = (file: File) =>
  file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
