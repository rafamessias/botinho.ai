"use client"

import { useCallback, useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Circle,
  Loader2,
  Phone,
  Plus,
  Trash2,
} from "lucide-react"
import { Link } from "@/i18n/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ErrorState } from "@/components/ai-training/components/error-state"
import {
  createAiAgentAction,
  deleteAiAgentAction,
  getAgentPhoneOptionsAction,
  listAiAgentsAction,
  type WhatsAppSessionOption,
} from "@/components/server-actions/ai-agents"
import { mapAiAgentsToView, type AgentListItem } from "@/components/ai-agents/map-agent-views"
import { cn } from "@/lib/utils"

type AiAgentsListPageProps = {
  initialAgents: AgentListItem[]
  initialSessions?: WhatsAppSessionOption[]
  initialLoadError?: string | null
  hasCompanyAccess: boolean
}

const formatSessionLabel = (session: WhatsAppSessionOption) =>
  session.label ?? session.phoneNumber ?? session.sessionId

const getAssignedNumbersLabel = (
  sessionIds: string[],
  sessions: WhatsAppSessionOption[],
  t: (key: string, values?: Record<string, string | number>) => string,
) => {
  if (sessionIds.length === 0) return null

  if (sessionIds.length > 2) {
    return t("list.numbersAssigned", { count: sessionIds.length })
  }

  return sessionIds
    .map((sessionId) => {
      const session = sessions.find((item) => item.sessionId === sessionId)
      return session ? formatSessionLabel(session) : sessionId
    })
    .join(" · ")
}

const getSetupSteps = (agent: AgentListItem) => [
  { id: "name", done: agent.name.trim().length > 0 },
  { id: "prompt", done: agent.systemPrompt.trim().length > 0 },
  { id: "phone", done: agent.sessionIds.length > 0 },
  { id: "live", done: agent.sessionIds.length > 0 && agent.autoReply },
]

export default function AiAgentsListPage({
  initialAgents,
  initialSessions = [],
  initialLoadError = null,
  hasCompanyAccess,
}: AiAgentsListPageProps) {
  const t = useTranslations("AiAgents")
  const commonT = useTranslations("Common")
  const router = useRouter()
  const { toast } = useToast()

  const [agents, setAgents] = useState<AgentListItem[]>(initialAgents)
  const [sessions, setSessions] = useState<WhatsAppSessionOption[]>(initialSessions)
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(initialLoadError)
  const [newAgentName, setNewAgentName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [agentToDelete, setAgentToDelete] = useState<AgentListItem | null>(null)
  const [deleteConfirmName, setDeleteConfirmName] = useState("")

  const loadAgents = useCallback(async () => {
    if (!hasCompanyAccess) {
      setAgents([])
      return
    }

    setIsLoading(true)
    setLoadError(null)

    try {
      const [agentsResult, sessionsResult] = await Promise.all([
        listAiAgentsAction(),
        getAgentPhoneOptionsAction(),
      ])

      if (!agentsResult.success || !agentsResult.data) {
        setLoadError(agentsResult.error || t("errors.loadFailed"))
        return
      }
      setAgents(mapAiAgentsToView(agentsResult.data.agents))

      if (sessionsResult.success && sessionsResult.data) {
        setSessions(sessionsResult.data.sessions)
      }
    } catch (error) {
      console.error("Load agents error", error)
      setLoadError(t("errors.loadFailed"))
    } finally {
      setIsLoading(false)
    }
  }, [hasCompanyAccess, t])

  const handleCreateAgent = async () => {
    if (!newAgentName.trim()) {
      toast({
        title: t("errors.agentNameRequired"),
        description: t("errors.agentNameRequiredDescription"),
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      const result = await createAiAgentAction({ name: newAgentName.trim() })
      if (!result.success || !result.data) {
        toast({
          title: t("errors.createFailed"),
          description: result.error || t("errors.tryAgain"),
          variant: "destructive",
        })
        return
      }

      router.push(`/ai-agents/${result.data.agent.id}`)
    } catch (error) {
      console.error("Create agent error", error)
      toast({
        title: t("errors.createFailed"),
        description: t("errors.tryAgain"),
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const closeDeleteModal = () => {
    setAgentToDelete(null)
    setDeleteConfirmName("")
  }

  const handleDeleteAgent = async () => {
    if (!agentToDelete) return

    setDeletingId(agentToDelete.id)
    try {
      const result = await deleteAiAgentAction({ agentId: agentToDelete.id })
      if (!result.success) {
        toast({
          title: t("errors.deleteFailed"),
          description: result.error || t("errors.tryAgain"),
          variant: "destructive",
        })
        return
      }
      setAgents((prev) => prev.filter((agent) => agent.id !== agentToDelete.id))
      closeDeleteModal()
      toast({
        title: t("success.agentDeleted"),
        description: t("success.agentDeletedDescription"),
      })
    } finally {
      setDeletingId(null)
    }
  }

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

  return (
    <div className="space-y-8">
      <div className="rounded-xl border bg-gradient-to-br from-primary/5 via-background to-background p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 text-primary">
              <Bot className="h-5 w-5" />
              <span className="text-sm font-medium">{t("setup.badge")}</span>
            </div>
            <h2 className="heading-secondary text-2xl">{t("setup.title")}</h2>
            <p className="text-muted-foreground">{t("setup.description")}</p>
            <ol className="space-y-2 text-sm text-muted-foreground">
              {[1, 2, 3, 4].map((step) => (
                <li key={step} className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {step}
                  </span>
                  {t(`setup.steps.${step}` as "setup.steps.1")}
                </li>
              ))}
            </ol>
          </div>

          <Card className="w-full max-w-sm shrink-0 border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t("setup.create.title")}</CardTitle>
              <CardDescription>{t("setup.create.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="quick-agent-name">{t("form.agentName")}</Label>
                <Input
                  id="quick-agent-name"
                  value={newAgentName}
                  onChange={(event) => setNewAgentName(event.target.value)}
                  placeholder={t("form.agentNamePlaceholder")}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") void handleCreateAgent()
                  }}
                />
              </div>
              <Button
                className="w-full"
                onClick={() => void handleCreateAgent()}
                disabled={isCreating}
              >
                {isCreating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                {isCreating ? t("buttons.creating") : t("setup.create.button")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="heading-secondary text-lg">{t("list.title")}</h3>
          {!isLoading && agents.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {t("list.count", { count: agents.length })}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {t("list.loading")}
          </div>
        ) : loadError ? (
          <ErrorState
            icon={Bot}
            title={t("errors.loadFailed")}
            description={loadError}
            retryLabel="Retry"
            onRetry={() => void loadAgents()}
          />
        ) : agents.length === 0 ? (
          <Card className="elegant-card border-dashed">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <Bot className="h-10 w-10 text-muted-foreground" />
              <p className="font-medium">{t("list.empty.title")}</p>
              <p className="max-w-sm text-sm text-muted-foreground">{t("list.empty.description")}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {agents.map((agent) => {
              const steps = getSetupSteps(agent)
              const completedCount = steps.filter((step) => step.done).length
              const isReady = completedCount === steps.length

              return (
                <Card key={agent.id} className="elegant-card">
                  <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-3 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold truncate">{agent.name}</h4>
                        <Badge variant={isReady ? "default" : "secondary"}>
                          {isReady ? t("list.statusReady") : t("list.statusSetup")}
                        </Badge>
                        {agent.autoReply && agent.sessionIds.length > 0 && (
                          <Badge variant="outline" className="text-primary border-primary/30">
                            {t("list.autoReplyOn")}
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {steps.map((step) => (
                          <span
                            key={step.id}
                            className={cn(
                              "flex items-center gap-1.5 text-xs",
                              step.done ? "text-primary" : "text-muted-foreground",
                            )}
                          >
                            {step.done ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : (
                              <Circle className="h-3.5 w-3.5" />
                            )}
                            {t(`setup.checklist.${step.id}` as "setup.checklist.name")}
                          </span>
                        ))}
                      </div>

                      {agent.sessionIds.length > 0 && (
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3 shrink-0" />
                          <span className="truncate">
                            {getAssignedNumbersLabel(agent.sessionIds, sessions, t)}
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {agents.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/15"
                          disabled={deletingId === agent.id}
                          onClick={() => {
                            setAgentToDelete(agent)
                            setDeleteConfirmName("")
                          }}
                        >
                          {deletingId === agent.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      <Button asChild>
                        <Link href={`/ai-agents/${agent.id}`}>
                          {isReady ? t("buttons.manageAgent") : t("setup.continueSetup")}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <Dialog
        open={agentToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deletingId) closeDeleteModal()
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {t("list.delete.title")}
            </DialogTitle>
            <DialogDescription>{t("list.delete.description")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="delete-agent-name">{t("list.delete.nameLabel")}</Label>
              <Input
                id="delete-agent-name"
                value={deleteConfirmName}
                onChange={(event) => setDeleteConfirmName(event.target.value)}
                placeholder={agentToDelete?.name}
                className="font-mono"
                autoComplete="off"
              />
              <p className="text-xs text-muted-foreground">{t("list.delete.nameNote")}</p>
            </div>

            <div className="rounded-lg bg-destructive/10 p-4">
              <p className="text-sm text-muted-foreground">{t("list.delete.warning")}</p>
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={closeDeleteModal}
              disabled={Boolean(deletingId)}
            >
              {commonT("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => void handleDeleteAgent()}
              disabled={
                Boolean(deletingId) || deleteConfirmName !== agentToDelete?.name
              }
              className="min-w-[100px]"
            >
              {deletingId ? commonT("deleting") : t("list.delete.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
