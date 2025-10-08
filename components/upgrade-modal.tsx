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
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20">
                            <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-500" />
                        </div>
                        <DialogTitle className="text-xl">{getTitle()}</DialogTitle>
                    </div>
                    <DialogDescription className="text-base pt-2">
                        {getDescription()}
                    </DialogDescription>
                </DialogHeader>

                <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 dark:bg-blue-500 shrink-0">
                            <Zap className="h-5 w-5 text-white" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                                {t("benefits.title")}
                            </h4>
                            <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                                    {t("benefits.unlimited")}
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
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

