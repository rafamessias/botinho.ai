import { loadActiveMemberships } from "@/lib/user-workspace"
import {
  assertNoMembershipOutsideCompany,
  hasMembershipOutsideCompany,
  SingleCompanyMembershipError,
} from "@/lib/company-membership-guards"

export { SingleCompanyMembershipError, SINGLE_COMPANY_MEMBERSHIP_ERROR } from "@/lib/company-membership-guards"
export { hasMembershipOutsideCompany } from "@/lib/company-membership-guards"

export const assertSingleCompanyMembership = async (
  uid: string,
  targetCompanyId: string,
): Promise<void> => {
  const memberships = await loadActiveMemberships(uid)
  assertNoMembershipOutsideCompany(memberships, targetCompanyId)
}

export const userHasActiveCompanyMembership = async (uid: string): Promise<boolean> => {
  const memberships = await loadActiveMemberships(uid)
  return memberships.length > 0
}
