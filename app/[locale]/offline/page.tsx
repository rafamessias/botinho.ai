'use client';

import { WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function OfflinePage() {
    const handleRetry = () => {
        window.location.reload();
    };
    const t = useTranslations('offline');

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-4">
                <WifiOff className="mx-auto h-16 w-16 text-muted-foreground" />
                <h1 className="text-2xl font-semibold">{t('title')}</h1>
                <p className="text-muted-foreground max-w-md">
                    {t('description')}
                </p>
                <Button
                    onClick={handleRetry}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                    {t('retry')}
                </Button>
            </div>
        </div>
    );
} 