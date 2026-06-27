"use client"

import { useEffect, useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useDropzone } from "react-dropzone"
import * as XLSX from "xlsx"
import { Upload, X, Download } from "lucide-react"
import { toast } from "sonner"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { CustomerFormFields } from "@/components/customer/customer-form-fields"
import { downloadCustomerImportTemplate } from "@/lib/customer/customer-import-template"
import type { Customer, CustomerStatus } from "@/lib/types/customer"

const statusOptions = ["active", "inactive", "prospect"] as const satisfies CustomerStatus[]

const useCustomerSchema = (messages: {
    nameRequired: string
    invalidEmail: string
    phoneRequired: string
}) =>
    z.object({
        name: z
            .string({ required_error: messages.nameRequired })
            .trim()
            .min(1, messages.nameRequired),
        email: z
            .string()
            .trim()
            .refine((value) => value === "" || z.string().email().safeParse(value).success, {
                message: messages.invalidEmail,
            })
            .transform((value) => (value === "" ? undefined : value)),
        phone: z
            .string({ required_error: messages.phoneRequired })
            .trim()
            .min(1, messages.phoneRequired),
        company: z
            .string()
            .trim()
            .optional(),
        description: z
            .string()
            .trim()
            .max(1000)
            .optional(),
        tags: z.array(z.string()).max(20).default([]),
        status: z.enum(statusOptions),
    })

type CustomerSchema = ReturnType<typeof useCustomerSchema>
export type CustomerFormValues = z.infer<CustomerSchema>

type ExcelCustomerRow = {
    name: string
    email?: string
    phone: string
    company?: string
    status: CustomerStatus
}

type CustomerModalProps = {
    isOpen: boolean
    mode: "create" | "edit"
    onClose: () => void
    onSubmit: (values: CustomerFormValues) => Promise<void> | void
    initialCustomer?: Customer | null
    isSubmitting?: boolean
    onBulkImport?: (customers: Omit<Customer, "id" | "createdAt" | "updatedAt">[]) => Promise<void> | void
    tagSuggestions?: string[]
}

export const CustomerModal = ({
    isOpen,
    mode,
    onClose,
    onSubmit,
    initialCustomer,
    isSubmitting = false,
    onBulkImport,
    tagSuggestions = [],
}: CustomerModalProps) => {
    const t = useTranslations("Customer")
    const [activeTab, setActiveTab] = useState<"single" | "bulk">("single")
    const [excelData, setExcelData] = useState<ExcelCustomerRow[]>([])
    const [parseErrors, setParseErrors] = useState<string[]>([])
    const [isBulkSubmitting, setIsBulkSubmitting] = useState(false)

    const schema = useCustomerSchema({
        nameRequired: t("form.validation.nameRequired"),
        invalidEmail: t("form.validation.invalidEmail"),
        phoneRequired: t("form.validation.phoneRequired"),
    })

    const form = useForm<CustomerFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: initialCustomer?.name ?? "",
            email: initialCustomer?.email ?? "",
            phone: initialCustomer?.phone ?? "",
            company: initialCustomer?.company ?? "",
            description: initialCustomer?.description ?? "",
            tags: initialCustomer?.tags ?? [],
            status: initialCustomer?.status ?? "active",
        },
    })

    useEffect(() => {
        if (!isOpen) {
            return
        }

        if (mode === "edit") {
            setActiveTab("single")
        }

        form.reset({
            name: initialCustomer?.name ?? "",
            email: initialCustomer?.email ?? "",
            phone: initialCustomer?.phone ?? "",
            company: initialCustomer?.company ?? "",
            description: initialCustomer?.description ?? "",
            tags: initialCustomer?.tags ?? [],
            status: initialCustomer?.status ?? "active",
        })
    }, [form, initialCustomer, isOpen, mode])

    useEffect(() => {
        if (!isOpen) {
            setActiveTab("single")
            setExcelData([])
            setParseErrors([])
        }
    }, [isOpen])

    const parseExcelFile = useCallback((file: File) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const data = e.target?.result
                if (!data) return

                const workbook = XLSX.read(data, { type: "binary" })
                const firstSheetName = workbook.SheetNames[0]
                const worksheet = workbook.Sheets[firstSheetName]
                const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[]

                const errors: string[] = []
                const customers: ExcelCustomerRow[] = []

                jsonData.forEach((row: any, index: number) => {
                    const rowNum = index + 2 // +2 because Excel is 1-indexed and we skip header
                    const name = row.name || row.Name || row.NAME
                    const email = row.email || row.Email || row.EMAIL
                    const phone = row.phone || row.Phone || row.PHONE

                    if (!name) {
                        errors.push(`Row ${rowNum}: Missing name`)
                        return
                    }

                    if (!phone) {
                        errors.push(`Row ${rowNum}: Missing phone number`)
                        return
                    }

                    if (
                        email &&
                        (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                    ) {
                        errors.push(`Row ${rowNum}: Invalid email format: ${email}`)
                        return
                    }

                    const statusValue = row.status || row.Status || row.STATUS || "active"
                    const validStatus = statusOptions.includes(statusValue)
                    
                    if (!validStatus) {
                        errors.push(`Row ${rowNum}: Invalid status. Must be one of: active, inactive, prospect`)
                        return
                    }

                    customers.push({
                        name: String(name).trim(),
                        email: email ? String(email).trim() : undefined,
                        phone: String(phone).trim(),
                        company: row.company || row.Company || row.COMPANY ? String(row.company || row.Company || row.COMPANY).trim() : undefined,
                        status: statusValue as CustomerStatus,
                    })
                })

                setExcelData(customers)
                setParseErrors(errors)

                if (customers.length > 0) {
                    toast.success(t("import.parsedSuccess", { count: customers.length }))
                }
                if (errors.length > 0) {
                    toast.warning(t("import.parsedWithErrors", { count: errors.length }))
                }
            } catch (error) {
                console.error("Excel parse error:", error)
                toast.error(t("import.parseError"))
                setExcelData([])
                setParseErrors([])
            }
        }
        reader.onerror = () => {
            toast.error(t("import.readError"))
        }
        reader.readAsBinaryString(file)
    }, [t])

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (!file) return

        const validTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
            "application/vnd.ms-excel", // .xls
            "text/csv", // .csv
        ]

        if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
            toast.error(t("import.invalidFileType"))
            return
        }

        parseExcelFile(file)
    }, [parseExcelFile, t])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
            "application/vnd.ms-excel": [".xls"],
            "text/csv": [".csv"],
        },
        multiple: false,
    })

    const handleBulkImport = async () => {
        if (!onBulkImport) return
        if (excelData.length === 0) {
            toast.error(t("import.noData"))
            return
        }

        try {
            setIsBulkSubmitting(true)

            const customersToImport = excelData.map((row) => ({
                name: row.name,
                email: row.email,
                phone: row.phone,
                company: row.company,
                tags: [],
                status: row.status,
            }))

            await onBulkImport(customersToImport)

            setExcelData([])
            setParseErrors([])
            setActiveTab("single")
        } catch (error) {
            console.error("Bulk import error:", error)
            toast.error(t("messages.customersImportError"))
            setIsBulkSubmitting(false)
        }
    }

    const handleClearBulkImport = () => {
        setExcelData([])
        setParseErrors([])
    }

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
            email: values.email?.trim() ? values.email.trim() : undefined,
            phone: values.phone.trim(),
            company: values.company?.trim() ? values.company.trim() : undefined,
            description: values.description?.trim() ? values.description.trim() : undefined,
            tags: values.tags,
        }

        await onSubmit(normalizedValues)
    }

    const dialogTitle = mode === "create" ? t("form.title.create") : t("form.title.edit")
    const dialogDescription = mode === "create" ? t("form.description.create") : t("form.description.edit")

    const showTabs = mode === "create" && onBulkImport

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-h-[90vh] max-w-lg space-y-6 overflow-y-auto p-6">
                <DialogHeader className="space-y-1">
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogDescription>{dialogDescription}</DialogDescription>
                </DialogHeader>

                {showTabs && (
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "single" | "bulk")}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="single">{t("import.singleCustomer")}</TabsTrigger>
                            <TabsTrigger value="bulk">{t("import.bulkImport")}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="bulk" className="mt-4 space-y-4">
                            <div className="space-y-2">
                                <div
                                    {...getRootProps()}
                                    className={cn(
                                        "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 p-8 transition-colors",
                                        isDragActive && "border-primary bg-muted"
                                    )}
                                >
                                    <input {...getInputProps()} />
                                    <Upload className="mb-2 size-8 text-muted-foreground" />
                                    <p className="text-center text-sm font-medium">{t("import.clickOrDrag")}</p>
                                    <p className="mt-1 text-center text-xs text-muted-foreground">{t("import.supportedFormats")}</p>
                                </div>

                                <p className="text-center text-xs text-muted-foreground">{t("import.formatInfo")}</p>
                                <div className="flex justify-center">
                                    <Button
                                        type="button"
                                        variant="link"
                                        size="sm"
                                        className="h-auto p-0 text-xs"
                                        onClick={downloadCustomerImportTemplate}
                                    >
                                        <Download className="mr-1 size-3.5" />
                                        {t("import.downloadTemplate")}
                                    </Button>
                                </div>
                            </div>

                            {excelData.length > 0 && (
                                <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">{t("import.preview", { count: excelData.length })}</p>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleClearBulkImport}
                                            disabled={isBulkSubmitting}
                                        >
                                            <X className="mr-2 size-4" />
                                            {t("import.clear")}
                                        </Button>
                                    </div>

                                    {parseErrors.length > 0 && (
                                        <div className="rounded border border-destructive/50 bg-destructive/10 p-3">
                                            <p className="text-xs font-medium text-destructive">{t("import.errorsFound", { count: parseErrors.length })}</p>
                                            <ul className="mt-1 max-h-32 overflow-y-auto text-xs text-destructive">
                                                {parseErrors.slice(0, 5).map((error, index) => (
                                                    <li key={index}>{error}</li>
                                                ))}
                                                {parseErrors.length > 5 && <li>...and {parseErrors.length - 5} more</li>}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={isBulkSubmitting}
                                >
                                    {t("form.buttons.cancel")}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleBulkImport}
                                    disabled={isBulkSubmitting || excelData.length === 0}
                                >
                                    {isBulkSubmitting
                                        ? t("import.importing")
                                        : t("import.importAll", { count: excelData.length })}
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="single" className="mt-4">
                            <Form {...form}>
                                <form
                                    className="grid gap-5"
                                    onSubmit={form.handleSubmit(handleSubmit)}
                                >
                                    <CustomerFormFields
                                        form={form}
                                        t={t}
                                        tagSuggestions={tagSuggestions}
                                        disabled={isSubmitting}
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
                        </TabsContent>
                    </Tabs>
                )}

                {!showTabs && (
                    <Form {...form}>
                        <form
                            className="grid gap-5"
                            onSubmit={form.handleSubmit(handleSubmit)}
                        >
                            <CustomerFormFields
                                form={form}
                                t={t}
                                tagSuggestions={tagSuggestions}
                                disabled={isSubmitting}
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
                )}
            </DialogContent>
        </Dialog>
    )
}

