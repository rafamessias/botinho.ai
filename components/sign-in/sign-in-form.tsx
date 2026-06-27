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
import { IconBrandGoogleFilled } from "@tabler/icons-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { Link, useRouter } from "@/i18n/navigation"
import { PRIVACY_URL, TERMS_URL } from "@/lib/constants/support"
import { googleSignInAction, signInAction } from "@/components/server-actions/auth"
import { useState } from "react"
import { toast } from "sonner"
import { ThemeSelector } from "@/components/theme-selector"
import { LanguageSelector } from "@/components/language-selector"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"

export function SignInForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const t = useTranslations("SignInForm")
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const [isRedirecting, setIsRedirecting] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const { update } = useSession()

    const signInSchema = z.object({
        email: z.string().email(t("validation.emailRequired")),
        password: z.string().min(6, t("validation.passwordMinLength")),
    })

    type SignInFormData = z.infer<typeof signInSchema>

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
    })

    const emailValue = watch("email")

    const navigateAfterAuth = (path: string) => {
        const redirectParam = searchParams.get("redirect")
        if (redirectParam?.startsWith("/") && !redirectParam.startsWith("//")) {
            router.push(`/auth/post-login?redirect=${encodeURIComponent(redirectParam)}`)
            return
        }
        router.push(path)
    }

    const onSubmit = async (data: SignInFormData) => {
        try {
            const result = await signInAction(data)

            if (result?.success === false) {
                toast.error(result.error)
                if ("errorCode" in result && result.errorCode === "account-blocked") {
                    router.push(`/sign-up/otp?email=${encodeURIComponent(data.email)}`)
                }
                return
            }

            if (result?.needsCheckout && result.checkoutUrl) {
                window.location.assign(result.checkoutUrl)
                return
            }

            setIsRedirecting(true)
            await Promise.race([
                update(),
                new Promise((resolve) => setTimeout(resolve, 5_000)),
            ])
            navigateAfterAuth("/auth/post-login")
        } catch (error) {
            setIsRedirecting(false)
            if (error instanceof Error && error.message === "NEXT_REDIRECT") {
                return
            }
            console.error("Sign in error:", error)
            toast.error("An unexpected error occurred")
        }
    }

    const handleGoogleSignIn = async () => {
        try {
            setIsGoogleLoading(true)
            const redirectParam = searchParams.get("redirect")
            await googleSignInAction(redirectParam || undefined)
            await update()
        } catch (error) {
            if (error instanceof Error && error.message === "NEXT_REDIRECT") {
                return
            }
            console.error("Google sign in error:", error)
            toast.error(t("googleSignInFailed"))
            setIsGoogleLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="elegant-card">
                <CardHeader className="text-center relative">
                    <div className="flex justify-end items-center gap-1">
                        <LanguageSelector variant="compact" />
                        <ThemeSelector variant="compact" />
                    </div>
                    <CardTitle className="heading-secondary text-xl">{t("title")}</CardTitle>
                    <CardDescription className="body-secondary">
                        {t("description")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 mb-6">
                        <div className="flex flex-col gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full cursor-pointer"
                                onClick={handleGoogleSignIn}
                                disabled={isGoogleLoading || isSubmitting || isRedirecting}
                            >
                                <IconBrandGoogleFilled
                                    className="mr-2 size-5"
                                    aria-label="Google"
                                    tabIndex={0}
                                />
                                {isGoogleLoading ? "Signing in..." : t("googleButton")}
                            </Button>
                        </div>
                        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                            <span className="bg-card text-muted-foreground relative z-10 px-2">
                                {t("orContinueWith")}
                            </span>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-6">
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
                                        <p className="text-sm text-destructive">{errors.email.message}</p>
                                    )}
                                </div>
                                <div className="grid gap-3">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">{t("password")}</Label>
                                        <Link
                                            href={`/reset-password${emailValue ? `?email=${encodeURIComponent(emailValue)}` : ""}`}
                                            className="ml-auto text-sm underline-offset-4 hover:underline"
                                        >
                                            {t("forgotPassword")}
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        {...register("password")}
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-destructive">{errors.password.message}</p>
                                    )}
                                </div>
                                <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting || isGoogleLoading || isRedirecting}>
                                    {isSubmitting || isRedirecting ? t("signingIn") : t("loginButton")}
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                {t("noAccount")}{" "}
                                <Link href="/sign-up" className="underline underline-offset-4">
                                    {t("signUp")}
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                {t("termsText")} <Link target="_blank" href={TERMS_URL}>{t("termsOfService")}</Link>{" "}
                {t("and")} <Link target="_blank" href={PRIVACY_URL}>{t("privacyPolicy")}</Link>.
            </div>
        </div>
    )
}
