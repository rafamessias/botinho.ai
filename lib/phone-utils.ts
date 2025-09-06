/**
 * Phone number formatting utilities
 */

export type CountryCode = 'BR' | 'US'

export interface Country {
    code: CountryCode
    name: string
    flag: string
    dialCode: string
    format: (digits: string) => string
    placeholder: string
    maxLength: number
}

export const countries: Country[] = [
    {
        code: 'BR',
        name: 'Brazil',
        flag: '🇧🇷',
        dialCode: '+55',
        format: (digits: string) => {
            if (digits.length <= 2) {
                return `(${digits}`
            } else if (digits.length <= 7) {
                return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
            } else if (digits.length <= 11) {
                return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
            } else {
                return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
            }
        },
        placeholder: '(11) 99999-9999',
        maxLength: 15
    },
    {
        code: 'US',
        name: 'USA',
        flag: '🇺🇸',
        dialCode: '+1',
        format: (digits: string) => {
            if (digits.length <= 3) {
                return `(${digits}`
            } else if (digits.length <= 6) {
                return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
            } else {
                return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
            }
        },
        placeholder: '(555) 123-4567',
        maxLength: 14
    }
]

/**
 * Formats a phone number based on country
 * @param value - The phone number string to format
 * @param countryCode - The country code to use for formatting
 * @returns Formatted phone number string
 */
export const formatPhoneNumber = (value: string, countryCode: CountryCode = 'BR'): string => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')

    // Return empty string if no digits
    if (digits.length === 0) {
        return ''
    }

    const country = countries.find(c => c.code === countryCode)
    if (!country) {
        return digits
    }

    return country.format(digits)
}

/**
 * Extracts only digits from a formatted phone number
 * @param value - The formatted phone number string
 * @returns String containing only digits
 */
export const extractPhoneDigits = (value: string): string => {
    return value.replace(/\D/g, '')
}

/**
 * Validates if a phone number has the minimum required digits
 * @param value - The phone number string to validate
 * @param minLength - Minimum number of digits required (default: 10)
 * @returns True if the phone number has enough digits
 */
export const isValidPhoneLength = (value: string, minLength: number = 10): boolean => {
    const digits = extractPhoneDigits(value)
    return digits.length >= minLength
}

/**
 * Parses an international phone number and extracts country code and local number
 * @param internationalNumber - The international phone number (e.g., "+5511999999999")
 * @returns Object with country code and local number, or null if parsing fails
 */
export const parseInternationalNumber = (internationalNumber: string): { countryCode: CountryCode; localNumber: string } | null => {
    if (!internationalNumber) return null

    // Remove all non-digits except the leading +
    const cleanNumber = internationalNumber.replace(/[^\d+]/g, '')

    // Must start with +
    if (!cleanNumber.startsWith('+')) return null

    // Remove the + and get digits only
    const digits = cleanNumber.slice(1)

    // Try to match with known countries
    for (const country of countries) {
        const dialCodeDigits = country.dialCode.slice(1) // Remove + from dial code

        if (digits.startsWith(dialCodeDigits)) {
            const localNumber = digits.slice(dialCodeDigits.length)
            return {
                countryCode: country.code,
                localNumber: localNumber
            }
        }
    }

    return null
}

/**
 * Builds a complete international phone number from country and local number
 * @param countryCode - The country code
 * @param localNumber - The local phone number (digits only)
 * @returns Complete international number with + prefix
 */
export const buildInternationalNumber = (countryCode: CountryCode, localNumber: string): string => {
    const country = countries.find(c => c.code === countryCode)
    if (!country) return localNumber

    const cleanLocalNumber = localNumber.replace(/\D/g, '')
    return `${country.dialCode}${cleanLocalNumber}`
}

/**
 * Gets the dial code for a country
 * @param countryCode - The country code
 * @returns The dial code with + prefix
 */
export const getDialCode = (countryCode: CountryCode): string => {
    const country = countries.find(c => c.code === countryCode)
    return country?.dialCode || '+1'
}
