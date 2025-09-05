import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const getStripe = () => {
    return stripePromise;
};

export const redirectToCheckout = async (sessionId: string) => {
    const stripe = await getStripe();

    if (!stripe) {
        throw new Error('Stripe failed to initialize');
    }

    const { error } = await stripe.redirectToCheckout({
        sessionId,
    });

    if (error) {
        throw new Error(error.message);
    }
};
