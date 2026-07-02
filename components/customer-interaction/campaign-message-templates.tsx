"use client"

import { useMemo } from "react"
import { useTranslations } from "next-intl"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  CAMPAIGN_STARTER_TEMPLATE_IDS,
  type CampaignStarterTemplate,
  type CampaignStarterTemplateId,
} from "@/lib/campaign/campaign-templates"

type CampaignMessageTemplatesProps = {
  onApply: (template: CampaignStarterTemplate) => void
}

export const CampaignMessageTemplates = ({ onApply }: CampaignMessageTemplatesProps) => {
  const t = useTranslations("Campaigns.editor.starterTemplates")

  const templates = useMemo(() => {
    const items = t.raw("items") as Record<
      CampaignStarterTemplateId,
      { name: string; description: string; message: string }
    >

    return CAMPAIGN_STARTER_TEMPLATE_IDS.map((id) => ({
      id,
      name: items[id]?.name ?? id,
      description: items[id]?.description ?? "",
      message: items[id]?.message ?? "",
    }))
  }, [t])

  return (
    <div className="space-y-2 rounded-md border bg-muted/20 p-3">
      <div className="flex items-center gap-1.5">
        <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <p className="text-xs font-medium">{t("title")}</p>
        <span className="text-xs text-muted-foreground">·</span>
        <p className="text-xs text-muted-foreground">{t("description")}</p>
      </div>
      <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Button
            key={template.id}
            type="button"
            variant="outline"
            className="group h-auto flex-col items-start gap-0 px-2.5 py-2 text-left whitespace-normal hover:border-primary/40 hover:bg-primary/5 hover:text-foreground dark:hover:bg-primary/10"
            onClick={() => onApply(template)}
          >
            <span className="text-sm leading-tight font-medium">{template.name}</span>
            <span className="text-xs font-normal leading-snug text-muted-foreground line-clamp-1 group-hover:text-foreground/80">
              {template.description}
            </span>
          </Button>
        ))}
      </div>
    </div>
  )
}
