import { resolveActiveCompanyId } from "@/lib/user-workspace"

export const getCurrentCompanyId = async (): Promise<string | null> => {
  try {
    const { getServerAuthSession } = await import("@/lib/auth/server-session")
    const session = await getServerAuthSession()
    if (!session?.uid) {
      return null
    }

    return resolveActiveCompanyId(session.uid)
  } catch (error) {
    console.error("Failed to get company ID:", error)
    return null
  }
}
