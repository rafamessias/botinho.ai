import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { PublicSurveyClient } from "./public-survey-client"

interface PageProps {
    params: {
        surveyId: string
    }
}

export default async function PublicSurveyPage({ params }: PageProps) {
    const headersList = await headers()
    const token = headersList.get('authorization')?.replace('Bearer ', '') ||
        headersList.get('x-team-token') ||
        ''

    if (!token) {
        redirect('/survey/error?message=Token is required')
    }

    return (
        <PublicSurveyClient
            surveyId={params.surveyId}
            token={token}
        />
    )
}