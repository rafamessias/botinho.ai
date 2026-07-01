import test from "node:test"
import assert from "node:assert/strict"
import {
  onboardingStepToPath,
  resolveOnboardingStatus,
  resolveOnboardingStep,
} from "../../lib/onboarding/onboarding-utils"

test("resolveOnboardingStatus treats legacy users with company as completed", () => {
  assert.equal(
    resolveOnboardingStatus({ onboardingStatus: undefined, defaultCompanyId: "company-1" }),
    "completed",
  )
})

test("resolveOnboardingStatus respects explicit pending", () => {
  assert.equal(resolveOnboardingStatus({ onboardingStatus: "pending", defaultCompanyId: "company-1" }), "pending")
})

test("resolveOnboardingStep defaults to company step without company", () => {
  assert.equal(resolveOnboardingStep({ onboardingStep: undefined, defaultCompanyId: undefined }), 1)
})

test("onboardingStepToPath maps steps to routes", () => {
  assert.equal(onboardingStepToPath(1), "/onboarding/company")
  assert.equal(onboardingStepToPath(4), "/onboarding/plan")
})
