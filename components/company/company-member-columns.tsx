"use client"

import { useMemo } from "react"
import { useTranslations } from "next-intl"
import type { ColumnDef } from "@tanstack/react-table"
import { IconDotsVertical, IconEdit, IconMail, IconTrash, IconUser } from "@tabler/icons-react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type CompanyMemberRow = {
    id: string
    isAdmin: boolean
    canPost: boolean
    canApprove: boolean
    canManageAgenda: boolean
    isOwner: boolean
    companyMemberStatus: "invited" | "accepted" | "rejected"
    status?: "invited" | "accepted" | "rejected"
    user: {
        id: string
        firstName: string
        lastName: string
        email: string
        avatarUrl?: string | null
    } | null
}

type UseCompanyMemberColumnsOptions = {
    isCurrentUserAdmin: boolean
    resendingMemberId: string | null
    onEdit: (member: CompanyMemberRow) => void
    onRemove: (member: CompanyMemberRow) => void
    onResendInvite: (member: CompanyMemberRow) => void
}

export const useCompanyMemberColumns = ({
    isCurrentUserAdmin,
    resendingMemberId,
    onEdit,
    onRemove,
    onResendInvite,
}: UseCompanyMemberColumnsOptions) => {
    const t = useTranslations("Company")

    return useMemo<ColumnDef<CompanyMemberRow>[]>(() => {
        const getRoleBadge = (member: CompanyMemberRow) => {
            if (member.isOwner) {
                return <Badge>{t("members.owner")}</Badge>
            }
            if (member.isAdmin) {
                return <Badge variant="secondary">{t("members.admin")}</Badge>
            }
            return <Badge variant="outline">{t("members.member")}</Badge>
        }

        const getStatusBadge = (status: string) => {
            switch (status) {
                case "accepted":
                    return <Badge>{t("members.status.accepted")}</Badge>
                case "invited":
                    return <Badge variant="secondary">{t("members.status.invited")}</Badge>
                case "rejected":
                    return <Badge variant="destructive">{t("members.status.rejected")}</Badge>
                default:
                    return <Badge variant="outline">{status}</Badge>
            }
        }

        const getPermissionsLabel = (member: CompanyMemberRow) => {
            if (member.isOwner) {
                return t("members.permissionsFullAccess")
            }
            if (member.isAdmin) {
                return t("members.permissionsAdminAccess")
            }

            const permissions: string[] = []
            if (member.canPost) {
                permissions.push(t("members.canPostShort"))
            }
            if (member.canApprove) {
                permissions.push(t("members.canApproveShort"))
            }
            if (member.canManageAgenda) {
                permissions.push(t("members.canManageAgendaShort"))
            }

            return permissions.length > 0
                ? permissions.join(", ")
                : t("members.permissionsLimited")
        }

        const columns: ColumnDef<CompanyMemberRow>[] = [
            {
                accessorKey: "name",
                accessorFn: (row) =>
                    `${row.user?.firstName ?? ""} ${row.user?.lastName ?? ""}`.trim(),
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title={t("members.name")} />
                ),
                cell: ({ row }) => {
                    const member = row.original
                    return (
                        <div className="flex items-center gap-3">
                            <Avatar className="size-8">
                                <AvatarImage src={member.user?.avatarUrl || undefined} />
                                <AvatarFallback>
                                    <IconUser className="size-4" />
                                </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">
                                {member.user?.firstName} {member.user?.lastName}
                            </span>
                        </div>
                    )
                },
            },
            {
                accessorKey: "email",
                accessorFn: (row) => row.user?.email ?? "",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title={t("members.email")} />
                ),
                cell: ({ row }) => (
                    <span className="text-muted-foreground">{row.original.user?.email}</span>
                ),
            },
            {
                id: "role",
                accessorFn: (row) => (row.isOwner ? "owner" : row.isAdmin ? "admin" : "member"),
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title={t("members.role")} />
                ),
                cell: ({ row }) => getRoleBadge(row.original),
            },
            {
                id: "status",
                accessorFn: (row) => row.companyMemberStatus,
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title={t("members.statusLabel")} />
                ),
                cell: ({ row }) => getStatusBadge(row.original.companyMemberStatus),
            },
            {
                id: "permissions",
                header: t("members.permissions"),
                cell: ({ row }) => (
                    <span className="text-sm text-muted-foreground">
                        {getPermissionsLabel(row.original)}
                    </span>
                ),
                enableSorting: false,
            },
        ]

        if (isCurrentUserAdmin) {
            columns.push({
                id: "actions",
                header: () => <span className="sr-only">{t("members.actions")}</span>,
                cell: ({ row }) => {
                    const member = row.original
                    if (member.isOwner) {
                        return null
                    }

                    return (
                        <div className="flex justify-end">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="size-8">
                                        <IconDotsVertical className="size-4" />
                                        <span className="sr-only">{t("members.openMenu")}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {(member.companyMemberStatus === "invited" ||
                                        member.status === "invited") && (
                                        <DropdownMenuItem
                                            onClick={() => onResendInvite(member)}
                                            disabled={resendingMemberId === member.id}
                                        >
                                            <IconMail className="mr-2 size-4" />
                                            {resendingMemberId === member.id
                                                ? t("members.resendingInvite")
                                                : t("members.resendInvite")}
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => onEdit(member)}>
                                        <IconEdit className="mr-2 size-4" />
                                        {t("form.update")}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => onRemove(member)}
                                        className="text-destructive"
                                    >
                                        <IconTrash className="mr-2 size-4" />
                                        {t("members.removeMember")}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )
                },
                enableSorting: false,
            })
        }

        return columns
    }, [isCurrentUserAdmin, onEdit, onRemove, onResendInvite, resendingMemberId, t])
}
