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
import { resetPasswordAction } from "@/components/server-actions/auth"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { ThemeSelector } from "@/components/theme-selector"
import { LanguageSelector } from "@/components/language-selector"
import { useSearchParams } from "next/navigation"

export function ResetPasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const t = useTranslations("ResetPasswordForm")
    const searchParams = useSearchParams()
    const [isSubmitted, setIsSubmitted] = useState(false)

    // Form validation schema with translations
    const resetPasswordSchema = z.object({
        email: z.string().email(t("validation.emailRequired")),
    })

    type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    })

    // Auto-populate email from URL params if available
    useEffect(() => {
        const emailParam = searchParams.get("email")
        if (emailParam) {
            setValue("email", emailParam)
        }
    }, [searchParams, setValue])

    const onSubmit = async (data: ResetPasswordFormData) => {
        try {
            const result = await resetPasswordAction(data.email)

            if (result?.success === false) {
                toast.error(result.error)
            } else if (result?.success === true) {
                setIsSubmitted(true)
                toast.success(t("messages.resetEmailSent"))
            }
        } catch (error) {
            console.error("Reset password error:", error)
            toast.error(t("messages.unexpectedError"))
        }
    }

    if (isSubmitted) {
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
                                    <p className="text-sm">{t("success.checkSpam")}</p>
                                </div>
                            </div>
                            <Button asChild className="w-full">
                                <Link href="/sign-in">
                                    {t("success.backToSignIn")}
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                <div className="text-muted-foreground text-center text-xs text-balance">
                    {t("help.needHelp")}{" "}
                    <Link href="#" className="underline underline-offset-4 hover:text-primary">
                        {t("help.contactSupport")}
                    </Link>
                </div>
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
                                <Label htmlFor="email">{t("email")}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder={t("emailPlaceholder")}
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>
                            <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
                                {isSubmitting ? t("submitting") : t("resetButton")}
                            </Button>
                            <div className="text-center text-sm">
                                {t("rememberPassword")}{" "}
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
