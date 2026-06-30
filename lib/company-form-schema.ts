import { z } from "zod"

export const companyProfileFieldsSchema = z.object({
    name: z.string().trim().min(2),
    description: z.string().optional(),
    country: z.string().optional(),
    documentType: z.enum(["cpf", "cnpj"]).optional(),
    document: z.string().trim().min(1),
    address: z.string().trim().min(1),
    addressNumber: z.string().optional(),
    zipCode: z.string().optional(),
    complement: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
})

export type CompanyProfileFields = z.infer<typeof companyProfileFieldsSchema>

export const createCompanySettingsSchema = (messages: {
    nameRequired: string
    documentRequired: string
    addressRequired: string
}) =>
    companyProfileFieldsSchema.extend({
        name: z.string().trim().min(2, messages.nameRequired),
        document: z.string().trim().min(1, messages.documentRequired),
        address: z.string().trim().min(1, messages.addressRequired),
    })
