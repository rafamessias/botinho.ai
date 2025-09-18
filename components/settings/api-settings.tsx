"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Copy, Eye, EyeOff, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { generateTeamTokenAction, regenerateTeamTokenAction, getTeamTokenAction } from "@/components/server-actions/team"
import { useUser } from "@/components/user-provider"
import { SurveyWidgetDocs } from "./survey-widget-docs"

export const ApiSettings = () => {
    const t = useTranslations("Settings.api")
    const { user } = useUser()
    const [showToken, setShowToken] = useState(false)
    const [teamTokens, setTeamTokens] = useState<Record<number, string | null>>({})
    const [isGeneratingToken, setIsGeneratingToken] = useState(false)
    const [showRegenerateModal, setShowRegenerateModal] = useState(false)

    // Get current user's default team
    const currentTeam = user?.teams?.find((team: any) => team.id === user?.defaultTeamId) || user?.teams?.[0]
    const currentTeamToken = currentTeam ? teamTokens[currentTeam.id] : null

    const handleCopyToken = () => {
        if (currentTeamToken) {
            navigator.clipboard.writeText(currentTeamToken)
            toast.success(t("tokenCopied"))
        }
    }


    const handleGenerateToken = async (teamId: number) => {
        try {
            setIsGeneratingToken(true)
            const result = await generateTeamTokenAction({ teamId })

            if (result.success) {
                setTeamTokens(prev => ({ ...prev, [teamId]: result.token || null }))
                toast.success(result.message)
            } else {
                toast.error(result.error || "Failed to generate token")
            }
        } catch (error) {
            console.error("Generate token error:", error)
            toast.error(`An unexpected error occurred ${error}`)
        } finally {
            setIsGeneratingToken(false)
        }
    }

    const handleRegenerateToken = async (teamId: number) => {
        try {
            setIsGeneratingToken(true)
            setShowRegenerateModal(false)
            const result = await regenerateTeamTokenAction({ teamId })

            if (result.success) {
                setTeamTokens(prev => ({ ...prev, [teamId]: result.token || null }))
                toast.success(result.message)
            } else {
                toast.error(result.error || "Failed to regenerate token")
            }
        } catch (error) {
            console.error("Regenerate token error:", error)
            toast.error(`An unexpected error occurred ${error}`)
        } finally {
            setIsGeneratingToken(false)
        }
    }

    const handleConfirmRegenerate = () => {
        if (currentTeam) {
            handleRegenerateToken(currentTeam.id)
        }
    }

    const loadTeamToken = async (teamId: number) => {
        try {
            const result = await getTeamTokenAction(teamId)
            if (result.success) {
                setTeamTokens(prev => ({ ...prev, [teamId]: result.team?.token || null }))
            }
        } catch (error) {
            console.error("Load token error:", error)
        }
    }

    // Load token when component mounts
    useEffect(() => {
        if (currentTeam && !teamTokens[currentTeam.id]) {
            loadTeamToken(currentTeam.id)
        }
    }, [currentTeam])

    return (
        <Card>
            <CardHeader className="pb-4">
                <CardTitle className="text-lg">{t("title")}</CardTitle>
                <CardDescription className="text-sm">
                    {t("description")}
                </CardDescription>
            </CardHeader>

            {!currentTeam ? (
                <CardContent className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground">{t("noTeam")}</p>
                </CardContent>
            ) : (
                <CardContent className="space-y-3 px-3 pb-4 sm:space-y-4 sm:px-4 w-full">
                    {/* Team Token Section */}
                    <div className="space-y-3 sm:space-y-4 w-full">
                        <div className="space-y-2 sm:space-y-3 mb-8 sm:mb-0">
                            <Label htmlFor="team-token" className="text-sm font-medium">{t("teamToken")}</Label>
                            <div className="space-y-2">
                                <div className="flex gap-1.5 sm:gap-2">
                                    <div className="flex-1 relative">
                                        <Input
                                            id="team-token"
                                            type={showToken ? "text" : "password"}
                                            value={currentTeamToken || t("noTokenGenerated")}
                                            readOnly
                                            className="pr-10 text-xs sm:pr-12 sm:text-sm"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0.5 top-0.5 h-6 w-6 p-0 sm:right-1 sm:top-1 sm:h-7 sm:w-7"
                                            onClick={() => setShowToken(!showToken)}
                                        >
                                            {showToken ? <EyeOff className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                                        </Button>
                                    </div>
                                    {currentTeamToken && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleCopyToken}
                                            className="px-2 sm:px-3"
                                        >
                                            <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                                        </Button>
                                    )}
                                </div>
                                <div className="flex sm:justify-end gap-1.5 sm:gap-2">
                                    {!currentTeamToken ? (
                                        <Button
                                            onClick={() => handleGenerateToken(currentTeam.id)}
                                            disabled={isGeneratingToken}
                                            className="flex-1 sm:flex-none"
                                            size="sm"
                                        >
                                            {isGeneratingToken ? (
                                                <>
                                                    <RefreshCw className="mr-1.5 h-3 w-3 animate-spin sm:mr-2 sm:h-4 sm:w-4" />
                                                    <span className="text-xs sm:text-sm">{t("generating")}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-xs sm:text-sm">{t("generateToken")}</span>
                                                </>
                                            )}
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => setShowRegenerateModal(true)}
                                            variant="default"
                                            disabled={isGeneratingToken}
                                            className="flex-1 sm:flex-none"
                                            size="sm"
                                        >
                                            {isGeneratingToken ? (
                                                <>
                                                    <RefreshCw className="mr-1.5 h-3 w-3 animate-spin sm:mr-2 sm:h-4 sm:w-4" />
                                                    <span className="text-xs sm:text-sm">{t("regenerating")}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-xs sm:text-sm">{t("regenerateToken")}</span>
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>

                </CardContent>
            )}

            {/* Survey Widget Documentation */}
            <SurveyWidgetDocs currentTeamToken={currentTeamToken} />

            {/* Regenerate Token Confirmation Modal */}
            <Dialog open={showRegenerateModal} onOpenChange={setShowRegenerateModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t("confirmRegenerateTitle")}</DialogTitle>
                        <DialogDescription>
                            {t("confirmRegenerateDescription")}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex-col gap-2 sm:flex-row">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowRegenerateModal(false)}
                            className="w-full sm:w-auto"
                        >
                            {t("cancel")}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleConfirmRegenerate}
                            disabled={isGeneratingToken}
                            className="w-full sm:w-auto"
                        >
                            {isGeneratingToken ? (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    {t("regenerating")}
                                </>
                            ) : (
                                t("confirmRegenerate")
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
