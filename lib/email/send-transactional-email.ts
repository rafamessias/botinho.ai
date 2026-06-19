type SendEmailParams = {
  to: string
  subject: string
  text: string
  html?: string
}

export const sendTransactionalEmail = async ({ to, subject, text, html }: SendEmailParams) => {
  if (process.env.NODE_ENV === "development") {
    console.info("[email:dev-fallback]", { to, subject, text, html })
    return { success: true as const, devFallback: true }
  }

  console.warn("[email] No messaging provider configured; email not sent:", { to, subject })
  return { success: false as const, devFallback: false }
}
