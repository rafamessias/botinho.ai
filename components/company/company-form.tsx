"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { toast } from "sonner"
import {
    createCompanyAction,
    updateCompanyAction,
    type CompanyFormData
} from "@/components/server-actions/company"

enum DocumentType {
    cpf = "cpf",
    cnpj = "cnpj"
}

// Company form validation schema
const companyFormSchema = z.object({
    name: z.string().min(2, "Company name must be at least 2 characters"),
    documentType: z.nativeEnum(DocumentType).optional(),
    document: z.string().optional(),
    zipCode: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    address: z.string().optional(),
})

type CompanyFormValues = z.infer<typeof companyFormSchema>

interface CompanyFormProps {
    mode: "create" | "edit"
    company?: {
        id: number
        name: string
        documentType?: DocumentType | null
        document?: string | null
        zipCode?: string | null
        state?: string | null
        city?: string | null
        address?: string | null
    }
    onSuccess?: (company: any) => void
    onCancel?: () => void
}

export function CompanyForm({ mode, company, onSuccess, onCancel }: CompanyFormProps) {
    const t = useTranslations("Company")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<CompanyFormValues>({
        resolver: zodResolver(companyFormSchema),
        defaultValues: {
            name: company?.name || "",
            documentType: company?.documentType || undefined,
            document: company?.document || "",
            zipCode: company?.zipCode || "",
            state: company?.state || "",
            city: company?.city || "",
            address: company?.address || "",
        },
    })

    const onSubmit = async (data: CompanyFormValues) => {
        try {
            setIsSubmitting(true)

            let result
            if (mode === "create") {
                result = await createCompanyAction(data as CompanyFormData)
            } else if (company) {
                result = await updateCompanyAction(company.id, data as CompanyFormData)
            }

            if (result?.success && result.company) {
                toast.success(result.message || t(mode === "create" ? "messages.createSuccess" : "messages.updateSuccess"))
                form.reset()
                onSuccess?.(result.company)
            } else {
                toast.error(result?.error || t("messages.operationFailed"))
            }
        } catch (error) {
            console.error(`Error ${mode}ing company:`, error)
            toast.error(t("messages.unexpectedError"))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">{t("form.name")}</Label>
                    <Input
                        id="name"
                        placeholder={t("form.namePlaceholder")}
                        {...form.register("name")}
                    />
                    {form.formState.errors.name && (
                        <p className="text-sm text-red-500">
                            {form.formState.errors.name.message}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="documentType">{t("form.documentType")}</Label>
                        <Select
                            value={form.watch("documentType")}
                            onValueChange={(value) => form.setValue("documentType", value as DocumentType)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t("form.selectDocumentType")} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={DocumentType.cpf}>{t("documentTypes.cpf")}</SelectItem>
                                <SelectItem value={DocumentType.cnpj}>{t("documentTypes.cnpj")}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="document">{t("form.document")}</Label>
                        <Input
                            id="document"
                            placeholder={t("form.documentPlaceholder")}
                            {...form.register("document")}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="zipCode">{t("form.zipCode")}</Label>
                        <Input
                            id="zipCode"
                            placeholder={t("form.zipCodePlaceholder")}
                            {...form.register("zipCode")}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="state">{t("form.state")}</Label>
                        <Input
                            id="state"
                            placeholder={t("form.statePlaceholder")}
                            {...form.register("state")}
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="city">{t("form.city")}</Label>
                    <Input
                        id="city"
                        placeholder={t("form.cityPlaceholder")}
                        {...form.register("city")}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="address">{t("form.address")}</Label>
                    <Input
                        id="address"
                        placeholder={t("form.addressPlaceholder")}
                        {...form.register("address")}
                    />
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
                    {isSubmitting
                        ? t(mode === "create" ? "form.creating" : "form.updating")
                        : t(mode === "create" ? "form.create" : "form.update")
                    }
                </Button>
            </div>
        </form>
    )
}
