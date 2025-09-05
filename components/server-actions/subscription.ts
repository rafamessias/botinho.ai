'use server';

import { auth } from '@/app/auth';
import { redirect } from 'next/navigation';

export const createCheckoutSession = async (planId: string, billingCycle: 'monthly' | 'yearly') => {
    const session = await auth();

    if (!session?.user?.email) {
        throw new Error('Unauthorized');
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/create-checkout-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                planId,
                billingCycle,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create checkout session');
        }

        const { sessionId } = await response.json();

        // Redirect to Stripe Checkout
        redirect(`https://checkout.stripe.com/c/pay/${sessionId}`);
    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error;
    }
};

export const createPortalSession = async () => {
    const session = await auth();

    if (!session?.user?.email) {
        throw new Error('Unauthorized');
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/create-portal-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create portal session');
        }

        const { url } = await response.json();

        // Redirect to Stripe Customer Portal
        redirect(url);
    } catch (error) {
        console.error('Error creating portal session:', error);
        throw error;
    }
};

export const getSubscriptionStatus = async () => {
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
