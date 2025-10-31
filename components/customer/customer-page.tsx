"use client"

import { useCallback, useMemo, useState, type ChangeEvent } from "react"
import { useTranslations } from "next-intl"
import { Plus, Search } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Customer } from "@/lib/types/customer"
import { CustomerModal, type CustomerFormValues } from "@/components/customer/customer-modal"
import { CustomerTable } from "@/components/customer/customer-table"

const now = new Date()

const initialCustomers: Customer[] = [
    {
        id: "cust-001",
        name: "Maria Silva",
        email: "maria.silva@example.com",
        phone: "+55 (11) 99999-1234",
        company: "Botinho LTDA",
        status: "active",
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7).toISOString(),
        updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
    {
        id: "cust-002",
        name: "João Pereira",
        email: "joao.pereira@example.com",
        phone: "+55 (21) 98888-4321",
        company: "Loja do João",
        status: "prospect",
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 15).toISOString(),
        updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    },
    {
        id: "cust-003",
        name: "Ana Costa",
        email: "ana.costa@example.com",
        company: "Costa Consulting",
        status: "inactive",
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    },
]

const generateCustomerId = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `cust-${Math.random().toString(36).slice(2, 10)}`

export const CustomerPage = () => {
    const t = useTranslations("Customer")

    const [customers, setCustomers] = useState<Customer[]>(initialCustomers)
    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<"create" | "edit">("create")
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value)
    }, [])

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

    const handleSubmitCustomer = useCallback(
        async (values: CustomerFormValues) => {
            try {
                setIsSaving(true)
                const timestamp = new Date().toISOString()

                if (modalMode === "create") {
                    const newCustomer: Customer = {
                        id: generateCustomerId(),
                        name: values.name,
                        email: values.email,
                        phone: values.phone,
                        company: values.company,
                        status: values.status,
                        createdAt: timestamp,
                        updatedAt: timestamp,
                    }

                    setCustomers((previous) => [newCustomer, ...previous])
                    toast.success(t("messages.customerCreated"))
                } else if (selectedCustomer) {
                    setCustomers((previous) =>
                        previous.map((customer) =>
                            customer.id === selectedCustomer.id
                                ? {
                                      ...customer,
                                      name: values.name,
                                      email: values.email,
                                      phone: values.phone,
                                      company: values.company,
                                      status: values.status,
                                      updatedAt: timestamp,
                                  }
                                : customer,
                        ),
                    )
                    toast.success(t("messages.customerUpdated"))
                }

                handleCloseModal()
            } catch (error) {
                console.error("Failed to save customer", error)
                toast.error(t("messages.customerSaveError"))
                setIsSaving(false)
            }
        },
        [handleCloseModal, modalMode, selectedCustomer, t],
    )

    const filteredCustomers = useMemo(() => {
        const query = searchTerm.trim().toLowerCase()
        if (!query) {
            return customers
        }

        return customers.filter((customer) => {
            if (
                customer.name.toLowerCase().includes(query) ||
                customer.email.toLowerCase().includes(query)
            ) {
                return true
            }

            if (customer.phone && customer.phone.toLowerCase().includes(query)) {
                return true
            }

            if (customer.company && customer.company.toLowerCase().includes(query)) {
                return true
            }

            return false
        })
    }, [customers, searchTerm])

    return (
        <div className="section-spacing space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="relative flex w-full sm:max-w-xs" htmlFor="customer-search">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <Input
                        id="customer-search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder={t("toolbar.searchPlaceholder")}
                        className="pl-9"
                        aria-label={t("toolbar.searchPlaceholder")}
                    />
                </label>
                <Button
                    onClick={handleOpenCreateModal}
                    className="sm:w-auto"
                    aria-label={t("toolbar.addCustomer")}
                >
                    <Plus className="mr-2 size-4" aria-hidden="true" />
                    {t("toolbar.addCustomer")}
                </Button>
            </div>

            <CustomerTable customers={filteredCustomers} onEdit={handleEditCustomer} />

            <CustomerModal
                isOpen={isModalOpen}
                mode={modalMode}
                onClose={handleCloseModal}
                onSubmit={handleSubmitCustomer}
                initialCustomer={selectedCustomer}
                isSubmitting={isSaving}
            />
        </div>
    )
}

export default CustomerPage

