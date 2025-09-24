import createMiddleware from 'next-intl/middleware';
import { NextResponse, NextRequest } from 'next/server';
import { routing } from './i18n/routing';
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
    `/${locale}/sign-up/confirm`,
    `/sign-up/confirm`,
    `/${locale}/sign-up/check-email`,
    `/sign-up/check-email`,
    `/${locale}/auth/google/callback`,
    `/auth/google/callback`,
    `/${locale}/reset-password/confirm`,
    `/reset-password/confirm`,
    `/${locale}/sign-up/otp`,
    `/sign-up/otp`,
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

    // Early returns for requests that don't need auth checking
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

    // first, let next-intl detect and set request.nextUrl.locale
    const intlResponse = intlMiddleware(request);

    const session = await auth();

    const user = session?.user ? { ok: true, user: session.user } : { ok: false, user: null };

    // If user is logged in, handle locale and redirect logic
    if (user.ok) {
        // Extract the user's preferred locale
        const userLocale = user.user?.language || routing.defaultLocale;
        const currentLocale = routing.locales.find(locale => pathname.startsWith(`/${locale}`)) || routing.defaultLocale;

        // If user is trying to access public routes (sign-in, sign-up, etc.), redirect to home with their locale
        if (isPublicRoute(pathname)) {

            const redirectUrl = new URL(`${request.nextUrl.origin}/${userLocale}`);
            return NextResponse.redirect(redirectUrl);
        }

        /*
        // Check if user has company
        const hasCompany = session?.user?.company ? true : false;
 
        if (!hasCompany && !pathname.includes('/company/create')) {
            const redirectUrl = new URL(`${request.nextUrl.origin}/${userLocale}/company/create`);
            return NextResponse.redirect(redirectUrl);
        }
 
        if (hasCompany && pathname.includes('/company/create')) {
            const redirectUrl = new URL(`${request.nextUrl.origin}/${userLocale}`);
            return NextResponse.redirect(redirectUrl);
        }
        */

        // Handle redirect parameter from URL (for general navigation) or OAuth redirect cookie
        const redirectParam = request.nextUrl.searchParams.get("redirect");
        const oauthRedirectCookie = request.cookies.get('oauth_redirect')?.value;

        // Prioritize URL redirect param, then check OAuth cookie
        const finalRedirectParam = redirectParam || oauthRedirectCookie;

        if (finalRedirectParam) {
            // Clear the OAuth redirect cookie if we're using it
            const response = NextResponse.next();
            if (oauthRedirectCookie && !redirectParam) {
                response.cookies.delete('oauth_redirect');
            }
            // Ensure redirect path is safe (starts with "/")
            const safeRedirectPath = finalRedirectParam.startsWith("/") ? finalRedirectParam : `/${finalRedirectParam}`;

            // Check if the redirect path already includes a locale
            const redirectLocale = routing.locales.find(locale =>
                safeRedirectPath.startsWith(`/${locale}`)
            );

            // Build the final redirect path with user's locale
            let finalRedirectPath = safeRedirectPath;
            if (redirectLocale) {
                // Replace the locale in the redirect path with the user's locale if different
                if (redirectLocale !== userLocale) {
                    finalRedirectPath = safeRedirectPath.replace(
                        new RegExp(`^/${redirectLocale}`),
                        `/${userLocale}`
                    );
                }
            } else {
                // Prepend the user's locale if not present
                finalRedirectPath = `/${userLocale}${safeRedirectPath.startsWith("/") ? "" : "/"}${safeRedirectPath.replace(/^\//, "")}`;
            }

            const redirectUrl = new URL(`${request.nextUrl.origin}${finalRedirectPath}`);

            // Clear the OAuth redirect cookie if we used it
            if (oauthRedirectCookie && !redirectParam) {
                redirectUrl.searchParams.delete('oauth_redirect');
                const finalResponse = NextResponse.redirect(redirectUrl);
                finalResponse.cookies.delete('oauth_redirect');
                return finalResponse;
            }

            return NextResponse.redirect(redirectUrl);
        }

        // Always ensure logged-in users are using their preferred locale
        if (currentLocale !== userLocale) {
            // Replace the current locale in the pathname with the user's locale
            const newPathname = pathname.replace(
                new RegExp(`^/${currentLocale}`),
                `/${userLocale}`
            );
            // Preserve any search parameters
            const redirectUrl = new URL(`${request.nextUrl.origin}${newPathname}${request.nextUrl.search}`);
            return NextResponse.redirect(redirectUrl);
        }
    }

    // If user is not logged in and trying to access protected routes (besides /), redirect to sign in
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
        // Match all locale-prefixed routes
        '/(en|pt-BR)/:path*',
        // Match root and all public routes without locale
        '/',
        '/sign-in',
        '/sign-up',
        '/reset-password',
        '/sign-up/confirm',
        '/sign-up/check-email',
        '/auth/google/callback',
        '/reset-password/confirm',
        '/sign-up/otp',
        // Match any other routes that should go through middleware (exclude API routes)
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
    ],
};