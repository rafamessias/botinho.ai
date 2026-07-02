import { Skeleton } from "@/components/ui/skeleton"

export const TicketDetailSkeleton = () => (
  <div className="flex h-full min-h-0 flex-col">
    <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border/60 px-4 py-3 md:h-14">
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-8 w-24 shrink-0" />
    </div>
    <div className="flex min-h-0 flex-1 flex-col gap-4 p-4">
      <Skeleton className="h-9 w-full max-w-xs" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  </div>
)
