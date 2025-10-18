import { redirect } from "next/navigation"
import { PublicSurveyClient } from "./public-survey-client"
import { prisma } from "@/prisma/lib/prisma"

interface PageProps {
    params: Promise<{
        surveyId: string
    }>
    searchParams: Promise<{
        token?: string
    }>
}

export default async function PublicSurveyPage({ params, searchParams }: PageProps) {
    const { surveyId } = await params
    const { token } = await searchParams

    if (!token) {
        redirect('/survey/error?message=Invalid survey link')
    }

    // Validate survey exists, is published, and token matches
    const survey = await prisma.survey.findFirst({
        where: {
            id: surveyId,
            publicToken: token,
            status: 'published'
        },
        select: {
            name: true,
            description: true,
            team: {
                select: {
                    tokenSurvery: true
                }
            }
        }
    })

    if (!survey || !survey.team.tokenSurvery) {
        redirect('/survey/error?message=Survey not found or not published')
    }

    // Token is valid, let the Opineeo widget handle everything
    return (
        <PublicSurveyClient
            surveyId={surveyId}
            token={survey.team.tokenSurvery}
            surveyName={survey.name}
            surveyDescription={survey.description}
        />
    )
}