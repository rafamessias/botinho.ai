import { generateLegalMetadata, LegalDocument } from "@/components/legal/legal-document"

export const generateMetadata = () => generateLegalMetadata("terms")

export default function TermsPage() {
  return <LegalDocument namespace="terms" />
}
