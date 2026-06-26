"use client"

import { useCallback, useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Bell, Plus, Save, Smartphone } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useUser } from "@/components/user-provider"
import { getSettingsOverviewAction, updateCompanySettingsAction } from "@/components/server-actions/settings"
import {
  deleteWhatsAppSessionAction,
  getWhatsAppSessionsAction,
  type WhatsAppSessionView,
} from "@/components/server-actions/whatsapp"
import { WhatsAppPairingDialog } from "@/components/settings/whatsapp-pairing-dialog"
import { WhatsAppSessionRow } from "@/components/settings/whatsapp-session-row"
import { defaultSettings, type SettingsState } from "./types"

const LoadingNotificationSection = () => (
  <div className="space-y-4 rounded-xl border border-border bg-muted/30 p-6 shadow-sm">
    {[0, 1, 2].map((item) => (
      <div key={item} className="space-y-3">
        <Skeleton className="h-4 w-48 bg-muted-foreground/20" />
        <Skeleton className="h-3 w-full bg-muted-foreground/15" />
      </div>
    ))}
  </div>
)

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

  const [settings, setSettings] = useState<SettingsState | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isLoadingOverview, setIsLoadingOverview] = useState(true)
  const [isSavingSettings, setIsSavingSettings] = useState(false)
  const [whatsappConfigured, setWhatsappConfigured] = useState(false)
  const [whatsappSessions, setWhatsappSessions] = useState<WhatsAppSessionView[]>([])
  const [isLoadingWhatsapp, setIsLoadingWhatsapp] = useState(true)
  const [isPairingOpen, setIsPairingOpen] = useState(false)
  const [disconnectingSessionId, setDisconnectingSessionId] = useState<string | null>(null)

  const loadSettings = useCallback(async () => {
    if (isUserLoading) {
      return
    }

    if (!companyId) {
      setSettings(null)
      setLoadError(null)
      setIsLoadingOverview(false)
      return
    }

    setIsLoadingOverview(true)
    setLoadError(null)

    try {
      const response = await getSettingsOverviewAction({ companyId })
      if (!response.success || !response.data) {
        throw new Error(response.error ?? "Failed to load settings")
      }
      setSettings(response.data.settings)
    } catch (error) {
      console.error("Failed to load settings", error)
      setLoadError(t("load.unable"))
      setSettings(null)
    } finally {
      setIsLoadingOverview(false)
    }
  }, [companyId, isUserLoading, t])

  const loadWhatsappSessions = useCallback(async (options?: { silent?: boolean }) => {
    if (isUserLoading || !companyId) {
      setWhatsappSessions([])
      setWhatsappConfigured(false)
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
      setWhatsappConfigured(response.data.configured)
      setWhatsappSessions(response.data.sessions)
    } catch (error) {
      console.error("Failed to load WhatsApp sessions", error)
      setWhatsappConfigured(false)
      setWhatsappSessions([])
    } finally {
      if (!options?.silent) {
        setIsLoadingWhatsapp(false)
      }
    }
  }, [companyId, isUserLoading])

  useEffect(() => {
    void loadSettings()
  }, [loadSettings])

  useEffect(() => {
    void loadWhatsappSessions()
  }, [loadWhatsappSessions])

  const handleSettingToggle = (key: keyof SettingsState, value: boolean) => {
    setSettings((previous) => (previous ? { ...previous, [key]: value } : previous))
  }

  const handlePersistSettings = async (successToastKey: string) => {
    if (!companyId || !settings) return

    setIsSavingSettings(true)
    try {
      const response = await updateCompanySettingsAction({
        companyId,
        ...settings,
      })

      if (!response.success) {
        throw new Error(response.error ?? "Failed to save settings")
      }

      toast.success(t(successToastKey))
    } catch (error) {
      console.error("Failed to save settings", error)
      toast.error(t("toasts.updateFailed"))
    } finally {
      setIsSavingSettings(false)
    }
  }

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
      <Tabs defaultValue="whatsapp" className="space-y-6">
        <TabsList className="flex w-full overflow-x-auto sm:w-min">
          <TabsTrigger value="whatsapp" className="flex-shrink-0 gap-2 px-6">
            <Smartphone className="h-4 w-4" />
            {t("tabs.whatsapp")}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex-shrink-0 gap-2 px-6">
            <Bell className="h-4 w-4" />
            {t("tabs.notifications")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="whatsapp" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle>{t("whatsapp.card.title")}</CardTitle>
                <CardDescription>{t("whatsapp.card.description")}</CardDescription>
              </div>
              <Button
                type="button"
                onClick={() => setIsPairingOpen(true)}
                disabled={!companyId || !whatsappConfigured || isLoadingWhatsapp}
              >
                <Plus className="mr-2 h-4 w-4" />
                {t("whatsapp.card.addButton")}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {!whatsappConfigured && !isLoadingWhatsapp && (
                <p className="text-sm text-muted-foreground">
                  WhatsApp workers are not configured yet. Set REDIS_URL and WORKER_INTERNAL_TOKEN, then start
                  the worker with <code className="text-xs">npm run dev:infra</code> or{" "}
                  <code className="text-xs">npm run dev:worker</code>.
                </p>
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
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t("notifications.card.title")}
              </CardTitle>
              <CardDescription>{t("notifications.card.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoadingOverview ? (
                <LoadingNotificationSection />
              ) : loadError ? (
                <p className="text-sm text-destructive">{loadError}</p>
              ) : (
                <>
                  {(
                    [
                      ["emailNotifications", t("notifications.email.label"), t("notifications.email.description")],
                      ["newMessageAlerts", t("notifications.newMessage.label"), t("notifications.newMessage.description")],
                      ["dailyReports", t("notifications.dailyReports.label"), t("notifications.dailyReports.description")],
                    ] as const
                  ).map(([key, label, description]) => (
                    <div key={key} className="flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <Label htmlFor={key}>{label}</Label>
                        <p className="text-sm text-muted-foreground">{description}</p>
                      </div>
                      <Switch
                        id={key}
                        checked={settings?.[key] ?? defaultSettings[key]}
                        onCheckedChange={(checked) => handleSettingToggle(key, checked)}
                      />
                    </div>
                  ))}

                  <Button
                    type="button"
                    onClick={() => handlePersistSettings("toasts.updateSuccessNotifications")}
                    disabled={settings === null || isSavingSettings}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {t("notifications.save")}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
