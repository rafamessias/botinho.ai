"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { updateMemberAction, removeMemberAction } from "@/components/server-actions/team"
import { IconTrash, IconUser, IconEdit, IconX } from "@tabler/icons-react"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

interface TeamMember {
    id: number
    isAdmin: boolean
    canPost: boolean
    canApprove: boolean
    isOwner: boolean
    teamMemberStatus: "invited" | "accepted" | "rejected"
    user: {
        id: number
        firstName: string
        lastName: string
        email: string
        avatarUrl?: string | null
    }
}

interface TeamMembersProps {
    teamId: number
    members: TeamMember[]
    currentUserId: number
    isCurrentUserAdmin: boolean
    onMemberUpdate: () => void
    onInviteMember: () => void
}

export const TeamMembers = ({
    teamId,
    members,
    currentUserId,
    isCurrentUserAdmin,
    onMemberUpdate,
    onInviteMember
}: TeamMembersProps) => {
    const t = useTranslations("Team")
    const [updatingMember, setUpdatingMember] = useState<number | null>(null)
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
    const [removingMember, setRemovingMember] = useState<TeamMember | null>(null)
    const [editForm, setEditForm] = useState({
        isAdmin: false,
        canPost: false,
        canApprove: false
    })

    const handleEditMember = (member: TeamMember) => {
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
                teamId,
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
                teamId,
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

    const getRoleBadge = (member: TeamMember) => {
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
            <div className="space-y-4">
                {members.map((member) => (
                    <div
                        key={member.id}
                        className="flex flex-col gap-4 p-4 border rounded-lg bg-card sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div className="flex items-center space-x-4">
                            <Avatar>
                                <AvatarImage src={member.user.avatarUrl || undefined} />
                                <AvatarFallback>
                                    <IconUser className="h-4 w-4" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">
                                    {member.user.firstName} {member.user.lastName}
                                </div>
                                <div className="text-sm text-muted-foreground truncate">
                                    {member.user.email}
                                </div>
                                <div className="flex gap-2 mt-1 flex-wrap">
                                    {getRoleBadge(member)}
                                    {getStatusBadge(member.teamMemberStatus)}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        {!member.isOwner && (
                            <div className="flex flex-col md:flex-row items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditMember(member)}
                                    className="w-full md:w-auto"
                                >
                                    <IconEdit className="h-4 w-4 mr-2" />
                                    <span className="hidden sm:inline">Edit</span>
                                    <span className="sm:hidden">Edit</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setRemovingMember(member)}
                                    className="w-full md:w-auto"
                                >
                                    <IconTrash className="h-4 w-4 mr-2" />
                                    <span className="hidden sm:inline">Remove</span>
                                    <span className="sm:hidden">Remove</span>
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Edit Member Modal */}
            <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Team Member</DialogTitle>
                        <DialogDescription>
                            Update permissions for {editingMember?.user.firstName} {editingMember?.user.lastName}
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
                                <h4 className="font-medium">Permissions</h4>

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
                                            Team Administrator
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
                                            Can Post Content
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
                                            Can Approve Content
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
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSaveMember}
                                    disabled={updatingMember === editingMember.id}
                                    className="flex-1"
                                >
                                    {updatingMember === editingMember.id ? "Saving..." : "Save Changes"}
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
                        <DialogTitle>Remove Team Member</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove this member from the team?
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
                                This action cannot be undone. The member will lose access to the team and all associated content.
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setRemovingMember(null)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleRemoveMember}
                                    className="flex-1"
                                >
                                    Remove Member
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
