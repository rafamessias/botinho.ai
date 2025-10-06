import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/auth';
import { stripe, STRIPE_PRICE_IDS } from '@/lib/stripe';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { planId, billingCycle } = await request.json();

        if (!planId || !billingCycle) {
            return NextResponse.json(
                { error: 'Plan ID and billing cycle are required' },
                { status: 400 }
            );
        }

        const priceId = STRIPE_PRICE_IDS[planId as keyof typeof STRIPE_PRICE_IDS]?.[billingCycle as 'monthly' | 'yearly'];

        if (!priceId) {
            return NextResponse.json(
                { error: 'Invalid plan or billing cycle' },
                { status: 400 }
            );
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            customer_email: session.user.email,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription?canceled=true`,
            metadata: {
                userId: session.user.id,
                planId,
                billingCycle,
            },
        });

        return NextResponse.json({
            sessionId: checkoutSession.id,
            url: checkoutSession.url
        });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
