"use client"

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithCustomToken,
  type User,
  type UserCredential,
} from "firebase/auth"
import { FirebaseError } from "firebase/app"
import { firebaseAuth } from "@/lib/firebase/client"
import { establishServerSession } from "@/lib/firebase/auth-client"
import { ensureGoogleUserProvisioned } from "@/lib/firebase/auth/signup-flow"
import { postGoogleSignInAction } from "@/components/server-actions/auth"

const createGoogleProvider = () => {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: "select_account" })
  return provider
}

/** Call synchronously from a click handler so the browser opens a popup window. */
export const signInWithGooglePopup = (): Promise<UserCredential> => {
  return signInWithPopup(firebaseAuth, createGoogleProvider())
}

export const provisionGoogleAuthUser = async (user: User, locale: string) => {
  const displayParts = (user.displayName ?? "").split(" ")
  return ensureGoogleUserProvisioned({
    uid: user.uid,
    email: user.email ?? "",
    firstName: displayParts[0] || "User",
    lastName: displayParts.slice(1).join(" ") || undefined,
    avatarUrl: user.photoURL ?? undefined,
    language: locale === "pt-BR" ? "pt_BR" : "en",
  })
}

export const finalizeGoogleAuthFlow = async (user: User, locale: string) => {
  try {
    await provisionGoogleAuthUser(user, locale)
  } catch (error) {
    console.error("Google user provisioning failed:", error)
    const message =
      error instanceof Error ? error.message : "Failed to set up your account profile"
    return { success: false as const, error: message, needsCheckout: false, checkoutUrl: null }
  }

  if (!user.email) {
    return { success: true as const, needsCheckout: false, checkoutUrl: null }
  }

  try {
    return await postGoogleSignInAction(user.email)
  } catch (error) {
    console.error("Google post-sign-in validation failed:", error)
    const message =
      error instanceof Error ? error.message : "Failed to validate account setup"
    return { success: false as const, error: message, needsCheckout: false, checkoutUrl: null }
  }
}

export const signInWithEmail = async (email: string, password: string) => {
  const credential = await signInWithEmailAndPassword(firebaseAuth, email, password)
  await establishServerSession()
  return credential.user
}

export const completeGoogleSignIn = async (credential: UserCredential) => {
  await establishServerSession()
  return credential.user
}

export const isGoogleAuthUserCancelledError = (error: unknown) =>
  error instanceof FirebaseError && error.code === "auth/popup-closed-by-user"

export const isGoogleAuthPopupBlockedError = (error: unknown) =>
  error instanceof FirebaseError && error.code === "auth/popup-blocked"

export const signInWithCustomTokenClient = async (customToken: string) => {
  const credential = await signInWithCustomToken(firebaseAuth, customToken)
  await establishServerSession()
  return credential.user
}
