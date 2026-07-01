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
import { CheckboxVisual } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import {
  checkAgentSessionAssignmentConflictsAction,
  getAgentPhoneOptionsAction,
  updateAiAgentAction,
  type WhatsAppSessionOption,
} from "@/components/server-actions/ai-agents"
import { PromptAssistant } from "./prompt-assistant"

export type AgentSettingsView = {
  id: string
  name: string
  systemPrompt: string
  sessionIds: string[]
  autoReply: boolean
  ticketsEnabled: boolean
  schedulingEnabled: boolean
  language: "en" | "pt-BR" | "auto"
}

type AgentSettingsCardProps = {
  agent: AgentSettingsView
  onUpdated: (agent: AgentSettingsView) => void
}

export type AgentSettingsCardHandle = {
  save: (options?: { requireComplete?: boolean }) => Promise<boolean>
}

type SaveOptions = {
  requireComplete?: boolean
  confirmedReassignment?: boolean
}

type SessionAssignmentConflict = {
  sessionId: string
  agentId: string
  agentName: string
}

export const AgentSettingsCard = forwardRef<AgentSettingsCardHandle, AgentSettingsCardProps>(
  ({ agent, onUpdated }, ref) => {
  const t = useTranslations("AiAgents")
  const { toast } = useToast()

  const [name, setName] = useState(agent.name)
  const [systemPrompt, setSystemPrompt] = useState(agent.systemPrompt)
  const [sessionIds, setSessionIds] = useState<string[]>(agent.sessionIds)
  const [autoReply, setAutoReply] = useState(agent.autoReply)
  const [ticketsEnabled, setTicketsEnabled] = useState(agent.ticketsEnabled)
  const [schedulingEnabled, setSchedulingEnabled] = useState(agent.schedulingEnabled)
  const [language, setLanguage] = useState(agent.language)
  const [sessions, setSessions] = useState<WhatsAppSessionOption[]>([])
  const connectedSessions = useMemo(
    () => sessions.filter((session) => session.connected),
    [sessions],
  )
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingSessions, setIsLoadingSessions] = useState(true)
  const [phonePickerOpen, setPhonePickerOpen] = useState(false)
  const [reassignmentDialogOpen, setReassignmentDialogOpen] = useState(false)
  const [pendingConflicts, setPendingConflicts] = useState<SessionAssignmentConflict[]>([])
  const [pendingSaveOptions, setPendingSaveOptions] = useState<SaveOptions | null>(null)
  const [nameError, setNameError] = useState<string | null>(null)

  useEffect(() => {
    setName(agent.name)
    setSystemPrompt(agent.systemPrompt)
    setSessionIds(agent.sessionIds)
    setAutoReply(agent.autoReply)
    setTicketsEnabled(agent.ticketsEnabled)
    setSchedulingEnabled(agent.schedulingEnabled)
    setLanguage(agent.language)
    setNameError(null)
  }, [agent])

  const loadSessions = useCallback(async () => {
    setIsLoadingSessions(true)
    try {
      const result = await getAgentPhoneOptionsAction()
      if (result.success && result.data) {
        setSessions(result.data.sessions)
      }
    } finally {
      setIsLoadingSessions(false)
    }
  }, [])

  useEffect(() => {
    void loadSessions()
  }, [loadSessions])

  useEffect(() => {
    if (sessions.length === 0) {
      return
    }

    const validSessionIds = new Set(sessions.map((session) => session.sessionId))
    setSessionIds((previous) => {
      const next = previous.filter((sessionId) => validSessionIds.has(sessionId))
      return next.length === previous.length ? previous : next
    })
  }, [sessions])

  const performSave = useCallback(
    async (options?: SaveOptions): Promise<boolean> => {
      setIsSaving(true)
      try {
        const result = await updateAiAgentAction({
          agentId: agent.id,
          name: name.trim(),
          systemPrompt: systemPrompt.trim(),
          sessionIds,
          autoReply,
          ticketsEnabled,
          schedulingEnabled,
          language,
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
          ticketsEnabled: updated.ticketsEnabled,
          schedulingEnabled: updated.schedulingEnabled,
          language: updated.language,
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
    [agent.id, autoReply, language, name, onUpdated, schedulingEnabled, sessionIds, systemPrompt, ticketsEnabled, t, toast],
  )

  const save = useCallback(
    async (options?: SaveOptions): Promise<boolean> => {
      const requireComplete = options?.requireComplete ?? false

      if (!name.trim()) {
        setNameError(t("errors.agentNameRequiredDescription"))
        return false
      }

      setNameError(null)
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

      const newlyAssignedSessionIds = sessionIds.filter(
        (sessionId) => !agent.sessionIds.includes(sessionId),
      )

      if (newlyAssignedSessionIds.length > 0 && !options?.confirmedReassignment) {
        try {
          const conflictResult = await checkAgentSessionAssignmentConflictsAction({
            agentId: agent.id,
            sessionIds: newlyAssignedSessionIds,
          })

          if (
            conflictResult.success &&
            conflictResult.data &&
            conflictResult.data.conflicts.length > 0
          ) {
            setPendingConflicts(conflictResult.data.conflicts)
            setPendingSaveOptions(options ?? {})
            setReassignmentDialogOpen(true)
            return false
          }
        } catch (error) {
          console.error("Check session assignment conflicts error", error)
          toast({
            title: t("errors.saveFailed"),
            description: t("errors.tryAgain"),
            variant: "destructive",
          })
          return false
        }
      }

      return performSave(options)
    },
    [agent.id, agent.sessionIds, name, performSave, sessionIds, systemPrompt, t, toast],
  )

  const handleConfirmReassignment = useCallback(() => {
    setReassignmentDialogOpen(false)
    const options = pendingSaveOptions ?? {}
    setPendingSaveOptions(null)
    setPendingConflicts([])
    void performSave({ ...options, confirmedReassignment: true })
  }, [pendingSaveOptions, performSave])

  const handleCancelReassignment = useCallback(() => {
    setReassignmentDialogOpen(false)
    setPendingSaveOptions(null)
    setPendingConflicts([])
  }, [])

  useImperativeHandle(ref, () => ({ save }), [save])

  const formatSessionLabel = (session: WhatsAppSessionOption) =>
    session.label ?? session.phoneNumber ?? session.sessionId

  const formatSessionLabelById = useCallback(
    (sessionId: string) => {
      const session = sessions.find((item) => item.sessionId === sessionId)
      return session ? formatSessionLabel(session) : sessionId
    },
    [sessions],
  )

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

    return t("form.noNumberAssigned")
  }, [selectedSessions, sessionIds.length, t])

  const toggleSession = (sessionId: string) => {
    setSessionIds((previous) =>
      previous.includes(sessionId)
        ? previous.filter((id) => id !== sessionId)
        : [...previous, sessionId],
    )
  }

  return (
    <>
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
              onChange={(event) => {
                setName(event.target.value)
                if (nameError) setNameError(null)
              }}
              placeholder={t("form.agentNamePlaceholder")}
              aria-invalid={Boolean(nameError)}
              aria-describedby={nameError ? "agent-name-error" : undefined}
            />
            {nameError ? (
              <p id="agent-name-error" className="text-xs text-destructive">
                {nameError}
              </p>
            ) : null}
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
                {connectedSessions.length === 0 ? (
                  <p className="p-3 text-sm text-muted-foreground">{t("form.noConnectedNumbers")}</p>
                ) : (
                  <div className="max-h-60 overflow-y-auto p-1" role="listbox" aria-multiselectable="true">
                    {connectedSessions.map((session) => {
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
                          <CheckboxVisual checked={isSelected} className="mt-0.5" />
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
            {!isLoadingSessions && connectedSessions.length === 0 && (
              <p className="text-xs text-muted-foreground">{t("form.noConnectedNumbers")}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="agent-language">{t("form.responseLanguage")}</Label>
          <Select value={language} onValueChange={(value) => setLanguage(value as AgentSettingsView["language"])}>
            <SelectTrigger id="agent-language" className="w-full md:w-80">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt-BR">{t("form.responseLanguagePtBr")}</SelectItem>
              <SelectItem value="en">{t("form.responseLanguageEn")}</SelectItem>
              <SelectItem value="auto">{t("form.responseLanguageAuto")}</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">{t("form.responseLanguageDescription")}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="agent-prompt">{t("form.systemPrompt")}</Label>
          <PromptAssistant
            ticketsEnabled={ticketsEnabled}
            onApplyPrompt={(content, options) => {
              if (options?.append) {
                setSystemPrompt((previous) =>
                  previous.trim() ? `${previous.trim()}\n\n${content}` : content,
                )
                return
              }
              setSystemPrompt(content)
            }}
          />
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
            <Label htmlFor="agent-tickets">{t("form.ticketsEnabled")}</Label>
            <p className="text-sm text-muted-foreground">{t("form.ticketsEnabledDescription")}</p>
          </div>
          <Switch
            id="agent-tickets"
            checked={ticketsEnabled}
            onCheckedChange={setTicketsEnabled}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="agent-scheduling">{t("form.schedulingEnabled")}</Label>
            <p className="text-sm text-muted-foreground">{t("form.schedulingEnabledDescription")}</p>
          </div>
          <Switch
            id="agent-scheduling"
            checked={schedulingEnabled}
            onCheckedChange={setSchedulingEnabled}
          />
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

    <AlertDialog
      open={reassignmentDialogOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleCancelReassignment()
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("form.reassignNumberTitle")}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>{t("form.reassignNumberDescription")}</p>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {pendingConflicts.map((conflict) => (
                  <li key={`${conflict.sessionId}:${conflict.agentId}`}>
                    {t("form.reassignNumberConflict", {
                      number: formatSessionLabelById(conflict.sessionId),
                      agentName: conflict.agentName,
                    })}
                  </li>
                ))}
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSaving} onClick={handleCancelReassignment}>
            {t("form.reassignNumberCancel")}
          </AlertDialogCancel>
          <Button type="button" disabled={isSaving} onClick={handleConfirmReassignment}>
            {isSaving ? t("buttons.saving") : t("form.reassignNumberConfirm")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
},
)

AgentSettingsCard.displayName = "AgentSettingsCard"
