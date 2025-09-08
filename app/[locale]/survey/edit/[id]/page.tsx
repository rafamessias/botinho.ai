import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { EditSurveyForm } from "@/components/survey/edit-survey-form"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { getSurveyTypes } from "@/components/server-actions/survey-types"
import { getSurvey } from "@/components/server-actions/survey"
import { notFound } from "next/navigation"

interface EditSurveyPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditSurveyPage({ params }: EditSurveyPageProps) {
    const { id } = await params

    // Fetch survey types and survey data in parallel
    const [surveyTypesResult, surveyResult] = await Promise.all([
        getSurveyTypes(),
        getSurvey(id)
    ])

    let surveyTypes = []
    if (surveyTypesResult.success && surveyTypesResult.surveyTypes) {
        surveyTypes = surveyTypesResult.surveyTypes
    }

    if (!surveyResult.success || !surveyResult.survey) {
        notFound()
    }

    const survey = surveyResult.survey

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader title="Edit Survey" />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col py-4 px-6 max-w-4xl w-full mx-auto">
                            <EditSurveyForm
                                survey={survey}
                                surveyTypes={surveyTypes}
                            />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
