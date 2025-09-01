"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Plus, Building2, Users, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { CompanyForm } from "./company-form"
import { CompanyMemberForm } from "./company-member-form"
import { CompanyMemberList } from "./company-member-list"
import { CompanyDetails } from "./company-details"
import { CompanySelector } from "./company-selector"
import {
    getUserCompaniesAction,
    getCompanyAction,
} from "@/components/server-actions/company"

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
    members?: Array<{
        id: number
        isAdmin: boolean
        canPost: boolean
        canApprove: boolean
        isOwner: boolean
        companyMemberStatus: string
        user: {
            id: number
            email: string
            firstName: string
            lastName?: string
            avatarUrl?: string
        }
    }>
    _count?: {
        members: number
    }
}

interface CompanyClientWrapperProps {
    initialCompanies: Company[]
    initialSelectedCompany?: Company | null
}

export function CompanyClientWrapper({ initialCompanies, initialSelectedCompany }: CompanyClientWrapperProps) {
    const t = useTranslations("Company")
    const [companies, setCompanies] = useState<Company[]>(initialCompanies)
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(initialSelectedCompany || null)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const loadCompanies = async () => {
        try {
            setIsLoading(true)
            const result = await getUserCompaniesAction()
            if (result.success && result.companies) {
                setCompanies(result.companies as any)
                if (result.companies.length > 0 && !selectedCompany) {
                    setSelectedCompany(result.companies[0] as any)
                }
            } else {
                toast.error(result.error || "Failed to load companies")
            }
        } catch (error) {
            console.error("Error loading companies:", error)
            toast.error("An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    const loadCompanyDetails = async (companyId: number) => {
        try {
            const result = await getCompanyAction(companyId)
            if (result.success && result.company) {
                setSelectedCompany(result.company as any)
                // Update the company in the companies list
                setCompanies(prev => prev.map(c => c.id === companyId ? result.company as any : c))
            } else {
                toast.error(result.error || "Failed to load company details")
            }
        } catch (error) {
            console.error("Error loading company details:", error)
            toast.error("An unexpected error occurred")
        }
    }

    const handleCompanyCreated = (company: Company) => {
        setIsCreateDialogOpen(false)
        loadCompanies()
        setSelectedCompany(company)
    }

    const handleCompanyUpdated = (company: Company) => {
        setIsEditDialogOpen(false)
        setSelectedCompany(company)
        loadCompanies()
    }

    const handleMemberInvited = () => {
        setIsInviteDialogOpen(false)
        if (selectedCompany) {
            loadCompanyDetails(selectedCompany.id)
        }
    }

    const handleMemberUpdated = () => {
        if (selectedCompany) {
            loadCompanyDetails(selectedCompany.id)
        }
    }

    const handleCompanyChange = (companyId: number) => {
        const company = companies.find(c => c.id === companyId)
        if (company) {
            setSelectedCompany(company)
            loadCompanyDetails(company.id)
        }
    }

    if (companies.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                    <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{t("noCompanies")}</h3>
                    <p className="text-muted-foreground text-center mb-4">
                        {t("noCompaniesDescription")}
                    </p>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                {t("createFirstCompany")}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>{t("createCompany")}</DialogTitle>
                                <DialogDescription>
                                    {t("createCompanyDescription")}
                                </DialogDescription>
                            </DialogHeader>
                            <CompanyForm
                                mode="create"
                                onSuccess={handleCompanyCreated}
                                onCancel={() => setIsCreateDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid gap-6">
            {/* Company Selector */}
            <CompanySelector
                companies={companies}
                selectedCompanyId={selectedCompany?.id}
                onCompanyChange={handleCompanyChange}
            />

            {/* Selected Company Details */}
            {selectedCompany && (
                <>
                    <CompanyDetails
                        company={selectedCompany}
                        onEdit={() => setIsEditDialogOpen(true)}
                    />

                    {/* Company Members */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        {t("members.title")}
                                    </CardTitle>
                                    <CardDescription>
                                        {t("members.description")}
                                    </CardDescription>
                                </div>
                                <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="sm">
                                            <Mail className="mr-2 h-4 w-4" />
                                            {t("members.inviteMember")}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>{t("members.inviteMember")}</DialogTitle>
                                            <DialogDescription>
                                                {t("members.inviteDescription")}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <CompanyMemberForm
                                            companyId={selectedCompany.id}
                                            onSuccess={handleMemberInvited}
                                            onCancel={() => setIsInviteDialogOpen(false)}
                                        />
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CompanyMemberList
                                companyId={selectedCompany.id}
                                members={selectedCompany.members || []}
                                onMemberUpdate={handleMemberUpdated}
                                onInviteClick={() => setIsInviteDialogOpen(true)}
                            />
                        </CardContent>
                    </Card>
                </>
            )}

            {/* Edit Company Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{t("editCompany")}</DialogTitle>
                        <DialogDescription>
                            {t("editCompanyDescription")}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedCompany && (
                        <CompanyForm
                            mode="edit"
                            company={selectedCompany}
                            onSuccess={handleCompanyUpdated}
                            onCancel={() => setIsEditDialogOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
