import { describe, it } from "node:test"
import assert from "node:assert/strict"
import {
    extractDocumentDigits,
    formatCnpj,
    formatCompanyDocumentForDisplay,
    formatCpf,
    formatEin,
    getDocumentCountryMode,
    normalizeStoredDocument,
} from "../../lib/document-utils"

describe("document-utils", () => {
    it("formats CPF and CNPJ for display", () => {
        assert.equal(formatCpf("12345678901"), "123.456.789-01")
        assert.equal(formatCnpj("12345678000195"), "12.345.678/0001-95")
    })

    it("formats EIN for US companies", () => {
        assert.equal(formatEin("123456789"), "12-3456789")
    })

    it("stores Brazil and US documents as digits only", () => {
        assert.equal(normalizeStoredDocument("123.456.789-01", "Brasil"), "12345678901")
        assert.equal(normalizeStoredDocument("12-3456789", "United States"), "123456789")
    })

    it("stores other country documents without masking characters", () => {
        assert.equal(normalizeStoredDocument("PT 123 456 789", "Other"), "PT123456789")
    })

    it("formats by country and document type", () => {
        assert.equal(
            formatCompanyDocumentForDisplay("12345678901", "Brasil", "cpf"),
            "123.456.789-01",
        )
        assert.equal(
            formatCompanyDocumentForDisplay("123456789", "United States", "cnpj"),
            "12-3456789",
        )
        assert.equal(
            formatCompanyDocumentForDisplay("PT123456789", "Other", "cnpj"),
            "PT123456789",
        )
    })

    it("resolves country document modes", () => {
        assert.equal(getDocumentCountryMode("Brasil"), "brazil")
        assert.equal(getDocumentCountryMode("United States"), "us")
        assert.equal(getDocumentCountryMode("Other"), "other")
        assert.equal(getDocumentCountryMode("Portugal"), "other")
    })

    it("extracts digits from formatted values", () => {
        assert.equal(extractDocumentDigits("12.345.678/0001-95"), "12345678000195")
    })
})
