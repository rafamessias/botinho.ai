import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';
import enLegal from '@/i18n/messages/legal/en.json';
import ptBRLegal from '@/i18n/messages/legal/pt-BR.json';

const legalMessagesByLocale = {
    en: enLegal,
    'pt-BR': ptBRLegal,
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested)
        ? requested
        : routing.defaultLocale;

    const baseMessages = (await import(`@/i18n/messages/${locale}.json`)).default;

    return {
        locale,
        messages: {
            ...baseMessages,
            Legal: legalMessagesByLocale[locale],
        },
    };
});