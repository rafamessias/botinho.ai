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
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { googleSignInAction, signUpAction } from "@/components/server-actions/auth"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { ThemeSelector } from "@/components/theme-selector"
import { LanguageSelector } from "@/components/language-selector"

export function SignUpForm({
    className,
    isOTPEnabled,
    ...props
}: React.ComponentProps<"div"> & { isOTPEnabled: boolean }) {
    const t = useTranslations("SignUpForm")
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const [phoneValue, setPhoneValue] = useState("")
    const locale = useLocale()

    // Form validation schema with translations
    const signUpSchema = z.object({
        name: z.string().min(2, t("validation.nameMinLength")),
        email: z.string().email(t("validation.emailRequired")),
        phone: z.string().min(10, t("validation.phoneMinLength")).regex(/^\d{10,11}$/, t("validation.phoneInvalid")),
        password: z.string().min(6, t("validation.passwordMinLength")),
        confirmPassword: z.string().min(6, t("validation.confirmPasswordMinLength")),
    }).refine((data) => data.password === data.confirmPassword, {
        message: t("validation.passwordsDoNotMatch"),
        path: ["confirmPassword"],
    })

    type SignUpFormData = z.infer<typeof signUpSchema>

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
    })

    // Phone number masking function
    const formatPhoneNumber = (value: string): string => {
        // Remove all non-digits
        const digits = value.replace(/\D/g, '')

        // Apply formatting based on length
        if (digits.length <= 2) {
            return `(${digits}`
        } else if (digits.length <= 7) {
            return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
        } else {
            return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
        }
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value
        const formattedValue = formatPhoneNumber(inputValue)

        // Limit to maximum length
        if (formattedValue.length <= 15) {
            setPhoneValue(formattedValue)
            // Extract only digits for form validation
            const digitsOnly = formattedValue.replace(/\D/g, '')
            setValue("phone", digitsOnly, { shouldValidate: true })
        }
    }

    const onSubmit = async (data: SignUpFormData) => {
        try {
            const result = await signUpAction(data)

            if (result?.success === false) {
                toast.error(result.error)
            } else if (result?.success === true) {
                toast.success(result.message || "Account created successfully!")

                // Check if OTP is enabled
                if (isOTPEnabled) {
                    // Redirect to OTP page with email and phone parameters
                    const params = new URLSearchParams({
                        email: data.email,
                        phone: data.phone
                    })
                    router.push(`/${locale}/sign-up/otp?${params.toString()}`)
                } else {
                    // Redirect to check email page with email parameter (existing flow)
                    router.push(`/${locale}/sign-up/check-email?email=${encodeURIComponent(data.email)}`)
                }
            }
        } catch (error) {
            console.error("Sign up error:", error)
            toast.error("An unexpected error occurred during registration")
        }
    }

    const handleGoogleSignUp = async () => {
        try {
            setIsGoogleLoading(true)
            // Get redirect parameter from URL
            const redirectParam = searchParams.get("redirect")
            await googleSignInAction(redirectParam || undefined)
            // NextAuth will handle the redirect after successful Google sign-up
        } catch (error) {
            // NextAuth throws NEXT_REDIRECT for OAuth redirects - this is expected
            if (error instanceof Error && error.message === "NEXT_REDIRECT") {
                // Don't show error for redirects - this is normal OAuth flow
                return
            }
            console.error("Google sign up error:", error)
            toast.error("Failed to sign up with Google")
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
                                onClick={handleGoogleSignUp}
                                disabled={isGoogleLoading || isSubmitting}
                            >
                                <IconBrandGoogleFilled
                                    className="mr-2 size-5"
                                    aria-label="Google"
                                    tabIndex={0}
                                />
                                {isGoogleLoading ? "Signing up..." : t("googleButton")}
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
                                    <Label htmlFor="name">{t("name")}</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder={t("namePlaceholder")}
                                        {...register("name")}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name.message}</p>
                                    )}
                                </div>
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
                                    <Label htmlFor="phone">{t("phone")}</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="(11) 99999-9999"
                                        value={phoneValue}
                                        onChange={handlePhoneChange}
                                        maxLength={15}
                                    />
                                    {errors.phone && (
                                        <p className="text-sm text-red-500">{errors.phone.message}</p>
                                    )}
                                </div>
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
                                <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting || isGoogleLoading}>
                                    {isSubmitting ? t("signingUp") : t("signUpButton")}
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                {t("haveAccount")}{" "}
                                <Link href={`/${locale}/sign-in`} className="underline underline-offset-4">
                                    {t("signIn")}
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
