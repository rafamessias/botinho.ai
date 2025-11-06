"use client"

import { useTranslations } from "next-intl"
import { useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle, CheckCircle2, Edit, Loader2, Phone, QrCode, RefreshCw, Smartphone, Trash2 } from "lucide-react"
import { formatPhoneNumber, parseInternationalNumber } from "@/lib/phone-utils"
import type { PairingPhase, WhatsAppNumber } from "./types"

interface WhatsAppPairingDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    pairingPhase: PairingPhase
    pairingMessage: string
    pairingError: string | null
    qrImageDataUrl: string
    isPairingConnected: boolean
    latestLinkedNumber: WhatsAppNumber | null
    pairingDisplayName: string
    onPairingDisplayNameChange: (value: string) => void
    onStartPairing: () => void
    onCancelPairing: () => void
    onEdit: (number: WhatsAppNumber) => void
    onDelete: (number: WhatsAppNumber) => void
    isDeleting: boolean
}

const formatPhoneForDisplay = (phoneNumber: string): string => {
    const parsed = parseInternationalNumber(phoneNumber)
    if (parsed) {
        const formatted = formatPhoneNumber(parsed.localNumber, parsed.countryCode)
        return parsed.countryCode === 'BR' ? formatted : formatted
    }
    return formatPhoneNumber(phoneNumber.replace(/\D/g, ''), 'BR')
}

export const WhatsAppPairingDialog = ({
    open,
    onOpenChange,
    pairingPhase,
    pairingMessage,
    pairingError,
    qrImageDataUrl,
    isPairingConnected,
    latestLinkedNumber,
    pairingDisplayName,
    onPairingDisplayNameChange,
    onStartPairing,
    onCancelPairing,
    onEdit,
    onDelete,
    isDeleting,
}: WhatsAppPairingDialogProps) => {
    const t = useTranslations("Settings.page")
    const commonT = useTranslations("Common")

    const isPairingBusy = pairingPhase === "connecting" || pairingPhase === "waiting"

    const pairingPrimaryLabel = useCallback(() => {
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("whatsapp.dialog.title")}</DialogTitle>
                    <DialogDescription>{t("whatsapp.dialog.description")}</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="space-y-4 rounded-xl border border-dashed border-muted-foreground/40 p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold sm:text-base">{t("whatsapp.pairing.title")}</p>
                                    <p className="text-xs text-muted-foreground sm:text-sm">{t("whatsapp.pairing.description")}</p>
                                </div>
                            </div>
                            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                                {pairingPhase !== "idle" && pairingPhase !== "completed" ? (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={onCancelPairing}
                                        className="w-full text-muted-foreground hover:bg-muted hover:text-foreground sm:w-auto"
                                        aria-label={t("whatsapp.pairing.actions.cancelAria")}
                                    >
                                        {commonT("cancel")}
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onStartPairing}
                                        className="w-full sm:w-auto"
                                        disabled={isPairingBusy}
                                        aria-label={t("whatsapp.pairing.actions.startAria")}
                                    >
                                        {pairingPhase === "completed" ? (
                                            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
                                        ) : (
                                            <QrCode className="mr-2 h-4 w-4" aria-hidden="true" />
                                        )}
                                        {pairingPrimaryLabel()}
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
                            {qrImageDataUrl && (
                                <img
                                    src={qrImageDataUrl}
                                    alt={t("whatsapp.pairing.qrAlt")}
                                    className="h-48 w-48 rounded-xl border border-border bg-background p-3 shadow-sm"
                                />
                            )}
                        </div>
                        {pairingPhase === "scanned" && (
                            <div className="space-y-2">
                                <Label htmlFor="pairingDisplayName" className="text-sm font-medium">
                                    {t("dialogs.edit.displayNameLabel")}
                                </Label>
                                <Input
                                    id="pairingDisplayName"
                                    placeholder={t("dialogs.edit.displayNamePlaceholder")}
                                    value={pairingDisplayName}
                                    onChange={(event) => onPairingDisplayNameChange(event.target.value)}
                                />
                            </div>
                        )}
                    </div>
                    {isPairingConnected && latestLinkedNumber ? (
                        <div className="space-y-4 rounded-xl border border-muted bg-muted/30 p-6">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" aria-hidden="true" />
                                <div className="flex-1">
                                    <p className="text-base font-semibold text-foreground">{latestLinkedNumber.displayName}</p>
                                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                                        <span>{formatPhoneForDisplay(latestLinkedNumber.phoneNumber)}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onEdit(latestLinkedNumber)}
                                    className="flex-1"
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    {commonT("edit")}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onDelete(latestLinkedNumber)}
                                    disabled={isDeleting}
                                    className="flex-1 border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                >
                                    {isDeleting ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="mr-2 h-4 w-4" />
                                    )}
                                    {t("whatsapp.disconnect")}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-muted-foreground/30 bg-muted/30 p-4 text-center text-sm text-muted-foreground">
                            {t("whatsapp.pairing.latest.pending")}
                        </div>
                    )}
                </div>
                <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                        {isPairingConnected ? commonT("close") : commonT("cancel")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

