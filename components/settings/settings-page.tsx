"use client"

import { useTranslations } from "next-intl"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import QRCode from "qrcode"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Bell, Plus, Save, Smartphone } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useUser } from "@/components/user-provider"
import {
    createWhatsappNumberFromSessionAction,
    createWhatsappSessionAction,
    deleteWhatsappNumberAction,
    getSettingsOverviewAction,
    updateCompanySettingsAction,
    updateWhatsappNumberAction,
} from "@/components/server-actions/settings"
import { WhatsAppNumberList } from "./whatsapp-number-list"
import { WhatsAppPairingDialog } from "./whatsapp-pairing-dialog"
import { WhatsAppEditDialog } from "./whatsapp-edit-dialog"
import { WhatsAppDeleteDialog } from "./whatsapp-delete-dialog"
import type { SettingsState, WhatsAppNumber, PairingPhase } from "./types"
import { defaultSettings } from "./types"

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

const emptyEditForm = {
    id: "",
    displayName: "",
    phoneNumber: "",
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
    const [deleteConfirmNumber, setDeleteConfirmNumber] = useState<WhatsAppNumber | null>(null)

    const pairingSocketRef = useRef<WebSocket | null>(null)
    const pairingPhaseRef = useRef<PairingPhase>("idle")
    const pairingSessionMetadataRef = useRef<{ sessionId: string; workerId: string; wsUrl: string } | null>(null)
    const [pairingPhaseState, setPairingPhaseState] = useState<PairingPhase>("idle")
    const [pairingMessage, setPairingMessage] = useState<string>("")
    const [pairingError, setPairingError] = useState<string | null>(null)
    const [qrImageDataUrl, setQrImageDataUrl] = useState<string>("")
    const [isPairingConnected, setIsPairingConnected] = useState(false)
    const [pairingDisplayName, setPairingDisplayName] = useState<string>("")

    const setPairingPhase = useCallback((nextPhase: PairingPhase) => {
        pairingPhaseRef.current = nextPhase
        setPairingPhaseState(nextPhase)
    }, [])

    const pairingPhase = pairingPhaseState

    // Helper function to generate default display name from phone number
    const generateDefaultDisplayName = useCallback((phoneNumber: string): string => {
        const digitsOnly = phoneNumber.replace(/\D/g, '')
        const lastFour = digitsOnly.slice(-4)
        return `WhatsApp ${lastFour}`
    }, [])

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
        setPairingDisplayName("")
        pairingSessionMetadataRef.current = null
    }, [closePairingSocket, setPairingPhase])

    const handleSuccessfulConnection = useCallback(
        async (phoneNumber: string, displayName: string) => {
            const sessionMetadata = pairingSessionMetadataRef.current
            if (!sessionMetadata) {
                console.error("Session metadata not available")
                return
            }

            const result = await createWhatsappNumberFromSessionAction({
                companyId: companyId!,
                sessionId: sessionMetadata.sessionId,
                workerId: sessionMetadata.workerId,
                wsUrl: sessionMetadata.wsUrl,
                phoneNumber,
                displayName,
                status: "connected",
            })

            if (result.success && result.data) {
                const whatsappNumber = result.data.whatsappNumber

                const normalized: WhatsAppNumber = {
                    id: whatsappNumber.id,
                    displayName: whatsappNumber.displayName,
                    phoneNumber: whatsappNumber.phoneNumber,
                    isConnected: true,
                    messagesThisMonth: 0,
                    createdAt: whatsappNumber.createdAt.toISOString(),
                    updatedAt: whatsappNumber.updatedAt.toISOString(),
                    lastSyncedAt: new Date().toISOString(),
                    wsUrl: whatsappNumber.wsUrl ?? null,
                    workerId: whatsappNumber.workerId ?? null,
                    remoteAuthKey: whatsappNumber.remoteAuthKey ?? null,
                }

                setLatestLinkedNumber(normalized)
                setWhatsappNumbers((previous) => {
                    const withoutCurrent = previous.filter((entry) => entry.id !== normalized.id)
                    return [normalized, ...withoutCurrent]
                })

                setPairingPhase("completed")
                setPairingMessage(t("whatsapp.pairing.messages.completed"))
                setPairingError(null)
                setIsPairingConnected(true)
                setQrImageDataUrl("")
                toast.success(t("toasts.whatsappLinked"))

                closePairingSocket()
            }
        },
        [companyId, closePairingSocket, setPairingPhase, t],
    )

    const handleStartPairing = useCallback(async () => {
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

        setPairingPhase("connecting")
        setPairingMessage(t("whatsapp.pairing.messages.connecting"))
        setPairingError(null)

        try {
            console.log("Starting pairing with companyId:", companyId)

            const sessionResponse = await createWhatsappSessionAction({
                companyId,
            })

            console.log("Session response:", sessionResponse)

            if (!sessionResponse.success || !sessionResponse.data) {
                toast.error(sessionResponse.error ?? "Failed to create WhatsApp session")
                setPairingPhase("error")
                setPairingError(sessionResponse.error ?? "Failed to create WhatsApp session")
                return
            }

            const { wsUrl, sessionId, workerId } = sessionResponse.data

            console.log("WhatsApp session created:", { sessionId, workerId, wsUrl })

            pairingSessionMetadataRef.current = { sessionId, workerId, wsUrl }

            let socket: WebSocket

            try {
                console.log("Connecting to WebSocket:", wsUrl)
                socket = new WebSocket(wsUrl)
            } catch (error) {
                console.error("Pairing socket initialization failed", error)
                const fallback = t("whatsapp.pairing.messages.connectionFailed")
                setPairingPhase("error")
                setPairingError(fallback)
                setPairingMessage(fallback)
                return
            }

            pairingSocketRef.current = socket
            setPairingPhase("waiting")
            setPairingMessage(t("whatsapp.pairing.messages.requesting"))

            socket.onopen = () => {
                console.log("WebSocket connection opened successfully")
                console.log("WebSocket readyState:", socket.readyState)
            }

            socket.onmessage = async (event) => {
                //console.log("WebSocket message received:", event.data, "Type:", typeof event.data)

                try {
                    let payload: any = null

                    if (event.data instanceof Blob) {
                        console.log("Received blob data, converting to base64")
                        console.log("Blob size:", event.data.size, "type:", event.data.type)

                        const dataUrl = await new Promise<string>((resolve, reject) => {
                            const reader = new FileReader()
                            reader.onloadend = () => {
                                if (typeof reader.result === "string") {
                                    console.log("FileReader converted blob successfully")
                                    resolve(reader.result)
                                } else {
                                    console.error("FileReader result is not a string:", reader.result)
                                    reject(new Error("Failed to convert blob to data URL"))
                                }
                            }
                            reader.onerror = (error) => {
                                console.error("FileReader error:", error)
                                reject(new Error("FileReader error"))
                            }
                            reader.readAsDataURL(event.data as Blob)
                        })

                        payload = {
                            event: "qr",
                            data: { dataUrl },
                        }
                        console.log("Converted blob to QR payload")
                    } else if (typeof event.data === "string") {
                        try {
                            payload = JSON.parse(event.data)
                        } catch (parseError) {
                            console.error("Failed to parse JSON payload:", parseError)
                            throw new Error("Invalid JSON payload")
                        }
                    }


                    if (!payload || typeof payload !== "object") {
                        throw new Error("Invalid payload")
                    }

                    if (payload.event === "qr") {

                        const qrDataString = payload.data?.dataUrl || payload.qr || payload.qrCode || payload.image || payload.data

                        if (qrDataString && typeof qrDataString === "string") {

                            try {
                                const dataUrl = await QRCode.toDataURL(qrDataString, {
                                    width: 400,
                                    margin: 1,
                                    color: {
                                        dark: "#000000",
                                        light: "#FFFFFF",
                                    },
                                })

                                setQrImageDataUrl(dataUrl)
                                setPairingPhase("waiting")
                                setPairingMessage(t("whatsapp.pairing.messages.scan"))
                                setPairingError(null)
                                return
                            } catch (qrError) {
                                console.error("Failed to generate QR code:", qrError)
                                setPairingPhase("error")
                                setPairingError("Failed to generate QR code")
                                setPairingMessage(t("whatsapp.pairing.messages.failed"))
                                return
                            }
                        } else {
                            console.log("QR event received but no valid data found in payload")
                        }
                    }

                    if (payload.event === "ready" && payload.data?.status === "connected") {
                        console.log("Ready event with connected status received")

                        const phoneNumber = payload.data?.phoneNumber || "Unknown"
                        const displayName = generateDefaultDisplayName(phoneNumber)

                        handleSuccessfulConnection(phoneNumber, displayName).catch((error) => {
                            console.error("Failed to create WhatsApp number:", error)
                        })

                        return
                    }

                    if (payload.event === "status" && payload.data?.status) {
                        const status = payload.data.status

                        if (status === "connected") {
                            const phoneNumber = payload.data?.phoneNumber || "Unknown"
                            const displayName = payload.data?.displayName || phoneNumber

                            handleSuccessfulConnection(phoneNumber, displayName).catch((error) => {
                                console.error("Failed to create WhatsApp number:", error)
                            })
                        } else if (status === "authenticated") {
                            setPairingPhase("scanned")
                            setPairingMessage(t("whatsapp.pairing.messages.scanned"))
                        } else if (status === "disconnected" || status === "auth_failure") {
                            setPairingPhase("error")
                            setPairingError(t("whatsapp.pairing.messages.failed"))
                        }
                        return
                    }

                    if (payload.event === "error") {
                        const fallback = t("whatsapp.pairing.messages.failed")
                        const message = payload.data?.message ?? fallback
                        setPairingError(message)
                        setPairingMessage(message)
                        setPairingPhase("error")
                        closePairingSocket()
                        return
                    }

                    if (payload.event === "message") {
                        console.log("Incoming WhatsApp message during pairing:", payload.data)
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

            socket.onerror = (error) => {
                console.error("WebSocket error:", error)
                const fallback = t("whatsapp.pairing.messages.connectionFailed")
                setPairingPhase("error")
                setPairingError(fallback)
                setPairingMessage(fallback)
            }

            socket.onclose = (event) => {
                console.log("WebSocket closed:", event.code, event.reason)
                if (pairingPhaseRef.current !== "completed" && pairingPhaseRef.current !== "idle") {
                    setPairingPhase("idle")
                    setPairingMessage(t("whatsapp.pairing.messages.sessionClosed"))
                }
            }
        } catch (error) {
            console.error("Failed to start pairing:", error)
            const fallback = t("whatsapp.pairing.messages.connectionFailed")
            setPairingPhase("error")
            setPairingError(fallback)
            setPairingMessage(fallback)
        }
    }, [closePairingSocket, companyId, resetPairingState, setPairingPhase, t, handleSuccessfulConnection, generateDefaultDisplayName, pairingDisplayName])

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
                    wsUrl: entry.wsUrl,
                    workerId: entry.workerId,
                    remoteAuthKey: entry.remoteAuthKey,
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
                            wsUrl: entry.wsUrl,
                            workerId: entry.workerId,
                            remoteAuthKey: entry.remoteAuthKey,
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

    const disconnectViaWebSocket = useCallback(async (number: WhatsAppNumber): Promise<boolean> => {
        if (!number.wsUrl) {
            console.warn("No websocket URL available for number:", number.id)
            return true
        }

        try {
            const socket = new WebSocket(number.wsUrl)

            return new Promise((resolve) => {
                const timeout = setTimeout(() => {
                    socket.close()
                    resolve(true)
                }, 5000)

                socket.onopen = () => {
                    try {
                        socket.send(
                            JSON.stringify({
                                type: "disconnect",
                                sessionId: number.remoteAuthKey,
                                workerId: number.workerId,
                            }),
                        )
                        clearTimeout(timeout)
                        setTimeout(() => {
                            socket.close()
                            resolve(true)
                        }, 1000)
                    } catch (error) {
                        console.error("Error sending disconnect message:", error)
                        clearTimeout(timeout)
                        socket.close()
                        resolve(true)
                    }
                }

                socket.onerror = () => {
                    clearTimeout(timeout)
                    socket.close()
                    resolve(true)
                }

                socket.onclose = () => {
                    clearTimeout(timeout)
                    resolve(true)
                }
            })
        } catch (error) {
            console.error("Error connecting to websocket for disconnect:", error)
            return true
        }
    }, [])

    const handleDeleteWhatsappNumber = async (number: WhatsAppNumber) => {
        setDeleteConfirmNumber(number)
    }

    const handleConfirmDelete = async () => {
        if (!deleteConfirmNumber) {
            return
        }

        const number = deleteConfirmNumber
        setDeleteConfirmNumber(null)
        setIsDeletingNumberId(number.id)

        try {
            await disconnectViaWebSocket(number)

            const response = await deleteWhatsappNumberAction({ companyId, id: number.id })

            if (!response.success || !response.data) {
                toast.error(response.error ?? t("toasts.removeWhatsappFailed"))
                return
            }

            // Remove the number from the list
            setWhatsappNumbers((previous) => previous.filter((entry) => entry.id !== number.id))

            // Clear latestLinkedNumber if it matches
            if (latestLinkedNumber?.id === number.id) {
                setLatestLinkedNumber(null)
            }

            if (isAddDialogOpen) {
                resetAddDialog()
            }
            if (isEditDialogOpen) {
                resetEditDialog()
            }

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
                            <WhatsAppNumberList
                                numbers={sortedWhatsappNumbers}
                                isLoading={isLoadingOverview}
                                loadError={loadError}
                                isDeletingNumberId={isDeletingNumberId}
                                onEdit={handleOpenEditNumber}
                                onDelete={handleDeleteWhatsappNumber}
                            />

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

            <WhatsAppPairingDialog
                open={isAddDialogOpen}
                onOpenChange={(open) => (open ? setIsAddDialogOpen(true) : resetAddDialog())}
                pairingPhase={pairingPhase}
                pairingMessage={pairingMessage}
                pairingError={pairingError}
                qrImageDataUrl={qrImageDataUrl}
                isPairingConnected={isPairingConnected}
                latestLinkedNumber={latestLinkedNumber}
                pairingDisplayName={pairingDisplayName}
                onPairingDisplayNameChange={setPairingDisplayName}
                onStartPairing={handleStartPairing}
                onCancelPairing={handleCancelPairing}
                onEdit={(number) => {
                    setEditForm({
                        id: number.id,
                        displayName: number.displayName,
                        phoneNumber: number.phoneNumber,
                    })
                    setIsAddDialogOpen(false)
                    setIsEditDialogOpen(true)
                }}
                onDelete={handleDeleteWhatsappNumber}
                isDeleting={isDeletingNumberId === latestLinkedNumber?.id}
            />

            <WhatsAppEditDialog
                open={isEditDialogOpen}
                onOpenChange={(open) => (open ? setIsEditDialogOpen(true) : resetEditDialog())}
                editForm={editForm}
                onEditFormChange={setEditForm}
                isSubmitting={isSubmittingNumber}
                isDeleting={isDeletingNumberId === editForm.id}
                onSave={handleUpdateWhatsappNumber}
                onRestart={() => {
                    resetEditDialog()
                    setIsAddDialogOpen(true)
                }}
                onDelete={() => {
                    const number = whatsappNumbers.find((n) => n.id === editForm.id)
                    if (number) {
                        handleDeleteWhatsappNumber(number)
                    }
                }}
            />

            <WhatsAppDeleteDialog
                number={deleteConfirmNumber}
                isDeleting={isDeletingNumberId === deleteConfirmNumber?.id}
                onOpenChange={(open) => !open && setDeleteConfirmNumber(null)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    )
}
