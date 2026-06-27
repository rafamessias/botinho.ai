"use server"

import { z } from "zod"
import type { Customer, CustomerStatus } from "@/lib/types/customer"
import { BaseActionResponse, handleAction, resolveCompanyContext } from "./utils"
import {
  bulkCreateInboxCustomers,
  createInboxCustomer,
  listInboxCustomers,
  sanitizeTags,
  updateInboxCustomer,
  type InboxCustomerRecord,
} from "@/lib/firebase/services/inbox-service"

const customerStatusSchema = z.enum(["active", "inactive", "prospect"])

const mapCustomerRecord = (record: InboxCustomerRecord): Customer => ({
  id: record.id,
  name: record.name,
  phone: record.phone,
  email: record.email ?? undefined,
  company: record.company ?? undefined,
  description: record.notes ?? undefined,
  tags: record.tags,
  status: record.status as CustomerStatus,
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
})

const customerInputSchema = z.object({
  name: z.string().trim().min(1),
  phone: z.string().trim().min(1),
  email: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined))
    .pipe(z.string().email().optional()),
  company: z.string().trim().optional(),
  description: z.string().trim().max(1000).optional(),
  tags: z.array(z.string()).max(20).optional(),
  status: customerStatusSchema.default("active"),
})

const listCustomersSchema = z.object({
  companyId: z.string().optional(),
  search: z.string().optional(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().min(1).max(200).optional(),
  orderBy: z.enum(["name", "createdAt"]).optional(),
})

export const listCustomersAction = async (
  input?: z.infer<typeof listCustomersSchema>,
): Promise<
  BaseActionResponse<{
    customers: Customer[]
    pagination: Awaited<ReturnType<typeof listInboxCustomers>>["pagination"]
  }>
> =>
  handleAction(async () => {
    const payload = listCustomersSchema.parse(input ?? {})
    const { companyId } = await resolveCompanyContext({ companyId: payload.companyId })
    const result = await listInboxCustomers({
      companyId,
      search: payload.search,
      page: payload.page,
      pageSize: payload.pageSize ?? 200,
      orderBy: payload.orderBy,
    })

    return {
      success: true,
      data: {
        customers: result.customers.map(mapCustomerRecord),
        pagination: result.pagination,
      },
    }
  })

export const createCustomerAction = async (
  input: z.infer<typeof customerInputSchema>,
): Promise<BaseActionResponse<{ customer: Customer }>> =>
  handleAction(async () => {
    const payload = customerInputSchema.parse(input)
    const { companyId } = await resolveCompanyContext({ requireCanPost: true })

    const customer = await createInboxCustomer({
      companyId,
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      company: payload.company,
      notes: payload.description,
      tags: payload.tags ? sanitizeTags(payload.tags) : [],
      status: payload.status,
    })

    return {
      success: true,
      data: { customer: mapCustomerRecord(customer) },
    }
  })

const updateCustomerSchema = customerInputSchema.extend({
  customerId: z.string().min(1),
})

export const updateCustomerAction = async (
  input: z.infer<typeof updateCustomerSchema>,
): Promise<BaseActionResponse<{ customer: Customer }>> =>
  handleAction(async () => {
    const payload = updateCustomerSchema.parse(input)
    const { companyId } = await resolveCompanyContext({ requireCanPost: true })

    const customer = await updateInboxCustomer({
      companyId,
      customerId: payload.customerId,
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      company: payload.company,
      notes: payload.description,
      tags: payload.tags ? sanitizeTags(payload.tags) : [],
      status: payload.status,
    })

    return {
      success: true,
      data: { customer: mapCustomerRecord(customer) },
    }
  })

const bulkImportCustomersSchema = z.object({
  customers: z.array(customerInputSchema).min(1).max(500),
})

export const bulkImportCustomersAction = async (
  input: z.infer<typeof bulkImportCustomersSchema>,
): Promise<
  BaseActionResponse<{
    customers: Customer[]
    errors: string[]
  }>
> =>
  handleAction(async () => {
    const payload = bulkImportCustomersSchema.parse(input)
    const { companyId } = await resolveCompanyContext({ requireCanPost: true })

    const result = await bulkCreateInboxCustomers({
      companyId,
      customers: payload.customers,
    })

    return {
      success: true,
      data: {
        customers: result.created.map(mapCustomerRecord),
        errors: result.errors,
      },
    }
  })
