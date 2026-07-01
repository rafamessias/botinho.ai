import { redirect } from "next/navigation"
import { enforceAppAccess } from "@/lib/onboarding/enforce-app-access"

type AiTrainingRedirectPageProps = {
    params: Promise<{ locale: string }>
}

export default async function AiTrainingRedirectPage({ params }: AiTrainingRedirectPageProps) {
    await enforceAppAccess()
    const { locale } = await params
    redirect(`/${locale}/ai-agents`)
}
