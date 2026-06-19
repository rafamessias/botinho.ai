import { initBotId } from 'botid/client/core';

/**
 * Vercel Bot Protection Configuration (BotID)
 *
 * Server Actions create dynamic POST endpoints at the page URL where they're called.
 * Locales: en (no URL prefix), pt-BR (/pt-BR prefix)
 *
 * API routes:
 * - /api/auth/[...nextauth] - NextAuth authentication
 * - /api/stripe/webhook - Stripe payment webhook
 */

initBotId({
    protect: [
        {
            path: '/api/stripe/webhook',
            method: 'POST',
        },
        {
            path: '/api/auth/*',
            method: 'POST',
        },
        {
            path: '/api/auth/*',
            method: 'GET',
        },
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
        {
            path: '/sign-up',
            method: 'POST',
        },
        {
            path: '/pt-BR/sign-up',
            method: 'POST',
        },
        {
            path: '/sign-up/otp',
            method: 'POST',
        },
        {
            path: '/pt-BR/sign-up/otp',
            method: 'POST',
        },
        {
            path: '/sign-up/confirm',
            method: 'POST',
        },
        {
            path: '/pt-BR/sign-up/confirm',
            method: 'POST',
        },
        {
            path: '/sign-in',
            method: 'POST',
        },
        {
            path: '/pt-BR/sign-in',
            method: 'POST',
        },
        {
            path: '/reset-password',
            method: 'POST',
        },
        {
            path: '/pt-BR/reset-password',
            method: 'POST',
        },
        {
            path: '/reset-password/confirm',
            method: 'POST',
        },
        {
            path: '/pt-BR/reset-password/confirm',
            method: 'POST',
        },
        {
            path: '/support',
            method: 'POST',
        },
        {
            path: '/pt-BR/support',
            method: 'POST',
        },
        {
            path: '/account',
            method: 'POST',
        },
        {
            path: '/pt-BR/account',
            method: 'POST',
        },
        {
            path: '/settings',
            method: 'POST',
        },
        {
            path: '/pt-BR/settings',
            method: 'POST',
        },
        {
            path: '/subscription',
            method: 'POST',
        },
        {
            path: '/pt-BR/subscription',
            method: 'POST',
        },
        {
            path: '/company',
            method: 'POST',
        },
        {
            path: '/pt-BR/company',
            method: 'POST',
        },
    ],
});
