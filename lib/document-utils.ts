export type CompanyCountryOption = "Brasil" | "United States" | "Other"

export type CompanyDocumentType = "cpf" | "cnpj"

export type DocumentCountryMode = "brazil" | "us" | "other"

const COUNTRY_DOCUMENT_MODE: Record<CompanyCountryOption, DocumentCountryMode> = {
    Brasil: "brazil",
    "United States": "us",
    Other: "other",
}

export const normalizeCompanyCountry = (country: string | undefined | null): CompanyCountryOption | string => {
    if (!country || country === "Portugal") return "Other"
    return country
}

export const getDocumentCountryMode = (country: string | undefined | null): DocumentCountryMode => {
    const normalized = normalizeCompanyCountry(country)
    if (!normalized) return "other"
    return COUNTRY_DOCUMENT_MODE[normalized as CompanyCountryOption] ?? "other"
}

export const extractDocumentDigits = (value: string): string => value.replace(/\D/g, "")

export const formatCpf = (digits: string): string => {
    const d = digits.slice(0, 11)
    if (d.length <= 3) return d
    if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
    if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

export const formatCnpj = (digits: string): string => {
    const d = digits.slice(0, 14)
    if (d.length <= 2) return d
    if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`
    if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`
    if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`
}

export const formatEin = (digits: string): string => {
    const d = digits.slice(0, 9)
    if (d.length <= 2) return d
    return `${d.slice(0, 2)}-${d.slice(2)}`
}

export const formatCompanyDocumentForDisplay = (
    value: string,
    country: string | undefined | null,
    documentType: CompanyDocumentType = "cnpj",
): string => {
    const mode = getDocumentCountryMode(country)
    if (!value) return ""

    if (mode === "brazil") {
        const digits = extractDocumentDigits(value)
        return documentType === "cpf" ? formatCpf(digits) : formatCnpj(digits)
    }

    if (mode === "us") {
        return formatEin(extractDocumentDigits(value))
    }

    return value
}

export const normalizeStoredDocument = (
    value: string,
    country: string | undefined | null,
): string => {
    const mode = getDocumentCountryMode(country)
    const trimmed = value.trim()

    if (!trimmed) return ""

    if (mode === "brazil" || mode === "us") {
        return extractDocumentDigits(trimmed)
    }

    return trimmed.replace(/\s+/g, "")
}

export const getCompanyDocumentMaxLength = (
    country: string | undefined | null,
    documentType: CompanyDocumentType = "cnpj",
): number | undefined => {
    const mode = getDocumentCountryMode(country)

    if (mode === "brazil") {
        return documentType === "cpf" ? 14 : 18
    }

    if (mode === "us") {
        return 10
    }

    return undefined
}

export const COMPANY_COUNTRY_ISO: Partial<Record<CompanyCountryOption, string>> = {
    Brasil: "br",
    "United States": "us",
}

export const getCompanyCountryIso = (country: string | undefined | null): string | undefined => {
    const normalized = normalizeCompanyCountry(country)
    if (!normalized) return undefined
    return COMPANY_COUNTRY_ISO[normalized as CompanyCountryOption]
}
