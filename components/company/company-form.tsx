"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { createCompanyAction, updateCompanyAction } from "@/components/server-actions/company"

const companySchema = z.object({
    name: z.string().min(2, "Company name must be at least 2 characters"),
    description: z.string().optional(),
})

type CompanyFormData = z.infer<typeof companySchema>

interface CompanyFormProps {
    company?: {
        id: number
        name: string
        description?: string | null
    }
    onSuccess?: (newCompanyId?: number) => void
    onCancel?: () => void
}

export const CompanyForm = ({ company, onSuccess, onCancel }: CompanyFormProps) => {
    const t = useTranslations("Company")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CompanyFormData>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            name: company?.name || "",
            description: company?.description || "",
        },
    })

    const onSubmit = async (data: CompanyFormData) => {
        try {
            setIsSubmitting(true)

            let result
            if (company) {
                result = await updateCompanyAction({
                    id: company.id,
                    ...data,
                })
            } else {
                result = await createCompanyAction(data)
            }

            if (result?.success) {
                toast.success(result.message)
                // Pass the company ID for new companies, undefined for updates
                const newCompanyId = company ? undefined : result.company?.id
                onSuccess?.(newCompanyId)
            } else {
                toast.error(result?.error || "Operation failed")
            }
        } catch (error) {
            console.error("Company form error:", error)
            toast.error("An unexpected error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {company ? t("editCompany") : t("createCompany")}
                </CardTitle>
                <CardDescription>
                    {company ? t("editCompanyDescription") : t("createCompanyDescription")}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">{t("form.name")}</Label>
                        <Input
                            autoFocus
                            id="name"
                            placeholder={t("form.namePlaceholder")}
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">{t("form.description")}</Label>
                        <Textarea
                            id="description"
                            placeholder={t("form.descriptionPlaceholder")}
                            {...register("description")}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="flex gap-2 pt-4">

                        {onCancel && (
                            <Button type="button" variant="outline" onClick={onCancel}>
                                {t("form.cancel")}
                            </Button>
                        )}
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? (company ? t("form.updating") : t("form.creating"))
                                : (company ? t("form.update") : t("form.create"))
                            }
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

