"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { listTicketActivitiesAction } from "@/components/server-actions/tickets"
import { ticketSessionCache } from "@/lib/tickets/ticket-session-cache"
import type { TicketActivity, TicketActivityAction } from "@/lib/types/ticket"

type TicketActivityPanelProps = {
  ticketId: string
  ticketUpdatedAt?: string
  isActive: boolean
  variant?: "default" | "embedded"
}

const formatDateTime = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

const labelForValue = (
  t: (key: string) => string,
  field: string | undefined,
  value: string | undefined,
) => {
  if (!value) return t("values.empty")

  if (field === "status") {
    try {
      return t(`values.status.${value}`)
    } catch {
      return value
    }
  }

  if (field === "priority") {
    try {
      return t(`values.priority.${value}`)
    } catch {
      return value
    }
  }

  if (field === "type") {
    try {
      return t(`values.type.${value}`)
    } catch {
      return value
    }
  }

  return value
}

export const TicketActivityPanel = ({
  ticketId,
  ticketUpdatedAt,
  isActive,
  variant = "default",
}: TicketActivityPanelProps) => {
  const t = useTranslations("Tickets.activity")
  const detailCache = ticketSessionCache.detailCache
  const cachedActivities = detailCache.getActivities(ticketId)
  const [activities, setActivities] = useState<TicketActivity[]>(cachedActivities ?? [])
  const [isLoading, setIsLoading] = useState(
    isActive && !detailCache.isFresh(ticketId, ticketUpdatedAt),
  )
  const isEmbedded = variant === "embedded"

  const loadActivities = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!options?.silent) {
        setIsLoading(true)
      }

      try {
        const result = await listTicketActivitiesAction({ ticketId })
        if (!result.success || !result.data) {
          throw new Error(result.error || "Unable to load activity")
        }

        setActivities(result.data.activities)
        detailCache.setActivities(ticketId, result.data.activities, ticketUpdatedAt)
      } catch (error) {
        console.error("Failed to load ticket activities", error)
        toast.error(t("loadFailed"))
      } finally {
        if (!options?.silent) {
          setIsLoading(false)
        }
      }
    },
    [detailCache, t, ticketId, ticketUpdatedAt],
  )

  useEffect(() => {
    if (!isActive) return

    const cached = detailCache.getActivities(ticketId)

    if (detailCache.isFresh(ticketId, ticketUpdatedAt)) {
      if (cached) {
        setActivities(cached)
      }
      setIsLoading(false)
      return
    }

    if (cached) {
      setActivities(cached)
      void loadActivities({ silent: true })
      return
    }

    void loadActivities()
  }, [detailCache, isActive, loadActivities, ticketId, ticketUpdatedAt])

  const activityMessages = useMemo(() => {
    const describe = (activity: TicketActivity) => {
      const actor = activity.actorName || t("unknownActor")
      const previous = labelForValue(t, activity.field, activity.previousValue)
      const next = labelForValue(t, activity.field, activity.newValue)

      const messages: Record<TicketActivityAction, string> = {
        created: t("actions.created", { actor, ticket: next }),
        status_changed: t("actions.status_changed", { actor, previous, next }),
        priority_changed: t("actions.priority_changed", { actor, previous, next }),
        type_changed: t("actions.type_changed", { actor, previous, next }),
        title_changed: t("actions.title_changed", { actor }),
        description_changed: t("actions.description_changed", { actor }),
        customer_changed: t("actions.customer_changed", { actor, previous, next }),
        order_reference_changed: t("actions.order_reference_changed", { actor, previous, next }),
        assigned: t("actions.assigned", { actor, next }),
        unassigned: t("actions.unassigned", { actor, previous }),
        comment_added: t("actions.comment_added", { actor }),
      }

      return messages[activity.action]
    }

    return activities.map((activity) => ({
      id: activity.id,
      message: describe(activity),
      createdAt: activity.createdAt,
    }))
  }, [activities, t])

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        {t("loading")}
      </div>
    )
  }

  if (activityMessages.length === 0) {
    return (
      <p className="rounded-md border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
        {t("empty")}
      </p>
    )
  }

  return (
    <div
      className={cn(
        "space-y-3 overflow-y-auto",
        isEmbedded ? "min-h-0 flex-1" : "max-h-80",
      )}
    >
      {activityMessages.map((activity) => (
        <div key={activity.id} className="flex gap-3 rounded-md border px-3 py-2">
          <div className="mt-1 size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-sm">{activity.message}</p>
            <time className="text-xs text-muted-foreground" dateTime={activity.createdAt}>
              {formatDateTime(activity.createdAt)}
            </time>
          </div>
        </div>
      ))}
    </div>
  )
}
