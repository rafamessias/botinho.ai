"use client"

import { useCallback, useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2, Plus } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "@/i18n/navigation"

import { Button } from "@/components/ui/button"
import type { Customer } from "@/lib/types/customer"
import { CustomerModal, type CustomerFormValues } from "@/components/customer/customer-modal"
import { CustomerTable } from "@/components/customer/customer-table"
import {
    bulkImportCustomersAction,
    createCustomerAction,
    listCustomersAction,
    updateCustomerAction,
} from "@/components/server-actions/customers"
import { useUser } from "@/components/user-provider"

export const CustomerPage = () => {
    const t = useTranslations("Customer")
    const router = useRouter()
    const { user } = useUser()

    const [customers, setCustomers] = useState<Customer[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<"create" | "edit">("create")
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    const companyId = user?.defaultCompanyId != null ? String(user.defaultCompanyId) : null

    const loadCustomers = useCallback(async () => {
        if (!companyId) {
            setCustomers([])
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        try {
            const result = await listCustomersAction({ pageSize: 200 })

            if (!result.success || !result.data) {
                throw new Error(result.error || "Unable to load customers")
            }

            setCustomers(result.data.customers)
        } catch (error) {
            console.error("Failed to load customers", error)
            toast.error(t("messages.loadFailed"))
            setCustomers([])
        } finally {
            setIsLoading(false)
        }
    }, [companyId, t])

    useEffect(() => {
        void loadCustomers()
    }, [loadCustomers])

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false)
        setSelectedCustomer(null)
        setIsSaving(false)
    }, [])

    const handleOpenCreateModal = useCallback(() => {
        setModalMode("create")
        setSelectedCustomer(null)
        setIsModalOpen(true)
    }, [])

    const handleEditCustomer = useCallback((customer: Customer) => {
        setModalMode("edit")
        setSelectedCustomer(customer)
        setIsModalOpen(true)
    }, [])

    const handleStartConversation = useCallback(
        (customer: Customer) => {
            const params = new URLSearchParams({
                startConversation: "1",
                name: customer.name,
            })

            if (customer.phone) {
                params.set("phone", customer.phone)
            }

            if (customer.email) {
                params.set("email", customer.email)
            }

            router.push(`/inbox?${params.toString()}`)
        },
        [router],
    )

    const handleSubmitCustomer = useCallback(
        async (values: CustomerFormValues) => {
            setIsSaving(true)
            try {
                if (modalMode === "create") {
                    const result = await createCustomerAction({
                        name: values.name,
                        phone: values.phone,
                        email: values.email,
                        company: values.company,
                        description: values.description,
                        status: values.status,
                    })

                    if (!result.success || !result.data) {
                        throw new Error(result.error || "Unable to create customer")
                    }

                    const { customer } = result.data
                    setCustomers((previous) => [customer, ...previous])
                    toast.success(t("messages.customerCreated"))
                } else if (selectedCustomer) {
                    const result = await updateCustomerAction({
                        customerId: selectedCustomer.id,
                        name: values.name,
                        phone: values.phone,
                        email: values.email,
                        company: values.company,
                        description: values.description,
                        status: values.status,
                    })

                    if (!result.success || !result.data) {
                        throw new Error(result.error || "Unable to update customer")
                    }

                    const { customer } = result.data
                    setCustomers((previous) =>
                        previous.map((item) => (item.id === selectedCustomer.id ? customer : item)),
                    )
                    toast.success(t("messages.customerUpdated"))
                }

                handleCloseModal()
            } catch (error) {
                console.error("Failed to save customer", error)
                const message = error instanceof Error ? error.message : t("messages.customerSaveError")
                toast.error(message || t("messages.customerSaveError"))
            } finally {
                setIsSaving(false)
            }
        },
        [handleCloseModal, modalMode, selectedCustomer, t],
    )

    const handleBulkImport = useCallback(
        async (customersToImport: Omit<Customer, "id" | "createdAt" | "updatedAt">[]) => {
            try {
                const result = await bulkImportCustomersAction({
                    customers: customersToImport.map((customer) => ({
                        name: customer.name,
                        phone: customer.phone,
                        email: customer.email,
                        company: customer.company,
                        status: customer.status,
                    })),
                })

                if (!result.success || !result.data) {
                    throw new Error(result.error || "Unable to import customers")
                }

                if (result.data.customers.length > 0) {
                    setCustomers((previous) => [...result.data!.customers, ...previous])
                    toast.success(t("messages.customersImported", { count: result.data.customers.length }))
                }

                if (result.data.errors.length > 0) {
                    toast.warning(t("import.parsedWithErrors", { count: result.data.errors.length }))
                }

                handleCloseModal()
            } catch (error) {
                console.error("Failed to import customers", error)
                const message = error instanceof Error ? error.message : t("messages.customersImportError")
                toast.error(message || t("messages.customersImportError"))
                throw error
            }
        },
        [handleCloseModal, t],
    )

    if (isLoading) {
        return (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                {t("messages.loading")}
            </div>
        )
    }

    return (
        <div className="section-spacing space-y-6">
            <div className="flex justify-end">
                <Button
                    onClick={handleOpenCreateModal}
                    className="sm:w-auto"
                    aria-label={t("toolbar.addCustomer")}
                >
                    <Plus className="mr-2 size-4" aria-hidden="true" />
                    {t("toolbar.addCustomer")}
                </Button>
            </div>

            <CustomerTable
                customers={customers}
                onEdit={handleEditCustomer}
                onStartConversation={handleStartConversation}
            />

            <CustomerModal
                isOpen={isModalOpen}
                mode={modalMode}
                onClose={handleCloseModal}
                onSubmit={handleSubmitCustomer}
                initialCustomer={selectedCustomer}
                isSubmitting={isSaving}
                onBulkImport={handleBulkImport}
            />
        </div>
    )
}

export default CustomerPage
