import { SignInForm } from './sign-in-form';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export default async function SignInPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    return (
        <div className="flex items-center justify-center h-full sm:h-dvh py-12 md:py-0">
            <SignInForm locale={locale} />
        </div>
    );
} 