import { updateUserProfile, getUserProfile } from "@/lib/firebase/services/user-service"
import { resolveActiveCompanyId } from "@/lib/user-workspace"

/** Recompute and persist defaultCompanyId from current memberships. */
export const syncUserWorkspace = async (
  uid: string,
): Promise<{ defaultCompanyId: string | null }> => {
  const user = await getUserProfile(uid)
  if (!user) {
    return { defaultCompanyId: null }
  }

  const resolved = await resolveActiveCompanyId(uid)
  if (resolved !== (user.defaultCompanyId ?? null)) {
    await updateUserProfile(uid, { defaultCompanyId: resolved ?? undefined })
  }

  return { defaultCompanyId: resolved }
}
