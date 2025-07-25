'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);
    const t = useTranslations('pwa.installPrompt');

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        setDeferredPrompt(null);
        setShowInstallPrompt(false);
    };

    const handleDismiss = () => {
        setShowInstallPrompt(false);
        setDeferredPrompt(null);
    };

    if (!showInstallPrompt) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 bg-background border rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Download className="h-5 w-5 text-primary" />
                    <div>
                        <p className="font-medium">{t('title')}</p>
                        <p className="text-sm text-muted-foreground">
                            {t('description')}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button onClick={handleInstallClick} size="sm">
                        {t('installButton')}
                    </Button>
                    <Button
                        onClick={handleDismiss}
                        variant="ghost"
                        size="sm"
                        className="p-1 h-8 w-8"
                        aria-label={t('dismissButton')}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
} 