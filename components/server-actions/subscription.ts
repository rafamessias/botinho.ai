'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession as createStripeCheckoutSession, createPortalSession as createStripePortalSession } from '@/lib/stripe-service';
import { getCustomerSubscription } from '@/lib/customer-subscription';
import { getCurrentPeriodUsageReport } from '@/lib/periodic-usage-tracking';
import { getCurrentTeamId } from '@/lib/prisma-wrapper';
import { PlanType } from '@/lib/generated/prisma';

export const createCheckoutSession = async (planId: PlanType, billingCycle: 'monthly' | 'yearly') => {
    try {
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
        redirect(result.url);
    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error;
    }
};

export const createPortalSession = async () => {
    try {
        const result = await createStripePortalSession();

        if (!result.success) {
            throw new Error(result.error || 'Failed to create portal session');
        }

        if (!result.url) {
            throw new Error('No portal URL received');
        }

        // Redirect to Stripe Customer Portal
        redirect(result.url);
    } catch (error) {
        console.error('Error creating portal session:', error);
        throw error;
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
