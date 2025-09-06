"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations, useLocale } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { confirmOTPAction, resendOTPAction } from "@/components/server-actions/auth"
import { ThemeSelector } from "@/components/theme-selector"
import { LanguageSelector } from "@/components/language-selector"

type OTPFormData = {
    otp: string
}

export function OTPForm() {
    const t = useTranslations("OTPForm")

    const otpSchema = z.object({
        otp: z.string().min(6, t("otpInvalidFormat"))
    })
    const locale = useLocale()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [otp, setOtp] = useState("")

    const email = searchParams.get("email")
    const phone = searchParams.get("phone")
    const urlOtp = searchParams.get("otp")

    const {
        handleSubmit,
        formState: { errors },
        setError,
        setValue,
        watch
    } = useForm<OTPFormData>({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: "" }
    })

    const formOtp = watch("otp")

    // Auto-submit if OTP is provided via URL
    useEffect(() => {
        console.log("urlOtp", urlOtp)
        console.log("isSubmitting", email, phone)
        if (urlOtp && urlOtp.length === 6 && !isSubmitting) {
            setOtp(urlOtp)
            setValue("otp", urlOtp)
            //toast.info(t("otpDetected"))
            // Auto-submit after a short delay to ensure the form is ready
            const timer = setTimeout(() => {
                handleSubmit(onSubmit)()
            }, 100)
            return () => clearTimeout(timer)
        } else if (urlOtp && urlOtp.length !== 6) {
            toast.error(t("invalidOtpFormatUrl"))
        }
    }, [urlOtp, isSubmitting, handleSubmit, t, setValue])

    const onSubmit = async (data: OTPFormData) => {
        if (!email && !phone) {
            toast.error(t("missingParams"))
            return
        }

        setIsSubmitting(true)
        try {
            const result = await confirmOTPAction(data.otp, email || undefined, phone || undefined)

            if (result?.success === false) {
                setError("otp", { message: result.error })
                toast.error(result.error)
            } else if (result?.success === true) {
                toast.success(result.message || t("accountConfirmed"))
                router.push(`/${locale}/sign-in`)
            }
        } catch (error) {
            console.error("OTP confirmation error:", error)
            toast.error(t("unexpectedError"))
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleResendOTP = async () => {
        if (!email && !phone) {
            toast.error(t("missingParams"))
            return
        }

        setIsResending(true)
        try {
            const result = await resendOTPAction(email || undefined, phone || undefined)

            if (result?.success === false) {
                toast.error(result.error)
            } else if (result?.success === true) {
                toast.success(result.message || t("otpSent"))
                setOtp("") // Clear the OTP input
                setValue("otp", "") // Clear the form value
            }
        } catch (error) {
            console.error("Resend OTP error:", error)
            toast.error(t("resendFailed"))
        } finally {
            setIsResending(false)
        }
    }

    const handleOTPChange = (value: string) => {
        setOtp(value)
        setValue("otp", value)
        if (value.length === 6) {
            // Auto-submit when 6 digits are entered
            handleSubmit(onSubmit)()
        }
    }

    return (
        <Card>
            <CardHeader className="text-center relative">
                <div className="flex justify-end items-center gap-1">
                    <LanguageSelector variant="compact" />
                    <ThemeSelector variant="compact" />
                </div>
                <CardTitle className="text-xl">{t("title")}</CardTitle>
                <CardDescription>
                    {email ? t("emailDescription", { email: email || "" }) : t("phoneDescription", { phone: phone || "" })}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-4">
                                {t("enterOTP")}
                            </p>
                            <InputOTP
                                maxLength={6}
                                value={otp}
                                onChange={handleOTPChange}
                                className="justify-center"
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        {errors.otp && (
                            <p className="text-sm text-red-500 text-center">{errors.otp.message}</p>
                        )}

                        <Button
                            type="submit"
                            className="w-full cursor-pointer"
                            disabled={isSubmitting || otp.length !== 6}
                        >
                            {isSubmitting ? t("confirming") : t("confirmButton")}
                        </Button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">
                            {t("didntReceive")}
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleResendOTP}
                            disabled={isResending}
                            className="cursor-pointer"
                        >
                            {isResending ? t("resending") : t("resendButton")}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
