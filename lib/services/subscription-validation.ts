import { prisma } from '@/prisma/lib/prisma';
import { SubscriptionStatus, UsageMetricType } from '@/lib/generated/prisma';
import {
    SubscriptionValidationResult,
    SubscriptionData,
    SubscriptionErrorCode,
    SubscriptionStatusCode
} from '@/lib/types/subscription';

/**
 * Cache for subscription and usage data
 */
const subscriptionCache = new Map<string, { data: SubscriptionValidationResult; timestamp: number }>();
const SUBSCRIPTION_CACHE_TTL = 30 * 1000; // 30 seconds cache TTL for subscription data

/**
 * High-performance subscription and usage validation function
 * Validates if a team can receive survey responses based on their subscription limits
 * Uses caching and single query optimization for maximum performance
 */
export const validateSubscriptionAndUsage = async (teamId: number): Promise<SubscriptionValidationResult> => {
    const cacheKey = `subscription-${teamId}`;
    const cached = subscriptionCache.get(cacheKey);

    // Check if cache is valid
    if (cached && Date.now() - cached.timestamp < SUBSCRIPTION_CACHE_TTL) {
        return cached.data;
    }

    try {
        // Single optimized query to get subscription and usage data
        const subscriptionData = await getSubscriptionData(teamId);

        if (!subscriptionData) {
            return createErrorResult(SubscriptionErrorCode.NO_ACTIVE_SUBSCRIPTION, teamId);
        }

        // Get current usage or create new tracking record if none exists
        const usageInfo = await getOrCreateUsageTracking(subscriptionData);

        const result = createValidationResult(subscriptionData, usageInfo);

        // Cache the result
        subscriptionCache.set(cacheKey, { data: result, timestamp: Date.now() });

        return result;

    } catch (error) {
        console.error('Error validating subscription and usage:', error);
        return createErrorResult(SubscriptionErrorCode.VALIDATION_ERROR, teamId, error);
    }
};

/**
 * Get subscription data with related information
 */
const getSubscriptionData = async (teamId: number): Promise<SubscriptionData | null> => {
    const subscriptionData = await prisma.customerSubscription.findFirst({
        where: {
            teamId,
            status: {
                in: [SubscriptionStatus.active, SubscriptionStatus.trialing]
            }
        },
        include: {
            plan: {
                select: {
                    planType: true,
                    maxResponses: true,
                    billingInterval: true
                }
            },
            usageTracking: {
                where: {
                    metricType: UsageMetricType.TOTAL_RESPONSES,
                    periodStart: {
                        lte: new Date()
                    },
                    periodEnd: {
                        gte: new Date()
                    }
                },
                orderBy: {
                    periodStart: 'desc'
                },
                take: 1
            }
        }
    });

    return subscriptionData as SubscriptionData | null;
};

/**
 * Get or create usage tracking record for current period
 */
const getOrCreateUsageTracking = async (subscriptionData: SubscriptionData) => {
    let usageTracking = subscriptionData.usageTracking[0];

    if (!usageTracking) {
        // Create new usage tracking record for current period
        const periodStart = subscriptionData.currentPeriodStart || subscriptionData.createdAt;
        const periodEnd = subscriptionData.currentPeriodEnd || getNextPeriodEnd(periodStart, subscriptionData.plan.billingInterval);

        usageTracking = await prisma.usageTracking.create({
            data: {
                teamId: subscriptionData.teamId,
                subscriptionId: subscriptionData.id,
                metricType: UsageMetricType.TOTAL_RESPONSES,
                currentUsage: 0,
                limitValue: subscriptionData.plan.maxResponses,
                periodStart,
                periodEnd
            }
        });
    }

    return usageTracking;
};

/**
 * Create validation result from subscription and usage data
 */
const createValidationResult = (subscriptionData: SubscriptionData, usageTracking: any): SubscriptionValidationResult => {
    const currentUsage = usageTracking.currentUsage;
    const limit = subscriptionData.plan.maxResponses;
    const remaining = Math.max(0, limit - currentUsage);
    const percentageUsed = limit > 0 ? (currentUsage / limit) * 100 : 0;
    const isOverLimit = currentUsage >= limit;

    const result: SubscriptionValidationResult = {
        canProceed: !isOverLimit,
        subscription: {
            id: subscriptionData.id,
            status: subscriptionData.status,
            planType: subscriptionData.plan.planType,
            currentPeriodStart: subscriptionData.currentPeriodStart,
            currentPeriodEnd: subscriptionData.currentPeriodEnd
        },
        usage: {
            currentUsage,
            limit,
            remaining,
            percentageUsed,
            isOverLimit
        }
    };

    // Add error details if over limit
    if (isOverLimit) {
        result.error = {
            code: SubscriptionErrorCode.USAGE_LIMIT_EXCEEDED,
            message: `Usage limit exceeded. Current usage: ${currentUsage}/${limit} responses`,
            details: {
                currentUsage,
                limit,
                remaining,
                percentageUsed: Math.round(percentageUsed),
                planType: subscriptionData.plan.planType,
                periodStart: usageTracking.periodStart,
                periodEnd: usageTracking.periodEnd
            }
        };
    }

    return result;
};

/**
 * Create error result for various error scenarios
 */
const createErrorResult = (
    errorCode: SubscriptionErrorCode,
    teamId: number,
    error?: any
): SubscriptionValidationResult => {
    const errorMessages = {
        [SubscriptionErrorCode.NO_ACTIVE_SUBSCRIPTION]: 'No active subscription found for this team',
        [SubscriptionErrorCode.USAGE_LIMIT_EXCEEDED]: 'Usage limit exceeded',
        [SubscriptionErrorCode.VALIDATION_ERROR]: 'Error validating subscription and usage limits',
        [SubscriptionErrorCode.SUBSCRIPTION_EXPIRED]: 'Subscription has expired',
        [SubscriptionErrorCode.INVALID_PLAN]: 'Invalid subscription plan'
    };

    return {
        canProceed: false,
        subscription: {
            id: '',
            status: SubscriptionStatus.canceled,
            planType: 'NONE',
            currentPeriodStart: null,
            currentPeriodEnd: null
        },
        usage: {
            currentUsage: 0,
            limit: 0,
            remaining: 0,
            percentageUsed: 0,
            isOverLimit: true
        },
        error: {
            code: errorCode,
            message: errorMessages[errorCode],
            details: {
                teamId,
                ...(error && { error: error instanceof Error ? error.message : 'Unknown error' })
            }
        }
    };
};

/**
 * Helper function to get next period end date
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
 * Get HTTP status code for subscription error
 */
export const getStatusCodeForError = (errorCode: SubscriptionErrorCode): number => {
    switch (errorCode) {
        case SubscriptionErrorCode.NO_ACTIVE_SUBSCRIPTION:
        case SubscriptionErrorCode.SUBSCRIPTION_EXPIRED:
        case SubscriptionErrorCode.INVALID_PLAN:
            return SubscriptionStatusCode.FORBIDDEN;
        case SubscriptionErrorCode.USAGE_LIMIT_EXCEEDED:
            return SubscriptionStatusCode.TOO_MANY_REQUESTS;
        case SubscriptionErrorCode.VALIDATION_ERROR:
        default:
            return SubscriptionStatusCode.INTERNAL_SERVER_ERROR;
    }
};

/**
 * Invalidate subscription cache for a specific team
 */
export const invalidateSubscriptionCache = (teamId: number): void => {
    const cacheKey = `subscription-${teamId}`;
    subscriptionCache.delete(cacheKey);
};

/**
 * Clear all subscription cache
 */
export const clearSubscriptionCache = (): void => {
    subscriptionCache.clear();
};
