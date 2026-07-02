import { cn } from "@/lib/utils"

const MESSAGE_THREAD_SKELETON_ITEMS = [
  { side: "left" as const, widthClass: "w-[52%]", heightClass: "h-10" },
  { side: "right" as const, widthClass: "w-[44%]", heightClass: "h-10" },
  { side: "left" as const, widthClass: "w-[36%]", heightClass: "h-10" },
  { side: "right" as const, widthClass: "w-[58%]", heightClass: "h-14" },
  { side: "left" as const, widthClass: "w-[48%]", heightClass: "h-10" },
  { side: "right" as const, widthClass: "w-[40%]", heightClass: "h-10" },
  { side: "left" as const, widthClass: "w-[55%]", heightClass: "h-14" },
  { side: "right" as const, widthClass: "w-[32%]", heightClass: "h-10" },
]

const ConversationListSkeleton = () => (
  <div className="flex h-full w-full flex-col border-r border-border/60 bg-background">
    <div className="flex h-14 items-center gap-2 border-b border-border/60 px-3">
      <div className="h-9 flex-1 rounded-md bg-muted animate-pulse" />
      <div className="h-9 w-9 rounded-md bg-muted animate-pulse" />
    </div>
    <div className="space-y-2 p-3">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={`conversation-skeleton-${index}`} className="flex items-center gap-3 rounded-lg p-2">
          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-muted animate-pulse" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3 w-2/3 rounded bg-muted animate-pulse" />
            <div className="h-3 w-full rounded bg-muted animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  </div>
)

const MessageThreadSkeleton = () => (
  <div className="flex h-full min-h-full flex-col px-4 py-5" aria-hidden="true">
    <div className="space-y-3">
      {MESSAGE_THREAD_SKELETON_ITEMS.map((item, index) => (
        <div
          key={`message-skeleton-${index}`}
          className={cn("flex items-end gap-2", item.side === "right" && "flex-row-reverse")}
        >
          <div className="h-8 w-8 flex-shrink-0 rounded-full bg-muted animate-pulse" />
          <div
            className={cn(
              "max-w-[80%] rounded-lg bg-muted/80 animate-pulse md:max-w-[70%]",
              item.widthClass,
              item.heightClass,
            )}
          />
        </div>
      ))}
    </div>
  </div>
)

const ContextPanelSkeleton = () => (
  <div className="h-full space-y-3 overflow-y-auto p-4 pb-6">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={`context-skeleton-${index}`} className="space-y-3 rounded-xl border border-border/60 p-4">
        <div className="h-4 w-24 rounded bg-muted animate-pulse" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-muted animate-pulse" />
          <div className="h-3 w-2/3 rounded bg-muted animate-pulse" />
        </div>
      </div>
    ))}
  </div>
)

export const InboxPageSkeleton = () => (
  <div className="flex min-h-0 min-w-0 w-full flex-1 overflow-hidden bg-background">
    <div className="hidden w-[350px] shrink-0 overflow-hidden md:flex">
      <ConversationListSkeleton />
    </div>
    <div className="flex min-h-0 min-w-0 flex-1 basis-0 flex-col">
      <div className="flex h-14 flex-shrink-0 items-center gap-3 border-b border-border/60 px-4">
        <div className="h-9 w-9 flex-shrink-0 rounded-full bg-muted animate-pulse" />
        <div className="min-w-0 space-y-2">
          <div className="h-4 w-32 rounded bg-muted animate-pulse" />
          <div className="h-3 w-24 rounded bg-muted animate-pulse" />
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        <MessageThreadSkeleton />
      </div>
      <div className="flex-shrink-0 border-t border-border/60 p-4">
        <div className="h-12 rounded-md bg-muted animate-pulse" />
      </div>
    </div>
    <div className="hidden w-72 flex-shrink-0 overflow-hidden border-l border-border/60 md:flex md:flex-col">
      <div className="flex h-14 items-center border-b border-border/60 px-4">
        <div className="h-4 w-20 rounded bg-muted animate-pulse" />
      </div>
      <ContextPanelSkeleton />
    </div>
  </div>
)
