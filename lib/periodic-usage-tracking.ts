import { PrismaClient, SubscriptionStatus, BillingInterval } from '../lib/generated/prisma';

enum UsageMetricType {
    ACTIVE_SURVEYS = 'ACTIVE_SURVEYS',
    TOTAL_RESPONSES = 'TOTAL_RESPONSES'
}

const prisma = new PrismaClient();

export interface UsageCheckResult {
    canProceed: boolean;
    currentUsage: number;
    limit: number;
    remaining: number;
    percentageUsed: number;
    periodStart: Date;
    periodEnd: Date;
}

export interface ConsumptionData {
    teamId: number;
    metricType: UsageMetricType;
    increment?: number;
    newValue?: number;
}

/**
 * Get or create current period usage tracking record
 */
export async function getCurrentPeriodTracking(
    teamId: number,
    metricType: UsageMetricType
) {
    const subscription = await prisma.customerSubscription.findFirst({
        where: {
            teamId,
            status: {
                in: [SubscriptionStatus.active, SubscriptionStatus.trialing]
            }
        },
        include: {
            plan: true
        }
    });

    if (!subscription) {
        throw new Error('No active subscription found for team');
    }

    const now = new Date();
    const periodStart = subscription.currentPeriodStart || subscription.createdAt;
    const periodEnd = subscription.currentPeriodEnd || getNextPeriodEnd(periodStart, subscription.plan.billingInterval);

    // Try to find existing tracking for current period
    let tracking = await (prisma as any).usageTracking.findFirst({
        where: {
            teamId,
            metricType,
            periodStart: {
                gte: periodStart,
                lt: periodEnd
            }
        }
    });

    // If no tracking exists for current period, create one
    if (!tracking) {
        const limit = getLimitForMetric(subscription.plan, metricType);

        tracking = await (prisma as any).usageTracking.create({
            data: {
                teamId,
                subscriptionId: subscription.id,
                metricType,
                currentUsage: 0,
                limitValue: limit,
                periodStart,
                periodEnd
            }
        });
    }

    return tracking;
}

/**
 * Check if a team can perform an action based on their subscription limits for current period
 */
export async function checkUsageLimit(
    teamId: number,
    metricType: UsageMetricType
): Promise<UsageCheckResult> {
    const tracking = await getCurrentPeriodTracking(teamId, metricType);

    const remaining = Math.max(0, tracking.limitValue - tracking.currentUsage);
    const percentageUsed = tracking.limitValue > 0 ? (tracking.currentUsage / tracking.limitValue) * 100 : 0;

    return {
        canProceed: tracking.currentUsage < tracking.limitValue,
        currentUsage: tracking.currentUsage,
        limit: tracking.limitValue,
        remaining,
        percentageUsed,
        periodStart: tracking.periodStart,
        periodEnd: tracking.periodEnd
    };
}

/**
 * Update usage tracking for a team in current period
 */
export async function updateUsageTracking(data: ConsumptionData): Promise<void> {
    const { teamId, metricType, increment = 1, newValue } = data;

    const tracking = await getCurrentPeriodTracking(teamId, metricType);

    const updatedUsage = newValue !== undefined ? newValue : tracking.currentUsage + increment;

    await (prisma as any).usageTracking.update({
        where: {
            id: tracking.id
        },
        data: {
            currentUsage: updatedUsage,
            lastUpdated: new Date()
        }
    });
}

/**
 * Reset usage tracking for a new billing period
 */
export async function resetUsageForNewPeriod(subscriptionId: string): Promise<void> {
    const subscription = await prisma.customerSubscription.findUnique({
        where: { id: subscriptionId },
        include: { plan: true }
    });

    if (!subscription) {
        throw new Error('Subscription not found');
    }

    const newPeriodStart = subscription.currentPeriodStart || new Date();
    const newPeriodEnd = subscription.currentPeriodEnd || getNextPeriodEnd(newPeriodStart, subscription.plan.billingInterval);

    // Create new tracking records for the new period
    const metricTypes = [UsageMetricType.ACTIVE_SURVEYS, UsageMetricType.TOTAL_RESPONSES];

    const trackingRecords = metricTypes.map(metricType => ({
        teamId: subscription.teamId,
        subscriptionId: subscription.id,
        metricType,
        currentUsage: 0,
        limitValue: getLimitForMetric(subscription.plan, metricType),
        periodStart: newPeriodStart,
        periodEnd: newPeriodEnd
    }));

    await (prisma as any).usageTracking.createMany({
        data: trackingRecords
    });
}

/**
 * Get usage report for current period
 */
export async function getCurrentPeriodUsageReport(teamId: number) {
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

    const metricTypes = [UsageMetricType.ACTIVE_SURVEYS, UsageMetricType.TOTAL_RESPONSES];

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
}

/**
 * Get historical usage data for analytics
 */
export async function getHistoricalUsageReport(teamId: number, months: number = 6) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const usageHistory = await (prisma as any).usageTracking.findMany({
        where: {
            teamId,
            periodStart: {
                gte: startDate
            }
        },
        orderBy: {
            periodStart: 'desc'
        }
    });

    // Group by period and metric type
    const groupedHistory = usageHistory.reduce((acc: any, record: any) => {
        const periodKey = `${record.periodStart.toISOString().split('T')[0]}_${record.periodEnd.toISOString().split('T')[0]}`;

        if (!acc[periodKey]) {
            acc[periodKey] = {
                periodStart: record.periodStart,
                periodEnd: record.periodEnd,
                metrics: {}
            };
        }

        acc[periodKey].metrics[record.metricType] = {
            currentUsage: record.currentUsage,
            limit: record.limitValue,
            percentageUsed: record.limitValue > 0 ? (record.currentUsage / record.limitValue) * 100 : 0
        };

        return acc;
    }, {} as Record<string, any>);

    return Object.values(groupedHistory);
}

/**
 * Clean up old usage tracking records (keep last 12 months)
 */
export async function cleanupOldUsageRecords(): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - 12);

    await (prisma as any).usageTracking.deleteMany({
        where: {
            periodStart: {
                lt: cutoffDate
            }
        }
    });
}

/**
 * Get teams approaching their limits in current period
 */
export async function getTeamsApproachingLimits(thresholdPercentage: number = 80) {
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const trackingRecords = await (prisma as any).usageTracking.findMany({
        where: {
            periodStart: {
                gte: oneMonthAgo
            },
            subscription: {
                status: {
                    in: [SubscriptionStatus.active, SubscriptionStatus.trialing]
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
}

// Helper functions

function getNextPeriodEnd(periodStart: Date, billingInterval: BillingInterval): Date {
    const end = new Date(periodStart);

    if (billingInterval === BillingInterval.monthly) {
        end.setMonth(end.getMonth() + 1);
    } else {
        end.setFullYear(end.getFullYear() + 1);
    }

    return end;
}

function getLimitForMetric(plan: any, metricType: UsageMetricType): number {
    switch (metricType) {
        case UsageMetricType.ACTIVE_SURVEYS:
            return plan.maxActiveSurveys;
        case UsageMetricType.TOTAL_RESPONSES:
            return plan.maxResponses;
        default:
            return 0;
    }
}

// Convenience functions for common checks

export async function canCreateSurvey(teamId: number): Promise<boolean> {
    const result = await checkUsageLimit(teamId, UsageMetricType.ACTIVE_SURVEYS);
    return result.canProceed;
}

export async function canReceiveResponse(teamId: number): Promise<boolean> {
    const result = await checkUsageLimit(teamId, UsageMetricType.TOTAL_RESPONSES);
    return result.canProceed;
}
