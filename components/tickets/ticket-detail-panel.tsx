"use client"

import { useEffect, useImperativeHandle, forwardRef, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { ArrowLeft, Loader2, TicketIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TicketActivityPanel } from "@/components/tickets/ticket-activity-panel"
import {
  TicketRecordForm,
  type TicketRecordFormHandle,
} from "@/components/tickets/ticket-record-form"
import { TicketJournalPanel, type TicketJournalPanelHandle } from "@/components/tickets/ticket-journal-panel"
import type { TicketFormValues } from "@/components/tickets/ticket-form-schema"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  formatModShortcut,
  isModKey,
  isTicketJournalComposer,
  isTypingField,
} from "@/lib/keyboard-shortcuts"
import type { Ticket } from "@/lib/types/ticket"

export type TicketDetailPanelHandle = {
  isDirty: () => boolean
}

type TicketDetailPanelProps = {
  ticket: Ticket | null
  isSubmitting?: boolean
  onSubmit: (values: TicketFormValues) => Promise<void> | void
  onBack?: () => void
}

export const TicketDetailPanel = forwardRef<TicketDetailPanelHandle, TicketDetailPanelProps>(
  ({ ticket, isSubmitting = false, onSubmit, onBack }, ref) => {
    const t = useTranslations("Tickets")
    const isMobile = useIsMobile()
    const recordFormRef = useRef<TicketRecordFormHandle>(null)
    const journalRef = useRef<TicketJournalPanelHandle>(null)
    const [desktopWorkspaceTab, setDesktopWorkspaceTab] = useState<"journal" | "activity">("journal")
    const [mobileWorkspaceTab, setMobileWorkspaceTab] = useState<"journal" | "details" | "activity">(
      "journal",
    )

    const saveShortcut = formatModShortcut("S")

    const activeTicketId = ticket?.id ?? null
    const isJournalWorkspaceActive = isMobile
      ? mobileWorkspaceTab === "journal"
      : desktopWorkspaceTab === "journal"

    useEffect(() => {
      setDesktopWorkspaceTab("journal")
      setMobileWorkspaceTab("journal")
    }, [activeTicketId])

    useEffect(() => {
      if (!ticket) {
        return
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (!isModKey(event)) {
          return
        }

        const key = event.key.toLowerCase()

        if (key === "s") {
          event.preventDefault()
          if (!isSubmitting) {
            recordFormRef.current?.submit()
          }
          return
        }

        if (key !== "enter" || !isJournalWorkspaceActive) {
          return
        }

        if (isTicketJournalComposer(event.target)) {
          return
        }

        if (event.target instanceof HTMLTextAreaElement && !isTicketJournalComposer(event.target)) {
          return
        }

        if (isTypingField(event.target) && !(event.target instanceof HTMLInputElement)) {
          return
        }

        event.preventDefault()
        journalRef.current?.submit()
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isJournalWorkspaceActive, isSubmitting, ticket])

    useImperativeHandle(
      ref,
      () => ({
        isDirty: () => recordFormRef.current?.isDirty() ?? false,
      }),
      [],
    )

    if (!ticket) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
          <TicketIcon className="size-10 text-muted-foreground/50" aria-hidden="true" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">{t("list.selectTicket")}</p>
            <p className="text-xs text-muted-foreground">{t("list.empty")}</p>
          </div>
        </div>
      )
    }

    const metadataFields = (
      <TicketRecordForm
        key={ticket.id}
        ref={recordFormRef}
        ticket={ticket}
        isSubmitting={isSubmitting}
        showStatus
        isActive
        compact={!isMobile}
        onSubmit={onSubmit}
      />
    )

    return (
      <div className="flex h-full min-h-0 flex-col">
        <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border/60 px-3 py-3 md:h-14 md:gap-3 md:px-4 md:py-0">
          <div className="flex min-w-0 flex-1 items-start gap-2">
            {onBack && isMobile && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="mt-0.5 shrink-0"
                title={t("actions.backToList")}
                aria-label={t("actions.backToList")}
              >
                <ArrowLeft className="size-5" aria-hidden="true" />
              </Button>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  {ticket.ticketNumber}
                </span>
                <h3 className="text-sm font-semibold text-foreground">{ticket.title}</h3>
              </div>
              {ticket.customerName && (
                <p className="truncate text-xs text-muted-foreground">{ticket.customerName}</p>
              )}
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            disabled={isSubmitting}
            className="shrink-0"
            title={t("form.buttons.updateWithShortcut", { shortcut: saveShortcut })}
            onClick={() => recordFormRef.current?.submit()}
          >
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />}
            <span className="hidden sm:inline">
              {t("form.buttons.updateWithShortcut", { shortcut: saveShortcut })}
            </span>
            <span className="sm:hidden">{t("form.buttons.updateShort")}</span>
          </Button>
        </header>

        {isMobile ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <Tabs
              value={mobileWorkspaceTab}
              onValueChange={(value) =>
                setMobileWorkspaceTab(value as "journal" | "details" | "activity")
              }
              className="flex min-h-0 flex-1 flex-col gap-0"
            >
              <TabsList className="mx-3 mt-2 mb-2 grid h-9 w-auto shrink-0 grid-cols-3">
                <TabsTrigger value="journal" className="text-xs">
                  {t("tabs.journal")}
                </TabsTrigger>
                <TabsTrigger value="details" className="text-xs">
                  {t("tabs.details")}
                </TabsTrigger>
                <TabsTrigger value="activity" className="text-xs">
                  {t("tabs.activity")}
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="journal"
                className="mt-0 min-h-0 flex-1 overflow-hidden data-[state=inactive]:hidden"
              >
                <TicketJournalPanel
                  ref={journalRef}
                  key={ticket.id}
                  ticketId={ticket.id}
                  ticketUpdatedAt={ticket.updatedAt}
                  isActive={mobileWorkspaceTab === "journal"}
                  variant="embedded"
                />
              </TabsContent>

              <TabsContent
                value="details"
                className="mt-0 min-h-0 flex-1 overflow-y-auto p-4 data-[state=inactive]:hidden"
              >
                <div className="space-y-4">{metadataFields}</div>
              </TabsContent>

              <TabsContent
                value="activity"
                className="mt-0 min-h-0 flex-1 overflow-y-auto p-4 data-[state=inactive]:hidden"
              >
                <TicketActivityPanel
                  key={ticket.id}
                  ticketId={ticket.id}
                  ticketUpdatedAt={ticket.updatedAt}
                  isActive
                />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-row overflow-hidden">
            <section className="flex min-h-0 min-w-0 flex-1 flex-col border-r border-border/60">
              <Tabs
                value={desktopWorkspaceTab}
                onValueChange={(value) => setDesktopWorkspaceTab(value as "journal" | "activity")}
                className="flex min-h-0 flex-1 flex-col gap-0"
              >
                <div className="shrink-0 border-b border-border/60 px-4 py-2">
                  <TabsList className="grid h-9 w-full max-w-xs grid-cols-2">
                    <TabsTrigger value="journal" className="text-xs">
                      {t("tabs.journal")}
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="text-xs">
                      {t("tabs.activity")}
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent
                  value="journal"
                  className="mt-0 min-h-0 flex-1 overflow-hidden data-[state=inactive]:hidden"
                >
                    <TicketJournalPanel
                      ref={journalRef}
                      key={`desktop-journal-${ticket.id}`}
                      ticketId={ticket.id}
                      ticketUpdatedAt={ticket.updatedAt}
                      isActive={desktopWorkspaceTab === "journal"}
                      variant="embedded"
                    />
                </TabsContent>

                <TabsContent
                  value="activity"
                  className="mt-0 min-h-0 flex-1 overflow-y-auto p-4 data-[state=inactive]:hidden"
                >
                    <TicketActivityPanel
                      key={`desktop-activity-${ticket.id}`}
                      ticketId={ticket.id}
                      ticketUpdatedAt={ticket.updatedAt}
                      isActive={desktopWorkspaceTab === "activity"}
                    />
                </TabsContent>
              </Tabs>
            </section>

            <section className="flex min-h-0 w-[40%] max-w-md shrink-0 flex-col overflow-hidden">
              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("detail.metadataTitle")}
                </h4>
                <div className="space-y-4">{metadataFields}</div>
              </div>
            </section>
          </div>
        )}
      </div>
    )
  },
)

TicketDetailPanel.displayName = "TicketDetailPanel"
