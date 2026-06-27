import * as XLSX from "xlsx"

import type { CustomerStatus } from "@/lib/types/customer"

export const CUSTOMER_IMPORT_TEMPLATE_FILENAME = "customer-import-template.xls"

export const CUSTOMER_IMPORT_TEMPLATE_SAMPLE: {
    name: string
    phone: string
    email: string
    company: string
    status: CustomerStatus
} = {
    name: "Jane Doe",
    phone: "+1 555 123 4567",
    email: "jane.doe@example.com",
    company: "Acme Corp",
    status: "active",
}

export const downloadCustomerImportTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet([CUSTOMER_IMPORT_TEMPLATE_SAMPLE])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers")
    XLSX.writeFile(workbook, CUSTOMER_IMPORT_TEMPLATE_FILENAME, { bookType: "xls" })
}
