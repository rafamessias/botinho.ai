"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { toast } from "sonner"
import {
    inviteCompanyMemberAction,
    type CompanyMemberFormData
} from "@/components/server-actions/company"

// Member invitation form validation schema
const memberFormSchema = z.object({
    email: z.string().email("Invalid email address"),
    isAdmin: z.boolean().default(false),
    canPost: z.boolean().default(false),
    canApprove: z.boolean().default(false),
})

type MemberFormValues = z.infer<typeof memberFormSchema>

interface CompanyMemberFormProps {
    companyId: number
    onSuccess?: () => void
    onCancel?: () => void
}

export function CompanyMemberForm({ companyId, onSuccess, onCancel }: CompanyMemberFormProps) {
    const t = useTranslations("Company")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<MemberFormValues>({
        resolver: zodResolver(memberFormSchema),
        defaultValues: {
            email: "",
            isAdmin: false,
            canPost: false,
            canApprove: false,
        },
    })

    const onSubmit = async (data: MemberFormValues) => {
        try {
            setIsSubmitting(true)
            const result = await inviteCompanyMemberAction(companyId, data as CompanyMemberFormData)

            if (result.success) {
                toast.success(result.message || t("members.inviteSuccess"))
                form.reset()
                onSuccess?.()
            } else {
                toast.error(result.error || t("members.inviteFailed"))
            }
        } catch (error) {
            console.error("Error inviting member:", error)
            toast.error(t("messages.unexpectedError"))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">{t("members.email")}</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder={t("members.emailPlaceholder")}
                        {...form.register("email")}
                    />
                    {form.formState.errors.email && (
                        <p className="text-sm text-red-500">
                            {form.formState.errors.email.message}
                        </p>
                    )}
                </div>

                <div className="space-y-3">
                    <Label>{t("members.permissions")}</Label>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isAdmin"
                                checked={form.watch("isAdmin")}
                                onCheckedChange={(checked) => form.setValue("isAdmin", checked as boolean)}
                            />
                            <Label htmlFor="isAdmin" className="text-sm">
                                {t("members.isAdmin")}
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="canPost"
                                checked={form.watch("canPost")}
                                onCheckedChange={(checked) => form.setValue("canPost", checked as boolean)}
                            />
                            <Label htmlFor="canPost" className="text-sm">
                                {t("members.canPost")}
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="canApprove"
                                checked={form.watch("canApprove")}
                                onCheckedChange={(checked) => form.setValue("canApprove", checked as boolean)}
                            />
                            <Label htmlFor="canApprove" className="text-sm">
                                {t("members.canApprove")}
                            </Label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        {t("form.cancel")}
                    </Button>
                )}
                <Button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? t("members.inviting") : t("members.sendInvite")}
                </Button>
            </div>
        </form>
    )
}
