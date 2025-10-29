import { auth } from '@/app/auth';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/prisma/lib/prisma';
import { PlanType, Prisma, SubscriptionStatus } from '@/lib/generated/prisma';

export interface CreateCheckoutSessionParams {
    planId: PlanType;
    billingCycle: 'monthly' | 'yearly';
    userEmail?: string; // Optional - if not provided, will try to get from session
    companyId?: number; // Optional - if not provided, will try to get from user's default company
    customerSubscriptionId?: string; // Optional - if provided, will be included in metadata for webhook updates
}

export interface CreateCheckoutSessionResult {
    success: boolean;
    sessionId?: string;
    url?: string;
    error?: string;
}

export interface CreatePortalSessionResult {
    success: boolean;
    url?: string;
    error?: string;
}

/**
 * Create a Stripe checkout session directly from server-side
 */
export const createCheckoutSession = async (params: CreateCheckoutSessionParams): Promise<CreateCheckoutSessionResult> => {
    try {
        const { planId, billingCycle, userEmail, companyId, customerSubscriptionId } = params;

        // Get user email from params or from session
        let email = userEmail;
        let userCompanyId = companyId;

        if (!email || !userCompanyId) {
            const session = await auth();
            email = email || session?.user?.email;
            userCompanyId = userCompanyId || session?.user?.defaultCompanyId || undefined;
        }

        if (!email) {
            return { success: false, error: 'Unauthorized' };
        }

        if (!userCompanyId) {
            return { success: false, error: 'No company found for user' };
        }

        if (!planId || !billingCycle) {
            return { success: false, error: 'Plan ID and billing cycle are required' };
        }

        const subscriptionPlan = await prisma.subscriptionPlan.findFirst({
            where: {
                planType: planId as PlanType,
                isActive: true
            },
            select: {
                stripePriceIdMonthly: true,
                stripePriceIdYearly: true
            }
        });

        if (!subscriptionPlan || !subscriptionPlan.stripePriceIdMonthly || !subscriptionPlan.stripePriceIdYearly) {
            return { success: false, error: 'Invalid plan or billing cycle' };
        }

        const priceId = billingCycle === 'monthly' ? subscriptionPlan.stripePriceIdMonthly : subscriptionPlan.stripePriceIdYearly;

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';

        const checkoutSession = await stripe.checkout.sessions.create({
            customer_email: email,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${baseUrl}/subscription?success=true`,
            cancel_url: `${baseUrl}/subscription?canceled=true`,
            metadata: {
                userEmail: email,
                companyId: userCompanyId.toString(),
                planId,
                billingInterval: billingCycle,
                ...(customerSubscriptionId && { customerSubscriptionId }),
            },
        });

        console.log('Stripe checkout session created: ', checkoutSession.id);

        return {
            success: true,
            sessionId: checkoutSession.id,
            url: checkoutSession.url || undefined
        };
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error'
        };
    }
};

/**
 * Create a Stripe customer portal session directly from server-side
 */
export const createPortalSession = async (): Promise<CreatePortalSessionResult> => {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return { success: false, error: 'Unauthorized' };
        }

        // Get the user's default team and its subscription to find Stripe customer ID
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                defaultTeamId: true,
            }
        });

        if (!user?.defaultTeamId) {
            return { success: false, error: 'No default team found for user' };
        }

        const team = await prisma.team.findUnique({
            where: { id: user.defaultTeamId },
            include: {
                subscriptions: {
                    where: {
                        status: {
                            in: [SubscriptionStatus.active, SubscriptionStatus.trialing]
                        }
                    },
                    orderBy: {
                        createdAt: Prisma.SortOrder.desc
                    },
                    take: 1
                }
            }
        }) as Prisma.TeamGetPayload<{
            include: { subscriptions: true }
        }> | null;

        const activeSubscription = team?.subscriptions?.[0];

        if (!activeSubscription?.stripeCustomerId) {
            return { success: false, error: 'No Stripe customer found' };
        }

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: activeSubscription.stripeCustomerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription`,
        });

        return {
            success: true,
            url: portalSession.url
        };
    } catch (error) {
        console.error('Error creating portal session:', error);

        // Check if it's a Stripe configuration error
        if (error instanceof Error && error.message.includes('No configuration provided')) {
            return {
                success: false,
                error: 'Customer portal is not configured. Please contact support or set up your billing portal configuration in the Stripe dashboard.'
            };
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error'
        };
    }
};
