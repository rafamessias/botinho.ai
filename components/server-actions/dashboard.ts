"use server"

import { BaseActionResponse, handleAction, resolveCompanyContext } from "./utils"
import { getDashboardMetrics, type DashboardMetrics } from "@/lib/firebase/services/dashboard-service"

export const getDashboardMetricsAction = async (): Promise<BaseActionResponse<DashboardMetrics>> =>
  handleAction(async () => {
    const { companyId } = await resolveCompanyContext()
    const metrics = await getDashboardMetrics(companyId)
    return { success: true, data: metrics }
  })
