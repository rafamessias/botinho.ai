"use client"

import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { QUICK_ANSWER_EXAMPLE_IDS } from "./quick-answer-ids"
import type { TranslationFn } from "./types"

type QuickAnswerExamplesPickerProps = {
  t: TranslationFn
  onSelect: (content: string) => void
  className?: string
}

export const QuickAnswerExamplesPicker = ({ t, onSelect, className }: QuickAnswerExamplesPickerProps) => (
  <div className={className}>
    <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
      <Sparkles className="h-3.5 w-3.5" />
      {t("quickAnswerExamples.title")}
    </p>
    <div className="flex flex-wrap gap-2">
      {QUICK_ANSWER_EXAMPLE_IDS.map((id) => (
        <Button
          key={id}
          type="button"
          variant="outline"
          size="sm"
          className="h-auto whitespace-normal px-3 py-1.5 text-left text-xs"
          onClick={() => onSelect(t(`quickAnswerExamples.items.${id}.content`))}
        >
          {t(`quickAnswerExamples.items.${id}.label`)}
        </Button>
      ))}
    </div>
  </div>
)
