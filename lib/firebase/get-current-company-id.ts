import { getServerAuthSession } from "@/lib/auth/server-session"
import { getUserProfile } from "@/lib/firebase/services/user-service"

export const getCurrentCompanyId = async (): Promise<string | null> => {
  try {
    const session = await getServerAuthSession()
    if (!session?.uid) {
      return null
    }

    const user = await getUserProfile(session.uid)
    return user?.defaultCompanyId ?? null
  } catch (error) {
    console.error("Failed to get company ID:", error)
    return null
  }
}
