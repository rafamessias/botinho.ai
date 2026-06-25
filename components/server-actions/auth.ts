"use server"

import bcrypt from "bcryptjs"
import { z } from "zod"
import { cookies } from "next/headers"
import { getTranslations } from "next-intl/server"
import { AuthError } from "next-auth"
import { signIn, signOut } from "@/app/auth"
import { localizePathname } from "@/i18n/pathname"
import { BillingInterval, PlanType, SubscriptionStatus } from "@/lib/types/enums"
import { createCheckoutSession } from "@/lib/stripe-service"
import { adminAuth } from "@/lib/firebase/admin"
import { sendTransactionalEmail } from "@/lib/email/send-transactional-email"
import { getUserProfile } from "@/lib/firebase/services/user-service"
import { createCompanyForUser } from "@/lib/firebase/services/company-service"
import {
  createFreeSubscriptionForCompany,
  getCompanySubscription,
} from "@/lib/firebase/services/subscription-service"
import { acceptCompanyInvite } from "@/lib/firebase/services/company-operations"
import { adminDb } from "@/lib/firebase/admin"
import { collections } from "@/lib/firebase/collections"

export interface SignInFormData {
  email: string
  password: string
}

export interface SignUpFormData {
  name: string
  email: string
  phone?: string
  password: string
  confirmPassword: string
}

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 characters")
      .regex(/^[+]?[\d\s\-\(\)]{10,}$/, "Invalid phone number format")
      .optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const getCurrentLocale = async (): Promise<string> => {
  const cookieStore = await cookies()
  return cookieStore.get("NEXT_LOCALE")?.value || "en"
}

export const generateConfirmationToken = async (
  randomCharacters: number = 36,
  numberCharacters: number = 15,
): Promise<string> => {
  return (
    Math.random().toString(randomCharacters).substring(2, numberCharacters) +
    Math.random().toString(randomCharacters).substring(2, numberCharacters)
  )
}

export const signInAction = async (formData: SignInFormData) => {
  const t = await getTranslations("AuthErrors")
  try {
    const validatedData = signInSchema.parse(formData)

    const result = await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    })

    if (result?.error) {
      const errorCode =
        typeof (result as { code?: string }).code === "string"
          ? (result as { code: string }).code
          : result.error

      if (errorCode.includes("invalid-credentials")) {
        return { success: false, errorCode: "invalid-credentials", error: t("invalidCredentials") }
      }
      if (errorCode.includes("account-blocked")) {
        return { success: false, errorCode: "account-blocked", error: t("accountBlocked") }
      }
      return { success: false, errorCode: "authentication-failed", error: t("authenticationFailed") }
    }

    const subscriptionCheck = await validateUserCompanyAndSubscription(validatedData.email)
    if (!subscriptionCheck?.success) {
      return {
        success: false,
        error: subscriptionCheck?.error || t("unexpectedError"),
      }
    }

    return {
      success: true,
      needsCheckout: subscriptionCheck.needsCheckout ?? false,
      checkoutUrl: subscriptionCheck.checkoutUrl ?? null,
    }
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error
    }

    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        const code = (error as { code?: string }).code ?? ""
        if (code.includes("account-blocked")) {
          return { success: false, errorCode: "account-blocked", error: t("accountBlocked") }
        }
        return { success: false, errorCode: "invalid-credentials", error: t("invalidCredentials") }
      }
      return { success: false, error: t("authenticationFailed") }
    }

    console.error("Sign in error:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: t("unexpectedError") }
  }
}

export const createDefaultCompanyWithFreePlan = async (uid: string, firstName: string) => {
  try {
    const { companyId } = await createCompanyForUser({ uid, firstName })
    const subscription = await createFreeSubscriptionForCompany(companyId)
    if (!subscription.success) {
      return { success: false, error: subscription.error || "Failed to create subscription", company: null }
    }
    return { success: true, message: "Company and FREE plan subscription created successfully", company: { id: companyId } }
  } catch (error) {
    console.error("Error creating default company with free plan:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      company: null,
    }
  }
}

export const validateUserCompanyAndSubscription = async (userEmail: string) => {
  try {
    const authUser = await adminAuth.getUserByEmail(userEmail.toLowerCase())
    const profile = await getUserProfile(authUser.uid)

    if (!profile) {
      return { success: false, error: "User not found", needsCheckout: false, checkoutUrl: null }
    }

    if (!profile.defaultCompanyId) {
      const createCompanyResult = await createDefaultCompanyWithFreePlan(authUser.uid, profile.firstName)
      if (!createCompanyResult.success) {
        return {
          success: false,
          error: createCompanyResult.error || "Failed to create default company",
          needsCheckout: false,
          checkoutUrl: null,
        }
      }
      return { success: true, needsCheckout: false, checkoutUrl: null }
    }

    const subscription = await getCompanySubscription(profile.defaultCompanyId)
    if (!subscription) {
      await createDefaultCompanyWithFreePlan(authUser.uid, profile.firstName)
      return { success: true, needsCheckout: false, checkoutUrl: null }
    }

    const memberSnap = await adminDb
      .collection(collections.companies)
      .doc(profile.defaultCompanyId)
      .collection("members")
      .doc(authUser.uid)
      .get()
    const isOwner = memberSnap.data()?.isOwner === true

    if (subscription.status === SubscriptionStatus.pending && isOwner) {
      const planType = (subscription.plan?.planType as PlanType) || PlanType.FREE
      const checkoutResult = await createCheckoutSession({
        planId: planType,
        billingCycle: BillingInterval.monthly,
        userEmail,
        companyId: profile.defaultCompanyId,
        customerSubscriptionId: subscription.id,
      })

      if (!checkoutResult.success || !checkoutResult.url) {
        return {
          success: false,
          error: "Failed to create checkout session",
          needsCheckout: true,
          checkoutUrl: null,
        }
      }

      return { success: true, needsCheckout: true, checkoutUrl: checkoutResult.url }
    }

    if (subscription.status === SubscriptionStatus.pending && !isOwner) {
      return {
        success: false,
        needsCheckout: false,
        checkoutUrl: null,
        message: "Only company owner can complete subscription checkout",
      }
    }

    return { success: true, needsCheckout: false, checkoutUrl: null }
  } catch (error) {
    console.error("Error validating user company and subscription:", error)
    return {
      success: false,
      error: "Failed to validate company and subscription",
      needsCheckout: false,
      checkoutUrl: null,
    }
  }
}

export const signUpAction = async (formData: SignUpFormData, planParam?: string | null) => {
  const t = await getTranslations("AuthErrors")
  try {
    const validatedData = signUpSchema.parse(formData)
    const currentLocale = await getCurrentLocale()
    const nameParts = validatedData.name.trim().split(" ")
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(" ") || ""

    const { registerPendingSignup } = await import("@/lib/firebase/auth/signup-flow")
    const result = await registerPendingSignup({
      email: validatedData.email,
      firstName,
      lastName,
      phone: validatedData.phone,
      password: validatedData.password,
      planParam,
      locale: currentLocale,
    })

    if (!result.success) {
      return { success: false, error: result.error }
    }

    return {
      success: true,
      message: result.isOTPEnabled ? t("otpSentSignup") : t("emailSent"),
      userId: result.uid,
    }
  } catch (error) {
    console.error("Sign up error:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: t("registrationFailed") }
  }
}

export const googleSignInAction = async (redirectPath?: string) => {
  const t = await getTranslations("AuthErrors")
  try {
    const cookieStore = await cookies()
    const safeRedirect =
      redirectPath?.startsWith("/") && !redirectPath.startsWith("//") ? redirectPath : null

    if (safeRedirect) {
      cookieStore.set("oauth_redirect", safeRedirect, {
        maxAge: 300,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      })
    }

    const locale = await getCurrentLocale()
    const postLoginPath = localizePathname("/auth/post-login", locale)

    await signIn("google", { redirectTo: postLoginPath })
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error
    }
    console.error("Google sign in error:", error)
    return { success: false, error: t("googleSignInFailed") }
  }
}

export const postGoogleSignInAction = async (email: string) => {
  return validateUserCompanyAndSubscription(email)
}

export const logoutAction = async (redirectTo: string) => {
  const t = await getTranslations("AuthErrors")
  try {
    await signOut({ redirect: true, redirectTo })
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error
    }
    console.error("Logout error:", error)
    return { success: false, error: t("unexpectedError") }
  }
}

export const confirmEmailAction = async (token: string, companyId?: string, uid?: string) => {
  const t = await getTranslations("AuthErrors")

  try {
    if (!token) {
      return { success: false, error: "Confirmation token is required" }
    }

    if (companyId) {
      const result = await acceptCompanyInvite(companyId, token)
      if (!result.success) {
        if (result.error === "INVITE_COMPANY_CONFLICT") {
          return { success: false, error: t("inviteCompanyConflict") }
        }
        return { success: false, error: result.error || t("invalidToken") }
      }
      return { success: true, message: "Invitation accepted successfully. You can now sign in." }
    }

    if (uid) {
      const pendingRef = adminDb.collection(collections.pendingSignups).doc(uid)
      const pendingSnap = await pendingRef.get()
      if (!pendingSnap.exists) {
        return { success: false, error: t("invalidToken") }
      }

      const pending = pendingSnap.data()!
      const otpValid = await bcrypt.compare(token, pending.otpHash)
      if (!otpValid) {
        return { success: false, error: t("invalidToken") }
      }

      await adminAuth.updateUser(uid, { disabled: false, emailVerified: true })
      await pendingRef.update({ verified: true })
      return { success: true, message: "Email confirmed successfully. You can now sign in." }
    }

    return { success: false, error: t("invalidToken") }
  } catch (error) {
    console.error("Email confirmation error:", error)
    return { success: false, error: t("confirmationFailed") }
  }
}

export const resendConfirmationEmailAction = async (email: string) => {
  const t = await getTranslations("AuthErrors")
  try {
    if (!email) {
      return { success: false, error: "Email is required" }
    }
    const currentLocale = await getCurrentLocale()
    const { resendSignupConfirmationEmail } = await import("@/lib/firebase/auth/signup-flow")
    const result = await resendSignupConfirmationEmail(email, currentLocale)
    if (!result.success) {
      return { success: false, error: result.error }
    }
    return { success: true, message: result.message ?? "Confirmation email sent successfully" }
  } catch (error) {
    console.error("Resend confirmation email error:", error)
    return { success: false, error: t("resendFailed") }
  }
}

export const getCurrentUserAction = async () => {
  try {
    const { getServerAuthSession } = await import("@/lib/auth/server-session")
    const session = await getServerAuthSession()
    if (!session?.uid) {
      return { success: false, error: "Not authenticated", user: null }
    }
    const { getUserProfile, mapUserToClient } = await import("@/lib/firebase/services/user-service")
    const user = await getUserProfile(session.uid)
    if (!user) {
      return { success: false, error: "User not found", user: null }
    }
    return { success: true, user: mapUserToClient(user) }
  } catch (error) {
    console.error("Get current user error:", error)
    return { success: false, error: "Failed to get user", user: null }
  }
}

export const getSessionBootstrapAction = async () => {
  try {
    const { getServerAuthSession } = await import("@/lib/auth/server-session")
    const session = await getServerAuthSession()
    if (!session?.uid) {
      return { success: false, error: "Not authenticated", user: null, companyContext: null }
    }

    const { getUserProfile, mapUserToClient } = await import("@/lib/firebase/services/user-service")
    const { buildSessionCompanyContext } = await import("@/lib/session-company-context")
    const [user, companyContext] = await Promise.all([
      getUserProfile(session.uid),
      buildSessionCompanyContext(session.uid),
    ])

    if (!user) {
      return { success: false, error: "User not found", user: null, companyContext: null }
    }

    const clientUser = {
      ...mapUserToClient(user),
      defaultCompanyId: companyContext.defaultCompanyId,
      companies: companyContext.companies,
    }

    return {
      success: true,
      user: clientUser,
      companyContext,
    }
  } catch (error) {
    console.error("Session bootstrap error:", error)
    return { success: false, error: "Failed to load session", user: null, companyContext: null }
  }
}

export const resetPasswordAction = async (email: string) => {
  const t = await getTranslations("AuthErrors")
  try {
    if (!email) {
      return { success: false, error: "Email is required" }
    }
    const validatedEmail = z.string().email().parse(email)
    const currentLocale = await getCurrentLocale()
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const continueUrl = `${baseUrl}/${currentLocale}/reset-password/confirm`

    try {
      const resetLink = await adminAuth.generatePasswordResetLink(validatedEmail, { url: continueUrl })
      await sendTransactionalEmail({
        to: validatedEmail,
        subject: currentLocale === "pt-BR" ? "Redefinir sua senha" : "Reset your password",
        text:
          currentLocale === "pt-BR" ? `Redefina sua senha: ${resetLink}` : `Reset your password: ${resetLink}`,
      })
    } catch (emailError) {
      console.error("Password reset email error:", emailError)
    }

    return { success: true, message: "If an account with that email exists, we've sent you a reset link." }
  } catch (error) {
    console.error("Reset password error:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: t("unexpectedError") }
  }
}

export const confirmPasswordResetAction = async (_token: string, _password: string) => {
  return {
    success: false,
    error: "Use the password reset link from your email to set a new password.",
  }
}

export const confirmOTPAction = async (otp: string, email?: string, phone?: string) => {
  const t = await getTranslations("AuthErrors")
  try {
    if (!otp || (!email && !phone)) {
      return { success: false, error: t("otpRequired"), message: t("otpRequired") }
    }
    const validatedOTP = z.string().regex(/^\d{6}$/, t("otpInvalidFormat")).parse(otp)
    if (!email) {
      return { success: false, error: t("emailOrPhoneRequired"), message: t("emailOrPhoneRequired") }
    }

    const { verifyPendingSignupOtp } = await import("@/lib/firebase/auth/signup-flow")
    const result = await verifyPendingSignupOtp({ email, otp: validatedOTP })
    if (!result.success) {
      return { success: false, error: result.error, message: result.error }
    }

    const signInResult = await signIn("otp-session", {
      uid: result.uid,
      email: email.toLowerCase(),
      redirect: false,
    })

    if (signInResult?.error) {
      return {
        success: false,
        error: t("authenticationFailed"),
        message: t("authenticationFailed"),
      }
    }

    const subscriptionCheck = await validateUserCompanyAndSubscription(email)
    if (!subscriptionCheck?.success) {
      return {
        success: false,
        error: subscriptionCheck?.error || t("unexpectedError"),
        message: subscriptionCheck?.error || t("unexpectedError"),
      }
    }

    return {
      success: true,
      message: t("accountConfirmed"),
      needsCheckout: subscriptionCheck?.needsCheckout ?? false,
      checkoutUrl: subscriptionCheck?.checkoutUrl ?? null,
    }
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error
    }

    if (error instanceof AuthError && error.type === "CredentialsSignin") {
      return {
        success: false,
        error: t("invalidCredentials"),
        message: t("invalidCredentials"),
      }
    }

    console.error("OTP confirmation error:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message, message: error.errors[0].message }
    }
    return { success: false, error: t("unexpectedError"), message: t("unexpectedError") }
  }
}

export const createCheckoutSessionAction = async (
  planType: PlanType,
  billingCycle: string = "monthly",
  userEmail?: string,
  companyId?: string,
  customerSubscriptionId?: string,
) => {
  try {
    const result = await createCheckoutSession({
      planId: planType,
      billingCycle: billingCycle as "monthly" | "yearly",
      userEmail,
      companyId,
      customerSubscriptionId,
    })
    if (!result.success || !result.url) {
      return { success: false, error: result.error || "Failed to create checkout session" }
    }
    return { success: true, checkoutUrl: result.url }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return { success: false, error: "Failed to create checkout session" }
  }
}

export const resendOTPAction = async (email?: string, phone?: string) => {
  const t = await getTranslations("AuthErrors")
  try {
    if (!email && !phone) {
      return { success: false, error: t("emailOrPhoneRequired") }
    }
    if (!email) {
      return { success: false, error: t("emailOrPhoneRequired") }
    }
    const currentLocale = await getCurrentLocale()
    const { resendPendingSignupOtp } = await import("@/lib/firebase/auth/signup-flow")
    const result = await resendPendingSignupOtp(email, currentLocale)
    if (!result.success) {
      return { success: false, error: result.error }
    }
    return { success: true, message: t("otpSent") }
  } catch (error) {
    console.error("Resend OTP error:", error)
    return { success: false, error: t("unexpectedError") }
  }
}
