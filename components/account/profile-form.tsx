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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"

import { updateUserProfileAction, updateUserAvatarAction, deleteUserAccountAction } from "@/components/server-actions/user"
import { useUser } from "@/components/user-provider"
import { logoutAction } from "../server-actions/auth"
import { useSession } from "next-auth/react"

export function ProfileForm() {
    const t = useTranslations("Profile")
    const commonT = useTranslations("Common")
    const { user, loading, refreshUser } = useUser()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isAvatarUpdating, setIsAvatarUpdating] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteEmail, setDeleteEmail] = useState("")
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const { update } = useSession()

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
        position: z.string().max(100).optional(),
        companyName: z.string().max(100).optional(),
        country: z.string().max(100).optional(),
        linkedinUrl: z.string().url(t("validation.urlInvalid")).optional().or(z.literal("")),
        twitterUrl: z.string().url(t("validation.urlInvalid")).optional().or(z.literal("")),
        websiteUrl: z.string().url(t("validation.urlInvalid")).optional().or(z.literal("")),
        githubUrl: z.string().url(t("validation.urlInvalid")).optional().or(z.literal("")),
    }), [t])

    type ProfileFormValues = z.infer<typeof profileFormSchema>

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            phone: "",
            position: "",
            companyName: "",
            country: "",
            linkedinUrl: "",
            twitterUrl: "",
            websiteUrl: "",
            githubUrl: "",
        },
    })

    // Update form values when user data loads
    React.useEffect(() => {
        if (user) {
            form.reset({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                phone: user.phone || "",
                position: user.position || "",
                companyName: user.companyName || "",
                country: user.country || "",
                linkedinUrl: user.linkedinUrl || "",
                twitterUrl: user.twitterUrl || "",
                websiteUrl: user.websiteUrl || "",
                githubUrl: user.githubUrl || "",
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

    const handleDeleteAccount = async () => {
        if (!user) return

        try {
            setIsDeleting(true)

            const result = await deleteUserAccountAction(deleteEmail)

            if (result.success) {
                toast.success(t("messages.accountDeleted"))
                await update()
                // Redirect to sign out or home page
                logoutAction(`/sign-in`)
            } else {
                toast.error(result.error || t("messages.deleteFailed"))
            }
        } catch (error) {
            console.error("Account deletion error:", error)
            toast.error(t("messages.unexpectedError"))
        } finally {
            setIsDeleting(false)
            setIsDeleteModalOpen(false)
            setDeleteEmail("")
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="position">{t("profile.position")}</Label>
                                <Input
                                    id="position"
                                    placeholder={t("profile.positionPlaceholder")}
                                    {...form.register("position")}
                                />
                                {form.formState.errors.position && (
                                    <p className="text-sm text-red-500">
                                        {form.formState.errors.position.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="companyName">{t("profile.companyName")}</Label>
                                <Input
                                    id="companyName"
                                    placeholder={t("profile.companyNamePlaceholder")}
                                    {...form.register("companyName")}
                                />
                                {form.formState.errors.companyName && (
                                    <p className="text-sm text-red-500">
                                        {form.formState.errors.companyName.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="country">{t("profile.country")}</Label>
                            <Input
                                id="country"
                                placeholder={t("profile.countryPlaceholder")}
                                {...form.register("country")}
                            />
                            {form.formState.errors.country && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.country.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <h4 className="text-sm font-medium">{t("profile.socialLinks")}</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="linkedinUrl">{t("profile.linkedinUrl")}</Label>
                                    <Input
                                        id="linkedinUrl"
                                        type="url"
                                        placeholder="https://linkedin.com/in/username"
                                        {...form.register("linkedinUrl")}
                                    />
                                    {form.formState.errors.linkedinUrl && (
                                        <p className="text-sm text-red-500">
                                            {form.formState.errors.linkedinUrl.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="twitterUrl">{t("profile.twitterUrl")}</Label>
                                    <Input
                                        id="twitterUrl"
                                        type="url"
                                        placeholder="https://x.com/username"
                                        {...form.register("twitterUrl")}
                                    />
                                    {form.formState.errors.twitterUrl && (
                                        <p className="text-sm text-red-500">
                                            {form.formState.errors.twitterUrl.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="websiteUrl">{t("profile.websiteUrl")}</Label>
                                    <Input
                                        id="websiteUrl"
                                        type="url"
                                        placeholder="https://example.com"
                                        {...form.register("websiteUrl")}
                                    />
                                    {form.formState.errors.websiteUrl && (
                                        <p className="text-sm text-red-500">
                                            {form.formState.errors.websiteUrl.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="githubUrl">{t("profile.githubUrl")}</Label>
                                    <Input
                                        id="githubUrl"
                                        type="url"
                                        placeholder="https://github.com/username"
                                        {...form.register("githubUrl")}
                                    />
                                    {form.formState.errors.githubUrl && (
                                        <p className="text-sm text-red-500">
                                            {form.formState.errors.githubUrl.message}
                                        </p>
                                    )}
                                </div>
                            </div>
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

            {/* Delete Account Section */}
            <Card className="border-destructive/20 border-2 shadow-none p-4">
                <CardHeader className="p-0">
                    <CardTitle className="text-destructive">{t("deleteAccount.title")}</CardTitle>
                    <CardDescription>{t("deleteAccount.description")}</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            {t("deleteAccount.warning")}
                        </p>

                        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                            <DialogTrigger asChild>
                                <Button variant="destructive" className="w-full sm:w-auto">
                                    {t("deleteAccount.button")}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2 text-destructive">
                                        <AlertTriangle className="h-5 w-5" />
                                        {t("deleteAccount.modal.title")}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {t("deleteAccount.modal.description")}
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="deleteEmail">
                                            {t("deleteAccount.modal.emailLabel")}
                                        </Label>
                                        <Input
                                            id="deleteEmail"
                                            type="email"
                                            placeholder={user.email}
                                            value={deleteEmail}
                                            onChange={(e) => setDeleteEmail(e.target.value)}
                                            className="font-mono"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            {t("deleteAccount.modal.emailNote")}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-destructive/10 p-4">
                                        <h4 className="font-medium text-destructive mb-2">
                                            {t("deleteAccount.modal.consequences.title")}
                                        </h4>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• {t("deleteAccount.modal.consequences.account")}</li>
                                            <li>• {t("deleteAccount.modal.consequences.teams")}</li>
                                            <li>• {t("deleteAccount.modal.consequences.data")}</li>
                                            <li>• {t("deleteAccount.modal.consequences.irreversible")}</li>
                                        </ul>
                                    </div>
                                </div>

                                <DialogFooter className="flex-col sm:flex-row gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsDeleteModalOpen(false)
                                            setDeleteEmail("")
                                        }}
                                        disabled={isDeleting}
                                    >
                                        {commonT("cancel")}
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={handleDeleteAccount}
                                        disabled={isDeleting || deleteEmail !== user.email}
                                        className="min-w-[100px]"
                                    >
                                        {isDeleting ? commonT("deleting") : t("deleteAccount.modal.confirm")}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
