"use client"

import * as React from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type HeroInboxDemoProps = {
  logoAlt: string
  title: string
  customerName: string
  customerQuestion: string
  aiReply: string
  customerConfirmation: string
  followUpsTitle: string
  followUpsDescription: string
  followUpsAria: string
}

type MessageStep = {
  id: string
  sender: "customer" | "ai"
  name?: string
  text: string
}

const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-1 py-0.5" aria-hidden>
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
  logoAlt,
  title,
  customerName,
  customerQuestion,
  aiReply,
  customerConfirmation,
  followUpsTitle,
  followUpsDescription,
  followUpsAria,
}: HeroInboxDemoProps) => {
  const messages: MessageStep[] = React.useMemo(
    () => [
      { id: "q1", sender: "customer", name: customerName, text: customerQuestion },
      { id: "a1", sender: "ai", text: aiReply },
      { id: "q2", sender: "customer", name: customerName, text: customerConfirmation },
    ],
    [aiReply, customerConfirmation, customerName, customerQuestion],
  )

  const [visibleCount, setVisibleCount] = React.useState(0)
  const [isTyping, setIsTyping] = React.useState(false)
  const [showFollowUp, setShowFollowUp] = React.useState(false)

  React.useEffect(() => {
    if (visibleCount >= messages.length) {
      const followUpTimer = window.setTimeout(() => setShowFollowUp(true), 600)
      const resetTimer = window.setTimeout(() => {
        setShowFollowUp(false)
        setVisibleCount(0)
        setIsTyping(false)
      }, 4000)

      return () => {
        window.clearTimeout(followUpTimer)
        window.clearTimeout(resetTimer)
      }
    }

    const nextMessage = messages[visibleCount]
    const isAiNext = nextMessage?.sender === "ai"

    if (isAiNext) {
      setIsTyping(true)
      const typingTimer = window.setTimeout(() => {
        setIsTyping(false)
        setVisibleCount((count) => count + 1)
      }, 1200)

      return () => window.clearTimeout(typingTimer)
    }

    const revealTimer = window.setTimeout(() => {
      setVisibleCount((count) => count + 1)
    }, visibleCount === 0 ? 400 : 900)

    return () => window.clearTimeout(revealTimer)
  }, [messages, visibleCount])

  const visibleMessages = messages.slice(0, visibleCount)

  return (
    <Card className="flex-1 rounded-3xl border border-primary/10 bg-background/80 p-0 shadow-xl">
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-3">
          <Image src="/bot-green.svg" alt={logoAlt} width={36} height={36} className="size-9" />
          <span className="text-lg font-semibold tracking-tight">{title}</span>
        </div>

        <div
          className="min-h-[220px] space-y-4 rounded-2xl bg-muted/60 p-4"
          aria-live="polite"
          aria-label={title}
        >
          {visibleMessages.map((message) =>
            message.sender === "customer" ? (
              <div
                key={message.id}
                className="flex animate-in fade-in slide-in-from-bottom-2 items-start gap-3 duration-300"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                  JA
                </span>
                <div className="max-w-[250px] flex-1 rounded-2xl bg-background/80 p-3 shadow-sm">
                  <p className="text-sm font-semibold">{message.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/80">{message.text}</p>
                </div>
              </div>
            ) : (
              <div
                key={message.id}
                className="flex animate-in fade-in slide-in-from-bottom-2 items-start justify-end gap-3 duration-300"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  AI
                </span>
                <div className="max-w-[250px] flex-1 rounded-2xl bg-primary/10 p-3 shadow-sm">
                  <p className="text-sm leading-relaxed text-primary">{message.text}</p>
                </div>
              </div>
            ),
          )}

          {isTyping ? (
            <div className="flex animate-in fade-in items-start justify-end gap-3 duration-200">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                AI
              </span>
              <div className="rounded-2xl bg-primary/10 px-4 py-3 shadow-sm">
                <TypingIndicator />
              </div>
            </div>
          ) : null}
        </div>

        <div
          className={cn(
            "flex items-center justify-between rounded-2xl bg-card px-4 py-3 shadow-sm transition-all duration-500",
            showFollowUp ? "animate-in fade-in slide-in-from-bottom-2 opacity-100" : "opacity-40",
          )}
        >
          <div>
            <p className="text-sm font-semibold">{followUpsTitle}</p>
            <p className="text-xs leading-relaxed text-muted-foreground">{followUpsDescription}</p>
          </div>
          <Button size="icon" variant="ghost" className="rounded-full" aria-label={followUpsAria}>
            <ArrowRight className="size-5" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
