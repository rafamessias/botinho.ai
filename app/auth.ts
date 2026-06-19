import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { CredentialsSignin } from "next-auth"
import { cookies } from "next/headers"
import { adminAuth } from "@/lib/firebase/admin"
import { getUserProfile } from "@/lib/firebase/services/user-service"
import { ensureGoogleUserProvisioned } from "@/lib/firebase/auth/signup-flow"

declare module "next-auth" {
  interface Session {
    user?: {
      id: string
      email: string
      name?: string | null
      avatarUrl?: string | null
      language?: string | null
      defaultCompanyId?: string | null
    } | null
    error?: string | null
  }

  interface User {
    avatarUrl?: string | null
    language?: string | null
    defaultCompanyId?: string | null
  }
}

type AppLocale = "en" | "pt-BR"

class InvalidCredentialsError extends CredentialsSignin {
  code = "invalid-credentials"
}

class AccountBlockedError extends CredentialsSignin {
  code = "account-blocked"
}

const normalizeLocale = (value: string | null | undefined): AppLocale =>
  value === "pt_BR" || value === "pt-BR" ? "pt-BR" : "en"

const getRequestLocale = async (): Promise<AppLocale> => {
  const cookieStore = await cookies()
  const userLang = cookieStore.get("user-language")?.value
  if (userLang) return normalizeLocale(userLang)
  return normalizeLocale(cookieStore.get("NEXT_LOCALE")?.value)
}

const signInWithFirebasePassword = async (email: string, password: string) => {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  if (!apiKey) {
    throw new Error("Missing NEXT_PUBLIC_FIREBASE_API_KEY")
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    },
  )

  const data = (await response.json()) as {
    localId?: string
    email?: string
    error?: { message?: string }
  }

  if (!response.ok || !data.localId) {
    const message = data.error?.message ?? "INVALID_LOGIN_CREDENTIALS"
    if (message === "USER_DISABLED") throw new AccountBlockedError()
    throw new InvalidCredentialsError()
  }

  return { uid: data.localId, email: data.email ?? email }
}

const mapProfileToAuthUser = (profile: NonNullable<Awaited<ReturnType<typeof getUserProfile>>>) => ({
  id: profile.uid,
  email: profile.email,
  name: [profile.firstName, profile.lastName].filter(Boolean).join(" "),
  language: profile.language === "pt_BR" ? "pt-BR" : "en",
  avatarUrl: profile.avatarUrl,
  defaultCompanyId: profile.defaultCompanyId ?? null,
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/sign-in",
    error: "/auth/error",
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const { uid } = await signInWithFirebasePassword(
          String(credentials.email).toLowerCase(),
          String(credentials.password),
        )

        const authUser = await adminAuth.getUser(uid)
        if (authUser.disabled) throw new AccountBlockedError()

        const profile = await getUserProfile(uid)
        if (!profile) throw new InvalidCredentialsError()

        return mapProfileToAuthUser(profile)
      },
    }),
    CredentialsProvider({
      id: "otp-session",
      name: "OTP Session",
      credentials: {
        uid: { label: "UID", type: "text" },
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        if (!credentials?.uid || !credentials?.email) return null

        const uid = String(credentials.uid)
        const email = String(credentials.email).toLowerCase()

        const authUser = await adminAuth.getUser(uid)
        if (authUser.disabled || authUser.email?.toLowerCase() !== email) return null

        const profile = await getUserProfile(uid)
        if (!profile) return null

        return mapProfileToAuthUser(profile)
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.uid = user.id
        token.email = user.email
        token.name = user.name
        token.language = (user as { language?: string }).language
        token.avatarUrl = (user as { avatarUrl?: string | null }).avatarUrl
        token.defaultCompanyId = (user as { defaultCompanyId?: string | null }).defaultCompanyId
      }

      if (account?.provider === "google" && token.email) {
        try {
          const locale = await getRequestLocale()
          const language = locale === "pt-BR" ? "pt_BR" : "en"
          const displayParts = (token.name ?? "").split(" ")

          let authUser = await adminAuth.getUserByEmail(token.email).catch(() => null)

          if (!authUser) {
            authUser = await adminAuth.createUser({
              email: token.email,
              displayName: token.name ?? undefined,
              photoURL: (token.picture as string | undefined) ?? undefined,
              emailVerified: true,
            })

            await ensureGoogleUserProvisioned({
              uid: authUser.uid,
              email: token.email,
              firstName: displayParts[0] || "User",
              lastName: displayParts.slice(1).join(" ") || undefined,
              avatarUrl: (token.picture as string | undefined) ?? undefined,
              language,
            })
          } else {
            const profile = await getUserProfile(authUser.uid)
            if (!profile) {
              await ensureGoogleUserProvisioned({
                uid: authUser.uid,
                email: token.email,
                firstName: displayParts[0] || "User",
                lastName: displayParts.slice(1).join(" ") || undefined,
                avatarUrl: (token.picture as string | undefined) ?? undefined,
                language,
              })
            }
          }

          const profile = await getUserProfile(authUser.uid)
          if (profile) {
            token.uid = profile.uid
            token.language = profile.language === "pt_BR" ? "pt-BR" : "en"
            token.avatarUrl = profile.avatarUrl
            token.name = [profile.firstName, profile.lastName].filter(Boolean).join(" ")
            token.defaultCompanyId = profile.defaultCompanyId ?? null
          }

          const cookieStore = await cookies()
          cookieStore.set("user-language", locale, {
            path: "/",
            maxAge: 30 * 24 * 60 * 60,
            sameSite: "lax",
          })
        } catch (error) {
          console.error("Google OAuth user sync failed:", error)
        }
      }

      return token
    },
    async session({ session, token }) {
      if (!token.uid || !token.email) {
        return session
      }

      session.user = {
        id: token.uid as string,
        email: token.email as string,
        name: (token.name as string | undefined) ?? null,
        avatarUrl: (token.avatarUrl as string | null | undefined) ?? null,
        language: (token.language as string | undefined) ?? null,
        defaultCompanyId: (token.defaultCompanyId as string | null | undefined) ?? null,
      } as NonNullable<typeof session.user>

      return session
    },
  },
})
