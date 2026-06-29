import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { pickConnectedSessionTarget } from "../../lib/whatsapp/conversation-session-target"
import type { WhatsAppSession } from "../../lib/whatsapp/types"

const session = (
  sessionId: string,
  status: WhatsAppSession["status"],
  phoneNumber?: string,
): WhatsAppSession => ({
  sessionId,
  companyId: "company-1",
  status,
  phoneNumber,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
})

describe("pickConnectedSessionTarget", () => {
  it("returns null when no connected sessions exist", () => {
    assert.equal(
      pickConnectedSessionTarget([session("sess_a", "needs_qr"), session("sess_b", "disconnected")]),
      null,
    )
  })

  it("returns the only connected session", () => {
    assert.equal(
      pickConnectedSessionTarget([
        session("sess_a", "needs_qr"),
        session("sess_b", "connected", "5511999999999"),
      ]),
      "sess_b",
    )
  })

  it("prefers the requested connected session when available", () => {
    assert.equal(
      pickConnectedSessionTarget(
        [
          session("sess_a", "connected", "5511111111111"),
          session("sess_b", "connected", "5511222222222"),
        ],
        "sess_b",
      ),
      "sess_b",
    )
  })

  it("returns null when multiple connected sessions exist without a preference", () => {
    assert.equal(
      pickConnectedSessionTarget([
        session("sess_a", "connected", "5511111111111"),
        session("sess_b", "connected", "5511222222222"),
      ]),
      null,
    )
  })
})
