export type CustomerStatus = "active" | "inactive" | "prospect"

export type CustomerImportMergeStrategy = "skip" | "merge" | "overwrite"

export type Customer = {
    id: string
    name: string
    email?: string
    phone: string
    company?: string
    description?: string
    tags: string[]
    status: CustomerStatus
    createdAt: string
    updatedAt: string
}

