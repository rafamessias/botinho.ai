import { generateLegalMetadata, LegalDocument } from "@/components/legal/legal-document"

export const generateMetadata = () => generateLegalMetadata("privacy")

export default function PrivacyPage() {
  return <LegalDocument namespace="privacy" />
}
