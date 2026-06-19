import { NextRequest, NextResponse } from "next/server"
import { stripe, STRIPE_CONFIG } from "@/lib/stripe"
import Stripe from "stripe"
import { BillingInterval, PlanType, SubscriptionStatus } from "@/lib/types/enums"
import {
  getPlanByStripePriceId,
  updateCompanySubscription,
  getCompanySubscription,
} from "@/lib/firebase/services/subscription-service"

const mapStripeStatus = (stripeStatus: string): SubscriptionStatus => {
  switch (stripeStatus) {
    case "active":
      return SubscriptionStatus.active
    case "canceled":
      return SubscriptionStatus.canceled
    case "past_due":
      return SubscriptionStatus.past_due
    case "trialing":
      return SubscriptionStatus.trialing
    case "incomplete":
      return SubscriptionStatus.incomplete
    case "incomplete_expired":
      return SubscriptionStatus.incomplete_expired
    case "unpaid":
      return SubscriptionStatus.unpaid
    default:
      return SubscriptionStatus.active
  }
}

const getBillingIntervalFromPriceId = (priceId: string, plan: Awaited<ReturnType<typeof getPlanByStripePriceId>>) => {
  if (plan?.stripePriceIdYearly === priceId) {
    return BillingInterval.yearly
  }
  return BillingInterval.monthly
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_CONFIG.webhookSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode !== "subscription" || !session.subscription) {
          break
        }

        const companyId = session.metadata?.companyId
        if (!companyId) {
          console.error("No companyId in checkout session metadata")
          break
        }

        const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
        const priceId = subscription.items.data[0]?.price.id
        if (!priceId) {
          break
        }

        const plan = await getPlanByStripePriceId(priceId)
        if (!plan) {
          console.error(`No plan found for price ID: ${priceId}`)
          break
        }

        const item = subscription.items.data[0]
        const currentPeriodStart = item?.current_period_start
          ? new Date(item.current_period_start * 1000)
          : undefined
        const currentPeriodEnd = item?.current_period_end ? new Date(item.current_period_end * 1000) : undefined

        const existing = await getCompanySubscription(companyId)
        if (existing?.plan?.planType === PlanType.FREE && plan.planType !== PlanType.FREE) {
          await updateCompanySubscription({
            companyId,
            status: SubscriptionStatus.canceled,
          })
        }

        await updateCompanySubscription({
          companyId,
          planId: plan.id,
          status: SubscriptionStatus.active,
          billingInterval: getBillingIntervalFromPriceId(priceId, plan),
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscription.id,
          currentPeriodStart,
          currentPeriodEnd,
          cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
        })
        break
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const priceId = subscription.items.data[0]?.price.id
        const plan = priceId ? await getPlanByStripePriceId(priceId) : null
        const item = subscription.items.data[0]

        const { updateSubscriptionStatusByStripeId } = await import("@/lib/firebase/services/subscription-service")
        await updateSubscriptionStatusByStripeId(subscription.id, mapStripeStatus(subscription.status), {
          planId: plan?.id,
          billingInterval: priceId && plan ? getBillingIntervalFromPriceId(priceId, plan) : undefined,
          currentPeriodStart: item?.current_period_start
            ? new Date(item.current_period_start * 1000)
            : undefined,
          currentPeriodEnd: item?.current_period_end ? new Date(item.current_period_end * 1000) : undefined,
          cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
        })
        break
      }

      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Stripe webhook handler error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
