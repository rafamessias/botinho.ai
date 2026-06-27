"use client"

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { Bot, ChevronsUpDown, Phone, Save } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import {
  getAgentPhoneOptionsAction,
  updateAiAgentAction,
  type WhatsAppSessionOption,
} from "@/components/server-actions/ai-agents"
import { PromptTemplatePicker } from "./prompt-template-picker"

export type AgentSettingsView = {
  id: string
  name: string
  systemPrompt: string
  sessionIds: string[]
  autoReply: boolean
}

type AgentSettingsCardProps = {
  agent: AgentSettingsView
  onUpdated: (agent: AgentSettingsView) => void
}

export type AgentSettingsCardHandle = {
  save: (options?: { requireComplete?: boolean }) => Promise<boolean>
}

export const AgentSettingsCard = forwardRef<AgentSettingsCardHandle, AgentSettingsCardProps>(
  ({ agent, onUpdated }, ref) => {
  const t = useTranslations("AiAgents")
  const { toast } = useToast()

  const [name, setName] = useState(agent.name)
  const [systemPrompt, setSystemPrompt] = useState(agent.systemPrompt)
  const [sessionIds, setSessionIds] = useState<string[]>(agent.sessionIds)
  const [autoReply, setAutoReply] = useState(agent.autoReply)
  const [sessions, setSessions] = useState<WhatsAppSessionOption[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingSessions, setIsLoadingSessions] = useState(true)
  const [phonePickerOpen, setPhonePickerOpen] = useState(false)

  useEffect(() => {
    setName(agent.name)
    setSystemPrompt(agent.systemPrompt)
    setSessionIds(agent.sessionIds)
    setAutoReply(agent.autoReply)
  }, [agent])

  const loadSessions = useCallback(async () => {
    setIsLoadingSessions(true)
    try {
      const result = await getAgentPhoneOptionsAction()
      if (result.success && result.data) {
        setSessions(result.data.sessions.filter((session) => session.connected))
      }
    } finally {
      setIsLoadingSessions(false)
    }
  }, [])

  useEffect(() => {
    void loadSessions()
  }, [loadSessions])

  const save = useCallback(
    async (options?: { requireComplete?: boolean }): Promise<boolean> => {
      const requireComplete = options?.requireComplete ?? false

      if (!name.trim()) {
        toast({
          title: t("errors.agentNameRequired"),
          description: t("errors.agentNameRequiredDescription"),
          variant: "destructive",
        })
        return false
      }

      if (requireComplete && !systemPrompt.trim()) {
        toast({
          title: t("errors.setupIncomplete"),
          description: t("errors.setupIncompleteDescription"),
          variant: "destructive",
        })
        return false
      }

      if (requireComplete && sessionIds.length === 0) {
        toast({
          title: t("errors.setupIncomplete"),
          description: t("errors.setupIncompleteDescription"),
          variant: "destructive",
        })
        return false
      }

      setIsSaving(true)
      try {
        const result = await updateAiAgentAction({
          agentId: agent.id,
          name: name.trim(),
          systemPrompt: systemPrompt.trim(),
          sessionIds,
          autoReply,
        })

        if (!result.success || !result.data) {
          toast({
            title: t("errors.saveFailed"),
            description: result.error || t("errors.tryAgain"),
            variant: "destructive",
          })
          return false
        }

        const updated = result.data.agent
        onUpdated({
          id: updated.id,
          name: updated.name,
          systemPrompt: updated.systemPrompt,
          sessionIds: updated.sessionIds,
          autoReply: updated.autoReply,
        })

        toast({
          title: t("success.agentUpdated"),
          description: t("success.agentUpdatedDescription"),
        })
        return true
      } catch (error) {
        console.error("Update agent error", error)
        toast({
          title: t("errors.saveFailed"),
          description: t("errors.tryAgain"),
          variant: "destructive",
        })
        return false
      } finally {
        setIsSaving(false)
      }
    },
    [agent.id, autoReply, name, onUpdated, sessionIds, systemPrompt, t, toast],
  )

  useImperativeHandle(ref, () => ({ save }), [save])

  const formatSessionLabel = (session: WhatsAppSessionOption) =>
    session.label ?? session.phoneNumber ?? session.sessionId

  const selectedSessions = useMemo(
    () => sessions.filter((session) => sessionIds.includes(session.sessionId)),
    [sessionIds, sessions],
  )

  const phoneSelectionLabel = useMemo(() => {
    if (sessionIds.length === 0) {
      return t("form.noNumberAssigned")
    }

    if (selectedSessions.length === 1) {
      return formatSessionLabel(selectedSessions[0]!)
    }

    if (selectedSessions.length > 1) {
      return t("form.numbersSelected", { count: selectedSessions.length })
    }

    return t("form.numbersSelected", { count: sessionIds.length })
  }, [selectedSessions, sessionIds.length, t])

  const toggleSession = (sessionId: string) => {
    setSessionIds((previous) =>
      previous.includes(sessionId)
        ? previous.filter((id) => id !== sessionId)
        : [...previous, sessionId],
    )
  }

  return (
    <Card className="elegant-card">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="heading-secondary flex items-center gap-2">
            <Bot className="h-5 w-5" />
            {t("settings.title")}
          </CardTitle>
          <CardDescription className="body-secondary">{t("settings.description")}</CardDescription>
        </div>
        <Button onClick={() => void save()} disabled={isSaving} className="shrink-0">
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? t("buttons.saving") : t("buttons.saveAgent")}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="agent-name">{t("form.agentName")}</Label>
            <Input
              id="agent-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t("form.agentNamePlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agent-phone">{t("form.assignedNumbers")}</Label>
            <Popover open={phonePickerOpen} onOpenChange={setPhonePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="agent-phone"
                  type="button"
                  variant="outline"
                  disabled={isLoadingSessions}
                  className={cn(
                    "h-10 w-full justify-between font-normal",
                    sessionIds.length === 0 && "text-muted-foreground",
                  )}
                >
                  <span className="truncate">{phoneSelectionLabel}</span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] p-0"
                align="start"
              >
                {sessions.length === 0 ? (
                  <p className="p-3 text-sm text-muted-foreground">{t("form.noConnectedNumbers")}</p>
                ) : (
                  <div className="max-h-60 overflow-y-auto p-1" role="listbox" aria-multiselectable="true">
                    {sessions.map((session) => {
                      const isSelected = sessionIds.includes(session.sessionId)
                      const label = formatSessionLabel(session)

                      return (
                        <div
                          key={session.sessionId}
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => toggleSession(session.sessionId)}
                          className="flex w-full cursor-pointer items-start gap-3 rounded-sm px-2 py-2 text-left hover:bg-muted"
                        >
                          <Checkbox
                            checked={isSelected}
                            className="mt-0.5 pointer-events-none"
                            aria-hidden="true"
                            tabIndex={-1}
                          />
                          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <span className="flex items-center gap-2 truncate text-sm font-medium">
                              <Phone className="h-3.5 w-3.5 shrink-0" />
                              {label}
                            </span>
                            {session.phoneNumber && session.label && (
                              <span className="truncate text-xs text-muted-foreground">
                                {session.phoneNumber}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </PopoverContent>
            </Popover>
            {!isLoadingSessions && sessions.length === 0 && (
              <p className="text-xs text-muted-foreground">{t("form.noConnectedNumbers")}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="agent-prompt">{t("form.systemPrompt")}</Label>
          <PromptTemplatePicker onSelect={setSystemPrompt} />
          <Textarea
            id="agent-prompt"
            value={systemPrompt}
            onChange={(event) => setSystemPrompt(event.target.value)}
            placeholder={t("form.systemPromptPlaceholder")}
            className="resize-y min-h-[300px] field-sizing-fixed"
          />
          <p className="text-xs text-muted-foreground">{t("form.systemPromptDescription")}</p>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="agent-auto-reply">{t("form.autoReply")}</Label>
            <p className="text-sm text-muted-foreground">{t("form.autoReplyDescription")}</p>
          </div>
          <Switch
            id="agent-auto-reply"
            checked={autoReply}
            onCheckedChange={setAutoReply}
          />
        </div>
      </CardContent>
    </Card>
  )
},
)

AgentSettingsCard.displayName = "AgentSettingsCard"
