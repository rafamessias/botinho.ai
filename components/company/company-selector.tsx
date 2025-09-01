"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Company {
    id: number
    name: string
}

interface CompanySelectorProps {
    companies: Company[]
    selectedCompanyId?: number
    onCompanyChange?: (companyId: number) => void
}

export function CompanySelector({ companies, selectedCompanyId, onCompanyChange }: CompanySelectorProps) {
    const t = useTranslations("Company")

    if (companies.length <= 1) {
        return null
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("selectCompany")}</CardTitle>
            </CardHeader>
            <CardContent>
                <Select
                    value={selectedCompanyId?.toString()}
                    onValueChange={(value) => onCompanyChange?.(parseInt(value))}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {companies.map((company) => (
                            <SelectItem key={company.id} value={company.id.toString()}>
                                {company.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardContent>
        </Card>
    )
}
