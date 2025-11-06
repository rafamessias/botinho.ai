"use client"

import { useTranslations } from "next-intl"
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
import { CheckCircle2, Loader2, Phone, RefreshCw, Trash2 } from "lucide-react"
import { formatPhoneNumber, parseInternationalNumber } from "@/lib/phone-utils"
import type { WhatsAppNumber } from "./types"

interface WhatsAppEditDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    editForm: {
        id: string
        displayName: string
        phoneNumber: string
    }
    onEditFormChange: (form: { id: string; displayName: string; phoneNumber: string }) => void
    isSubmitting: boolean
    isDeleting: boolean
    onSave: () => void
    onRestart: () => void
    onDelete: () => void
}

const formatPhoneForDisplay = (phoneNumber: string): string => {
    const parsed = parseInternationalNumber(phoneNumber)
    if (parsed) {
        const formatted = formatPhoneNumber(parsed.localNumber, parsed.countryCode)
        return parsed.countryCode === 'BR' ? formatted : formatted
    }
    return formatPhoneNumber(phoneNumber.replace(/\D/g, ''), 'BR')
}

export const WhatsAppEditDialog = ({
    open,
    onOpenChange,
    editForm,
    onEditFormChange,
    isSubmitting,
    isDeleting,
    onSave,
    onRestart,
    onDelete,
}: WhatsAppEditDialogProps) => {
    const t = useTranslations("Settings.page")
    const commonT = useTranslations("Common")

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("dialogs.edit.title")}</DialogTitle>
                    <DialogDescription>{t("dialogs.edit.description")}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {editForm.id ? (
                        <div className="space-y-4 rounded-xl border border-muted bg-muted/30 p-6">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" aria-hidden="true" />
                                <div className="flex-1">
                                    <p className="text-base font-semibold text-foreground">{editForm.displayName}</p>
                                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                                        <span>{formatPhoneForDisplay(editForm.phoneNumber)}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="editDisplayName" className="text-sm font-medium">
                                    {t("dialogs.edit.displayNameLabel")}
                                </Label>
                                <Input
                                    id="editDisplayName"
                                    placeholder={t("dialogs.edit.displayNamePlaceholder")}
                                    value={editForm.displayName}
                                    onChange={(event) =>
                                        onEditFormChange({
                                            ...editForm,
                                            displayName: event.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={onRestart}
                                    className="flex-1"
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    {t("whatsapp.pairing.button.restart")}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={onDelete}
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
                        {commonT("cancel")}
                    </Button>
                    <Button
                        type="button"
                        onClick={onSave}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
                        disabled={isSubmitting}
                    >
                        {t("dialogs.edit.save")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

