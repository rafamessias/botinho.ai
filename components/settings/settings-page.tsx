"use client"

import { useTranslations } from "next-intl"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { AlertCircle, Bell, CheckCircle2, Edit, Loader2, Phone, Plus, QrCode, RefreshCw, Save, Smartphone, Trash2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useUser } from "@/components/user-provider"
import { cn } from "@/lib/utils"
import {
    deleteWhatsappNumberAction,
    getSettingsOverviewAction,
    updateCompanySettingsAction,
    updateWhatsappNumberAction,
} from "@/components/server-actions/settings"

type SettingsState = {
    emailNotifications: boolean
    newMessageAlerts: boolean
    dailyReports: boolean
    autoReply: boolean
}

type WhatsAppNumber = {
    id: string
    displayName: string
    phoneNumber: string
    isConnected: boolean
    messagesThisMonth: number
    createdAt: string
    updatedAt: string
    lastSyncedAt: string | null
}

type PairingPhase = "idle" | "connecting" | "waiting" | "scanned" | "completed" | "error"

const defaultSettings: SettingsState = {
    emailNotifications: true,
    newMessageAlerts: true,
    dailyReports: false,
    autoReply: true,
}

const emptyEditForm = {
    id: "",
    displayName: "",
    phoneNumber: "",
}

const LoadingWhatsappSection = () => {
    return (
        <div className="space-y-4">
            <div className="space-y-4 rounded-xl border border-border bg-muted/30 p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32 bg-muted-foreground/20" />
                        <Skeleton className="h-4 w-56 bg-muted-foreground/15" />
                    </div>
                    <Skeleton className="h-10 w-36 rounded-full bg-muted-foreground/20" />
                </div>
                <div className="space-y-3">
                    <Skeleton className="h-12 w-full rounded-xl bg-muted-foreground/20" />
                    <Skeleton className="h-12 w-full rounded-xl bg-muted-foreground/20" />
                </div>
            </div>
        </div>
    )
}

const LoadingNotificationSection = () => {
    return (
        <div className="space-y-4 rounded-xl border border-border bg-muted/30 p-6 shadow-sm">
            {[0, 1, 2].map((item) => (
                <div key={item} className="space-y-3">
                    <Skeleton className="h-4 w-48 bg-muted-foreground/20" />
                    <Skeleton className="h-3 w-full bg-muted-foreground/15" />
                </div>
            ))}
            <div className="pt-2">
                <Skeleton className="h-10 w-40 rounded-full bg-muted-foreground/20" />
            </div>
        </div>
    )
}

export default function SettingsPage() {
    const { user } = useUser()
    const companyId = user?.defaultCompanyId ?? undefined

    const t = useTranslations("Settings.page")
    const commonT = useTranslations("Common")

    const [settings, setSettings] = useState<SettingsState | null>(null)
    const [whatsappNumbers, setWhatsappNumbers] = useState<WhatsAppNumber[]>([])
    const [loadError, setLoadError] = useState<string | null>(null)
    const [isLoadingOverview, setIsLoadingOverview] = useState(true)

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editForm, setEditForm] = useState(emptyEditForm)
    const [latestLinkedNumber, setLatestLinkedNumber] = useState<WhatsAppNumber | null>(null)

    const [isDeletingNumberId, setIsDeletingNumberId] = useState<string | null>(null)
    const [isSubmittingNumber, setIsSubmittingNumber] = useState(false)
    const [isSavingSettings, setIsSavingSettings] = useState(false)

    const pairingSocketRef = useRef<WebSocket | null>(null)
    const pairingPhaseRef = useRef<PairingPhase>("idle")
    const [pairingPhaseState, setPairingPhaseState] = useState<PairingPhase>("idle")
    const [pairingMessage, setPairingMessage] = useState<string>("")
    const [pairingError, setPairingError] = useState<string | null>(null)
    const [qrImageDataUrl, setQrImageDataUrl] = useState<string>("")
    const [isPairingConnected, setIsPairingConnected] = useState(false)

    const setPairingPhase = useCallback((nextPhase: PairingPhase) => {
        pairingPhaseRef.current = nextPhase
        setPairingPhaseState(nextPhase)
    }, [])

    const pairingPhase = pairingPhaseState

    const closePairingSocket = useCallback(() => {
        if (pairingSocketRef.current && pairingSocketRef.current.readyState === WebSocket.OPEN) {
            pairingSocketRef.current.close()
        }

        pairingSocketRef.current = null
    }, [])

    const resetPairingState = useCallback(() => {
        closePairingSocket()
        setPairingPhase("idle")
        setPairingMessage("")
        setPairingError(null)
        setQrImageDataUrl("")
        setIsPairingConnected(false)
    }, [closePairingSocket, setPairingPhase])

    const handleStartPairing = useCallback(() => {
        if (!companyId) {
            toast.error(t("toasts.selectCompany"))
            return
        }

        if (typeof window === "undefined") {
            toast.error(t("toasts.browserOnly"))
            return
        }

        resetPairingState()
        setLatestLinkedNumber(null)

        const resolveSocketUrl = () => {
            const configured = process.env.NEXT_PUBLIC_WS_SERVER_URL?.trim()

            if (configured) {
                if (configured.startsWith("ws://") || configured.startsWith("wss://")) {
                    return configured
                }

                if (configured.startsWith("http://") || configured.startsWith("https://")) {
                    return configured.replace(/^http/, "ws").replace(/^https/, "wss")
                }

                return `ws://${configured.replace(/^\/\//, "")}`
            }

            const isHttps = window.location.protocol === "https:"
            const defaultPort = process.env.NEXT_PUBLIC_WS_SERVER_PORT ?? "3100"
            return `${isHttps ? "wss" : "ws"}://${window.location.hostname}:${defaultPort}`
        }

        const socket = new WebSocket(resolveSocketUrl())

        pairingSocketRef.current = socket
        setPairingPhase("connecting")
        setPairingMessage(t("whatsapp.pairing.messages.connecting"))
        setPairingError(null)

        socket.onopen = () => {
            setPairingPhase("waiting")
            setPairingMessage(t("whatsapp.pairing.messages.requesting"))
            socket.send(
                JSON.stringify({
                    type: "server",
                    step: 0,
                    companyId,
                }),
            )
        }

        socket.onmessage = (event) => {
            try {
                const payload = typeof event.data === "string" ? JSON.parse(event.data) : null

                if (!payload || typeof payload !== "object") {
                    throw new Error("Invalid payload")
                }

                if (typeof payload.code === "number" && payload.code !== 0) {
                    const fallback = t("whatsapp.pairing.messages.failed")
                    const message = payload.msg ?? fallback
                    setPairingError(message)
                    setPairingMessage(message)
                    setPairingPhase("error")
                    return
                }

                const step = payload?.data?.step

                if (payload?.data?.whatsappQr) {
                    setQrImageDataUrl(payload.data.whatsappQr)
                    setPairingPhase("waiting")
                    setPairingMessage(t("whatsapp.pairing.messages.scan"))
                    setPairingError(null)
                    return
                }

                if (step === 1) {
                    setPairingPhase("scanned")
                    setPairingMessage(t("whatsapp.pairing.messages.scanned"))
                    return
                }

                if (step === 2) {
                    const record = payload.data?.whatsappNumber

                    if (record) {
                        const normalized: WhatsAppNumber = {
                            id: record.id,
                            displayName: record.displayName,
                            phoneNumber: record.phoneNumber,
                            isConnected: record.isConnected ?? true,
                            messagesThisMonth: record.messagesThisMonth ?? 0,
                            createdAt:
                                typeof record.createdAt === "string"
                                    ? record.createdAt
                                    : new Date(record.createdAt).toISOString(),
                            updatedAt:
                                typeof record.updatedAt === "string"
                                    ? record.updatedAt
                                    : new Date(record.updatedAt).toISOString(),
                            lastSyncedAt:
                                record.lastSyncedAt === null
                                    ? null
                                    : typeof record.lastSyncedAt === "string"
                                        ? record.lastSyncedAt
                                        : new Date(record.lastSyncedAt).toISOString(),
                        }

                        setLatestLinkedNumber(normalized)
                        setWhatsappNumbers((previous) => {
                            const withoutCurrent = previous.filter((entry) => entry.id !== normalized.id)
                            return [normalized, ...withoutCurrent]
                        })
                    }

                    setPairingPhase("completed")
                    setPairingMessage(t("whatsapp.pairing.messages.completed"))
                    setPairingError(null)
                    setIsPairingConnected(true)
                    setQrImageDataUrl("")
                    toast.success(t("toasts.whatsappLinked"))

                    closePairingSocket()
                }
            } catch (error) {
                console.error("Pairing message error", error)
                const fallback = t("whatsapp.pairing.messages.unexpected")
                setPairingError(fallback)
                setPairingMessage(fallback)
                setPairingPhase("error")
                closePairingSocket()
            }
        }

        socket.onerror = () => {
            const fallback = t("whatsapp.pairing.messages.connectionFailed")
            setPairingPhase("error")
            setPairingError(fallback)
            setPairingMessage(fallback)
        }

        socket.onclose = () => {
            if (pairingPhaseRef.current !== "completed" && pairingPhaseRef.current !== "idle") {
                setPairingPhase("idle")
                setPairingMessage(t("whatsapp.pairing.messages.sessionClosed"))
            }
        }
    }, [closePairingSocket, companyId, resetPairingState, setPairingPhase, t])

    const handleCancelPairing = useCallback(() => {
        resetPairingState()
        setPairingMessage(t("whatsapp.pairing.messages.cancelled"))
        setPairingPhase("idle")
    }, [resetPairingState, setPairingPhase, t])

    useEffect(() => {
        let isMounted = true

        const loadSettings = async () => {
            setIsLoadingOverview(true)
            setLoadError(null)

            try {
                const response = await getSettingsOverviewAction(companyId ? { companyId } : undefined)

                if (!isMounted) {
                    return
                }

                if (!response.success || !response.data) {
                    setLoadError(response.error ?? t("load.unable"))
                    setSettings(defaultSettings)
                    setWhatsappNumbers([])
                    setIsLoadingOverview(false)
                    return
                }

                const normalizedNumbers: WhatsAppNumber[] = response.data.whatsappNumbers.map((entry) => ({
                    id: entry.id,
                    displayName: entry.displayName,
                    phoneNumber: entry.phoneNumber,
                    isConnected: entry.isConnected,
                    messagesThisMonth: entry.messagesThisMonth,
                    createdAt: typeof entry.createdAt === "string" ? entry.createdAt : entry.createdAt.toISOString(),
                    updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : entry.updatedAt.toISOString(),
                    lastSyncedAt:
                        entry.lastSyncedAt === null
                            ? null
                            : typeof entry.lastSyncedAt === "string"
                                ? entry.lastSyncedAt
                                : entry.lastSyncedAt.toISOString(),
                }))

                setSettings(response.data.settings)
                setWhatsappNumbers(normalizedNumbers)
            } catch (error) {
                console.error("Load settings error:", error)
                if (isMounted) {
                    setLoadError(t("load.unexpected"))
                    setSettings(defaultSettings)
                    setWhatsappNumbers([])
                }
            } finally {
                if (isMounted) {
                    setIsLoadingOverview(false)
                }
            }
        }

        loadSettings()

        return () => {
            isMounted = false
        }
    }, [companyId, t])

    useEffect(() => {
        return () => {
            resetPairingState()
        }
    }, [resetPairingState])

    const sortedWhatsappNumbers = useMemo(() => {
        return [...whatsappNumbers].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }, [whatsappNumbers])

    const pairingPrimaryLabel = useMemo(() => {
        if (pairingPhase === "connecting" || pairingPhase === "waiting") {
            return t("whatsapp.pairing.button.preparing")
        }

        if (pairingPhase === "scanned") {
            return t("whatsapp.pairing.button.waiting")
        }

        if (pairingPhase === "completed") {
            return t("whatsapp.pairing.button.restart")
        }

        if (pairingPhase === "error") {
            return t("whatsapp.pairing.button.retry")
        }

        return t("whatsapp.pairing.button.start")
    }, [pairingPhase, t])

    const isPairingBusy = useMemo(() => pairingPhase === "connecting" || pairingPhase === "waiting", [pairingPhase])

    const handleSettingToggle = (key: keyof SettingsState, value: boolean) => {
        setSettings((previous) => {
            if (!previous) {
                return previous
            }

            return {
                ...previous,
                [key]: value,
            }
        })
    }

    const handlePersistSettings = async (successKey: string) => {
        if (!settings) {
            toast.error(t("toasts.settingsNotReady"))
            return
        }

        setIsSavingSettings(true)

        try {
            const response = await updateCompanySettingsAction({
                companyId,
                emailNotifications: settings.emailNotifications,
                newMessageAlerts: settings.newMessageAlerts,
                dailyReports: settings.dailyReports,
                autoReply: settings.autoReply,
            })

            if (!response.success || !response.data) {
                toast.error(response.error ?? t("toasts.updateFailed"))
                return
            }

            const updated = response.data.settings
            setSettings({
                emailNotifications: updated.emailNotifications,
                newMessageAlerts: updated.newMessageAlerts,
                dailyReports: updated.dailyReports,
                autoReply: updated.autoReply,
            })

            toast.success(t(successKey))
        } catch (error) {
            console.error("Update settings error:", error)
            toast.error(t("toasts.unableToUpdate"))
        } finally {
            setIsSavingSettings(false)
        }
    }

    const resetAddDialog = () => {
        setIsAddDialogOpen(false)
        resetPairingState()
        setIsPairingConnected(false)
    }

    const resetEditDialog = () => {
        setEditForm(emptyEditForm)
        setIsEditDialogOpen(false)
    }

    const handleOpenEditNumber = (number: WhatsAppNumber) => {
        setEditForm({
            id: number.id,
            displayName: number.displayName,
            phoneNumber: number.phoneNumber,
        })
        setIsEditDialogOpen(true)
    }

    const handleUpdateWhatsappNumber = async () => {
        const displayName = editForm.displayName.trim()
        const phoneNumber = editForm.phoneNumber.trim()

        if (!editForm.id) {
            toast.error(t("toasts.selectNumber"))
            return
        }

        if (!displayName || !phoneNumber) {
            toast.error(t("toasts.fillNameAndPhone"))
            return
        }

        setIsSubmittingNumber(true)

        try {
            const response = await updateWhatsappNumberAction({
                companyId,
                id: editForm.id,
                displayName,
                phoneNumber,
            })

            if (!response.success || !response.data) {
                toast.error(response.error ?? t("toasts.updateWhatsappFailed"))
                return
            }

            const updated = response.data.whatsappNumber
            setWhatsappNumbers((previous) =>
                previous.map((entry) =>
                    entry.id === updated.id
                        ? {
                            id: updated.id,
                            displayName: updated.displayName,
                            phoneNumber: updated.phoneNumber,
                            isConnected: updated.isConnected,
                            messagesThisMonth: updated.messagesThisMonth,
                            createdAt:
                                typeof updated.createdAt === "string"
                                    ? updated.createdAt
                                    : updated.createdAt.toISOString(),
                            updatedAt:
                                typeof updated.updatedAt === "string"
                                    ? updated.updatedAt
                                    : updated.updatedAt.toISOString(),
                            lastSyncedAt:
                                updated.lastSyncedAt === null
                                    ? null
                                    : typeof updated.lastSyncedAt === "string"
                                        ? updated.lastSyncedAt
                                        : updated.lastSyncedAt.toISOString(),
                        }
                        : entry,
                ),
            )

            toast.success(t("toasts.updateWhatsappSuccess"))
            resetEditDialog()
        } catch (error) {
            console.error("Update WhatsApp number error:", error)
            toast.error(t("toasts.unexpectedUpdateWhatsapp"))
        } finally {
            setIsSubmittingNumber(false)
        }
    }

    const handleDeleteWhatsappNumber = async (id: string) => {
        setIsDeletingNumberId(id)

        try {
            const response = await deleteWhatsappNumberAction({ companyId, id })

            if (!response.success) {
                toast.error(response.error ?? t("toasts.removeWhatsappFailed"))
                return
            }

            setWhatsappNumbers((previous) => previous.filter((entry) => entry.id !== id))
            toast.success(t("toasts.removeWhatsappSuccess"))
        } catch (error) {
            console.error("Delete WhatsApp number error:", error)
            toast.error(t("toasts.unexpectedRemoveWhatsapp"))
        } finally {
            setIsDeletingNumberId(null)
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
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Smartphone className="h-5 w-5" />
                                        {t("whatsapp.card.title")}
                                    </CardTitle>
                                    <CardDescription>{t("whatsapp.card.description")}</CardDescription>
                                </div>
                                <Button
                                    onClick={() => {
                                        resetPairingState()
                                        setAddForm(emptyAddForm)
                                        setIsPairingConnected(false)
                                        setIsAddDialogOpen(true)
                                    }}
                                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    {t("whatsapp.card.addButton")}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isLoadingOverview ? (
                                <LoadingWhatsappSection />
                            ) : loadError ? (
                                <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                                    {loadError}
                                </div>
                            ) : sortedWhatsappNumbers.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-muted-foreground/30 p-6 text-center">
                                    <p className="text-sm text-muted-foreground">{t("whatsapp.empty.title")}</p>
                                    <p className="text-sm text-muted-foreground">{t("whatsapp.empty.description")}</p>
                                </div>
                            ) : (
                                sortedWhatsappNumbers.map((number) => (
                                    <div
                                        key={number.id}
                                        className={cn(
                                            "space-y-4 rounded-xl border p-4 transition-colors",
                                            number.isConnected ? "border-primary/20 bg-primary/5" : "border-border bg-muted/50",
                                        )}
                                    >
                                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                                                <div
                                                    className={cn(
                                                        "flex h-12 w-12 items-center justify-center rounded-full",
                                                        number.isConnected ? "status-connected" : "status-disconnected",
                                                    )}
                                                >
                                                    <Smartphone className="h-5 w-5" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="heading-secondary text-base">{number.displayName}</p>
                                                    <p className="body-secondary flex items-center gap-1 text-sm">
                                                        <Phone className="h-3 w-3" aria-hidden="true" />
                                                        <span>{number.phoneNumber}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-3 md:items-end">
                                                <div className="flex flex-col items-start gap-2 text-sm md:items-end">
                                                    <span
                                                        className={cn(
                                                            "font-medium",
                                                            number.isConnected ? "text-primary" : "text-muted-foreground",
                                                        )}
                                                    >
                                                        {number.isConnected
                                                            ? t("whatsapp.status.connected")
                                                            : t("whatsapp.status.disconnected")}
                                                    </span>
                                                    {number.isConnected && (
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <span>
                                                                {t("whatsapp.messages.messagesThisMonth", {
                                                                    count: number.messagesThisMonth,
                                                                })}
                                                            </span>
                                                            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" aria-hidden="true" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 md:justify-end">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleOpenEditNumber(number)}
                                                        className="w-full text-muted-foreground hover:bg-muted/40 hover:text-foreground md:w-auto"
                                                        aria-label={t("whatsapp.actions.editAria", { name: number.displayName })}
                                                    >
                                                        <Edit className="h-4 w-4" aria-hidden="true" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteWhatsappNumber(number.id)}
                                                        className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive/80 md:w-auto"
                                                        aria-label={t("whatsapp.actions.removeAria", { name: number.displayName })}
                                                        disabled={isDeletingNumberId === number.id}
                                                    >
                                                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        {!number.isConnected && (
                                            <div className="flex w-full items-center justify-center sm:justify-end">
                                                <Button size="sm" variant="outline" className="w-full sm:w-auto">
                                                    {t("whatsapp.actions.connect")}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}

                            <Separator className="my-6" />

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="autoReplySwitch">{t("whatsapp.autoReply.label")}</Label>
                                        <p className="text-sm text-muted-foreground">{t("whatsapp.autoReply.description")}</p>
                                    </div>
                                    <Switch
                                        id="autoReplySwitch"
                                        checked={settings?.autoReply ?? defaultSettings.autoReply}
                                        disabled={isLoadingOverview || settings === null}
                                        onCheckedChange={(checked) => handleSettingToggle("autoReply", checked)}
                                        aria-label={t("whatsapp.autoReply.aria")}
                                    />
                                </div>
                            </div>

                            <Button
                                type="button"
                                onClick={() => handlePersistSettings("toasts.updateSuccessWhatsapp")}
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                                disabled={isLoadingOverview || settings === null || isSavingSettings}
                            >
                                <Save className="mr-2 h-4 w-4" aria-hidden="true" />
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
                                <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                                    {loadError}
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="emailNotificationsSwitch">{t("notifications.email.label")}</Label>
                                            <p className="text-sm text-muted-foreground">{t("notifications.email.description")}</p>
                                        </div>
                                        <Switch
                                            id="emailNotificationsSwitch"
                                            checked={settings?.emailNotifications ?? defaultSettings.emailNotifications}
                                            disabled={settings === null}
                                            onCheckedChange={(checked) => handleSettingToggle("emailNotifications", checked)}
                                            aria-label={t("notifications.email.aria")}
                                        />
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="newMessageAlertsSwitch">{t("notifications.newMessage.label")}</Label>
                                            <p className="text-sm text-muted-foreground">{t("notifications.newMessage.description")}</p>
                                        </div>
                                        <Switch
                                            id="newMessageAlertsSwitch"
                                            checked={settings?.newMessageAlerts ?? defaultSettings.newMessageAlerts}
                                            disabled={settings === null}
                                            onCheckedChange={(checked) => handleSettingToggle("newMessageAlerts", checked)}
                                            aria-label={t("notifications.newMessage.aria")}
                                        />
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="dailyReportsSwitch">{t("notifications.dailyReports.label")}</Label>
                                            <p className="text-sm text-muted-foreground">{t("notifications.dailyReports.description")}</p>
                                        </div>
                                        <Switch
                                            id="dailyReportsSwitch"
                                            checked={settings?.dailyReports ?? defaultSettings.dailyReports}
                                            disabled={settings === null}
                                            onCheckedChange={(checked) => handleSettingToggle("dailyReports", checked)}
                                            aria-label={t("notifications.dailyReports.aria")}
                                        />
                                    </div>

                                    <Button
                                        type="button"
                                        onClick={() => handlePersistSettings("toasts.updateSuccessNotifications")}
                                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                                        disabled={settings === null || isSavingSettings}
                                    >
                                        <Save className="mr-2 h-4 w-4" aria-hidden="true" />
                                        {t("notifications.save")}
                                    </Button>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Dialog open={isAddDialogOpen} onOpenChange={(open) => (open ? setIsAddDialogOpen(true) : resetAddDialog())}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("whatsapp.dialog.title")}</DialogTitle>
                        <DialogDescription>{t("whatsapp.dialog.description")}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="space-y-4 rounded-xl border border-dashed border-muted-foreground/40 p-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <QrCode className="h-5 w-5" aria-hidden="true" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold sm:text-base">{t("whatsapp.pairing.title")}</p>
                                        <p className="text-xs text-muted-foreground sm:text-sm">{t("whatsapp.pairing.description")}</p>
                                    </div>
                                </div>
                                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleStartPairing}
                                        className="w-full sm:w-auto"
                                        disabled={isPairingBusy}
                                        aria-label={t("whatsapp.pairing.actions.startAria")}
                                    >
                                        {isPairingBusy ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                                        ) : pairingPhase === "completed" ? (
                                            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
                                        ) : (
                                            <QrCode className="mr-2 h-4 w-4" aria-hidden="true" />
                                        )}
                                        {pairingPrimaryLabel}
                                    </Button>
                                    {pairingPhase !== "idle" && pairingPhase !== "completed" && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={handleCancelPairing}
                                            className="w-full text-muted-foreground hover:bg-muted/50 sm:w-auto"
                                            aria-label={t("whatsapp.pairing.actions.cancelAria")}
                                        >
                                            {commonT("cancel")}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {pairingMessage && (
                                <div className="flex items-start gap-2 rounded-lg bg-muted/40 p-3 text-sm" aria-live="polite">
                                    {pairingPhase === "completed" ? (
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" aria-hidden="true" />
                                    ) : pairingPhase === "error" ? (
                                        <AlertCircle className="mt-0.5 h-4 w-4 text-destructive" aria-hidden="true" />
                                    ) : pairingPhase === "scanned" ? (
                                        <Smartphone className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
                                    ) : (
                                        <Loader2 className="mt-0.5 h-4 w-4 animate-spin text-muted-foreground" aria-hidden="true" />
                                    )}
                                    <span className="text-muted-foreground">{pairingMessage}</span>
                                </div>
                            )}

                            {pairingError && (
                                <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                                    <AlertCircle className="mt-0.5 h-4 w-4" aria-hidden="true" />
                                    <span>{pairingError}</span>
                                </div>
                            )}

                            <div className="flex flex-col items-center gap-4">
                                {qrImageDataUrl ? (
                                    <img
                                        src={qrImageDataUrl}
                                        alt={t("whatsapp.pairing.qrAlt")}
                                        className="h-48 w-48 rounded-xl border border-border bg-background p-3 shadow-sm"
                                    />
                                ) : (
                                    <div className="flex h-48 w-48 items-center justify-center rounded-xl border border-dashed border-muted-foreground/30 bg-muted/30 p-4 text-center text-xs text-muted-foreground sm:text-sm">
                                        {pairingPhase === "connecting"
                                            ? t("whatsapp.pairing.messages.connecting")
                                            : pairingPhase === "scanned"
                                                ? t("whatsapp.pairing.messages.scanned")
                                                : t("whatsapp.pairing.messages.idle")}
                                    </div>
                                )}
                            </div>
                        </div>
                        {latestLinkedNumber ? (
                            <div className="space-y-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">{t("whatsapp.pairing.latest.title")}</p>
                                        <p className="text-xs text-muted-foreground">{t("whatsapp.pairing.latest.description")}</p>
                                    </div>
                                </div>
                                <div className="space-y-2 rounded-lg bg-background p-3 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">{t("whatsapp.pairing.latest.label")}</span>
                                        <span className="font-medium text-foreground">{latestLinkedNumber.displayName}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">{t("whatsapp.pairing.latest.number")}</span>
                                        <span className="font-medium text-foreground">{latestLinkedNumber.phoneNumber}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-muted-foreground/30 bg-muted/30 p-4 text-center text-sm text-muted-foreground">
                                {t("whatsapp.pairing.latest.pending")}
                            </div>
                        )}
                    </div>
                    <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                        <Button type="button" variant="outline" onClick={resetAddDialog} className="w-full sm:w-auto">
                            {isPairingConnected ? commonT("close") : commonT("cancel")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditDialogOpen} onOpenChange={(open) => (open ? setIsEditDialogOpen(true) : resetEditDialog())}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("dialogs.edit.title")}</DialogTitle>
                        <DialogDescription>{t("dialogs.edit.description")}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="editDisplayName">{t("dialogs.edit.displayNameLabel")}</Label>
                            <Input
                                id="editDisplayName"
                                placeholder={t("dialogs.edit.displayNamePlaceholder")}
                                value={editForm.displayName}
                                onChange={(event) => setEditForm((previous) => ({ ...previous, displayName: event.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="editPhoneNumber">{t("dialogs.edit.phoneLabel")}</Label>
                            <Input
                                id="editPhoneNumber"
                                placeholder={t("dialogs.edit.phonePlaceholder")}
                                value={editForm.phoneNumber}
                                onChange={(event) => setEditForm((previous) => ({ ...previous, phoneNumber: event.target.value }))}
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                        <Button type="button" variant="outline" onClick={resetEditDialog} className="w-full sm:w-auto">
                            {commonT("cancel")}
                        </Button>
                        <Button
                            type="button"
                            onClick={handleUpdateWhatsappNumber}
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
                            disabled={isSubmittingNumber}
                        >
                            {t("dialogs.edit.save")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}


