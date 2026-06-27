"use client"

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"
import { useTranslations } from "next-intl"
import { Loader2, MessageSquarePlus, Search, UserPlus } from "lucide-react"
import { toast } from "sonner"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import {
    createInboxConversationAction,
    listInboxCustomersAction,
    type InboxConnectionView,
} from "@/components/server-actions/inbox"

type InboxCustomer = {
    id: string
    name: string
    phone: string | null
    email: string | null
}

type AdHocCustomer = {
    name: string
    phone: string
    email: string
}

type NewConversationDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    connections: InboxConnectionView[]
    selectedConnectionIds: string[]
    prefilledCustomer?: Partial<AdHocCustomer> | null
    onConversationCreated: (conversationId: string, existing?: boolean) => void
}

const emptyAdHocCustomer: AdHocCustomer = {
    name: "",
    phone: "",
    email: "",
}

export const NewConversationDialog = ({
    open,
    onOpenChange,
    connections,
    selectedConnectionIds,
    prefilledCustomer,
    onConversationCreated,
}: NewConversationDialogProps) => {
    const t = useTranslations("Inbox.newConversation")

    const [activeTab, setActiveTab] = useState<"existing" | "adhoc">("existing")
    const [customerSearch, setCustomerSearch] = useState("")
    const [customers, setCustomers] = useState<InboxCustomer[]>([])
    const [isLoadingCustomers, setIsLoadingCustomers] = useState(false)
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
    const [adhocCustomer, setAdhocCustomer] = useState<AdHocCustomer>(emptyAdHocCustomer)
    const [dialogConnectionId, setDialogConnectionId] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const availableConnections = useMemo(() => {
        if (selectedConnectionIds.length === 0) {
            return connections
        }

        return connections.filter((connection) => selectedConnectionIds.includes(connection.sessionId))
    }, [connections, selectedConnectionIds])

    const requiresConnectionSelection =
        (selectedConnectionIds.length === 0 || selectedConnectionIds.length > 1) && connections.length > 1
    const effectiveConnectionId =
        selectedConnectionIds.length === 1 ? selectedConnectionIds[0]! : dialogConnectionId

    const selectedCustomer = useMemo(
        () => customers.find((customer) => customer.id === selectedCustomerId) ?? null,
        [customers, selectedCustomerId],
    )

    const resetForm = useCallback(() => {
        setActiveTab("existing")
        setCustomerSearch("")
        setCustomers([])
        setSelectedCustomerId(null)
        setAdhocCustomer(emptyAdHocCustomer)
        setDialogConnectionId(null)
        setIsSubmitting(false)
    }, [])

    const loadCustomers = useCallback(async (searchValue: string) => {
        setIsLoadingCustomers(true)
        try {
            const result = await listInboxCustomersAction({
                search: searchValue.trim() ? searchValue.trim() : undefined,
                pageSize: 50,
            })

            if (!result.success || !result.data) {
                throw new Error(result.error || "Unable to load customers")
            }

            setCustomers(result.data.customers as InboxCustomer[])
        } catch (error) {
            console.error("Failed to load inbox customers", error)
            setCustomers([])
            toast.error(t("errors.loadCustomers"))
        } finally {
            setIsLoadingCustomers(false)
        }
    }, [t])

    useEffect(() => {
        if (!open) {
            resetForm()
            return
        }

        if (prefilledCustomer?.name || prefilledCustomer?.phone || prefilledCustomer?.email) {
            setActiveTab("adhoc")
            setAdhocCustomer({
                name: prefilledCustomer.name ?? "",
                phone: prefilledCustomer.phone ?? "",
                email: prefilledCustomer.email ?? "",
            })
        }

        if (availableConnections.length === 1) {
            setDialogConnectionId(availableConnections[0]!.sessionId)
        }

        void loadCustomers("")
    }, [availableConnections, loadCustomers, open, prefilledCustomer, resetForm])

    useEffect(() => {
        if (!open || activeTab !== "existing") {
            return
        }

        const handler = setTimeout(() => {
            void loadCustomers(customerSearch)
        }, 300)

        return () => clearTimeout(handler)
    }, [activeTab, customerSearch, loadCustomers, open])

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (requiresConnectionSelection && !effectiveConnectionId) {
            toast.error(t("errors.connectionRequired"))
            return
        }

        let customerPayload: { name: string; phone?: string; email?: string }

        if (activeTab === "existing") {
            if (!selectedCustomer) {
                toast.error(t("errors.customerRequired"))
                return
            }

            customerPayload = {
                name: selectedCustomer.name,
                phone: selectedCustomer.phone ?? undefined,
                email: selectedCustomer.email ?? undefined,
            }
        } else {
            const name = adhocCustomer.name.trim()
            const phone = adhocCustomer.phone.trim()
            const email = adhocCustomer.email.trim()

            if (!name) {
                toast.error(t("errors.nameRequired"))
                return
            }

            if (!phone) {
                toast.error(t("errors.phoneRequired"))
                return
            }

            customerPayload = {
                name,
                phone,
                ...(email ? { email } : {}),
            }
        }

        setIsSubmitting(true)
        try {
            const result = await createInboxConversationAction({
                customer: customerPayload,
                ...(effectiveConnectionId ? { sessionId: effectiveConnectionId } : {}),
            })

            if (!result.success || !result.data) {
                throw new Error(result.error || "Unable to create conversation")
            }

            toast.success(result.data.existing ? t("messages.existingConversation") : t("messages.created"))
            onConversationCreated(result.data.conversation.id, result.data.existing)
            onOpenChange(false)
        } catch (error) {
            console.error("Failed to create conversation", error)
            const message = error instanceof Error ? error.message : t("errors.createFailed")
            toast.error(message || t("errors.createFailed"))
        } finally {
            setIsSubmitting(false)
        }
    }

    const getConnectionLabel = (connection: InboxConnectionView) =>
        connection.label ?? connection.phoneNumber ?? connection.sessionId

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MessageSquarePlus className="size-5" aria-hidden="true" />
                        {t("title")}
                    </DialogTitle>
                    <DialogDescription>{t("description")}</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex min-h-0 flex-col gap-4">
                    {requiresConnectionSelection && (
                        <div className="space-y-2">
                            <Label htmlFor="new-conversation-connection">{t("connectionLabel")}</Label>
                            <Select
                                value={dialogConnectionId ?? undefined}
                                onValueChange={setDialogConnectionId}
                            >
                                <SelectTrigger id="new-conversation-connection" className="w-full">
                                    <SelectValue placeholder={t("connectionPlaceholder")} />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableConnections.map((connection) => (
                                        <SelectItem key={connection.sessionId} value={connection.sessionId}>
                                            {getConnectionLabel(connection)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <Tabs
                        value={activeTab}
                        onValueChange={(value) => setActiveTab(value as "existing" | "adhoc")}
                        className="min-h-0 flex-1"
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="existing">{t("tabs.existing")}</TabsTrigger>
                            <TabsTrigger value="adhoc">{t("tabs.adhoc")}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="existing" className="mt-4 space-y-3">
                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                                    aria-hidden="true"
                                />
                                <Input
                                    value={customerSearch}
                                    onChange={(event) => setCustomerSearch(event.target.value)}
                                    placeholder={t("searchCustomersPlaceholder")}
                                    className="pl-9"
                                    aria-label={t("searchCustomersPlaceholder")}
                                />
                            </div>

                            <div className="max-h-72 overflow-auto rounded-lg border">
                                {isLoadingCustomers ? (
                                    <div className="flex items-center justify-center gap-2 px-4 py-10 text-sm text-muted-foreground">
                                        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                                        {t("loadingCustomers")}
                                    </div>
                                ) : customers.length === 0 ? (
                                    <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                                        {t("emptyCustomers")}
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>{t("columns.name")}</TableHead>
                                                <TableHead>{t("columns.phone")}</TableHead>
                                                <TableHead>{t("columns.email")}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {customers.map((customer) => {
                                                const isSelected = selectedCustomerId === customer.id

                                                return (
                                                    <TableRow
                                                        key={customer.id}
                                                        className={cn(
                                                            "cursor-pointer",
                                                            isSelected && "bg-primary/10",
                                                        )}
                                                        onClick={() => setSelectedCustomerId(customer.id)}
                                                        aria-selected={isSelected}
                                                    >
                                                        <TableCell className="font-medium">{customer.name}</TableCell>
                                                        <TableCell>{customer.phone ?? "—"}</TableCell>
                                                        <TableCell>{customer.email ?? "—"}</TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="adhoc" className="mt-4 space-y-4">
                            <div className="flex items-center gap-2 rounded-lg border border-dashed bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                                <UserPlus className="size-4 shrink-0" aria-hidden="true" />
                                {t("adhocHint")}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="adhoc-name">{t("fields.name")}</Label>
                                <Input
                                    id="adhoc-name"
                                    value={adhocCustomer.name}
                                    onChange={(event) =>
                                        setAdhocCustomer((previous) => ({
                                            ...previous,
                                            name: event.target.value,
                                        }))
                                    }
                                    placeholder={t("fields.namePlaceholder")}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="adhoc-phone">{t("fields.phone")}</Label>
                                <Input
                                    id="adhoc-phone"
                                    value={adhocCustomer.phone}
                                    onChange={(event) =>
                                        setAdhocCustomer((previous) => ({
                                            ...previous,
                                            phone: event.target.value,
                                        }))
                                    }
                                    placeholder={t("fields.phonePlaceholder")}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="adhoc-email">{t("fields.email")}</Label>
                                <Input
                                    id="adhoc-email"
                                    type="email"
                                    value={adhocCustomer.email}
                                    onChange={(event) =>
                                        setAdhocCustomer((previous) => ({
                                            ...previous,
                                            email: event.target.value,
                                        }))
                                    }
                                    placeholder={t("fields.emailPlaceholder")}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                            {t("actions.cancel")}
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
                                    {t("actions.creating")}
                                </>
                            ) : (
                                t("actions.start")
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
