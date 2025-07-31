import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { NextRequest } from 'next/server';
import { auth } from '@/app/auth';

const intlMiddleware = createMiddleware(routing);

// Cache for session results
const sessionCache = new Map<string, any>();
const CACHE_DURATION = 500; // Reduced to 500ms for more responsive auth

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

// Function to clear session cache
function clearSessionCache() {
    sessionCache.clear();
}

// Function to get cache key based on cookies and headers
function getCacheKey(request: NextRequest): string {
    const authCookie = request.cookies.get('next-auth.session-token')?.value ||
        request.cookies.get('__Secure-next-auth.session-token')?.value ||
        request.cookies.get('next-auth.csrf-token')?.value ||
        'no-auth';
    const authHeader = request.headers.get('authorization') || '';
    return `${authCookie}-${authHeader}`;
}

// Main middleware function
export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Early returns for static assets and API routes
    if (pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    // Skip static files - ADD webmanifest to the list
    if (pathname.match(/\.(ico|png|jpg|jpeg|gif|webp|svg|css|js|woff|woff2|ttf|eot|webmanifest|json|xml)$/)) {
        return NextResponse.next();
    }

    // Skip Next.js internal routes
    if (pathname.startsWith('/_next/')) {
        return NextResponse.next();
    }

    // Skip favicon and other browser requests
    if (pathname.includes('favicon') || pathname.includes('.well-known')) {
        return NextResponse.next();
    }

    // Skip PWA and manifest files specifically
    if (pathname.includes('site.webmanifest') ||
        pathname.includes('manifest.json') ||
        pathname.includes('browserconfig.xml') ||
        pathname.includes('robots.txt') ||
        pathname.includes('sitemap.xml')) {
        return NextResponse.next();
    }

    // Check if the pathname already starts with a valid locale
    const hasValidLocale = routing.locales.some(locale => {
        const localePattern = new RegExp(`^/${locale}(/|$)`);
        return localePattern.test(pathname);
    });

    // If the pathname doesn't start with a locale, add the default locale
    if (!hasValidLocale) {
        const defaultLocale = routing.defaultLocale;
        const newUrl = new URL(request.url);
        newUrl.pathname = `/${defaultLocale}${pathname}`;
        return NextResponse.redirect(newUrl);
    }

    // first, let next-intl detect and set request.nextUrl.locale
    const intlResponse = intlMiddleware(request);

    // Clear cache for auth-related paths to ensure fresh session data
    if (pathname.includes('/auth/') || pathname.includes('/sign-in') || pathname.includes('/sign-up')) {
        clearSessionCache();
    }

    // Clear cache if timestamp parameter is present (indicates fresh login)
    const url = new URL(request.url);
    if (url.searchParams.has('_t')) {
        clearSessionCache();
    }

    // Get user from NextAuth with improved caching
    let session;
    const cacheKey = getCacheKey(request);
    const cached = sessionCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        session = cached.session;
    } else {
        try {
            session = await auth();
            sessionCache.set(cacheKey, { session, timestamp: Date.now() });
        } catch (error) {
            console.error('Auth error in middleware:', error);
            session = null;
        }
    }

    const user = session?.user ? { ok: true, user: session.user } : { ok: false, user: null };

    /*
    console.log('Middleware session check:', {
        pathname,
        userOk: user.ok,
        userId: user.user?.id,
        userEmail: user.user?.email,
        hasSession: !!session,
        cacheKey: cacheKey.substring(0, 20) + '...'
    });
    */

    // If user is logged in and trying to access public routes, redirect to home
    if (user.ok) {
        if (isPublicRoute(pathname)) {
            // Extract the current locale from the pathname
            const currentLocale = routing.locales.find(locale =>
                pathname.startsWith(`/${locale}`)
            ) || user.user?.language || routing.defaultLocale;

            const redirectUrl = new URL(`${request.nextUrl.origin}/${currentLocale}`);
            return NextResponse.redirect(redirectUrl);
        }

        // Check if user has company
        const hasCompany = session?.user?.company || false;

        if (!hasCompany && !pathname.includes('/company/create')) {
            // Extract the current locale from the pathname
            const currentLocale = routing.locales.find(locale =>
                pathname.startsWith(`/${locale}`)
            ) || user.user?.language || routing.defaultLocale;

            const redirectUrl = new URL(`${request.nextUrl.origin}/${currentLocale}/company/create`);
            return NextResponse.redirect(redirectUrl);
        }

        if (hasCompany && pathname.includes('/company/create')) {
            // Extract the current locale from the pathname
            const currentLocale = routing.locales.find(locale =>
                pathname.startsWith(`/${locale}`)
            ) || user.user?.language || routing.defaultLocale;

            const redirectUrl = new URL(`${request.nextUrl.origin}/${currentLocale}`);
            return NextResponse.redirect(redirectUrl);
        }
    }

    // If user is not logged in and trying to access protected routes, redirect to sign in
    if (!user.ok && !isPublicRoute(pathname)) {
        // Extract the current locale from the pathname
        const currentLocale = routing.locales.find(locale =>
            pathname.startsWith(`/${locale}`)
        ) || routing.defaultLocale;

        const redirectUrl = new URL(`${request.nextUrl.origin}/${currentLocale}/sign-in?redirect=${pathname}`);
        return NextResponse.redirect(redirectUrl);
    }

    // Otherwise, carry on
    return intlResponse;
}

export const config = {
    matcher: [
        // Only match page routes, not static files or API routes
        '/((?!api|_next/static|_next/image|favicon.ico|site.webmanifest|manifest.json|browserconfig.xml|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot|webmanifest|json|xml)).*)',
        // Handle locale routes specifically
        '/(en|pt-BR)/:path*',
    ],
};