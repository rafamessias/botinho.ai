import { isActiveMemberStatus } from "@/lib/member-status"
import type { UserMembershipSummary } from "@/lib/user-workspace-resolution"

export const SINGLE_COMPANY_MEMBERSHIP_ERROR = "INVITE_COMPANY_USER_CONFLICT"

export class SingleCompanyMembershipError extends Error {
  constructor() {
    super(SINGLE_COMPANY_MEMBERSHIP_ERROR)
    this.name = "SingleCompanyMembershipError"
  }
}

/** Pure: membership exists on a company other than the invite target. */
export const hasMembershipOutsideCompany = (
  memberships: UserMembershipSummary[],
  targetCompanyId: string,
): boolean =>
  memberships.some(
    (membership) =>
      membership.companyId !== targetCompanyId && isActiveMemberStatus(membership.status),
  )

export const assertNoMembershipOutsideCompany = (
  memberships: UserMembershipSummary[],
  targetCompanyId: string,
): void => {
  if (hasMembershipOutsideCompany(memberships, targetCompanyId)) {
    throw new SingleCompanyMembershipError()
  }
}
