export const pickMessages = <T extends Record<string, unknown>>(
  messages: T,
  keys: (keyof T)[],
): Partial<T> =>
  Object.fromEntries(
    keys.filter((key) => key in messages).map((key) => [key, messages[key]]),
  ) as Partial<T>

export const MARKETING_MESSAGE_NAMESPACES = [
  "Landing",
  "Legal",
  "Pricing",
  "Common",
  "PublicSurvey",
] as const

export const AUTH_MESSAGE_NAMESPACES = [
  "Common",
  "Settings",
  "SignInForm",
  "SignUpForm",
  "CheckEmailPage",
  "ConfirmEmailPage",
  "OTPPage",
  "OTPForm",
  "ResetPasswordForm",
  "ResetPasswordConfirmForm",
  "AuthErrors",
] as const
