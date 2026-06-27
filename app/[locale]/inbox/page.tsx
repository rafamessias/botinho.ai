import type { CSSProperties } from "react"
import { Suspense } from "react"
import { getTranslations } from "next-intl/server"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import Inbox from "@/components/inbox/inbox-page"
import { loadInboxInitialData } from "@/lib/inbox/load-inbox-initial-data"
import { getBotinhoSession } from "@/lib/botinho-auth"

export const dynamic = "force-dynamic"

export default async function InboxPage() {
  const t = await getTranslations("Inbox")
  const session = await getBotinhoSession()
  const hasCompanyAccess = session.ok && Boolean(session.companyId)

  const initialData = hasCompanyAccess ? await loadInboxInitialData() : null

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="!pb-0 flex flex-col overflow-hidden">
        <SiteHeader title={t("title")} />
        <div className="flex-1 overflow-hidden">
          <Suspense fallback={null}>
            <Inbox
              hasCompanyAccess={hasCompanyAccess}
              initialCompanyId={session.companyId ?? null}
              initialData={initialData}
            />
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
