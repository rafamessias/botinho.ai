"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2, Search, UserPlus, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PhoneInput } from "@/components/ui/phone-input"
import { listInboxCustomersAction } from "@/components/server-actions/inbox"
import { isPhoneLikeString, maskPhoneForDisplay } from "@/lib/phone-utils"
import { cn } from "@/lib/utils"

const SEARCH_CUSTOMERS_LIMIT = 20
const SEARCH_DEBOUNCE_MS = 300

type InboxCustomer = {
  id: string
  name: string
  phone: string | null
  email: string | null
}

export type CustomerPickerValue = {
  customerId?: string
  customerName?: string
  customerPhone?: string
  customerEmail?: string
}

type CustomerPickerFieldProps = {
  value: CustomerPickerValue
  onChange: (value: CustomerPickerValue) => void
  disabled?: boolean
}

const getCustomerPrimaryLabel = (customer: InboxCustomer) => {
  const name = customer.name.trim()
  if (name && !isPhoneLikeString(name)) {
    return name
  }
  if (customer.phone) {
    return maskPhoneForDisplay(customer.phone)
  }
  return name || customer.email || "—"
}

const getCustomerSecondaryLabel = (customer: InboxCustomer) => {
  const name = customer.name.trim()
  const phone = customer.phone ? maskPhoneForDisplay(customer.phone) : null

  if (name && !isPhoneLikeString(name) && phone) {
    return phone
  }
  if (customer.email && customer.email !== name) {
    return customer.email
  }
  return null
}

export const CustomerPickerField = ({ value, onChange, disabled = false }: CustomerPickerFieldProps) => {
  const t = useTranslations("Schedule.modal.customer")
  const [customers, setCustomers] = useState<InboxCustomer[]>([])
  const [customerSearch, setCustomerSearch] = useState("")
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false)
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
  })
  const committedSearchRef = useRef("")

  const trimmedSearch = customerSearch.trim()
  const showSearchResults =
    !disabled &&
    !value.customerId &&
    !isCreatingNew &&
    Boolean(trimmedSearch) &&
    trimmedSearch !== committedSearchRef.current

  const loadCustomers = useCallback(
    async (searchValue: string) => {
      setIsLoadingCustomers(true)
      try {
        const result = await listInboxCustomersAction({
          search: searchValue,
          pageSize: SEARCH_CUSTOMERS_LIMIT,
        })

        if (!result.success || !result.data) {
          throw new Error(result.error || "Unable to load customers")
        }

        setCustomers(result.data.customers as InboxCustomer[])
      } catch (error) {
        console.error("Failed to load customers for reservation", error)
        setCustomers([])
        toast.error(t("loadFailed"))
      } finally {
        setIsLoadingCustomers(false)
      }
    },
    [t],
  )

  useEffect(() => {
    if (!trimmedSearch || value.customerId || isCreatingNew) {
      setCustomers([])
      return
    }

    const timeout = setTimeout(() => {
      void loadCustomers(trimmedSearch)
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timeout)
  }, [isCreatingNew, loadCustomers, trimmedSearch, value.customerId])

  useEffect(() => {
    if (value.customerId) {
      setCustomerSearch(value.customerName ?? "")
      committedSearchRef.current = value.customerName?.trim() ?? ""
      setIsCreatingNew(false)
      return
    }

    if (value.customerName || value.customerPhone || value.customerEmail) {
      setIsCreatingNew(true)
      setNewCustomer({
        name: value.customerName ?? "",
        phone: value.customerPhone ?? "",
        email: value.customerEmail ?? "",
      })
      setCustomerSearch("")
      committedSearchRef.current = ""
    }
  }, [value.customerEmail, value.customerId, value.customerName, value.customerPhone])

  const handleClearCustomer = () => {
    onChange({})
    setCustomerSearch("")
    committedSearchRef.current = ""
    setCustomers([])
    setIsCreatingNew(false)
    setNewCustomer({ name: "", phone: "", email: "" })
  }

  const handleCustomerSearchChange = (searchValue: string) => {
    setCustomerSearch(searchValue)
    setIsCreatingNew(false)
    setNewCustomer({ name: "", phone: "", email: "" })

    if (!searchValue.trim()) {
      handleClearCustomer()
      return
    }

    if (value.customerId && searchValue.trim() !== value.customerName?.trim()) {
      onChange({})
      committedSearchRef.current = ""
    }
  }

  const handleSelectCustomer = (customer: InboxCustomer) => {
    onChange({
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone ?? undefined,
      customerEmail: customer.email ?? undefined,
    })
    setCustomerSearch(getCustomerPrimaryLabel(customer))
    committedSearchRef.current = getCustomerPrimaryLabel(customer)
    setCustomers([])
    setIsCreatingNew(false)
  }

  const handleStartCreateNew = () => {
    const query = trimmedSearch
    const queryIsPhone = isPhoneLikeString(query)

    const nextCustomer = {
      name: queryIsPhone ? "" : query,
      phone: queryIsPhone ? query : "",
      email: "",
    }

    setNewCustomer(nextCustomer)
    setIsCreatingNew(true)
    setCustomers([])
    setCustomerSearch("")
    committedSearchRef.current = ""
    onChange({
      customerName: nextCustomer.name.trim() || undefined,
      customerPhone: nextCustomer.phone.trim() || undefined,
    })
  }

  const handleNewCustomerChange = (field: "name" | "phone" | "email", fieldValue: string) => {
    const next = { ...newCustomer, [field]: fieldValue }
    setNewCustomer(next)
    onChange({
      customerName: next.name.trim() || undefined,
      customerPhone: next.phone.trim() || undefined,
      customerEmail: next.email.trim() || undefined,
    })
  }

  const handleBackToSearch = () => {
    setIsCreatingNew(false)
    setNewCustomer({ name: "", phone: "", email: "" })
    onChange({})
    setCustomerSearch("")
    committedSearchRef.current = ""
  }

  const showAddNewInResults = showSearchResults && !isLoadingCustomers && Boolean(trimmedSearch)

  return (
    <div className="space-y-2">
      <Label>{t("label")}</Label>

      {!isCreatingNew ? (
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={customerSearch}
            onChange={(event) => handleCustomerSearchChange(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className="pl-9 pr-10"
            disabled={disabled}
            aria-label={t("searchPlaceholder")}
          />
          {customerSearch && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 size-7 -translate-y-1/2 text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={handleClearCustomer}
              disabled={disabled}
              aria-label={t("clear")}
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          )}

          {showSearchResults && (
            <div className="absolute top-full z-20 mt-1 max-h-44 w-full overflow-y-auto rounded-md border bg-popover shadow-md">
              {isLoadingCustomers ? (
                <div className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  {t("loading")}
                </div>
              ) : customers.length === 0 ? (
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-3 text-left text-sm hover:bg-muted"
                  onClick={handleStartCreateNew}
                  disabled={disabled}
                >
                  <UserPlus className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{t("addNew")}</span>
                </button>
              ) : (
                <>
                  {customers.map((customer) => {
                    const secondary = getCustomerSecondaryLabel(customer)

                    return (
                      <button
                        key={customer.id}
                        type="button"
                        className="flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-muted"
                        onClick={() => handleSelectCustomer(customer)}
                        disabled={disabled}
                      >
                        <span className="font-medium">{getCustomerPrimaryLabel(customer)}</span>
                        {secondary && (
                          <span className="text-xs text-muted-foreground">{secondary}</span>
                        )}
                      </button>
                    )
                  })}
                  {showAddNewInResults && (
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center gap-2 border-t px-3 py-2 text-left text-sm hover:bg-muted",
                      )}
                      onClick={handleStartCreateNew}
                      disabled={disabled}
                    >
                      <UserPlus className="size-4 shrink-0 text-primary" aria-hidden="true" />
                      <span>{t("addNew")}</span>
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3 rounded-md border border-dashed p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium">{t("newCustomerTitle")}</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground"
              onClick={handleBackToSearch}
              disabled={disabled}
            >
              {t("backToSearch")}
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reservation-customer-name">{t("name")}</Label>
            <Input
              id="reservation-customer-name"
              value={newCustomer.name}
              onChange={(event) => handleNewCustomerChange("name", event.target.value)}
              placeholder={t("namePlaceholder")}
              disabled={disabled}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reservation-customer-phone">{t("phone")}</Label>
            <PhoneInput
              id="reservation-customer-phone"
              value={newCustomer.phone}
              onChange={(phone) => handleNewCustomerChange("phone", phone)}
              disabled={disabled}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reservation-customer-email">{t("email")}</Label>
            <Input
              id="reservation-customer-email"
              type="email"
              value={newCustomer.email}
              onChange={(event) => handleNewCustomerChange("email", event.target.value)}
              placeholder={t("emailPlaceholder")}
              disabled={disabled}
            />
          </div>
        </div>
      )}
    </div>
  )
}
