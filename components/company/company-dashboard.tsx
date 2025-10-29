"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { IconPlus, IconEdit, IconUsers } from "@tabler/icons-react"
import { toast } from "sonner"
import { CompanyForm } from "@/components/company/company-form"
import { InviteMemberForm } from "@/components/company/invite-member-form"
import { CompanyMembers } from "@/components/company/company-members"
import { useUser } from "@/components/user-provider"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
//import { cn } from "@/lib/utils"
//import { deleteCompanyAction } from "@/components/server-actions/company"

interface Company {
    id: number
    name: string
    description?: string | null
    members: Array<{
        id: number
        isAdmin: boolean
        canPost: boolean
        canApprove: boolean
        isOwner: boolean
        companyMemberStatus: string
        user: {
            id: number
            firstName: string
            lastName: string
            email: string
            avatarUrl?: string | null
        }
    }>
}

interface CompanyDashboardProps {
    initialCompanies: Company[]
    currentUserId: number
}

export const CompanyDashboard = ({ initialCompanies, currentUserId }: CompanyDashboardProps) => {
    const t = useTranslations("Company")
    const tCommon = useTranslations("Common")
    const { user, refreshUser } = useUser()
    const [companies, setCompanies] = useState<Company[]>(initialCompanies)
    // Since each user only has one company, use the first (and only) company
    const selectedCompany = companies.length > 0 ? companies[0] : null

    // Use current user ID from user context if available, fallback to prop
    const currentUserIdFromContext = user?.id || currentUserId
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [showEditForm, setShowEditForm] = useState(false)
    const [showInviteForm, setShowInviteForm] = useState(false)
    const [pendingNewCompanyId, setPendingNewCompanyId] = useState<number | null>(null)


    const handleCompanyUpdate = async (newCompanyId?: number) => {
        try {
            // If a new company was created, set it as pending
            if (newCompanyId) {
                setPendingNewCompanyId(newCompanyId)
            }

            // Refresh user data which includes companies (set to true to refresh companies)
            await refreshUser(true)

            toast.success(t("messages.companiesUpdated"))
        } catch (error) {
            console.error("Failed to refresh companies:", error)
            toast.error(t("messages.failedToRefreshCompanies"))
        }
    }

    const isCurrentUserAdmin = (company: Company) => {
        const isAdmin = company.members.some(m =>
            m.user.id === currentUserIdFromContext && m.isAdmin
        )
        return isAdmin
    }

    const isCurrentUserOwner = (company: Company) => {
        const isOwner = company.members.some(m =>
            m.user.id === currentUserIdFromContext && m.isOwner
        )
        return isOwner
    }

    /*
    const handleDeleteCompany = async (companyId: number) => {
        try {
            setIsDeletingCompany(true)
            const result = await deleteCompanyAction({ companyId })

            if (result.success) {
                toast.success(result.message)
                // Refresh user data to update companies list
                await refreshUser(true)
                // Clear selected company if it was deleted
                setSelectedCompany(null)
            } else {
                toast.error(result.error || "Failed to delete company")
            }
        } catch (error) {
            console.error("Delete company error:", error)
            toast.error("An unexpected error occurred")
        } finally {
            setIsDeletingCompany(false)
        }
    }
    */

    if (companies.length === 0) {
        return (
            <div className="max-w-2xl mx-auto text-center">
                <IconUsers className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">{t("noCompanies")}</h1>
                <p className="text-muted-foreground mb-6">{t("noCompaniesDescription")}</p>
                <Button onClick={() => setShowCreateForm(true)}>
                    <IconPlus className="h-4 w-4 mr-2" />
                    {t("createFirstCompany")}
                </Button>

                {showCreateForm && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="max-w-md w-full">
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

    return (
        <div className="px-4 lg:px-6">

            {/* Main Company Card */}
            <Card className="bg-transparent border-none shadow-none">
                <CardHeader className="space-y-4 lg:space-y-6 p-0">
                    {/* Company Info Section */}
                    {selectedCompany && (
                        <>
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex-1">
                                    <CardTitle className="heading-secondary text-xl lg:text-2xl">{selectedCompany.name}</CardTitle>
                                    {selectedCompany.description && (
                                        <CardDescription className="body-secondary mt-2 text-sm">
                                            {selectedCompany.description}
                                        </CardDescription>
                                    )}
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                                        <span>{selectedCompany.members.length} member{selectedCompany.members.length !== 1 ? 's' : ''}</span>
                                    </div>
                                </div>
                                <div className="flex-col sm:flex-row gap-2">
                                    {isCurrentUserAdmin(selectedCompany) && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowEditForm(true)}
                                            className="w-full sm:w-auto"
                                        >
                                            <IconEdit className="h-4 w-4 mr-2" />
                                            <span className="sm:hidden">Edit</span>
                                            <span className="hidden sm:inline">{t("editCompany")}</span>
                                        </Button>
                                    )}

                                    {isCurrentUserOwner(selectedCompany) && (
                                        <AlertDialog>
                                            {/*
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="w-full sm:w-auto mt-2 sm:mt-0 ml-0 sm:ml-2"
                                                    disabled={isDeletingCompany}
                                                >
                                                    <IconTrash className="h-4 w-4 mr-2" />
                                                    <span className="sm:hidden">
                                                        {isDeletingCompany ? "Deleting..." : "Delete"}
                                                    </span>
                                                    <span className="hidden sm:inline">
                                                        {isDeletingCompany ? "Deleting..." : t("deleteCompany")}
                                                    </span>
                                                </Button>
                                            </AlertDialogTrigger>
                                            */}
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>{t("deleteCompany")}</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        {t("deleteCompanyConfirmation", { companyName: selectedCompany.name })}
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                {/*
                                                <AlertDialogFooter>
                                                    <AlertDialogAction
                                                        onClick={() => handleDeleteCompany(selectedCompany.id)}
                                                        className="w-full sm:w-auto bg-destructive text-white hover:bg-destructive/90"
                                                        disabled={isDeletingCompany}
                                                    >
                                                        {isDeletingCompany ? "Deleting..." : t("delete")}
                                                    </AlertDialogAction>
                                                    <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
                                                </AlertDialogFooter>
                                                */}
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </div>
                            </div>

                        </>
                    )}

                </CardHeader>

                {/* Company Members Section */}
                {selectedCompany && (
                    <CardContent className="p-0">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">{t("members.title")}</h3>
                                    <p className="text-sm text-muted-foreground">{t("members.description")}</p>
                                </div>
                                {isCurrentUserAdmin(selectedCompany) && (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowInviteForm(true)}
                                            className="w-full sm:w-auto"
                                        >
                                            <IconPlus className="h-4 w-4 mr-2" />
                                            <span className="hidden sm:inline">{t("members.inviteMember")}</span>
                                            <span className="sm:hidden">Add</span>
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <CompanyMembers
                                companyId={selectedCompany.id}
                                members={selectedCompany.members as any}
                                currentUserId={currentUserIdFromContext}
                                isCurrentUserAdmin={isCurrentUserAdmin(selectedCompany)}
                                onMemberUpdate={handleCompanyUpdate}
                                onInviteMember={() => setShowInviteForm(true)}
                            />
                        </div>
                    </CardContent>
                )}

            </Card>

            {/* Modals */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-md max-h-[90vh] overflow-y-auto">
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

            {showEditForm && selectedCompany && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <CompanyForm
                            company={selectedCompany}
                            onSuccess={() => {
                                setShowEditForm(false)
                                handleCompanyUpdate()
                            }}
                            onCancel={() => setShowEditForm(false)}
                        />
                    </div>
                </div>
            )}

            {showInviteForm && selectedCompany && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <InviteMemberForm
                            companyId={selectedCompany.id}
                            onSuccess={() => {
                                setShowInviteForm(false)
                                handleCompanyUpdate()
                            }}
                            onCancel={() => setShowInviteForm(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

