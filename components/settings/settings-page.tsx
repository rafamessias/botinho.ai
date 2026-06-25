"use client"

import { useCallback, useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Bell, Save, Smartphone } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useUser } from "@/components/user-provider"
import { getSettingsOverviewAction, updateCompanySettingsAction } from "@/components/server-actions/settings"
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

export default function SettingsPage() {
    const { user, loading: isUserLoading } = useUser()
    const companyId = user?.defaultCompanyId ? String(user.defaultCompanyId) : undefined
    const t = useTranslations("Settings.page")

    const [settings, setSettings] = useState<SettingsState | null>(null)
    const [loadError, setLoadError] = useState<string | null>(null)
    const [isLoadingOverview, setIsLoadingOverview] = useState(true)
    const [isSavingSettings, setIsSavingSettings] = useState(false)

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

    useEffect(() => {
        void loadSettings()
    }, [loadSettings])

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
                        <CardHeader>
                            <CardTitle>{t("whatsapp.card.title")}</CardTitle>
                            <CardDescription>{t("whatsapp.empty.description")}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                WhatsApp integration is not configured yet. Messaging provider setup is coming soon.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t("whatsapp.autoReply.label")}</CardTitle>
                            <CardDescription>{t("whatsapp.autoReply.description")}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="autoReplySwitch">{t("whatsapp.autoReply.label")}</Label>
                                <Switch
                                    id="autoReplySwitch"
                                    checked={settings?.autoReply ?? defaultSettings.autoReply}
                                    disabled={isLoadingOverview || settings === null}
                                    onCheckedChange={(checked) => handleSettingToggle("autoReply", checked)}
                                />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="smsFallbackSwitch">SMS fallback</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Allow fallback to SMS when WhatsApp delivery fails.
                                    </p>
                                </div>
                                <Switch
                                    id="smsFallbackSwitch"
                                    checked={settings?.smsFallbackEnabled ?? false}
                                    disabled={isLoadingOverview || settings === null}
                                    onCheckedChange={(checked) => handleSettingToggle("smsFallbackEnabled", checked)}
                                />
                            </div>

                            <Button
                                type="button"
                                onClick={() => handlePersistSettings("toasts.updateSuccessWhatsapp")}
                                disabled={isLoadingOverview || settings === null || isSavingSettings}
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {t("whatsapp.autoReply.save")}
                            </Button>
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
        </div>
    )
}
