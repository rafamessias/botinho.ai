"use client"

import { useCallback, useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { AlertTriangle, Bot, Loader2, Plus } from "lucide-react"
import { AiAgentsListTable } from "@/components/ai-agents/ai-agents-list-table"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
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

type AiAgentsListPageProps = {
  initialAgents: AgentListItem[]
  initialSessions?: WhatsAppSessionOption[]
  initialLoadError?: string | null
  hasCompanyAccess: boolean
}

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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)

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
      setNameError(t("errors.agentNameRequiredDescription"))
      return
    }

    setNameError(null)
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

      setNewAgentName("")
      setIsCreateDialogOpen(false)
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

  const closeCreateDialog = () => {
    if (isCreating) return
    setIsCreateDialogOpen(false)
    setNewAgentName("")
    setNameError(null)
  }

  const handleOpenCreateDialog = () => {
    setNameError(null)
    setIsCreateDialogOpen(true)
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
    <div className="section-spacing space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
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
      ) : (
        <AiAgentsListTable
          agents={agents}
          sessions={sessions}
          canDelete={agents.length > 1}
          deletingId={deletingId}
          onCreate={handleOpenCreateDialog}
          onDelete={(agent) => {
            setAgentToDelete(agent)
            setDeleteConfirmName("")
          }}
        />
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={(open) => !open && closeCreateDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("setup.create.title")}</DialogTitle>
            <DialogDescription>{t("setup.create.description")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="new-agent-name">{t("form.agentName")}</Label>
            <Input
              id="new-agent-name"
              value={newAgentName}
              onChange={(event) => {
                setNewAgentName(event.target.value)
                if (nameError) setNameError(null)
              }}
              placeholder={t("form.agentNamePlaceholder")}
              aria-invalid={Boolean(nameError)}
              aria-describedby={nameError ? "new-agent-name-error" : undefined}
              onKeyDown={(event) => {
                if (event.key === "Enter") void handleCreateAgent()
              }}
            />
            {nameError ? (
              <p id="new-agent-name-error" className="text-xs text-destructive">
                {nameError}
              </p>
            ) : null}
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button type="button" variant="outline" onClick={closeCreateDialog} disabled={isCreating}>
              {commonT("cancel")}
            </Button>
            <Button type="button" onClick={() => void handleCreateAgent()} disabled={isCreating}>
              {isCreating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              {isCreating ? t("buttons.creating") : t("setup.create.button")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
