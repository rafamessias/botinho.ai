export const FIREBASE_SESSION_COOKIE = "__session"

/** Firebase session cookies allow 5 minutes to 14 days (inclusive). */
export const SESSION_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE_MS / 1000,
}
