"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Building2, Edit3 } from "lucide-react"

enum DocumentType {
    cpf = "cpf",
    cnpj = "cnpj"
}

interface Company {
    id: number
    name: string
    documentType?: DocumentType | null
    document?: string | null
    zipCode?: string | null
    state?: string | null
    city?: string | null
    address?: string | null
}

interface CompanyDetailsProps {
    company: Company
    onEdit?: () => void
}

export function CompanyDetails({ company, onEdit }: CompanyDetailsProps) {
    const t = useTranslations("Company")

    const formatDocument = (document?: string | null, type?: DocumentType | null) => {
        if (!document) return ""
        if (type === DocumentType.cpf) {
            // Format CPF: 000.000.000-00
            return document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
        } else if (type === DocumentType.cnpj) {
            // Format CNPJ: 00.000.000/0000-00
            return document.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
        }
        return document
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            {company.name}
                        </CardTitle>
                        <CardDescription>
                            {t("companyDetails")}
                        </CardDescription>
                    </div>
                    {onEdit && (
                        <Button variant="outline" size="sm" onClick={onEdit}>
                            <Edit3 className="h-4 w-4 mr-2" />
                            {t("editCompany")}
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {company.documentType && company.document && (
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                {t(`documentTypes.${company.documentType}`)}
                            </Label>
                            <p className="text-sm">
                                {formatDocument(company.document, company.documentType)}
                            </p>
                        </div>
                    )}
                    {company.address && (
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                {t("form.address")}
                            </Label>
                            <p className="text-sm">{company.address}</p>
                        </div>
                    )}
                    {company.city && (
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                {t("form.city")}
                            </Label>
                            <p className="text-sm">{company.city}</p>
                        </div>
                    )}
                    {company.state && (
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                {t("form.state")}
                            </Label>
                            <p className="text-sm">{company.state}</p>
                        </div>
                    )}
                    {company.zipCode && (
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                {t("form.zipCode")}
                            </Label>
                            <p className="text-sm">{company.zipCode}</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
