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
import { googleSignInAction, signInAction } from "@/components/server-actions/auth"
import { useState } from "react"
import { toast } from "sonner"
import { ThemeSelector } from "@/components/theme-selector"
import { LanguageSelector } from "@/components/language-selector"
import { useSearchParams } from "next/navigation"

export function SignInForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const t = useTranslations("SignInForm")
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()

    // Form validation schema with translations
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

    // Watch email field to pass to reset password link
    const emailValue = watch("email")

    const onSubmit = async (data: SignInFormData) => {
        try {
            const result = await signInAction(data)

            if (result?.success === false) {
                toast.error(result.error)
                if (result.errorCode === "email-not-confirmed") {
                    router.push("/sign-up/check-email?email=" + data.email)
                }
            } else if (result?.success === true) {
                // Success - handle redirect properly

                const redirectParam = searchParams.get("redirect")
                if (redirectParam) {
                    // If there's a redirect parameter, navigate to it
                    // The middleware will handle locale conversion
                    window.location.href = redirectParam
                } else {
                    // No redirect, just reload to trigger middleware locale check
                    window.location.reload();
                }
            }
        } catch (error) {
            // NextAuth throws NEXT_REDIRECT for successful sign-in redirects - this is expected
            if (error instanceof Error && error.message === "NEXT_REDIRECT") {
                // Don't show error for redirects - this is normal sign-in flow
                return
            }
            console.error("Sign in error:", error)
            toast.error("An unexpected error occurred")
        }
    }

    const handleGoogleSignIn = async () => {
        try {
            setIsGoogleLoading(true)
            // Get redirect parameter from URL
            const redirectParam = searchParams.get("redirect")
            await googleSignInAction(redirectParam || undefined)
            // NextAuth will handle the redirect after successful Google sign-in
        } catch (error) {
            // NextAuth throws NEXT_REDIRECT for OAuth redirects - this is expected
            if (error instanceof Error && error.message === "NEXT_REDIRECT") {
                // Don't show error for redirects - this is normal OAuth flow
                return
            }
            console.error("Google sign in error:", error)
            toast.error("Failed to sign in with Google")
            setIsGoogleLoading(false)
        }
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

                    <div className="grid gap-6 mb-6">
                        <div className="flex flex-col gap-4">
                            <Button
                                variant="outline"
                                className="w-full cursor-pointer"
                                onClick={handleGoogleSignIn}
                                disabled={isGoogleLoading || isSubmitting}
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
                                        <p className="text-sm text-red-500">{errors.email.message}</p>
                                    )}
                                </div>
                                <div className="grid gap-3">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">{t("password")}</Label>
                                        <Link
                                            href={`/reset-password${emailValue ? `?email=${encodeURIComponent(emailValue)}` : ''}`}
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
                                        <p className="text-sm text-red-500">{errors.password.message}</p>
                                    )}
                                </div>
                                <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting || isGoogleLoading}>
                                    {isSubmitting ? t("signingIn") : t("loginButton")}
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
                {t("termsText")} <Link href="#">{t("termsOfService")}</Link>{" "}
                {t("and")} <Link href="#">{t("privacyPolicy")}</Link>.
            </div>
        </div>
    )
}
