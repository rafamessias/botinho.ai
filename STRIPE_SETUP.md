# Stripe Integration Setup

This document provides instructions for setting up the Stripe integration in your SaaS framework.

## Prerequisites

1. A Stripe account (sign up at [stripe.com](https://stripe.com))
2. Node.js and npm installed
3. Your Next.js application running

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Stripe Price IDs (create these in your Stripe dashboard)
STRIPE_STARTER_MONTHLY_PRICE_ID=price_starter_monthly_id
STRIPE_STARTER_YEARLY_PRICE_ID=price_starter_yearly_id
STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID=price_professional_monthly_id
STRIPE_PROFESSIONAL_YEARLY_PRICE_ID=price_professional_yearly_id
STRIPE_ENTERPRISE_MONTHLY_PRICE_ID=price_enterprise_monthly_id
STRIPE_ENTERPRISE_YEARLY_PRICE_ID=price_enterprise_yearly_id

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Stripe Dashboard Setup

### 1. Create Products and Prices

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Products** → **Add Product**
3. Create the following products:

#### Starter Plan
- **Name**: Starter
- **Description**: Perfect for individuals and small teams
- **Pricing**: 
  - Monthly: $9/month
  - Yearly: $90/year (save 17%)

#### Professional Plan
- **Name**: Professional
- **Description**: Ideal for growing businesses
- **Pricing**:
  - Monthly: $29/month
  - Yearly: $290/year (save 17%)

#### Enterprise Plan
- **Name**: Enterprise
- **Description**: For large organizations
- **Pricing**:
  - Monthly: $99/month
  - Yearly: $990/year (save 17%)

### 2. Set Up Webhooks

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://yourdomain.com/api/stripe/webhook`
4. Select the following events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret and add it to your environment variables

### 3. Configure Customer Portal

1. Go to **Settings** → **Billing** → **Customer Portal**
2. Enable the customer portal
3. Configure the features you want to allow:
   - Update payment methods
   - Download invoices
   - Cancel subscriptions
   - Update billing information

## Features Implemented

### ✅ Subscription Management
- Create new subscriptions via Stripe Checkout
- Manage existing subscriptions via Stripe Customer Portal
- Handle subscription updates and cancellations

### ✅ Webhook Handling
- Process successful payments
- Handle subscription changes
- Manage failed payments
- Update subscription status

### ✅ User Experience
- Loading states during checkout process
- Success/error notifications
- Mobile-responsive design
- Accessibility features

## API Endpoints

### POST `/api/stripe/create-checkout-session`
Creates a new Stripe Checkout session for subscription.

**Body:**
```json
{
  "planId": "starter|professional|enterprise",
  "billingCycle": "monthly|yearly"
}
```

### POST `/api/stripe/create-portal-session`
Creates a Stripe Customer Portal session for subscription management.

### POST `/api/stripe/webhook`
Handles Stripe webhook events for subscription updates.

## Server Actions

### `createCheckoutSession(planId, billingCycle)`
Initiates a new subscription checkout process.

### `createPortalSession()`
Opens the Stripe Customer Portal for subscription management.

## Testing

### Test Cards
Use these test card numbers in Stripe's test mode:

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0025 0000 3155

### Test Scenarios
1. **Successful Subscription**: Use a valid test card
2. **Failed Payment**: Use a declined test card
3. **Subscription Management**: Test the customer portal
4. **Webhook Events**: Monitor webhook delivery in Stripe dashboard

## Security Considerations

1. **Environment Variables**: Never commit your Stripe secret keys to version control
2. **Webhook Verification**: Always verify webhook signatures
3. **HTTPS**: Use HTTPS in production for webhook endpoints
4. **Rate Limiting**: Consider implementing rate limiting for API endpoints

## Production Deployment

1. Switch to live mode in Stripe dashboard
2. Update environment variables with live keys
3. Update webhook endpoint URL to production domain
4. Test with real payment methods
5. Monitor webhook delivery and error rates

## Troubleshooting

### Common Issues

1. **Webhook Not Receiving Events**
   - Check webhook endpoint URL
   - Verify webhook secret
   - Check server logs for errors

2. **Checkout Session Creation Fails**
   - Verify Stripe keys are correct
   - Check price IDs exist in Stripe
   - Ensure user is authenticated

3. **Customer Portal Not Working**
   - Verify customer exists in Stripe
   - Check customer portal is enabled
   - Ensure proper permissions

### Debug Mode
Enable Stripe's debug mode by adding `?debug=true` to your webhook URL in the Stripe dashboard.

## Support

For additional help:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)
- [Next.js Documentation](https://nextjs.org/docs)
