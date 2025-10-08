"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { useUser } from "@/components/user-provider"
import { UpgradeModal } from "@/components/upgrade-modal"
import { updateTeamBrandingAction, getTeamBrandingAction } from "@/components/server-actions/team"

export const BrandingSettings = () => {
    const t = useTranslations("Settings.branding")
    const { user, hasPermission } = useUser()
    const [branding, setBranding] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [isUpdating, setIsUpdating] = useState(false)
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)
    const { isAdmin } = hasPermission()

    // Get current user's default team
    const currentTeam = user?.teams?.find((team: any) => team.id === user?.defaultTeamId) || user?.teams?.[0]

    // Load branding setting when component mounts
    useEffect(() => {
        const loadBrandingSetting = async () => {
            if (!currentTeam) {
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)
                const result = await getTeamBrandingAction(currentTeam.id)

                if (result.success && result.branding !== undefined) {
                    setBranding(result.branding)
                }
            } catch (error) {
                console.error("Error loading branding setting:", error)
            } finally {
                setIsLoading(false)
            }
        }

        loadBrandingSetting()
    }, [currentTeam?.id])

    const handleBrandingToggle = async (checked: boolean) => {
        if (!currentTeam) {
            toast.error(t("noTeam"))
            return
        }

        if (!isAdmin) {
            toast.error(t("notAuthorized"))
            return
        }

        try {
            setIsUpdating(true)

            const result = await updateTeamBrandingAction({
                teamId: currentTeam.id,
                branding: checked
            })

            if (result.success) {
                setBranding(checked)
                toast.success(result.message)
            } else {
                // Check if upgrade is required
                if ('requiresUpgrade' in result && result.requiresUpgrade) {
                    setShowUpgradeModal(true)
                    // Keep the switch in the current position
                } else {
                    toast.error(result.error || t("updateFailed"))
                }
            }
        } catch (error) {
            console.error("Error updating branding:", error)
            toast.error(t("updateFailed"))
        } finally {
            setIsUpdating(false)
        }
    }

    if (isLoading) {
        return (
            <Card className="w-full overflow-hidden">
                <CardHeader>
                    <CardTitle>{t("title")}</CardTitle>
                    <CardDescription>{t("description")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">{t("switchLabel")}</Label>
                            <div className="text-sm text-muted-foreground">
                                {t("switchDescription")}
                            </div>
                        </div>
                        <div className="h-6 w-11 animate-pulse rounded-full bg-muted" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (!currentTeam) {
        return (
            <Card className="w-full overflow-hidden">
                <CardHeader>
                    <CardTitle>{t("title")}</CardTitle>
                    <CardDescription>{t("description")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{t("noTeam")}</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <>
            <Card className="w-full overflow-hidden">
                <CardHeader>
                    <CardTitle>{t("title")}</CardTitle>
                    <CardDescription>{t("description")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label
                                htmlFor="branding-switch"
                                className="text-base cursor-pointer"
                            >
                                {t("switchLabel")}
                            </Label>
                            <div className="text-sm text-muted-foreground">
                                {t("switchDescription")}
                            </div>
                        </div>
                        <Switch
                            id="branding-switch"
                            checked={!branding}
                            onCheckedChange={(checked) => handleBrandingToggle(!checked)}
                            disabled={!isAdmin || isUpdating}
                            aria-label={t("switchLabel")}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Upgrade Modal */}
            <UpgradeModal
                open={showUpgradeModal}
                onOpenChange={setShowUpgradeModal}
                limitType="remove_branding"
            />
        </>
    )
}

