import { routing } from './routing';

/**
 * Strip a locale prefix from a pathname (localePrefix: 'always' — all locales use a prefix).
 */
export function stripLocalePrefix(pathname: string): { locale: string; pathname: string } {
    const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;

    for (const locale of routing.locales) {
        if (normalized === `/${locale}`) {
            return { locale, pathname: '/' };
        }

        if (normalized.startsWith(`/${locale}/`)) {
            return { locale, pathname: normalized.slice(locale.length + 1) || '/' };
        }
    }

    return { locale: routing.defaultLocale, pathname: normalized };
}

/**
 * Build a localized pathname respecting localePrefix: 'always'.
 */
export function localizePathname(pathname: string, locale: string): string {
    const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
    const { pathname: basePath } = stripLocalePrefix(normalized);

    if (basePath === '/') {
        return `/${locale}`;
    }

    return `/${locale}${basePath}`;
}

const PUBLIC_PATHS = new Set([
    '/',
    '/terms',
    '/privacy',
    '/sign-in',
    '/sign-up',
    '/register',
    '/reset-password',
    '/reset-password/new',
    '/sign-up/confirm',
    '/sign-up/check-email',
    '/auth/google/callback',
    '/reset-password/confirm',
    '/sign-up/otp',
    '/auth/error',
]);

export function isPublicPathname(pathname: string): boolean {
    const { pathname: basePath } = stripLocalePrefix(pathname);
    const normalized =
        basePath.endsWith('/') && basePath.length > 1 ? basePath.slice(0, -1) : basePath;

    if (PUBLIC_PATHS.has(normalized)) {
        return true;
    }

    // Public hosted survey pages: /s/{token}
    return normalized.startsWith('/s/');
}
