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
import { Link } from "@/i18n/navigation"

export function SignUpForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const t = useTranslations("SignUpForm")

    // Form validation schema with translations
    const signUpSchema = z.object({
        name: z.string().min(2, t("validation.nameMinLength")),
        email: z.string().email(t("validation.emailRequired")),
        phone: z.string().min(10, t("validation.phoneMinLength")).regex(/^[+]?[\d\s\-\(\)]{10,}$/, t("validation.phoneInvalid")),
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
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
    })

    const onSubmit = async (data: SignUpFormData) => {
        try {
            console.log("Sign up form data:", data)
            // TODO: Implement actual sign up logic here
        } catch (error) {
            console.error("Sign up error:", error)
        }
    }

    const handleGoogleSignUp = async () => {
        try {
            console.log("Google sign up")
        } catch (error) {
            console.error("Google sign up error:", error)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">{t("title")}</CardTitle>
                    <CardDescription>
                        {t("description")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 mb-6">
                        <div className="flex flex-col gap-4">
                            <Button variant="outline" className="w-full cursor-pointer" onClick={handleGoogleSignUp}>
                                <IconBrandGoogleFilled
                                    className="mr-2 size-5"
                                    aria-label="Google"
                                    tabIndex={0}
                                />
                                {t("googleButton")}
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
                                        placeholder={t("phonePlaceholder")}
                                        {...register("phone")}
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
                                <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
                                    {isSubmitting ? t("signingUp") : t("signUpButton")}
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                {t("haveAccount")}{" "}
                                <Link href="/sign-in" className="underline underline-offset-4">
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
