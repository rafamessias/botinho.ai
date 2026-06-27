"use client"

import { useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { IconPlus, IconUsers } from "@tabler/icons-react"
import { toast } from "sonner"
import { CompanyForm } from "@/components/company/company-form"
import { CompanySettingsForm } from "@/components/company/company-settings-form"
import { InviteMemberForm } from "@/components/company/invite-member-form"
import { CompanyMembers } from "@/components/company/company-members"
import type { CompanyMemberRow } from "@/components/company/company-member-columns"
import { useUser } from "@/components/user-provider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Company {
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
    members: CompanyMemberRow[]
}

interface CompanyDashboardProps {
    initialCompanies: Company[]
    currentUserId: string
}

export const CompanyDashboard = ({ initialCompanies, currentUserId }: CompanyDashboardProps) => {
    const t = useTranslations("Company")
    const { user, refreshUser } = useUser()
    const [companies, setCompanies] = useState<Company[]>(initialCompanies)
    const selectedCompany =
        companies.find((company) => String(company.id) === String(user?.defaultCompanyId)) ??
        companies[0] ??
        null

    const currentUserIdFromContext = String(user?.id || currentUserId)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [showInviteForm, setShowInviteForm] = useState(false)
    const addMemberRef = useRef<((member: CompanyMemberRow) => void) | null>(null)

    const handleMemberAdded = (newMember: CompanyMemberRow) => {
        if (!selectedCompany) return

        if (addMemberRef.current) {
            addMemberRef.current(newMember)
        }

        setCompanies((previousCompanies) =>
            previousCompanies.map((company) =>
                company.id === selectedCompany.id
                    ? { ...company, members: [...company.members, newMember] }
                    : company,
            ),
        )
    }

    const handleCompanyUpdate = async (newCompanyId?: string) => {
        try {
            await refreshUser(true)
            toast.success(t("messages.companiesUpdated"))
            if (newCompanyId) {
                // noop: refreshUser updates companies in context
            }
        } catch (error) {
            console.error("Failed to refresh companies:", error)
            toast.error(t("messages.failedToRefreshCompanies"))
        }
    }

    const isCurrentUserAdmin = (company: Company) =>
        company.members.some(
            (member) => member.user?.id === currentUserIdFromContext && member.isAdmin,
        )

    if (companies.length === 0) {
        return (
            <div className="mx-auto max-w-2xl text-center">
                <IconUsers className="mx-auto mb-4 size-16 text-muted-foreground" />
                <h2 className="mb-2 text-2xl font-bold">{t("noCompanies")}</h2>
                <p className="mb-6 text-muted-foreground">{t("noCompaniesDescription")}</p>
                <Button onClick={() => setShowCreateForm(true)}>
                    <IconPlus className="mr-2 size-4" />
                    {t("createFirstCompany")}
                </Button>

                {showCreateForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-md">
                            <CompanyForm
                                onSuccess={(newCompanyId) => {
                                    setShowCreateForm(false)
                                    handleCompanyUpdate(newCompanyId)
                                }}
                                onCancel={() => setShowCreateForm(false)}
                            />
                        </div>
                    </div>
                )}
            </div>
        )
    }

    if (!selectedCompany) {
        return null
    }

    const canManageCompany = isCurrentUserAdmin(selectedCompany)

    return (
        <div className="space-y-6">
            <Tabs defaultValue="company" className="space-y-6">
                <div className="no-scrollbar overflow-x-auto sm:overflow-visible">
                    <TabsList className="grid w-[24rem] grid-cols-2 sm:w-full">
                        <TabsTrigger value="company">{t("tabs.company")}</TabsTrigger>
                        <TabsTrigger value="users">{t("tabs.users")}</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="company" className="mt-6">
                    <CompanySettingsForm
                        company={selectedCompany}
                        disabled={!canManageCompany}
                        onSuccess={() => handleCompanyUpdate()}
                    />
                </TabsContent>

                <TabsContent value="users" className="mt-6 space-y-4">
                    {canManageCompany && (
                        <div className="flex justify-end">
                            <Button onClick={() => setShowInviteForm(true)}>
                                <IconPlus className="mr-2 size-4" />
                                {t("members.inviteMemberButton")}
                            </Button>
                        </div>
                    )}

                    <CompanyMembers
                        companyId={selectedCompany.id}
                        members={selectedCompany.members}
                        currentUserId={currentUserIdFromContext}
                        isCurrentUserAdmin={canManageCompany}
                        onMemberUpdate={handleCompanyUpdate}
                        onInviteMember={() => setShowInviteForm(true)}
                        onMemberAdded={(addMemberFn) => {
                            addMemberRef.current = addMemberFn
                        }}
                    />
                </TabsContent>
            </Tabs>

            {showInviteForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-md overflow-y-auto">
                        <InviteMemberForm
                            companyId={selectedCompany.id}
                            onSuccess={(newMember) => {
                                setShowInviteForm(false)
                                if (newMember) {
                                    handleMemberAdded(newMember)
                                } else {
                                    handleCompanyUpdate()
                                }
                            }}
                            onCancel={() => setShowInviteForm(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
