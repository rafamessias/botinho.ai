import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-08-27.basil',
    typescript: true,
});

export const STRIPE_CONFIG = {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
};

// Stripe price IDs for different plans
export const STRIPE_PRICE_IDS = {
    starter: {
        monthly: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID || '',
        yearly: process.env.STRIPE_STARTER_YEARLY_PRICE_ID || '',
    },
    professional: {
        monthly: process.env.STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID || '',
        yearly: process.env.STRIPE_PROFESSIONAL_YEARLY_PRICE_ID || '',
    },
    enterprise: {
        monthly: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID || '',
        yearly: process.env.STRIPE_ENTERPRISE_YEARLY_PRICE_ID || '',
    },
};