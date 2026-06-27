"use client"

import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react"
import { useTranslations } from "next-intl"
import { ClipboardList, Loader2, Save } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { CheckboxVisual } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { updateAiAgentAction } from "@/components/server-actions/ai-agents"
import { listActiveSurveysAction } from "@/components/server-actions/surveys"
import type { SurveyView } from "@/components/server-actions/surveys"
import type { SurveyTriggers } from "@/lib/types/survey"

export type AgentSurveysView = {
  id: string
  surveyIds: string[]
  surveyTriggers: SurveyTriggers
}

type AgentSurveysCardProps = {
  agent: AgentSurveysView
  onUpdated: (agent: AgentSurveysView) => void
}

export type AgentSurveysCardHandle = {
  save: () => Promise<boolean>
}

export const AgentSurveysCard = forwardRef<AgentSurveysCardHandle, AgentSurveysCardProps>(
  ({ agent, onUpdated }, ref) => {
    const t = useTranslations("AiAgents.surveys")
    const { toast } = useToast()

    const [surveyIds, setSurveyIds] = useState<string[]>(agent.surveyIds)
    const [triggers, setTriggers] = useState<SurveyTriggers>(agent.surveyTriggers)
    const [availableSurveys, setAvailableSurveys] = useState<SurveyView[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [pickerOpen, setPickerOpen] = useState(false)

    useEffect(() => {
      setSurveyIds(agent.surveyIds)
      setTriggers(agent.surveyTriggers)
    }, [agent])

    useEffect(() => {
      void (async () => {
        setIsLoading(true)
        const result = await listActiveSurveysAction()
        if (result.success && result.data) {
          setAvailableSurveys(result.data.surveys)
        }
        setIsLoading(false)
      })()
    }, [])

    const save = useCallback(async (): Promise<boolean> => {
      setIsSaving(true)
      try {
        const result = await updateAiAgentAction({
          agentId: agent.id,
          surveyIds,
          surveyTriggers: triggers,
        })
        if (!result.success || !result.data) {
          toast({ title: result.error || t("errors.saveFailed"), variant: "destructive" })
          return false
        }
        const updated = {
          id: agent.id,
          surveyIds: result.data.agent.surveyIds,
          surveyTriggers: result.data.agent.surveyTriggers,
        }
        onUpdated(updated)
        toast({ title: t("messages.saved") })
        return true
      } finally {
        setIsSaving(false)
      }
    }, [agent.id, onUpdated, surveyIds, t, toast, triggers])

    useImperativeHandle(ref, () => ({ save }), [save])

    const toggleSurvey = (id: string) => {
      setSurveyIds((prev) => (prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]))
    }

    const selectedLabels = availableSurveys
      .filter((s) => surveyIds.includes(s.id))
      .map((s) => s.name)

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            {t("title")}
          </CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>{t("enabledSurveys")}</Label>
            {isLoading ? (
              <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("loading")}
              </div>
            ) : availableSurveys.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t("noSurveys")}{" "}
                <Link href="/surveys" className="text-primary hover:underline">
                  {t("createSurvey")}
                </Link>
              </p>
            ) : (
              <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between font-normal">
                    <span className="truncate">
                      {selectedLabels.length > 0 ? selectedLabels.join(", ") : t("selectSurveys")}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-2" align="start">
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {availableSurveys.map((survey) => (
                      <button
                        key={survey.id}
                        type="button"
                        onClick={() => toggleSurvey(survey.id)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-muted",
                          surveyIds.includes(survey.id) && "bg-primary/5",
                        )}
                      >
                        <CheckboxVisual checked={surveyIds.includes(survey.id)} />
                        <span className="truncate">{survey.name}</span>
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          <div className="space-y-3">
            <Label>{t("triggers.title")}</Label>
            <div className="space-y-3">
              {(
                [
                  ["proactiveOffer", t("triggers.proactiveOffer")],
                  ["onConversationClose", t("triggers.onConversationClose")],
                  ["onEscalation", t("triggers.onEscalation")],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between gap-3">
                  <Label htmlFor={key} className="font-normal text-sm">
                    {label}
                  </Label>
                  <Switch
                    id={key}
                    checked={triggers[key]}
                    onCheckedChange={(checked) => setTriggers({ ...triggers, [key]: checked })}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => void save()} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {t("save")}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  },
)

AgentSurveysCard.displayName = "AgentSurveysCard"
