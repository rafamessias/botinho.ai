"use client"

import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Zap, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"

interface UpgradeModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    limitType?: "surveys" | "responses" | "remove_branding" | "exports" | "apis" | "public_pages" | "custom"
    currentLimit?: number
    customTitle?: string
    customDescription?: string
}

export const UpgradeModal = ({
    open,
    onOpenChange,
    limitType = "surveys",
    currentLimit,
    customTitle,
    customDescription,
}: UpgradeModalProps) => {
    const t = useTranslations("UpgradeModal")
    const router = useRouter()

    const handleUpgrade = () => {
        onOpenChange(false)
        router.push("/subscription")
    }

    const getLimitTypeKey = () => {
        switch (limitType) {
            case "surveys":
                return "surveys"
            case "responses":
                return "responses"
            case "remove_branding":
                return "remove_branding"
            case "exports":
                return "exports"
            case "apis":
                return "apis"
            case "public_pages":
                return "public_pages"
            default:
                return "custom"
        }
    }

    const getTitle = () => {
        if (customTitle) return customTitle
        return t(`limitReached.${getLimitTypeKey()}.title`)
    }

    const getDescription = () => {
        if (customDescription) return customDescription

        if (currentLimit !== undefined && limitType !== "custom") {
            return t(`limitReached.${getLimitTypeKey()}.descriptionWithLimit`, {
                limit: currentLimit,
            })
        }

        return t(`limitReached.${getLimitTypeKey()}.description`)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full accent-orange">
                            <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-500" />
                        </div>
                        <DialogTitle className="text-xl">{getTitle()}</DialogTitle>
                    </div>
                    <DialogDescription className="text-base pt-2">
                        {getDescription()}
                    </DialogDescription>
                </DialogHeader>

                <Card className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                    <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary shrink-0">
                            <Zap className="h-5 w-5 text-white" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-semibold text-primary">
                                {t("benefits.title")}
                            </h4>
                            <ul className="space-y-1 text-sm text-primary/80">
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    {t("benefits.unlimited")}
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    {t("benefits.advanced")}
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        {t("actions.cancel")}
                    </Button>
                    <Button
                        onClick={handleUpgrade}
                        className="gap-2"
                    >
                        {t("actions.upgrade")}
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

