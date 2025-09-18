"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { useTransition } from "react"
import { useRouter } from "@/i18n/navigation"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    MoreHorizontal,
    Plus,
    Edit,
    Copy,
    Clipboard,
    Trash2,
    Calendar,
    Users,
} from "lucide-react"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Link } from "@/i18n/navigation"
import { deleteSurvey, duplicateSurvey, updateSurveyStatus } from "@/components/server-actions/survey"
import { toast } from "sonner"
import { SurveyStatus } from "@/lib/generated/prisma"
import LoadingComp from "../loading-comp"

// Database survey type
interface DatabaseSurvey {
    id: string
    name: string
    description: string | null
    status: SurveyStatus
    enabled: boolean
    allowMultipleResponses: boolean
    totalResponses: number
    ResponseRate: number
    totalOpenSurveys: number
    createdAt: Date
    updatedAt: Date
    type: {
        id: string
        name: string
    } | null
    _count: {
        responses: number
    }
}

export const surveySchema = z.object({
    id: z.string(),
    name: z.string(),
    status: z.nativeEnum(SurveyStatus),
    responses: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    type: z.string().nullable(),
})

export const SurveyTable = ({ surveys }: { surveys: DatabaseSurvey[] }) => {
    const t = useTranslations("Survey")
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const [data, setData] = React.useState<DatabaseSurvey[]>(surveys)
    const [isLoading, setIsLoading] = React.useState(false)
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
    const [surveyToDelete, setSurveyToDelete] = React.useState<DatabaseSurvey | null>(null)

    // Update data when surveys prop changes
    React.useEffect(() => {
        setData(surveys)
    }, [surveys])

    const getStatusBadge = (status: SurveyStatus) => {
        switch (status) {
            case SurveyStatus.published:
                return <Badge variant="default" className="bg-green-500 hover:bg-green-600">{t("table.status.published")}</Badge>
            case SurveyStatus.draft:
                return <Badge variant="secondary">{t("table.status.draft")}</Badge>
            case SurveyStatus.archived:
                return <Badge variant="outline">{t("table.status.archived")}</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    // Action handlers
    const handleDeleteSurveyClick = (survey: DatabaseSurvey) => {
        setSurveyToDelete(survey)
        setDeleteDialogOpen(true)
    }

    const handleDeleteSurvey = () => {
        if (!surveyToDelete) return

        setIsLoading(true)
        startTransition(async () => {
            try {
                const result = await deleteSurvey(surveyToDelete.id)
                if (result.success) {
                    setData(prev => prev.filter(survey => survey.id !== surveyToDelete.id))
                    toast.success(t("table.messages.surveyDeletedSuccess"))
                } else {
                    toast.error(result.error || t("table.messages.deleteSurveyError"))
                }
            } catch (error) {
                toast.error(t("table.messages.unexpectedError"))
            } finally {
                setDeleteDialogOpen(false)
                setSurveyToDelete(null)
                setIsLoading(false)
            }
        })
    }

    const handleDuplicateSurvey = (id: string) => {
        setIsLoading(true)
        startTransition(async () => {
            try {
                const result = await duplicateSurvey(id)
                if (result.success) {
                    // Refresh the page to get updated data
                    window.location.reload()
                    toast.success(t("table.messages.surveyDuplicatedSuccess"))
                } else {
                    toast.error(result.error || t("table.messages.duplicateSurveyError"))
                }
            } catch (error) {
                toast.error(t("table.messages.unexpectedError"))
            } finally {
                setIsLoading(false)
            }
        })
    }

    const handleUpdateStatus = (id: string, status: SurveyStatus) => {
        setIsLoading(true)
        startTransition(async () => {
            try {
                const result = await updateSurveyStatus(id, status)
                if (result.success) {
                    setData(prev => prev.map(survey =>
                        survey.id === id ? { ...survey, status } : survey
                    ))
                    toast.success(t("table.messages.surveyUpdatedSuccess"))
                } else {
                    toast.error(result.error || t("table.messages.updateSurveyError"))
                }
            } catch (error) {
                toast.error(t("table.messages.unexpectedError"))
            } finally {
                setIsLoading(false)
            }
        })
    }

    const handleCopySurveyId = async (surveyId: string) => {

        try {
            await navigator.clipboard.writeText(surveyId)
            toast.success(t("table.messages.surveyIdCopied"))
        } catch {
            toast.error(t("table.messages.copyError"))
        }

    }

    const columns: ColumnDef<DatabaseSurvey>[] = [
        /* {
             id: "select",
             header: ({ table }) => (
                 <div className="flex items-center justify-center">
                     <Checkbox
                         checked={
                             table.getIsAllPageRowsSelected() ||
                             (table.getIsSomePageRowsSelected() && "indeterminate")
                         }
                         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                         aria-label="Select all"
                     />
                 </div>
             ),
             cell: ({ row }) => (
                 <div className="flex items-center justify-center">
                     <Checkbox
                         checked={row.getIsSelected()}
                         onCheckedChange={(value) => row.toggleSelected(!!value)}
                         aria-label="Select row"
                     />
                 </div>
             ),
             enableSorting: false,
             enableHiding: false,
         },*/
        {
            id: "actions-mobile",
            cell: ({ row }) => (
                <div className="block md:hidden">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                                size="icon"
                                disabled={isPending}
                            >
                                <MoreHorizontal />
                                <span className="sr-only">{t("table.actions.openMenu")}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleCopySurveyId(row.original.id)}>
                                <Clipboard className="h-4 w-4 mr-2" />
                                {t("table.actions.copySurveyId")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/survey/edit/${row.original.id}`)}>
                                <Edit className="h-4 w-4 mr-2" />
                                {t("table.actions.edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicateSurvey(row.original.id)}>
                                <Copy className="h-4 w-4 mr-2" />
                                {t("table.actions.duplicate")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {row.original.status === SurveyStatus.draft && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(row.original.id, SurveyStatus.published)}>
                                    <Users className="h-4 w-4 mr-2" />
                                    {t("table.actions.publish")}
                                </DropdownMenuItem>
                            )}
                            {row.original.status === SurveyStatus.published && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(row.original.id, SurveyStatus.archived)}>
                                    <Users className="h-4 w-4 mr-2" />
                                    {t("table.actions.archive")}
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() => handleDeleteSurveyClick(row.original)}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t("table.actions.delete")}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
        {
            accessorKey: "name",
            header: t("table.columns.title"),
            cell: ({ row }) => (
                <div className="font-medium">
                    {row.original.name}
                </div>
            ),
            enableHiding: false,
        },
        {
            accessorKey: "type",
            header: t("table.columns.type"),
            cell: ({ row }) => (
                <Badge variant="outline" className="text-muted-foreground">
                    {row.original.type?.name || t("table.messages.noType")}
                </Badge>
            ),
        },
        {
            accessorKey: "status",
            header: t("table.columns.status"),
            cell: ({ row }) => getStatusBadge(row.original.status),
        },
        {
            accessorKey: "responses",
            header: () => <div className="w-full text-right">{t("table.columns.responses")}</div>,
            cell: ({ row }) => (
                <div className="text-right font-medium">
                    {row.original._count.responses.toLocaleString()}
                </div>
            ),
        },
        {
            accessorKey: "createdAt",
            header: t("table.columns.createdAt"),
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(row.original.createdAt).toLocaleDateString()}
                </div>
            ),
        },
        {
            accessorKey: "updatedAt",
            header: t("table.columns.updatedAt"),
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(row.original.updatedAt).toLocaleDateString()}
                </div>
            ),
        },
        {
            id: "actions-desktop",
            cell: ({ row }) => (
                <div className="hidden md:block">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                                size="icon"
                                disabled={isPending}
                            >
                                <MoreHorizontal />
                                <span className="sr-only">{t("table.actions.openMenu")}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleCopySurveyId(row.original.id)}>
                                <Clipboard className="h-4 w-4 mr-2" />
                                {t("table.actions.copySurveyId")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/survey/edit/${row.original.id}`)}>
                                <Edit className="h-4 w-4 mr-2" />
                                {t("table.actions.edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicateSurvey(row.original.id)}>
                                <Copy className="h-4 w-4 mr-2" />
                                {t("table.actions.duplicate")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {row.original.status === SurveyStatus.draft && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(row.original.id, SurveyStatus.published)}>
                                    <Users className="h-4 w-4 mr-2" />
                                    {t("table.actions.publish")}
                                </DropdownMenuItem>
                            )}
                            {row.original.status === SurveyStatus.published && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(row.original.id, SurveyStatus.archived)}>
                                    <Users className="h-4 w-4 mr-2" />
                                    {t("table.actions.archive")}
                                </DropdownMenuItem>
                            )}
                            {row.original.status === SurveyStatus.draft && (
                                <DropdownMenuItem
                                    variant="destructive"
                                    onClick={() => handleDeleteSurveyClick(row.original)}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {t("table.actions.delete")}
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ]

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
        },
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    return (
        <div className="w-full space-y-4">

            {/* Table Header */}
            <div className="flex flex-col items-start sm:flex-row gap-4 sm:justify-between sm:items-center">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">{t("table.title")}</h2>
                    <Badge variant="secondary" className="ml-2">
                        {data.length} {t("table.totalSurveys")}
                    </Badge>
                </div>
                <div className="flex w-full sm:w-auto items-center gap-2 justify-end">
                    {/*}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Columns />
                                <span className="hidden lg:inline">{t("table.buttons.customizeColumns")}</span>
                                <span className="lg:hidden">{t("table.buttons.columns")}</span>
                                <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) =>
                                        typeof column.accessorFn !== "undefined" &&
                                        column.getCanHide()
                                )
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    */}
                    <Button size="sm" asChild>
                        <Link href="/survey/create">
                            <Plus />
                            <span className="hidden lg:inline">{t("table.buttons.createSurvey")}</span>
                            <span className="lg:hidden">Create</span>
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <Input
                        placeholder={t("table.search.placeholder")}
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("name")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                </div>
                <Select
                    value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
                    onValueChange={(value) =>
                        table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
                    }
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder={t("table.filters.status")} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t("table.filters.allStatuses")}</SelectItem>
                        <SelectItem value={SurveyStatus.published}>{t("table.status.published")}</SelectItem>
                        <SelectItem value={SurveyStatus.draft}>{t("table.status.draft")}</SelectItem>
                        <SelectItem value={SurveyStatus.archived}>{t("table.status.archived")}</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border relative">
                <LoadingComp isLoadingProp={isLoading} />
                <Table>
                    <TableHeader className="bg-muted">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {cell.column.id === "status"
                                                ? flexRender(cell.column.columnDef.cell, cell.getContext())
                                                : typeof cell.getValue() === "string"
                                                    ? (
                                                        <span
                                                            className="block truncate max-w-xs"
                                                            title={cell.getValue() as string}
                                                        >
                                                            <span className="sm:hidden">
                                                                {(cell.getValue() as string).length > 20
                                                                    ? `${(cell.getValue() as string).slice(0, 20)}…`
                                                                    : cell.getValue() as string}
                                                            </span>
                                                            <span className="hidden sm:block">
                                                                {(cell.getValue() as string).length > 40
                                                                    ? `${(cell.getValue() as string).slice(0, 40)}…`
                                                                    : cell.getValue() as string}
                                                            </span>
                                                        </span>
                                                    )
                                                    : flexRender(cell.column.columnDef.cell, cell.getContext())
                                            }
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    {t("table.messages.noResults")}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex w-full items-center px-4">
                {/*
                <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                    {table.getFilteredSelectedRowModel().rows.length} {t("table.pagination.of")}{" "}
                    {table.getFilteredRowModel().rows.length} {t("table.pagination.rowsSelected")}
                </div>
                */}
                <div className="flex w-full items-center justify-between ">
                    <div className="hidden items-center justify-start gap-2 lg:flex">
                        <Label htmlFor="rows-per-page" className="text-sm font-medium">
                            {t("table.pagination.rowsPerPage")}
                        </Label>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value))
                            }}
                        >
                            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                <SelectValue
                                    placeholder={table.getState().pagination.pageSize}
                                />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-full items-center justify-end">
                        <div className="flex w-fit items-center justify-center text-sm font-medium mr-4">
                            {t("table.pagination.page")} {table.getState().pagination.pageIndex + 1} {t("table.pagination.of")}{" "}
                            {table.getPageCount()}
                        </div>
                        <div className="ml-auto flex items-center gap-2 lg:ml-0">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">{t("table.pagination.goToFirstPage")}</span>
                                <ChevronsLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">{t("table.pagination.goToPreviousPage")}</span>
                                <ChevronLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">{t("table.pagination.goToNextPage")}</span>
                                <ChevronRight />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">{t("table.pagination.goToLastPage")}</span>
                                <ChevronsRight />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("table.deleteDialog.title")}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t("table.deleteDialog.description", { surveyName: surveyToDelete?.name || "this survey" })}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>
                            {t("table.deleteDialog.cancel")}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteSurvey}
                            disabled={isPending}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >
                            {isPending ? t("table.deleteDialog.deleting") : t("table.deleteDialog.delete")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
