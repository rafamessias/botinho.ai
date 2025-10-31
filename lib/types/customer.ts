export type CustomerStatus = "active" | "inactive" | "prospect"

export type Customer = {
    id: string
    name: string
    email: string
    phone?: string
    company?: string
    status: CustomerStatus
    createdAt: string
    updatedAt: string
}

