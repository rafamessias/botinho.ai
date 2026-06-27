"use client"

import { useCallback, useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Plus, Smartphone } from "lucide-react"
import { StatusCallout } from "@/components/ui/status-callout"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useUser } from "@/components/user-provider"
import {
  deleteWhatsAppSessionAction,
  getWhatsAppSessionsAction,
  type WhatsAppSessionView,
} from "@/components/server-actions/whatsapp"
import { WhatsAppPairingDialog } from "@/components/settings/whatsapp-pairing-dialog"
import { WhatsAppSessionRow } from "@/components/settings/whatsapp-session-row"

const WhatsAppSessionsSkeleton = () => (
  <div className="rounded-lg border p-4 space-y-2.5">
    <Skeleton className="h-4 w-36 bg-muted-foreground/15" />
    <Skeleton className="h-3 w-28 bg-muted-foreground/10" />
    <Skeleton className="h-5 w-16 rounded-full bg-muted-foreground/10" />
  </div>
)

export default function SettingsPage() {
  const { user, loading: isUserLoading } = useUser()
  const companyId = user?.defaultCompanyId ? String(user.defaultCompanyId) : undefined
  const t = useTranslations("Settings.page")

  const [whatsappAvailable, setWhatsappAvailable] = useState(true)
  const [whatsappSessions, setWhatsappSessions] = useState<WhatsAppSessionView[]>([])
  const [isLoadingWhatsapp, setIsLoadingWhatsapp] = useState(true)
  const [isPairingOpen, setIsPairingOpen] = useState(false)
  const [disconnectingSessionId, setDisconnectingSessionId] = useState<string | null>(null)

  const loadWhatsappSessions = useCallback(async (options?: { silent?: boolean }) => {
    if (isUserLoading || !companyId) {
      setWhatsappSessions([])
      setWhatsappAvailable(true)
      setIsLoadingWhatsapp(false)
      return
    }

    if (!options?.silent) {
      setIsLoadingWhatsapp(true)
    }
    try {
      const response = await getWhatsAppSessionsAction({ companyId })
      if (!response.success || !response.data) {
        throw new Error(response.error ?? "Failed to load WhatsApp sessions")
      }
      setWhatsappAvailable(response.data.available)
      setWhatsappSessions(response.data.sessions)
    } catch (error) {
      console.error("Failed to load WhatsApp sessions", error)
      setWhatsappAvailable(false)
      setWhatsappSessions([])
    } finally {
      if (!options?.silent) {
        setIsLoadingWhatsapp(false)
      }
    }
  }, [companyId, isUserLoading])

  useEffect(() => {
    void loadWhatsappSessions()
  }, [loadWhatsappSessions])

  const handleDisconnectSession = async (sessionId: string) => {
    if (!companyId) return

    setDisconnectingSessionId(sessionId)
    try {
      const response = await deleteWhatsAppSessionAction({ companyId, sessionId })
      if (!response.success) {
        throw new Error(response.error ?? t("toasts.removeWhatsappFailed"))
      }
      toast.success(t("toasts.removeWhatsappSuccess"))
      await loadWhatsappSessions()
    } catch (error) {
      console.error("Failed to disconnect WhatsApp session", error)
      toast.error(t("toasts.removeWhatsappFailed"))
    } finally {
      setDisconnectingSessionId(null)
    }
  }

  const statusBadgeVariant = (status: WhatsAppSessionView["status"]) => {
    if (status === "connected") return "default"
    if (status === "qr_pending") return "secondary"
    return "outline"
  }

  const pendingPairingSession = whatsappSessions.find((session) =>
    ["pending", "qr_pending", "needs_qr"].includes(session.status),
  )

  const pendingPairingSessionId = pendingPairingSession?.sessionId

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              {t("whatsapp.card.title")}
            </CardTitle>
            <CardDescription>{t("whatsapp.card.description")}</CardDescription>
          </div>
          <Button
            type="button"
            onClick={() => setIsPairingOpen(true)}
            disabled={!companyId || !whatsappAvailable || isLoadingWhatsapp}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("whatsapp.card.addButton")}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {!whatsappAvailable && !isLoadingWhatsapp && (
            <StatusCallout variant="warning" message={t("whatsapp.offlineBanner")} />
          )}

          {isLoadingWhatsapp ? (
            <WhatsAppSessionsSkeleton />
          ) : whatsappSessions.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <p className="font-medium">{t("whatsapp.empty.title")}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t("whatsapp.empty.description")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {whatsappSessions.map((session) => (
                <WhatsAppSessionRow
                  key={session.sessionId}
                  session={session}
                  companyId={companyId}
                  serviceAvailable={whatsappAvailable}
                  isDisconnecting={disconnectingSessionId === session.sessionId}
                  statusBadgeVariant={statusBadgeVariant}
                  onUpdated={() => {
                    void loadWhatsappSessions({ silent: true })
                  }}
                  onDisconnect={(sessionId) => {
                    void handleDisconnectSession(sessionId)
                  }}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <WhatsAppPairingDialog
        open={isPairingOpen}
        onOpenChange={setIsPairingOpen}
        companyId={companyId}
        resumeSessionId={pendingPairingSessionId}
        resumeSessionLabel={pendingPairingSession?.label}
        onSessionUpdate={() => {
          void loadWhatsappSessions({ silent: true })
        }}
        onCompleted={() => {
          void loadWhatsappSessions()
          setIsPairingOpen(false)
        }}
      />
    </div>
  )
}
