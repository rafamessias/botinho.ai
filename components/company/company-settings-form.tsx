"use client"

import { useCallback, useMemo, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
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
import { AddressAutocompleteInput } from "@/components/company/address-autocomplete-input"
import {
    formatCompanyDocumentForDisplay,
    getCompanyCountryIso,
    getCompanyDocumentMaxLength,
    getDocumentCountryMode,
    normalizeStoredDocument,
    normalizeCompanyCountry,
    type CompanyDocumentType,
} from "@/lib/document-utils"
import { createCompanySettingsSchema } from "@/lib/company-form-schema"

type CompanySettingsFormData = {
    name: string
    description?: string
    country?: string
    documentType?: "cpf" | "cnpj"
    document: string
    address: string
    addressNumber?: string
    zipCode?: string
    complement?: string
    city?: string
    state?: string
}

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

const COUNTRY_OPTIONS = ["Brasil", "United States", "Other"] as const

export const CompanySettingsForm = ({ company, disabled = false, onSuccess }: CompanySettingsFormProps) => {
    const t = useTranslations("Company")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const companySettingsSchema = useMemo(
        () =>
            createCompanySettingsSchema({
                nameRequired: t("form.validation.nameRequired"),
                documentRequired: t("form.validation.documentRequired"),
                addressRequired: t("form.validation.addressRequired"),
            }),
        [t],
    )

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
            country: normalizeCompanyCountry(company.country ?? "Brasil"),
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

    const countryValue = watch("country")
    const documentTypeValue = watch("documentType")
    const documentCountryMode = getDocumentCountryMode(countryValue)
    const countryIso = getCompanyCountryIso(countryValue)

    const documentLabel = useMemo(() => {
        if (documentCountryMode === "brazil") return t("form.documentNumber")
        if (documentCountryMode === "us") return t("form.documentNumberEin")
        return t("form.documentNumberEntity")
    }, [documentCountryMode, t])

    const documentPlaceholder = useMemo(() => {
        if (documentCountryMode === "brazil") return t("form.documentPlaceholder")
        if (documentCountryMode === "us") return t("form.documentPlaceholderEin")
        return t("form.documentPlaceholderEntity")
    }, [documentCountryMode, t])

    const clearAddressFields = useCallback(() => {
        setValue("address", "")
        setValue("addressNumber", "")
        setValue("zipCode", "")
        setValue("complement", "")
        setValue("city", "")
        setValue("state", "")
    }, [setValue])

    const onSubmit = async (data: CompanySettingsFormData) => {
        try {
            setIsSubmitting(true)
            const result = await updateCompanyAction({
                id: company.id,
                ...data,
                document: normalizeStoredDocument(data.document ?? "", data.country),
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
                            aria-required={true}
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

                    {documentCountryMode === "brazil" && (
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
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="company-document">{documentLabel}</Label>
                        <Controller
                            control={control}
                            name="document"
                            render={({ field }) => (
                                <Input
                                    id="company-document"
                                    disabled={disabled}
                                    aria-required={true}
                                    placeholder={documentPlaceholder}
                                    maxLength={getCompanyDocumentMaxLength(
                                        countryValue,
                                        (documentTypeValue ?? "cnpj") as CompanyDocumentType,
                                    )}
                                    value={formatCompanyDocumentForDisplay(
                                        field.value ?? "",
                                        countryValue,
                                        (documentTypeValue ?? "cnpj") as CompanyDocumentType,
                                    )}
                                    onChange={(event) => {
                                        field.onChange(
                                            normalizeStoredDocument(event.target.value, countryValue),
                                        )
                                    }}
                                />
                            )}
                        />
                        {errors.document && (
                            <p className="text-sm text-destructive">{errors.document.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="company-address">{t("form.address")}</Label>
                        <Controller
                            control={control}
                            name="address"
                            render={({ field }) => (
                                <AddressAutocompleteInput
                                    id="company-address"
                                    disabled={disabled}
                                    aria-required={true}
                                    placeholder={t("form.addressPlaceholder")}
                                    countryIso={countryIso}
                                    clearLabel={t("form.clearAddress")}
                                    value={field.value ?? ""}
                                    onValueChange={field.onChange}
                                    onPlaceSelected={(parsed) => {
                                        field.onChange(parsed.address)
                                        setValue("addressNumber", parsed.addressNumber)
                                        setValue("zipCode", parsed.zipCode)
                                        setValue("city", parsed.city)
                                        setValue("state", parsed.state)
                                    }}
                                    onClear={clearAddressFields}
                                />
                            )}
                        />
                        {errors.address && (
                            <p className="text-sm text-destructive">{errors.address.message}</p>
                        )}
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
