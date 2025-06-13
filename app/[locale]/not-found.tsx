'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/shared/button';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
    const t = useTranslations('error.notFound');
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center space-y-6 p-8">
                <h1 className="text-9xl font-bold text-blue-700">{t('code')}</h1>
                <h2 className="text-3xl font-semibold text-gray-900">{t('title')}</h2>
                <p className="text-gray-600 max-w-md mx-auto">{t('message')}</p>
                <Link href="/" >
                    <Button
                        className="mt-4 py-2 px-4 rounded-md"
                        variant="primary"
                    >
                        {t('button')}
                    </Button>
                </Link>
            </div>
        </div>
    );
} 