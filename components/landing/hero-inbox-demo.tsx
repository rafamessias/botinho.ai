"use client"

import * as React from "react"
import { Bot, CheckCheck, Clock, User } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type MockConversation = {
  id: string
  name: string
  preview: string
  botReply?: string
  time: string
  unread?: number
}

type SidebarConversationState = {
  preview: string
  isTyping: boolean
  handledByBot: boolean
  unread?: number
}

type HeroInboxDemoProps = {
  conversationsTitle: string
  customerName: string
  customerPhone: string
  customerQuestion: string
  aiReply: string
  customerConfirmation: string
  reservationConfirmation: string
  reservationCode: string
  reservationLinkLabel: string
  conversations: MockConversation[]
}

type MessageStep = {
  id: string
  sender: "customer" | "bot"
  text: string
  reservationCode?: string
  linkLabel?: string
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-0.5 py-0.5" aria-hidden>
    {[0, 150, 300].map((delay) => (
      <span
        key={delay}
        className="size-1.5 animate-bounce rounded-full bg-primary/60"
        style={{ animationDelay: `${delay}ms` }}
      />
    ))}
  </div>
)

export const HeroInboxDemo = ({
  conversationsTitle,
  customerName,
  customerPhone,
  customerQuestion,
  aiReply,
  customerConfirmation,
  reservationConfirmation,
  reservationCode,
  reservationLinkLabel,
  conversations,
}: HeroInboxDemoProps) => {
  const activeConversationId = conversations[0]?.id ?? "active"

  const messages: MessageStep[] = React.useMemo(
    () => [
      { id: "q1", sender: "customer", text: customerQuestion },
      { id: "a1", sender: "bot", text: aiReply },
      { id: "q2", sender: "customer", text: customerConfirmation },
      {
        id: "a2",
        sender: "bot",
        text: reservationConfirmation,
        reservationCode,
        linkLabel: reservationLinkLabel,
      },
    ],
    [
      aiReply,
      customerConfirmation,
      customerQuestion,
      reservationCode,
      reservationConfirmation,
      reservationLinkLabel,
    ],
  )

  const [visibleCount, setVisibleCount] = React.useState(0)
  const [isTyping, setIsTyping] = React.useState(false)
  const [animationCycle, setAnimationCycle] = React.useState(0)

  const buildInitialSidebarState = React.useCallback(
    () =>
      Object.fromEntries(
        conversations.map((conversation) => [
          conversation.id,
          {
            preview: conversation.preview,
            isTyping: false,
            handledByBot: false,
            unread: conversation.unread,
          },
        ]),
      ) satisfies Record<string, SidebarConversationState>,
    [conversations],
  )

  const [sidebarStates, setSidebarStates] = React.useState<Record<string, SidebarConversationState>>(
    buildInitialSidebarState,
  )

  const activePreview = React.useMemo(() => {
    if (isTyping && messages[visibleCount]?.sender === "bot") {
      return null
    }

    const lastRevealedIndex = visibleCount - 1
    if (lastRevealedIndex < 0) {
      return conversations[0]?.preview ?? ""
    }

    return messages[lastRevealedIndex]?.text ?? conversations[0]?.preview ?? ""
  }, [conversations, isTyping, messages, visibleCount])

  React.useEffect(() => {
    setSidebarStates(buildInitialSidebarState())

    const timers = conversations.flatMap((conversation, index) => {
      if (!conversation.botReply) {
        return []
      }

      const typingDelay = 1800 + index * 2200
      const replyDelay = typingDelay + 1100

      return [
        window.setTimeout(() => {
          setSidebarStates((current) => ({
            ...current,
            [conversation.id]: {
              ...current[conversation.id],
              isTyping: true,
            },
          }))
        }, typingDelay),
        window.setTimeout(() => {
          setSidebarStates((current) => ({
            ...current,
            [conversation.id]: {
              preview: conversation.botReply ?? conversation.preview,
              isTyping: false,
              handledByBot: true,
              unread: undefined,
            },
          }))
        }, replyDelay),
      ]
    })

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [animationCycle, buildInitialSidebarState, conversations])

  React.useEffect(() => {
    if (visibleCount >= messages.length) {
      const resetTimer = window.setTimeout(() => {
        setVisibleCount(0)
        setIsTyping(false)
        setAnimationCycle((cycle) => cycle + 1)
      }, 4500)

      return () => window.clearTimeout(resetTimer)
    }

    const nextMessage = messages[visibleCount]
    const isBotNext = nextMessage?.sender === "bot"

    if (isBotNext) {
      setIsTyping(true)
      const typingTimer = window.setTimeout(() => {
        setIsTyping(false)
        setVisibleCount((count) => count + 1)
      }, 1100)

      return () => window.clearTimeout(typingTimer)
    }

    const revealTimer = window.setTimeout(() => {
      setVisibleCount((count) => count + 1)
    }, visibleCount === 0 ? 500 : 800)

    return () => window.clearTimeout(revealTimer)
  }, [messages, visibleCount])

  const renderCustomerBubble = (text: string) => (
    <div className="max-w-[85%] rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] leading-snug text-foreground sm:max-w-[75%]">
      <p>{text}</p>
      <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
        <Clock className="size-2.5" aria-hidden />
        <span>12:04</span>
      </div>
    </div>
  )

  const renderBotBubble = (
    text: string,
    options?: { showStatus?: boolean; reservationCode?: string; linkLabel?: string },
  ) => (
    <div className="max-w-[85%] rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1.5 text-[11px] leading-snug text-foreground sm:max-w-[75%]">
      <p>{text}</p>
      {options?.reservationCode ? (
        <p className="mt-1.5 font-mono text-[10px] font-semibold tracking-wide text-primary">
          {options.reservationCode}
        </p>
      ) : null}
      {options?.linkLabel ? (
        <span className="mt-1 inline-block text-[10px] font-medium text-primary underline underline-offset-2">
          {options.linkLabel}
        </span>
      ) : null}
      <div className="mt-1 flex items-center gap-1 text-[10px] text-primary/60">
        <Clock className="size-2.5" aria-hidden />
        <span>12:05</span>
        {options?.showStatus !== false ? <CheckCheck className="size-3" aria-hidden /> : null}
      </div>
    </div>
  )

  const renderTypingBubble = () => (
    <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
      <TypingIndicator />
    </div>
  )

  const renderSidebarTyping = () => (
    <span className="flex items-center gap-0.5 py-0.5" aria-hidden>
      {[0, 120, 240].map((delay) => (
        <span
          key={delay}
          className="size-1 animate-bounce rounded-full bg-muted-foreground/70"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  )

  return (
    <Card className="flex-1 overflow-hidden rounded-3xl border border-primary/10 bg-background/80 p-0 shadow-xl">
      <div className="flex h-[400px]">
        <aside className="flex w-[38%] min-w-[148px] max-w-[200px] shrink-0 flex-col border-r border-border/60 bg-background">
          <header className="flex h-11 shrink-0 items-center border-b border-border/60 px-3">
            <h2 className="truncate text-xs font-semibold text-foreground">{conversationsTitle}</h2>
          </header>

          <div className="min-h-0 flex-1 overflow-hidden">
            {conversations.map((conversation) => {
              const isActive = conversation.id === activeConversationId
              const sidebarState = sidebarStates[conversation.id]
              const preview = isActive
                ? activePreview
                : sidebarState?.preview ?? conversation.preview
              const isSidebarTyping = isActive
                ? isTyping && messages[visibleCount]?.sender === "bot"
                : sidebarState?.isTyping
              const handledByBot = isActive
                ? isSidebarTyping ||
                  messages.slice(0, visibleCount).some((message) => message.sender === "bot")
                : sidebarState?.handledByBot
              const unread = isActive ? (visibleCount === 0 ? conversation.unread : undefined) : sidebarState?.unread

              return (
                <div
                  key={conversation.id}
                  className={cn(
                    "flex items-center gap-2 border-b border-border/40 px-2.5 py-2 transition-colors duration-300",
                    isActive ? "bg-muted/80" : "opacity-80",
                  )}
                  aria-hidden={!isActive}
                >
                  <Avatar className="size-9 shrink-0 border border-border/50">
                    <AvatarFallback className="bg-muted text-[11px] font-medium text-muted-foreground">
                      {getInitials(conversation.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="flex min-w-0 items-center gap-1 truncate text-xs text-foreground">
                        {handledByBot || isSidebarTyping ? (
                          <Bot className="size-3 shrink-0 text-muted-foreground" aria-hidden />
                        ) : null}
                        <span className="truncate">{conversation.name}</span>
                      </span>
                      <span
                        className={cn(
                          "shrink-0 text-[10px]",
                          isActive || unread ? "font-medium text-primary" : "text-muted-foreground",
                        )}
                      >
                        {conversation.time}
                      </span>
                    </div>
                    <div className="flex min-h-[16px] items-center justify-between gap-1">
                      {isSidebarTyping ? (
                        renderSidebarTyping()
                      ) : (
                        <p
                          className={cn(
                            "truncate text-[11px] transition-colors duration-300",
                            handledByBot && !isActive ? "text-foreground/80" : "text-muted-foreground",
                          )}
                        >
                          {preview}
                        </p>
                      )}
                      {unread ? (
                        <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-medium text-primary-foreground">
                          {unread}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col bg-background">
          <header className="flex h-11 shrink-0 items-center gap-2 border-b border-border/60 px-3">
            <Avatar className="size-7 shrink-0 border border-border/70">
              <AvatarFallback className="bg-muted text-[10px] font-semibold text-muted-foreground">
                {getInitials(customerName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground">{customerName}</p>
              <p className="truncate text-[10px] text-muted-foreground">{customerPhone}</p>
            </div>
          </header>

          <div
            className="min-h-0 flex-1 overflow-hidden bg-secondary px-3 py-3"
            aria-live="polite"
            aria-label={customerName}
          >
            <div className="space-y-2.5">
              {messages.map((message, index) => {
                const isRevealed = index < visibleCount
                const isTypingSlot = isTyping && index === visibleCount && message.sender === "bot"
                const isOutbound = message.sender === "bot"

                if (isTypingSlot) {
                  return (
                    <div key={message.id} className="grid">
                      <div className="invisible col-start-1 row-start-1" aria-hidden>
                        <div className="flex items-end justify-end gap-1.5">
                          <Avatar className="size-6 border border-border/70">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              <Bot className="size-3" aria-hidden />
                            </AvatarFallback>
                          </Avatar>
                          {renderBotBubble(message.text, {
                            showStatus: false,
                            reservationCode: message.reservationCode,
                            linkLabel: message.linkLabel,
                          })}
                        </div>
                      </div>
                      <div className="col-start-1 row-start-1 flex animate-in fade-in items-end justify-end gap-1.5 duration-200">
                        <Avatar className="size-6 border border-border/70">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            <Bot className="size-3" aria-hidden />
                          </AvatarFallback>
                        </Avatar>
                        {renderTypingBubble()}
                      </div>
                    </div>
                  )
                }

                const row = (
                  <div className={cn("flex items-end gap-1.5", isOutbound && "flex-row-reverse")}>
                    <Avatar className="size-6 shrink-0 border border-border/70">
                      <AvatarFallback
                        className={cn(
                          "text-[10px] font-semibold",
                          isOutbound ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                        )}
                      >
                        {isOutbound ? <Bot className="size-3" aria-hidden /> : <User className="size-3" aria-hidden />}
                      </AvatarFallback>
                    </Avatar>
                    {message.sender === "customer"
                      ? renderCustomerBubble(message.text)
                      : renderBotBubble(message.text, {
                          reservationCode: message.reservationCode,
                          linkLabel: message.linkLabel,
                        })}
                  </div>
                )

                if (!isRevealed) {
                  return (
                    <div key={message.id} className="invisible" aria-hidden>
                      {row}
                    </div>
                  )
                }

                return (
                  <div key={message.id} className="animate-in fade-in slide-in-from-bottom-1 duration-300">
                    {row}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </Card>
  )
}
