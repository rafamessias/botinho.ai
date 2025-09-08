"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { updateUserProfileAction, updateUserAvatarAction } from "@/components/server-actions/user"
import { useUser } from "@/components/user-provider"

export function ProfileForm() {
    const t = useTranslations("Profile")
    const commonT = useTranslations("Common")
    const { user, loading, refreshUser } = useUser()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isAvatarUpdating, setIsAvatarUpdating] = useState(false)

    // Profile form validation schema
    const profileFormSchema = React.useMemo(() => z.object({
        firstName: z.string().min(1, t("validation.firstNameRequired")).max(50, t("validation.firstNameTooLong")),
        lastName: z.string().max(50, t("validation.lastNameTooLong")).optional(),
        phone: z.string().optional().refine((val) => {
            // Allow empty, null, undefined, or whitespace-only values
            if (val === "+1" || val === "+55") return true;

            // If no digits after cleaning, consider it empty (valid)
            if (val?.length === 0) return true;

            // Remove all non-digit characters to check if there are actual phone digits
            const digitsOnly = val?.replace(/\D/g, "") || "";

            // If there are digits, validate the phone number format
            return digitsOnly?.length >= 10 && /^\d+$/.test(digitsOnly);
        }, {
            message: t("validation.phoneInvalid")
        }),
    }), [t])

    type ProfileFormValues = z.infer<typeof profileFormSchema>

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            phone: "",
        },
    })

    // Update form values when user data loads
    React.useEffect(() => {
        if (user) {
            form.reset({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                phone: user.phone || "",
            })
        }
    }, [user, form.reset])

    const handleSubmit = async (data: ProfileFormValues) => {
        try {
            setIsSubmitting(true)

            const result = await updateUserProfileAction(data)

            if (result.success) {
                toast.success(t("messages.profileUpdated"))
                // Refresh user data
                await refreshUser(false)
            } else {
                toast.error(result.error || t("messages.updateFailed"))
            }
        } catch (error) {
            console.error("Profile update error:", error)
            toast.error(t("messages.unexpectedError"))
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        try {
            setIsAvatarUpdating(true)

            // For now, we'll use a placeholder URL
            // In a real app, you'd upload to a service like Cloudinary, AWS S3, etc.
            const avatarUrl = URL.createObjectURL(file)

            const result = await updateUserAvatarAction(avatarUrl)

            if (result.success) {
                toast.success(t("messages.avatarUpdated"))
                // Refresh user data
                await refreshUser(false)
            } else {
                toast.error(result.error || t("messages.avatarUpdateFailed"))
            }
        } catch (error) {
            console.error("Avatar update error:", error)
            toast.error(t("messages.unexpectedError"))
        } finally {
            setIsAvatarUpdating(false)
        }
    }

    if (loading || !user) {
        return (
            <Card className="border-none p-0">
                <CardHeader className="p-0">
                    <CardTitle>{t("title")}</CardTitle>
                    <CardDescription>{t("description")}</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="space-y-4">
                        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                        <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">

            {/* Profile Information Section */}
            <Card className="border-none p-0 shadow-none">
                <CardHeader className="p-0">
                    <CardTitle>{t("profile.title")}</CardTitle>
                    <CardDescription>{t("profile.description")}</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">{t("profile.firstName")}</Label>
                                <Input
                                    id="firstName"
                                    placeholder={t("profile.firstNamePlaceholder")}
                                    {...form.register("firstName")}
                                />
                                {form.formState.errors.firstName && (
                                    <p className="text-sm text-red-500">
                                        {form.formState.errors.firstName.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lastName">{t("profile.lastName")}</Label>
                                <Input
                                    id="lastName"
                                    placeholder={t("profile.lastNamePlaceholder")}
                                    {...form.register("lastName")}
                                />
                                {form.formState.errors.lastName && (
                                    <p className="text-sm text-red-500">
                                        {form.formState.errors.lastName.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">{t("profile.phone")}</Label>
                            <PhoneInput
                                id="phone"
                                placeholder={t("profile.phonePlaceholder")}
                                value={form.watch("phone")}
                                onChange={(value) => {
                                    form.setValue("phone", value, { shouldValidate: true });
                                }}
                            />
                            {form.formState.errors.phone && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.phone.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">{t("profile.email")}</Label>
                            <Input
                                id="email"
                                type="email"
                                value={user.email}
                                disabled
                                className="bg-muted"
                            />
                            <p className="text-sm text-muted-foreground">
                                {t("profile.emailNote")}
                            </p>
                        </div>


                        <div className="flex justify-end space-x-2 mt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="min-w-[100px]"
                            >
                                {isSubmitting ? commonT("saving") : commonT("save")}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
