import { PlanType } from "@/lib/types/enums"

export type PlanCurrency = "brl" | "usd"

export type PlanCatalogKey = "free" | "starter" | "pro" | "business"

export type PlanCatalogEntry = {
  key: PlanCatalogKey
  planType: PlanType
  maxSyncedNumbers: number
  maxAiCredits: number
  prices: {
    brl: { monthly: number; yearly: number }
    usd: { monthly: number; yearly: number }
  }
  flags: {
    allowExport: boolean
    allowApiAccess: boolean
    removeBranding: boolean
  }
  highlight?: boolean
  contactSales?: boolean
  landingCtaHref: string
  showInUpgrade: boolean
}

/** 1 full AI credit = 10 tenths in Firestore usage docs */
export const AI_CREDIT_TENTHS = 10
export const SUGGESTION_CREDIT_TENTHS = 3

export const PLAN_CATALOG: PlanCatalogEntry[] = [
  {
    key: "free",
    planType: PlanType.FREE,
    maxSyncedNumbers: 1,
    maxAiCredits: 40,
    prices: { brl: { monthly: 0, yearly: 0 }, usd: { monthly: 0, yearly: 0 } },
    flags: { allowExport: false, allowApiAccess: false, removeBranding: false },
    landingCtaHref: "/sign-up",
    showInUpgrade: false,
  },
  {
    key: "starter",
    planType: PlanType.STARTER,
    maxSyncedNumbers: 1,
    maxAiCredits: 400,
    prices: { brl: { monthly: 79, yearly: 790 }, usd: { monthly: 15, yearly: 150 } },
    flags: { allowExport: true, allowApiAccess: false, removeBranding: false },
    landingCtaHref: "/sign-up",
    showInUpgrade: true,
  },
  {
    key: "pro",
    planType: PlanType.PRO,
    maxSyncedNumbers: 3,
    maxAiCredits: 1_500,
    prices: { brl: { monthly: 179, yearly: 1_790 }, usd: { monthly: 29, yearly: 290 } },
    flags: { allowExport: true, allowApiAccess: true, removeBranding: true },
    highlight: true,
    landingCtaHref: "/sign-up",
    showInUpgrade: true,
  },
  {
    key: "business",
    planType: PlanType.BUSINESS,
    maxSyncedNumbers: 8,
    maxAiCredits: 5_000,
    prices: { brl: { monthly: 499, yearly: 4_990 }, usd: { monthly: 79, yearly: 790 } },
    flags: { allowExport: true, allowApiAccess: true, removeBranding: true },
    contactSales: true,
    landingCtaHref: "/contact",
    showInUpgrade: true,
  },
]

export const ENTERPRISE_LIMITS = {
  maxSyncedNumbers: 15,
  maxAiCredits: 100_000,
}

export const getCatalogEntryByPlanType = (planType: PlanType): PlanCatalogEntry | null =>
  PLAN_CATALOG.find((entry) => entry.planType === planType) ?? null

export const getCatalogEntryByKey = (key: PlanCatalogKey): PlanCatalogEntry | null =>
  PLAN_CATALOG.find((entry) => entry.key === key) ?? null

export const getLimitsForPlanType = (planType: PlanType): { maxSyncedNumbers: number; maxAiCredits: number } => {
  const entry = getCatalogEntryByPlanType(planType)
  if (entry) {
    return { maxSyncedNumbers: entry.maxSyncedNumbers, maxAiCredits: entry.maxAiCredits }
  }
  if (planType === PlanType.ENTERPRISE) {
    return ENTERPRISE_LIMITS
  }
  return { maxSyncedNumbers: 1, maxAiCredits: 40 }
}

export const getLandingPlans = (): PlanCatalogEntry[] => PLAN_CATALOG

export const getUpgradePlans = (): PlanCatalogEntry[] =>
  PLAN_CATALOG.filter((entry) => entry.showInUpgrade)

export const localeToCurrency = (locale: string): PlanCurrency =>
  locale.startsWith("pt") ? "brl" : "usd"

export const currencyToIso = (currency: PlanCurrency): string => (currency === "brl" ? "BRL" : "USD")

export const formatPlanPrice = (
  amount: number,
  currency: PlanCurrency,
  locale?: string,
): string =>
  new Intl.NumberFormat(locale ?? (currency === "brl" ? "pt-BR" : "en-US"), {
    style: "currency",
    currency: currencyToIso(currency),
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

export const formatMonthlyFromYearly = (yearlyAmount: number): { integer: string; decimal: string } => {
  const monthly = yearlyAmount / 12
  const [integer, decimal = "00"] = monthly.toFixed(2).split(".")
  return { integer, decimal }
}

export const creditsToTenthsLimit = (credits: number): number => credits * AI_CREDIT_TENTHS

export const tenthsToCredits = (tenths: number): number => tenths / AI_CREDIT_TENTHS
