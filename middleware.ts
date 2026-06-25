import createMiddleware from 'next-intl/middleware';
import { NextResponse, NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { isPublicPathname, localizePathname, stripLocalePrefix } from './i18n/pathname';

const intlMiddleware = createMiddleware(routing);

const getSessionToken = (request: NextRequest) =>
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value;

const isPasswordResetRoute = (pathname: string) => pathname.includes('/reset-password');

const isServerActionRequest = (request: NextRequest) =>
    request.method === 'POST' &&
    (request.headers.has('Next-Action') || request.headers.has('next-action'));

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (request.headers.get("upgrade")?.toLowerCase() === "websocket") {
        return NextResponse.next();
    }

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

    const intlResponse = intlMiddleware(request);

    // Server actions must receive RSC payloads, not HTML redirects from auth/locale middleware.
    if (isServerActionRequest(request)) {
        return intlResponse;
    }

    if (pathname.includes('/sign-up/confirm')) {
        return intlResponse;
    }

    const sessionToken = getSessionToken(request);
    const isAuthenticated = !!sessionToken;

    const userLanguage = request.cookies.get('user-language')?.value;
    const userLocale = userLanguage ? (userLanguage === 'pt_BR' ? 'pt-BR' : 'en') : routing.defaultLocale;

    const { locale: currentLocale, pathname: basePathname } = stripLocalePrefix(pathname);
    const isPostLoginRoute = basePathname === "/auth/post-login";

    if (isAuthenticated) {
        const redirectParam = request.nextUrl.searchParams.get("redirect");
        const oauthRedirectCookie = request.cookies.get('oauth_redirect')?.value;

        if (isPublicPathname(pathname) && !isPasswordResetRoute(pathname) && basePathname !== '/') {
            const postLoginPath = localizePathname('/auth/post-login', currentLocale);
            const safeRedirect =
                redirectParam?.startsWith('/') && !redirectParam.startsWith('//')
                    ? redirectParam
                    : oauthRedirectCookie?.startsWith('/') && !oauthRedirectCookie.startsWith('//')
                      ? oauthRedirectCookie
                      : null;

            const redirectUrl = new URL(`${request.nextUrl.origin}${postLoginPath}`);
            if (safeRedirect) {
                redirectUrl.searchParams.set('redirect', safeRedirect);
            }
            return NextResponse.redirect(redirectUrl);
        }

        if ((redirectParam || oauthRedirectCookie) && !isPostLoginRoute) {
            const postLoginPath = localizePathname('/auth/post-login', currentLocale);
            const safeRedirect =
                redirectParam?.startsWith('/') && !redirectParam.startsWith('//')
                    ? redirectParam
                    : oauthRedirectCookie?.startsWith('/') && !oauthRedirectCookie.startsWith('//')
                      ? oauthRedirectCookie
                      : null;

            const redirectUrl = new URL(`${request.nextUrl.origin}${postLoginPath}`);
            if (safeRedirect) {
                redirectUrl.searchParams.set('redirect', safeRedirect);
            }
            return NextResponse.redirect(redirectUrl);
        }

        if (currentLocale !== userLocale) {
            const newPathname = localizePathname(pathname, userLocale);
            const redirectUrl = new URL(
                `${request.nextUrl.origin}${newPathname}${request.nextUrl.search}`,
            );
            return NextResponse.redirect(redirectUrl);
        }
    }

    if (!isAuthenticated && !isPublicPathname(pathname)) {
        const isLocaleRoot = basePathname === '/';
        const signInPath = localizePathname('/sign-in', currentLocale);

        const redirectUrl = isLocaleRoot
            ? new URL(`${request.nextUrl.origin}${signInPath}`)
            : new URL(`${request.nextUrl.origin}${signInPath}?redirect=${encodeURIComponent(pathname)}`);

        return NextResponse.redirect(redirectUrl);
    }

    return intlResponse;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
        '/(en|pt-BR)/:path*',
    ],
};
