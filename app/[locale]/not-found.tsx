import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

export default async function NotFound() {
    const t = await getTranslations('error.notFound');

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center space-y-6 p-8">
                <h1 className="text-9xl font-bold text-blue-700">{t('code')}</h1>
                <h2 className="text-3xl font-semibold text-gray-900">{t('title')}</h2>
                <p className="text-gray-600 max-w-md mx-auto">{t('message')}</p>
                <Link href="/" >
                    <Button
                        className="mt-4 py-2 px-4 rounded-md"
                        variant="default"
                    >
                        {t('button')}
                    </Button>
                </Link>
            </div>
        </div>
    );
} 