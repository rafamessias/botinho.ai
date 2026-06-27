"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type ColumnFiltersState,
    type SortingState,
    useReactTable,
} from "@tanstack/react-table"
import { Search } from "lucide-react"
import { toast } from "sonner"
import { IconUser } from "@tabler/icons-react"
import { updateMemberAction, removeMemberAction, resendMemberInviteAction } from "@/components/server-actions/company"
import { useCompanyMemberColumns, type CompanyMemberRow } from "@/components/company/company-member-columns"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

type MemberStatusFilter = "all" | "accepted" | "invited" | "rejected"

interface CompanyMembersProps {
    companyId: string
    members: CompanyMemberRow[]
    currentUserId: string
    isCurrentUserAdmin: boolean
    onMemberUpdate: () => void
    onInviteMember: () => void
    onMemberAdded?: (addMemberFn: (member: CompanyMemberRow) => void) => void
}

export const CompanyMembers = ({
    companyId,
    members: initialMembers,
    isCurrentUserAdmin,
    onMemberUpdate,
    onMemberAdded,
}: CompanyMembersProps) => {
    const t = useTranslations("Company")
    const [members, setMembers] = useState<CompanyMemberRow[]>(initialMembers)
    const [updatingMember, setUpdatingMember] = useState<string | null>(null)
    const [editingMember, setEditingMember] = useState<CompanyMemberRow | null>(null)
    const [removingMember, setRemovingMember] = useState<CompanyMemberRow | null>(null)
    const [resendingMemberId, setResendingMemberId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState({
        isAdmin: false,
        canPost: false,
        canApprove: false,
    })
    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState("")
    const [statusFilter, setStatusFilter] = useState<MemberStatusFilter>("all")
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

    useEffect(() => {
        setMembers(initialMembers)
    }, [initialMembers])

    useEffect(() => {
        if (onMemberAdded) {
            const addMember = (newMember: CompanyMemberRow) => {
                setMembers((previous) => [...previous, newMember])
            }
            onMemberAdded(addMember)
        }
    }, [onMemberAdded])

    const columnFilters = useMemo<ColumnFiltersState>(
        () => (statusFilter === "all" ? [] : [{ id: "status", value: statusFilter }]),
        [statusFilter],
    )

    const handleResendInvite = useCallback(async (member: CompanyMemberRow) => {
        if (!member.user?.id) return

        try {
            setResendingMemberId(member.id)
            const result = await resendMemberInviteAction({
                companyId,
                userId: member.user.id,
            })

            if (result?.success) {
                toast.success(result.message ?? t("messages.inviteResent"))
            } else {
                toast.error(result?.error ?? t("messages.inviteResendFailed"))
            }
        } catch (error) {
            console.error("Resend invite error:", error)
            toast.error(t("messages.inviteResendFailed"))
        } finally {
            setResendingMemberId(null)
        }
    }, [companyId, t])

    const columns = useCompanyMemberColumns({
        isCurrentUserAdmin,
        resendingMemberId,
        onEdit: (member) => {
            setEditingMember(member)
            setEditForm({
                isAdmin: member.isAdmin,
                canPost: member.canPost,
                canApprove: member.canApprove,
            })
        },
        onRemove: setRemovingMember,
        onResendInvite: handleResendInvite,
    })

    const table = useReactTable({
        data: members,
        columns,
        state: {
            sorting,
            globalFilter,
            columnFilters,
            pagination,
        },
        getRowId: (row) => row.id,
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        globalFilterFn: (row, _columnId, filterValue) => {
            const query = String(filterValue).trim().toLowerCase()
            if (!query) {
                return true
            }

            const member = row.original
            const values = [
                member.user?.firstName,
                member.user?.lastName,
                member.user?.email,
            ]

            return values.some((value) => value?.toLowerCase().includes(query))
        },
    })

    useEffect(() => {
        setPagination((previous) => ({ ...previous, pageIndex: 0 }))
    }, [globalFilter, statusFilter])

    const handleSaveMember = async () => {
        if (!editingMember) return

        try {
            setUpdatingMember(editingMember.id)

            const result = await updateMemberAction({
                companyId,
                userId: editingMember.user!.id,
                isAdmin: editForm.isAdmin,
                canPost: editForm.canPost,
                canApprove: editForm.canApprove,
            })

            if (result?.success) {
                toast.success(result.message)
                onMemberUpdate()
                setEditingMember(null)
            } else {
                toast.error(result?.error || t("messages.memberUpdateFailed"))
            }
        } catch (error) {
            console.error("Update member error:", error)
            toast.error(t("messages.unexpectedError"))
        } finally {
            setUpdatingMember(null)
        }
    }

    const handleRemoveMember = async () => {
        if (!removingMember) return

        try {
            const result = await removeMemberAction({
                companyId,
                userId: removingMember.user!.id,
            })

            if (result?.success) {
                toast.success(result.message)
                onMemberUpdate()
                setRemovingMember(null)
            } else {
                toast.error(result?.error || t("messages.memberRemoveFailed"))
            }
        } catch (error) {
            console.error("Remove member error:", error)
            toast.error(t("messages.unexpectedError"))
        }
    }

    const rows = table.getRowModel().rows
    const filteredCount = table.getFilteredRowModel().rows.length
    const memberCountLabel =
        filteredCount === 1
            ? t("members.memberCountSingular")
            : t("members.memberCountPlural", { count: filteredCount })

    return (
        <>
            <Card className="border-border/60 bg-card/50 shadow-sm">
                <CardHeader className="gap-1">
                    <CardTitle>{t("members.title")}</CardTitle>
                    <CardDescription>{t("members.description")}</CardDescription>
                    <p className="text-sm text-muted-foreground">{memberCountLabel}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <label className="relative flex flex-1" htmlFor="member-search">
                            <Search
                                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                                aria-hidden="true"
                            />
                            <Input
                                id="member-search"
                                placeholder={t("members.searchPlaceholder")}
                                value={globalFilter}
                                onChange={(event) => setGlobalFilter(event.target.value)}
                                className="pl-9"
                                aria-label={t("members.searchPlaceholder")}
                            />
                        </label>
                        <Select
                            value={statusFilter}
                            onValueChange={(value) => setStatusFilter(value as MemberStatusFilter)}
                        >
                            <SelectTrigger className="w-full sm:w-[180px]" aria-label={t("members.statusFilter")}>
                                <SelectValue placeholder={t("members.statusFilter")} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t("members.statusAll")}</SelectItem>
                                <SelectItem value="accepted">{t("members.status.accepted")}</SelectItem>
                                <SelectItem value="invited">{t("members.status.invited")}</SelectItem>
                                <SelectItem value="rejected">{t("members.status.rejected")}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="overflow-hidden rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column.columnDef.header,
                                                          header.getContext(),
                                                      )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {rows.length > 0 ? (
                                    rows.map((row) => (
                                        <TableRow key={row.id}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext(),
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            {members.length === 0
                                                ? t("members.noMembers")
                                                : t("members.noResults")}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {filteredCount > 0 && (
                        <DataTablePagination
                            table={table}
                            pageSizeOptions={[10, 20, 30, 50]}
                            showRange
                        />
                    )}
                </CardContent>
            </Card>

            <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t("modals.editMember.title")}</DialogTitle>
                        <DialogDescription>
                            {t("modals.editMember.description", {
                                firstName: editingMember?.user?.firstName || "",
                                lastName: editingMember?.user?.lastName || "",
                            })}
                        </DialogDescription>
                    </DialogHeader>

                    {editingMember && (
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4 rounded-lg bg-muted/50 p-4">
                                <Avatar>
                                    <AvatarImage src={editingMember.user?.avatarUrl || undefined} />
                                    <AvatarFallback>
                                        <IconUser className="size-4" />
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium">
                                        {editingMember.user?.firstName} {editingMember.user?.lastName}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {editingMember.user?.email}
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h4 className="font-medium">{t("modals.editMember.permissions")}</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="edit-admin"
                                            checked={editForm.isAdmin}
                                            onCheckedChange={(checked) =>
                                                setEditForm((previous) => ({
                                                    ...previous,
                                                    isAdmin: checked as boolean,
                                                }))
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
                                                setEditForm((previous) => ({
                                                    ...previous,
                                                    canPost: checked as boolean,
                                                }))
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
                                                setEditForm((previous) => ({
                                                    ...previous,
                                                    canApprove: checked as boolean,
                                                }))
                                            }
                                        />
                                        <Label htmlFor="edit-approve" className="text-sm font-medium">
                                            {t("modals.editMember.canApproveContent")}
                                        </Label>
                                    </div>
                                </div>
                            </div>

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
                                    {updatingMember === editingMember.id
                                        ? t("modals.editMember.saving")
                                        : t("modals.editMember.saveChanges")}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={!!removingMember} onOpenChange={() => setRemovingMember(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t("modals.removeMember.title")}</DialogTitle>
                        <DialogDescription>{t("modals.removeMember.description")}</DialogDescription>
                    </DialogHeader>

                    {removingMember && (
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4 rounded-lg bg-muted/50 p-4">
                                <Avatar>
                                    <AvatarImage src={removingMember.user?.avatarUrl || undefined} />
                                    <AvatarFallback>
                                        <IconUser className="size-4" />
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium">
                                        {removingMember.user?.firstName} {removingMember.user?.lastName}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {removingMember.user?.email}
                                    </div>
                                </div>
                            </div>

                            <div className="text-sm text-muted-foreground">
                                {t("modals.removeMember.warning")}
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button variant="destructive" onClick={handleRemoveMember} className="flex-1">
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
