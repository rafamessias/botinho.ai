"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"
import { CheckCircle, XCircle, UserPlus, Building2, Mail } from "lucide-react"
import {
    acceptCompanyInvitationAction,
    rejectCompanyInvitationAction,
} from "@/components/server-actions/company"

interface Company {
    id: number
    name: string
}

interface CompanyInvitationClientProps {
    membershipId: string | null
    companyId: string
}

export function CompanyInvitationClient({ membershipId, companyId }: CompanyInvitationClientProps) {
    const t = useTranslations("CompanyInvitation")
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [invitationStatus, setInvitationStatus] = useState<"pending" | "accepted" | "rejected" | "error">(
        membershipId ? "pending" : "error"
    )
    const [company, setCompany] = useState<Company | null>(null)

    const handleAcceptInvitation = async () => {
        if (!membershipId) return

        try {
            setIsLoading(true)
            const result = await acceptCompanyInvitationAction(parseInt(membershipId))

            if (result.success && result.company) {
                setInvitationStatus("accepted")
                setCompany(result.company as Company)
                toast.success(result.message || t("messages.invitationAccepted"))

                // Redirect to company page after a delay
                setTimeout(() => {
                    router.push(`/company`)
                }, 2000)
            } else {
                setInvitationStatus("error")
                toast.error(result.error || t("errors.acceptFailed"))
            }
        } catch (error) {
            console.error("Error accepting invitation:", error)
            setInvitationStatus("error")
            toast.error(t("errors.unexpectedError"))
        } finally {
            setIsLoading(false)
        }
    }

    const handleRejectInvitation = async () => {
        if (!membershipId) return

        try {
            setIsLoading(true)
            const result = await rejectCompanyInvitationAction(parseInt(membershipId))

            if (result.success) {
                setInvitationStatus("rejected")
                toast.success(result.message || t("messages.invitationRejected"))
            } else {
                setInvitationStatus("error")
                toast.error(result.error || t("errors.rejectFailed"))
            }
        } catch (error) {
            console.error("Error rejecting invitation:", error)
            setInvitationStatus("error")
            toast.error(t("errors.unexpectedError"))
        } finally {
            setIsLoading(false)
        }
    }

    const renderContent = () => {
        switch (invitationStatus) {
            case "pending":
                return (
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                <UserPlus className="h-6 w-6 text-blue-600" />
                            </div>
                            <CardTitle>{t("title")}</CardTitle>
                            <CardDescription>
                                {t("description")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center space-y-2">
                                <Building2 className="h-8 w-8 mx-auto text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    {t("companyInvitation")}
                                </p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button
                                    onClick={handleAcceptInvitation}
                                    disabled={isLoading}
                                    className="w-full"
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    {isLoading ? t("accepting") : t("acceptInvitation")}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleRejectInvitation}
                                    disabled={isLoading}
                                    className="w-full"
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    {isLoading ? t("rejecting") : t("rejectInvitation")}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )

            case "accepted":
                return (
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <CardTitle className="text-green-600">{t("status.accepted.title")}</CardTitle>
                            <CardDescription>
                                {company ? t("status.accepted.descriptionWithCompany", { companyName: company.name }) : t("status.accepted.description")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-sm text-muted-foreground mb-4">
                                {t("status.accepted.redirecting")}
                            </p>
                            <Button onClick={() => router.push("/company")} className="w-full">
                                {t("status.accepted.goToCompany")}
                            </Button>
                        </CardContent>
                    </Card>
                )

            case "rejected":
                return (
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                <XCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <CardTitle className="text-red-600">{t("status.rejected.title")}</CardTitle>
                            <CardDescription>
                                {t("status.rejected.description")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <Button variant="outline" onClick={() => router.push("/")} className="w-full">
                                {t("status.rejected.goHome")}
                            </Button>
                        </CardContent>
                    </Card>
                )

            case "error":
                return (
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                <Mail className="h-6 w-6 text-red-600" />
                            </div>
                            <CardTitle className="text-red-600">{t("status.error.title")}</CardTitle>
                            <CardDescription>
                                {t("status.error.description")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <p className="text-sm text-muted-foreground">
                                {t("status.error.instructions")}
                            </p>
                            <div className="flex flex-col gap-2">
                                <Button variant="outline" onClick={() => router.push("/company")} className="w-full">
                                    {t("status.error.goToCompanies")}
                                </Button>
                                <Button variant="outline" onClick={() => router.push("/")} className="w-full">
                                    {t("status.error.goHome")}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )

            default:
                return null
        }
    }

    return (
        <div className="flex justify-center items-center min-h-[400px]">
            {renderContent()}
        </div>
    )
}
