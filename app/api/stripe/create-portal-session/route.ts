import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/auth';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // In a real app, you would fetch the customer ID from your database
        // For now, we'll create or retrieve the customer
        const customers = await stripe.customers.list({
            email: session.user.email,
            limit: 1,
        });

        let customer;
        if (customers.data.length > 0) {
            customer = customers.data[0];
        } else {
            customer = await stripe.customers.create({
                email: session.user.email,
                metadata: {
                    userId: session.user.id,
                },
            });
        }

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customer.id,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription`,
        });

        return NextResponse.json({ url: portalSession.url });
    } catch (error) {
        console.error('Error creating portal session:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
