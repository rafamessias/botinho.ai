"use server"

import { z } from "zod"
import { getServerAuthSession } from "@/lib/auth/server-session"
import { createCompanyForUser } from "@/lib/firebase/services/company-service"
import {
  completeUserOnboarding,
  getUserProfile,
  updateOnboardingStep,
} from "@/lib/firebase/services/user-service"
import {
  getCompanySubscription,
  getPlanByType,
  updateCompanySubscription,
} from "@/lib/firebase/services/subscription-service"
import { createCheckoutSession } from "@/lib/stripe-service"
import { createAiAgent } from "@/lib/firebase/services/ai-agent-service"
import { getWhatsAppOrchestrator, isWhatsAppConfigured } from "@/lib/whatsapp"
import type { WhatsAppSession } from "@/lib/whatsapp/types"
import { BillingInterval, PlanType, SubscriptionStatus } from "@/lib/types/enums"
import type { PlanCurrency } from "@/lib/plan-catalog"
import { localizePathname } from "@/i18n/pathname"
import {
  resolveOnboardingStatus,
  resolveOnboardingStep,
} from "@/lib/onboarding/onboarding-utils"
import { BaseActionResponse, handleAction } from "./utils"

const companyStepSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
})

const advanceStepSchema = z.object({
  step: z.union([z.literal(2), z.literal(3), z.literal(4)]),
})

const botStepSchema = z.object({
  name: z.string().min(1),
  systemPrompt: z.string().optional(),
  sessionIds: z.array(z.string()).optional(),
})

const planStepSchema = z.object({
  planType: z.nativeEnum(PlanType),
  billingCycle: z.enum(["monthly", "yearly"]),
  currency: z.enum(["brl", "usd"]).optional(),
  locale: z.string(),
})

const requireOnboardingUser = async () => {
  const session = await getServerAuthSession()
  if (!session?.uid) {
    throw new Error("Not authenticated")
  }

  const profile = await getUserProfile(session.uid)
  if (!profile) {
    throw new Error("User not found")
  }

  if (resolveOnboardingStatus(profile) !== "pending") {
    throw new Error("Onboarding already completed")
  }

  return { uid: session.uid, email: session.email ?? profile.email, profile }
}

export const getOnboardingStateAction = async (): Promise<
  BaseActionResponse<{
    status: "pending" | "completed"
    step: number
    companyId: string | null
    whatsAppConfigured: boolean
    connectedSessionsCount: number
    preferredPlanType: string | null
  }>
> =>
  handleAction(async () => {
    const session = await getServerAuthSession()
    if (!session?.uid) {
      throw new Error("Not authenticated")
    }

    const profile = await getUserProfile(session.uid)
    if (!profile) {
      throw new Error("User not found")
    }

    const status = resolveOnboardingStatus(profile)
    let connectedSessionsCount = 0

    if (profile.defaultCompanyId && isWhatsAppConfigured()) {
      try {
        const orchestrator = await getWhatsAppOrchestrator()
        const sessions = await orchestrator.listSessions(profile.defaultCompanyId)
        connectedSessionsCount = sessions.filter(
          (item) =>
            item.status === "connected" &&
            Boolean(item.phoneNumber) &&
            item.loggedIn === true &&
            item.hasSnapshot === true,
        ).length
      } catch {
        connectedSessionsCount = 0
      }
    }

    return {
      success: true,
      data: {
        status,
        step: resolveOnboardingStep(profile),
        companyId: profile.defaultCompanyId ?? null,
        whatsAppConfigured: isWhatsAppConfigured(),
        connectedSessionsCount,
        preferredPlanType: profile.preferredPlanType ?? null,
      },
    }
  })

export const completeOnboardingCompanyStepAction = async (
  input: z.infer<typeof companyStepSchema>,
): Promise<BaseActionResponse<{ companyId: string }>> =>
  handleAction(async () => {
    const data = companyStepSchema.parse(input)
    const { uid, profile } = await requireOnboardingUser()

    if (profile.defaultCompanyId) {
      await updateOnboardingStep(uid, 2)
      return { success: true, data: { companyId: profile.defaultCompanyId } }
    }

    const { companyId } = await createCompanyForUser({
      uid,
      firstName: profile.firstName,
      companyName: data.name,
      companyDescription: data.description,
    })

    await updateOnboardingStep(uid, 2)

    return { success: true, data: { companyId } }
  })

export const advanceOnboardingStepAction = async (
  input: z.infer<typeof advanceStepSchema>,
): Promise<BaseActionResponse> =>
  handleAction(async () => {
    const { step } = advanceStepSchema.parse(input)
    const { uid, profile } = await requireOnboardingUser()

    const currentStep = resolveOnboardingStep(profile)
    if (step === 3 && currentStep < 2) {
      throw new Error("Complete company setup first")
    }
    if (step === 4 && currentStep < 3) {
      throw new Error("Complete previous onboarding steps first")
    }
    if (step === 2 && !profile.defaultCompanyId) {
      throw new Error("Create your company first")
    }

    await updateOnboardingStep(uid, step)
    return { success: true, message: "Step updated" }
  })

export const completeOnboardingBotStepAction = async (
  input: z.infer<typeof botStepSchema>,
): Promise<BaseActionResponse> =>
  handleAction(async () => {
    const data = botStepSchema.parse(input)
    const { uid, profile } = await requireOnboardingUser()

    if (!profile.defaultCompanyId) {
      throw new Error("Create your company first")
    }

    await createAiAgent(profile.defaultCompanyId, uid, {
      name: data.name,
      systemPrompt: data.systemPrompt,
      sessionIds: data.sessionIds,
    })

    await updateOnboardingStep(uid, 4)
    return { success: true, message: "Botinho created" }
  })

export const completeOnboardingAction = async (): Promise<BaseActionResponse> =>
  handleAction(async () => {
    const { uid } = await requireOnboardingUser()

    if (!uid) {
      throw new Error("Not authenticated")
    }

    const profile = await getUserProfile(uid)
    if (!profile?.defaultCompanyId) {
      throw new Error("Create your company first")
    }

    await completeUserOnboarding(uid)
    return { success: true, message: "Onboarding completed" }
  })

export const selectOnboardingPlanAction = async (
  input: z.infer<typeof planStepSchema>,
): Promise<BaseActionResponse<{ checkoutUrl?: string; completed?: boolean }>> =>
  handleAction<{ checkoutUrl?: string; completed?: boolean }>(async () => {
    const data = planStepSchema.parse(input)
    const { uid, email, profile } = await requireOnboardingUser()

    if (!profile.defaultCompanyId) {
      throw new Error("Create your company first")
    }

    if (data.planType === PlanType.FREE) {
      await completeUserOnboarding(uid)
      return { success: true, data: { completed: true } }
    }

    const plan = await getPlanByType(data.planType)
    if (!plan) {
      throw new Error("Invalid plan selected")
    }

    const subscription = await getCompanySubscription(profile.defaultCompanyId)
    if (!subscription) {
      throw new Error("Subscription not found")
    }

    await updateCompanySubscription({
      companyId: profile.defaultCompanyId,
      planId: plan.id,
      status: SubscriptionStatus.pending,
      billingInterval: data.billingCycle === "yearly" ? BillingInterval.yearly : BillingInterval.monthly,
    })

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const localePrefix = data.locale.startsWith("pt") ? "pt-BR" : "en"
    const successPath = localizePathname("/onboarding/plan?checkout=success", localePrefix)
    const cancelPath = localizePathname("/onboarding/plan?checkout=canceled", localePrefix)

    const checkoutResult = await createCheckoutSession({
      planId: data.planType,
      billingCycle: data.billingCycle,
      currency: data.currency as PlanCurrency | undefined,
      userEmail: email,
      companyId: profile.defaultCompanyId,
      customerSubscriptionId: subscription.id,
      successUrl: `${baseUrl}${successPath}`,
      cancelUrl: `${baseUrl}${cancelPath}`,
    })

    if (!checkoutResult.success || !checkoutResult.url) {
      throw new Error(checkoutResult.error || "Failed to create checkout session")
    }

    return { success: true, data: { checkoutUrl: checkoutResult.url } }
  })

type OnboardingSessionView = {
  sessionId: string
  label: string | null
  phoneNumber: string | null
  status: WhatsAppSession["status"]
  connected: boolean
  loggedIn: boolean
  hasCredentials: boolean
}

const toOnboardingSessionView = (session: WhatsAppSession): OnboardingSessionView => ({
  sessionId: session.sessionId,
  label: session.label ?? null,
  phoneNumber: session.phoneNumber ?? null,
  status: session.status,
  connected:
    session.status === "connected" &&
    Boolean(session.phoneNumber) &&
    session.loggedIn === true &&
    session.hasSnapshot === true,
  loggedIn: session.loggedIn === true,
  hasCredentials: session.hasCredentials === true,
})

export const createOnboardingWhatsAppSessionAction = async (input?: {
  label?: string
}): Promise<BaseActionResponse<{ session: OnboardingSessionView }>> =>
  handleAction(async () => {
    const { profile } = await requireOnboardingUser()
    if (!profile.defaultCompanyId) {
      throw new Error("Create your company first")
    }
    if (!isWhatsAppConfigured()) {
      throw new Error("WhatsApp integration is not configured")
    }

    const companyId = profile.defaultCompanyId
    const orchestrator = await getWhatsAppOrchestrator()
    const webhookUrl = orchestrator.buildInboundWebhookUrl(companyId)
    const session = await orchestrator.createSession({
      companyId,
      webhookUrl,
      ...(input?.label ? { label: input.label } : {}),
    })
    const connected = await orchestrator.connectSession(session.sessionId, companyId)

    return { success: true, data: { session: toOnboardingSessionView(connected) } }
  })

export const getOnboardingWhatsAppQrAction = async (input: {
  sessionId: string
}): Promise<BaseActionResponse<{ session: OnboardingSessionView; qrImage: string | null }>> =>
  handleAction(async () => {
    const { profile } = await requireOnboardingUser()
    if (!profile.defaultCompanyId) {
      throw new Error("Create your company first")
    }

    const orchestrator = await getWhatsAppOrchestrator()
    try {
      const session = await orchestrator.getQrCode(input.sessionId, profile.defaultCompanyId)
      const pairingScanned = session.loggedIn === true || session.hasCredentials === true
      return {
        success: true,
        data: {
          session: toOnboardingSessionView(session),
          qrImage: pairingScanned ? null : session.qrImage ?? null,
        },
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "qr not available yet"
      if (message.includes("qr not available")) {
        const session = await orchestrator.getSession(input.sessionId, profile.defaultCompanyId)
        const pairingScanned = session.loggedIn === true || session.hasCredentials === true
        return {
          success: true,
          data: {
            session: toOnboardingSessionView(session),
            qrImage: pairingScanned ? null : session.qrImage ?? null,
          },
        }
      }
      throw error
    }
  })

export const getOnboardingPhoneOptionsAction = async (): Promise<
  BaseActionResponse<{ sessions: Array<{ sessionId: string; label: string | null; phoneNumber: string | null }> }>
> =>
  handleAction(async () => {
    const { profile } = await requireOnboardingUser()
    if (!profile.defaultCompanyId || !isWhatsAppConfigured()) {
      return { success: true, data: { sessions: [] } }
    }

    const orchestrator = await getWhatsAppOrchestrator()
    const sessions = await orchestrator.listSessions(profile.defaultCompanyId)
    return {
      success: true,
      data: {
        sessions: sessions
          .filter((session) => session.status === "connected")
          .map((session) => ({
            sessionId: session.sessionId,
            label: session.label ?? null,
            phoneNumber: session.phoneNumber ?? null,
          })),
      },
    }
  })
