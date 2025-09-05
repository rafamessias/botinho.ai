import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_CONFIG } from '@/lib/stripe';
import Stripe from 'stripe';

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

                // Handle successful subscription creation
                console.log('Checkout session completed:', session.id);

                // In a real app, you would:
                // 1. Update user subscription status in your database
                // 2. Send confirmation email
                // 3. Grant access to premium features

                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;

                // Handle subscription updates (plan changes, cancellations, etc.)
                console.log('Subscription updated:', subscription.id);

                // In a real app, you would update the subscription status in your database

                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;

                // Handle subscription cancellation
                console.log('Subscription deleted:', subscription.id);

                // In a real app, you would:
                // 1. Update user subscription status to inactive
                // 2. Revoke access to premium features
                // 3. Send cancellation confirmation email

                break;
            }

            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as Stripe.Invoice;

                // Handle successful payment
                console.log('Payment succeeded:', invoice.id);

                // In a real app, you would:
                // 1. Update subscription status
                // 2. Send payment confirmation email

                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice;

                // Handle failed payment
                console.log('Payment failed:', invoice.id);

                // In a real app, you would:
                // 1. Update subscription status
                // 2. Send payment failure notification
                // 3. Potentially suspend access

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
    }
}
