"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { IconCheck, IconX, IconLoader2, IconMail } from "@tabler/icons-react"
import { confirmEmailAction } from "@/components/server-actions/auth"
import { toast } from "sonner"

type ConfirmationStatus = "loading" | "success" | "error" | "invalid"

export function ConfirmEmailForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const t = useTranslations("ConfirmEmailPage")
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get("token") || ""
    const teamId = searchParams.get("teamId") || ""

    const [status, setStatus] = useState<ConfirmationStatus>("loading")
    const [errorMessage, setErrorMessage] = useState("")
    const confirmationAttempted = useRef(false)

    // Auto-confirm email when component mounts
    useEffect(() => {
        // Prevent duplicate calls in React Strict Mode
        if (confirmationAttempted.current) return

        const confirmEmail = async () => {
            if (!token) {
                setStatus("invalid")
                setErrorMessage(t("errors.noToken"))
                return
            }

            confirmationAttempted.current = true

            try {
                const result = await confirmEmailAction(token, parseInt(teamId))

                if (result?.success === false) {
                    setStatus("error")
                    setErrorMessage(result.error || t("errors.confirmFailed"))
                } else if (result?.success === true) {
                    setStatus("success")
                    toast.success(result.message || t("messages.confirmSuccess"))

                    // Redirect to sign-in after 3 seconds
                    setTimeout(() => {
                        router.push("/sign-in")
                    }, 3000)
                }
            } catch (error) {
                console.error("Email confirmation error:", error)
                setStatus("error")
                setErrorMessage(t("errors.confirmFailed"))
            }
        }

        confirmEmail()
    }, [token, t])

    const getStatusIcon = () => {
        switch (status) {
            case "loading":
                return <IconLoader2 className="h-10 w-10 text-blue-600 dark:text-blue-400 animate-spin" />
            case "success":
                return <IconCheck className="h-10 w-10 text-green-600 dark:text-green-400" />
            case "error":
            case "invalid":
                return <IconX className="h-10 w-10 text-red-600 dark:text-red-400" />
            default:
                return <IconMail className="h-10 w-10 text-gray-600 dark:text-gray-400" />
        }
    }

    const getStatusColor = () => {
        switch (status) {
            case "loading":
                return "bg-blue-100 dark:bg-blue-900"
            case "success":
                return "bg-green-100 dark:bg-green-900"
            case "error":
            case "invalid":
                return "bg-red-100 dark:bg-red-900"
            default:
                return "bg-gray-100 dark:bg-gray-900"
        }
    }

    const getTitle = () => {
        switch (status) {
            case "loading":
                return t("status.loading.title")
            case "success":
                return t("status.success.title")
            case "error":
                return t("status.error.title")
            case "invalid":
                return t("status.invalid.title")
            default:
                return t("title")
        }
    }

    const getDescription = () => {
        switch (status) {
            case "loading":
                return t("status.loading.description")
            case "success":
                return t("status.success.description")
            case "error":
                return errorMessage || t("status.error.description")
            case "invalid":
                return errorMessage || t("status.invalid.description")
            default:
                return t("description")
        }
    }

    const handleRetryConfirmation = async () => {
        if (!token) return

        setStatus("loading")
        setErrorMessage("")

        try {
            const result = await confirmEmailAction(token, parseInt(teamId))

            if (result?.success === false) {
                setStatus("error")
                setErrorMessage(result.error || t("errors.confirmFailed"))
            } else if (result?.success === true) {
                setStatus("success")
                toast.success(result.message || t("messages.confirmSuccess"))

                // Redirect to sign-in after 3 seconds
                setTimeout(() => {
                    router.push("/sign-in")
                }, 3000)
            }
        } catch (error) {
            console.error("Email confirmation retry error:", error)
            setStatus("error")
            setErrorMessage(t("errors.confirmFailed"))
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <div className={cn("mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full", getStatusColor())}>
                        {getStatusIcon()}
                    </div>
                    <CardTitle className="text-xl">{getTitle()}</CardTitle>
                    <CardDescription className="text-center">
                        {getDescription()}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Success State */}
                    {status === "success" && (
                        <div className="text-center space-y-4">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    {t("status.success.instructions")}
                                </p>
                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                    <IconLoader2 className="h-4 w-4 animate-spin" />
                                    <span>{t("status.success.redirecting")}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {(status === "error" || status === "invalid") && (
                        <div className="text-center space-y-4">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    {t("status.error.instructions")}
                                </p>
                            </div>

                            {status === "error" && token && (
                                <Button
                                    variant="outline"
                                    onClick={handleRetryConfirmation}
                                    className="w-full cursor-pointer"
                                >
                                    {t("actions.retry")}
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Loading State */}
                    {status === "loading" && (
                        <div className="text-center space-y-4">
                            <p className="text-sm text-muted-foreground">
                                {t("status.loading.instructions")}
                            </p>
                        </div>
                    )}

                    {/* Navigation Actions */}
                    <div className="border-t pt-6">
                        <div className="flex flex-col gap-3">
                            {status === "success" ? (
                                <Button
                                    onClick={() => router.push("/sign-in")}
                                    className="w-full cursor-pointer"
                                >
                                    {t("actions.continueToSignIn")}
                                </Button>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => router.push("/sign-in")}
                                        className="w-full cursor-pointer"
                                    >
                                        {t("actions.goToSignIn")}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={() => router.push("/sign-up")}
                                        className="w-full cursor-pointer"
                                    >
                                        {t("actions.backToSignUp")}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Help Section */}
            <div className="text-center text-xs text-muted-foreground space-y-2">
                <p>
                    {t("help.needHelp")} {" "}
                    <a href="mailto:contact@opineeo.com" className="underline underline-offset-4 hover:text-foreground">
                        {t("help.contactSupport")}
                    </a>
                </p>
            </div>
        </div>
    )
}
