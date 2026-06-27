"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

type ReplyPreviewHoverCardProps = {
    preview: React.ReactNode
    children: React.ReactNode
}

export const ReplyPreviewHoverCard = ({ preview, children }: ReplyPreviewHoverCardProps) => (
    <HoverCard openDelay={250} closeDelay={100}>
        <HoverCardTrigger asChild>{children}</HoverCardTrigger>
        <HoverCardContent
            side="left"
            align="start"
            className="max-w-[280px] p-3 text-[11px] leading-snug shadow-md"
        >
            {preview}
        </HoverCardContent>
    </HoverCard>
)
