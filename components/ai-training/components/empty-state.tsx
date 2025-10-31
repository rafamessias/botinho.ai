"use client"

import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

type EmptyStateProps = {
    icon: LucideIcon
    title: string
    description: string
    actionLabel?: string
    onAction?: () => void
}

export const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
        <Icon aria-hidden="true" className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="heading-secondary mb-2 text-lg">{title}</h3>
        <p className="body-secondary mb-4 max-w-sm text-muted-foreground">{description}</p>
        {onAction && actionLabel ? (
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={onAction}>
                {actionLabel}
            </Button>
        ) : null}
    </div>
)


