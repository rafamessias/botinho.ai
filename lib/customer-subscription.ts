import { z } from "zod"
import {
  createCompanySubscription,
  createFreeSubscriptionForCompany,
  getCompanySubscription,
  updateCompanySubscription,
  updateSubscriptionStatusByStripeId,
} from "@/lib/firebase/services/subscription-service"
import { BillingInterval, SubscriptionStatus } from "@/lib/types/enums"

const createCustomerSubscriptionSchema = z.object({
  companyId: z.string().min(1),
  planId: z.string().min(1),
  status: z.nativeEnum(SubscriptionStatus).optional(),
  stripeCustomerId: z.string().optional(),
  stripeSubscriptionId: z.string().optional(),
  currentPeriodStart: z.date().optional(),
  currentPeriodEnd: z.date().optional(),
  cancelAtPeriodEnd: z.boolean().default(false),
  trialStart: z.date().optional(),
  trialEnd: z.date().optional(),
  billingInterval: z.nativeEnum(BillingInterval).optional(),
})

const updateCustomerSubscriptionSchema = z.object({
  id: z.string().optional(),
  companyId: z.string().optional(),
  planId: z.string().optional(),
  status: z.nativeEnum(SubscriptionStatus).optional(),
  stripeCustomerId: z.string().optional().nullable(),
  stripeSubscriptionId: z.string().optional().nullable(),
  currentPeriodStart: z.date().optional().nullable(),
  currentPeriodEnd: z.date().optional().nullable(),
  cancelAtPeriodEnd: z.boolean().optional(),
  trialStart: z.date().optional().nullable(),
  trialEnd: z.date().optional().nullable(),
  billingInterval: z.nativeEnum(BillingInterval).optional(),
})

const getCustomerSubscriptionSchema = z.object({
  companyId: z.string().min(1),
})

export type CreateCustomerSubscriptionInput = z.infer<typeof createCustomerSubscriptionSchema>
export type UpdateCustomerSubscriptionInput = z.infer<typeof updateCustomerSubscriptionSchema>
export type GetCustomerSubscriptionInput = z.infer<typeof getCustomerSubscriptionSchema>

export interface CustomerSubscriptionResult {
  success: boolean
  message?: string
  data?: Awaited<ReturnType<typeof getCompanySubscription>>
  error?: string
}

export const createCustomerSubscription = async (
  data: CreateCustomerSubscriptionInput,
): Promise<CustomerSubscriptionResult> => {
  try {
    const validated = createCustomerSubscriptionSchema.parse(data)
    const result = await createCompanySubscription({
      companyId: validated.companyId,
      planId: validated.planId,
      status: validated.status,
      billingInterval: validated.billingInterval,
      stripeCustomerId: validated.stripeCustomerId,
      stripeSubscriptionId: validated.stripeSubscriptionId,
      currentPeriodStart: validated.currentPeriodStart,
      currentPeriodEnd: validated.currentPeriodEnd,
      cancelAtPeriodEnd: validated.cancelAtPeriodEnd,
      trialStart: validated.trialStart,
      trialEnd: validated.trialEnd,
    })
    return result.success
      ? { success: true, data: result.data ?? undefined, message: "Subscription created" }
      : { success: false, error: result.error }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create subscription",
    }
  }
}

export const updateCustomerSubscription = async (
  data: UpdateCustomerSubscriptionInput,
): Promise<CustomerSubscriptionResult> => {
  try {
    const validated = updateCustomerSubscriptionSchema.parse(data)
    const companyId = validated.companyId
    if (!companyId) {
      return { success: false, error: "companyId is required" }
    }

    const result = await updateCompanySubscription({
      companyId,
      planId: validated.planId,
      status: validated.status,
      billingInterval: validated.billingInterval,
      stripeCustomerId: validated.stripeCustomerId,
      stripeSubscriptionId: validated.stripeSubscriptionId,
      currentPeriodStart: validated.currentPeriodStart ?? undefined,
      currentPeriodEnd: validated.currentPeriodEnd ?? undefined,
      cancelAtPeriodEnd: validated.cancelAtPeriodEnd,
      trialStart: validated.trialStart ?? undefined,
      trialEnd: validated.trialEnd ?? undefined,
    })

    return result.success
      ? { success: true, data: result.data ?? undefined, message: "Subscription updated" }
      : { success: false, error: result.error }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update subscription",
    }
  }
}

export const getCustomerSubscription = async (
  data: GetCustomerSubscriptionInput,
): Promise<CustomerSubscriptionResult> => {
  try {
    const validated = getCustomerSubscriptionSchema.parse(data)
    const subscription = await getCompanySubscription(validated.companyId)
    if (!subscription) {
      const created = await createFreeSubscriptionForCompany(validated.companyId)
      if (created.success) {
        return { success: true, data: created.data ?? undefined }
      }
      return { success: false, error: "No subscription found" }
    }
    return { success: true, data: subscription }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get subscription",
    }
  }
}

export const updateSubscriptionStatus = async (
  stripeSubscriptionId: string,
  status: SubscriptionStatus,
  extra?: Parameters<typeof updateSubscriptionStatusByStripeId>[2],
): Promise<CustomerSubscriptionResult> => {
  const result = await updateSubscriptionStatusByStripeId(stripeSubscriptionId, status, extra)
  return result.success
    ? { success: true, data: result.data ?? undefined }
    : { success: false, error: result.error }
}

export const deleteCustomerSubscription = async () => ({
  success: false,
  error: "Delete subscription is not supported",
})

export const cancelCustomerSubscription = deleteCustomerSubscription
export const reactivateCustomerSubscription = deleteCustomerSubscription
export const getAllCustomerSubscriptions = async () => ({ success: true, data: [] })
