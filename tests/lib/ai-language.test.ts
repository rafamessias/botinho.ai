import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { detectLanguage, resolveResponseLanguage } from "../../lib/firebase/ai/language"

describe("detectLanguage", () => {
  it("detects Portuguese from common greetings", () => {
    assert.equal(detectLanguage("Olá, tudo bem?"), "pt-BR")
    assert.equal(detectLanguage("oi"), "pt-BR")
  })

  it("detects Portuguese from accented characters", () => {
    assert.equal(detectLanguage("Joòa bot fala com você"), "pt-BR")
  })

  it("defaults short English messages to English", () => {
    assert.equal(detectLanguage("hi"), "en")
    assert.equal(detectLanguage("hello there"), "en")
  })
})

describe("resolveResponseLanguage", () => {
  it("uses the agent preference when set", () => {
    assert.equal(
      resolveResponseLanguage({
        agentLanguage: "pt-BR",
        customerMessage: "hello",
      }),
      "pt-BR",
    )
  })

  it("uses the agent prompt when preference is auto", () => {
    assert.equal(
      resolveResponseLanguage({
        agentLanguage: "auto",
        customerMessage: "hi",
        agentSystemPrompt: "Você é o Joòa bot. Responda sempre em português do Brasil.",
      }),
      "pt-BR",
    )
  })
})
