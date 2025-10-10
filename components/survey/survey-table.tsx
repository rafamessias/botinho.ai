"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { useTransition } from "react"
import { useRouter } from "@/i18n/navigation"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
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
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    X,
} from "lucide-react"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
import { deleteSurvey, duplicateSurvey, updateSurveyStatus, getSurveysWithPagination, type SurveyFilters, type PaginatedSurveysResult } from "@/components/server-actions/survey"
import { toast } from "sonner"
import { SurveyStatus } from "@/lib/generated/prisma"
import LoadingComp from "../loading-comp"
import { useIsMobile } from "@/hooks/use-mobile"
import { useUser } from "../user-provider"
import { UpgradeModal } from "@/components/upgrade-modal"

// Custom debounce hook - optimized to prevent callback recreation
const useDebounce = <T extends (...args: any[]) => any>(callback: T, delay: number) => {
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)
    const callbackRef = React.useRef(callback)

    // Update callback ref when it changes
    React.useEffect(() => {
        callbackRef.current = callback
    }, [callback])

    return React.useCallback((...args: Parameters<T>) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => callbackRef.current(...args), delay)
    }, [delay]) // Only depend on delay, not callback
}

// Utility function to determine if a column should be visible based on ID pattern
const shouldShowColumn = (columnId: string, isMobile: boolean): boolean => {
    // If column ID contains 'mobile', show only on mobile
    if (columnId.includes('-mobile')) {
        return isMobile
    }

    // If column ID contains 'desktop', show only on desktop
    if (columnId.includes('-desktop')) {
        return !isMobile
    }

    // If no mobile/desktop identifier, show on both
    return true
}


// Memoized table cell component to prevent unnecessary re-renders (only for non-action columns)
const MemoizedTableCell = ({ cell }: { cell: any }) => (
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
                            {(cell.getValue() as string).length > 35
                                ? `${(cell.getValue() as string).slice(0, 35)}…`
                                : cell.getValue() as string}
                        </span>
                    </span>
                )
                : flexRender(cell.column.columnDef.cell, cell.getContext())
        }
    </TableCell>
)
MemoizedTableCell.displayName = "MemoizedTableCell"

// Sortable header component
const SortableHeader = React.memo(({
    columnId,
    children,
    onSort,
    sorting
}: {
    columnId: string,
    children: React.ReactNode,
    onSort: (columnId: string) => void,
    sorting: SortingState
}) => {
    const currentSort = sorting.find(s => s.id === columnId)
    const isSorted = !!currentSort
    const isDesc = currentSort?.desc ?? false

    const getSortIcon = () => {
        if (!isSorted) return <ArrowUpDown className="h-4 w-4 opacity-50" />
        return isDesc ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />
    }

    return (
        <div
            className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 px-2 py-1 rounded transition-colors"
            onClick={() => onSort(columnId)}
            role="button"
            tabIndex={0}
            aria-label={`Sort by ${columnId} ${isSorted ? (isDesc ? 'descending' : 'ascending') : ''}`}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSort(columnId)
                }
            }}
        >
            {children}
            {getSortIcon()}
        </div>
    )
})
SortableHeader.displayName = "SortableHeader"

// Database survey type
interface DatabaseSurvey {
    id: string
    name: string
    description: string | null
    status: SurveyStatus
    enabled: boolean
    allowMultipleResponses: boolean
    totalResponses: number
    responseRate: number
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

interface SurveyTableProps {
    initialData?: PaginatedSurveysResult
    initialFilters?: Partial<SurveyFilters>
    teamId?: number
}

export const SurveyTable = ({ initialData, initialFilters, teamId }: SurveyTableProps) => {
    const t = useTranslations("Survey")
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const isMobile = useIsMobile()
    const { hasPermission } = useUser()
    const userHasPermission = hasPermission()
    const canCreateSurvey = userHasPermission.canPost || userHasPermission.isAdmin
    const { user } = useUser()
    // Server-side state
    const [paginatedData, setPaginatedData] = React.useState<PaginatedSurveysResult>(
        initialData || {
            surveys: [],
            totalCount: 0,
            totalPages: 0,
            currentPage: 1,
            pageSize: 10,
            hasNextPage: false,
            hasPreviousPage: false
        }
    )
    const [filters, setFilters] = React.useState<SurveyFilters>({
        page: initialFilters?.page || 1,
        pageSize: initialFilters?.pageSize || 10,
        search: initialFilters?.search || "",
        status: initialFilters?.status,
        sortBy: initialFilters?.sortBy || 'updatedAt',
        sortOrder: initialFilters?.sortOrder || 'desc'
    })

    // UI state
    const [isLoading, setIsLoading] = React.useState(false)
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
    const [surveyToDelete, setSurveyToDelete] = React.useState<DatabaseSurvey | null>(null)
    const [actionLoading, setActionLoading] = React.useState<string | null>(null) // Track which action is loading
    const [showUpgradeModal, setShowUpgradeModal] = React.useState(false)
    const [upgradeLimit, setUpgradeLimit] = React.useState<number | undefined>(undefined)

    // Sorting state
    const [sorting, setSorting] = React.useState<SortingState>([
        { id: 'updatedAt', desc: true } // Default sort by updatedAt descending
    ])

    // Input state for debouncing
    const searchInputRef = React.useRef<HTMLInputElement>(null)
    const [statusFilter, setStatusFilter] = React.useState<string>(filters.status || "")

    // Use refs to avoid dependency issues
    const filtersRef = React.useRef(filters)
    const tRef = React.useRef(t)

    React.useEffect(() => {
        if (user?.defaultTeamId === undefined) return

        if (teamId && teamId !== user?.defaultTeamId) fetchSurveys()
    }, [user?.defaultTeamId])

    // Update refs when values change
    React.useEffect(() => {
        filtersRef.current = filters
    }, [filters])

    React.useEffect(() => {
        tRef.current = t
    }, [t])

    // Fetch surveys with current filters - optimized to avoid dependency on filters
    const fetchSurveys = React.useCallback(async (newFilters: Partial<SurveyFilters> = {}) => {
        setIsLoading(true)
        startTransition(async () => {
            try {
                const currentFilters = filtersRef.current
                const mergedFilters = { ...currentFilters, ...newFilters }
                const result = await getSurveysWithPagination(mergedFilters)
                if (result.success && result.data) {
                    setPaginatedData(result.data)
                    setFilters(mergedFilters as SurveyFilters)
                } else {
                    toast.error(result.error || tRef.current("table.messages.fetchSurveysError"))
                }
            } catch (error) {
                toast.error(tRef.current("table.messages.unexpectedError"))
            } finally {
                setIsLoading(false)
            }
        })
    }, []) // No dependencies to prevent recreation

    // Debounced search handler - optimized delay for better UX
    const debouncedSearch = useDebounce((searchValue: string) => {
        fetchSurveys({ search: searchValue, page: 1 })
    }, 300) // Reduced from 500ms to 300ms for better responsiveness

    // Memoized event handlers to prevent child component re-renders
    const handleSearchChange = React.useCallback((value: string) => {
        debouncedSearch(value)
    }, [debouncedSearch])

    const handleStatusFilterChange = React.useCallback((value: string) => {
        setStatusFilter(value)
        const statusValue = value === "all" ? undefined : value as SurveyStatus
        fetchSurveys({ status: statusValue, page: 1 })
    }, [fetchSurveys])

    const handlePageChange = React.useCallback((page: number) => {
        fetchSurveys({ page })
    }, [fetchSurveys])

    const handlePageSizeChange = React.useCallback((pageSize: number) => {
        fetchSurveys({ pageSize, page: 1 })
    }, [fetchSurveys])

    const handleSortingChange = React.useCallback((sortBy: SurveyFilters['sortBy'], sortOrder: SurveyFilters['sortOrder']) => {
        fetchSurveys({ sortBy, sortOrder, page: 1 })
    }, [fetchSurveys])

    // Handle column sorting
    const handleColumnSort = React.useCallback((columnId: string) => {
        const currentSort = sorting.find(s => s.id === columnId)
        let newSortOrder: 'asc' | 'desc' = 'desc'

        if (currentSort) {
            // Toggle between desc -> asc -> desc
            newSortOrder = currentSort.desc ? 'asc' : 'desc'
        }

        // Update sorting state
        setSorting([{ id: columnId, desc: newSortOrder === 'desc' }])

        // Map columnId to the correct sortBy value for the server
        let sortBy: SurveyFilters['sortBy']
        if (columnId === 'totalResponses') {
            sortBy = 'responses' // Server expects 'responses' but sorts by totalResponses
        } else {
            sortBy = columnId as SurveyFilters['sortBy']
        }

        fetchSurveys({ sortBy, sortOrder: newSortOrder, page: 1 })
    }, [sorting, fetchSurveys])

    // Memoized status badge function
    const getStatusBadge = React.useCallback((status: SurveyStatus) => {
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
    }, [t])

    // Memoized action handlers to prevent child component re-renders
    const handleDeleteSurveyClick = React.useCallback((survey: DatabaseSurvey) => {
        setSurveyToDelete(survey)
        setDeleteDialogOpen(true)
    }, [])

    const handleDeleteSurvey = React.useCallback(() => {
        if (!surveyToDelete) return

        setIsLoading(true)
        startTransition(async () => {
            try {
                const result = await deleteSurvey(surveyToDelete.id)
                if (result.success) {
                    // Refresh data after successful deletion
                    await fetchSurveys()
                    toast.success(tRef.current("table.messages.surveyDeletedSuccess"))
                } else {
                    toast.error(result.error || tRef.current("table.messages.deleteSurveyError"))
                }
            } catch (error) {
                toast.error(tRef.current("table.messages.unexpectedError"))
            } finally {
                setDeleteDialogOpen(false)
                setSurveyToDelete(null)
                setIsLoading(false)
            }
        })
    }, [surveyToDelete, fetchSurveys])

    const handleDuplicateSurvey = React.useCallback((id: string) => {
        setActionLoading(id)
        startTransition(async () => {
            try {
                const result = await duplicateSurvey(id)
                if (result.success) {
                    // Refresh data after successful duplication
                    await fetchSurveys()
                    toast.success(tRef.current("table.messages.surveyDuplicatedSuccess"))
                } else {
                    toast.error(result.error || tRef.current("table.messages.duplicateSurveyError"))
                }
            } catch (error) {
                toast.error(tRef.current("table.messages.unexpectedError"))
            } finally {
                setActionLoading(null)
            }
        })
    }, [fetchSurveys])

    const handleUpdateStatus = React.useCallback((id: string, status: SurveyStatus) => {
        setActionLoading(id)
        startTransition(async () => {
            try {
                const result = await updateSurveyStatus(id, status)
                if (result.success) {
                    // Refresh data after successful status update
                    await fetchSurveys()
                    toast.success(tRef.current("table.messages.surveyUpdatedSuccess"))
                } else {
                    if (result.upgrade) {
                        // Show upgrade modal instead of toast
                        const limitResult = result as any
                        setUpgradeLimit(limitResult.currentLimit || 0)
                        setShowUpgradeModal(true)
                    } else {
                        toast.error(result.error || tRef.current("table.messages.updateSurveyError"))
                    }
                }
            } catch (error) {
                toast.error(tRef.current("table.messages.unexpectedError"))
            } finally {
                setActionLoading(null)
            }
        })
    }, [fetchSurveys])

    const handleCopySurveyId = React.useCallback(async (surveyId: string) => {
        try {
            await navigator.clipboard.writeText(surveyId)
            toast.success(tRef.current("table.messages.surveyIdCopied"))
        } catch {
            toast.error(tRef.current("table.messages.copyError"))
        }
    }, [])

    // Memoized columns definition to prevent recreation on every render
    const columns: ColumnDef<DatabaseSurvey>[] = React.useMemo(() => [
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
                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                                size="icon"
                                disabled={actionLoading === row.original.id}
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
                            <DropdownMenuItem onClick={() => handleDuplicateSurvey(row.original.id)}>
                                <Copy className="h-4 w-4 mr-2" />
                                {t("table.actions.duplicate")}
                            </DropdownMenuItem>
                            {(row.original.status === SurveyStatus.draft || row.original.status === SurveyStatus.published) && (<DropdownMenuSeparator />)}
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
        {
            id: "edit-record-mobile",
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Link href={`/survey/edit/${row.original.id}`}>
                        <Edit className="h-4 w-4" />
                    </Link>
                </div>
            ),
        },
        {
            accessorKey: "name",
            header: ({ column }) => (
                <SortableHeader
                    columnId={column.id}
                    onSort={handleColumnSort}
                    sorting={sorting}
                >
                    {t("table.columns.title")}
                </SortableHeader>
            ),
            cell: ({ row }) => (
                <div className="font-medium">
                    {row.original.name}
                </div>
            ),
            enableHiding: false,
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <SortableHeader
                    columnId={column.id}
                    onSort={handleColumnSort}
                    sorting={sorting}
                >
                    {t("table.columns.status")}
                </SortableHeader>
            ),
            cell: ({ row }) => getStatusBadge(row.original.status),
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
            accessorKey: "responseRate",
            header: ({ column }) => (
                <SortableHeader
                    columnId={column.id}
                    onSort={handleColumnSort}
                    sorting={sorting}
                >
                    <div className="w-full text-right">{t("table.columns.responseRate")}</div>
                </SortableHeader>
            ),
            cell: ({ row }) => (
                <div className="text-right font-medium">
                    {Math.trunc(row.original.responseRate || 0)}%
                </div>
            ),
        },
        {
            accessorKey: "totalResponses",
            header: ({ column }) => (
                <SortableHeader
                    columnId={column.id}
                    onSort={handleColumnSort}
                    sorting={sorting}
                >
                    <div className="w-full text-right">{t("table.columns.responses")}</div>
                </SortableHeader>
            ),
            cell: ({ row }) => (
                <div className="text-right font-medium">
                    {row.original.totalResponses}
                </div>
            ),
        },
        {
            accessorKey: "totalOpenSurveys",
            header: ({ column }) => (
                <SortableHeader
                    columnId={column.id}
                    onSort={handleColumnSort}
                    sorting={sorting}
                >
                    <div className="w-full text-right">{t("table.columns.totalOpenSurveys")}</div>
                </SortableHeader>
            ),
            cell: ({ row }) => (
                <div className="text-right font-medium">
                    {row.original.totalOpenSurveys}
                </div>
            ),
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <SortableHeader
                    columnId={column.id}
                    onSort={handleColumnSort}
                    sorting={sorting}
                >
                    {t("table.columns.createdAt")}
                </SortableHeader>
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(row.original.createdAt).toLocaleDateString()}
                </div>
            ),
        },
        {
            accessorKey: "updatedAt",
            header: ({ column }) => (
                <SortableHeader
                    columnId={column.id}
                    onSort={handleColumnSort}
                    sorting={sorting}
                >
                    {t("table.columns.updatedAt")}
                </SortableHeader>
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(row.original.updatedAt).toLocaleDateString()}
                </div>
            ),
        },
        {
            id: "edit-record-desktop",
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Link href={`/survey/edit/${row.original.id}`}>
                        <Edit className="h-4 w-4" />
                    </Link>
                </div>
            ),
        },
        {
            id: "actions-desktop",
            cell: ({ row }) => (
                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                                size="icon"
                                disabled={actionLoading === row.original.id}
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
                            <DropdownMenuItem onClick={() => handleDuplicateSurvey(row.original.id)}>
                                <Copy className="h-4 w-4 mr-2" />
                                {t("table.actions.duplicate")}
                            </DropdownMenuItem>
                            {(row.original.status === SurveyStatus.draft || row.original.status === SurveyStatus.published) && (<DropdownMenuSeparator />)}
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
    ], [t, actionLoading, handleCopySurveyId, handleDuplicateSurvey, handleUpdateStatus, handleDeleteSurveyClick, getStatusBadge, handleColumnSort, sorting])

    // Optimized table configuration for better performance
    const table = useReactTable({
        data: paginatedData.surveys,
        columns,
        state: {
            columnVisibility,
            rowSelection,
            sorting,
        },
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        // Performance optimizations
        enableGlobalFilter: false,
        enableColumnFilters: false,
        enableMultiSort: false,
        enableSubRowSelection: false,
        enableGrouping: false,
        enableExpanding: false,
        enableHiding: false,
        enableSorting: true, // Enable sorting for our custom implementation
        enablePinning: false,
    })

    return (
        <div className="w-full space-y-4">

            {/* Table Header */}
            <div className="flex flex-col items-start sm:flex-row gap-4 sm:justify-between sm:items-center">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">{t("table.title")}</h2>
                    <Badge variant="secondary" className="ml-2">
                        {paginatedData.totalCount} {t("table.totalSurveys")}
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
                    {canCreateSurvey && (
                        <Button size="sm" asChild>
                            <Link href="/survey/create">
                                <Plus />
                                <span className="hidden lg:inline">{t("table.buttons.createSurvey")}</span>
                                <span className="lg:hidden">Create</span>
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4">
                <div className="flex-1 flex items-center gap-2">
                    <Input
                        ref={searchInputRef}
                        placeholder={t("table.search.placeholder")}
                        defaultValue={filters.search || ""}
                        onChange={(event) => handleSearchChange(event.target.value)}
                        className="max-w-sm"
                    />
                    <Button variant="ghost" size="icon" onClick={() => {
                        if (searchInputRef.current) {
                            searchInputRef.current.value = "";
                            handleSearchChange("");
                        }
                    }} className="-ml-11">
                        <X />
                    </Button>
                </div>
                <Select
                    value={statusFilter}
                    onValueChange={handleStatusFilterChange}
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
                                {headerGroup.headers
                                    .filter((header) => shouldShowColumn(header.id, isMobile))
                                    .map((header) => {
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
                                    {row.getVisibleCells()
                                        .filter((cell: any) => shouldShowColumn(cell.column.id, isMobile))
                                        .map((cell: any) => {
                                            // Don't memoize action columns to ensure dropdown menus work properly
                                            if (cell.column.id.includes('actions') || cell.column.id.includes('edit-record')) {
                                                return (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                )
                                            }

                                            // Memoize other cells for performance
                                            return <MemoizedTableCell key={cell.id} cell={cell} />
                                        })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.filter(col => shouldShowColumn(col.id || '', isMobile)).length}
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
                            value={`${paginatedData.pageSize}`}
                            onValueChange={(value) => {
                                handlePageSizeChange(Number(value))
                            }}
                        >
                            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                <SelectValue
                                    placeholder={paginatedData.pageSize}
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
                            {t("table.pagination.page")} {paginatedData.currentPage} {t("table.pagination.of")}{" "}
                            {paginatedData.totalPages}
                        </div>
                        <div className="ml-auto flex items-center gap-2 lg:ml-0">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => handlePageChange(1)}
                                disabled={!paginatedData.hasPreviousPage}
                            >
                                <span className="sr-only">{t("table.pagination.goToFirstPage")}</span>
                                <ChevronsLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => handlePageChange(paginatedData.currentPage - 1)}
                                disabled={!paginatedData.hasPreviousPage}
                            >
                                <span className="sr-only">{t("table.pagination.goToPreviousPage")}</span>
                                <ChevronLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => handlePageChange(paginatedData.currentPage + 1)}
                                disabled={!paginatedData.hasNextPage}
                            >
                                <span className="sr-only">{t("table.pagination.goToNextPage")}</span>
                                <ChevronRight />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                                onClick={() => handlePageChange(paginatedData.totalPages)}
                                disabled={!paginatedData.hasNextPage}
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

            <UpgradeModal
                open={showUpgradeModal}
                onOpenChange={setShowUpgradeModal}
                limitType="surveys"
                currentLimit={upgradeLimit}
            />
        </div>
    )
}
