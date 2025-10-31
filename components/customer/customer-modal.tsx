"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
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
import type { Customer, CustomerStatus } from "@/lib/types/customer"

const statusOptions = ["active", "inactive", "prospect"] as const satisfies CustomerStatus[]

const useCustomerSchema = (messages: {
    nameRequired: string
    emailRequired: string
}) =>
    z.object({
        name: z
            .string({ required_error: messages.nameRequired })
            .trim()
            .min(1, messages.nameRequired),
        email: z
            .string({ required_error: messages.emailRequired })
            .trim()
            .min(1, messages.emailRequired)
            .email(messages.emailRequired),
        phone: z
            .string()
            .trim()
            .optional(),
        company: z
            .string()
            .trim()
            .optional(),
        status: z.enum(statusOptions),
    })

type CustomerSchema = ReturnType<typeof useCustomerSchema>
export type CustomerFormValues = z.infer<CustomerSchema>

type CustomerModalProps = {
    isOpen: boolean
    mode: "create" | "edit"
    onClose: () => void
    onSubmit: (values: CustomerFormValues) => Promise<void> | void
    initialCustomer?: Customer | null
    isSubmitting?: boolean
}

export const CustomerModal = ({
    isOpen,
    mode,
    onClose,
    onSubmit,
    initialCustomer,
    isSubmitting = false,
}: CustomerModalProps) => {
    const t = useTranslations("Customer")

    const schema = useCustomerSchema({
        nameRequired: t("form.validation.nameRequired"),
        emailRequired: t("form.validation.emailRequired"),
    })

    const form = useForm<CustomerFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: initialCustomer?.name ?? "",
            email: initialCustomer?.email ?? "",
            phone: initialCustomer?.phone ?? "",
            company: initialCustomer?.company ?? "",
            status: initialCustomer?.status ?? "active",
        },
    })

    useEffect(() => {
        if (!isOpen) {
            return
        }

        form.reset({
            name: initialCustomer?.name ?? "",
            email: initialCustomer?.email ?? "",
            phone: initialCustomer?.phone ?? "",
            company: initialCustomer?.company ?? "",
            status: initialCustomer?.status ?? "active",
        })
    }, [form, initialCustomer, isOpen])

    const handleClose = (nextOpen: boolean) => {
        if (nextOpen) {
            return
        }

        onClose()
    }

    const handleSubmit = async (values: CustomerFormValues) => {
        const normalizedValues: CustomerFormValues = {
            ...values,
            name: values.name.trim(),
            email: values.email.trim(),
            phone: values.phone?.trim() ? values.phone.trim() : undefined,
            company: values.company?.trim() ? values.company.trim() : undefined,
        }

        await onSubmit(normalizedValues)
    }

    const dialogTitle = mode === "create" ? t("form.title.create") : t("form.title.edit")
    const dialogDescription = mode === "create" ? t("form.description.create") : t("form.description.edit")

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-lg space-y-6 p-6">
                <DialogHeader className="space-y-1">
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogDescription>{dialogDescription}</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        className="grid gap-5"
                        onSubmit={form.handleSubmit(handleSubmit)}
                    >
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
                                        <Input
                                            {...field}
                                            value={field.value ?? ""}
                                            onChange={(event) => field.onChange(event.target.value)}
                                            placeholder={t("form.fields.phone.placeholder")}
                                            type="tel"
                                            autoComplete="tel"
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

                        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                {t("form.buttons.cancel")}
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {mode === "create"
                                    ? t("form.buttons.save")
                                    : t("form.buttons.update")}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

