"use server"

import {
  createCheckoutSession as createStripeCheckoutSession,
  createPortalSession as createStripePortalSession,
} from "@/lib/stripe-service"
import { getCustomerSubscription, updateCustomerSubscription } from "@/lib/customer-subscription"
import { getCurrentCompanyId } from "@/lib/firebase/get-current-company-id"
import { getActivePlans, getPlanByType } from "@/lib/firebase/services/subscription-service"
import { getAiUsageSnapshot } from "@/lib/firebase/services/ai-usage-service"
import { PlanType, SubscriptionStatus } from "@/lib/types/enums"
import { getServerAuthSession } from "@/lib/auth/server-session"

export const createCheckoutSession = async (planId: PlanType, billingCycle: "monthly" | "yearly") => {
  try {
    const result = await createStripeCheckoutSession({ planId, billingCycle })
    if (!result.success || !result.url) {
      throw new Error(result.error || "Failed to create checkout session")
    }
    return { success: true, checkoutUrl: result.url }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return { success: false, error: error instanceof Error ? error.message : "Internal server error" }
  }
}

export const createPortalSession = async () => {
  try {
    const result = await createStripePortalSession()
    if (!result.success || !result.url) {
      return { success: false, error: result.error || "Failed to create portal session" }
    }
    return { success: true, url: result.url }
  } catch (error) {
    console.error("Error creating portal session:", error)
    return { success: false, error: error instanceof Error ? error.message : "Internal server error" }
  }
}

export const getSubscriptionStatus = async () => {
  const session = await getServerAuthSession()
  if (!session?.email) {
    return null
  }
  return {
    plan: "professional",
    status: "active",
    billingCycle: "monthly",
    nextBilling: "2024-02-15",
    cancelAtPeriodEnd: false,
  }
}

export const getSubscriptionData = async () => {
  try {
    const companyId = await getCurrentCompanyId()
    if (!companyId) {
      return { success: false, error: "No company found for current user", data: null }
    }

    const subscriptionResult = await getCustomerSubscription({ companyId })
    if (!subscriptionResult.success || !subscriptionResult.data) {
      return { success: false, error: subscriptionResult.error || "No subscription found", data: null }
    }

    const aiUsage = await getAiUsageSnapshot(companyId)

    return {
      success: true,
      data: {
        subscription: subscriptionResult.data,
        usage: {
          usage: [aiUsage],
        },
      },
    }
  } catch (error) {
    console.error("Error getting subscription data:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      data: null,
    }
  }
}

export const checkExportPermission = async () => {
  try {
    const companyId = await getCurrentCompanyId()
    if (!companyId) {
      return { success: false, canExport: false, error: "No company found for current user" }
    }

    const subscriptionResult = await getCustomerSubscription({ companyId })
    if (!subscriptionResult.success || !subscriptionResult.data) {
      return { success: false, canExport: false, error: subscriptionResult.error || "No subscription found" }
    }

    return {
      success: true,
      canExport: subscriptionResult.data.plan?.allowExport || false,
      planType: subscriptionResult.data.plan?.planType || PlanType.FREE,
    }
  } catch (error) {
    console.error("Error checking export permission:", error)
    return { success: false, canExport: false, error: error instanceof Error ? error.message : "Unknown error occurred" }
  }
}

export const handleCanceledCheckout = async () => {
  try {
    const companyId = await getCurrentCompanyId()
    if (!companyId) {
      return { success: false, error: "No company found for current user", converted: false }
    }

    const subscriptionResult = await getCustomerSubscription({ companyId })
    if (!subscriptionResult.success || !subscriptionResult.data) {
      return { success: false, error: subscriptionResult.error || "No subscription found", converted: false }
    }

    if (subscriptionResult.data.status !== SubscriptionStatus.pending) {
      return { success: true, converted: false, message: "Subscription is not pending" }
    }

    const freePlan = await getPlanByType(PlanType.FREE)
    if (!freePlan) {
      return { success: false, error: "Free plan not found", converted: false }
    }

    const updateResult = await updateCustomerSubscription({
      companyId,
      planId: freePlan.id,
      status: SubscriptionStatus.active,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      cancelAtPeriodEnd: false,
    })

    if (!updateResult.success) {
      return { success: false, error: updateResult.error || "Failed to update subscription", converted: false }
    }

    return { success: true, converted: true, message: "Subscription converted to FREE plan" }
  } catch (error) {
    console.error("Error handling canceled checkout:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      converted: false,
    }
  }
}

export const getAvailablePlans = async () => {
  try {
    const plans = await getActivePlans()
    return { success: true, plans }
  } catch (error) {
    console.error("Error fetching available plans:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch plans",
      plans: [],
    }
  }
}
