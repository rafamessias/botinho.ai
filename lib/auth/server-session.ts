import { auth } from "@/app/auth"

export type ServerAuthSession = {
  uid: string
  email?: string
}

export const getServerAuthSession = async (): Promise<ServerAuthSession | null> => {
  const session = await auth()

  if (!session?.user?.id || !session.user.email) {
    return null
  }

  return {
    uid: session.user.id,
    email: session.user.email,
  }
}

export const requireServerAuthSession = async (): Promise<ServerAuthSession> => {
  const session = await getServerAuthSession()
  if (!session) {
    throw new Error("Not authenticated")
  }
  return session
}
