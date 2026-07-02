"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { ArrowLeft, CheckCircle2, Circle, Loader2 } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/components/user-provider"
import { getAiAgentAction } from "@/components/server-actions/ai-agents"
import { AgentSettingsCard, type AgentSettingsCardHandle, type AgentSettingsView } from "./agent-settings-card"
import { AgentKnowledgeEditor } from "./agent-knowledge-editor"
import { AgentSurveysCard, type AgentSurveysCardHandle, type AgentSurveysView } from "./agent-surveys-card"
import { DEFAULT_SURVEY_TRIGGERS } from "@/lib/types/survey"
import { cn } from "@/lib/utils"

type AiAgentDetailPageProps = {
  agentId: string
}

type SetupStep = "settings" | "knowledge" | "surveys"

export default function AiAgentDetailPage({ agentId }: AiAgentDetailPageProps) {
  const t = useTranslations("AiAgents")
  const { toast } = useToast()
  const { user } = useUser()

  const [agent, setAgent] = useState<AgentSettingsView | null>(null)
  const [agentSurveys, setAgentSurveys] = useState<AgentSurveysView | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [activeStep, setActiveStep] = useState<SetupStep>("settings")
  const [isAdvancingStep, setIsAdvancingStep] = useState(false)
  const settingsCardRef = useRef<AgentSettingsCardHandle>(null)
  const surveysCardRef = useRef<AgentSurveysCardHandle>(null)

  const hasCompanyAccess = Boolean(user?.defaultCompanyId)

  const loadAgent = useCallback(async () => {
    if (!hasCompanyAccess) {
      setAgent(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setLoadError(null)

    try {
      const result = await getAiAgentAction({ agentId })
      if (!result.success || !result.data) {
        setLoadError(result.error || t("errors.loadFailed"))
        return
      }

      const loaded = result.data.agent
      setAgent({
        id: loaded.id,
        name: loaded.name,
        systemPrompt: loaded.systemPrompt,
        sessionIds: loaded.sessionIds,
        autoReply: loaded.autoReply,
        ticketsEnabled: loaded.ticketsEnabled,
        schedulingEnabled: loaded.schedulingEnabled,
        language: loaded.language,
      })
      setAgentSurveys({
        id: loaded.id,
        surveyIds: loaded.surveyIds ?? [],
        surveyTriggers: loaded.surveyTriggers ?? DEFAULT_SURVEY_TRIGGERS,
      })
    } catch (error) {
      console.error("Load agent error", error)
      setLoadError(error instanceof Error ? error.message : t("errors.loadFailed"))
      toast({
        title: t("errors.loadFailed"),
        description: t("errors.tryAgain"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [agentId, hasCompanyAccess, t, toast])

  useEffect(() => {
    void loadAgent()
  }, [loadAgent])

  const settingsComplete = useMemo(() => {
    if (!agent) return false
    return (
      agent.name.trim().length > 0 &&
      agent.systemPrompt.trim().length > 0 &&
      agent.sessionIds.length > 0
    )
  }, [agent])

  const handleNextStep = useCallback(async () => {
    setIsAdvancingStep(true)
    try {
      const saved = await settingsCardRef.current?.save({ requireComplete: true })
      if (saved) {
        setActiveStep("knowledge")
      }
    } finally {
      setIsAdvancingStep(false)
    }
  }, [])

  const steps: Array<{ id: SetupStep; label: string; done: boolean }> = [
    { id: "settings", label: t("detail.steps.settings"), done: settingsComplete },
    { id: "knowledge", label: t("detail.steps.knowledge"), done: false },
    { id: "surveys", label: t("detail.steps.surveys"), done: false },
  ]

  if (!hasCompanyAccess) {
    return (
      <Card className="elegant-card">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="heading-secondary text-xl">{t("noCompany.title")}</CardTitle>
          <CardDescription className="body-secondary">{t("noCompany.description")}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        {t("detail.loading")}
      </div>
    )
  }

  if (loadError || !agent) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" asChild>
          <Link href="/ai-agents">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("buttons.backToAgents")}
          </Link>
        </Button>
        <Card className="elegant-card">
          <CardHeader className="text-center">
            <CardTitle>{t("errors.agentNotFound")}</CardTitle>
            <CardDescription>{loadError || t("errors.tryAgain")}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/ai-agents" aria-label={t("buttons.backToAgents")}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="heading-secondary text-xl">{agent.name}</h2>
            <p className="text-sm text-muted-foreground">{t("detail.subtitle")}</p>
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-6 lg:flex-row">
        <nav className="flex w-full min-w-0 flex-col gap-1 lg:w-56 lg:shrink-0">
          {steps.map((step, index) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveStep(step.id)}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors lg:w-auto",
                activeStep === step.id
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs">
                {step.done ? <CheckCircle2 className="h-4 w-4 text-primary" /> : index + 1}
              </span>
              {step.label}
              {!step.done && activeStep !== step.id && (
                <Circle className="ml-auto hidden h-3 w-3 text-muted-foreground/50 lg:block" />
              )}
            </button>
          ))}

          <div className="hidden lg:block mt-4 rounded-lg border border-dashed p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">{t("detail.sharedResources.title")}</p>
            <p>{t("detail.sharedResources.description")}</p>
            <div className="mt-2 flex flex-col gap-1">
              <Link href="/quick-answers" className="text-primary hover:underline">
                {t("detail.sharedResources.quickAnswers")}
              </Link>
              <Link href="/templates" className="text-primary hover:underline">
                {t("detail.sharedResources.templates")}
              </Link>
              <Link href="/surveys" className="text-primary hover:underline">
                {t("detail.sharedResources.surveys")}
              </Link>
            </div>
          </div>
        </nav>

        <div className="min-w-0 flex-1 space-y-6">
          {activeStep === "settings" && (
            <>
              <AgentSettingsCard ref={settingsCardRef} agent={agent} onUpdated={setAgent} />
              <div className="flex justify-end">
                <Button onClick={() => void handleNextStep()} disabled={isAdvancingStep}>
                  {isAdvancingStep ? t("buttons.saving") : t("detail.nextStep")}
                </Button>
              </div>
            </>
          )}

          {activeStep === "knowledge" && (
            <>
              <AgentKnowledgeEditor agentId={agentId} />
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveStep("settings")}>
                  {t("detail.previousStep")}
                </Button>
                <Button onClick={() => setActiveStep("surveys")}>{t("detail.nextStep")}</Button>
              </div>
            </>
          )}

          {activeStep === "surveys" && agentSurveys && (
            <>
              <AgentSurveysCard
                ref={surveysCardRef}
                agent={agentSurveys}
                onUpdated={setAgentSurveys}
              />
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveStep("knowledge")}>
                  {t("detail.previousStep")}
                </Button>
                <Button asChild>
                  <Link href="/ai-agents">{t("detail.finishSetup")}</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
