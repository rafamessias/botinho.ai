import { SubscriptionStatus } from '@/lib/generated/prisma';

/**
 * Interface for subscription validation result
 */
export interface SubscriptionValidationResult {
    canProceed: boolean;
    subscription: {
        id: string;
        status: SubscriptionStatus;
        planType: string;
        currentPeriodStart: Date | null;
        currentPeriodEnd: Date | null;
    };
    usage: {
        currentUsage: number;
        limit: number;
        remaining: number;
        percentageUsed: number;
        isOverLimit: boolean;
    };
    error?: {
        code: string;
        message: string;
        details?: any;
    };
}

/**
 * Interface for subscription data with related information
 */
export interface SubscriptionData {
    id: string;
    status: SubscriptionStatus;
    teamId: number;
    planId: string;
    currentPeriodStart: Date | null;
    currentPeriodEnd: Date | null;
    createdAt: Date;
    plan: {
        planType: string;
        maxResponses: number;
        billingInterval: string;
    };
    usageTracking: Array<{
        id: string;
        currentUsage: number;
        limitValue: number;
        periodStart: Date;
        periodEnd: Date;
    }>;
}

/**
 * Interface for usage tracking update
 */
export interface UsageTrackingUpdate {
    teamId: number;
    subscriptionId: string;
    metricType: string;
    increment?: number;
    newValue?: number;
}

/**
 * Error codes for subscription validation
 */
export enum SubscriptionErrorCode {
    NO_ACTIVE_SUBSCRIPTION = 'NO_ACTIVE_SUBSCRIPTION',
    USAGE_LIMIT_EXCEEDED = 'USAGE_LIMIT_EXCEEDED',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    SUBSCRIPTION_EXPIRED = 'SUBSCRIPTION_EXPIRED',
    INVALID_PLAN = 'INVALID_PLAN'
}

/**
 * HTTP status codes for subscription errors
 */
export enum SubscriptionStatusCode {
    FORBIDDEN = 403,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500
}
