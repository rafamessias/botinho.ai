import { FieldValue, Timestamp } from "firebase-admin/firestore"
import { adminDb } from "@/lib/firebase/admin"
import { collections, companySubcollections, subscriptionDocIds } from "@/lib/firebase/collections"
import {
  currencyToIso,
  getCatalogEntryByPlanType,
  getLimitsForPlanType,
  type PlanCurrency,
} from "@/lib/plan-catalog"
import { getAiLimitForPlan, getSyncedNumbersLimitForPlan } from "@/lib/plan-limits"
import { BillingInterval, PlanType, SubscriptionStatus } from "@/lib/types/enums"

export type FirestoreSubscriptionPlan = {
  id: string
  planType: PlanType
  stripeProductId?: string | null
  stripePriceIdMonthly?: string | null
  stripePriceIdYearly?: string | null
  stripePriceIdMonthlyUsd?: string | null
  stripePriceIdYearlyUsd?: string | null
  priceMonthly: number
  priceYearly: number
  priceMonthlyUsd: number
  priceYearlyUsd: number
  currency: string
  isActive: boolean
  /** @deprecated use maxAiCredits */
  maxAiResponses: number
  maxAiCredits: number
  maxSyncedNumbers: number
  allowExport?: boolean
  allowApiAccess?: boolean
  removeBranding?: boolean
}

export type FirestoreCustomerSubscription = {
  id: string
  companyId: string
  planId: string
  status: SubscriptionStatus
  billingInterval: BillingInterval
  stripeCustomerId?: string | null
  stripeSubscriptionId?: string | null
  cancellationDetails?: string | null
  currentPeriodStart?: Timestamp | null
  currentPeriodEnd?: Timestamp | null
  cancelAtPeriodEnd: boolean
  trialStart?: Timestamp | null
  trialEnd?: Timestamp | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

const stripeEnvForPlan = (planType: PlanType) => {
  const prefix = planType === PlanType.STARTER ? "STARTER" : planType === PlanType.PRO ? "PRO" : "BUSINESS"
  return {
    product: process.env[`STRIPE_PRODUCT_${prefix}`] ?? null,
    monthly: process.env[`STRIPE_PRICE_${prefix}_MONTHLY`] ?? null,
    yearly: process.env[`STRIPE_PRICE_${prefix}_YEARLY`] ?? null,
    monthlyUsd: process.env[`STRIPE_PRICE_${prefix}_MONTHLY_USD`] ?? null,
    yearlyUsd: process.env[`STRIPE_PRICE_${prefix}_YEARLY_USD`] ?? null,
  }
}

const buildPlanDefinition = (key: "free" | "starter" | "pro" | "business"): Omit<FirestoreSubscriptionPlan, "id"> & { id: string } => {
  const entry = getCatalogEntryByPlanType(
    key === "free"
      ? PlanType.FREE
      : key === "starter"
        ? PlanType.STARTER
        : key === "pro"
          ? PlanType.PRO
          : PlanType.BUSINESS,
  )!
  const limits = getLimitsForPlanType(entry.planType)
  const stripe = key === "free" ? null : stripeEnvForPlan(entry.planType)

  return {
    id: key,
    planType: entry.planType,
    priceMonthly: entry.prices.brl.monthly,
    priceYearly: entry.prices.brl.yearly,
    priceMonthlyUsd: entry.prices.usd.monthly,
    priceYearlyUsd: entry.prices.usd.yearly,
    currency: currencyToIso("brl"),
    isActive: true,
    maxAiResponses: limits.maxAiCredits,
    maxAiCredits: limits.maxAiCredits,
    maxSyncedNumbers: limits.maxSyncedNumbers,
    allowExport: entry.flags.allowExport,
    allowApiAccess: entry.flags.allowApiAccess,
    removeBranding: entry.flags.removeBranding,
    stripeProductId: stripe?.product ?? null,
    stripePriceIdMonthly: key === "free" ? process.env.STRIPE_PRICE_FREE_MONTHLY ?? null : stripe?.monthly ?? null,
    stripePriceIdYearly: key === "free" ? process.env.STRIPE_PRICE_FREE_YEARLY ?? null : stripe?.yearly ?? null,
    stripePriceIdMonthlyUsd: key === "free" ? process.env.STRIPE_PRICE_FREE_MONTHLY_USD ?? null : stripe?.monthlyUsd ?? null,
    stripePriceIdYearlyUsd: key === "free" ? process.env.STRIPE_PRICE_FREE_YEARLY_USD ?? null : stripe?.yearlyUsd ?? null,
  }
}

const PLAN_DEFINITIONS: Array<Omit<FirestoreSubscriptionPlan, "id"> & { id: string }> = [
  buildPlanDefinition("free"),
  buildPlanDefinition("starter"),
  buildPlanDefinition("pro"),
  buildPlanDefinition("business"),
]

const subscriptionRef = (companyId: string) =>
  adminDb
    .collection(collections.companies)
    .doc(companyId)
    .collection(companySubcollections.subscription)
    .doc(subscriptionDocIds.current)

const enrichPlan = (plan: FirestoreSubscriptionPlan): FirestoreSubscriptionPlan => {
  const limits = getLimitsForPlanType(plan.planType)
  const maxAiCredits = plan.maxAiCredits ?? plan.maxAiResponses ?? getAiLimitForPlan(plan.planType)
  return {
    ...plan,
    maxAiCredits,
    maxAiResponses: maxAiCredits,
    maxSyncedNumbers: plan.maxSyncedNumbers ?? limits.maxSyncedNumbers ?? getSyncedNumbersLimitForPlan(plan.planType),
    priceMonthlyUsd: plan.priceMonthlyUsd ?? getCatalogEntryByPlanType(plan.planType)?.prices.usd.monthly ?? plan.priceMonthly,
    priceYearlyUsd: plan.priceYearlyUsd ?? getCatalogEntryByPlanType(plan.planType)?.prices.usd.yearly ?? plan.priceYearly,
  }
}

const serializeTimestamp = (value?: Timestamp | null) => (value ? value.toDate() : null)

const attachPlan = async (subscription: FirestoreCustomerSubscription) => {
  const plan = await getPlanById(subscription.planId)
  return {
    ...subscription,
    currentPeriodStart: serializeTimestamp(subscription.currentPeriodStart),
    currentPeriodEnd: serializeTimestamp(subscription.currentPeriodEnd),
    trialStart: serializeTimestamp(subscription.trialStart),
    trialEnd: serializeTimestamp(subscription.trialEnd),
    createdAt: subscription.createdAt.toDate(),
    updatedAt: subscription.updatedAt.toDate(),
    plan,
  }
}

export const ensurePlansSeeded = async () => {
  const batch = adminDb.batch()
  for (const plan of PLAN_DEFINITIONS) {
    const ref = adminDb.collection(collections.plans).doc(plan.id)
    batch.set(ref, { ...plan, updatedAt: FieldValue.serverTimestamp() }, { merge: true })
  }
  await batch.commit()
}

export const getPlanById = async (planId: string): Promise<FirestoreSubscriptionPlan | null> => {
  const snap = await adminDb.collection(collections.plans).doc(planId).get()
  if (snap.exists) {
    const data = snap.data() as Omit<FirestoreSubscriptionPlan, "id">
    return enrichPlan({ id: snap.id, ...data })
  }
  const fallback = PLAN_DEFINITIONS.find((plan) => plan.id === planId)
  return fallback ? enrichPlan({ ...fallback }) : null
}

export const getPlanByType = async (planType: PlanType): Promise<FirestoreSubscriptionPlan | null> => {
  const snap = await adminDb
    .collection(collections.plans)
    .where("planType", "==", planType)
    .where("isActive", "==", true)
    .limit(1)
    .get()

  if (!snap.empty) {
    const doc = snap.docs[0]!
    return enrichPlan({ id: doc.id, ...(doc.data() as Omit<FirestoreSubscriptionPlan, "id">) })
  }

  const fallback = PLAN_DEFINITIONS.find((plan) => plan.planType === planType && plan.isActive)
  return fallback ? enrichPlan({ ...fallback }) : null
}

export const getStripePriceIdForPlan = (
  plan: FirestoreSubscriptionPlan,
  billingInterval: BillingInterval | "monthly" | "yearly",
  currency: PlanCurrency = "brl",
): string | null => {
  const isYearly =
    billingInterval === BillingInterval.yearly || String(billingInterval) === "yearly"
  if (currency === "usd") {
    return isYearly ? plan.stripePriceIdYearlyUsd ?? null : plan.stripePriceIdMonthlyUsd ?? null
  }
  return isYearly ? plan.stripePriceIdYearly ?? null : plan.stripePriceIdMonthly ?? null
}

export const getPlanByStripePriceId = async (priceId: string): Promise<FirestoreSubscriptionPlan | null> => {
  for (const plan of PLAN_DEFINITIONS) {
    if (
      plan.stripePriceIdMonthly === priceId ||
      plan.stripePriceIdYearly === priceId ||
      plan.stripePriceIdMonthlyUsd === priceId ||
      plan.stripePriceIdYearlyUsd === priceId
    ) {
      return enrichPlan(plan)
    }
  }

  const snap = await adminDb
    .collection(collections.plans)
    .where("isActive", "==", true)
    .get()

  for (const doc of snap.docs) {
    const data = doc.data() as Omit<FirestoreSubscriptionPlan, "id">
    if (
      data.stripePriceIdMonthly === priceId ||
      data.stripePriceIdYearly === priceId ||
      data.stripePriceIdMonthlyUsd === priceId ||
      data.stripePriceIdYearlyUsd === priceId
    ) {
      return enrichPlan({ id: doc.id, ...data })
    }
  }

  return null
}

export const getActivePlans = async () => {
  await ensurePlansSeeded()
  const snap = await adminDb
    .collection(collections.plans)
    .where("isActive", "==", true)
    .get()

  const plans = snap.docs
    .map((doc) => enrichPlan({ id: doc.id, ...(doc.data() as Omit<FirestoreSubscriptionPlan, "id">) }))
    .filter((plan) => plan.planType !== PlanType.FREE && plan.planType !== PlanType.ENTERPRISE)

  if (plans.length === 0) {
    return PLAN_DEFINITIONS.filter(
      (plan) => plan.isActive && plan.planType !== PlanType.FREE && plan.planType !== PlanType.ENTERPRISE,
    ).map((plan) => enrichPlan({ ...plan }))
  }

  return plans.sort((a, b) => a.priceMonthly - b.priceMonthly)
}

export const getCompanySubscription = async (companyId: string) => {
  const snap = await subscriptionRef(companyId).get()
  if (!snap.exists) {
    return null
  }

  const data = snap.data() as Omit<FirestoreCustomerSubscription, "id">
  return attachPlan({ id: snap.id, ...data })
}

export const createCompanySubscription = async (params: {
  companyId: string
  planId: string
  status?: SubscriptionStatus
  billingInterval?: BillingInterval
  stripeCustomerId?: string | null
  stripeSubscriptionId?: string | null
  currentPeriodStart?: Date | null
  currentPeriodEnd?: Date | null
  cancelAtPeriodEnd?: boolean
  trialStart?: Date | null
  trialEnd?: Date | null
}) => {
  const plan = await getPlanById(params.planId)
  if (!plan) {
    return { success: false as const, error: "Subscription plan not found or inactive" }
  }

  const existing = await subscriptionRef(params.companyId).get()
  if (existing.exists) {
    const current = existing.data() as FirestoreCustomerSubscription
    if ([SubscriptionStatus.active, SubscriptionStatus.trialing].includes(current.status)) {
      return { success: false as const, error: "Company already has an active subscription" }
    }
  }

  const now = FieldValue.serverTimestamp()
  const payload = {
    companyId: params.companyId,
    planId: params.planId,
    status: params.status ?? SubscriptionStatus.active,
    billingInterval: params.billingInterval ?? BillingInterval.monthly,
    stripeCustomerId: params.stripeCustomerId ?? null,
    stripeSubscriptionId: params.stripeSubscriptionId ?? null,
    cancellationDetails: null,
    currentPeriodStart: params.currentPeriodStart ? Timestamp.fromDate(params.currentPeriodStart) : null,
    currentPeriodEnd: params.currentPeriodEnd ? Timestamp.fromDate(params.currentPeriodEnd) : null,
    cancelAtPeriodEnd: params.cancelAtPeriodEnd ?? false,
    trialStart: params.trialStart ? Timestamp.fromDate(params.trialStart) : null,
    trialEnd: params.trialEnd ? Timestamp.fromDate(params.trialEnd) : null,
    createdAt: now,
    updatedAt: now,
  }

  await subscriptionRef(params.companyId).set(payload, { merge: true })
  const created = await getCompanySubscription(params.companyId)
  return { success: true as const, data: created }
}

export const createFreeSubscriptionForCompany = async (companyId: string) => {
  const freePlan = await getPlanByType(PlanType.FREE)
  if (!freePlan) {
    return { success: false as const, error: "Free plan not found" }
  }

  return createCompanySubscription({
    companyId,
    planId: freePlan.id,
    status: SubscriptionStatus.active,
    billingInterval: BillingInterval.monthly,
    cancelAtPeriodEnd: false,
  })
}

export const updateCompanySubscription = async (params: {
  companyId: string
  planId?: string
  status?: SubscriptionStatus
  billingInterval?: BillingInterval
  stripeCustomerId?: string | null
  stripeSubscriptionId?: string | null
  currentPeriodStart?: Date | null
  currentPeriodEnd?: Date | null
  cancelAtPeriodEnd?: boolean
  trialStart?: Date | null
  trialEnd?: Date | null
  cancellationDetails?: string | null
}) => {
  const ref = subscriptionRef(params.companyId)
  const snap = await ref.get()
  if (!snap.exists) {
    return { success: false as const, error: "Subscription not found" }
  }

  const update: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() }

  if (params.planId !== undefined) update.planId = params.planId
  if (params.status !== undefined) update.status = params.status
  if (params.billingInterval !== undefined) update.billingInterval = params.billingInterval
  if (params.stripeCustomerId !== undefined) update.stripeCustomerId = params.stripeCustomerId
  if (params.stripeSubscriptionId !== undefined) update.stripeSubscriptionId = params.stripeSubscriptionId
  if (params.cancelAtPeriodEnd !== undefined) update.cancelAtPeriodEnd = params.cancelAtPeriodEnd
  if (params.cancellationDetails !== undefined) update.cancellationDetails = params.cancellationDetails
  if (params.currentPeriodStart !== undefined) {
    update.currentPeriodStart = params.currentPeriodStart ? Timestamp.fromDate(params.currentPeriodStart) : null
  }
  if (params.currentPeriodEnd !== undefined) {
    update.currentPeriodEnd = params.currentPeriodEnd ? Timestamp.fromDate(params.currentPeriodEnd) : null
  }
  if (params.trialStart !== undefined) {
    update.trialStart = params.trialStart ? Timestamp.fromDate(params.trialStart) : null
  }
  if (params.trialEnd !== undefined) {
    update.trialEnd = params.trialEnd ? Timestamp.fromDate(params.trialEnd) : null
  }

  await ref.update(update)
  const updated = await getCompanySubscription(params.companyId)
  return { success: true as const, data: updated }
}

export const updateSubscriptionStatusByStripeId = async (
  stripeSubscriptionId: string,
  status: SubscriptionStatus,
  extra?: Partial<{
    planId: string
    billingInterval: BillingInterval
    currentPeriodStart: Date
    currentPeriodEnd: Date
    cancelAtPeriodEnd: boolean
  }>,
) => {
  const snap = await adminDb
    .collectionGroup(companySubcollections.subscription)
    .where("stripeSubscriptionId", "==", stripeSubscriptionId)
    .limit(1)
    .get()

  if (snap.empty) {
    return { success: false as const, error: "Subscription not found" }
  }

  const doc = snap.docs[0]!
  const companyId = doc.ref.parent.parent!.id
  return updateCompanySubscription({
    companyId,
    status,
    planId: extra?.planId,
    billingInterval: extra?.billingInterval,
    currentPeriodStart: extra?.currentPeriodStart,
    currentPeriodEnd: extra?.currentPeriodEnd,
    cancelAtPeriodEnd: extra?.cancelAtPeriodEnd,
  })
}

export const getSubscriptionForUserDefaultCompany = async (uid: string) => {
  const userSnap = await adminDb.collection(collections.users).doc(uid).get()
  const companyId = userSnap.data()?.defaultCompanyId as string | undefined
  if (!companyId) {
    return null
  }
  return getCompanySubscription(companyId)
}
