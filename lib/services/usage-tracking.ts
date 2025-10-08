import { prisma } from '@/prisma/lib/prisma';
import { UsageMetricType } from '@/lib/generated/prisma';
import { UsageTrackingUpdate } from '@/lib/types/subscription';

/**
 * Update usage tracking for a team in current period
 * This function is designed to be called within a database transaction
 */
export const updateUsageTracking = async (teamId: number, subscriptionId: string): Promise<void> => {
    try {
        // Get current usage tracking record
        const usageTracking = await prisma.usageTracking.findFirst({
            where: {
                teamId,
                subscriptionId,
                metricType: UsageMetricType.TOTAL_COMPLETED_RESPONSES,
                periodStart: {
                    lte: new Date()
                },
                periodEnd: {
                    gte: new Date()
                }
            },
            orderBy: {
                periodStart: 'desc'
            }
        });

        if (usageTracking) {
            // Update usage count
            await prisma.usageTracking.update({
                where: { id: usageTracking.id },
                data: {
                    currentUsage: { increment: 1 },
                    lastUpdated: new Date()
                }
            });
        }
    } catch (error) {
        console.error('Error updating usage tracking:', error);
        // Don't throw error here as it shouldn't block the response submission
    }
};

/**
 * Update usage tracking within a transaction
 * This is the preferred method for updating usage within a transaction
 */
export const updateUsageTrackingInTransaction = async (
    tx: any,
    teamId: number,
    subscriptionId: string
): Promise<void> => {
    try {
        await tx.usageTracking.updateMany({
            where: {
                teamId,
                subscriptionId,
                metricType: UsageMetricType.TOTAL_COMPLETED_RESPONSES,
                periodStart: {
                    lte: new Date()
                },
                periodEnd: {
                    gte: new Date()
                }
            },
            data: {
                currentUsage: { increment: 1 },
                lastUpdated: new Date()
            }
        });
    } catch (error) {
        console.error('Error updating usage tracking in transaction:', error);
        // Don't throw error here as it shouldn't block the response submission
    }
};

/**
 * Increment active surveys count in usage tracking within a transaction
 * Call this when a survey is published
 */
export const incrementActiveSurveysInTransaction = async (
    tx: any,
    teamId: number,
    subscriptionId: string
): Promise<void> => {
    try {
        const now = new Date();

        // Check if usage tracking record exists for current period
        const existingTracking = await tx.usageTracking.findFirst({
            where: {
                teamId,
                subscriptionId,
                metricType: UsageMetricType.ACTIVE_SURVEYS,
                periodStart: {
                    lte: now
                },
                periodEnd: {
                    gte: now
                }
            }
        });

        if (existingTracking) {
            // Update existing record
            await tx.usageTracking.update({
                where: { id: existingTracking.id },
                data: {
                    currentUsage: { increment: 1 },
                    lastUpdated: now
                }
            });
        } else {
            // Create new tracking record if it doesn't exist
            const subscription = await tx.customerSubscription.findUnique({
                where: { id: subscriptionId },
                include: { plan: true }
            });

            if (subscription) {
                const periodStart = subscription.currentPeriodStart || now;
                const periodEnd = subscription.currentPeriodEnd || getNextPeriodEnd(periodStart, subscription.billingInterval);

                await tx.usageTracking.create({
                    data: {
                        teamId,
                        subscriptionId,
                        metricType: UsageMetricType.ACTIVE_SURVEYS,
                        currentUsage: 1,
                        limitValue: subscription.plan.maxActiveSurveys,
                        periodStart,
                        periodEnd,
                        lastUpdated: now
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error incrementing active surveys in transaction:', error);
        // Don't throw error here as it shouldn't block the survey operation
    }
};

/**
 * Decrement active surveys count in usage tracking within a transaction
 * Call this when a published survey goes to draft or archived
 */
export const decrementActiveSurveysInTransaction = async (
    tx: any,
    teamId: number,
    subscriptionId: string
): Promise<void> => {
    try {
        const now = new Date();

        // Check if usage tracking record exists for current period
        const existingTracking = await tx.usageTracking.findFirst({
            where: {
                teamId,
                subscriptionId,
                metricType: UsageMetricType.ACTIVE_SURVEYS,
                periodStart: {
                    lte: now
                },
                periodEnd: {
                    gte: now
                }
            }
        });

        if (existingTracking) {
            // Update existing record - only decrement if currentUsage > 0
            if (existingTracking.currentUsage > 0) {
                await tx.usageTracking.update({
                    where: { id: existingTracking.id },
                    data: {
                        currentUsage: { decrement: 1 },
                        lastUpdated: now
                    }
                });
            }
        } else {
            // Create new tracking record if it doesn't exist
            // Initialize with 0 since we're decrementing (shouldn't go negative)
            const subscription = await tx.customerSubscription.findUnique({
                where: { id: subscriptionId },
                include: { plan: true }
            });

            if (subscription) {
                const periodStart = subscription.currentPeriodStart || now;
                const periodEnd = subscription.currentPeriodEnd || getNextPeriodEnd(periodStart, subscription.billingInterval);

                await tx.usageTracking.create({
                    data: {
                        teamId,
                        subscriptionId,
                        metricType: UsageMetricType.ACTIVE_SURVEYS,
                        currentUsage: 0,
                        limitValue: subscription.plan.maxActiveSurveys,
                        periodStart,
                        periodEnd,
                        lastUpdated: now
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error decrementing active surveys in transaction:', error);
        // Don't throw error here as it shouldn't block the survey operation
    }
};

/**
 * Get current usage for a team and metric type
 */
export const getCurrentUsage = async (teamId: number, metricType: UsageMetricType): Promise<{
    currentUsage: number;
    limit: number;
    remaining: number;
    percentageUsed: number;
    isOverLimit: boolean;
}> => {
    const usageTracking = await prisma.usageTracking.findFirst({
        where: {
            teamId,
            metricType,
            periodStart: {
                lte: new Date()
            },
            periodEnd: {
                gte: new Date()
            }
        },
        orderBy: {
            periodStart: 'desc'
        }
    });

    if (!usageTracking) {
        return {
            currentUsage: 0,
            limit: 0,
            remaining: 0,
            percentageUsed: 0,
            isOverLimit: true
        };
    }

    const currentUsage = usageTracking.currentUsage;
    const limit = usageTracking.limitValue;
    const remaining = Math.max(0, limit - currentUsage);
    const percentageUsed = limit > 0 ? (currentUsage / limit) * 100 : 0;
    const isOverLimit = currentUsage >= limit;

    return {
        currentUsage,
        limit,
        remaining,
        percentageUsed,
        isOverLimit
    };
};

/**
 * Create new usage tracking record for a team
 */
export const createUsageTrackingRecord = async (data: {
    teamId: number;
    subscriptionId: string;
    metricType: UsageMetricType;
    limitValue: number;
    periodStart: Date;
    periodEnd: Date;
}): Promise<void> => {
    await prisma.usageTracking.create({
        data: {
            teamId: data.teamId,
            subscriptionId: data.subscriptionId,
            metricType: data.metricType,
            currentUsage: 0,
            limitValue: data.limitValue,
            periodStart: data.periodStart,
            periodEnd: data.periodEnd
        }
    });
};

/**
 * Reset usage tracking for a new billing period
 */
export const resetUsageForNewPeriod = async (subscriptionId: string): Promise<void> => {
    const subscription = await prisma.customerSubscription.findUnique({
        where: { id: subscriptionId },
        include: { plan: true }
    });

    if (!subscription) {
        throw new Error('Subscription not found');
    }

    const newPeriodStart = subscription.currentPeriodStart || new Date();
    const newPeriodEnd = subscription.currentPeriodEnd || getNextPeriodEnd(newPeriodStart, subscription.billingInterval);

    // Create new tracking records for the new period
    const metricTypes = [UsageMetricType.ACTIVE_SURVEYS, UsageMetricType.TOTAL_COMPLETED_RESPONSES];

    const trackingRecords = metricTypes.map(metricType => ({
        teamId: subscription.teamId,
        subscriptionId: subscription.id,
        metricType,
        currentUsage: 0,
        limitValue: getLimitForMetric(subscription.plan, metricType),
        periodStart: newPeriodStart,
        periodEnd: newPeriodEnd
    }));

    await prisma.usageTracking.createMany({
        data: trackingRecords
    });
};

/**
 * Get usage report for current period
 */
export const getCurrentPeriodUsageReport = async (teamId: number) => {
    const subscription = await prisma.customerSubscription.findFirst({
        where: { teamId },
        include: {
            plan: true,
            usageTracking: {
                where: {
                    periodStart: {
                        gte: new Date() // This will be fixed after migration
                    }
                }
            }
        }
    });

    if (!subscription) {
        throw new Error('No subscription found for team');
    }

    const metricTypes = [UsageMetricType.ACTIVE_SURVEYS, UsageMetricType.TOTAL_COMPLETED_RESPONSES];

    const report = metricTypes.map(metricType => {
        const tracking = subscription.usageTracking.find(t => t.metricType === metricType);
        const currentUsage = tracking?.currentUsage || 0;
        const limit = getLimitForMetric(subscription.plan, metricType);
        const percentageUsed = limit > 0 ? (currentUsage / limit) * 100 : 0;

        return {
            metricType,
            limit,
            currentUsage,
            remaining: Math.max(0, limit - currentUsage),
            percentageUsed,
            isOverLimit: currentUsage >= limit,
            periodStart: tracking?.periodStart,
            periodEnd: tracking?.periodEnd
        };
    });

    return {
        teamId,
        planType: subscription.plan.planType,
        status: subscription.status,
        currentPeriod: {
            start: subscription.currentPeriodStart,
            end: subscription.currentPeriodEnd
        },
        usage: report
    };
};

/**
 * Clean up old usage tracking records (keep last 12 months)
 */
export const cleanupOldUsageRecords = async (): Promise<void> => {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - 12);

    await prisma.usageTracking.deleteMany({
        where: {
            periodStart: {
                lt: cutoffDate
            }
        }
    });
};

/**
 * Get teams approaching their limits in current period
 */
export const getTeamsApproachingLimits = async (thresholdPercentage: number = 80) => {
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const trackingRecords = await prisma.usageTracking.findMany({
        where: {
            periodStart: {
                gte: oneMonthAgo
            },
            subscription: {
                status: {
                    in: ['active', 'trialing']
                }
            }
        },
        include: {
            team: true,
            subscription: {
                include: {
                    plan: true
                }
            }
        }
    });

    return trackingRecords
        .filter((record: any) => {
            const percentageUsed = (record.currentUsage / record.limitValue) * 100;
            return percentageUsed >= thresholdPercentage;
        })
        .map((record: any) => ({
            teamId: record.teamId,
            teamName: record.team.name,
            metricType: record.metricType,
            currentUsage: record.currentUsage,
            limit: record.limitValue,
            percentageUsed: (record.currentUsage / record.limitValue) * 100,
            planType: record.subscription.plan.planType,
            periodStart: record.periodStart,
            periodEnd: record.periodEnd
        }));
};

// Helper functions

/**
 * Get next period end date based on billing interval
 */
const getNextPeriodEnd = (periodStart: Date, billingInterval: string): Date => {
    const end = new Date(periodStart);

    if (billingInterval === 'monthly') {
        end.setMonth(end.getMonth() + 1);
    } else {
        end.setFullYear(end.getFullYear() + 1);
    }

    return end;
};

/**
 * Get limit for a specific metric type from plan
 */
const getLimitForMetric = (plan: any, metricType: UsageMetricType): number => {
    switch (metricType) {
        case UsageMetricType.ACTIVE_SURVEYS:
            return plan.maxActiveSurveys;
        case UsageMetricType.TOTAL_COMPLETED_RESPONSES:
            return plan.maxResponses;
        default:
            return 0;
    }
};
