const { describe, it } = require("node:test")
const assert = require("node:assert/strict")

const { resolveActiveCompanyIdForUser } = require("../../lib/user-workspace-resolution.ts")

describe("resolveActiveCompanyIdForUser", () => {
  const memberships = [
    {
      companyId: "company-owned",
      uid: "user-1",
      status: "accepted",
      isOwner: true,
      isAdmin: true,
      canPost: true,
      canApprove: true,
    },
    {
      companyId: "company-other",
      uid: "user-1",
      status: "accepted",
      isOwner: false,
      isAdmin: false,
      canPost: true,
      canApprove: false,
    },
  ]

  it("returns null when there are no accepted memberships", () => {
    assert.equal(resolveActiveCompanyIdForUser({ defaultCompanyId: "x" }, []), null)
  })

  it("prefers valid defaultCompanyId", () => {
    assert.equal(
      resolveActiveCompanyIdForUser({ defaultCompanyId: "company-other" }, memberships),
      "company-other",
    )
  })

  it("falls back to owned company when defaultCompanyId is invalid", () => {
    assert.equal(
      resolveActiveCompanyIdForUser({ defaultCompanyId: "missing" }, memberships),
      "company-owned",
    )
  })

  it("falls back to first accepted membership when no owner exists", () => {
    const guestMemberships = memberships.map((membership) => ({
      ...membership,
      isOwner: false,
    }))

    assert.equal(
      resolveActiveCompanyIdForUser({ defaultCompanyId: null }, guestMemberships),
      "company-owned",
    )
  })
})
