import * as React from "react"
import { getTranslations } from "next-intl/server"
import { auth } from "@/app/auth"
import { getUserTeamsAction } from "@/components/server-actions/team"
import { TeamDashboard } from "@/components/team/team-dashboard"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"

export default async function TeamPage() {
    const t = await getTranslations("Team")

    // Get current user session
    const session = await auth()
    if (!session?.user?.email) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
                    <p className="text-muted-foreground">Please sign in to view teams.</p>
                </div>
            </div>
        )
    }

    // Get teams data server-side
    const teamsResult = await getUserTeamsAction()
    const teams = teamsResult.success && teamsResult.teams ? teamsResult.teams : []
    // Get current user ID from session
    const currentUserId = typeof session.user.id === 'number' ? session.user.id : 0

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
                <SiteHeader title={t("title")} />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2 max-w-4xl w-full mx-auto">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <TeamDashboard initialTeams={teams as any} currentUserId={currentUserId} />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
