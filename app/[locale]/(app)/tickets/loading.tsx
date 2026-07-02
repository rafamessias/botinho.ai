import { Skeleton } from "@/components/ui/skeleton"

export default function TicketsLoading() {
  return (
    <div className="flex h-[calc(100vh-48px)] w-full min-w-0 flex-1 flex-col overflow-hidden bg-background">
      <div className="flex min-h-0 min-w-0 w-full flex-1 overflow-hidden">
        <div className="hidden w-[340px] shrink-0 flex-col border-r border-border/60 md:flex">
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-border/60 px-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="space-y-2 border-b border-border/60 p-3">
            <Skeleton className="h-9 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 flex-1" />
            </div>
          </div>
          <div className="flex-1 space-y-0 divide-y divide-border/60">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-2 px-4 py-3">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-10" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 basis-0 flex-col">
          <div className="hidden h-14 shrink-0 items-center border-b border-border/60 px-4 md:flex">
            <Skeleton className="size-8" />
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6">
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
        </div>
      </div>
    </div>
  )
}
