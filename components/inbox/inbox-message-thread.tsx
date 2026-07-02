"use client"

import { useEffect, useMemo, useRef } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useTranslations } from "next-intl"
import {
  AlertTriangle,
  Bot,
  CheckCheck,
  Clock,
  CornerDownLeft,
  User,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MessageQuoteBlock, resolveQuoteSenderLabel } from "@/components/inbox/message-quote-block"
import type { InboxMessage } from "@/components/inbox/inbox-mappers"

type MessageSkeletonItem = {
  side: "left" | "right"
  widthClass: string
  heightClass: string
}

const MESSAGE_THREAD_SKELETON_ITEMS: MessageSkeletonItem[] = [
  { side: "left", widthClass: "w-[52%]", heightClass: "h-10" },
  { side: "right", widthClass: "w-[44%]", heightClass: "h-10" },
  { side: "left", widthClass: "w-[36%]", heightClass: "h-10" },
  { side: "right", widthClass: "w-[58%]", heightClass: "h-14" },
  { side: "left", widthClass: "w-[48%]", heightClass: "h-10" },
  { side: "right", widthClass: "w-[40%]", heightClass: "h-10" },
  { side: "left", widthClass: "w-[55%]", heightClass: "h-14" },
  { side: "right", widthClass: "w-[32%]", heightClass: "h-10" },
]

export const MessageThreadSkeleton = () => (
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

type InboxMessageThreadProps = {
  messages: InboxMessage[]
  selectedConversationId: string | null
  onReplyToMessage: (message: InboxMessage) => void
  onLoadOlderMessages?: () => void
  hasMoreOlderMessages?: boolean
  isLoadingOlderMessages?: boolean
  messagesEndRef: React.RefObject<HTMLDivElement | null>
}

export const InboxMessageThread = ({
  messages,
  selectedConversationId,
  onReplyToMessage,
  onLoadOlderMessages,
  hasMoreOlderMessages = false,
  isLoadingOlderMessages = false,
  messagesEndRef,
}: InboxMessageThreadProps) => {
  const t = useTranslations("Inbox")
  const parentRef = useRef<HTMLDivElement>(null)
  const previousMessageCountRef = useRef(messages.length)

  const quoteSenderLabels = useMemo(
    () => ({
      customer: t("messages.quoteSender.customer"),
      agent: t("messages.quoteSender.agent"),
      bot: t("messages.quoteSender.bot"),
      system: t("messages.quoteSender.system"),
      unknown: t("messages.quoteSender.unknown"),
    }),
    [t],
  )

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 88,
    overscan: 8,
  })

  useEffect(() => {
    const parent = parentRef.current
    if (!parent) {
      return
    }

    const grew = messages.length > previousMessageCountRef.current
    previousMessageCountRef.current = messages.length

    if (grew) {
      requestAnimationFrame(() => {
        parent.scrollTop = parent.scrollHeight
      })
    }
  }, [messages.length, selectedConversationId])

  useEffect(() => {
    const parent = parentRef.current
    if (!parent || !onLoadOlderMessages || !hasMoreOlderMessages || isLoadingOlderMessages) {
      return
    }

    const handleScroll = () => {
      if (parent.scrollTop <= 48) {
        onLoadOlderMessages()
      }
    }

    parent.addEventListener("scroll", handleScroll, { passive: true })
    return () => parent.removeEventListener("scroll", handleScroll)
  }, [hasMoreOlderMessages, isLoadingOlderMessages, onLoadOlderMessages, selectedConversationId])

  return (
    <div ref={parentRef} className="h-full overflow-y-auto px-4 py-5">
      {hasMoreOlderMessages && (
        <div className="mb-3 flex justify-center">
          <span className="text-xs text-muted-foreground">
            {isLoadingOlderMessages ? t("messages.loadingOlder") : t("messages.scrollForOlder")}
          </span>
        </div>
      )}
      <div
        className="relative w-full"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const message = messages[virtualItem.index]
          if (!message) {
            return null
          }

          const sentBy = message.sentBy
          const isCustomer = sentBy === "customer"
          const isBot = sentBy === "robot"
          const isAgent = sentBy === "user"
          const isSystem = sentBy === "system"
          const isOutbound = !isCustomer
          const shouldShowStatus =
            isOutbound &&
            message.status &&
            (message.status === "delivered" ||
              message.status === "read" ||
              (isBot && (message.status === "pending" || message.status === "failed")))
          const isBotFailed = isBot && message.status === "failed"
          const isBotPending = isBot && message.status === "pending"

          const avatarFallbackClass = cn(
            "text-xs font-semibold",
            isCustomer && "bg-muted text-muted-foreground",
            isAgent && "bg-agent/10 text-agent",
            isBot && "bg-muted text-primary",
            isSystem && "bg-muted text-muted-foreground",
          )

          const bubbleClass = cn(
            "max-w-[80%] md:max-w-[70%] rounded-lg px-3 py-2 text-sm",
            isCustomer && "bg-card border border-border text-foreground",
            isAgent && "bg-agent/10 border border-agent/20 text-foreground",
            isBot && "bg-primary/5 border border-primary/20 text-foreground",
            isSystem && "bg-muted/60 border border-border/60 text-muted-foreground italic",
          )

          const metaClass = cn(
            "flex items-center gap-1.5 mt-2 text-[11px]",
            isCustomer && "text-muted-foreground",
            isAgent && "text-agent/70",
            isBot && "text-primary/60",
            isSystem && "text-muted-foreground",
          )

          return (
            <div
              key={message.id}
              ref={virtualizer.measureElement}
              data-index={virtualItem.index}
              className={cn("absolute left-0 top-0 w-full pb-3", isOutbound && "flex justify-end")}
              style={{ transform: `translateY(${virtualItem.start}px)` }}
            >
              <div className={cn("group flex w-full items-end gap-2", isOutbound && "flex-row-reverse")}>
                <Avatar className="h-8 w-8 flex-shrink-0 border border-border/70">
                  <AvatarFallback className={avatarFallbackClass}>
                    {isBot ? (
                      <Bot className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <User className="h-4 w-4" aria-hidden="true" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className={cn("flex min-w-0 items-end gap-1", isOutbound && "flex-row-reverse")}>
                  <div className={bubbleClass}>
                    {message.quotedMessage && (
                      <MessageQuoteBlock
                        quote={message.quotedMessage}
                        senderLabel={resolveQuoteSenderLabel(
                          message.quotedMessage.senderType,
                          quoteSenderLabels,
                        )}
                        accentClassName={
                          isCustomer ? "border-muted-foreground/50" : "border-agent/60"
                        }
                        labelClassName={isCustomer ? "text-muted-foreground" : "text-agent"}
                      />
                    )}
                    <p>{message.content}</p>
                    <div className={metaClass}>
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      <span>{message.sentAtLabel}</span>
                      {shouldShowStatus && message.status === "delivered" && (
                        <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      {shouldShowStatus && message.status === "read" && (
                        <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      {isBotPending && <span className="italic">{t("messages.botPending")}</span>}
                      {isBotFailed && (
                        <span className="flex items-center gap-1 text-destructive">
                          <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                          {t("messages.botFailed")}
                        </span>
                      )}
                    </div>
                  </div>
                  {!isSystem && selectedConversationId && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
                      onClick={() => onReplyToMessage(message)}
                      title={t("messages.reply")}
                      aria-label={t("messages.reply")}
                    >
                      <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div ref={messagesEndRef} />
    </div>
  )
}
