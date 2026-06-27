"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { updateCompanyAction } from "@/components/server-actions/company"

const companySettingsSchema = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    country: z.string().optional(),
    documentType: z.enum(["cpf", "cnpj"]).optional(),
    document: z.string().optional(),
    address: z.string().optional(),
    addressNumber: z.string().optional(),
    zipCode: z.string().optional(),
    complement: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
})

type CompanySettingsFormData = z.infer<typeof companySettingsSchema>

export type CompanySettings = {
    id: string
    name: string
    description?: string | null
    country?: string | null
    documentType?: "cpf" | "cnpj" | null
    document?: string | null
    address?: string | null
    addressNumber?: string | null
    zipCode?: string | null
    complement?: string | null
    city?: string | null
    state?: string | null
}

type CompanySettingsFormProps = {
    company: CompanySettings
    disabled?: boolean
    onSuccess?: () => void
}

const COUNTRY_OPTIONS = ["Brasil", "United States", "Portugal"] as const

export const CompanySettingsForm = ({ company, disabled = false, onSuccess }: CompanySettingsFormProps) => {
    const t = useTranslations("Company")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CompanySettingsFormData>({
        resolver: zodResolver(companySettingsSchema),
        defaultValues: {
            name: company.name ?? "",
            description: company.description ?? "",
            country: company.country ?? "Brasil",
            documentType: company.documentType ?? "cnpj",
            document: company.document ?? "",
            address: company.address ?? "",
            addressNumber: company.addressNumber ?? "",
            zipCode: company.zipCode ?? "",
            complement: company.complement ?? "",
            city: company.city ?? "",
            state: company.state ?? "",
        },
    })

    const addressValue = watch("address")

    const onSubmit = async (data: CompanySettingsFormData) => {
        try {
            setIsSubmitting(true)
            const result = await updateCompanyAction({
                id: company.id,
                ...data,
            })

            if (result?.success) {
                toast.success(result.message)
                onSuccess?.()
            } else {
                toast.error(result?.error || t("messages.updateFailed"))
            }
        } catch (error) {
            console.error("Company settings form error:", error)
            toast.error(t("messages.unexpectedError"))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card className="border-border/60 bg-card/50 shadow-sm">
            <CardContent className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="company-name">{t("form.name")}</Label>
                        <Input
                            id="company-name"
                            disabled={disabled}
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="company-description">{t("form.description")}</Label>
                        <Textarea
                            id="company-description"
                            disabled={disabled}
                            placeholder={t("form.descriptionHint")}
                            rows={3}
                            {...register("description")}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="company-country">{t("form.country")}</Label>
                        <Controller
                            control={control}
                            name="country"
                            render={({ field }) => (
                                <Select
                                    disabled={disabled}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger id="company-country" className="w-full">
                                        <SelectValue placeholder={t("form.countryPlaceholder")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COUNTRY_OPTIONS.map((country) => (
                                            <SelectItem key={country} value={country}>
                                                {country}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div className="space-y-3">
                        <Label>{t("form.documentType")}</Label>
                        <Controller
                            control={control}
                            name="documentType"
                            render={({ field }) => (
                                <RadioGroup
                                    disabled={disabled}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    className="flex flex-row gap-6"
                                >
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value="cnpj" id="document-cnpj" />
                                        <Label htmlFor="document-cnpj" className="font-normal">
                                            {t("documentTypes.cnpj")}
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value="cpf" id="document-cpf" />
                                        <Label htmlFor="document-cpf" className="font-normal">
                                            {t("documentTypes.cpf")}
                                        </Label>
                                    </div>
                                </RadioGroup>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="company-document">{t("form.documentNumber")}</Label>
                        <Input
                            id="company-document"
                            disabled={disabled}
                            placeholder={t("form.documentPlaceholder")}
                            {...register("document")}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="company-address">{t("form.address")}</Label>
                        <div className="relative">
                            <Input
                                id="company-address"
                                disabled={disabled}
                                placeholder={t("form.addressPlaceholder")}
                                className="pr-10"
                                {...register("address")}
                            />
                            {addressValue && !disabled && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1/2 size-7 -translate-y-1/2"
                                    onClick={() => setValue("address", "")}
                                    aria-label={t("form.clearAddress")}
                                >
                                    <X className="size-4" aria-hidden="true" />
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="company-number">{t("form.number")}</Label>
                            <Input
                                id="company-number"
                                disabled={disabled}
                                {...register("addressNumber")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company-zip">{t("form.zipCode")}</Label>
                            <Input
                                id="company-zip"
                                disabled={disabled}
                                placeholder={t("form.zipCodePlaceholder")}
                                {...register("zipCode")}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="company-complement">{t("form.complement")}</Label>
                        <Input
                            id="company-complement"
                            disabled={disabled}
                            {...register("complement")}
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
                        <div className="space-y-2">
                            <Label htmlFor="company-city">{t("form.city")}</Label>
                            <Input
                                id="company-city"
                                disabled={disabled}
                                placeholder={t("form.cityPlaceholder")}
                                {...register("city")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company-state">{t("form.state")}</Label>
                            <Input
                                id="company-state"
                                disabled={disabled}
                                placeholder={t("form.statePlaceholder")}
                                {...register("state")}
                            />
                        </div>
                    </div>

                    {!disabled && (
                        <div className="flex justify-end pt-2">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? t("form.saving") : t("form.save")}
                            </Button>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    )
}
