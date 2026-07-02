"use server"

import bcrypt from "bcryptjs"
import { FieldValue } from "firebase-admin/firestore"
import { adminAuth, adminDb } from "@/lib/firebase/admin"
import { collections } from "@/lib/firebase/collections"
import { createUserProfile } from "@/lib/firebase/services/user-service"
import type { UserLanguage } from "@/lib/firebase/types"
import { sendTransactionalEmail } from "@/lib/email/send-transactional-email"
import { generateConfirmationToken } from "@/components/server-actions/auth"
import { getTranslations } from "next-intl/server"
import { localizePathname } from "@/i18n/pathname"

const OTP_EXPIRY_MINUTES = 15

export const registerPendingSignup = async (params: {
  email: string
  firstName: string
  lastName?: string
  phone?: string
  password: string
  planParam?: string | null
  locale: string
}) => {
  const t = await getTranslations("AuthErrors")
  const isOTPEnabled = process.env.OTP_ENABLED === "TRUE"
  const language: UserLanguage = params.locale === "pt-BR" ? "pt_BR" : "en"

  const existingAuth = await adminAuth.getUserByEmail(params.email).catch(() => null)
  if (existingAuth) {
    return { success: false as const, error: t("emailExists") }
  }

  const userRecord = await adminAuth.createUser({
    email: params.email.toLowerCase(),
    password: params.password,
    displayName: params.firstName,
    disabled: isOTPEnabled,
    emailVerified: !isOTPEnabled,
  })

  const otp = isOTPEnabled
    ? Math.floor(100000 + Math.random() * 900000).toString()
    : await generateConfirmationToken()

  const otpHash = await bcrypt.hash(otp, 12)

  await adminDb.collection(collections.pendingSignups).doc(userRecord.uid).set({
    uid: userRecord.uid,
    email: params.email.toLowerCase(),
    firstName: params.firstName,
    lastName: params.lastName ?? null,
    phone: params.phone ?? null,
    otpHash,
    otpExpiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
    planType: params.planParam ?? "free",
    language,
    verified: !isOTPEnabled,
    createdAt: FieldValue.serverTimestamp(),
  })

  if (isOTPEnabled) {
    await sendTransactionalEmail({
      to: params.email,
      subject: params.locale === "pt-BR" ? "Seu código de verificação" : "Your verification code",
      text: params.locale === "pt-BR"
        ? `Seu código botinho.ai: ${otp}`
        : `Your botinho.ai verification code: ${otp}`,
    })
  } else {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.HOST || "http://localhost:3000"
    const confirmationUrl = `${baseUrl}/${params.locale}/sign-up/confirm?token=${otp}&uid=${userRecord.uid}`
    await sendTransactionalEmail({
      to: params.email,
      subject: params.locale === "pt-BR" ? "Confirme seu email" : "Confirm your email",
      text: params.locale === "pt-BR"
        ? `Confirme seu email: ${confirmationUrl}`
        : `Confirm your email: ${confirmationUrl}`,
    })
  }

  return { success: true as const, uid: userRecord.uid, isOTPEnabled }
}

export const verifyPendingSignupOtp = async (params: {
  email: string
  otp: string
}) => {
  const t = await getTranslations("AuthErrors")

  let uid: string
  try {
    const user = await adminAuth.getUserByEmail(params.email.toLowerCase())
    uid = user.uid
  } catch {
    return { success: false as const, error: t("invalidCredentials") }
  }

  const pendingRef = adminDb.collection(collections.pendingSignups).doc(uid)
  const pendingSnap = await pendingRef.get()

  if (!pendingSnap.exists) {
    return { success: false as const, error: t("invalidCredentials") }
  }

  const pending = pendingSnap.data()!
  const expiresAt = pending.otpExpiresAt?.toDate?.() ?? new Date(pending.otpExpiresAt)

  if (expiresAt.getTime() < Date.now()) {
    return { success: false as const, error: t("emailNotConfirmed") }
  }

  const otpValid = await bcrypt.compare(params.otp, pending.otpHash)
  if (!otpValid) {
    return { success: false as const, error: t("invalidCredentials") }
  }

  await adminAuth.updateUser(uid, { disabled: false, emailVerified: true })

  await createUserProfile({
    uid,
    email: pending.email,
    firstName: pending.firstName,
    lastName: pending.lastName ?? undefined,
    phone: pending.phone ?? undefined,
    language: pending.language,
    onboardingStatus: "pending",
    onboardingStep: 1,
    preferredPlanType: pending.planType ?? null,
  })

  await pendingRef.update({ verified: true })

  const customToken = await adminAuth.createCustomToken(uid)

  return { success: true as const, customToken, uid }
}

export const resendPendingSignupOtp = async (email: string, locale: string) => {
  const t = await getTranslations("AuthErrors")

  let uid: string
  try {
    uid = (await adminAuth.getUserByEmail(email.toLowerCase())).uid
  } catch {
    return { success: false as const, error: t("invalidCredentials") }
  }

  const pendingRef = adminDb.collection(collections.pendingSignups).doc(uid)
  const pendingSnap = await pendingRef.get()
  if (!pendingSnap.exists || pendingSnap.data()?.verified) {
    return { success: false as const, error: t("invalidCredentials") }
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const otpHash = await bcrypt.hash(otp, 12)

  await pendingRef.update({
    otpHash,
    otpExpiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
  })

  await sendTransactionalEmail({
    to: email,
    subject: locale === "pt-BR" ? "Seu código de verificação" : "Your verification code",
    text: locale === "pt-BR" ? `Seu código botinho.ai: ${otp}` : `Your botinho.ai verification code: ${otp}`,
  })

  return { success: true as const, message: "OTP sent" }
}

export const resendSignupConfirmationEmail = async (email: string, locale: string) => {
  const t = await getTranslations("AuthErrors")
  const isOTPEnabled = process.env.OTP_ENABLED === "TRUE"

  if (isOTPEnabled) {
    return resendPendingSignupOtp(email, locale)
  }

  let uid: string
  try {
    uid = (await adminAuth.getUserByEmail(email.toLowerCase())).uid
  } catch {
    return { success: false as const, error: t("userNotFound") }
  }

  const pendingRef = adminDb.collection(collections.pendingSignups).doc(uid)
  const pendingSnap = await pendingRef.get()

  if (!pendingSnap.exists || pendingSnap.data()?.verified) {
    return { success: false as const, error: t("emailAlreadyConfirmed") }
  }

  const pending = pendingSnap.data()!
  const token = await generateConfirmationToken()
  const otpHash = await bcrypt.hash(token, 12)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.HOST || "http://localhost:3000"
  const confirmationUrl = `${baseUrl}${localizePathname("/sign-up/confirm", locale)}?token=${token}&uid=${uid}`

  await pendingRef.update({
    otpHash,
    otpExpiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
  })

  const { buildEmailConfirmationEmail } = await import("@/lib/email/email-messages")
  const emailContent = buildEmailConfirmationEmail({
    firstName: pending.firstName,
    confirmationUrl,
    locale: locale === "pt-BR" ? "pt-BR" : "en",
  })

  await sendTransactionalEmail({
    to: email,
    subject: emailContent.subject,
    text: emailContent.text,
  })

  return { success: true as const, message: "Confirmation email sent" }
}

export const ensureGoogleUserProvisioned = async (params: {
  uid: string
  email: string
  firstName: string
  lastName?: string
  avatarUrl?: string
  language: UserLanguage
}) => {
  const userSnap = await adminDb.collection(collections.users).doc(params.uid).get()
  if (userSnap.exists) {
    return { isNew: false as const }
  }

  await createUserProfile({
    uid: params.uid,
    email: params.email,
    firstName: params.firstName,
    lastName: params.lastName,
    language: params.language,
    avatarUrl: params.avatarUrl,
    onboardingStatus: "pending",
    onboardingStep: 1,
  })

  const locale = params.language === "pt_BR" ? "pt-BR" : "en"
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.HOST || "http://localhost:3000"

  try {
    const { buildWelcomeEmail } = await import("@/lib/email/email-messages")
    const welcome = buildWelcomeEmail({
      firstName: params.firstName,
      locale,
      appUrl,
    })

    await sendTransactionalEmail({
      to: params.email,
      subject: welcome.subject,
      text: welcome.text,
    })
  } catch (error) {
    console.error("Welcome email failed after Google sign-up:", error)
  }

  return { isNew: true as const }
}
