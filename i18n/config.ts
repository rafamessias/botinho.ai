import { getRequestConfig } from 'next-intl/server';
import type { GetRequestConfigParams } from 'next-intl/server';

export const locales = ['en', 'pt-BR'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }: GetRequestConfigParams) => {
    if (!locale) throw new Error('Locale is required');

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default
    };
}); 