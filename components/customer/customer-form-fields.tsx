"use client"

import type { UseFormReturn } from "react-hook-form"

import { TagInput } from "@/components/ui/tag-input"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input"
import { Textarea } from "@/components/ui/textarea"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { CustomerStatus } from "@/lib/types/customer"
import type { CustomerFormValues } from "@/components/customer/customer-modal"

const statusOptions = ["active", "inactive", "prospect"] as const satisfies CustomerStatus[]

type CustomerFormFieldsProps = {
    form: UseFormReturn<CustomerFormValues>
    t: (key: string, values?: Record<string, string | number>) => string
    tagSuggestions: string[]
    disabled?: boolean
}

export const CustomerFormFields = ({
    form,
    t,
    tagSuggestions,
    disabled = false,
}: CustomerFormFieldsProps) => (
    <>
        <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t("form.fields.name.label")}</FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value)}
                            placeholder={t("form.fields.name.placeholder")}
                            autoComplete="name"
                            disabled={disabled}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />

        <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t("form.fields.email.label")}</FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value)}
                            placeholder={t("form.fields.email.placeholder")}
                            type="email"
                            autoComplete="email"
                            disabled={disabled}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />

        <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t("form.fields.phone.label")}</FormLabel>
                    <FormControl>
                        <PhoneInput
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            placeholder={t("form.fields.phone.placeholder")}
                            autoComplete="tel"
                            disabled={disabled}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />

        <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t("form.fields.company.label")}</FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value)}
                            placeholder={t("form.fields.company.placeholder")}
                            autoComplete="organization"
                            disabled={disabled}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />

        <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t("form.fields.description.label")}</FormLabel>
                    <FormControl>
                        <Textarea
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value)}
                            placeholder={t("form.fields.description.placeholder")}
                            rows={3}
                            disabled={disabled}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />

        <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t("form.fields.tags.label")}</FormLabel>
                    <FormControl>
                        <TagInput
                            value={field.value ?? []}
                            onChange={field.onChange}
                            suggestions={tagSuggestions}
                            placeholder={t("form.fields.tags.placeholder")}
                            searchPlaceholder={t("form.fields.tags.searchPlaceholder")}
                            emptyLabel={t("form.fields.tags.empty")}
                            createLabel={(tag) => t("form.fields.tags.create", { tag })}
                            disabled={disabled}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />

        <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t("form.fields.status.label")}</FormLabel>
                    <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                        disabled={disabled}
                    >
                        <FormControl>
                            <SelectTrigger aria-label={t("form.fields.status.label")}>
                                <SelectValue placeholder={t("form.fields.status.placeholder")} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {statusOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {t(`table.badges.${option}`)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    </>
)
