import { getUserProfile } from "@/lib/firebase/services/user-service"
import { getCompanySubscription } from "@/lib/firebase/services/subscription-service"
import { getUserCompaniesLight } from "@/lib/firebase/services/company-service"
import { loadAcceptedMemberships, resolveActiveCompanyIdForUser } from "@/lib/user-workspace"
import { syncUserWorkspace } from "@/lib/sync-user-workspace"
import type { SubscriptionStatus } from "@/lib/types/enums"

export type SessionBootstrapMember = {
  id: string
  isAdmin: boolean
  canPost: boolean
  canApprove: boolean
  isOwner: boolean
  status: "invited" | "accepted" | "rejected"
}

export type SessionBootstrapCompany = {
  id: string
  name: string
  slug: string
  members: SessionBootstrapMember[]
}

export type SessionBootstrapCustomerSubscription = {
  id: string
  status: SubscriptionStatus
  billingInterval: string | null
  stripeSubscriptionId: string | null
  trialStart: string | null
  trialEnd: string | null
  plan: { planType: string }
}

export type SessionCompanyContext = {
  defaultCompanyId: string | null
  companies: SessionBootstrapCompany[]
  hasAcceptedMembership: boolean
  customerSubscription: SessionBootstrapCustomerSubscription | null
}

export type SessionBootstrapUser = {
  id: string
  uid: string
  email: string
  firstName: string
  lastName: string | null
  name: string
  phone: string | null
  avatarUrl: string | null
  language: string
  theme: string
  defaultCompanyId: string | null
  usagePercentage: number
}

export const buildSessionCompanyContext = async (uid: string): Promise<SessionCompanyContext> => {
  const [user, acceptedMemberships] = await Promise.all([
    getUserProfile(uid),
    loadAcceptedMemberships(uid),
  ])

  if (!user) {
    return {
      defaultCompanyId: null,
      companies: [],
      hasAcceptedMembership: false,
      customerSubscription: null,
    }
  }

  const defaultCompanyId = resolveActiveCompanyIdForUser(user, acceptedMemberships)
  if (defaultCompanyId !== (user.defaultCompanyId ?? null)) {
    await syncUserWorkspace(uid)
  }

  const companies = await getUserCompaniesLight(uid, defaultCompanyId ?? undefined)
  const customerSubscription = defaultCompanyId
    ? await getCompanySubscription(defaultCompanyId)
    : null

  return {
    defaultCompanyId,
    companies: companies.map((company) => ({
      id: company.id,
      name: company.name,
      slug: company.slug,
      members: company.members.map((member) => ({
        id: member.id,
        isAdmin: member.isAdmin,
        canPost: member.canPost,
        canApprove: member.canApprove,
        isOwner: member.isOwner,
        status: "accepted" as const,
      })),
    })),
    hasAcceptedMembership: companies.length > 0,
    customerSubscription: customerSubscription
      ? {
          id: customerSubscription.id,
          status: customerSubscription.status,
          billingInterval: customerSubscription.billingInterval,
          stripeSubscriptionId: customerSubscription.stripeSubscriptionId ?? null,
          trialStart:
            customerSubscription.trialStart instanceof Date
              ? customerSubscription.trialStart.toISOString()
              : null,
          trialEnd:
            customerSubscription.trialEnd instanceof Date
              ? customerSubscription.trialEnd.toISOString()
              : null,
          plan: { planType: customerSubscription.plan?.planType ?? "FREE" },
        }
      : null,
  }
}
