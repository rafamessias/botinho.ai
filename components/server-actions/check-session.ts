import { getServerAuthSession } from "@/lib/auth/server-session"

export const checkSession = async (): Promise<string> => {
    const session = await getServerAuthSession()
    if (!session?.email) throw new Error("not-authenticated")

    return session.email
}
