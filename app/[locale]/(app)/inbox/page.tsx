import { Suspense } from "react"
import { getTranslations } from "next-intl/server"
import { AppShell } from "@/components/app-shell"
import { InboxPageLoader } from "@/components/inbox/inbox-page-loader"
import { InboxPageSkeleton } from "@/components/inbox/inbox-page-skeleton"
import { getBotinhoSession } from "@/lib/botinho-auth"
import { enforceAppAccess } from "@/lib/onboarding/enforce-app-access"

export default async function InboxPage() {
  await enforceAppAccess()
  const t = await getTranslations("Inbox")
  const session = await getBotinhoSession()
  const hasCompanyAccess = session.ok && Boolean(session.companyId)

  return (
    <AppShell title={t("title")} variant="fullBleed">
      <Suspense fallback={<InboxPageSkeleton />}>
        <InboxPageLoader
          hasCompanyAccess={hasCompanyAccess}
          initialCompanyId={session.companyId ?? null}
        />
      </Suspense>
    </AppShell>
  )
}
