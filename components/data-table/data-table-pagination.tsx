"use client"

import { type Table } from "@tanstack/react-table"
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type DataTablePaginationProps<TData> = {
    table: Table<TData>
    pageSizeOptions?: number[]
    showRange?: boolean
}

export const DataTablePagination = <TData,>({
    table,
    pageSizeOptions = [10, 20, 30, 40, 50],
    showRange = false,
}: DataTablePaginationProps<TData>) => {
    const t = useTranslations("DataTable.pagination")
    const selectedCount = table.getFilteredSelectedRowModel().rows.length
    const totalCount = table.getFilteredRowModel().rows.length
    const pageIndex = table.getState().pagination.pageIndex
    const pageSize = table.getState().pagination.pageSize
    const from = totalCount === 0 ? 0 : pageIndex * pageSize + 1
    const to = Math.min((pageIndex + 1) * pageSize, totalCount)

    return (
        <div className="flex items-center justify-between px-2 py-4">
            <div className="text-muted-foreground flex-1 text-sm">
                {showRange
                    ? t("showingRange", { from, to, total: totalCount })
                    : selectedCount > 0
                      ? t("rowsSelected", { selected: selectedCount, total: totalCount })
                      : t("totalRows", { count: totalCount })}
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">{t("rowsPerPage")}</p>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => table.setPageSize(Number(value))}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {pageSizeOptions.map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    {t("page")} {table.getState().pagination.pageIndex + 1} {t("of")}{" "}
                    {table.getPageCount() || 1}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden size-8 lg:flex"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">{t("goToFirstPage")}</span>
                        <ChevronsLeft className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">{t("goToPreviousPage")}</span>
                        <ChevronLeft className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">{t("goToNextPage")}</span>
                        <ChevronRight className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden size-8 lg:flex"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">{t("goToLastPage")}</span>
                        <ChevronsRight className="size-4" aria-hidden="true" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
