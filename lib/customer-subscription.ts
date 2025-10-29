import { prisma } from "@/prisma/lib/prisma"
import { z } from "zod"
import { BillingInterval, SubscriptionStatus } from "@/lib/generated/prisma"

// Validation schemas
const createCustomerSubscriptionSchema = z.object({
    companyId: z.number().int().positive("Company ID must be a positive integer"),
    planId: z.string().min(1, "Plan ID is required"),
    status: z.nativeEnum(SubscriptionStatus).optional(),
    stripeCustomerId: z.string().optional(),
    stripeSubscriptionId: z.string().optional(),
    currentPeriodStart: z.date().optional(),
    currentPeriodEnd: z.date().optional(),
    cancelAtPeriodEnd: z.boolean().default(false),
    trialStart: z.date().optional(),
    trialEnd: z.date().optional(),
    billingInterval: z.nativeEnum(BillingInterval).optional(),
})

const updateCustomerSubscriptionSchema = z.object({
    id: z.string().min(1, "Subscription ID is required"),
    planId: z.string().optional(),
    status: z.nativeEnum(SubscriptionStatus).optional(),
    stripeCustomerId: z.string().optional(),
    stripeSubscriptionId: z.string().optional(),
    currentPeriodStart: z.date().optional(),
    currentPeriodEnd: z.date().optional(),
    cancelAtPeriodEnd: z.boolean().optional(),
    trialStart: z.date().optional(),
    trialEnd: z.date().optional(),
    billingInterval: z.nativeEnum(BillingInterval).optional(),
})

const getCustomerSubscriptionSchema = z.object({
    companyId: z.number().int().positive("Company ID must be a positive integer"),
})

const deleteCustomerSubscriptionSchema = z.object({
    id: z.string().min(1, "Subscription ID is required"),
})

// Types for the library functions
export type CreateCustomerSubscriptionInput = z.infer<typeof createCustomerSubscriptionSchema>
export type UpdateCustomerSubscriptionInput = z.infer<typeof updateCustomerSubscriptionSchema>
export type GetCustomerSubscriptionInput = z.infer<typeof getCustomerSubscriptionSchema>
export type DeleteCustomerSubscriptionInput = z.infer<typeof deleteCustomerSubscriptionSchema>

export interface CustomerSubscriptionResult {
    success: boolean
    message?: string
    data?: any
    error?: string
}

/**
 * Create a new customer subscription
 * @param data - Subscription creation data
 * @returns Promise<CustomerSubscriptionResult>
 */
export const createCustomerSubscription = async (data: CreateCustomerSubscriptionInput): Promise<CustomerSubscriptionResult> => {
    try {
        console.log("Creating customer subscription")
        // Validate input data
        const validatedData = createCustomerSubscriptionSchema.parse(data)

        // Check if company already has an active or trialing subscription
        const existingActiveSubscription = await prisma.customerSubscription.findFirst({
            where: {
                companyId: validatedData.companyId,
                status: {
                    in: [SubscriptionStatus.active, SubscriptionStatus.trialing]
                }
            }
        })

        if (existingActiveSubscription) {
            return {
                success: false,
                error: "Company already has an active subscription"
            }
        }

        // Verify the plan exists and is active
        const plan = await prisma.subscriptionPlan.findFirst({
            where: {
                id: validatedData.planId,
                isActive: true
            }
        })

        if (!plan) {
            return {
                success: false,
                error: "Subscription plan not found or inactive"
            }
        }

        // Create the subscription
        const subscription = await prisma.customerSubscription.create({
            data: {
                companyId: validatedData.companyId,
                planId: validatedData.planId,
                stripeCustomerId: validatedData.stripeCustomerId,
                stripeSubscriptionId: validatedData.stripeSubscriptionId,
                currentPeriodStart: validatedData.currentPeriodStart,
                currentPeriodEnd: validatedData.currentPeriodEnd,
                cancelAtPeriodEnd: validatedData.cancelAtPeriodEnd,
                trialStart: validatedData.trialStart,
                trialEnd: validatedData.trialEnd,
                status: validatedData.status || SubscriptionStatus.active,
                billingInterval: validatedData.billingInterval || BillingInterval.monthly
            },
            include: {
                plan: true,
                company: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        return {
            success: true,
            message: "Customer subscription created successfully",
            data: subscription
        }
    } catch (error) {
        console.error("Error creating customer subscription:", error)

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.errors.map(e => e.message).join(", ")
            }
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        }
    }
}

/**
 * Update an existing customer subscription
 * @param data - Subscription update data
 * @returns Promise<CustomerSubscriptionResult>
 */
export const updateCustomerSubscription = async (data: UpdateCustomerSubscriptionInput): Promise<CustomerSubscriptionResult> => {
    try {
        // Validate input data
        const validatedData = updateCustomerSubscriptionSchema.parse(data)

        // Check if subscription exists
        const existingSubscription = await prisma.customerSubscription.findUnique({
            where: {
                id: validatedData.id
            },
            include: {
                plan: true
            }
        })

        if (!existingSubscription) {
            return {
                success: false,
                error: "Subscription not found"
            }
        }

        // If planId is being updated, verify the new plan exists and is active
        if (validatedData.planId && validatedData.planId !== existingSubscription.planId) {
            const plan = await prisma.subscriptionPlan.findFirst({
                where: {
                    id: validatedData.planId,
                    isActive: true
                }
            })

            if (!plan) {
                return {
                    success: false,
                    error: "New subscription plan not found or inactive"
                }
            }
        }

        // Prepare update data (exclude undefined values)
        const updateData: any = {}
        Object.keys(validatedData).forEach(key => {
            if (key !== 'id' && validatedData[key as keyof typeof validatedData] !== undefined) {
                updateData[key] = validatedData[key as keyof typeof validatedData]
            }
        })

        // Update the subscription
        const subscription = await prisma.customerSubscription.update({
            where: {
                id: validatedData.id
            },
            data: updateData,
            include: {
                plan: true,
                company: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        return {
            success: true,
            message: "Customer subscription updated successfully",
            data: subscription
        }
    } catch (error) {
        console.error("Error updating customer subscription:", error)

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.errors.map(e => e.message).join(", ")
            }
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        }
    }
}

/**
 * Get customer subscription by team ID
 * @param data - Get subscription data
 * @returns Promise<CustomerSubscriptionResult>
 */
export const getCustomerSubscription = async (data: GetCustomerSubscriptionInput): Promise<CustomerSubscriptionResult> => {
    try {
        // Validate input data
        const validatedData = getCustomerSubscriptionSchema.parse(data)

        // Get the subscription
        const subscription = await prisma.customerSubscription.findFirst({
            where: {
                companyId: validatedData.companyId,
                status: {
                    in: [SubscriptionStatus.active, SubscriptionStatus.trialing]
                }
            },
            include: {
                plan: true,
                team: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                usageTracking: {
                    orderBy: {
                        lastUpdated: 'desc'
                    },
                    take: 10
                }
            }
        })

        return {
            success: true,
            data: subscription
        }
    } catch (error) {
        console.error("Error getting customer subscription:", error)

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.errors.map(e => e.message).join(", ")
            }
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        }
    }
}

/**
 * Delete a customer subscription
 * @param data - Delete subscription data
 * @returns Promise<CustomerSubscriptionResult>
 */
export const deleteCustomerSubscription = async (data: DeleteCustomerSubscriptionInput): Promise<CustomerSubscriptionResult> => {
    try {
        // Validate input data
        const validatedData = deleteCustomerSubscriptionSchema.parse(data)

        // Check if subscription exists
        const existingSubscription = await prisma.customerSubscription.findFirst({
            where: {
                id: validatedData.id
            }
        })

        if (!existingSubscription) {
            return {
                success: false,
                error: "Subscription not found"
            }
        }

        // Delete the subscription
        await prisma.customerSubscription.delete({
            where: {
                id: validatedData.id
            }
        })

        return {
            success: true,
            message: "Customer subscription deleted successfully"
        }
    } catch (error) {
        console.error("Error deleting customer subscription:", error)

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.errors.map(e => e.message).join(", ")
            }
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        }
    }
}

/**
 * Cancel a customer subscription (set cancelAtPeriodEnd to true)
 * @param data - Cancel subscription data
 * @returns Promise<CustomerSubscriptionResult>
 */
export const cancelCustomerSubscription = async (data: DeleteCustomerSubscriptionInput): Promise<CustomerSubscriptionResult> => {
    try {
        // Validate input data
        const validatedData = deleteCustomerSubscriptionSchema.parse(data)

        // Check if subscription exists
        const existingSubscription = await prisma.customerSubscription.findFirst({
            where: {
                id: validatedData.id
            }
        })

        if (!existingSubscription) {
            return {
                success: false,
                error: "Subscription not found"
            }
        }

        // Cancel the subscription
        const subscription = await prisma.customerSubscription.update({
            where: {
                id: validatedData.id
            },
            data: {
                cancelAtPeriodEnd: true
            },
            include: {
                plan: true,
                company: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        return {
            success: true,
            message: "Customer subscription canceled successfully",
            data: subscription
        }
    } catch (error) {
        console.error("Error canceling customer subscription:", error)

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.errors.map(e => e.message).join(", ")
            }
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        }
    }
}

/**
 * Reactivate a canceled customer subscription
 * @param data - Reactivate subscription data
 * @returns Promise<CustomerSubscriptionResult>
 */
export const reactivateCustomerSubscription = async (data: DeleteCustomerSubscriptionInput): Promise<CustomerSubscriptionResult> => {
    try {
        // Validate input data
        const validatedData = deleteCustomerSubscriptionSchema.parse(data)

        // Check if subscription exists
        const existingSubscription = await prisma.customerSubscription.findFirst({
            where: {
                id: validatedData.id
            }
        })

        if (!existingSubscription) {
            return {
                success: false,
                error: "Subscription not found"
            }
        }

        // Reactivate the subscription
        const subscription = await prisma.customerSubscription.update({
            where: {
                id: validatedData.id
            },
            data: {
                cancelAtPeriodEnd: false
            },
            include: {
                plan: true,
                company: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        return {
            success: true,
            message: "Customer subscription reactivated successfully",
            data: subscription
        }
    } catch (error) {
        console.error("Error reactivating customer subscription:", error)

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.errors.map(e => e.message).join(", ")
            }
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        }
    }
}

/**
 * Get all customer subscriptions with optional filtering
 * @param filters - Optional filters for the query
 * @returns Promise<CustomerSubscriptionResult>
 */
export const getAllCustomerSubscriptions = async (filters?: {
    status?: SubscriptionStatus
    planId?: string
    companyId?: number
}): Promise<CustomerSubscriptionResult> => {
    try {
        const whereClause: any = {}

        if (filters?.status) {
            whereClause.status = filters.status
        }

        if (filters?.planId) {
            whereClause.planId = filters.planId
        }

        if (filters?.companyId) {
            whereClause.companyId = filters.companyId
        }

        const subscriptions = await prisma.customerSubscription.findMany({
            where: whereClause,
            include: {
                plan: true,
                company: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return {
            success: true,
            data: subscriptions
        }
    } catch (error) {
        console.error("Error getting all customer subscriptions:", error)

        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        }
    }
}

/**
 * Update subscription status (useful for Stripe webhooks)
 * @param subscriptionId - Stripe subscription ID
 * @param status - New subscription status
 * @param currentPeriodStart - Current period start date
 * @param currentPeriodEnd - Current period end date
 * @returns Promise<CustomerSubscriptionResult>
 */
export const updateSubscriptionStatus = async (
    subscriptionId: string,
    status: SubscriptionStatus,
    currentPeriodStart?: Date,
    currentPeriodEnd?: Date
): Promise<CustomerSubscriptionResult> => {
    try {
        const subscription = await prisma.customerSubscription.findFirst({
            where: {
                stripeSubscriptionId: subscriptionId
            }
        })

        if (!subscription) {
            return {
                success: false,
                error: "Subscription not found"
            }
        }

        const updateData: any = { status }

        if (currentPeriodStart) {
            updateData.currentPeriodStart = currentPeriodStart
        }

        if (currentPeriodEnd) {
            updateData.currentPeriodEnd = currentPeriodEnd
        }

        const updatedSubscription = await prisma.customerSubscription.update({
            where: {
                id: subscription.id
            },
            data: updateData,
            include: {
                plan: true,
                company: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        return {
            success: true,
            message: "Subscription status updated successfully",
            data: updatedSubscription
        }
    } catch (error) {
        console.error("Error updating subscription status:", error)

        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        }
    }
}
