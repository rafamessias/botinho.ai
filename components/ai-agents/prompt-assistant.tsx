"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { BookOpen, ChevronRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { PROMPT_TEMPLATE_IDS } from "./prompt-template-ids"

const GUIDE_SECTION_IDS = ["role", "tone", "rules", "escalation", "tickets", "examples"] as const

type PromptAssistantProps = {
  ticketsEnabled?: boolean
  onApplyPrompt: (content: string, options?: { append?: boolean }) => void
  className?: string
}

export const PromptAssistant = ({
  ticketsEnabled = true,
  onApplyPrompt,
  className,
}: PromptAssistantProps) => {
  const tGuide = useTranslations("AiAgents.promptGuide")
  const tTemplates = useTranslations("AiAgents.promptTemplates")
  const [dialogOpen, setDialogOpen] = useState(false)

  const visibleSections = GUIDE_SECTION_IDS.filter(
    (id) => id !== "tickets" || ticketsEnabled,
  )

  const getTemplateContent = (id: (typeof PROMPT_TEMPLATE_IDS)[number]) =>
    ticketsEnabled
      ? tTemplates(`items.${id}.contentWithTickets`)
      : tTemplates(`items.${id}.content`)

  const handleInsertSkeleton = () => {
    const skeleton = ticketsEnabled ? tGuide("skeletonWithTickets") : tGuide("skeleton")
    onApplyPrompt(skeleton, { append: true })
  }

  return (
    <>
      <div className={cn("rounded-lg border border-border bg-muted/40", className)}>
        <div className="flex flex-wrap items-center gap-2 px-3 py-2">
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/60"
          >
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            {tGuide("title")}
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          </button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="ml-auto h-7"
            onClick={handleInsertSkeleton}
          >
            {tGuide("insertSkeleton")}
          </Button>
        </div>

        <div className="border-t border-dashed px-3 py-2">
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            {tTemplates("title")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {PROMPT_TEMPLATE_IDS.map((id) => (
              <Button
                key={id}
                type="button"
                variant="secondary"
                size="sm"
                className="h-7"
                title={tTemplates(`items.${id}.hint`)}
                onClick={() => onApplyPrompt(getTemplateContent(id))}
              >
                {tTemplates(`items.${id}.label`)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="flex max-h-[85vh] max-w-2xl flex-col gap-0 overflow-hidden p-0">
          <DialogHeader className="space-y-2 border-b px-6 py-4">
            <DialogTitle className="flex items-center gap-2 text-left">
              <BookOpen className="h-5 w-5 text-primary" />
              {tGuide("title")}
            </DialogTitle>
            <DialogDescription className="text-left">{tGuide("intro")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 overflow-y-auto px-6 py-4">
            {visibleSections.map((sectionId) => (
              <div key={sectionId} className="rounded-md border bg-muted/20 p-3">
                <h4 className="text-sm font-medium">{tGuide(`sections.${sectionId}.title`)}</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {tGuide(`sections.${sectionId}.description`)}
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {tGuide.raw(`sections.${sectionId}.tips`).map((tip: string) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
