"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { confirmPasswordResetAction } from "@/components/server-actions/auth"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { ThemeSelector } from "@/components/theme-selector"
import { LanguageSelector } from "@/components/language-selector"
import { useSearchParams, useRouter } from "next/navigation"

export function ResetPasswordConfirmForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const t = useTranslations("ResetPasswordConfirmForm")
    const searchParams = useSearchParams()
    const router = useRouter()
    const [isSuccess, setIsSuccess] = useState(false)
    const [isError, setIsError] = useState(false)
    const [token, setToken] = useState<string | null>(null)

    // Form validation schema with translations
    const resetPasswordConfirmSchema = z.object({
        password: z.string().min(6, t("validation.passwordRequired")),
        confirmPassword: z.string().min(6, t("validation.passwordRequired")),
    }).refine((data) => data.password === data.confirmPassword, {
        message: t("validation.passwordsDoNotMatch"),
        path: ["confirmPassword"],
    })

    type ResetPasswordConfirmFormData = z.infer<typeof resetPasswordConfirmSchema>

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordConfirmFormData>({
        resolver: zodResolver(resetPasswordConfirmSchema),
    })

    // Get token from URL params and validate
    useEffect(() => {
        const tokenParam = searchParams.get("token")
        if (!tokenParam) {
            setIsError(true)
        } else {
            setToken(tokenParam)
        }
    }, [searchParams])

    // Auto redirect after successful password reset
    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                router.push("/sign-in")
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [isSuccess, router])

    const onSubmit = async (data: ResetPasswordConfirmFormData) => {
        if (!token) {
            toast.error(t("messages.invalidToken"))
            setIsError(true)
            return
        }

        try {
            const result = await confirmPasswordResetAction(token, data.password)

            if (result?.success === false) {
                toast.error(result.error)
                setIsError(true)
            } else if (result?.success === true) {
                setIsSuccess(true)
                toast.success(t("messages.passwordResetSuccess"))
            }
        } catch (error) {
            console.error("Password reset confirmation error:", error)
            toast.error(t("messages.unexpectedError"))
            setIsError(true)
        }
    }

    if (isSuccess) {
        return (
            <div className={cn("flex flex-col gap-6", className)} {...props}>
                <Card>
                    <CardHeader className="text-center relative">
                        <div className="flex justify-end items-center gap-1">
                            <LanguageSelector variant="compact" />
                            <ThemeSelector variant="compact" />
                        </div>
                        <CardTitle className="text-xl">{t("success.title")}</CardTitle>
                        <CardDescription>
                            {t("success.description")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6">
                            <div className="text-center space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    {t("success.instructions")}
                                </p>
                                <div className="space-y-2">
                                    <p className="text-sm">{t("success.redirecting")}</p>
                                </div>
                            </div>
                            <Button asChild className="w-full">
                                <Link href="/sign-in">
                                    {t("backToSignIn")}
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (isError) {
        return (
            <div className={cn("flex flex-col gap-6", className)} {...props}>
                <Card>
                    <CardHeader className="text-center relative">
                        <div className="flex justify-end items-center gap-1">
                            <LanguageSelector variant="compact" />
                            <ThemeSelector variant="compact" />
                        </div>
                        <CardTitle className="text-xl">{t("error.title")}</CardTitle>
                        <CardDescription>
                            {t("error.description")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6">
                            <div className="text-center space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    {t("error.instructions")}
                                </p>
                            </div>
                            <Button asChild className="w-full">
                                <Link href="/reset-password">
                                    {t("error.requestNewReset")}
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/sign-in">
                                    {t("backToSignIn")}
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center relative">
                    <div className="flex justify-end items-center gap-1">
                        <LanguageSelector variant="compact" />
                        <ThemeSelector variant="compact" />
                    </div>
                    <CardTitle className="text-xl">{t("title")}</CardTitle>
                    <CardDescription>
                        {t("description")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="password">{t("password")}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder={t("passwordPlaceholder")}
                                    {...register("password")}
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500">{errors.password.message}</p>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder={t("confirmPasswordPlaceholder")}
                                    {...register("confirmPassword")}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                                )}
                            </div>
                            <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
                                {isSubmitting ? t("submitting") : t("resetButton")}
                            </Button>
                            <div className="text-center text-sm">
                                <Link href="/sign-in" className="underline underline-offset-4">
                                    {t("backToSignIn")}
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                {t("termsText")} <Link href="#">{t("termsOfService")}</Link>{" "}
                {t("and")} <Link href="#">{t("privacyPolicy")}</Link>.
            </div>
        </div>
    )
}
