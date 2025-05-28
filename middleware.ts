import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from "next/server";
import { getUserMeLoader } from '@/components/services/get-user-me-loader';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const publicRoutes = routing.locales.flatMap(locale => [
    `/${locale}/sign-in`,
    `/sign-in`,
    `/${locale}/sign-up`,
    `/sign-up`,
    `/${locale}/reset-password`,
    `/reset-password`,
    `/${locale}/reset-password/new`,
    `/reset-password/new`,
    `/${locale}/sign-up/success`,
    `/sign-up/success`,
    `/${locale}/sign-up/check-email`,
    `/sign-up/check-email`,
]);


function isPublicRoute(path: string) {
    return publicRoutes.some(publicRoute =>
        path === publicRoute ||
        path === publicRoute + '/'
    );
}


export default async function middleware(request: NextRequest) {
    // first, let next-intl detect and set request.nextUrl.locale
    const intlResponse = intlMiddleware(request);
    const { pathname, locale } = request.nextUrl;

    console.log('middleware', pathname, locale);

    // Check auth first
    const user = await getUserMeLoader();

    // If user is logged in and trying to access public routes, redirect to home
    if (user.ok) {
        if (isPublicRoute(pathname)) {
            console.log('User is logged in and trying to access public routes, redirecting to home');
            const redirectUrl = new URL(`${request.nextUrl.origin}/${locale || routing.defaultLocale}`);
            console.log('Redirecting to:', redirectUrl.toString());
            return NextResponse.redirect(redirectUrl);
        }

        if (!user.data.company && !pathname.includes('/company/create')) {
            console.log('User is logged in and trying to access protected routes without setup a Company, redirecting to company/create');
            const redirectUrl = new URL(`${request.nextUrl.origin}/${locale || routing.defaultLocale}/company/create`);
            console.log('Redirecting to:', redirectUrl.toString());
            return NextResponse.redirect(redirectUrl);
        }

        if (user.data.company && pathname.includes('/company/create')) {
            console.log('User is logged in and trying to access company/create, redirecting to home');
            const redirectUrl = new URL(`${request.nextUrl.origin}/${locale || routing.defaultLocale}`);
            console.log('Redirecting to:', redirectUrl.toString());
            return NextResponse.redirect(redirectUrl);
        }
    }

    // If user is not logged in and trying to access protected routes, redirect to sign in
    if (!user.ok && !isPublicRoute(pathname)) {
        console.log('User is not logged in and trying to access protected routes, redirecting to sign in');
        const redirectUrl = new URL(`${request.nextUrl.origin}/${locale || routing.defaultLocale}/sign-in`);
        console.log('Redirecting to:', redirectUrl.toString());
        return NextResponse.redirect(redirectUrl);
    }

    // Otherwise, carry on
    return intlResponse;
}

export const config = {
    matcher: [
        // Skip Next.js internals and all static files
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|robots.txt)).*)',
        // Handle locale routes
        '/(en|pt-BR)/:path*',
    ],
};