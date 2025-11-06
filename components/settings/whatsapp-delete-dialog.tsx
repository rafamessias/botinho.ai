"use client"

import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { WhatsAppNumber } from "./types"

interface WhatsAppDeleteDialogProps {
    number: WhatsAppNumber | null
    isDeleting: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
}

export const WhatsAppDeleteDialog = ({
    number,
    isDeleting,
    onOpenChange,
    onConfirm,
}: WhatsAppDeleteDialogProps) => {
    const t = useTranslations("Settings.page")
    const commonT = useTranslations("Common")

    return (
        <AlertDialog open={!!number} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{commonT("delete")}</AlertDialogTitle>
                    <AlertDialogDescription>{number && t("dialogs.delete.confirm")}</AlertDialogDescription>
                </AlertDialogHeader>
                {number && (
                    <div className="space-y-4">
                        <div className="rounded-lg border border-border bg-muted/30 p-3">
                            <p className="font-medium">{number.displayName}</p>
                            <p className="text-sm text-muted-foreground">{number.phoneNumber}</p>
                        </div>
                    </div>
                )}
                <AlertDialogFooter>
                    <AlertDialogCancel>{commonT("cancel")}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {commonT("delete")}
                            </>
                        ) : (
                            commonT("delete")
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

