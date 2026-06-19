import { routing } from './routing';

/**
 * Strip a locale prefix from a pathname (handles as-needed: unprefixed paths are default locale).
 */
export function stripLocalePrefix(pathname: string): { locale: string; pathname: string } {
    const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;

    for (const locale of routing.locales) {
        if (locale === routing.defaultLocale) {
            continue;
        }

        if (normalized === `/${locale}`) {
            return { locale, pathname: '/' };
        }

        if (normalized.startsWith(`/${locale}/`)) {
            return { locale, pathname: normalized.slice(locale.length + 1) || '/' };
        }
    }

    const defaultLocale = routing.defaultLocale;

    if (normalized === `/${defaultLocale}`) {
        return { locale: defaultLocale, pathname: '/' };
    }

    if (normalized.startsWith(`/${defaultLocale}/`)) {
        return { locale: defaultLocale, pathname: normalized.slice(defaultLocale.length + 1) || '/' };
    }

    return { locale: defaultLocale, pathname: normalized };
}

/**
 * Build a localized pathname respecting localePrefix: 'as-needed' (no prefix for default locale).
 */
export function localizePathname(pathname: string, locale: string): string {
    const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
    const { pathname: basePath } = stripLocalePrefix(normalized);

    if (locale === routing.defaultLocale) {
        return basePath;
    }

    if (basePath === '/') {
        return `/${locale}`;
    }

    return `/${locale}${basePath}`;
}

const PUBLIC_PATHS = new Set([
    '/',
    '/sign-in',
    '/sign-up',
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

    return PUBLIC_PATHS.has(normalized);
}
