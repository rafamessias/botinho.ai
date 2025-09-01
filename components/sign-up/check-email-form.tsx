"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
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
import { IconMail, IconClock } from "@tabler/icons-react"
import { resendConfirmationEmailAction } from "@/components/server-actions/auth"
import { toast } from "sonner"
import { Link } from "@/i18n/navigation"

export function CheckEmailForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const t = useTranslations("CheckEmailPage")
    const searchParams = useSearchParams()
    const email = searchParams.get("email") || ""

    const [countdown, setCountdown] = useState(60)
    const [canResend, setCanResend] = useState(false)
    const [isResending, setIsResending] = useState(false)

    // Countdown timer effect
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1)
            }, 1000)
            return () => clearTimeout(timer)
        } else {
            setCanResend(true)
        }
    }, [countdown])

    const handleResendEmail = async () => {
        if (!email) {
            toast.error(t("errors.noEmail"))
            return
        }

        try {
            setIsResending(true)
            const result = await resendConfirmationEmailAction(email)

            if (result?.success === false) {
                toast.error(result.error)
            } else if (result?.success === true) {
                toast.success(result.message || t("messages.emailResent"))
                // Reset countdown
                setCountdown(60)
                setCanResend(false)
            }
        } catch (error) {
            console.error("Resend email error:", error)
            toast.error(t("errors.resendFailed"))
        } finally {
            setIsResending(false)
        }
    }

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                        <IconMail className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-xl">{t("title")}</CardTitle>
                    <CardDescription className="text-center">
                        {email ? (
                            <>
                                {t("description.withEmail")} <br />
                                <span className="font-medium text-foreground">{email}</span>
                            </>
                        ) : (
                            t("description.generic")
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Instructions */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">1</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground">
                                    {t("instructions.step1")}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">2</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground">
                                    {t("instructions.step2")}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">3</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground">
                                    {t("instructions.step3")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Countdown and Resend Section */}
                    <div className="border-t pt-6 h-[100px]">
                        <div className="text-center space-y-4">
                            <p className="text-sm text-muted-foreground">
                                {t("resend.didntReceive")}
                            </p>

                            {!canResend ? (
                                <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                                    <IconClock className="h-4 w-4" />
                                    <span>
                                        {t("resend.waitTime", { time: formatTime(countdown) })}
                                    </span>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={handleResendEmail}
                                    disabled={isResending}
                                    className="w-full cursor-pointer"
                                >
                                    {isResending ? t("resend.sending") : t("resend.button")}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Back to Sign In */}
                    <div className="text-center">
                        <Link
                            href="/sign-in"
                            className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
                        >
                            {t("backToSignIn")}
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Help Section */}
            <div className="text-center text-xs text-muted-foreground space-y-2">
                <p>{t("help.checkSpam")}</p>
                <p>
                    {t("help.needHelp")} {" "}
                    <a href="mailto:support@example.com" className="underline underline-offset-4 hover:text-foreground">
                        {t("help.contactSupport")}
                    </a>
                </p>
            </div>
        </div>
    )
}
