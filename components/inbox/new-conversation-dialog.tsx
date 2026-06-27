"use client"

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"
import { useTranslations } from "next-intl"
import { Loader2, MessageSquarePlus, Search, UserPlus, X } from "lucide-react"
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
import { maskPhoneForDisplay } from "@/lib/phone-utils"
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

const RECENT_CUSTOMERS_LIMIT = 5
const SEARCH_CUSTOMERS_LIMIT = 20
const SEARCH_DEBOUNCE_MS = 300

export const NewConversationDialog = ({
    open,
    onOpenChange,
    connections,
    selectedConnectionIds,
    prefilledCustomer,
    onConversationCreated,
}: NewConversationDialogProps) => {
    const t = useTranslations("Inbox.newConversation")
    const tInbox = useTranslations("Inbox")

    const [activeTab, setActiveTab] = useState<"existing" | "adhoc">("existing")
    const [customerSearch, setCustomerSearch] = useState("")
    const [customers, setCustomers] = useState<InboxCustomer[]>([])
    const [isLoadingCustomers, setIsLoadingCustomers] = useState(false)
    const [startingCustomerId, setStartingCustomerId] = useState<string | null>(null)
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

    const resetForm = useCallback(() => {
        setActiveTab("existing")
        setCustomerSearch("")
        setCustomers([])
        setStartingCustomerId(null)
        setAdhocCustomer(emptyAdHocCustomer)
        setDialogConnectionId(null)
        setIsSubmitting(false)
    }, [])

    const loadCustomers = useCallback(async (searchValue: string) => {
        setIsLoadingCustomers(true)
        try {
            const trimmedSearch = searchValue.trim()
            const result = await listInboxCustomersAction({
                search: trimmedSearch || undefined,
                pageSize: trimmedSearch ? SEARCH_CUSTOMERS_LIMIT : RECENT_CUSTOMERS_LIMIT,
                orderBy: trimmedSearch ? undefined : "createdAt",
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
    }, [availableConnections, open, prefilledCustomer, resetForm])

    useEffect(() => {
        if (!open || activeTab !== "existing") {
            return
        }

        if (!customerSearch.trim()) {
            void loadCustomers("")
            return
        }

        const handler = setTimeout(() => {
            void loadCustomers(customerSearch)
        }, SEARCH_DEBOUNCE_MS)

        return () => clearTimeout(handler)
    }, [activeTab, customerSearch, loadCustomers, open])

    const startConversation = useCallback(
        async (
            customerPayload: { name: string; phone?: string; email?: string },
            customerId?: string,
        ) => {
            if (requiresConnectionSelection && !effectiveConnectionId) {
                toast.error(t("errors.connectionRequired"))
                return
            }

            if (customerId) {
                setStartingCustomerId(customerId)
            } else {
                setIsSubmitting(true)
            }

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
                setStartingCustomerId(null)
                setIsSubmitting(false)
            }
        },
        [
            effectiveConnectionId,
            onConversationCreated,
            onOpenChange,
            requiresConnectionSelection,
            t,
        ],
    )

    const handleCustomerRowClick = useCallback(
        (customer: InboxCustomer) => {
            if (startingCustomerId || isSubmitting) {
                return
            }

            void startConversation(
                {
                    name: customer.name,
                    phone: customer.phone ?? undefined,
                    email: customer.email ?? undefined,
                },
                customer.id,
            )
        },
        [isSubmitting, startConversation, startingCustomerId],
    )

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (activeTab === "existing") {
            return
        }

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

        await startConversation({
            name,
            phone,
            ...(email ? { email } : {}),
        })
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
                                    className="pl-9 pr-10"
                                    aria-label={t("searchCustomersPlaceholder")}
                                />
                                {customerSearch && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-1 top-1/2 size-7 -translate-y-1/2 text-muted-foreground hover:bg-muted hover:text-foreground"
                                        onClick={() => setCustomerSearch("")}
                                        aria-label={tInbox("clearSearch")}
                                    >
                                        <X className="size-4" aria-hidden="true" />
                                    </Button>
                                )}
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
                                                const isStarting = startingCustomerId === customer.id

                                                return (
                                                    <TableRow
                                                        key={customer.id}
                                                        className={cn(
                                                            "cursor-pointer",
                                                            isStarting && "bg-primary/10",
                                                            (startingCustomerId !== null || isSubmitting) &&
                                                                !isStarting &&
                                                                "pointer-events-none opacity-50",
                                                        )}
                                                        onClick={() => handleCustomerRowClick(customer)}
                                                        aria-busy={isStarting}
                                                    >
                                                        <TableCell className="font-medium">
                                                            <span className="flex items-center gap-2">
                                                                {isStarting ? (
                                                                    <Loader2
                                                                        className="size-4 shrink-0 animate-spin"
                                                                        aria-hidden="true"
                                                                    />
                                                                ) : null}
                                                                {customer.name}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            {customer.phone
                                                                ? maskPhoneForDisplay(customer.phone)
                                                                : "—"}
                                                        </TableCell>
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
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting || startingCustomerId !== null}
                        >
                            {t("actions.cancel")}
                        </Button>
                        {activeTab === "adhoc" ? (
                            <Button type="submit" disabled={isSubmitting || startingCustomerId !== null}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
                                        {t("actions.creating")}
                                    </>
                                ) : (
                                    t("actions.start")
                                )}
                            </Button>
                        ) : null}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
