import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_CONFIG } from '@/lib/stripe';
import Stripe from 'stripe';
import { PrismaClient, SubscriptionStatus, BillingInterval, UsageMetricType } from '@/lib/generated/prisma';
import { createCustomerSubscription, updateSubscriptionStatus } from '@/lib/customer-subscription';

const prisma = new PrismaClient();

// Helper function to map Stripe subscription status to our enum
function mapStripeStatusToSubscriptionStatus(stripeStatus: string): SubscriptionStatus {
    switch (stripeStatus) {
        case 'active':
            return SubscriptionStatus.active;
        case 'canceled':
            return SubscriptionStatus.canceled;
        case 'past_due':
            return SubscriptionStatus.past_due;
        case 'trialing':
            return SubscriptionStatus.trialing;
        case 'incomplete':
            return SubscriptionStatus.incomplete;
        case 'incomplete_expired':
            return SubscriptionStatus.incomplete_expired;
        case 'unpaid':
            return SubscriptionStatus.unpaid;
        default:
            console.warn(`Unknown Stripe status: ${stripeStatus}, defaulting to active`);
            return SubscriptionStatus.active;
    }
}

// Helper function to determine billing interval from Stripe price ID
function getBillingIntervalFromPriceId(priceId: string, plan: any): BillingInterval {
    if (plan.stripePriceIdMonthly === priceId) {
        return BillingInterval.monthly;
    } else if (plan.stripePriceIdYearly === priceId) {
        return BillingInterval.yearly;
    }
    return BillingInterval.monthly; // default
}

// Helper function to get limit value for a metric type
function getLimitForMetric(plan: any, metricType: UsageMetricType): number {
    switch (metricType) {
        case UsageMetricType.ACTIVE_SURVEYS:
            return plan.maxActiveSurveys;
        case UsageMetricType.TOTAL_COMPLETED_RESPONSES:
            return plan.maxCompletedResponses;
        default:
            return 0;
    }
}

// Helper function to update usage tracking limits for plan changes
async function updateUsageTrackingLimits(subscriptionId: string, newPlan: any): Promise<void> {
    try {
        // Get current usage tracking records
        const currentTracking = await prisma.usageTracking.findMany({
            where: {
                subscriptionId: subscriptionId,
                periodStart: {
                    lte: new Date()
                },
                periodEnd: {
                    gte: new Date()
                }
            }
        });

        // Update limits for each metric type
        for (const tracking of currentTracking) {
            const newLimit = getLimitForMetric(newPlan, tracking.metricType);

            await prisma.usageTracking.update({
                where: { id: tracking.id },
                data: {
                    limitValue: newLimit,
                    lastUpdated: new Date()
                }
            });
        }

        console.log(`Updated usage tracking limits for subscription ${subscriptionId}`);
    } catch (error) {
        console.error('Error updating usage tracking limits:', error);
    }
}

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            STRIPE_CONFIG.webhookSecret
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;

                console.log('Checkout session completed:', session.id);

                if (session.mode === 'subscription' && session.subscription) {
                    try {
                        // Get the full subscription object from Stripe
                        const subscription = await stripe.subscriptions.retrieve(
                            session.subscription as string,
                            { expand: ['items.data.price.product'] }
                        );

                        // Get team ID from metadata
                        const teamId = session.metadata?.teamId;
                        if (!teamId) {
                            console.error('No teamId found in session metadata');
                            break;
                        }

                        // Find the subscription plan by Stripe price ID
                        const priceId = subscription.items.data[0]?.price.id;
                        if (!priceId) {
                            console.error('No price ID found in subscription');
                            break;
                        }

                        const plan = await prisma.subscriptionPlan.findFirst({
                            where: {
                                OR: [
                                    { stripePriceIdMonthly: priceId },
                                    { stripePriceIdYearly: priceId }
                                ]
                            }
                        });

                        if (!plan) {
                            console.error(`No plan found for price ID: ${priceId}`);
                            break;
                        }

                        // Create customer subscription
                        const result = await createCustomerSubscription({
                            teamId: parseInt(teamId),
                            planId: plan.id,
                            stripeCustomerId: session.customer as string,
                            stripeSubscriptionId: subscription.id,
                            currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
                            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
                            trialStart: (subscription as any).trial_start ? new Date((subscription as any).trial_start * 1000) : undefined,
                            trialEnd: (subscription as any).trial_end ? new Date((subscription as any).trial_end * 1000) : undefined,
                            cancelAtPeriodEnd: (subscription as any).cancel_at_period_end || false,
                        });

                        if (result.success) {
                            console.log(`Subscription created successfully for team ${teamId}`);
                        } else {
                            console.error('Failed to create subscription:', result.error);
                        }
                    } catch (error) {
                        console.error('Error processing checkout.session.completed:', error);
                    }
                }

                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;

                console.log('Subscription updated:', subscription.id);

                try {
                    // Find the subscription plan by Stripe price ID
                    const priceId = subscription.items.data[0]?.price.id;
                    if (!priceId) {
                        console.error('No price ID found in subscription update');
                        break;
                    }

                    const plan = await prisma.subscriptionPlan.findFirst({
                        where: {
                            OR: [
                                { stripePriceIdMonthly: priceId },
                                { stripePriceIdYearly: priceId }
                            ]
                        }
                    });

                    if (!plan) {
                        console.error(`No plan found for price ID: ${priceId}`);
                        break;
                    }

                    // Get current subscription to detect plan changes
                    const currentSubscription = await prisma.customerSubscription.findFirst({
                        where: { stripeSubscriptionId: subscription.id },
                        include: { plan: true }
                    });

                    const isPlanChange = currentSubscription && currentSubscription.planId !== plan.id;
                    const isStatusChange = currentSubscription &&
                        currentSubscription.status !== mapStripeStatusToSubscriptionStatus(subscription.status);

                    if (isPlanChange) {
                        console.log(`Plan change detected: ${currentSubscription?.plan.planType} → ${plan.planType} for subscription ${subscription.id}`);
                    }

                    if (isStatusChange) {
                        console.log(`Status change detected: ${currentSubscription?.status} → ${mapStripeStatusToSubscriptionStatus(subscription.status)} for subscription ${subscription.id}`);
                    }

                    // Update subscription status and plan
                    const result = await updateSubscriptionStatus(
                        subscription.id,
                        mapStripeStatusToSubscriptionStatus(subscription.status),
                        new Date((subscription as any).current_period_start * 1000),
                        new Date((subscription as any).current_period_end * 1000)
                    );

                    if (result.success) {
                        // Determine billing interval from the price ID
                        const billingInterval = getBillingIntervalFromPriceId(priceId, plan);

                        // Update the subscription with all required fields
                        await prisma.customerSubscription.updateMany({
                            where: { stripeSubscriptionId: subscription.id },
                            data: {
                                planId: plan.id,
                                billingInterval: billingInterval,
                                currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
                                currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
                                cancelAtPeriodEnd: (subscription as any).cancel_at_period_end
                            }
                        });

                        // Update usage tracking limits if plan changed
                        if (isPlanChange) {
                            await updateUsageTrackingLimits(currentSubscription?.id || '', plan);
                            console.log(`✅ Plan upgrade/downgrade completed: ${plan.planType} (${billingInterval}) for subscription ${subscription.id}`);
                        } else {
                            console.log(`✅ Subscription updated successfully: ${subscription.id}`);
                        }
                    } else {
                        console.error('Failed to update subscription:', result.error);
                    }
                } catch (error) {
                    console.error('Error processing customer.subscription.updated:', error);
                }

                break;
            }

            case 'customer.subscription.created': {
                const subscription = event.data.object as Stripe.Subscription;

                console.log('Subscription created:', subscription.id);

                // This event is a backup for subscription creation
                // The main logic is handled in checkout.session.completed
                // But this ensures we don't miss any subscriptions
                try {
                    const existingSubscription = await prisma.customerSubscription.findFirst({
                        where: { stripeSubscriptionId: subscription.id }
                    });

                    if (!existingSubscription) {
                        console.log(`New subscription detected via webhook: ${subscription.id}`);
                        // You could trigger additional logic here if needed
                        // For example, sending welcome emails, setting up usage tracking, etc.
                    }
                } catch (error) {
                    console.error('Error processing customer.subscription.created:', error);
                }

                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;

                console.log('Subscription deleted:', subscription.id);

                try {
                    // Update subscription status to canceled
                    const result = await updateSubscriptionStatus(
                        subscription.id,
                        SubscriptionStatus.canceled
                    );

                    if (result.success) {
                        console.log(`Subscription canceled successfully: ${subscription.id}`);
                        // Note: Access should be revoked after grace period, not immediately
                    } else {
                        console.error('Failed to cancel subscription:', result.error);
                    }
                } catch (error) {
                    console.error('Error processing customer.subscription.deleted:', error);
                }

                break;
            }

            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as Stripe.Invoice;

                console.log('Payment succeeded:', invoice.id);

                if ((invoice as any).subscription) {
                    try {
                        // Get the subscription to update current period
                        const subscription = await stripe.subscriptions.retrieve(
                            (invoice as any).subscription as string
                        );

                        // Update subscription status to active and current period
                        const result = await updateSubscriptionStatus(
                            subscription.id,
                            SubscriptionStatus.active,
                            new Date((subscription as any).current_period_start * 1000),
                            new Date((subscription as any).current_period_end * 1000)
                        );

                        if (result.success) {
                            console.log(`Payment succeeded, subscription activated: ${subscription.id}`);
                        } else {
                            console.error('Failed to update subscription after payment:', result.error);
                        }
                    } catch (error) {
                        console.error('Error processing invoice.payment_succeeded:', error);
                    }
                }

                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice;

                console.log('Payment failed:', invoice.id);

                if ((invoice as any).subscription) {
                    try {
                        // Update subscription status to past_due
                        const result = await updateSubscriptionStatus(
                            (invoice as any).subscription as string,
                            SubscriptionStatus.past_due
                        );

                        if (result.success) {
                            console.log(`Payment failed, subscription marked as past_due: ${(invoice as any).subscription}`);
                            // Note: Implement grace period logic before suspending access
                        } else {
                            console.error('Failed to update subscription after payment failure:', result.error);
                        }
                    } catch (error) {
                        console.error('Error processing invoice.payment_failed:', error);
                    }
                }

                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        );
    } finally {
        // Ensure Prisma client is properly disconnected
        await prisma.$disconnect();
    }
}
