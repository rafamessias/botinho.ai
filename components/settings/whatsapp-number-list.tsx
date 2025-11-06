"use client"

import { useTranslations } from "next-intl"
import { Skeleton } from "@/components/ui/skeleton"
import { WhatsAppNumberCard } from "./whatsapp-number-card"
import type { WhatsAppNumber } from "./types"

interface WhatsAppNumberListProps {
    numbers: WhatsAppNumber[]
    isLoading: boolean
    loadError: string | null
    isDeletingNumberId: string | null
    onEdit: (number: WhatsAppNumber) => void
    onDelete: (number: WhatsAppNumber) => void
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

export const WhatsAppNumberList = ({
    numbers,
    isLoading,
    loadError,
    isDeletingNumberId,
    onEdit,
    onDelete,
}: WhatsAppNumberListProps) => {
    const t = useTranslations("Settings.page")

    if (isLoading) {
        return <LoadingWhatsappSection />
    }

    if (loadError) {
        return (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                {loadError}
            </div>
        )
    }

    if (numbers.length === 0) {
        return (
            <div className="rounded-lg border border-dashed border-muted-foreground/30 p-6 text-center">
                <p className="text-sm text-muted-foreground">{t("whatsapp.empty.title")}</p>
                <p className="text-sm text-muted-foreground">{t("whatsapp.empty.description")}</p>
            </div>
        )
    }

    return (
        <>
            {numbers.map((number) => (
                <WhatsAppNumberCard
                    key={number.id}
                    number={number}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isDeleting={isDeletingNumberId === number.id}
                />
            ))}
        </>
    )
}

