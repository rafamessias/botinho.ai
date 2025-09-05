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

// Plan configurations
export const PLAN_CONFIGS = {
    starter: {
        name: 'Starter',
        description: 'Perfect for individuals and small teams',
        features: [
            'Up to 5 team members',
            '10GB storage',
            'Basic analytics',
            'Email support',
        ],
    },
    professional: {
        name: 'Professional',
        description: 'Ideal for growing businesses',
        features: [
            'Up to 25 team members',
            '100GB storage',
            'Advanced analytics',
            'Priority support',
            'API access',
        ],
    },
    enterprise: {
        name: 'Enterprise',
        description: 'For large organizations',
        features: [
            'Unlimited team members',
            'Unlimited storage',
            'Custom analytics',
            '24/7 phone support',
            'Full API access',
            'Custom integrations',
        ],
    },
};
