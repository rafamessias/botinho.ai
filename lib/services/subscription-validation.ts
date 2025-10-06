import { prisma } from '@/prisma/lib/prisma';
import { SubscriptionStatus, UsageMetricType } from '@/lib/generated/prisma';
import {
    SubscriptionValidationResult,
    SubscriptionData,
    SubscriptionErrorCode,
    SubscriptionStatusCode
} from '@/lib/types/subscription';
import { createCustomerSubscription } from '@/lib/customer-subscription';

/**
 * Cache for subscription and usage data
 */
const subscriptionCache = new Map<string, { data: SubscriptionValidationResult; timestamp: number }>();
const SUBSCRIPTION_CACHE_TTL = 30 * 1000; // 30 seconds cache TTL for subscription data

/**
 * Validation types for different subscription features
 */
export enum ValidationType {
    ACTIVE_SURVEYS = 'ACTIVE_SURVEYS',
    TOTAL_COMPLETED_RESPONSES = 'TOTAL_COMPLETED_RESPONSES',
    REMOVE_BRANDING = 'REMOVE_BRANDING',
    EXPORT_DATA = 'EXPORT_DATA',
    API_ACCESS = 'API_ACCESS',
    PUBLIC_PAGES = 'PUBLIC_PAGES'
}

/**
 * High-performance subscription and usage validation function
 * Validates if a team can receive survey responses based on their subscription limits
 * Uses caching and single query optimization for maximum performance
 */
export const validateSubscriptionAndUsage = async (teamId: number, validationType: ValidationType = ValidationType.TOTAL_COMPLETED_RESPONSES): Promise<SubscriptionValidationResult> => {
    const cacheKey = `subscription-${teamId}-${validationType}`;
    const cached = subscriptionCache.get(cacheKey);

    // Check if cache is valid
    if (cached && Date.now() - cached.timestamp < SUBSCRIPTION_CACHE_TTL) {
        return cached.data;
    }

    try {
        // Single optimized query to get subscription and usage data
        const subscriptionData = await getSubscriptionData(teamId, validationType);

        if (!subscriptionData) {
            // If no subscription found, create a free subscription as fallback
            try {
                const freePlan = await prisma.subscriptionPlan.findFirst({
                    where: {
                        planType: 'FREE',
                        isActive: true
                    }
                });

                if (freePlan) {
                    const subscriptionResult = await createCustomerSubscription({
                        teamId: teamId,
                        planId: freePlan.id,
                        status: SubscriptionStatus.active,
                        cancelAtPeriodEnd: false
                    });

                    if (subscriptionResult.success) {
                        // Retry getting subscription data after creating free subscription
                        const newSubscriptionData = await getSubscriptionData(teamId, validationType);
                        if (newSubscriptionData) {
                            const usageInfo = await getOrCreateUsageTracking(newSubscriptionData, validationType);
                            const result = createValidationResult(newSubscriptionData, usageInfo, validationType);
                            subscriptionCache.set(cacheKey, { data: result, timestamp: Date.now() });
                            return result;
                        }
                    }
                }
            } catch (fallbackError) {
                console.error('Error creating fallback free subscription:', fallbackError);
            }

            return createErrorResult(SubscriptionErrorCode.NO_ACTIVE_SUBSCRIPTION, teamId);
        }

        // Get current usage or create new tracking record if none exists
        const usageInfo = await getOrCreateUsageTracking(subscriptionData, validationType);

        const result = createValidationResult(subscriptionData, usageInfo, validationType);

        // Cache the result
        subscriptionCache.set(cacheKey, { data: result, timestamp: Date.now() });

        return result;

    } catch (error) {
        console.error('Error validating subscription and usage:', error);
        return createErrorResult(SubscriptionErrorCode.VALIDATION_ERROR, teamId, error);
    }
};

/**
 * Map validation type to usage metric type
 */
const getUsageMetricType = (validationType: ValidationType): UsageMetricType | null => {
    switch (validationType) {
        case ValidationType.ACTIVE_SURVEYS:
            return UsageMetricType.ACTIVE_SURVEYS;
        case ValidationType.TOTAL_COMPLETED_RESPONSES:
            return UsageMetricType.TOTAL_COMPLETED_RESPONSES;
        // Boolean features don't use usage tracking
        case ValidationType.REMOVE_BRANDING:
        case ValidationType.EXPORT_DATA:
        case ValidationType.API_ACCESS:
        case ValidationType.PUBLIC_PAGES:
            return null;
        default:
            return UsageMetricType.TOTAL_COMPLETED_RESPONSES;
    }
};

/**
 * Get limit value for validation type
 */
const getLimitValue = (subscriptionData: SubscriptionData, validationType: ValidationType): number => {
    switch (validationType) {
        case ValidationType.ACTIVE_SURVEYS:
            return subscriptionData.plan.maxActiveSurveys;
        case ValidationType.TOTAL_COMPLETED_RESPONSES:
            return subscriptionData.plan.maxCompletedResponses;
        // Boolean features return 1 if allowed, 0 if not
        case ValidationType.REMOVE_BRANDING:
            return subscriptionData.plan.removeBranding ? 1 : 0;
        case ValidationType.EXPORT_DATA:
            return subscriptionData.plan.allowExport ? 1 : 0;
        case ValidationType.API_ACCESS:
            return subscriptionData.plan.allowApiAccess ? 1 : 0;
        case ValidationType.PUBLIC_PAGES:
            return subscriptionData.plan.allowPublicPages ? 1 : 0;
        default:
            return subscriptionData.plan.maxCompletedResponses;
    }
};

/**
 * Get feature name for validation type
 */
const getFeatureName = (validationType: ValidationType): string => {
    switch (validationType) {
        case ValidationType.ACTIVE_SURVEYS:
            return 'active surveys';
        case ValidationType.TOTAL_COMPLETED_RESPONSES:
            return 'completed responses';
        case ValidationType.REMOVE_BRANDING:
            return 'branding removal';
        case ValidationType.EXPORT_DATA:
            return 'data export';
        case ValidationType.API_ACCESS:
            return 'API access';
        case ValidationType.PUBLIC_PAGES:
            return 'public pages';
        default:
            return 'responses';
    }
};

/**
 * Get subscription data with related information
 */
const getSubscriptionData = async (teamId: number, validationType: ValidationType): Promise<SubscriptionData | null> => {
    const subscriptionData = await prisma.customerSubscription.findFirst({
        where: {
            teamId,
            status: {
                in: [SubscriptionStatus.active, SubscriptionStatus.trialing]
            }
        },
        select: {
            id: true,
            teamId: true,
            planId: true,
            status: true,
            billingInterval: true,
            currentPeriodStart: true,
            currentPeriodEnd: true,
            createdAt: true,
            plan: {
                select: {
                    planType: true,
                    maxResponses: true,
                    maxCompletedResponses: true,
                    maxActiveSurveys: true,
                    removeBranding: true,
                    allowApiAccess: true,
                    allowExport: true,
                    allowPublicPages: true
                }
            },
            usageTracking: {
                where: {
                    ...(getUsageMetricType(validationType) ? {
                        metricType: getUsageMetricType(validationType)!
                    } : {}),
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
const getOrCreateUsageTracking = async (subscriptionData: SubscriptionData, validationType: ValidationType) => {
    const metricType = getUsageMetricType(validationType);

    // For boolean features, we don't need usage tracking
    if (!metricType) {
        return {
            currentUsage: 0,
            limitValue: getLimitValue(subscriptionData, validationType),
            periodStart: subscriptionData.currentPeriodStart || subscriptionData.createdAt,
            periodEnd: subscriptionData.currentPeriodEnd || getNextPeriodEnd(subscriptionData.currentPeriodStart || subscriptionData.createdAt, subscriptionData.billingInterval)
        };
    }

    let usageTracking = subscriptionData.usageTracking[0];

    if (!usageTracking) {
        // Create new usage tracking record for current period
        const periodStart = subscriptionData.currentPeriodStart || subscriptionData.createdAt;
        const periodEnd = subscriptionData.currentPeriodEnd || getNextPeriodEnd(periodStart, subscriptionData.billingInterval);
        const limitValue = getLimitValue(subscriptionData, validationType);

        usageTracking = await prisma.usageTracking.create({
            data: {
                teamId: subscriptionData.teamId,
                subscriptionId: subscriptionData.id,
                metricType,
                currentUsage: 0,
                limitValue,
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
const createValidationResult = (subscriptionData: SubscriptionData, usageTracking: any, validationType: ValidationType): SubscriptionValidationResult => {
    const currentUsage = usageTracking.currentUsage;
    const limit = getLimitValue(subscriptionData, validationType);
    const remaining = Math.max(0, limit - currentUsage);
    const percentageUsed = limit > 0 ? (currentUsage / limit) * 100 : 0;

    // For boolean features, check if the feature is allowed
    const isBooleanFeature = [ValidationType.REMOVE_BRANDING, ValidationType.EXPORT_DATA, ValidationType.API_ACCESS, ValidationType.PUBLIC_PAGES].includes(validationType);
    const isOverLimit = isBooleanFeature ? limit === 0 : currentUsage >= limit;

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
        const featureName = getFeatureName(validationType);
        const isBooleanFeature = [ValidationType.REMOVE_BRANDING, ValidationType.EXPORT_DATA, ValidationType.API_ACCESS, ValidationType.PUBLIC_PAGES].includes(validationType);

        result.error = {
            code: SubscriptionErrorCode.USAGE_LIMIT_EXCEEDED,
            message: isBooleanFeature
                ? `${featureName} is not available in your current plan`
                : `Usage limit exceeded for ${featureName}. Current usage: ${currentUsage}/${limit}`,
            details: {
                currentUsage,
                limit,
                remaining,
                percentageUsed: Math.round(percentageUsed),
                planType: subscriptionData.plan.planType,
                periodStart: usageTracking.periodStart,
                periodEnd: usageTracking.periodEnd,
                validationType,
                isBooleanFeature
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
 * Invalidate subscription cache for a specific team and validation type
 */
export const invalidateSubscriptionCache = (teamId: number, validationType?: ValidationType): void => {
    if (validationType) {
        const cacheKey = `subscription-${teamId}-${validationType}`;
        subscriptionCache.delete(cacheKey);
    } else {
        // Invalidate all cache entries for this team
        for (const [key] of subscriptionCache) {
            if (key.startsWith(`subscription-${teamId}-`)) {
                subscriptionCache.delete(key);
            }
        }
    }
};

/**
 * Clear all subscription cache
 */
export const clearSubscriptionCache = (): void => {
    subscriptionCache.clear();
};

/**
 * Convenience functions for specific validation types
 */
export const validateActiveSurveys = async (teamId: number): Promise<SubscriptionValidationResult> => {
    return validateSubscriptionAndUsage(teamId, ValidationType.ACTIVE_SURVEYS);
};

export const validateTotalCompletedResponses = async (teamId: number): Promise<SubscriptionValidationResult> => {
    return validateSubscriptionAndUsage(teamId, ValidationType.TOTAL_COMPLETED_RESPONSES);
};

export const validateRemoveBranding = async (teamId: number): Promise<SubscriptionValidationResult> => {
    return validateSubscriptionAndUsage(teamId, ValidationType.REMOVE_BRANDING);
};

export const validateExportData = async (teamId: number): Promise<SubscriptionValidationResult> => {
    return validateSubscriptionAndUsage(teamId, ValidationType.EXPORT_DATA);
};

export const validateApiAccess = async (teamId: number): Promise<SubscriptionValidationResult> => {
    return validateSubscriptionAndUsage(teamId, ValidationType.API_ACCESS);
};

export const validatePublicPages = async (teamId: number): Promise<SubscriptionValidationResult> => {
    return validateSubscriptionAndUsage(teamId, ValidationType.PUBLIC_PAGES);
};
