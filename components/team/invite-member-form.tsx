"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { inviteMemberAction } from "@/components/server-actions/team"

const inviteMemberSchema = z.object({
    email: z.string().email("Invalid email address"),
    isAdmin: z.boolean().default(false),
    canPost: z.boolean().default(true),
    canApprove: z.boolean().default(false),
})

type InviteMemberFormData = z.infer<typeof inviteMemberSchema>

interface InviteMemberFormProps {
    teamId: number
    onSuccess?: () => void
    onCancel?: () => void
}

export const InviteMemberForm = ({ teamId, onSuccess, onCancel }: InviteMemberFormProps) => {
    const t = useTranslations("Team")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<InviteMemberFormData>({
        resolver: zodResolver(inviteMemberSchema),
        defaultValues: {
            email: "",
            isAdmin: false,
            canPost: true,
            canApprove: false,
        },
    })

    const watchedIsAdmin = watch("isAdmin")

    const onSubmit = async (data: InviteMemberFormData) => {
        try {
            setIsSubmitting(true)

            const result = await inviteMemberAction({
                teamId,
                ...data,
            })

            if (result?.success) {
                toast.success(result.message)
                onSuccess?.()
            } else {
                toast.error(result?.error || "Failed to invite member")
            }
        } catch (error) {
            console.error("Invite member error:", error)
            toast.error("An unexpected error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("members.inviteMember")}</CardTitle>
                <CardDescription>{t("members.inviteDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">{t("members.email")}</Label>
                        <Input
                            autoFocus
                            id="email"
                            type="email"
                            placeholder={t("members.emailPlaceholder")}
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-3">
                        <Label>{t("members.permissions")}</Label>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isAdmin"
                                checked={watchedIsAdmin}
                                onCheckedChange={(checked) => setValue("isAdmin", checked as boolean)}
                            />
                            <Label htmlFor="isAdmin" className="text-sm font-normal">
                                {t("members.isAdmin")}
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="canPost"
                                checked={watch("canPost")}
                                onCheckedChange={(checked) => setValue("canPost", checked as boolean)}
                            />
                            <Label htmlFor="canPost" className="text-sm font-normal">
                                {t("members.canPost")}
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="canApprove"
                                checked={watch("canApprove")}
                                onCheckedChange={(checked) => setValue("canApprove", checked as boolean)}
                            />
                            <Label htmlFor="canApprove" className="text-sm font-normal">
                                {t("members.canApprove")}
                            </Label>
                        </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                        {onCancel && (
                            <Button type="button" variant="outline" onClick={onCancel}>
                                {t("form.cancel")}
                            </Button>
                        )}
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? t("members.inviting") : t("members.sendInvite")}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
