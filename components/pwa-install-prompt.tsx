'use client';

import { useState, useEffect } from 'react';
import { Download, X, Share, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [showIOSPrompt, setShowIOSPrompt] = useState(false);
    const t = useTranslations('pwa.installPrompt');

    useEffect(() => {
        // Detect iOS
        const detectIOS = () => {
            const userAgent = window.navigator.userAgent.toLowerCase();
            const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
            setIsIOS(isIOSDevice);

            //console.log('PWA Debug - User Agent:', userAgent);
            //console.log('PWA Debug - Is iOS:', isIOSDevice);

            // Check if prompt was dismissed in this session
            const hasDismissedInSession = sessionStorage.getItem('pwa-prompt-dismissed');
            const hasShownIOSPrompt = sessionStorage.getItem('ios-pwa-prompt-shown');

            //console.log('PWA Debug - Has dismissed in session:', !!hasDismissedInSession);
            //console.log('PWA Debug - Has shown iOS prompt in session:', !!hasShownIOSPrompt);

            // Show iOS prompt after a delay if user hasn't dismissed it in this session
            if (isIOSDevice && !hasShownIOSPrompt) {
                setTimeout(() => {
                    setShowIOSPrompt(true);
                    console.log('PWA Debug - Showing iOS prompt');
                }, 3000); // Show after 3 seconds
            }
        };

        detectIOS();

        const handler = (e: any) => {
            //console.log('PWA Debug - beforeinstallprompt event fired');

            // Check if prompt was dismissed in this session
            const hasDismissedInSession = sessionStorage.getItem('pwa-prompt-dismissed');
            if (hasDismissedInSession) {
                //console.log('PWA Debug - Prompt dismissed in this session, not showing');
                return;
            }

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
        if (isIOS) {
            // For iOS, show instructions to add to home screen
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'Obraguru',
                        text: 'Add Obraguru to your home screen for quick access',
                        url: window.location.href,
                    });
                } catch (error) {
                    //console.log('Share cancelled or failed');
                }
            }
            // Mark iOS prompt as shown for this session
            sessionStorage.setItem('ios-pwa-prompt-shown', 'true');
            setShowIOSPrompt(false);
        } else if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                //console.log('User accepted the install prompt');
                // Mark as dismissed for this session when user installs
                sessionStorage.setItem('pwa-prompt-dismissed', 'true');
            } else {
                //console.log('User dismissed the install prompt');
                // Mark as dismissed for this session when user dismisses
                sessionStorage.setItem('pwa-prompt-dismissed', 'true');
            }

            setDeferredPrompt(null);
            setShowInstallPrompt(false);
        }
    };

    const handleDismiss = () => {
        setShowInstallPrompt(false);
        setDeferredPrompt(null);
        // Mark as dismissed for this session
        sessionStorage.setItem('pwa-prompt-dismissed', 'true');
        //console.log('PWA Debug - Prompt dismissed by user');
    };

    const handleIOSDismiss = () => {
        setShowIOSPrompt(false);
        // Mark iOS prompt as shown for this session
        sessionStorage.setItem('ios-pwa-prompt-shown', 'true');
        //console.log('PWA Debug - iOS prompt dismissed by user');
    };

    // iOS-specific install prompt
    if (isIOS && showIOSPrompt) {
        return (
            <div className="fixed bottom-4 left-4 right-4">
                <div className="max-w-[680px] mx-auto z-50 bg-background border rounded-lg shadow-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Smartphone className="h-5 w-5 text-primary" />
                            <div>
                                <p className="font-medium">{t('iosTitle')}</p>
                                <p className="text-sm text-muted-foreground">
                                    {t('iosDescription')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                onClick={handleIOSDismiss}
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
            </div>
        );
    }

    // Don't show for iOS devices as they don't support beforeinstallprompt
    if (!showInstallPrompt || isIOS) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4">
            <div className="max-w-[680px] mx-auto z-50 bg-background border rounded-lg shadow-lg p-4">
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
        </div>
    );
} 