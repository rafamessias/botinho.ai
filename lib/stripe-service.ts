import { stripe } from "@/lib/stripe"
import { getServerAuthSession } from "@/lib/auth/server-session"
import {
  getPlanByType,
  getCompanySubscription,
  getStripePriceIdForPlan,
} from "@/lib/firebase/services/subscription-service"
import { localeToCurrency, type PlanCurrency } from "@/lib/plan-catalog"
import { PlanType, SubscriptionStatus } from "@/lib/types/enums"

export interface CreateCheckoutSessionParams {
  planId: PlanType
  billingCycle: "monthly" | "yearly"
  currency?: PlanCurrency
  userEmail?: string
  companyId?: string
  customerSubscriptionId?: string
  successUrl?: string
  cancelUrl?: string
}

export interface CreateCheckoutSessionResult {
  success: boolean
  sessionId?: string
  url?: string
  error?: string
}

export interface CreatePortalSessionResult {
  success: boolean
  url?: string
  error?: string
}

export const createCheckoutSession = async (
  params: CreateCheckoutSessionParams,
): Promise<CreateCheckoutSessionResult> => {
  try {
    const { planId, billingCycle, currency: currencyParam, userEmail, companyId, customerSubscriptionId, successUrl, cancelUrl } = params

    let email = userEmail
    let userCompanyId = companyId

    if (!email || !userCompanyId) {
      const session = await getServerAuthSession()
      email = email || session?.email

      if (!userCompanyId && session?.uid) {
        const { getUserProfile } = await import("@/lib/firebase/services/user-service")
        const profile = await getUserProfile(session.uid)
        userCompanyId = profile?.defaultCompanyId
      }
    }

    if (!email) {
      return { success: false, error: "Unauthorized" }
    }

    if (!userCompanyId) {
      return { success: false, error: "No company found for user" }
    }

    const subscriptionPlan = await getPlanByType(planId)
    if (!subscriptionPlan) {
      return { success: false, error: "Invalid plan or billing cycle" }
    }

    const currency = currencyParam ?? localeToCurrency("en")
    let resolvedPriceId = getStripePriceIdForPlan(subscriptionPlan, billingCycle, currency)
    if (!resolvedPriceId) {
      resolvedPriceId = getStripePriceIdForPlan(
        subscriptionPlan,
        billingCycle,
        currency === "usd" ? "brl" : "usd",
      )
    }
    if (!resolvedPriceId) {
      return { success: false, error: "Invalid plan or billing cycle" }
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [{ price: resolvedPriceId, quantity: 1 }],
      mode: "subscription",
      success_url: successUrl ?? `${baseUrl}/subscription?success=true`,
      cancel_url: cancelUrl ?? `${baseUrl}/subscription?canceled=true`,
      metadata: {
        userEmail: email,
        companyId: userCompanyId,
        planId,
        billingInterval: billingCycle,
        ...(customerSubscriptionId && { customerSubscriptionId }),
      },
    })

    return {
      success: true,
      sessionId: checkoutSession.id,
      url: checkoutSession.url || undefined,
    }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    }
  }
}

export const createPortalSession = async (): Promise<CreatePortalSessionResult> => {
  try {
    const session = await getServerAuthSession()
    if (!session?.uid) {
      return { success: false, error: "Unauthorized" }
    }

    const { getUserProfile } = await import("@/lib/firebase/services/user-service")
    const profile = await getUserProfile(session.uid)
    const companyId = profile?.defaultCompanyId
    if (!companyId) {
      return { success: false, error: "No default company found for user" }
    }

    const subscription = await getCompanySubscription(companyId)
    if (
      !subscription?.stripeCustomerId ||
      ![SubscriptionStatus.active, SubscriptionStatus.trialing].includes(subscription.status)
    ) {
      return { success: false, error: "No Stripe customer found" }
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription`,
    })

    return { success: true, url: portalSession.url }
  } catch (error) {
    console.error("Error creating portal session:", error)
    if (error instanceof Error && error.message.includes("No configuration provided")) {
      return {
        success: false,
        error:
          "Customer portal is not configured. Please contact support or set up your billing portal configuration in the Stripe dashboard.",
      }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    }
  }
}
