"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { type UseFormReturn } from "react-hook-form"
import { useTranslations } from "next-intl"
import { Loader2, Search, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { listInboxCustomersAction } from "@/components/server-actions/inbox"
import {
  ticketPriorities,
  ticketStatuses,
  ticketTypes,
  type TicketFormValues,
} from "@/components/tickets/ticket-form-schema"

const RECENT_CUSTOMERS_LIMIT = 5
const SEARCH_CUSTOMERS_LIMIT = 20
const SEARCH_DEBOUNCE_MS = 300

type InboxCustomer = {
  id: string
  name: string
  phone: string | null
  email: string | null
}

type TicketDetailsFormProps = {
  form: UseFormReturn<TicketFormValues>
  ticketId?: string
  ticketCustomerName?: string
  isSubmitting?: boolean
  showStatus?: boolean
  isActive?: boolean
  compact?: boolean
}

export const TicketDetailsForm = ({
  form,
  ticketId,
  ticketCustomerName,
  isSubmitting = false,
  showStatus = false,
  isActive = true,
  compact = false,
}: TicketDetailsFormProps) => {
  const t = useTranslations("Tickets")
  const [customers, setCustomers] = useState<InboxCustomer[]>([])
  const [customerSearch, setCustomerSearch] = useState("")
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false)
  const committedCustomerSearchRef = useRef("")

  const selectedCustomerId = form.watch("customerId")
  const selectedCustomerName = form.watch("customerName")
  const trimmedCustomerSearch = customerSearch.trim()
  const hasEditedCustomerSearch =
    trimmedCustomerSearch.length > 0 &&
    trimmedCustomerSearch !== committedCustomerSearchRef.current
  const showCustomerResults = !selectedCustomerId && hasEditedCustomerSearch

  useEffect(() => {
    if (!ticketId) return
    const customerName = ticketCustomerName ?? form.getValues("customerName") ?? ""
    setCustomerSearch(customerName)
    committedCustomerSearchRef.current = customerName.trim()
    setCustomers([])
  }, [form, ticketId, ticketCustomerName])

  const loadCustomers = useCallback(
    async (searchValue: string) => {
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
        console.error("Failed to load customers for ticket", error)
        setCustomers([])
        toast.error(t("form.errors.loadCustomers"))
      } finally {
        setIsLoadingCustomers(false)
      }
    },
    [t],
  )

  useEffect(() => {
    if (!isActive) return

    if (!trimmedCustomerSearch) {
      setCustomers([])
      return
    }

    const timeout = setTimeout(() => {
      void loadCustomers(customerSearch)
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timeout)
  }, [customerSearch, isActive, loadCustomers, trimmedCustomerSearch])

  const handleClearCustomer = useCallback(
    (markDirty = true) => {
      form.setValue("customerId", undefined, { shouldDirty: markDirty })
      form.setValue("customerName", undefined, { shouldDirty: markDirty })
      setCustomerSearch("")
      committedCustomerSearchRef.current = ""
      setCustomers([])
    },
    [form],
  )

  const handleCustomerSearchChange = (value: string) => {
    setCustomerSearch(value)

    if (!value.trim()) {
      handleClearCustomer(true)
      return
    }

    if (selectedCustomerId && value.trim() !== selectedCustomerName?.trim()) {
      form.setValue("customerId", undefined, { shouldDirty: true })
      form.setValue("customerName", undefined, { shouldDirty: true })
    }
  }

  const handleSelectCustomer = (customer: InboxCustomer) => {
    form.setValue("customerId", customer.id, { shouldDirty: true })
    form.setValue("customerName", customer.name, { shouldDirty: true })
    setCustomerSearch(customer.name)
    committedCustomerSearchRef.current = customer.name.trim()
    setCustomers([])
  }

  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem className="min-w-0">
            <FormLabel>{t("form.fields.title.label")}</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder={t("form.fields.title.placeholder")}
                disabled={isSubmitting}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="min-w-0">
            <FormLabel>{t("form.fields.description.label")}</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                rows={compact ? 3 : 4}
                placeholder={t("form.fields.description.placeholder")}
                disabled={isSubmitting}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className={compact ? "grid min-w-0 gap-4" : "grid min-w-0 gap-4 sm:grid-cols-2"}>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="min-w-0">
              <FormLabel>{t("form.fields.type.label")}</FormLabel>
              <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                <FormControl>
                  <SelectTrigger className="w-full max-w-full">
                    <SelectValue placeholder={t("form.fields.type.placeholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent position="popper" className="max-w-[var(--radix-select-trigger-width)]">
                  {ticketTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {t(`table.badges.type.${type}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem className="min-w-0">
              <FormLabel>{t("form.fields.priority.label")}</FormLabel>
              <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                <FormControl>
                  <SelectTrigger className="w-full max-w-full">
                    <SelectValue placeholder={t("form.fields.priority.placeholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent position="popper" className="max-w-[var(--radix-select-trigger-width)]">
                  {ticketPriorities.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {t(`table.badges.priority.${priority}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {showStatus && (
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="min-w-0">
              <FormLabel>{t("form.fields.status.label")}</FormLabel>
              <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                <FormControl>
                  <SelectTrigger className="w-full max-w-full">
                    <SelectValue placeholder={t("form.fields.status.placeholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent position="popper" className="max-w-[var(--radix-select-trigger-width)]">
                  {ticketStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {t(`table.badges.status.${status}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="orderReference"
        render={({ field }) => (
          <FormItem className="min-w-0">
            <FormLabel>{t("form.fields.orderReference.label")}</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder={t("form.fields.orderReference.placeholder")}
                disabled={isSubmitting}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="relative space-y-2">
        <FormLabel>{t("form.fields.customer.label")}</FormLabel>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={customerSearch}
            onChange={(event) => handleCustomerSearchChange(event.target.value)}
            placeholder={t("form.fields.customer.placeholder")}
            className="pl-9 pr-10"
            disabled={isSubmitting}
            aria-label={t("form.fields.customer.placeholder")}
          />
          {customerSearch && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 size-7 -translate-y-1/2 text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => handleClearCustomer(true)}
              disabled={isSubmitting}
              aria-label={t("form.fields.customer.clear")}
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          )}
        </div>

        {showCustomerResults && (
          <div className="absolute top-full z-20 mt-1 max-h-40 w-full overflow-y-auto rounded-md border bg-popover shadow-md">
            {isLoadingCustomers ? (
              <div className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                {t("form.fields.customer.loading")}
              </div>
            ) : customers.length === 0 ? (
              <div className="px-3 py-3 text-sm text-muted-foreground">
                {t("form.fields.customer.empty")}
              </div>
            ) : (
              customers.map((customer) => (
                <button
                  key={customer.id}
                  type="button"
                  className="flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-muted"
                  onClick={() => handleSelectCustomer(customer)}
                >
                  <span className="font-medium">{customer.name}</span>
                  {customer.phone && (
                    <span className="text-xs text-muted-foreground">{customer.phone}</span>
                  )}
                  {customer.email && (
                    <span className="text-xs text-muted-foreground">{customer.email}</span>
                  )}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </>
  )
}