"use client"

import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AiTemplateCategory } from "@/lib/types/enums"
import { MESSAGE_TEMPLATE_IDS } from "./message-template-ids"
import type { TranslationFn } from "./types"

type MessageTemplatePickerProps = {
  t: TranslationFn
  onSelect: (example: { name: string; content: string; category: AiTemplateCategory }) => void
  className?: string
}

export const MessageTemplatePicker = ({ t, onSelect, className }: MessageTemplatePickerProps) => (
  <div className={className}>
    <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
      <Sparkles className="h-3.5 w-3.5" />
      {t("messageExamples.title")}
    </p>
    <div className="flex flex-wrap gap-2">
      {MESSAGE_TEMPLATE_IDS.map((id) => (
        <Button
          key={id}
          type="button"
          variant="outline"
          size="sm"
          className="h-auto whitespace-normal px-3 py-1.5 text-left text-xs"
          onClick={() =>
            onSelect({
              name: t(`messageExamples.items.${id}.name`),
              content: t(`messageExamples.items.${id}.content`),
              category: t(`messageExamples.items.${id}.category`) as AiTemplateCategory,
            })
          }
        >
          {t(`messageExamples.items.${id}.label`)}
        </Button>
      ))}
    </div>
  </div>
)
