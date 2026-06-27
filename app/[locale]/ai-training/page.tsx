import { redirect } from "next/navigation"

type AiTrainingRedirectPageProps = {
    params: Promise<{ locale: string }>
}

export default async function AiTrainingRedirectPage({ params }: AiTrainingRedirectPageProps) {
    const { locale } = await params
    redirect(`/${locale}/ai-agents`)
}
