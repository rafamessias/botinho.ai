"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { updateMemberAction, removeMemberAction } from "@/components/server-actions/company"
import { IconTrash, IconUser, IconEdit, IconX, IconPencilPlus, IconEye } from "@tabler/icons-react"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
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
import { IconDotsVertical } from "@tabler/icons-react"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface CompanyMember {
    id: number
    isAdmin: boolean
    canPost: boolean
    canApprove: boolean
    isOwner: boolean
    companyMemberStatus: "invited" | "accepted" | "rejected"
    user: {
        id: number
        firstName: string
        lastName: string
        email: string
        avatarUrl?: string | null
    }
}

interface CompanyMembersProps {
    companyId: number
    members: CompanyMember[]
    currentUserId: number
    isCurrentUserAdmin: boolean
    onMemberUpdate: () => void
    onInviteMember: () => void
    onMemberAdded?: (addMemberFn: (member: CompanyMember) => void) => void
}

export const CompanyMembers = ({
    companyId,
    members: initialMembers,
    currentUserId,
    isCurrentUserAdmin,
    onMemberUpdate,
    onInviteMember,
    onMemberAdded
}: CompanyMembersProps) => {
    const t = useTranslations("Company")
    const [members, setMembers] = useState<CompanyMember[]>(initialMembers)
    const [updatingMember, setUpdatingMember] = useState<number | null>(null)
    const [editingMember, setEditingMember] = useState<CompanyMember | null>(null)
    const [removingMember, setRemovingMember] = useState<CompanyMember | null>(null)
    const [editForm, setEditForm] = useState({
        isAdmin: false,
        canPost: false,
        canApprove: false
    })

    // Update members when initialMembers prop changes
    useEffect(() => {
        setMembers(initialMembers)
    }, [initialMembers])

    // Expose addMember function to parent via callback
    useEffect(() => {
        if (onMemberAdded) {
            const addMember = (newMember: CompanyMember) => {
                setMembers(prev => [...prev, newMember])
            }
            // Call the callback with the addMember function
            onMemberAdded(addMember as any)
        }
    }, [onMemberAdded])

    const handleEditMember = (member: CompanyMember) => {
        setEditingMember(member)
        setEditForm({
            isAdmin: member.isAdmin,
            canPost: member.canPost,
            canApprove: member.canApprove
        })
    }

    const handleSaveMember = async () => {
        if (!editingMember) return

        try {
            setUpdatingMember(editingMember.id)

            const result = await updateMemberAction({
                companyId,
                userId: editingMember.user.id,
                isAdmin: editForm.isAdmin,
                canPost: editForm.canPost,
                canApprove: editForm.canApprove,
            })

            if (result?.success) {
                toast.success(result.message)
                onMemberUpdate()
                setEditingMember(null)
            } else {
                toast.error(result?.error || "Failed to update member")
            }
        } catch (error) {
            console.error("Update member error:", error)
            toast.error("An unexpected error occurred")
        } finally {
            setUpdatingMember(null)
        }
    }

    const handleRemoveMember = async () => {
        if (!removingMember) return

        try {
            const result = await removeMemberAction({
                companyId,
                userId: removingMember.user.id,
            })

            if (result?.success) {
                toast.success(result.message)
                onMemberUpdate()
                setRemovingMember(null)
            } else {
                toast.error(result?.error || "Failed to remove member")
            }
        } catch (error) {
            console.error("Remove member error:", error)
            toast.error("An unexpected error occurred")
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "accepted":
                return <Badge variant="default">{t("members.status.accepted")}</Badge>
            case "invited":
                return <Badge variant="secondary">{t("members.status.invited")}</Badge>
            case "rejected":
                return <Badge variant="destructive">{t("members.status.rejected")}</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const getRoleBadge = (member: CompanyMember) => {
        if (member.isOwner) {
            return <Badge variant="default">{t("members.owner")}</Badge>
        }
        if (member.isAdmin) {
            return <Badge variant="secondary">{t("members.admin")}</Badge>
        }
        return <Badge variant="outline">{t("members.member")}</Badge>
    }

    if (members.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">{t("members.noMembers")}</p>
            </div>
        )
    }

    return (
        <>
            <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[250px]">{t("members.name")}</TableHead>
                                <TableHead className="w-[200px]">{t("members.email")}</TableHead>
                                <TableHead className="w-[120px]">{t("members.role")}</TableHead>
                                <TableHead className="w-[100px]">{t("members.statusLabel")}</TableHead>
                                <TableHead className="w-[150px]">{t("members.permissions")}</TableHead>
                                {isCurrentUserAdmin && <TableHead className="w-[80px] text-right">{t("members.actions")}</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={member.user.avatarUrl || undefined} />
                                                <AvatarFallback>
                                                    <IconUser className="h-4 w-4" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <div className="font-medium truncate">
                                                    {member.user.firstName} {member.user.lastName}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                            {member.user.email}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getRoleBadge(member)}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(member.companyMemberStatus)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center justify-center cursor-help">
                                                        <IconPencilPlus
                                                            className={`h-5 w-5 ${member.canPost
                                                                ? "text-primary"
                                                                : "text-muted-foreground/30"
                                                                }`}
                                                        />
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{t("members.canPost")}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center justify-center cursor-help">
                                                        <IconEye
                                                            className={`h-5 w-5 ${member.canApprove
                                                                ? "text-primary"
                                                                : "text-muted-foreground/30"
                                                                }`}
                                                        />
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{t("members.canApprove")}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                    {isCurrentUserAdmin && (
                                        <TableCell className="text-right">
                                            {!member.isOwner ? (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <IconDotsVertical className="h-4 w-4" />
                                                            <span className="sr-only">{t("members.openMenu")}</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEditMember(member)}>
                                                            <IconEdit className="h-4 w-4 mr-2" />
                                                            {t("form.update")}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => setRemovingMember(member)}
                                                            className="text-destructive"
                                                        >
                                                            <IconTrash className="h-4 w-4 mr-2" />
                                                            {t("members.removeMember")}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">-</span>
                                            )}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Edit Member Modal */}
            <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t("modals.editMember.title")}</DialogTitle>
                        <DialogDescription>
                            {t("modals.editMember.description", {
                                firstName: editingMember?.user.firstName || "",
                                lastName: editingMember?.user.lastName || ""
                            })}
                        </DialogDescription>
                    </DialogHeader>

                    {editingMember && (
                        <div className="space-y-6">
                            {/* Member Info */}
                            <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                                <Avatar>
                                    <AvatarImage src={editingMember.user.avatarUrl || undefined} />
                                    <AvatarFallback>
                                        <IconUser className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium">
                                        {editingMember.user.firstName} {editingMember.user.lastName}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {editingMember.user.email}
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Permissions */}
                            <div className="space-y-4">
                                <h4 className="font-medium">{t("modals.editMember.permissions")}</h4>

                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="edit-admin"
                                            checked={editForm.isAdmin}
                                            onCheckedChange={(checked) =>
                                                setEditForm(prev => ({ ...prev, isAdmin: checked as boolean }))
                                            }
                                        />
                                        <Label htmlFor="edit-admin" className="text-sm font-medium">
                                            {t("modals.editMember.companyAdministrator")}
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="edit-post"
                                            checked={editForm.canPost}
                                            onCheckedChange={(checked) =>
                                                setEditForm(prev => ({ ...prev, canPost: checked as boolean }))
                                            }
                                        />
                                        <Label htmlFor="edit-post" className="text-sm font-medium">
                                            {t("modals.editMember.canPostContent")}
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="edit-approve"
                                            checked={editForm.canApprove}
                                            onCheckedChange={(checked) =>
                                                setEditForm(prev => ({ ...prev, canApprove: checked as boolean }))
                                            }
                                        />
                                        <Label htmlFor="edit-approve" className="text-sm font-medium">
                                            {t("modals.editMember.canApproveContent")}
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setEditingMember(null)}
                                    className="flex-1"
                                >
                                    {t("modals.editMember.cancel")}
                                </Button>
                                <Button
                                    onClick={handleSaveMember}
                                    disabled={updatingMember === editingMember.id}
                                    className="flex-1"
                                >
                                    {updatingMember === editingMember.id ? t("modals.editMember.saving") : t("modals.editMember.saveChanges")}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Remove Member Confirmation Modal */}
            <Dialog open={!!removingMember} onOpenChange={() => setRemovingMember(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t("modals.removeMember.title")}</DialogTitle>
                        <DialogDescription>
                            {t("modals.removeMember.description")}
                        </DialogDescription>
                    </DialogHeader>

                    {removingMember && (
                        <div className="space-y-6">
                            {/* Member Info */}
                            <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                                <Avatar>
                                    <AvatarImage src={removingMember.user.avatarUrl || undefined} />
                                    <AvatarFallback>
                                        <IconUser className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium">
                                        {removingMember.user.firstName} {removingMember.user.lastName}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {removingMember.user.email}
                                    </div>
                                </div>
                            </div>

                            <div className="text-sm text-muted-foreground">
                                {t("modals.removeMember.warning")}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4">
                                <Button
                                    variant="destructive"
                                    onClick={handleRemoveMember}
                                    className="flex-1"
                                >
                                    {t("modals.removeMember.removeMember")}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setRemovingMember(null)}
                                    className="flex-1"
                                >
                                    {t("modals.removeMember.cancel")}
                                </Button>

                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}

