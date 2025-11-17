import createMiddleware from 'next-intl/middleware';
import { NextResponse, NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Only allow access to landing page and related routes
const allowedRoutes = routing.locales.flatMap(locale => [
    `/${locale}/landing`,
    `/${locale}/landing/`,
    `/landing`,
    `/landing/`,
]);

function isAllowedRoute(path: string): boolean {
    return allowedRoutes.some(allowedRoute =>
        path === allowedRoute ||
        path === allowedRoute + '/' ||
        path.startsWith(allowedRoute + '#')
    );
}

// Main middleware function
export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow static files, API routes, and Next.js internals
    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next/') ||
        pathname.includes('favicon') ||
        pathname.includes('.well-known') ||
        pathname.includes('site.webmanifest') ||
        pathname.includes('manifest.json') ||
        pathname.includes('browserconfig.xml') ||
        pathname.includes('robots.txt') ||
        pathname.includes('sitemap.xml') ||
        pathname.match(/\.(ico|png|jpg|jpeg|gif|webp|svg|css|js|woff|woff2|ttf|eot|webmanifest|json|xml)(\?.*)?$/) ||
        pathname === '/favicon.ico'
    ) {
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

    // Run intl middleware first
    const intlResponse = intlMiddleware(request);

    // Check if the route is allowed (landing page only)
    if (!isAllowedRoute(pathname)) {
        // Redirect to landing page
        const currentLocale = routing.locales.find(locale =>
            pathname.startsWith(`/${locale}`)
        ) || routing.defaultLocale;
        
        const redirectUrl = new URL(`${request.nextUrl.origin}/${currentLocale}/landing`);
        return NextResponse.redirect(redirectUrl);
    }

    // Allow access to landing page
    return intlResponse;
}

export const config = {
    matcher: [
        // Match all locale-prefixed routes
        '/(en|pt-BR)/:path*',
        // Match root and landing routes without locale
        '/',
        '/landing',
        '/landing/',
        // Match any other routes that should go through middleware (exclude API routes)
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
    ],
};

