import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SurveyResults } from "@/components/survey/survey-results"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { getPublishedAndArchivedSurveys } from "@/components/server-actions/survey"

export default async function Page() {
  const surveysResult = await getPublishedAndArchivedSurveys()

  // Transform the database surveys to match the expected format
  const surveys = surveysResult.success && surveysResult.surveys ? surveysResult.surveys.map(survey => ({
    id: survey.id,
    title: survey.name.length > 45 ? survey.name.slice(0, 45) + "..." : survey.name,
    description: survey.description || "",
    createdAt: survey.createdAt.toLocaleDateString(),
    totalResponses: survey.totalResponses,
    status: survey.status,
    type: survey.type?.name || "Default",
    questions: [] // Will be populated when survey is selected
  })) : []

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
        <SiteHeader title="" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 max-w-6xl w-full mx-auto">
              <SurveyResults serverSurveys={surveys} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
