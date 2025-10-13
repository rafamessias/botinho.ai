import { prisma } from '@/prisma/lib/prisma';
import { BillingInterval, Prisma, UsageMetricType } from '@/lib/generated/prisma';

type SubscriptionWithPlan = Prisma.CustomerSubscriptionGetPayload<{
    include: { plan: true }
}>;

/**
 * Create monthly usage tracking records for yearly subscriptions
 * This should run daily via cron job
 */
export const createMonthlyUsageTrackingForYearlySubscriptions = async (): Promise<void> => {
    try {
        const now = new Date();

        // Find all active yearly subscriptions
        const yearlySubscriptions: any = await prisma.customerSubscription.findMany({
            where: {
                billingInterval: BillingInterval.yearly,
                status: {
                    in: ['active', 'trialing']
                }
            },
            include: {
                plan: true
            }
        });

        console.log(`Found ${yearlySubscriptions.length} active yearly subscriptions`);

        for (const subscription of yearlySubscriptions) {
            // Check if usage tracking exists for current month
            const existingTracking = await prisma.usageTracking.findFirst({
                where: {
                    subscriptionId: subscription.id,
                    periodStart: {
                        lte: now
                    },
                    periodEnd: {
                        gte: now
                    }
                }
            });

            if (!existingTracking) {
                // Calculate monthly period within the yearly subscription
                const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

                // Ensure we don't exceed the subscription's period
                const periodStart = subscription.currentPeriodStart && monthStart < subscription.currentPeriodStart
                    ? subscription.currentPeriodStart
                    : monthStart;

                const periodEnd = subscription.currentPeriodEnd && monthEnd > subscription.currentPeriodEnd
                    ? subscription.currentPeriodEnd
                    : monthEnd;

                // Create usage tracking records for each metric type
                const metricTypes = [
                    UsageMetricType.ACTIVE_SURVEYS,
                    UsageMetricType.TOTAL_COMPLETED_RESPONSES
                ];

                for (const metricType of metricTypes) {
                    const limitValue = getLimitForMetric(subscription.plan, metricType);

                    // Get last month's usage for cumulative metrics
                    let initialUsage = 0;
                    if (metricType === UsageMetricType.ACTIVE_SURVEYS) {
                        // For active surveys, check current actual count
                        const activeCount = await prisma.survey.count({
                            where: {
                                teamId: subscription.teamId,
                                status: 'published'
                            }
                        });
                        initialUsage = activeCount;
                    }

                    await prisma.usageTracking.create({
                        data: {
                            teamId: subscription.teamId,
                            subscriptionId: subscription.id,
                            metricType,
                            currentUsage: initialUsage,
                            limitValue,
                            periodStart,
                            periodEnd,
                            lastUpdated: now
                        }
                    });

                    console.log(`Created ${metricType} tracking for subscription ${subscription.id} (${periodStart.toISOString()} - ${periodEnd.toISOString()})`);
                }
            }
        }

        console.log('✅ Monthly usage tracking creation completed');
    } catch (error) {
        console.error('Error creating monthly usage tracking:', error);
        throw error;
    }
};

/**
 * Get limit for a specific metric type from plan
 */
const getLimitForMetric = (plan: any, metricType: UsageMetricType): number => {
    switch (metricType) {
        case UsageMetricType.ACTIVE_SURVEYS:
            return plan.maxActiveSurveys;
        case UsageMetricType.TOTAL_COMPLETED_RESPONSES:
            return plan.maxResponses || plan.maxCompletedResponses;
        default:
            return 0;
    }
};