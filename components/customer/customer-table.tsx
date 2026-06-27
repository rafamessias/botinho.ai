"use client"

import { memo, useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { Search, Building, MessageSquarePlus, Pencil, Phone } from "lucide-react"
import {
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
    type VisibilityState,
    useReactTable,
} from "@tanstack/react-table"

import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { useCustomerColumnLabels, useCustomerColumns } from "@/components/customer/columns"
import { CustomerTagFilter } from "@/components/customer/customer-tag-filter"
import { customerMatchesTagFilter } from "@/components/customer/customer-tag-utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Customer, CustomerStatus } from "@/lib/types/customer"

export type CustomerStatusFilter = CustomerStatus | "all"

type CustomerTableProps = {
    customers: Customer[]
    availableTags: string[]
    onEdit: (customer: Customer) => void
    onStartConversation?: (customer: Customer) => void
}

const statusBadgeVariant: Record<CustomerStatus, "default" | "secondary" | "outline"> = {
    active: "default",
    inactive: "outline",
    prospect: "secondary",
}

const formatDate = (value: string) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
        return value
    }

    return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date)
}

const CustomerTableComponent = ({
    customers,
    availableTags,
    onEdit,
    onStartConversation,
}: CustomerTableProps) => {
    const t = useTranslations("Customer")
    const columns = useCustomerColumns({ onEdit, onStartConversation })
    const columnLabels = useCustomerColumnLabels()

    const [sorting, setSorting] = useState<SortingState>([{ id: "createdAt", desc: true }])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [globalFilter, setGlobalFilter] = useState("")
    const [statusFilter, setStatusFilter] = useState<CustomerStatusFilter>("all")
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

    const filteredCustomers = useMemo(
        () => customers.filter((customer) => customerMatchesTagFilter(customer, selectedTags)),
        [customers, selectedTags],
    )

    const columnFilters = useMemo<ColumnFiltersState>(
        () => (statusFilter === "all" ? [] : [{ id: "status", value: statusFilter }]),
        [statusFilter],
    )

    const statusLabels = useMemo(
        () => ({
            active: t("table.badges.active"),
            inactive: t("table.badges.inactive"),
            prospect: t("table.badges.prospect"),
        }),
        [t],
    )

    const table = useReactTable({
        data: filteredCustomers,
        columns,
        state: {
            sorting,
            columnVisibility,
            globalFilter,
            columnFilters,
            pagination,
        },
        getRowId: (row) => row.id,
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
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

            const customer = row.original
            const values = [
                customer.name,
                customer.email,
                customer.phone,
                customer.company,
                ...(customer.tags ?? []),
            ]

            return values.some((value) => value?.toLowerCase().includes(query))
        },
    })

    useEffect(() => {
        setPagination((previous) => ({ ...previous, pageIndex: 0 }))
    }, [globalFilter, statusFilter, selectedTags])

    const rows = table.getRowModel().rows
    const hasCustomers = customers.length > 0
    const hasResults = table.getFilteredRowModel().rows.length > 0

    if (!hasCustomers) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/20 px-6 py-12 text-center">
                <p className="text-base font-medium">{t("table.empty.title")}</p>
                <p className="max-w-md text-sm text-muted-foreground">{t("table.empty.description")}</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
                <label className="relative flex flex-1 sm:max-w-sm" htmlFor="customer-search">
                    <Search
                        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden="true"
                    />
                    <Input
                        id="customer-search"
                        placeholder={t("toolbar.searchPlaceholder")}
                        value={globalFilter}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="pl-9"
                        aria-label={t("toolbar.searchPlaceholder")}
                    />
                </label>
                <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as CustomerStatusFilter)}
                >
                    <SelectTrigger className="w-full sm:w-[160px]" aria-label={t("toolbar.statusFilter")}>
                        <SelectValue placeholder={t("toolbar.statusFilter")} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t("toolbar.statusAll")}</SelectItem>
                        <SelectItem value="active">{t("table.badges.active")}</SelectItem>
                        <SelectItem value="prospect">{t("table.badges.prospect")}</SelectItem>
                        <SelectItem value="inactive">{t("table.badges.inactive")}</SelectItem>
                    </SelectContent>
                </Select>
                {availableTags.length > 0 ? (
                    <CustomerTagFilter
                        availableTags={availableTags}
                        selectedTags={selectedTags}
                        onChange={setSelectedTags}
                    />
                ) : null}
                <DataTableViewOptions table={table} columnLabels={columnLabels} />
            </div>

            {!hasResults ? (
                <div className="overflow-hidden rounded-md border bg-card">
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
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {t("table.messages.noResults")}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <>
                    <div className="grid gap-3 md:hidden">
                        {rows.map((row) => {
                            const customer = row.original

                            return (
                                <Card key={customer.id} className="gap-0 py-0 shadow-sm">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="space-y-1">
                                                <h3 className="text-base font-semibold text-foreground">
                                                    {customer.name}
                                                </h3>
                                                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Phone className="size-4 shrink-0" aria-hidden="true" />
                                                    <span>{customer.phone}</span>
                                                </p>
                                                {customer.company && (
                                                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Building className="size-4 shrink-0" aria-hidden="true" />
                                                        <span>{customer.company}</span>
                                                    </p>
                                                )}
                                                {customer.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 pt-1">
                                                        {customer.tags.map((tag) => (
                                                            <Badge key={tag} variant="outline" className="text-xs">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <Badge variant={statusBadgeVariant[customer.status]}>
                                                {statusLabels[customer.status]}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex items-center justify-between px-4 pb-4 pt-0 text-xs text-muted-foreground">
                                        <span>{formatDate(customer.createdAt)}</span>
                                        <div className="flex items-center gap-1">
                                            {onStartConversation && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8"
                                                    onClick={() => onStartConversation(customer)}
                                                    aria-label={t("table.actions.startConversation")}
                                                >
                                                    <MessageSquarePlus className="size-4" aria-hidden="true" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-8"
                                                onClick={() => onEdit(customer)}
                                                aria-label={t("table.actions.edit")}
                                            >
                                                <Pencil className="size-4" aria-hidden="true" />
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            )
                        })}
                    </div>

                    <div className="hidden md:block">
                        <div className="overflow-hidden rounded-md border bg-card">
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
                                    {rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext(),
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <DataTablePagination table={table} pageSizeOptions={[5, 10, 20, 50]} />
                </>
            )}
        </div>
    )
}

export const CustomerTable = memo(CustomerTableComponent)
