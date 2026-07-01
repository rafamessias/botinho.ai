"use client"

import dynamic from "next/dynamic"
import { useSyncExternalStore } from "react"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { HeroStaticPreview } from "./hero-static-preview"

const HeroInboxDemo = dynamic(
  () => import("./hero-inbox-demo").then((mod) => mod.HeroInboxDemo),
  {
    ssr: false,
    loading: () => <HeroDemoSkeleton />,
  },
)

type InboxConversation = {
  id: string
  name: string
  preview: string
  botReply?: string
  time: string
  unread?: number
}

export type HeroVisualProps = {
  conversationsTitle: string
  customerName: string
  customerPhone: string
  customerQuestion: string
  aiReply: string
  customerConfirmation: string
  reservationConfirmation: string
  reservationCode: string
  reservationLinkLabel: string
  conversations: InboxConversation[]
}

const subscribe = (onStoreChange: () => void) => {
  const media = window.matchMedia("(min-width: 1024px)")
  media.addEventListener("change", onStoreChange)
  return () => media.removeEventListener("change", onStoreChange)
}

const getDesktopSnapshot = () => window.matchMedia("(min-width: 1024px)").matches

const getServerSnapshot = () => false

const HeroDemoSkeleton = () => (
  <Card className="flex-1 overflow-hidden rounded-3xl border border-border bg-card p-0 shadow-md">
    <div className="h-[400px] animate-pulse bg-muted/40" />
  </Card>
)

export const HeroVisual = (props: HeroVisualProps) => {
  const isDesktop = useSyncExternalStore(subscribe, getDesktopSnapshot, getServerSnapshot)
  const prefersReducedMotion = useSyncExternalStore(
    (onStoreChange) => {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)")
      media.addEventListener("change", onStoreChange)
      return () => media.removeEventListener("change", onStoreChange)
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  )

  if (!isDesktop || prefersReducedMotion) {
    return (
      <HeroStaticPreview
        customerName={props.customerName}
        customerQuestion={props.customerQuestion}
        aiReply={props.aiReply}
        reservationConfirmation={props.reservationConfirmation}
        reservationCode={props.reservationCode}
      />
    )
  }

  return (
    <div className={cn("flex-1")}>
      <HeroInboxDemo {...props} />
    </div>
  )
}
