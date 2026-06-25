import type { MemberStatus } from "@/lib/firebase/types"

export const isActiveMemberStatus = (status: MemberStatus): boolean =>
  status === "invited" || status === "accepted"
