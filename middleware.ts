import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { NextRequest } from 'next/server';
import { auth } from '@/app/auth';

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
    `/${locale}/auth/google/callback`,
    `/auth/google/callback`,
]);

function isPublicRoute(path: string) {
    return publicRoutes.some(publicRoute =>
        path === publicRoute ||
        path === publicRoute + '/'
    );
}

// Main middleware function
export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Handle API routes separately
    if (pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    // If the pathname doesn't start with a locale, add the default locale
    if (!routing.locales.some(locale => pathname.startsWith(`/${locale}`))) {
        console.log("pathname", pathname);
        const defaultLocale = routing.defaultLocale;
        const newUrl = new URL(request.url);
        newUrl.pathname = `/${defaultLocale}${pathname}`;
        return NextResponse.redirect(newUrl);
    }

    // first, let next-intl detect and set request.nextUrl.locale
    const intlResponse = intlMiddleware(request);

    // Get user from NextAuth
    const session = await auth();
    const user = session ? { ok: true, data: session.user } : { ok: false, data: null };

    // If user is logged in and trying to access public routes, redirect to home
    if (user.ok) {
        if (isPublicRoute(pathname)) {
            console.log('User is logged in and trying to access public routes, redirecting to home');
            const redirectUrl = new URL(`${request.nextUrl.origin}/${routing.defaultLocale}`);
            console.log('Redirecting to:', redirectUrl.toString());
            return NextResponse.redirect(redirectUrl);
        }

        // Check if user has company
        const hasCompany = session?.user?.company || false;

        if (!hasCompany && !pathname.includes('/company/create')) {
            console.log('User is logged in and trying to access protected routes without setup a Company, redirecting to company/create');
            const redirectUrl = new URL(`${request.nextUrl.origin}/${routing.defaultLocale}/company/create`);
            console.log('Redirecting to:', redirectUrl.toString());
            return NextResponse.redirect(redirectUrl);
        }

        if (hasCompany && pathname.includes('/company/create')) {
            console.log('User is logged in and trying to access company/create, redirecting to home');
            const redirectUrl = new URL(`${request.nextUrl.origin}/${routing.defaultLocale}`);
            console.log('Redirecting to:', redirectUrl.toString());
            return NextResponse.redirect(redirectUrl);
        }
    }

    // If user is not logged in and trying to access protected routes, redirect to sign in
    if (!user.ok && !isPublicRoute(pathname)) {
        console.log('User is not logged in and trying to access protected routes, redirecting to sign in');
        const redirectUrl = new URL(`${request.nextUrl.origin}/${routing.defaultLocale}/sign-in?redirect=${pathname}`);
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