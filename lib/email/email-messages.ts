type Locale = "en" | "pt-BR"

const appName = "botinho.ai"

export const buildWelcomeEmail = (params: {
  firstName: string
  locale: Locale
  appUrl: string
}) => {
  const isPt = params.locale === "pt-BR"
  return {
    subject: isPt ? `Bem-vindo ao ${appName}` : `Welcome to ${appName}`,
    text: isPt
      ? `Olá ${params.firstName},\n\nBem-vindo ao ${appName}! Acesse: ${params.appUrl}`
      : `Hi ${params.firstName},\n\nWelcome to ${appName}! Get started: ${params.appUrl}`,
  }
}

export const buildEmailConfirmationEmail = (params: {
  firstName: string
  confirmationUrl: string
  locale: Locale
}) => {
  const isPt = params.locale === "pt-BR"
  return {
    subject: isPt ? "Confirme seu email" : "Confirm your email",
    text: isPt
      ? `Olá ${params.firstName},\n\nConfirme seu email: ${params.confirmationUrl}`
      : `Hi ${params.firstName},\n\nConfirm your email: ${params.confirmationUrl}`,
  }
}

export const buildCompanyInviteEmail = (params: {
  firstName: string
  companyName: string
  inviterEmail: string
  invitationUrl: string
  locale: Locale
  temporaryPassword?: string
}) => {
  const isPt = params.locale === "pt-BR"
  const passwordLine = params.temporaryPassword
    ? isPt
      ? `\n\nSenha temporária: ${params.temporaryPassword}`
      : `\n\nTemporary password: ${params.temporaryPassword}`
    : ""

  return {
    subject: isPt
      ? `Convite para ${params.companyName} no ${appName}`
      : `Invitation to join ${params.companyName} on ${appName}`,
    text: isPt
      ? `Olá ${params.firstName},\n\n${params.inviterEmail} convidou você para ${params.companyName}.\n\nAceite o convite: ${params.invitationUrl}${passwordLine}`
      : `Hi ${params.firstName},\n\n${params.inviterEmail} invited you to ${params.companyName}.\n\nAccept the invitation: ${params.invitationUrl}${passwordLine}`,
  }
}
