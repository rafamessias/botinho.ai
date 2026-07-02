import InboxPage from "@/components/inbox/inbox-page"
import { loadInboxInitialData } from "@/lib/inbox/load-inbox-initial-data"
import { serializeInboxInitialData } from "@/lib/inbox/serialize-inbox-initial-data"

type InboxPageLoaderProps = {
  hasCompanyAccess: boolean
  initialCompanyId: string | null
}

export const InboxPageLoader = async ({
  hasCompanyAccess,
  initialCompanyId,
}: InboxPageLoaderProps) => {
  const initialData =
    hasCompanyAccess && initialCompanyId
      ? serializeInboxInitialData(await loadInboxInitialData())
      : null

  return (
    <InboxPage
      hasCompanyAccess={hasCompanyAccess}
      initialCompanyId={initialCompanyId}
      initialData={initialData}
    />
  )
}
