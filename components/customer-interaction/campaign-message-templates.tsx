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
    <div className="space-y-3 rounded-md border bg-muted/20 p-4">
      <div className="flex items-start gap-2">
        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium">{t("title")}</p>
          <p className="text-xs text-muted-foreground">{t("description")}</p>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Button
            key={template.id}
            type="button"
            variant="outline"
            className="h-auto flex-col items-start gap-1 px-3 py-3 text-left whitespace-normal"
            onClick={() => onApply(template)}
          >
            <span className="font-medium">{template.name}</span>
            <span className="text-xs font-normal text-muted-foreground line-clamp-2">
              {template.description}
            </span>
          </Button>
        ))}
      </div>
    </div>
  )
}
