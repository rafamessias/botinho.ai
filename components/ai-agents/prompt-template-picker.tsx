"use client"

import { useTranslations } from "next-intl"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PROMPT_TEMPLATE_IDS } from "./prompt-template-ids"

type PromptTemplatePickerProps = {
  onSelect: (content: string) => void
  className?: string
}

export const PromptTemplatePicker = ({ onSelect, className }: PromptTemplatePickerProps) => {
  const t = useTranslations("AiAgents.promptTemplates")

  return (
    <div className={className}>
      <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5" />
        {t("title")}
      </p>
      <div className="flex flex-wrap gap-2">
        {PROMPT_TEMPLATE_IDS.map((id) => (
          <Button
            key={id}
            type="button"
            variant="outline"
            size="sm"
            className="h-auto whitespace-normal px-3 py-1.5 text-left text-xs"
            onClick={() => onSelect(t(`items.${id}.content`))}
          >
            {t(`items.${id}.label`)}
          </Button>
        ))}
      </div>
    </div>
  )
}
