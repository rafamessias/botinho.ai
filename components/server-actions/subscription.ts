'use server';

import { createCheckoutSession as createStripeCheckoutSession, createPortalSession as createStripePortalSession } from '@/lib/stripe-service';
import { getCustomerSubscription } from '@/lib/customer-subscription';
import { getCurrentPeriodUsageReport } from '@/lib/periodic-usage-tracking';
import { getCurrentTeamId } from '@/lib/prisma-wrapper';
import { PlanType } from '@/lib/generated/prisma';
import { checkBotId } from 'botid/server';

export const createCheckoutSession = async (planId: PlanType, billingCycle: 'monthly' | 'yearly') => {
    try {
        const verification = await checkBotId();

        if (verification.isBot) {
            throw new Error('Access denied');
        }

        const result = await createStripeCheckoutSession({
            planId,
            billingCycle
        });

        if (!result.success) {
            throw new Error(result.error || 'Failed to create checkout session');
        }

        if (!result.url) {
            throw new Error('No checkout URL received');
        }

        // Redirect to Stripe Checkout
        return ({ success: true, checkoutUrl: result.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Internal server error' };
    }
};

export const createPortalSession = async () => {
    try {
        const verification = await checkBotId();

        if (verification.isBot) {
            throw new Error('Access denied');
        }

        const result = await createStripePortalSession();

        if (!result.success) {
            // Return error instead of throwing for better client-side handling
            return {
                success: false,
                error: result.error || 'Failed to create portal session'
            };
        }

        if (!result.url) {
            return {
                success: false,
                error: 'No portal URL received'
            };
        }

        return {
            success: true,
            url: result.url
        };
    } catch (error) {
        console.error('Error creating portal session:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error'
        };
    }
};

export const getSubscriptionStatus = async () => {
    const { auth } = await import('@/app/auth');
    const session = await auth();

    if (!session?.user?.email) {
        return null;
    }

    // In a real app, you would fetch this from your database
    // For now, we'll return mock data
    return {
        plan: 'professional',
        status: 'active',
        billingCycle: 'monthly',
        nextBilling: '2024-02-15',
        cancelAtPeriodEnd: false,
    };
};

export const getSubscriptionData = async () => {
    try {
        const teamId = await getCurrentTeamId();

        if (!teamId) {
            return {
                success: false,
                error: 'No team found for current user',
                data: null
            };
        }

        // Get subscription data
        const subscriptionResult = await getCustomerSubscription({ teamId });

        if (!subscriptionResult.success || !subscriptionResult.data) {
            return {
                success: false,
                error: subscriptionResult.error || 'No subscription found',
                data: null
            };
        }

        // Serialize Decimal fields to numbers for client-side compatibility
        const serializedSubscription = {
            ...subscriptionResult.data,
            plan: subscriptionResult.data.plan ? {
                ...subscriptionResult.data.plan,
                priceMonthly: subscriptionResult.data.plan.priceMonthly ? Number(subscriptionResult.data.plan.priceMonthly) : 0,
                priceYearly: subscriptionResult.data.plan.priceYearly ? Number(subscriptionResult.data.plan.priceYearly) : 0,
            } : null
        };

        // Get usage metrics
        let usageReport = null;
        try {
            usageReport = await getCurrentPeriodUsageReport(teamId);
        } catch (error) {
            console.warn('Failed to get usage report:', error);
            // Continue without usage data
        }

        return {
            success: true,
            data: {
                subscription: serializedSubscription,
                usage: usageReport
            }
        };
    } catch (error) {
        console.error('Error getting subscription data:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            data: null
        };
    }
};

export const checkExportPermission = async () => {
    try {
        const teamId = await getCurrentTeamId();

        if (!teamId) {
            return {
                success: false,
                canExport: false,
                error: 'No team found for current user'
            };
        }

        // Get subscription data
        const subscriptionResult = await getCustomerSubscription({ teamId });

        if (!subscriptionResult.success || !subscriptionResult.data) {
            return {
                success: false,
                canExport: false,
                error: subscriptionResult.error || 'No subscription found'
            };
        }

        const canExport = subscriptionResult.data.plan?.allowExport || false;

        return {
            success: true,
            canExport,
            planType: subscriptionResult.data.plan?.planType || 'FREE'
        };
    } catch (error) {
        console.error('Error checking export permission:', error);
        return {
            success: false,
            canExport: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
};

export const handleCanceledCheckout = async () => {
    try {
        const verification = await checkBotId();

        if (verification.isBot) {
            throw new Error('Access denied');
        }

        const teamId = await getCurrentTeamId();

        if (!teamId) {
            return {
                success: false,
                error: 'No team found for current user',
                converted: false
            };
        }

        // Get current subscription
        const subscriptionResult = await getCustomerSubscription({ teamId });

        if (!subscriptionResult.success || !subscriptionResult.data) {
            return {
                success: false,
                error: subscriptionResult.error || 'No subscription found',
                converted: false
            };
        }

        const currentSubscription = subscriptionResult.data;

        // Check if subscription status is pending
        if (currentSubscription.status !== 'pending') {
            return {
                success: true,
                converted: false,
                message: 'Subscription is not pending'
            };
        }

        // Find the FREE plan
        const { prisma } = await import('@/prisma/lib/prisma');
        const { SubscriptionStatus } = await import('@/lib/generated/prisma');
        const { updateCustomerSubscription } = await import('@/lib/customer-subscription');

        const freePlan = await prisma.subscriptionPlan.findFirst({
            where: {
                planType: PlanType.FREE,
                isActive: true
            }
        });

        if (!freePlan) {
            return {
                success: false,
                error: 'Free plan not found',
                converted: false
            };
        }

        // Update subscription to FREE plan with active status
        const updateResult = await updateCustomerSubscription({
            id: currentSubscription.id,
            planId: freePlan.id,
            status: SubscriptionStatus.active,
            stripeCustomerId: undefined,
            stripeSubscriptionId: undefined,
            currentPeriodStart: undefined,
            currentPeriodEnd: undefined,
            cancelAtPeriodEnd: false
        });

        if (!updateResult.success) {
            return {
                success: false,
                error: updateResult.error || 'Failed to update subscription',
                converted: false
            };
        }

        return {
            success: true,
            converted: true,
            message: 'Subscription converted to FREE plan'
        };
    } catch (error) {
        console.error('Error handling canceled checkout:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            converted: false
        };
    }
};

export const getAvailablePlans = async () => {
    try {
        const { prisma } = await import('@/prisma/lib/prisma');

        const plans = await prisma.subscriptionPlan.findMany({
            where: {
                isActive: true,
                planType: {
                    not: PlanType.FREE
                }
            },
            orderBy: {
                priceMonthly: 'asc'
            }
        });

        // Serialize Decimal fields to numbers for client-side compatibility
        const serializedPlans = plans.map(plan => ({
            ...plan,
            priceMonthly: Number(plan.priceMonthly),
            priceYearly: Number(plan.priceYearly),
        }));

        return {
            success: true,
            plans: serializedPlans
        };
    } catch (error) {
        console.error('Error fetching available plans:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch plans',
            plans: []
        };
    }
};
