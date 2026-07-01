"use client"

import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  addTicketCommentAction,
  listTicketCommentsAction,
} from "@/components/server-actions/tickets"
import { ticketSessionCache } from "@/lib/tickets/ticket-session-cache"
import { formatModShortcut } from "@/lib/keyboard-shortcuts"
import type { TicketComment } from "@/lib/types/ticket"

type TicketJournalPanelProps = {
  ticketId: string
  ticketUpdatedAt?: string
  isActive: boolean
  variant?: "default" | "embedded"
}

export type TicketJournalPanelHandle = {
  submit: () => void
  focusComposer: () => void
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

export const TicketJournalPanel = forwardRef<TicketJournalPanelHandle, TicketJournalPanelProps>(
  ({ ticketId, ticketUpdatedAt, isActive, variant = "default" }, ref) => {
  const t = useTranslations("Tickets.journal")
  const detailCache = ticketSessionCache.detailCache
  const cachedComments = detailCache.getComments(ticketId)
  const [comments, setComments] = useState<TicketComment[]>(cachedComments ?? [])
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(
    isActive && !detailCache.isFresh(ticketId, ticketUpdatedAt),
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEmbedded = variant === "embedded"

  const handleAddComment = useCallback(async () => {
    const trimmed = content.trim()
    if (!trimmed || isSubmitting) return

    setIsSubmitting(true)
    try {
      const result = await addTicketCommentAction({ ticketId, content: trimmed })
      if (!result.success || !result.data) {
        throw new Error(result.error || "Unable to add journal entry")
      }

      setComments((previous) => [...previous, result.data!.comment])
      detailCache.appendComment(ticketId, result.data!.comment)
      setContent("")
      toast.success(t("added"))
    } catch (error) {
      console.error("Failed to add ticket comment", error)
      toast.error(t("addFailed"))
    } finally {
      setIsSubmitting(false)
    }
  }, [content, detailCache, isSubmitting, t, ticketId])

  useImperativeHandle(
    ref,
    () => ({
      submit: () => {
        void handleAddComment()
      },
      focusComposer: () => {
        const composer = document.getElementById(`ticket-journal-entry-${ticketId}`)
        composer?.focus()
      },
    }),
    [handleAddComment, ticketId],
  )

  const loadComments = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!options?.silent) {
        setIsLoading(true)
      }

      try {
        const result = await listTicketCommentsAction({ ticketId })
        if (!result.success || !result.data) {
          throw new Error(result.error || "Unable to load journal entries")
        }

        setComments(result.data.comments)
        detailCache.setComments(ticketId, result.data.comments, ticketUpdatedAt)
      } catch (error) {
        console.error("Failed to load ticket comments", error)
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

    const cached = detailCache.getComments(ticketId)

    if (detailCache.isFresh(ticketId, ticketUpdatedAt)) {
      if (cached) {
        setComments(cached)
      }
      setIsLoading(false)
      return
    }

    if (cached) {
      setComments(cached)
      void loadComments({ silent: true })
      return
    }

    void loadComments()
  }, [detailCache, isActive, loadComments, ticketId, ticketUpdatedAt])

  useEffect(() => {
    setContent("")
  }, [ticketId])

  const composer = (
    <div className="space-y-2">
      <label htmlFor={`ticket-journal-entry-${ticketId}`} className="text-sm font-medium">
        {t("addLabel")}
      </label>
      <Textarea
        id={`ticket-journal-entry-${ticketId}`}
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder={t("placeholder")}
        rows={isEmbedded ? 3 : 4}
        disabled={isSubmitting}
        onKeyDown={(event) => {
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
            event.preventDefault()
            void handleAddComment()
          }
        }}
      />
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {t("shortcutHint", { shortcut: formatModShortcut("Enter") })}
        </p>
        <Button
          type="button"
          onClick={() => void handleAddComment()}
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />}
          {t("addButton")}
        </Button>
      </div>
    </div>
  )

  const history = (
    <div className={cn("space-y-2", isEmbedded && "min-h-0 flex-1")}>
      <h3 className="text-sm font-medium">{t("historyTitle")}</h3>
      {isLoading ? (
        <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          {t("loading")}
        </div>
      ) : comments.length === 0 ? (
        <p className="rounded-md border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
          {t("empty")}
        </p>
      ) : (
        <div
          className={cn(
            "space-y-3 overflow-y-auto rounded-md border p-3",
            isEmbedded ? "min-h-0 flex-1" : "max-h-64",
          )}
        >
          {comments.map((comment) => (
            <article key={comment.id} className="rounded-md border border-border bg-muted px-3 py-2">
              <div className="mb-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  {comment.authorName || t("unknownAuthor")}
                </span>
                <time dateTime={comment.createdAt}>{formatDateTime(comment.createdAt)}</time>
              </div>
              <p className="whitespace-pre-wrap text-sm">{comment.content}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  )

  if (isEmbedded) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto bg-secondary p-4">{history}</div>
        <div className="shrink-0 border-t border-border/60 bg-background p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {composer}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {composer}
      {history}
    </div>
  )
  },
)

TicketJournalPanel.displayName = "TicketJournalPanel"
