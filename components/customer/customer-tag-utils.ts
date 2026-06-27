import type { Customer } from "@/lib/types/customer"

export const collectCustomerTags = (customers: Customer[]) => {
    const tagMap = new Map<string, string>()

    for (const customer of customers) {
        for (const tag of customer.tags ?? []) {
            const normalized = tag.trim().toLowerCase()
            if (!normalized || tagMap.has(normalized)) {
                continue
            }

            tagMap.set(normalized, tag.trim())
        }
    }

    return Array.from(tagMap.values()).sort((left, right) => left.localeCompare(right))
}

export const customerMatchesTagFilter = (customer: Customer, selectedTags: string[]) => {
    if (selectedTags.length === 0) {
        return true
    }

    const customerTags = new Set((customer.tags ?? []).map((tag) => tag.toLowerCase()))
    return selectedTags.some((tag) => customerTags.has(tag.toLowerCase()))
}
