"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Edit, Phone, Smartphone, Trash2 } from "lucide-react"
import type { WhatsAppNumber } from "./types"

interface WhatsAppNumberCardProps {
    number: WhatsAppNumber
    onEdit: (number: WhatsAppNumber) => void
    onDelete: (number: WhatsAppNumber) => void
    isDeleting: boolean
}

export const WhatsAppNumberCard = ({ number, onEdit, onDelete, isDeleting }: WhatsAppNumberCardProps) => {
    const t = useTranslations("Settings.page")

    return (
        <div
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
                            onClick={() => onEdit(number)}
                            className="w-full text-muted-foreground hover:bg-muted/40 hover:text-foreground md:w-auto"
                            aria-label={t("whatsapp.actions.editAria", { name: number.displayName })}
                        >
                            <Edit className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(number)}
                            className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive/80 md:w-auto"
                            aria-label={t("whatsapp.actions.removeAria", { name: number.displayName })}
                            disabled={isDeleting}
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
    )
}

