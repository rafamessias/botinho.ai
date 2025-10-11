import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_CONFIG } from '@/lib/stripe';
import Stripe from 'stripe';
import { PrismaClient, SubscriptionStatus, BillingInterval, UsageMetricType, PlanType, SurveyStatus } from '@/lib/generated/prisma';
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
async function updateUsageTrackingLimits(subscriptionId: string, newPlan: any, resetUsage: boolean = false): Promise<void> {
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

            const updateData: any = {
                limitValue: newLimit,
                lastUpdated: new Date()
            };

            // If resetUsage is true, reset currentUsage based on metric type
            if (resetUsage) {
                if (tracking.metricType === UsageMetricType.ACTIVE_SURVEYS) {
                    // Reset active surveys to 0 since all surveys are archived
                    updateData.currentUsage = 0;
                }
                // TOTAL_COMPLETED_RESPONSES keeps its current value as it's cumulative
            }

            await prisma.usageTracking.update({
                where: { id: tracking.id },
                data: updateData
            });
        }

        console.log(`Updated usage tracking limits for subscription ${subscriptionId}${resetUsage ? ' (with usage reset)' : ''}`);
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

                if (session.mode === 'subscription' && session.subscription) {
                    try {
                        // Get the full subscription object from Stripe
                        const subscription = await stripe.subscriptions.retrieve(
                            session.subscription as string,
                            { expand: ['items.data.price.product'] }
                        );

                        // Get team ID and CustomerSubscription ID from metadata
                        const teamId = session.metadata?.teamId;
                        const customerSubscriptionId = session.metadata?.customerSubscriptionId;
                        console.log('Team ID from metadata:', teamId);
                        console.log('CustomerSubscription ID from metadata:', customerSubscriptionId);
                        console.log('All metadata keys:', Object.keys(session.metadata || {}));

                        if (!teamId) {
                            console.error('No teamId found in session metadata');
                            console.error('Available metadata:', session.metadata);
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
                        // Extract period information from subscription items
                        const subscriptionItem = subscription.items.data[0];
                        const currentPeriodStart = subscriptionItem?.current_period_start
                            ? new Date(subscriptionItem.current_period_start * 1000)
                            : undefined;
                        const currentPeriodEnd = subscriptionItem?.current_period_end
                            ? new Date(subscriptionItem.current_period_end * 1000)
                            : undefined;
                        const trialStart = (subscription as any).trial_start
                            ? new Date((subscription as any).trial_start * 1000)
                            : undefined;
                        const trialEnd = (subscription as any).trial_end
                            ? new Date((subscription as any).trial_end * 1000)
                            : undefined;

                        if (customerSubscriptionId) {
                            // Update existing CustomerSubscription
                            console.log(`Updating existing CustomerSubscription: ${customerSubscriptionId}`);

                            const updateResult = await prisma.customerSubscription.update({
                                where: { id: customerSubscriptionId },
                                data: {
                                    planId: plan.id,
                                    status: SubscriptionStatus.active,
                                    stripeCustomerId: session.customer as string,
                                    stripeSubscriptionId: subscription.id,
                                    currentPeriodStart,
                                    currentPeriodEnd,
                                    trialStart,
                                    trialEnd,
                                    cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
                                }
                            });

                            console.log(`CustomerSubscription updated successfully: ${customerSubscriptionId}`);
                        } else {


                            console.log(`Checking for existing FREE plan subscription for team ${teamId}`);

                            const existingFreeSubscription = await prisma.customerSubscription.findFirst({
                                where: {
                                    teamId: parseInt(teamId),
                                    status: {
                                        in: [SubscriptionStatus.active, SubscriptionStatus.trialing]
                                    }
                                },
                                include: {
                                    plan: true,
                                    usageTracking: true
                                }
                            });

                            // If there's an existing FREE subscription, cancel it first
                            // This is required because createCustomerSubscription validates against active subscriptions
                            if (existingFreeSubscription && existingFreeSubscription.plan.planType === PlanType.FREE) {
                                console.log(`Found existing FREE plan subscription: ${existingFreeSubscription.id}. Canceling it before creating new subscription...`);

                                await prisma.customerSubscription.update({
                                    where: { id: existingFreeSubscription.id },
                                    data: {
                                        status: SubscriptionStatus.canceled,
                                        cancelAtPeriodEnd: false
                                    }
                                });

                                console.log(`✅ Canceled FREE plan subscription: ${existingFreeSubscription.id}`);
                            }

                            // Create new CustomerSubscription
                            console.log(`Creating new CustomerSubscription for team ${teamId}`);

                            const result = await createCustomerSubscription({
                                teamId: parseInt(teamId),
                                planId: plan.id,
                                stripeCustomerId: session.customer as string,
                                stripeSubscriptionId: subscription.id,
                                currentPeriodStart,
                                currentPeriodEnd,
                                trialStart,
                                trialEnd,
                                cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
                            });

                            if (result.success) {
                                console.log(`Subscription created successfully for team ${teamId}`);

                                // Migrate usage tracking from FREE subscription to new paid subscription
                                if (existingFreeSubscription && existingFreeSubscription.plan.planType === PlanType.FREE) {
                                    console.log(`Migrating usage tracking from FREE subscription...`);

                                    const newSubscriptionId = result.data?.id;

                                    if (newSubscriptionId) {
                                        const usageTrackingRecords = existingFreeSubscription.usageTracking;

                                        if (usageTrackingRecords && usageTrackingRecords.length > 0) {
                                            console.log(`Migrating ${usageTrackingRecords.length} usage tracking records`);

                                            for (const tracking of usageTrackingRecords) {
                                                const newLimitValue = getLimitForMetric(plan, tracking.metricType);

                                                await prisma.usageTracking.update({
                                                    where: { id: tracking.id },
                                                    data: {
                                                        subscriptionId: newSubscriptionId,
                                                        limitValue: newLimitValue,
                                                        lastUpdated: new Date(),
                                                        periodStart: currentPeriodStart,
                                                        periodEnd: currentPeriodEnd,
                                                    }
                                                });

                                                console.log(`✅ Migrated usage tracking for ${tracking.metricType}: ${tracking.currentUsage}/${newLimitValue}`);
                                            }

                                            console.log(`✅ Usage tracking migrated to new subscription: ${newSubscriptionId}`);
                                        }
                                    }
                                }
                            } else {
                                console.error('Failed to create subscription:', result.error);
                            }
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
                    // Extract period information from subscription items
                    const subscriptionItem = subscription.items.data[0];
                    const currentPeriodStart = subscriptionItem?.current_period_start
                        ? new Date(subscriptionItem.current_period_start * 1000)
                        : undefined;
                    const currentPeriodEnd = subscriptionItem?.current_period_end
                        ? new Date(subscriptionItem.current_period_end * 1000)
                        : undefined;

                    const result = await updateSubscriptionStatus(
                        subscription.id,
                        mapStripeStatusToSubscriptionStatus(subscription.status),
                        currentPeriodStart,
                        currentPeriodEnd
                    );

                    if (result.success) {
                        // Determine billing interval from the price ID
                        const billingInterval = getBillingIntervalFromPriceId(priceId, plan);

                        // Prepare update data
                        const updateData: any = {
                            planId: plan.id,
                            billingInterval: billingInterval,
                            currentPeriodStart: currentPeriodStart,
                            currentPeriodEnd: currentPeriodEnd,
                            cancelAtPeriodEnd: subscription.cancel_at_period_end
                        };

                        // Include cancellation details if available
                        if ((subscription as any).cancellation_details) {
                            const cancellationDetails = (subscription as any).cancellation_details;
                            updateData.cancellationDetails = JSON.stringify({
                                comment: cancellationDetails.comment || null,
                                feedback: cancellationDetails.feedback || null,
                                reason: cancellationDetails.reason || null
                            });
                            console.log(`Cancellation details captured for subscription ${subscription.id}:`, updateData.cancellationDetails);
                        }

                        // Update the subscription with all required fields
                        await prisma.customerSubscription.updateMany({
                            where: { stripeSubscriptionId: subscription.id },
                            data: updateData
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
                    // Find the existing customer subscription
                    const existingSubscription = await prisma.customerSubscription.findFirst({
                        where: { stripeSubscriptionId: subscription.id },
                        include: { team: true }
                    });

                    if (!existingSubscription) {
                        console.error(`No subscription found for Stripe subscription: ${subscription.id}`);
                        break;
                    }

                    const teamId = existingSubscription.teamId;
                    console.log(`Processing cancellation for team ${teamId}`);

                    // 1. Mark the existing subscription as canceled
                    await prisma.customerSubscription.update({
                        where: { id: existingSubscription.id },
                        data: {
                            status: SubscriptionStatus.canceled,
                            cancelAtPeriodEnd: false
                        }
                    });

                    console.log(`✅ Marked subscription as canceled: ${subscription.id}`);

                    // 2. Find all published surveys for this team and archive them
                    const publishedSurveys = await prisma.survey.findMany({
                        where: {
                            teamId: teamId,
                            status: SurveyStatus.published
                        }
                    });

                    if (publishedSurveys.length > 0) {
                        console.log(`Found ${publishedSurveys.length} published surveys to archive`);

                        // Archive all published surveys and update team's total active surveys count in a transaction
                        await prisma.$transaction([
                            prisma.survey.updateMany({
                                where: {
                                    teamId: teamId,
                                    status: SurveyStatus.published
                                },
                                data: {
                                    status: SurveyStatus.archived
                                }
                            }),
                            prisma.team.update({
                                where: { id: teamId },
                                data: {
                                    totalActiveSurveys: 0
                                }
                            })
                        ]);

                        console.log(`✅ Archived ${publishedSurveys.length} published surveys`);
                    }

                    // 3. Find the Free plan
                    const freePlan = await prisma.subscriptionPlan.findFirst({
                        where: {
                            planType: PlanType.FREE,
                            isActive: true
                        }
                    });

                    if (!freePlan) {
                        console.error('Free plan not found!');
                        break;
                    }

                    // 4. Check if team already has an active Free plan subscription
                    const existingFreeSubscription = await prisma.customerSubscription.findFirst({
                        where: {
                            teamId: teamId,
                            status: SubscriptionStatus.active,
                            planId: freePlan.id
                        }
                    });

                    if (!existingFreeSubscription) {
                        // Create a new CustomerSubscription record for the Free plan
                        const freeSubscriptionResult = await createCustomerSubscription({
                            teamId: teamId,
                            planId: freePlan.id,
                            status: SubscriptionStatus.active,
                            cancelAtPeriodEnd: false,
                        });

                        if (freeSubscriptionResult.success) {
                            console.log(`✅ Created new Free plan subscription for team ${teamId}`);

                            // Initialize usage tracking for the new subscription
                            if (freeSubscriptionResult.data?.id) {
                                await updateUsageTrackingLimits(freeSubscriptionResult.data.id, freePlan, true);
                            }
                        } else {
                            console.error('Failed to create free subscription:', freeSubscriptionResult.error);
                        }
                    } else {
                        console.log(`✅ Team ${teamId} already has an active Free plan subscription`);
                    }

                    console.log(`✅ Subscription cancellation completed for team ${teamId}`);
                    console.log(`   - Canceled subscription: ${subscription.id}`);
                    console.log(`   - Archived ${publishedSurveys.length} published surveys`);
                    console.log(`   - Reset active surveys usage to 0`);

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
                        // Extract period information from subscription items
                        const subscriptionItem = subscription.items.data[0];
                        const currentPeriodStart = subscriptionItem?.current_period_start
                            ? new Date(subscriptionItem.current_period_start * 1000)
                            : undefined;
                        const currentPeriodEnd = subscriptionItem?.current_period_end
                            ? new Date(subscriptionItem.current_period_end * 1000)
                            : undefined;

                        const result = await updateSubscriptionStatus(
                            subscription.id,
                            SubscriptionStatus.active,
                            currentPeriodStart,
                            currentPeriodEnd
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
