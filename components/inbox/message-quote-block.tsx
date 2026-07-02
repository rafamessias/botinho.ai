"use client"

import { cn } from "@/lib/utils"
import type { InboxMessageQuote, InboxMessageSenderType } from "@/components/inbox/inbox-mappers"

type MessageQuoteBlockProps = {
  quote: InboxMessageQuote
  senderLabel: string
  className?: string
  accentClassName?: string
  labelClassName?: string
  onClick?: () => void
}

export const resolveQuoteSenderLabel = (
  senderType: InboxMessageSenderType | undefined,
  labels: {
    customer: string
    agent: string
    bot: string
    system: string
    unknown: string
  },
) => {
  switch (senderType) {
    case "customer":
      return labels.customer
    case "agent":
      return labels.agent
    case "bot":
      return labels.bot
    case "system":
      return labels.system
    default:
      return labels.unknown
  }
}

export const MessageQuoteBlock = ({
  quote,
  senderLabel,
  className,
  accentClassName = "border-agent/60",
  labelClassName = "text-agent",
  onClick,
}: MessageQuoteBlockProps) => {
  const Container = onClick ? "button" : "div"

  return (
    <Container
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "mb-2 w-full rounded-md border-l-4 bg-black/5 px-2.5 py-1.5 text-left",
        accentClassName,
        onClick && "cursor-pointer transition-colors hover:bg-black/10",
        className,
      )}
    >
      <p className={cn("truncate text-[11px] font-semibold", labelClassName)}>{senderLabel}</p>
      <p className="line-clamp-2 text-xs text-muted-foreground">{quote.content}</p>
    </Container>
  )
}
