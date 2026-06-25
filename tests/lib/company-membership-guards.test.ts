const { describe, it } = require("node:test")
const assert = require("node:assert/strict")

const {
  hasMembershipOutsideCompany,
  SINGLE_COMPANY_MEMBERSHIP_ERROR,
  SingleCompanyMembershipError,
} = require("../../lib/company-membership-guards.ts")

describe("hasMembershipOutsideCompany", () => {
  it("detects membership on another company", () => {
    assert.equal(
      hasMembershipOutsideCompany(
        [
          { companyId: "company-a", status: "accepted", isOwner: false },
          { companyId: "company-b", status: "invited", isOwner: false },
        ],
        "target-company",
      ),
      true,
    )
  })

  it("allows membership only on target company", () => {
    assert.equal(
      hasMembershipOutsideCompany(
        [{ companyId: "target-company", status: "invited", isOwner: false }],
        "target-company",
      ),
      false,
    )
  })

  it("ignores rejected memberships", () => {
    assert.equal(
      hasMembershipOutsideCompany(
        [{ companyId: "other-company", status: "rejected", isOwner: false }],
        "target-company",
      ),
      false,
    )
  })
})

describe("SingleCompanyMembershipError", () => {
  it("uses stable error code", () => {
    const error = new SingleCompanyMembershipError()
    assert.equal(error.message, SINGLE_COMPANY_MEMBERSHIP_ERROR)
  })
})
