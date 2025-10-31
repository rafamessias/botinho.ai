"use client"

import { memo, useMemo } from "react"
import { useTranslations } from "next-intl"
import { MoreHorizontal, Pencil, Mail, Phone, Building } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Customer } from "@/lib/types/customer"

type CustomerTableProps = {
    customers: Customer[]
    onEdit: (customer: Customer) => void
}

const statusToneClasses: Record<Customer["status"], string> = {
    active: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
    inactive: "bg-muted text-muted-foreground",
    prospect: "bg-blue-500/15 text-blue-600 dark:text-blue-300",
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

const CustomerTableComponent = ({ customers, onEdit }: CustomerTableProps) => {
    const t = useTranslations("Customer")

    const statusLabels = useMemo(
        () => ({
            active: t("table.badges.active"),
            inactive: t("table.badges.inactive"),
            prospect: t("table.badges.prospect"),
        }),
        [t],
    )

    if (customers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/20 px-6 py-12 text-center">
                <p className="text-base font-medium">{t("table.empty.title")}</p>
                <p className="max-w-md text-sm text-muted-foreground">{t("table.empty.description")}</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-3 md:hidden">
                {customers.map((customer) => (
                    <article
                        key={customer.id}
                        className="rounded-xl border bg-card p-4 shadow-sm transition hover:shadow-md"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                                <h3 className="text-base font-semibold text-foreground">{customer.name}</h3>
                                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Mail className="size-4" aria-hidden="true" />
                                    <span>{customer.email}</span>
                                </p>
                                {customer.phone && (
                                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Phone className="size-4" aria-hidden="true" />
                                        <span>{customer.phone}</span>
                                    </p>
                                )}
                                {customer.company && (
                                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Building className="size-4" aria-hidden="true" />
                                        <span>{customer.company}</span>
                                    </p>
                                )}
                            </div>
                            <Badge className={`px-2 py-1 text-xs font-medium ${statusToneClasses[customer.status]}`}>
                                {statusLabels[customer.status]}
                            </Badge>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                            <span>{formatDate(customer.createdAt)}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => onEdit(customer)}
                                aria-label={t("table.actions.edit")}
                            >
                                <Pencil className="mr-2 size-4" aria-hidden="true" />
                                {t("table.actions.edit")}
                            </Button>
                        </div>
                    </article>
                ))}
            </div>

            <div className="hidden overflow-x-auto rounded-xl border bg-card md:block">
                <Table>
                    <TableHeader className="bg-muted/40">
                        <TableRow>
                            <TableHead className="min-w-[220px]">{t("table.columns.name")}</TableHead>
                            <TableHead className="min-w-[200px]">{t("table.columns.email")}</TableHead>
                            <TableHead>{t("table.columns.phone")}</TableHead>
                            <TableHead>{t("table.columns.company")}</TableHead>
                            <TableHead>{t("table.columns.status")}</TableHead>
                            <TableHead className="text-right">{t("table.columns.createdAt")}</TableHead>
                            <TableHead className="w-[60px] text-right">
                                <span className="sr-only">{t("table.actions.edit")}</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers.map((customer) => (
                            <TableRow key={customer.id} className="hover:bg-muted/30">
                                <TableCell className="font-medium">{customer.name}</TableCell>
                                <TableCell>{customer.email}</TableCell>
                                <TableCell>{customer.phone ?? "—"}</TableCell>
                                <TableCell>{customer.company ?? "—"}</TableCell>
                                <TableCell>
                                    <Badge className={`px-2 py-1 text-xs font-medium ${statusToneClasses[customer.status]}`}>
                                        {statusLabels[customer.status]}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right text-sm text-muted-foreground">
                                    {formatDate(customer.createdAt)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                aria-label={t("table.actions.edit")}
                                            >
                                                <MoreHorizontal className="size-4" aria-hidden="true" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onSelect={() => onEdit(customer)}>
                                                <Pencil className="mr-2 size-4" aria-hidden="true" />
                                                {t("table.actions.edit")}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export const CustomerTable = memo(CustomerTableComponent)

