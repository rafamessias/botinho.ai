import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function NotFound() {
    const t = useTranslations('error');

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <div className="text-center space-y-6 px-4">
                <h1 className="text-6xl font-bold text-primary">{t('notFound.code')}</h1>
                <h2 className="text-2xl font-semibold text-foreground">{t('notFound.title')}</h2>
                <p className="text-muted-foreground max-w-md">
                    {t('notFound.message')}
                </p>
                <div className="flex gap-4 justify-center">
                    <Button asChild>
                        <Link href="/dashboard">
                            {t('notFound.button')}
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
} 