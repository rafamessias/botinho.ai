import { Bot, CheckCheck } from "lucide-react"

import { Card } from "@/components/ui/card"

type HeroStaticPreviewProps = {
  customerName: string
  customerQuestion: string
  aiReply: string
  reservationConfirmation: string
  reservationCode: string
}

export const HeroStaticPreview = ({
  customerName,
  customerQuestion,
  aiReply,
  reservationConfirmation,
  reservationCode,
}: HeroStaticPreviewProps) => (
  <Card className="flex-1 overflow-hidden rounded-3xl border border-border bg-card p-0 shadow-md lg:shadow-lg">
    <div className="flex h-[360px] flex-col bg-secondary lg:h-[400px]">
      <header className="flex h-11 shrink-0 items-center gap-2 border-b border-border bg-card px-4">
        <div className="flex size-7 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">
          {customerName
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)}
        </div>
        <p className="truncate text-xs font-semibold text-foreground">{customerName}</p>
      </header>
      <div className="flex flex-1 flex-col gap-2.5 overflow-hidden p-4">
        <div className="max-w-[85%] rounded-lg border border-border bg-card px-3 py-2 text-[11px] leading-snug">
          {customerQuestion}
        </div>
        <div className="ml-auto max-w-[85%] rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-[11px] leading-snug">
          <span className="mb-1 flex items-center gap-1 text-[9px] font-medium text-primary">
            <Bot className="size-3" aria-hidden />
            botinho
          </span>
          {aiReply}
          <div className="mt-1 flex items-center gap-1 text-[10px] text-primary/60">
            <CheckCheck className="size-3" aria-hidden />
          </div>
        </div>
        <div className="ml-auto max-w-[85%] rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-[11px] leading-snug">
          <p>{reservationConfirmation}</p>
          <p className="mt-1 font-mono text-[10px] font-semibold text-primary">{reservationCode}</p>
        </div>
      </div>
    </div>
  </Card>
)
