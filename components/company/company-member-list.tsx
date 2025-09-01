"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Shield, Trash2, Users, Mail } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import {
    removeCompanyMemberAction,
    updateCompanyMemberAction,
} from "@/components/server-actions/company"

interface CompanyMember {
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
}

interface CompanyMemberListProps {
    companyId: number
    members: CompanyMember[]
    onMemberUpdate?: () => void
    onInviteClick?: () => void
}

export function CompanyMemberList({ companyId, members, onMemberUpdate, onInviteClick }: CompanyMemberListProps) {
    const t = useTranslations("Company")
    const [isLoading, setIsLoading] = useState(false)

    const getInitials = (firstName: string, lastName?: string) => {
        return `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ''}`.toUpperCase()
    }

    const onRemoveMember = async (memberId: number) => {
        try {
            setIsLoading(true)
            const result = await removeCompanyMemberAction(companyId, memberId)
            if (result.success) {
                toast.success(result.message || t("members.removeSuccess"))
                onMemberUpdate?.()
            } else {
                toast.error(result.error || t("members.removeFailed"))
            }
        } catch (error) {
            console.error("Error removing member:", error)
            toast.error(t("messages.unexpectedError"))
        } finally {
            setIsLoading(false)
        }
    }

    const onUpdateMemberPermissions = async (memberId: number, permissions: { isAdmin: boolean, canPost: boolean, canApprove: boolean }) => {
        try {
            setIsLoading(true)
            const result = await updateCompanyMemberAction(companyId, memberId, permissions)
            if (result.success) {
                toast.success(result.message || t("members.updateSuccess"))
                onMemberUpdate?.()
            } else {
                toast.error(result.error || t("members.updateFailed"))
            }
        } catch (error) {
            console.error("Error updating permissions:", error)
            toast.error(t("messages.unexpectedError"))
        } finally {
            setIsLoading(false)
        }
    }

    if (!members || members.length === 0) {
        return (
            <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t("members.noMembers")}</h3>
                <p className="text-muted-foreground mb-4">
                    {t("members.noMembersDescription")}
                </p>
                {onInviteClick && (
                    <Button onClick={onInviteClick}>
                        <Mail className="mr-2 h-4 w-4" />
                        {t("members.inviteFirstMember")}
                    </Button>
                )}
            </div>
        )
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{t("members.name")}</TableHead>
                    <TableHead>{t("members.email")}</TableHead>
                    <TableHead>{t("members.role")}</TableHead>
                    <TableHead>{t("members.status")}</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {members.map((member) => (
                    <TableRow key={member.id}>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={member.user.avatarUrl} />
                                    <AvatarFallback>
                                        {getInitials(member.user.firstName, member.user.lastName)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">
                                    {member.user.firstName} {member.user.lastName}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell>{member.user.email}</TableCell>
                        <TableCell>
                            <div className="flex gap-1">
                                {member.isOwner && (
                                    <Badge variant="default">
                                        <Shield className="h-3 w-3 mr-1" />
                                        {t("members.owner")}
                                    </Badge>
                                )}
                                {member.isAdmin && !member.isOwner && (
                                    <Badge variant="secondary">
                                        {t("members.admin")}
                                    </Badge>
                                )}
                                {!member.isAdmin && !member.isOwner && (
                                    <Badge variant="outline">
                                        {t("members.member")}
                                    </Badge>
                                )}
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge
                                variant={
                                    member.companyMemberStatus === "accepted" ? "default" :
                                        member.companyMemberStatus === "invited" ? "secondary" : "destructive"
                                }
                            >
                                {t(`members.status.${member.companyMemberStatus}`)}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            {!member.isOwner && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" disabled={isLoading}>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() => onUpdateMemberPermissions(member.id, {
                                                isAdmin: !member.isAdmin,
                                                canPost: member.canPost,
                                                canApprove: member.canApprove,
                                            })}
                                        >
                                            {member.isAdmin ? t("members.removeAdmin") : t("members.makeAdmin")}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onRemoveMember(member.id)}
                                            className="text-red-600"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            {t("members.removeMember")}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
