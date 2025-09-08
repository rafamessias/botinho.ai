import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { CreateSurveyForm } from "@/components/survey/create-survey-form"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { getSurveyTypes } from "@/components/server-actions/survey-types";

export default async function CreateSurveyPage() {

    const result = await getSurveyTypes()
    let surveyTypes = []
    if (result.success && result.surveyTypes) {
        surveyTypes = result.surveyTypes
    }

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
                <SiteHeader title="Create Survey" />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col py-4 px-6 max-w-4xl w-full mx-auto">
                            <CreateSurveyForm surveyTypes={surveyTypes} />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
