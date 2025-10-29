"use client"

import { useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { useDropzone } from "react-dropzone"
import * as XLSX from "xlsx"
import { IconUpload, IconFileSpreadsheet, IconUserPlus, IconX } from "@tabler/icons-react"
import { inviteMemberAction, bulkInviteMembersAction } from "@/components/server-actions/company"

const inviteMemberSchema = z.object({
    email: z.string().email("Invalid email address"),
    isAdmin: z.boolean().default(false),
    canPost: z.boolean().default(true),
    canApprove: z.boolean().default(false),
})

type InviteMemberFormData = z.infer<typeof inviteMemberSchema>

interface InviteMemberFormProps {
    companyId: number
    onSuccess?: () => void
    onCancel?: () => void
}

interface ExcelMemberRow {
    email: string
    firstName?: string
    lastName?: string
    isAdmin?: boolean | string
    canPost?: boolean | string
    canApprove?: boolean | string
}

export const InviteMemberForm = ({ companyId, onSuccess, onCancel }: InviteMemberFormProps) => {
    const t = useTranslations("Company")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [activeTab, setActiveTab] = useState<"single" | "bulk">("single")
    const [excelData, setExcelData] = useState<ExcelMemberRow[]>([])
    const [parseErrors, setParseErrors] = useState<string[]>([])
    const [isBulkSubmitting, setIsBulkSubmitting] = useState(false)

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
                const members: ExcelMemberRow[] = []

                jsonData.forEach((row: any, index: number) => {
                    const rowNum = index + 2 // +2 because Excel is 1-indexed and we skip header
                    const email = row.email || row.Email || row.EMAIL

                    if (!email) {
                        errors.push(`Row ${rowNum}: Missing email address`)
                        return
                    }

                    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                        errors.push(`Row ${rowNum}: Invalid email format: ${email}`)
                        return
                    }

                    // Convert boolean strings to booleans
                    const normalizeBool = (val: any): boolean => {
                        if (typeof val === "boolean") return val
                        if (typeof val === "string") {
                            const lower = val.toLowerCase().trim()
                            return lower === "true" || lower === "yes" || lower === "1" || lower === "y"
                        }
                        return false
                    }

                    members.push({
                        email: email.trim(),
                        firstName: row.firstName || row.first_name || row["First Name"] || "",
                        lastName: row.lastName || row.last_name || row["Last Name"] || "",
                        isAdmin: normalizeBool(row.isAdmin || row.is_admin || row["Is Admin"] || false),
                        canPost: normalizeBool(row.canPost || row.can_post || row["Can Post"] || true),
                        canApprove: normalizeBool(row.canApprove || row.can_approve || row["Can Approve"] || false),
                    })
                })

                setExcelData(members)
                setParseErrors(errors)

                if (members.length > 0) {
                    toast.success(t("members.excel.parsedSuccess", { count: members.length }))
                }
                if (errors.length > 0) {
                    toast.warning(t("members.excel.parsedWithErrors", { count: errors.length }))
                }
            } catch (error) {
                console.error("Excel parse error:", error)
                toast.error(t("members.excel.parseError"))
                setExcelData([])
                setParseErrors([])
            }
        }
        reader.onerror = () => {
            toast.error(t("members.excel.readError"))
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
            toast.error(t("members.excel.invalidFileType"))
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

    const handleBulkInvite = async () => {
        if (excelData.length === 0) {
            toast.error(t("members.excel.noData"))
            return
        }

        try {
            setIsBulkSubmitting(true)

            const result = await bulkInviteMembersAction({
                companyId,
                members: excelData,
            })

            if (result?.success) {
                const successCount = result.successCount || 0
                const errorCount = result.errorCount || 0

                if (successCount > 0) {
                    toast.success(t("members.excel.bulkSuccess", { count: successCount }))
                }
                if (errorCount > 0) {
                    toast.error(t("members.excel.bulkErrors", { count: errorCount }))
                }

                if (result.errors && result.errors.length > 0) {
                    console.error("Bulk invite errors:", result.errors)
                }

                if (successCount > 0) {
                    onSuccess?.()
                }
            } else {
                toast.error(result?.error || t("members.excel.bulkFailed"))
            }
        } catch (error) {
            console.error("Bulk invite error:", error)
            toast.error(t("members.excel.bulkFailed"))
        } finally {
            setIsBulkSubmitting(false)
        }
    }

    const onSubmit = async (data: InviteMemberFormData) => {
        try {
            setIsSubmitting(true)

            const result = await inviteMemberAction({
                companyId,
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
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "single" | "bulk")}>
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="single">
                            <IconUserPlus className="h-4 w-4 mr-2" />
                            {t("members.excel.singleInvite")}
                        </TabsTrigger>
                        <TabsTrigger value="bulk">
                            <IconFileSpreadsheet className="h-4 w-4 mr-2" />
                            {t("members.excel.bulkImport")}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="single" className="space-y-4">
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
                    </TabsContent>

                    <TabsContent value="bulk" className="space-y-4">
                        <div className="space-y-4">
                            <div>
                                <Label>{t("members.excel.uploadLabel")}</Label>
                                <p className="text-sm text-muted-foreground mb-2">
                                    {t("members.excel.uploadDescription")}
                                </p>
                                <div
                                    {...getRootProps()}
                                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive
                                            ? "border-primary bg-primary/5"
                                            : "border-muted-foreground/25 hover:border-primary/50"
                                        }`}
                                >
                                    <input {...getInputProps()} />
                                    <IconUpload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                    {isDragActive ? (
                                        <p className="text-sm font-medium">{t("members.excel.dropHere")}</p>
                                    ) : (
                                        <div>
                                            <p className="text-sm font-medium mb-1">
                                                {t("members.excel.clickOrDrag")}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {t("members.excel.supportedFormats")}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    {t("members.excel.formatInfo")}
                                </p>
                            </div>

                            {parseErrors.length > 0 && (
                                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                                    <p className="text-sm font-medium text-destructive mb-2">
                                        {t("members.excel.errorsFound", { count: parseErrors.length })}
                                    </p>
                                    <ul className="text-xs text-destructive space-y-1 max-h-32 overflow-y-auto">
                                        {parseErrors.map((error, idx) => (
                                            <li key={idx}>• {error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {excelData.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label>{t("members.excel.preview", { count: excelData.length })}</Label>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setExcelData([])
                                                setParseErrors([])
                                            }}
                                        >
                                            <IconX className="h-4 w-4 mr-1" />
                                            {t("members.excel.clear")}
                                        </Button>
                                    </div>
                                    <div className="border rounded-lg max-h-64 overflow-y-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-muted sticky top-0">
                                                <tr>
                                                    <th className="text-left p-2 font-medium">{t("members.excel.email")}</th>
                                                    <th className="text-left p-2 font-medium">{t("members.excel.firstName")}</th>
                                                    <th className="text-left p-2 font-medium">{t("members.excel.lastName")}</th>
                                                    <th className="text-left p-2 font-medium">{t("members.excel.admin")}</th>
                                                    <th className="text-left p-2 font-medium">{t("members.excel.canPost")}</th>
                                                    <th className="text-left p-2 font-medium">{t("members.excel.canApprove")}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {excelData.map((member, idx) => (
                                                    <tr key={idx} className="border-t">
                                                        <td className="p-2">{member.email}</td>
                                                        <td className="p-2">{member.firstName || "-"}</td>
                                                        <td className="p-2">{member.lastName || "-"}</td>
                                                        <td className="p-2">{member.isAdmin ? "✓" : "-"}</td>
                                                        <td className="p-2">{member.canPost ? "✓" : "-"}</td>
                                                        <td className="p-2">{member.canApprove ? "✓" : "-"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2 pt-4">
                                {onCancel && (
                                    <Button type="button" variant="outline" onClick={onCancel}>
                                        {t("form.cancel")}
                                    </Button>
                                )}
                                <Button
                                    type="button"
                                    onClick={handleBulkInvite}
                                    disabled={isBulkSubmitting || excelData.length === 0}
                                    className="flex-1"
                                >
                                    {isBulkSubmitting
                                        ? t("members.excel.inviting")
                                        : t("members.excel.inviteAll", { count: excelData.length })}
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

