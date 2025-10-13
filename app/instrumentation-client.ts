import { initBotId } from 'botid/client/core';

/**
 * Vercel Bot Protection Configuration (BotID)
 * 
 * IMPORTANT: This app uses Server Actions for most operations, NOT API routes.
 * 
 * Server Actions in Next.js create dynamic POST endpoints at the page URL where they're called.
 * For example, a form on /en/sign-in that calls a Server Action sends POST to /en/sign-in
 * 
 * Your app has 2 locales: en, pt-BR
 * 
 * Actual API Routes in this app:
 * - /api/auth/[...nextauth] - NextAuth authentication
 * - /api/survey/v0 - Survey data & submission (PUBLIC, most critical)
 * - /api/survey/v0/results - Survey results
 * - /api/stripe/webhook - Stripe payment webhook
 * - /api/cron/monthly-usage-tracking - Cron job
 * 
 * NOTE: In development, BotId shows warnings but doesn't block requests.
 * In production on Vercel, full protection is active.
 */

initBotId({
    protect: [
        // ========================================
        // ACTUAL API ROUTES (Direct Protection)
        // ========================================

        // 🔴 CRITICAL: Survey submission endpoint (PUBLIC - used by widget)
        // This is the most attacked endpoint - prevents automated survey spam
        {
            path: '/api/survey/v0',
            method: 'POST',
        },
        {
            path: '/api/survey/v0',
            method: 'GET',
        },

        // Survey results - prevent data scraping
        {
            path: '/api/survey/v0/results',
            method: 'GET',
        },

        // Stripe webhook - prevent fraudulent payment notifications
        {
            path: '/api/stripe/webhook',
            method: 'POST',
        },

        // NextAuth endpoints - protect OAuth and session handling
        {
            path: '/api/auth/*',
            method: 'POST',
        },
        {
            path: '/api/auth/*',
            method: 'GET',
        },

        // Cron jobs - prevent unauthorized access
        {
            path: '/api/cron/monthly-usage-tracking',
            method: 'GET',
        },

        // ========================================
        // SERVER ACTIONS (Called from Pages)
        // ========================================
        // Next.js Server Actions create POST endpoints at the page URL
        // We protect the pages where forms trigger Server Actions

        // Root and locale root - Server Actions can be called from home
        {
            path: '/',
            method: 'POST',
        },
        {
            path: '/en',
            method: 'POST',
        },
        {
            path: '/pt-BR',
            method: 'POST',
        },

        // 🔴 HIGH PRIORITY: Authentication pages
        // Forms on these pages call Server Actions (signUpAction, signInAction, etc.)

        // Sign-up flow - prevents bot account creation
        {
            path: '/en/sign-up',
            method: 'POST',
        },
        {
            path: '/pt-BR/sign-up',
            method: 'POST',
        },
        {
            path: '/en/sign-up/otp',
            method: 'POST',
        },
        {
            path: '/pt-BR/sign-up/otp',
            method: 'POST',
        },
        {
            path: '/en/sign-up/confirm',
            method: 'POST',
        },
        {
            path: '/pt-BR/sign-up/confirm',
            method: 'POST',
        },

        // Sign-in - prevents credential stuffing
        {
            path: '/en/sign-in',
            method: 'POST',
        },
        {
            path: '/pt-BR/sign-in',
            method: 'POST',
        },

        // Password reset - prevents brute force
        {
            path: '/en/reset-password',
            method: 'POST',
        },
        {
            path: '/pt-BR/reset-password',
            method: 'POST',
        },
        {
            path: '/en/reset-password/confirm',
            method: 'POST',
        },
        {
            path: '/pt-BR/reset-password/confirm',
            method: 'POST',
        },

        // 🔴 HIGH PRIORITY: Contact/Support - prevents spam
        // Calls sendContactEmail Server Action
        {
            path: '/en/support',
            method: 'POST',
        },
        {
            path: '/pt-BR/support',
            method: 'POST',
        },

        // 🟡 MEDIUM PRIORITY: Protected application pages
        // These call various Server Actions for survey/team/user management

        // Survey management
        {
            path: '/en/survey/create',
            method: 'POST',
        },
        {
            path: '/pt-BR/survey/create',
            method: 'POST',
        },
        {
            path: '/en/survey/edit',
            method: 'POST',
        },
        {
            path: '/pt-BR/survey/edit',
            method: 'POST',
        },

        // Account management
        {
            path: '/en/account',
            method: 'POST',
        },
        {
            path: '/pt-BR/account',
            method: 'POST',
        },
        {
            path: '/en/settings',
            method: 'POST',
        },
        {
            path: '/pt-BR/settings',
            method: 'POST',
        },

        // Subscription
        {
            path: '/en/subscription',
            method: 'POST',
        },
        {
            path: '/pt-BR/subscription',
            method: 'POST',
        },

        // Team management
        {
            path: '/en/team',
            method: 'POST',
        },
        {
            path: '/pt-BR/team',
            method: 'POST',
        },
    ],
});

/**
 * PROTECTION SUMMARY:
 * 
 * 🔧 Development Mode: Shows warnings only, doesn't block (this is expected)
 * ✅ Production Mode: Full protection active on Vercel
 * 
 * ✅ API Routes Protected (5 endpoints):
 *    - Survey submission/fetch (MOST CRITICAL - public endpoint)
 *    - Survey results
 *    - Stripe webhook
 *    - NextAuth
 *    - Cron job
 * 
 * ✅ Server Action Pages Protected (per locale: en, pt-BR):
 *    - Root pages (/, /en, /pt-BR)
 *    - Authentication flow (sign-up, sign-in, password reset)
 *    - Contact form
 *    - Survey operations
 *    - Account/settings/subscription/team management
 * 
 * MODE: Managed (challenges shown only when necessary)
 * 
 * The warning "[Dev Only] Without setting the developmentOptions.bypass value, 
 * the bot protection will return HUMAN" is expected behavior in development.
 * All requests pass through in dev mode for easier testing.
 */
